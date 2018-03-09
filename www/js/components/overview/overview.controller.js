(function () {
  angular
    .module('taco.overview', [])
    .controller('OverviewController', OverviewController);

  function OverviewController($scope, $rootScope, $state, $timeout, $ionicModal, $ionicHistory, firebaseService) {
    var $ctrl = this;

    $ctrl.tacoCounter = 0;
    $ctrl.userId = $state.params.id;
    $ctrl.firebase = firebaseService;

    $ctrl.tacosModal = tacosModal;
    $ctrl.clearUser = clearUser;

    init();

    $scope.$on('$ionicView.beforeEnter', beforeEnter);
    $rootScope.$on('firebase.usersUpdated', usersUpdated);

    function init() {
      $ionicModal.fromTemplateUrl('js/components/overview/more-tacos.modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
      });
    }

    function beforeEnter() {
      $ctrl.user = undefined;
      $ctrl.loading = true;
      if (!$ctrl.user && firebaseService.users) {
        getUserFromFirebase();
        $ctrl.loading = false;
      }
    }

    function usersUpdated() {
      if ($state.current.name !== 'overview') {
        return;
      }

      if (!$ctrl.user) {
        beforeEnter();
      }
      else {
        getUserFromFirebase();
      }
    }

    function getUserFromFirebase() {
      $ctrl.user = firebaseService.getUser($state.params.id);
      if ($ctrl.user) {
        updateTacoCounter();
        $ctrl.error = false;
      }
      else {
        $ctrl.error = true;
      }
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

    function tacosModal($event) {
      $scope.modal.show($event);
    }

    function clearUser() {
      firebaseService.clearUser();
      $ionicHistory.nextViewOptions({
        animation: false
      });
      $state.go('welcome');
    }

    function incrementTacoDelay(tacosRemaining, delay) {
      // set a delay that ensures the counter is correct within 1 second, but only
      // if there is no delay passed in (from recursive call)
      var DELAY = delay || (1000 / tacosRemaining);

      if (tacosRemaining > 0) {
        $timeout(function () {
          $ctrl.tacoCounter++;
          incrementTacoDelay(tacosRemaining - 1, DELAY);
        }, DELAY);
      }
    }
  }
})();
