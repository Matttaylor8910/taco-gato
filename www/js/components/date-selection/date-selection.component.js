(function () {
  angular
    .module('taco')
    .component('dateSelection', {
      templateUrl: 'js/components/date-selection/date-selection.tpl.html',
      controller: DateSelectionController,
      bindings: {
        title: '@'
      }
    });

  function DateSelectionController($scope, $timeout, $ionicPopover, firebaseService) {
    var $ctrl = this;

    $ctrl.firebase = firebaseService;

    $ctrl.showPopover = showPopover;
    $ctrl.changeDateSelection = changeDateSelection;

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
  }
})();
