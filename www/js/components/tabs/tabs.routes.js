(function () {
  angular
    .module('taco.tabs')
    .config(config);

  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        controller: 'TabsController',
        templateUrl: 'js/components/tabs/tabs.tpl.html'
      });

    // If no other routes are matched always default to login
    $urlRouterProvider.otherwise('/login');
  }
})();
