(function () {
  angular
    .module('taco.welcome')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('welcome', {
        url: '/welcome/:firebaseUserId',
        templateUrl: 'js/components/welcome/welcome.tpl.html',
        controller: 'WelcomeController',
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
