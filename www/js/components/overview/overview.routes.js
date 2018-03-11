(function () {
  angular
    .module('taco.overview')
    .config(config);

  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('overview', {
        url: '/overview/:userId',
        views: {
          'overview': {
            templateUrl: 'js/components/overview/overview.tpl.html',
            controller: 'OverviewController',
            controllerAs: '$ctrl'
          }
        }
      })
      .state('activity-overview', {
        url: 'activity/overview/:userId',
        views: {
          'activity': {
            templateUrl: 'js/components/overview/overview.tpl.html',
            controller: 'OverviewController',
            controllerAs: '$ctrl'
          }
        }
      });

    // If no other routes are matched always default to fruit-list
    $urlRouterProvider.otherwise('/overview/');
  }
})();
