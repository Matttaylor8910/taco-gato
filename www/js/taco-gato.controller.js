(function () {
  angular
    .module('taco')
    .controller('TacoGatoController', TacoGatoController);

  function TacoGatoController($rootScope, firebaseService, settings) {
    var $ctrl = this;

    $ctrl.firebase = firebaseService;
    $ctrl.settings = settings;

    $ctrl.onTitleHold = onTitleHold;

    $rootScope.$on('$stateChangeStart', function (event, toState) {
      $ctrl.thisState = toState;
    });

    function onTitleHold() {
      settings.setProperty('darkMode', !settings.darkMode);
    }
  }
})();
