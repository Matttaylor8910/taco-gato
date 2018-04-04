(function () {
  angular
    .module('taco.login', [])
    .controller('LoginController', LoginController);

  function LoginController($state, $firebaseAuth, $ionicHistory, firebaseService, authService) {
    var $ctrl = this;

    $ctrl.loginWithFacebook = authService.loginWithFacebook;
    $ctrl.loginWithEmailPassword = loginWithEmailPassword;
    $ctrl.logout = authService.logout;
    $ctrl.goToSignUp = goToSignUp;

    $ctrl.model = {
      email: "",
      password: ""
    };

    function loginWithEmailPassword() {
      authService.loginWithEmailPassword($ctrl.model.email, $ctrl.model.password);
    }

    function goToSignUp() {
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true,
        disableAnimate: true
      });
      $state.go('sign-up');
    }

  }
})();
