(function () {
  angular
    .module('taco.login', [])
    .controller('LoginController', LoginController);

  function LoginController($state, $firebaseAuth, $ionicHistory, $ionicPopup, $timeout, firebaseService, authService) {
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
      authService.loginWithEmailPassword($ctrl.model.email, $ctrl.model.password)
        .catch(function (error) {
          var errorMessage = "";
          switch(error.code) {
            case "auth/email-already-in-use":
              errorMessage = "Email already in use";
              break;
            case "auth/invalid-email":
              errorMessage = "Invalid email";
              break;
            case "auth/operation-not-allowed":
              errorMessage = "Operation not allowed";
              break;
            case "auth/weak-password":
              errorMessage = "Too weak of password";
              break;
            case "auth/network-request-failed":
              errorMessage = "Network request failed";
              break;
            case "auth/wrong-password":
              errorMessage = "Invalid email & password combination";
              break;
          }

          var myPopup = $ionicPopup.show({
            title: 'Error',
            subTitle: errorMessage
          });

          // close the popup after 1 second
          $timeout(function() {
            myPopup.close();
          }, 1000);
        });
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
