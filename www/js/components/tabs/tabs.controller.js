(function () {
  angular
    .module('taco.tabs', [])
    .controller('TabsController', TabsController);

  function TabsController(settings, firebaseService, $rootScope) {
    var $ctrl = this;
    $ctrl.firebaseUser = firebaseService.user;

    $rootScope.onTitleHold = onTitleHold;
    function onTitleHold() {
      settings.setProperty('darkMode', !settings.darkMode);
    }
  }
})();
