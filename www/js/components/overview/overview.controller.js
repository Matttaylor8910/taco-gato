(function () {
  angular
    .module('taco.overview', [])
    .controller('OverviewController', OverviewController);

  function OverviewController($scope, $rootScope, $state, $timeout, $ionicModal, firebaseService) {
    var $ctrl = this;

    $ctrl.tacoCounter = 0;
    $ctrl.tacosModal = tacosModal;

    init();

    $scope.$on('$ionicView.beforeEnter', beforeEnter);
    $rootScope.$on('firebase.usersUpdated', usersUpdated);

    function init() {
      $ionicModal.fromTemplateUrl('js/components/overview/more-tacos.modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
    }

    function beforeEnter() {
      $ctrl.loading = !$ctrl.user;
      if (!$ctrl.user && firebaseService.users) {
        getUserFromFirebase();
        $ctrl.loading = false;
      }
    }

    function usersUpdated() {
      if (!$ctrl.user) {
        beforeEnter();
      }
      else {
        getUserFromFirebase();
      }
    }

    function getUserFromFirebase() {
      $ctrl.user = firebaseService.getUser($state.params.id);
      var tacosToIncrement = $ctrl.user.tacos - $ctrl.tacoCounter;
      var delay = $ctrl.tacoCounter === 0 ? 0 : undefined;
      incrementTacoDelay(tacosToIncrement, delay);
    }

    function tacosModal($event) {
      $scope.modal.show($event);
    }

    function incrementTacoDelay(tacosRemaining, delay) {
      var DELAY = delay || (1000 / tacosRemaining);
      if (tacosRemaining > 0) {
        $timeout(function () {
          $ctrl.tacoCounter++;
          incrementTacoDelay(tacosRemaining - 1, DELAY);
        }, DELAY);
      }
      else {
        $ctrl.user = firebaseService.getUser($state.params.id);
      }
    }
  }
})();
