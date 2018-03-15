(function () {
  angular
    .module('taco')
    .factory('settings', settings);

  function settings(localStorage) {
    var service = {
      isDevice: false,
      blocked: setting('blocked', true),
      darkMode: setting('darkMode', true),

      setProperty: setProperty
    };

    init();

    return service;

    function init() {
      ionic.Platform.ready(function(){
        handleDarkModeStatusBar(service.darkMode);
        service.isDevice = true;
      });
    }

    /**
     * Set a setting to localstorage
     * @param property
     * @param value
     */
    function setProperty(property, value) {
      service[property] = value;
      localStorage.setObject(property, value);
      handleDarkModeStatusBar(value);
    }

    /**
     * Get the setting from localstorage
     * @param property
     * @param defaultValue
     * @returns {*}
     */
    function setting(property, defaultValue) {
      var setValue = localStorage.getObject(property);
      return _.isBoolean(setValue) ? setValue : defaultValue;
    }

    function handleDarkModeStatusBar(value) {
      if (window.StatusBar && service.isDevice) {
        if (value === true || value === 'true') {
          StatusBar.styleLightContent();
        }
        else {
          StatusBar.styleDefault();
        }
      }
    }
  }
})();
