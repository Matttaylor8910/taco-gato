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
      unassignUserFromGroup: unassignUserFromGroup
    };

    init();

    return service;

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

      setUpLocationInfo();
    }

    function setUpActivityAndLeaderboard() {
      service.activity = getActivityFeed(service.users);
      service.globalLeaderboard = getGlobalLeaderBoard(service.users);
      service.groupLeaderboard = getGroupLeaderBoard(service.users);
    }

    function filterOutBadUsers(user) {
      return !user.blocked;
    }

    function mapUsers(user) {
      if (user.id === service.user.id) {
        settings.setProperty('blocked', user.blocked);
      }

      user.tacoEvents = mapTacoEvents(user.tacoEvents, user);
      user.tacosToday = getTacosToday(user.tacoEvents);
      user.tacos = _.sumBy(user.tacoEvents, 'tacos');

      return user;
    }

    function mapTacoEvents(events, user) {
      // reverse the order so newest are displayed first
      var tacoEvents = _.reverse(_.map(events));

      // add the moment for date stuff and userName to each event
      _.each(tacoEvents, function (event, index) {
        event.index = index;
        event.moment = moment.unix(event.time);
        event.grouping = getGrouping(event.moment);
        event.userName = user.name;
        event.userId = user.id;
      });

      return tacoEvents;
    }

    function getGrouping(thisMoment) {
      var day = roundDown(thisMoment);
      var daysFromToday = roundDown(moment()).diff(day, 'days');

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
      if (service.user.id) {
        userRef = dbRef.ref('tacoEaters/' + service.user.id + '/tacoEvents');
        userTacoEvents = $firebaseArray(userRef);
      }
    }

    function addUser(user) {
      user.tacoEvents = [];
      // only create a tacoEvent if this user started with some tacos
      if (user.tacos > 0) {
        user.tacoEvents.push({
          initial: true, // a marker we can key off for how many you started with
          tacos: user.tacos,
          time: moment().unix()
        });
      }
      delete user.tacos;

      if (service.locationData) {
        user.info = service.locationData;
      }

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
      console.log('CLEARED');
      localStorage.setObject('user', {});
      service.user = {};
    }

    function getGroup(groupId) {
      var index = _.findIndex(groupsCollection, {$id: groupId});
      return groupsCollection[index];
    }

    function hasGroup() {
      return !_(service.user.groupId).isEmpty();
    }

    function getGroupName() {
      if (!hasGroup()) return '';

      var group = getGroup(service.user.groupId);
      return group.name;
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

    function getGlobalLeaderBoard(users) {
      var sorted = _(users)
        .filter(removeTestUsers)
        .filter(filterOutBadUsers)
        .sortBy('tacosToday')
        .sortBy('tacos')
        .reverse()
        .value();

      sorted = _.cloneDeep(sorted);

      var fullLeaderboard = createLeaderBoardWithSorted(sorted);
      return _.filter(fullLeaderboard, limitGlobalLeaderboard);
    }

    function limitGlobalLeaderboard(user, index) {
      return index < 10 || user.id === service.user.id;
    }

    function getGroupLeaderBoard(users) {
      var sorted = _(users)
        .filter(removeTestUsers)
        .filter(filterOutBadUsers)
        .filter(filterGroupUsers)
        .sortBy('tacosToday')
        .sortBy('tacos')
        .reverse()
        .value();

      sorted = _.cloneDeep(sorted);

      return createLeaderBoardWithSorted(sorted);
    }

    function createLeaderBoardWithSorted(sorted) {
      var leaderboard = [];

      for (var i = 0; i < sorted.length; i++) {
        if (i > 0 && sorted[i - 1].tacos === sorted[i].tacos) {
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
      var groupId = service.user.groupId;
      if (!groupId) return true;

      return user.groupId === groupId;
    }

    function setUpLocationInfo() {
      $.getJSON('//freegeoip.net/json/?callback=?', function (data) {
        if (!data || !data.ip)
          console.log('IP not found');
        service.locationData = data;
      }).fail(function () {
        console.log('$.getJSON() request failed');
      });
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
