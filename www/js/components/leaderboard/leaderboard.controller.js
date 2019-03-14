(function () {
  angular
    .module('taco.leaderboard', ['ngCordova'])
    .controller('LeaderboardController', LeaderboardController);

  function LeaderboardController($rootScope, $scope, $state, firebaseService, $ionicScrollDelegate, $cordovaSocialSharing) {
    var $ctrl = this;

    $ctrl.hasGroup = firebaseService.hasGroup;
    $ctrl.groupName = firebaseService.getGroupName;
    $ctrl.firebase = firebaseService;

    $ctrl.goToGroup = goToGroup;
    $ctrl.displayGlobal = displayGlobal;
    $ctrl.displayGroup = displayGroup;
    $ctrl.inviteFriends = inviteFriends;

    $scope.$on('$ionicView.beforeEnter', reloadData);
    $rootScope.$on('firebase.leaderboardUpdated', reloadData);
    $rootScope.$on('firebase.joinedGroup', displayGroup);

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
