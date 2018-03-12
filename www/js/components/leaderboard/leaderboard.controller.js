(function () {
  angular
    .module('taco.leaderboard', [])
    .controller('LeaderboardController', LeaderboardController);

  function LeaderboardController(firebaseService) {
    var $ctrl = this;

    $ctrl.firebase = firebaseService;
  }
})();
