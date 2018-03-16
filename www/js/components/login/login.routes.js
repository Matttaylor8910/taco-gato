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
        controllerAs: '$ctrl',
        resolve: {
          'simpleObj': function($firebaseArray) {
            // connect to the taco database
            var dbRef = firebase.database();
            var tacoEatersRef = dbRef.ref('tacoEaters');
            return $firebaseArray(tacoEatersRef).$loaded();
          }
        }
      });
  }
})();
