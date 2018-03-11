(function () {
  angular
    .module('taco.welcome')
    .config(config);

  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('welcome', {
        url: '/welcome',
        views: {
          'overview' : {
            templateUrl: 'js/components/welcome/welcome.tpl.html',
            controller: 'WelcomeController',
            controllerAs: '$ctrl'
          }
        }
      })
      .state('welcome-sign-in', {
        url: '/welcome/sign-in',
        views: {
          'overview' : {
            templateUrl: 'js/components/welcome/sign-in/sign-in.tpl.html',
            controller: 'SignInController',
            controllerAs: '$ctrl'
          }
        }
      });

    // If no other routes are matched always default to fruit-list
    $urlRouterProvider.otherwise('/welcome');
  }
})();
