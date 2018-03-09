(function () {
  angular
    .module('taco')
    .factory('firebaseService', firebaseService);

  function firebaseService(localStorage) {
    var dbRef;

    var service = {
      user: localStorage.getObject('user'),

      addUser: addUser,
      addTacos: addTacos
    };

    init();

    return service;

    /**
     * Initialize the firebase objects and collections
     */
    function init() {
      // TODO: connect to the firebase database
      // TODO: listen on users and generate news feed and leaderboard
    }

    function addUser(user) {
      service.user = user;
      localStorage.setObject('user', user);
      // TODO: Save to firebase
      // TODO: also add the initial tacos as the first event
    }

    function addTacos(tacoEvent) {
      console.log(tacoEvent);
      // TODO: add this taco event to the user (for the feed/leaderboard)
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
