(function () {
  angular
    .module('taco')
    .controller('TacoGatoController', TacoGatoController);

  function TacoGatoController($rootScope, firebaseService) {
    var $ctrl = this;

    $ctrl.firebase = firebaseService;

    $rootScope.$on('$stateChangeStart', function (event, toState) {
      $ctrl.thisState = toState;
    });
  }
})();
