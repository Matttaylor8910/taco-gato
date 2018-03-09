(function () {
  angular
    .module('taco.leaderboard')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('leaderboard', {
        url: '/leaderboard',
        views: {
          'leaderboard' : {
            templateUrl: 'js/components/leaderboard/leaderboard.tpl.html',
            controller: 'LeaderboardController',
            controllerAs: '$ctrl'
          }
        }
      });
  }
})();
