(function () {
  angular
    .module('taco.login', [])
    .controller('LoginController', LoginController);

  function LoginController($firebaseAuth, $ionicHistory) {
    var $ctrl = this;
    $ctrl.firebaseUser = $firebaseAuth.currentUser;

    $ctrl.loginWithFacebook = loginWithFacebook;

    $ctrl.hey = log;
    function log() {
      debugger;
      console.log('hey');
    }

    function loginWithFacebook() {
      debugger;
      $firebaseAuth().$signInWithRedirect("facebook").then(function () {
        // Never called because of page redirect
        // Instead, use $onAuthStateChanged() to detect successful authentication
      }).catch(function (error) {
        console.error("Authentication failed:", error);
      });
      $firebaseAuth().$onAuthStateChanged(function (firebaseUser) {
        if (firebaseUser) {
          console.log("Signed in as:", firebaseUser.uid);
          if (firebaseUser.uid) {
            $state.go('app.welcome');
          }
          else {
            $ctrl.newUser = true;
          }
        } else {
          console.log("Signed out");
        }
      });
    }

    function goToOverview(id) {
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });
      $state.go('app.overview', {userId: id});
    }
  }
})();
