(function () {
  angular
    .module('taco')
    .controller('TacoGatoController', TacoGatoController);

  function TacoGatoController($rootScope, firebaseService, settings) {
    var $ctrl = this;

    $ctrl.firebase = firebaseService;
    $ctrl.settings = settings;

    $rootScope.$on('$stateChangeStart', function (event, toState) {
      $ctrl.thisState = toState;
    });
  }
})();
