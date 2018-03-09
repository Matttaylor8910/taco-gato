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
      addTacos: addTacos,
      getUser: getUser,
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

        // TODO: generate news feed and leaderboard
      });

      // set up the user ref if we can
      addUserRef();
    }

    function mapUsers(user) {
      user.tacoEvents = _.reverse(_.map(user.tacoEvents));
      user.tacos = _.sumBy(user.tacoEvents, 'tacos');

      _.each(user.tacoEvents, function (event) {
        event.moment = moment.unix(event.time);
      });

      return user;
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
        service.user = user;
        localStorage.setObject('user', user);
        addUserRef();

        return user;
      });
    }

    function addTacos(numTacos) {
      return userTacoEvents.$add({
        tacos: numTacos,
        time: moment().unix()
      });
    }

    function getUser(id) {
      return _.find(service.users, {key: id});
    }

    function clearUser() {
      localStorage.setObject('user', {});
      service.user = {};
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
