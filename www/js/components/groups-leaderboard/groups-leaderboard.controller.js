(function () {
  angular
    .module('taco.groupsLeaderboard', [])
    .controller('GroupsLeaderboardController', GroupsLeaderboardController);

  function GroupsLeaderboardController(firebaseService) {
    var $ctrl = this;

    $ctrl.firebase = firebaseService;
  }
})();
