(function () {
  angular
    .module('taco.leaderboard', [])
    .controller('LeaderboardController', LeaderboardController);

  function LeaderboardController($rootScope, $scope, firebaseService, $state, $ionicScrollDelegate) {
    var $ctrl = this;

    $ctrl.hasGroup = firebaseService.hasGroup;
    $ctrl.groupName = firebaseService.getGroupName;
    $ctrl.firebase = firebaseService;

    $scope.$on('$ionicView.beforeEnter', reloadData);
    $rootScope.$on('firebase.usersUpdated', reloadData);
    $rootScope.$on('firebase.joinedGroup', displayGroup);

    function reloadData() {
      console.log('reload');
      if (firebaseService.hasGroup() && !$ctrl.displayingGlobal) {
        displayGroup();
      } else {
        displayGlobal();
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
