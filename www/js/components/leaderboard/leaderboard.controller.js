(function () {
  angular
    .module('taco.leaderboard', [])
    .controller('LeaderboardController', LeaderboardController);

  function LeaderboardController(firebaseService, $state) {
    var $ctrl = this;

    $ctrl.leaderboard = firebaseService.globalLeaderboard;
    $ctrl.displayingGlobal = true;

    $ctrl.hasGroup = !_(firebaseService.user.groupId).isEmpty();

    $ctrl.goToGroup = goToGroup;

    function goToGroup() {
      $state.go('app.group');
    }

    $ctrl.displayGlobal = displayGlobal;
    function displayGlobal() {
      $ctrl.leaderboard = firebaseService.globalLeaderboard;
      $ctrl.displayingGlobal = true;
    }

    $ctrl.displayGroup = displayGroup;
    function displayGroup() {
      $ctrl.leaderboard = firebaseService.groupLeaderboard;
      $ctrl.displayingGlobal = false;
    }
  }
})();
