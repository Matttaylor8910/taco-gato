(function () {
  angular
    .module('taco')
    .factory('firebaseService', firebaseService);

  function firebaseService($rootScope, localStorage, $firebaseArray, settings) {
    var dbRef;

    var tacoEatersRef, tacoEatersCollection;
    var userRef, userTacoEvents;
    var groupsRef, groupsCollection;

    var service = {
      user: localStorage.getObject('user'),
      globalLeaderboard: localStorage.getObject('globalLeaderboard'),
      groupLeaderboard: localStorage.getObject('groupLeaderboard'),

      addUser: addUser,
      editUser: editUser,
      linkUserToFirebaseUser: linkUserToFirebaseUser,
      addTacos: addTacos,
      editTacos: editTacos,
      deleteTacos: deleteTacos,
      getUser: getUser,
      getUserWithFirebaseUserId: getUserWithFirebaseUserId,
      setUser: setUser,
      clearUser: clearUser,
      getGroup: getGroup,
      hasGroup: hasGroup,
      getGroupName: getGroupName,
      createGroup: createGroup,
      editGroup: editGroup,
      deleteGroup: deleteGroup,
      assignUserToGroup: assignUserToGroup,
      unassignUserFromGroup: unassignUserFromGroup,
      setLast30Days: setLast30Days,
      last30Days: settings.last30Days,
      setUpActivityAndLeaderboard: setUpActivityAndLeaderboard,

      // temp migration step
      migrateTacos: migrateTacos
    };

    init();

    return service;

    function migrateTacos() {
      console.log('GROUPS', service.groups);
      console.log('USERS', service.users);
      console.log('EVENTS', _(service.users).map('tacoEvents').flatten().value());
    }

    /**
     * Initialize the firebase objects and collections
     */
    function init() {
      // connect to the taco database
      dbRef = firebase.database();

      // wire up the taco eaters collection
      tacoEatersRef = dbRef.ref('tacoEaters');
      tacoEatersCollection = $firebaseArray(tacoEatersRef);
      tacoEatersRef.on('value', function (snapshot) {
        var eaters = snapshotToArray(snapshot);
        service.users = _.map(eaters, mapUsers);

        // make sure we update the user when there are changes
        // this is necessary to make the group update correctly
        if (service.user) {
          service.user = getUser(service.user.id);
          localStorage.setObject('user', service.user);
        }

        setUpActivityAndLeaderboard();

        $rootScope.$broadcast('firebase.usersUpdated');
      });

      // wire up the groups collection
      groupsRef = dbRef.ref('groups');
      groupsCollection = $firebaseArray(groupsRef);
      groupsRef.on('value', function(snapshot) {
        var groups = snapshotToArray(snapshot);
        service.groups = _.sortBy(groups, 'created').reverse();
        $rootScope.$broadcast('firebase.groupsUpdated');
      });

      // set up the user ref if we can
      addUserRef();
    }

    function setLast30Days(last30Days) {
      service.last30Days = last30Days;
    }

    function setUpActivityAndLeaderboard() {
      service.activity = getActivityFeed(service.users);
      service.globalLeaderboard = getGlobalLeaderBoard(service.users, service.last30Days);
      service.groupLeaderboard = getGroupLeaderBoard(service.users, service.last30Days);
      localStorage.setObject('globalLeaderboard', service.globalLeaderboard);
      localStorage.setObject('groupLeaderboard', service.groupLeaderboard);
      $rootScope.$broadcast('firebase.leaderboardUpdated');
    }

    function filterOutBadUsers(user) {
      return !user.blocked;
    }

    function mapUsers(user) {
      if (service.user && user.id === service.user.id) {
        settings.setProperty('blocked', user.blocked);
      }

      user.tacoEvents = mapTacoEvents(user.tacoEvents, user);
      user.tacosToday = getTacosToday(user.tacoEvents);
      user.tacos = _.sumBy(user.tacoEvents, 'tacos');
      user.tacos30Days = _(user.tacoEvents)
        .filter(function(event) { return event.daysFromToday < 30 })
        .sumBy('tacos');

      return user;
    }

    function mapTacoEvents(events, user) {
      // reverse the order so newest are displayed first
      var tacoEvents = _.reverse(_.map(events));

      // add the moment for date stuff and userName to each event
      _.each(tacoEvents, function (event, index) {
        // date and time stuff
        event.moment = moment.unix(event.time);
        var day = roundDown(event.moment);
        event.timeAmPm = event.moment.format('h:mm a');
        event.daysFromToday = roundDown(moment()).diff(day, 'days');
        event.grouping = getGrouping(day, event.daysFromToday);

        // info about the user and index
        event.index = index;
        event.userName = user.name;
        event.userId = user.id;
      });

      return tacoEvents;
    }

    function getGrouping(day, daysFromToday) {
      // Special cases
      if (daysFromToday === 0) return 'Today';
      if (daysFromToday === 1) return 'Yesterday';
      if (daysFromToday < 7) return day.format('dddd');

      return day.format('MMMM Do, YYYY');
    }

    function roundDown(someMoment) {
      return moment(someMoment.format('MM/DD/YYYY'), 'MM/DD/YYYY');
    }

    function getTacosToday(tacoEvents) {
      return _(tacoEvents)
        .filter(function (event) {
          var day = roundDown(event.moment);
          return roundDown(moment()).diff(day, 'days') === 0 && !event.initial;
        })
        .sumBy('tacos');
    }

    function addUserRef() {
      if (service.user && service.user.id) {
        userRef = dbRef.ref('tacoEaters/' + service.user.id + '/tacoEvents');
        userTacoEvents = $firebaseArray(userRef);
      }
    }

    function addUser(user) {
      user.tacoEvents = [];
      
      if (ionic.Platform) {
        user.device = ionic.Platform.device().uuid;
        if (!user.device) {
          delete user.device;
        }
      }

      // return the promise so we can wait for this add to finish
      return tacoEatersCollection.$add(user)
        .then(function (ref) {
          user.id = ref.key;
          signIn(user);

          // I don't know what tacoEatersRef.trigger is all about
          if (tacoEatersRef.trigger) {
            tacoEatersRef.trigger('value');
          }

          return user;
        })
        .catch(function (reason) {
          console.log(reason);
        });
    }

    function editUser(user) {
      var index = _.findIndex(tacoEatersCollection, {$id: user.id});
      service.user = user;
      localStorage.setObject('user', user);
      tacoEatersCollection[index].name = user.name;
      tacoEatersCollection[index].realName = user.realName;
      tacoEatersCollection.$save(index);
    }

    function linkUserToFirebaseUser(user) {
      var index = _.findIndex(tacoEatersCollection, {$id: user.id});
      service.user = user;
      localStorage.setObject('user', user);
      tacoEatersCollection[index].firebaseUserId = user.firebaseUserId;
      tacoEatersCollection[index].realName = user.realName;
      tacoEatersCollection.$save(index);
    }

    function addTacos(numTacos) {
      return userTacoEvents.$add({
        tacos: numTacos,
        time: moment().unix()
      });
    }

    function editTacos(event, tacos) {
      var index = _.findIndex(userTacoEvents, {time: event.time});
      userTacoEvents[index].tacos = tacos;
      userTacoEvents.$save(index);
    }

    function deleteTacos(event) {
      var index = _.findIndex(userTacoEvents, {time: event.time});
      userTacoEvents.$remove(index);
    }

    function getUser(id) {
      return _.find(service.users, {id: id});
    }

    function getUserWithFirebaseUserId(id) {
      return _.find(service.users, {firebaseUserId: id});
    }

    function setUser(userItem) {
      signIn({
        id: userItem.id,
        name: userItem.name,
        realName: userItem.realName,
        groupId: userItem.groupId,
        tacoEvents: cleanUpTacos(userItem.tacoEvents)
      });
    }

    function signIn(user) {
      service.user = user;
      localStorage.setObject('user', user);
      addUserRef();

      var firebaseUser = getUser(user.id);
      settings.setProperty('blocked', firebaseUser.blocked);

      setUpActivityAndLeaderboard();
    }

    function cleanUpTacos(tacoEvents) {
      return _(tacoEvents)
        .map(function (event) {
          return {
            tacos: event.tacos,
            time: event.time,
            initial: event.initial
          }
        })
    }

    function clearUser() {
      localStorage.setObject('user', {});
      service.user = {};
    }

    function getGroup(groupId) {
      var index = _.findIndex(groupsCollection, {$id: groupId});
      return groupsCollection[index];
    }

    function hasGroup() {
      return service.user && !_(service.user.groupId).isEmpty();
    }

    function getGroupName() {
      if (!hasGroup()) return '';

      var group = getGroup(service.user.groupId);
      if (group) {
        localStorage.set('groupName', group.name);
      }
      return localStorage.get('groupName');
    }

    function createGroup(group, user) {
      return groupsCollection.$add({
        name: group.name,
        creatorId: user.id,
        created: Date.now()
      });
    }

    function editGroup(group) {
      var index = _.findIndex(groupsCollection, {$id: group.id});
      groupsCollection[index].name = group.name;
      groupsCollection[index].members = group.members;
      groupsCollection.$save(index);
    }

    function deleteGroup(group) {
      // Check if user has admin ability
      groupsCollection[index].name = group.name;
      groupsCollection.$save(index);
    }

    function assignUserToGroup(groupId) {
      service.user.groupId = groupId;
      var index = _.findIndex(tacoEatersCollection, {$id: service.user.id});
      localStorage.setObject('user', service.user);
      tacoEatersCollection[index].groupId = service.user.groupId;
      tacoEatersCollection.$save(index);
      $rootScope.$broadcast('firebase.joinedGroup');
    }

    function unassignUserFromGroup() {
      delete service.user.groupId;
      var index = _.findIndex(tacoEatersCollection, {$id: service.user.id});
      localStorage.setObject('user', service.user);
      delete tacoEatersCollection[index].groupId;
      tacoEatersCollection.$save(index);
    }

    function getActivityFeed(users) {
      return _(users)
        .filter(removeTestUsers)
        .filter(filterOutBadUsers)
        .map('tacoEvents')
        .flatten()
        .sortBy('time')
        .reverse()
        .groupBy('grouping')
        .map(function (events, grouping) {
          return {
            grouping: grouping,
            events: events,
            tacos: _.sumBy(events, 'tacos')
          };
        })
        .value();
    }

    function getGlobalLeaderBoard(users, last30Days) {
      var sorted = _(users)
        .filter(removeTestUsers)
        .filter(filterOutBadUsers)
        .sortBy('tacosToday')
        .sortBy(last30Days ? 'tacos30Days' : 'tacos')
        .reverse()
        .value();

      sorted = _.cloneDeep(sorted);

      var fullLeaderboard = createLeaderBoardWithSorted(sorted, last30Days);
      return _.filter(fullLeaderboard, limitGlobalLeaderboard);
    }

    function limitGlobalLeaderboard(user, index) {
      return index < 10 || (service.user && user.id === service.user.id);
    }

    function getGroupLeaderBoard(users, last30Days) {
      var sorted = _(users)
        .filter(removeTestUsers)
        .filter(filterOutBadUsers)
        .filter(filterGroupUsers)
        .sortBy('tacosToday')
        .sortBy(last30Days ? 'tacos30Days' : 'tacos')
        .reverse()
        .value();

      sorted = _.cloneDeep(sorted);

      return createLeaderBoardWithSorted(sorted, last30Days);
    }

    function createLeaderBoardWithSorted(sorted, last30Days) {
      var leaderboard = [];
      var prop = last30Days ? 'tacos30Days' : 'tacos';

      for (var i = 0; i < sorted.length; i++) {
        sorted[i].displayTacos = sorted[i][prop];
        
        if (sorted[i].displayTacos === 0) {
          sorted[i].rank = '-';
        }
        else if (i > 0 && sorted[i - 1][prop] === sorted[i][prop]) {
          sorted[i].rank = sorted[i - 1].rank;
        }
        else {
          sorted[i].rank = i + 1;
        }

        leaderboard.push(sorted[i]);
      }

      return leaderboard;
    }

    function removeTestUsers(user) {
      return user.name && !user.name.toLowerCase().includes('test');
    }

    function filterGroupUsers(user) {
      var groupId = service.user ? service.user.groupId : '';
      if (!groupId) return true;

      return user.groupId === groupId;
    }

    /**
     * Convert a firebase snapshot to an array
     * From: https://ilikekillnerds.com/2017/05/convert-firebase-database-snapshotcollection-array-javascript/
     * @param snapshot
     * @returns {Array}
     */
    function snapshotToArray(snapshot) {
      var returnArr = [];

      snapshot.forEach(function (childSnapshot) {
        var item = childSnapshot.val();
        item.id = childSnapshot.key;
        returnArr.push(item);
      });

      return returnArr;
    }

    /**
     * Convert a firebase snapshot to an Object
     * @param snapshot
     * @returns {Object}
     */
    function snapshotToObject(snapshot) {
      var object = {};

      snapshot.forEach(function (childSnapshot) {
        object[childSnapshot.key] = childSnapshot.val();
      });

      return object;
    }
  }
})();
