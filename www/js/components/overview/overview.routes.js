(function () {
  angular
    .module('taco.overview')
    .config(config);

  function config($stateProvider) {
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
  }
})();
