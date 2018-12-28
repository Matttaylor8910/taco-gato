(function () {
  angular
    .module('taco.welcome', [])
    .controller('WelcomeController', WelcomeController);

  function WelcomeController(firebaseService, authService) {
    var $ctrl = this;
  }
})();
