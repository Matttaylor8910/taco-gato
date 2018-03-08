(function () {
  angular
    .module('taco')
    .factory('settings', settings);

  function settings(localStorage) {
    var service = {
      example: setting('example', false),

      setProperty: setProperty
    };

    return service;

    /**
     * Set a setting to localstorage
     * @param property
     * @param value
     */
    function setProperty(property, value) {
      service[property] = value;
      localStorage.setObject(property, value);
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
  }
})();
