(function () {
  angular
    .module('taco')
    .controller('TacoGatoController', TacoGatoController);

  function TacoGatoController($rootScope, $state) {
    var $ctrl = this;

    $rootScope.$on('$stateChangeStart', function (event, toState) {
      $ctrl.thisState = toState;
    });
  }
})();
