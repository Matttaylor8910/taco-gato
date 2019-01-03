(function () {
  angular
    .module('taco.tabs')
    .config(config);

  function config($stateProvider, $urlRouterProvider, localStorageProvider) {
    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        controller: 'TabsController',
        templateUrl: 'js/components/tabs/tabs.tpl.html'
      });

    // If no other routes are matched always default to login if not signed in
    var user = localStorageProvider.$get().getObject('user');
    if (user.id) {
      $urlRouterProvider.otherwise('/app/overview/' + user.id); 
    }
    else {
      $urlRouterProvider.otherwise('/welcome');
    }
  }
})();
