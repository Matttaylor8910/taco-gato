(function () {
  angular
    .module('taco.leaderboard')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('app.leaderboard', {
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
