(function () {
  angular
    .module('taco.overview')
    .controller('MoreTacosController', MoreTacosController);

  function MoreTacosController($scope, firebaseService) {
    var $ctrl = this;

    $ctrl.tacoEvent = getEmptyTacoEvent();

    $ctrl.save = save;

    function save() {
      firebaseService.addTacos($ctrl.tacoEvent, firebaseService);

      // set a 'newTacos' back to $scope so we can
      // play with it in the overview controller
      $scope.modal.newTacos = $ctrl.tacoEvent;
      $scope.modal.hide().then(function () {
        $ctrl.tacoEvent = getEmptyTacoEvent();
      });
    }

    function getEmptyTacoEvent() {
      return {
        tacos: 1,
        time: new Date()
      }
    }
  }
})();
