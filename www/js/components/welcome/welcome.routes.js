(function () {
  angular
    .module('taco.welcome')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('welcome', {
        url: '/welcome',
        templateUrl: 'js/components/welcome/welcome.tpl.html',
        controller: 'WelcomeController',
        controllerAs: '$ctrl'
      });
  }
})();
