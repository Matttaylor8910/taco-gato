(function () {
  angular
    .module('taco.tabs')
    .config(config);

  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('app', {
        url: '/app',
        abstract: true,
        controller: 'TabsController',
        templateUrl: 'js/components/tabs/tabs.tpl.html',
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

    // If no other routes are matched always default to login
    $urlRouterProvider.otherwise('/login');
  }
})();
