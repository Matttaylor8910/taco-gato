(function () {
  angular
    .module('taco.leaderboard', [])
    .controller('LeaderboardController', LeaderboardController);

  function LeaderboardController($rootScope, $scope, firebaseService, $state, $ionicScrollDelegate) {
    var $ctrl = this;

    $ctrl.hasGroup = firebaseService.hasGroup;
    $ctrl.groupName = firebaseService.getGroupName;
    $ctrl.firebase = firebaseService;

    $scope.$on('$ionicView.beforeEnter', beforeEnter);

    function beforeEnter() {
      if (!firebaseService.hasGroup()) {
        displayGlobal()
      } else {
        displayGroup();
      }
    }

    $rootScope.$on('firebase.usersUpdated', reloadData);
    function reloadData() {
      if ($ctrl.displayingGlobal) {
        $ctrl.displayGlobal();
      } else {
        $ctrl.displayGroup();
      }
    }

    $ctrl.goToGroup = goToGroup;

    function goToGroup() {
      $state.go('app.group');
    }

    $ctrl.displayGlobal = displayGlobal;

    function displayGlobal() {
      $ctrl.leaderboard = firebaseService.globalLeaderboard;
      $ctrl.displayingGlobal = true;
      $ionicScrollDelegate.resize();
    }

    $ctrl.displayGroup = displayGroup;

    function displayGroup() {
      $ctrl.leaderboard = firebaseService.groupLeaderboard;
      $ctrl.displayingGlobal = false;
      $ionicScrollDelegate.resize();
    }
  }
})();
