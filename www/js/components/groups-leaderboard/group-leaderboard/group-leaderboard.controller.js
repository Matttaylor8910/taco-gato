(function () {
  angular
    .module('taco.groupsLeaderboard')
    .controller('GroupLeaderboardController', GroupLeaderboardController);

  function GroupLeaderboardController($scope, $state, firebaseService) {
    var $ctrl = this;

    $ctrl.groupId = $state.params.groupId;
    $ctrl.firebase = firebaseService;

    $scope.$on('$ionicView.beforeEnter', init);

    function init() {
      $ctrl.leaderboard = firebaseService.getGroupLeaderBoard($ctrl.groupId);
      console.log($ctrl.leaderboard);
    }
  }
})();
