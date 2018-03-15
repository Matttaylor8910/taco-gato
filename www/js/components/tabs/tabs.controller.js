(function () {
  angular
    .module('taco.tabs', [])
    .controller('TabsController', TabsController);

  function TabsController() {
    var $ctrl = this;
    $ctrl.onTitleHold = onTitleHold;

    function onTitleHold() {
      settings.setProperty('darkMode', !settings.darkMode);
    }
  }
})();
