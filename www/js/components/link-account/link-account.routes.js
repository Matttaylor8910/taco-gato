(function () {
  angular
    .module('taco.link-account')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('link-account', {
        url: '/link-account',
        controller: 'LinkAccountController',
        templateUrl: 'js/components/link-account/link-account.tpl.html',
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
