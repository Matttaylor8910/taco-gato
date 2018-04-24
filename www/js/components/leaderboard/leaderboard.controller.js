(function () {
  angular
    .module('taco.leaderboard', [])
    .controller('LeaderboardController', LeaderboardController);

  function LeaderboardController(firebaseService, $state) {
    var $ctrl = this;

    $ctrl.leaderboard = firebaseService.globalLeaderboard;
    $ctrl.displayingGlobal = true;

    $ctrl.hasGroup = firebaseService.hasGroup;

    $ctrl.groupName = groupName;
    function groupName() {
      if (!firebaseService.hasGroup()) return '';

      var group = firebaseService.getGroup(firebaseService.user.groupId);
      return group.name;
    }

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
