(function () {
  angular
    .module('taco.sign-up')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('sign-up', {
        url: '/sign-up',
        controller: 'SignUpController',
        templateUrl: 'js/components/sign-up/sign-up.tpl.html',
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
