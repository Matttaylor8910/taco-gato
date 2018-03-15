(function () {
  angular
    .module('taco.overview')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('app.overview', {
        url: '/overview/:userId',
        views: {
          'overview': {
            templateUrl: 'js/components/overview/overview.tpl.html',
            controller: 'OverviewController',
            controllerAs: '$ctrl'
          }
        }
      })
      .state('app.leaderboard-overview', {
        url: 'leaderboard/overview/:userId',
        views: {
          'leaderboard': {
            templateUrl: 'js/components/overview/overview.tpl.html',
            controller: 'OverviewController',
            controllerAs: '$ctrl'
          }
        }
      })
      .state('app.activity-overview', {
        url: 'activity/overview/:userId',
        views: {
          'activity': {
            templateUrl: 'js/components/overview/overview.tpl.html',
            controller: 'OverviewController',
            controllerAs: '$ctrl'
          }
        }
      });
  }
})();
