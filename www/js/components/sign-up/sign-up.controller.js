(function () {
  angular
    .module('taco.sign-up', [])
    .controller('SignUpController', SignUpController);

  function SignUpController($state, $firebaseAuth, $ionicHistory, firebaseService, authService) {
    var $ctrl = this;

    $ctrl.model = {
      email: "",
      password: ""
    };

    $ctrl.user = {
      name: '',
      realName: '',
      firebaseUserId: '',
      tacos: undefined
    };

    $ctrl.signUp = signUp;
    $ctrl.goToLogin = goToLogin;

    function signUp() {
      // TODO: we need to do some form validating before we sign up a user.
      authService.signUp($ctrl.model.email, $ctrl.model.password)
        .then(saveUser)
        .catch(function(error) {
          console.error("Authentication failed:", error);

          // todo: add banners to display errors
          switch(error.code) {
            case "auth/email-already-in-use":
            case "auth/invalid-email":
            case "auth/operation-not-allowed":
            case "auth/weak-password":
          }
        });
    }

    function saveUser(user) {
      $ctrl.user.tacos = parseInt($ctrl.user.tacos || 0);
      $ctrl.user.firebaseUserId = user.uid;
      firebaseService.addUser($ctrl.user);
    }

    function goToLogin() {
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true,
        disableAnimate: true
      });
      $state.go('login');
    }
  }
})();
