(function () {
  angular
    .module('taco')
    .factory('settings', settings);

  function settings($timeout, $ionicPlatform, localStorage) {
    var service = {
      isDevice: false,
      darkMode: setting('darkMode', true),
      blocked: setting('blocked', false),

      // set up the leaderboards with All Time by default
      last30Days: setting('last30Days', false),

      setProperty: setProperty
    };

    $ionicPlatform.ready(init);

    return service;

    function init() {
      $timeout(function() {
        service.isDevice = true;
        handleDarkModeStatusBar(service.darkMode);
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

      if (property === 'darkMode') {
        handleDarkModeStatusBar(value);
      }
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
