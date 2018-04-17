(function () {
  angular
    .module('taco.leaderboard', [])
    .controller('LeaderboardController', LeaderboardController);

  function LeaderboardController(firebaseService, $state) {
    var $ctrl = this;

    $ctrl.firebase = firebaseService;

    $ctrl.goToGroup = goToGroup;

    function goToGroup() {
      $state.go('group');
    }
  }
})();
