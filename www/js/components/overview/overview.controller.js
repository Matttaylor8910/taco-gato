(function () {
  angular
    .module('taco.overview', [])
    .controller('OverviewController', OverviewController);

  function OverviewController($scope, $rootScope, $state, $timeout, $ionicHistory, firebaseService, settings, localStorage) {
    var $ctrl = this;

    $ctrl.tacoCounter = 0;
    $ctrl.firebase = firebaseService;
    $ctrl.settings = settings;

    $ctrl.clearUser = clearUser;

    $scope.$on('$ionicView.beforeEnter', beforeEnter);
    $rootScope.$on('firebase.usersUpdated', getUserFromFirebase);

    function beforeEnter() {
      if ($state.params.userId) {
        $ctrl.userId = $state.params.userId;
        $ctrl.you = $ctrl.firebase.user.id === $ctrl.userId;

        if ($ctrl.you) {
          $ctrl.user = localStorage.getObject('overviewUser');
          $ctrl.activity = localStorage.getObject('overviewActivity');
          $ctrl.loading = !$ctrl.user;
          updateTacoCounter();
        }
        else {
          $ctrl.user = undefined;
          $ctrl.activity = undefined;
          $ctrl.loading = true;
        }

        if (firebaseService.users) {
          getUserFromFirebase();
        }
      }
      else if (firebaseService.user.id) {
        $ionicHistory.nextViewOptions({
          disableAnimation: true,
          disableBack: true,
          historyRoot: true
        });
        $state.go('app.overview', {userId: firebaseService.user.id});
      }
      else {
        clearUser();
      }
    }

    function getUserFromFirebase() {
      var user = firebaseService.getUser($ctrl.userId);
      if (user) {
        var activity = _(user.tacoEvents)
          .flatten()
          .sortBy("time")
          .reverse()
          .groupBy("grouping")
          .map(function (events, grouping) {
            return {
              grouping: grouping,
              events: events,
              tacos: _.sumBy(events, 'tacos')
            };
          })
          .value();
        
        // if the tacos for each event in activity has changed from what is cached, update it
        if (JSON.stringify(_.map(activity, 'tacos')) !== JSON.stringify(_.map($ctrl.activity, 'tacos'))) {
          $ctrl.activity = activity;
        }

        // if anything about the user has changed, update the user
        if (JSON.stringify(user) !== JSON.stringify($ctrl.user)) {
          $ctrl.user = user;
        }

        // if we're looking at the user's overview, cache the data
        if ($ctrl.you) {
          localStorage.setObject('overviewUser', $ctrl.user);
          localStorage.setObject('overviewActivity', $ctrl.activity);
        }

        $ctrl.error = false;
        updateTacoCounter();
      }
      else {
        $ctrl.error = true;
      }
      $ctrl.loading = false;
    }

    function updateTacoCounter() {
      // don't allow two functions to update the counter at the same time
      if ($ctrl.tacoCounterStarted) {
        return;
      }

      // if the taco counter is at 0 and we're definitely going to increment it,
      // start the counter at 1 so it never incorrectly shows that you have 0 tacos
      if ($ctrl.tacoCounter === 0 && $ctrl.user.tacos > 0) {
        $ctrl.tacoCounter = 1;
      }

      // only add the tacos that aren't accounted for yet in the counter
      $ctrl.tacoCounterStarted = true;
      incrementTacoDelay();
    }

    function clearUser() {
      firebaseService.clearUser();
      $state.go('welcome');
    }

    function incrementTacoDelay(delay) {
      // set a delay that ensures the counter is correct within 1 second, but only
      // if there is no delay passed in (from recursive call)
      var tacosRemaining = $ctrl.user.tacos - $ctrl.tacoCounter;
      var DELAY = delay || (1000 / Math.abs(tacosRemaining));

      // stop if there are no more tacos to update the counter
      if (tacosRemaining === 0) {
        $ctrl.tacoCounterStarted = false;
      }

      // otherwise update the counter and call the function again
      else {
        $timeout(function () {
          if (tacosRemaining > 0) {
            $ctrl.tacoCounter++;
          }
          else {
            $ctrl.tacoCounter--;
          }
          incrementTacoDelay(DELAY);
        }, DELAY);
      }
    }
  }
})();
