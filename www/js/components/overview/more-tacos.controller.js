(function () {
  angular
    .module('taco.overview')
    .controller('MoreTacosController', MoreTacosController);

  function MoreTacosController($scope, firebaseService) {
    var $ctrl = this;

    $ctrl.tacos = 1;

    $ctrl.save = save;
    $ctrl.cancel = closeAndResetModal;

    function save() {
      firebaseService.addTacos($ctrl.tacos, firebaseService);;
      closeAndResetModal();
    }

    function closeAndResetModal() {
      $scope.modal.hide().then(function () {
        $ctrl.tacos = 1;
      });
    }
  }
})();
