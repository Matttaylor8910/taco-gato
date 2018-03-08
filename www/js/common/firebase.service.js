(function () {
  angular
    .module('taco')
    .factory('firebaseService', firebaseService);

  function firebaseService() {
    var dbRef;

    var service = {
      addUser: addUser
    };

    init();

    return service;

    /**
     * Initialize the firebase objects and collections
     */
    function init() {
      // connect to the firebase database
    }

    function addUser(user) {
      console.log(user);
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
