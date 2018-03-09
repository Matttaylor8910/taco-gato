(function () {
  angular
    .module('taco.overview', [])
    .controller('OverviewController', OverviewController);

  function OverviewController($scope, $state, $timeout, $ionicModal, firebaseService) {
    var $ctrl = this;

    $ctrl.tacosModal = tacosModal;

    init();
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

    function setUpUser() {
      if (!firebaseService.user || !firebaseService.user.name) {
        $state.go('welcome');
      }
      else {
        $ctrl.user = firebaseService.user;
      }
    }

    function tacosModal($event) {
      $scope.modal.show($event);
    }

    function incrementTotalTacos() {
      if ($scope.modal.newTacos) {
        incrementTacoDelay($scope.modal.newTacos.tacos);
      }
    }

    function incrementTacoDelay(tacosRemaining) {
      if (tacosRemaining > 0) {
        $timeout(function () {
          $ctrl.user.tacos++;
          incrementTacoDelay(tacosRemaining - 1);
        }, 100);
      }
    }
  }
})();
