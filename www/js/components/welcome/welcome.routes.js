(function () {
  angular
    .module('taco.welcome')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('app.welcome', {
        url: '/welcome',
        views: {
          'overview' : {
            templateUrl: 'js/components/welcome/welcome.tpl.html',
            controller: 'WelcomeController',
            controllerAs: '$ctrl'
          }
        }
      })
      .state('app.welcome-sign-in', {
        url: '/welcome/sign-in',
        views: {
          'overview' : {
            templateUrl: 'js/components/welcome/sign-in/sign-in.tpl.html',
            controller: 'SignInController',
            controllerAs: '$ctrl'
          }
        }
      });
  }
})();
