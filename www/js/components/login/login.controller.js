(function () {
  angular
    .module('taco.login', [])
    .controller('LoginController', LoginController);

  function LoginController($state, $firebaseAuth, $ionicHistory, firebaseService, authService) {
    var $ctrl = this;

    $ctrl.loginWithFacebook = authService.loginWithFacebook;
    $ctrl.logout = authService.logout;


  }
})();
