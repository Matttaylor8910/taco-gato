(function () {
  angular
    .module('taco.leaderboard', [])
    .controller('LeaderboardController', LeaderboardController);

  function LeaderboardController($rootScope, $scope, firebaseService, $state, $ionicPopover, $ionicScrollDelegate) {
    var $ctrl = this;

    $ctrl.hasGroup = firebaseService.hasGroup;
    $ctrl.groupName = firebaseService.getGroupName;
    $ctrl.firebase = firebaseService;
    $ctrl.last30Days = true;

    $ctrl.showPopover = showPopover;
    $ctrl.changeDateSelection = changeDateSelection;

    $scope.$on('$ionicView.beforeEnter', reloadData);
    $rootScope.$on('firebase.usersUpdated', reloadData);
    $rootScope.$on('firebase.joinedGroup', displayGroup);

    init();

    function init() {
      console.log('loading');
      $ionicPopover.fromTemplateUrl('js/components/leaderboard/leaderboard-date-popover.tpl.html', {
        scope: $scope
      }).then(function(popover) {
        $scope.$ctrl = $ctrl;
        $scope.popover = popover;
        console.log('loaded');
      });    
    }

    function showPopover($event) {
      $scope.popover.show($event);
    }

    function changeDateSelection(last30Days) {
      $scope.popover.hide();
      
      // if they picked the opposite selection, update the leaderboards and reload data
      if (last30Days !== $ctrl.last30Days) {
        $ctrl.last30Days = last30Days;
        firebaseService.setUpActivityAndLeaderboard(last30Days);
        reloadData();
      }
    }

    function reloadData() {
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
