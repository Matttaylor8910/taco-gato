(function () {
  angular
    .module('tagoGato.welcome')
    .config(config);

  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('welcome', {
        url: '/welcome',
        templateUrl: 'js/components/welcome/welcome.tpl.html',
        controller: 'WelcomeController',
        controllerAs: '$ctrl'
      });

    console.log('suh');

    // If no other routes are matched always default to fruit-list
    $urlRouterProvider.otherwise('/welcome');
  }
})();
