(function () {
  angular
    .module('taco.overview')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('overview', {
        url: '/overview',
        templateUrl: 'js/components/overview/overview.tpl.html',
        controller: 'OverviewController',
        controllerAs: '$ctrl'
      });
  }
})();
