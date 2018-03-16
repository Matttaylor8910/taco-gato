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
          'obj': function ($firebaseArray) {
            // This resolve is used to wait for firebase data to return
            // before we continue because 'setOnAuthStateChanged' returns
            // before firebase does.
            var dbRef = firebase.database();
            var tacoEatersRef = dbRef.ref('tacoEaters');
            return $firebaseArray(tacoEatersRef).$loaded();
          }
        }
      });
  }
})();
