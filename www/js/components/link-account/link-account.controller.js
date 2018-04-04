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

    function updateUser(user) {
      $ctrl.firebaseService.user.firebaseUserId = user.uid;
      $ctrl.firebaseService.user.realName  = $ctrl.model.realName;
      firebaseService.linkUserToFirebaseUser($ctrl.firebaseService.user);
    }

  }
})();
