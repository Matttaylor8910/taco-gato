(function () {
  angular
    .module('taco.overview', [])
    .controller('OverviewController', OverviewController);

  function OverviewController($scope, $rootScope, $state, $timeout, $ionicHistory, firebaseService, settings) {
    var $ctrl = this;

    $ctrl.tacoCounter = 0;
    $ctrl.firebase = firebaseService;
    $ctrl.settings = settings;

    $ctrl.clearUser = clearUser;

    $scope.$on('$ionicView.beforeEnter', beforeEnter);
    $rootScope.$on('firebase.usersUpdated', getUserFromFirebase);

    function beforeEnter() {
      if ($state.params.userId) {
        $ctrl.user = undefined;
        $ctrl.userId = $state.params.userId;
        $ctrl.you = $ctrl.firebase.user.id === $ctrl.userId;
        $ctrl.loading = true;
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
        $state.go('overview', {userId: firebaseService.user.id});
      }
      else {
        clearUser();
      }
    }

    function getUserFromFirebase() {
      $ctrl.user = firebaseService.getUser($ctrl.userId);
      if ($ctrl.user) {
        updateTacoCounter();
        $ctrl.error = false;
      }
      else {
        $ctrl.error = true;
      }
      $ctrl.loading = false;
    }

    function updateTacoCounter() {
      // if the taco counter is at 0 and we're definitely going to increment it,
      // start the counter at 1 so it never incorrectly shows that you have 0 tacos
      if ($ctrl.tacoCounter === 0 && $ctrl.user.tacos) {
        $ctrl.tacoCounter = 1;
      }

      // only add the tacos that aren't accounted for yet in the counter
      var tacosToIncrement = $ctrl.user.tacos - $ctrl.tacoCounter;
      incrementTacoDelay(tacosToIncrement);
    }

    function clearUser() {
      firebaseService.clearUser();
      $state.go('welcome');
    }

    function incrementTacoDelay(tacosRemaining, delay) {
      // set a delay that ensures the counter is correct within 1 second, but only
      // if there is no delay passed in (from recursive call)
      var DELAY = delay || (1000 / Math.abs(tacosRemaining));

      if (tacosRemaining !== 0) {
        $timeout(function () {
          if (tacosRemaining > 0) {
            $ctrl.tacoCounter++;
            tacosRemaining--;
          }
          else {
            $ctrl.tacoCounter--;
            tacosRemaining++;
          }
          incrementTacoDelay(tacosRemaining, DELAY);
        }, DELAY);
      }
    }
  }
})();
