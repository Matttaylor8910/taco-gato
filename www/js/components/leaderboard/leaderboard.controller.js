(function () {
  angular
    .module('taco.leaderboard', [])
    .controller('LeaderboardController', LeaderboardController);

  function LeaderboardController($scope, firebaseService, $state) {
    var $ctrl = this;

    $ctrl.hasGroup = firebaseService.hasGroup;

    $scope.$on('$ionicView.beforeEnter', beforeEnter);
    function beforeEnter() {
      if (!firebaseService.hasGroup()) {
        displayGlobal()
      } else {
        displayGroup();
      }
    }

    // todo: refactor with groupController.
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
