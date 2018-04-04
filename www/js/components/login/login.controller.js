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

    // TODO: We can remove this once we finally port everyone over to the new oAuth stuff.
    // If the user was previously logged in, but not through oAuth, then we need to
    // have them link their account to an oAuth account.
    if (firebaseService.user) {
      if (firebaseService.user.firebaseUserId) {
        goToOverview(firebaseService.user.id);
      }
      else {
        goToLinkAccount();
      }
    }

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

    function goToOverview(id) {
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });
      $state.go('app.overview', {userId: id});
    }

    function goToLinkAccount() {
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true,
        disableAnimate: true
      });
      $state.go('link-account');
    }

  }
})();
