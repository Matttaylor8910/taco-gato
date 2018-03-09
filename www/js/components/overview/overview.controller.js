(function () {
  angular
    .module('taco.overview', [])
    .controller('OverviewController', OverviewController);

  function OverviewController($scope, $rootScope, $state, $timeout, $ionicModal, firebaseService) {
    var $ctrl = this;

    $ctrl.tacoCounter = 0;
    $ctrl.tacosModal = tacosModal;

    init();

    $rootScope.$on('firebase.usersUpdated', usersUpdated);
    $scope.$on('$ionicView.beforeEnter', setUpUser);
    $scope.$on('modal.hidden', incrementTotalTacos);

    function init() {
      $ionicModal.fromTemplateUrl('js/components/overview/more-tacos.modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal;
      });
    }

    function usersUpdated() {
      setUpUser();
      $ctrl.user = firebaseService.getUser($state.params.id);
      incrementTacoDelay($ctrl.user.tacos - $ctrl.tacoCounter);
    }

    function setUpUser() {
      $ctrl.loading = !$ctrl.user;
      if (!$ctrl.user && firebaseService.users) {
        $ctrl.user = firebaseService.getUser($state.params.id);
        $ctrl.loading = false;
      }
    }

    function tacosModal($event) {
      $scope.modal.show($event);
    }

    function incrementTotalTacos() {
      if ($scope.modal.newTacos) {
        incrementTacoDelay($scope.modal.newTacos.tacos - $ctrl.tacoCounter);
      }
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
