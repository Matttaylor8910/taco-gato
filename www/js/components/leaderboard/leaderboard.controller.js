(function () {
  angular
    .module('taco.leaderboard', [])
    .controller('LeaderboardController', LeaderboardController);

  function LeaderboardController($rootScope, $scope, $timeout, $state, firebaseService, $ionicPopover, $ionicScrollDelegate) {
    var $ctrl = this;

    $ctrl.hasGroup = firebaseService.hasGroup;
    $ctrl.groupName = firebaseService.getGroupName;
    $ctrl.firebase = firebaseService;

    $ctrl.showPopover = showPopover;
    $ctrl.changeDateSelection = changeDateSelection;
    $ctrl.goToGroup = goToGroup;
    $ctrl.displayGlobal = displayGlobal;
    $ctrl.displayGroup = displayGroup;

    $scope.$on('$ionicView.beforeEnter', reloadData);
    $rootScope.$on('firebase.leaderboardUpdated', reloadData);
    $rootScope.$on('firebase.joinedGroup', displayGroup);

    init();

    function init() {
      $ionicPopover.fromTemplateUrl('js/components/leaderboard/leaderboard-date-popover.tpl.html', {
        scope: $scope
      }).then(function(popover) {
        $scope.$ctrl = $ctrl;
        $scope.popover = popover;
      });    
    }

    function showPopover($event) {
      $scope.popover.show($event);
    }

    function changeDateSelection(last30Days) {
      $scope.popover.hide();
      
      // if they picked the opposite selection, update the leaderboards and reload data
      if (last30Days !== firebaseService.last30Days) {
        $timeout(function() {
          firebaseService.setLast30Days(last30Days);
          firebaseService.setUpActivityAndLeaderboard();
        });
      }
    }

    function reloadData() {
      if (firebaseService.hasGroup() && !$ctrl.displayingGlobal) {
        displayGroup();
      } else {
        displayGlobal();
      }
    }

    function goToGroup() {
      $state.go('app.group');
    }

    function displayGlobal() {
      $ctrl.leaderboard = firebaseService.globalLeaderboard;
      $ctrl.displayingGlobal = true;
      $ionicScrollDelegate.resize();
    }

    function displayGroup() {
      $ctrl.leaderboard = firebaseService.groupLeaderboard;
      $ctrl.displayingGlobal = false;
      $ionicScrollDelegate.resize();
    }
  }
})();
