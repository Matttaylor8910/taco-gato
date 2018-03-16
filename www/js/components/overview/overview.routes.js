(function () {
  angular
    .module('taco.overview')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('app.overview', {
        url: '/overview/:userId',
        views: {
          'overview': {
            templateUrl: 'js/components/overview/overview.tpl.html',
            controller: 'OverviewController',
            controllerAs: '$ctrl'
          }
        },
        resolve: {
          'obj': function ($firebaseArray) {
            // connect to the taco database
            var dbRef = firebase.database();
            var tacoEatersRef = dbRef.ref('tacoEaters');
            return $firebaseArray(tacoEatersRef).$loaded();
          }
        }
      })
      .state('app.leaderboard-overview', {
        url: 'leaderboard/overview/:userId',
        views: {
          'leaderboard': {
            templateUrl: 'js/components/overview/overview.tpl.html',
            controller: 'OverviewController',
            controllerAs: '$ctrl'
          }
        },
        resolve: {
          'obj': function ($firebaseArray) {
            // connect to the taco database
            var dbRef = firebase.database();
            var tacoEatersRef = dbRef.ref('tacoEaters');
            return $firebaseArray(tacoEatersRef).$loaded();
          }
        }
      })
      .state('app.activity-overview', {
        url: 'activity/overview/:userId',
        views: {
          'activity': {
            templateUrl: 'js/components/overview/overview.tpl.html',
            controller: 'OverviewController',
            controllerAs: '$ctrl'
          }
        },
        resolve: {
          'obj': function ($firebaseArray) {
            // connect to the taco database
            var dbRef = firebase.database();
            var tacoEatersRef = dbRef.ref('tacoEaters');
            return $firebaseArray(tacoEatersRef).$loaded();
          }
        }
      });
  }
})();
