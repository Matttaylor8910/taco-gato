(function () {
  angular
    .module('taco.groupsLeaderboard')
    .controller('GroupLeaderboardController', GroupLeaderboardController);

  function GroupLeaderboardController($scope, $rootScope, $state, firebaseService) {
    var $ctrl = this;
    
    $ctrl.groupId = $state.params.groupId;
    $ctrl.firebase = firebaseService;

    $ctrl.joinGroup = joinGroup;

    $scope.$on('$ionicView.beforeEnter', init);
    $rootScope.$on('firebase.leaderboardUpdated', init);

    function init() {
      $ctrl.leaderboard = firebaseService.getGroupLeaderBoard($ctrl.groupId);
    }

    function joinGroup() {
      firebaseService.assignUserToGroup($ctrl.groupId);
    }
  }
})();
