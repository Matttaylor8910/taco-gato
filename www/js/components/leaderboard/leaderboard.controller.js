(function () {
  angular
    .module('taco.leaderboard', ['ngCordova'])
    .controller('LeaderboardController', LeaderboardController);

  function LeaderboardController($rootScope, $scope, $timeout, $state, firebaseService, $ionicPopover, $ionicScrollDelegate, $cordovaSocialSharing) {
    var $ctrl = this;

    $ctrl.hasGroup = firebaseService.hasGroup;
    $ctrl.groupName = firebaseService.getGroupName;
    $ctrl.firebase = firebaseService;

    $ctrl.showPopover = showPopover;
    $ctrl.changeDateSelection = changeDateSelection;
    $ctrl.goToGroup = goToGroup;
    $ctrl.displayGlobal = displayGlobal;
    $ctrl.displayGroup = displayGroup;
    $ctrl.inviteFriends = inviteFriends;

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

    function inviteFriends() {
      var message = 'Try to eat more tacos than me on Taco Gato! Join my group: ' + $ctrl.groupName();
      var subject = message;
      var file = null;
      var link = 'https://tacogato.app/';

      $cordovaSocialSharing
        .share(message, subject, file, link) // Share via native share sheet
        .then(function(result) {
          // Success!
        }, function(err) {
          // An error occured. Show a message to the user
        });
    }
  }
})();
