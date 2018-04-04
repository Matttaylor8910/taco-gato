(function () {
  angular
    .module('taco.link-account', [])
    .controller('LinkAccountController', LinkAccountController);

  function LinkAccountController($state, $firebaseAuth, firebaseService, authService) {
    var $ctrl = this;

    $ctrl.model = {
      email: "",
      password: "",
      realName: ""
    };

    $ctrl.firebaseService = firebaseService;

    $ctrl.signUp = signUp;

    function signUp() {
      authService.signUp($ctrl.model.email, $ctrl.model.password)
        .then(updateUser)
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

    function updateUser(user) {
      $ctrl.firebaseService.user.firebaseUserId = user.uid;
      firebaseService.linkUserToFirebaseUser($ctrl.firebaseService.user);
    }

  }
})();
