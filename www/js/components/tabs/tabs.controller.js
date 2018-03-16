(function () {
  angular
    .module('taco.tabs', [])
    .controller('TabsController', TabsController);

  function TabsController(settings) {
    var $ctrl = this;
    $ctrl.onTitleHold = onTitleHold;
    $ctrl.settings = settings;

    function onTitleHold() {
      settings.setProperty('darkMode', !settings.darkMode);
    }
  }
})();
