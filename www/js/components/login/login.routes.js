(function () {
  angular
    .module('taco.login')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        controller: 'LoginController',
        templateUrl: 'js/components/login/login.tpl.html',
        controllerAs: '$ctrl'
      });
  }
})();
