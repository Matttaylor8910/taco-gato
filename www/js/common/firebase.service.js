(function () {
  angular
    .module('taco')
    .factory('firebaseService', firebaseService);

  function firebaseService($rootScope, localStorage, $firebaseArray) {
    var dbRef;

    var tacoEatersRef, tacoEatersCollection;
    var userRef, userTacoEvents;

    var service = {
      user: localStorage.getObject('user'),

      addUser: addUser,
      editUser: editUser,
      addTacos: addTacos,
      editTacos: editTacos,
      deleteTacos: deleteTacos,
      getUser: getUser,
      setUser: setUser,
      clearUser: clearUser
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
        $rootScope.$broadcast('firebase.usersUpdated');

        // set up activity and leaderboard
        service.activity = getActivityFeed(service.users);
        service.leaderboard = getLeaderBoard(service.users);
      });

      // set up the user ref if we can
      addUserRef();
    }

    function mapUsers(user) {
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
        event.userId = user.key;
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

      // return the promise so we can wait for this add to finish
      return tacoEatersCollection.$add(user).then(function (ref) {
        user.id = ref.key;
        signIn(user);

        return user;
      });
    }

    function editUser(user) {
      var index = _.findIndex(tacoEatersCollection, {$id: user.key});
      tacoEatersCollection[index].name = user.name;
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
      return _.find(service.users, {key: id});
    }

    function setUser(userItem) {
      signIn({
        id: userItem.key,
        name: userItem.name,
        tacoEvents: cleanUpTacos(userItem.tacoEvents)
      });
    }

    function signIn(user) {
      service.user = user;
      localStorage.setObject('user', user);
      addUserRef();
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

    function getActivityFeed(users) {
      return _(users)
        .filter(removeTestUsers)
        .map('tacoEvents')
        .flatten()
        .sortBy('time')
        .reverse()
        .groupBy('grouping')
        .map(function (events, grouping) {
          return {
            grouping: grouping,
            events: events
          };
        })
        .value();
    }

    function getLeaderBoard(users) {
      var sorted = _(users)
        .filter(removeTestUsers)
        .sortBy('tacosToday')
        .sortBy('tacos')
        .reverse()
        .value();

      var leaderboard = [];
      var rank = 1;

      for (var i = 0; i < sorted.length; i++) {
        if (i > 0 && sorted[i - 1].tacos === sorted[i].tacos) {
          sorted[i].rank = sorted[i - 1].rank;
        }
        else {
          sorted[i].rank = rank;
        }
        rank++;
        leaderboard.push(sorted[i]);
      }

      return leaderboard;
    }

    function removeTestUsers(user) {
      return user.name && !user.name.toLowerCase().includes('test');
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
        item.key = childSnapshot.key;
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
