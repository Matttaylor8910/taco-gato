(function () {
  angular
    .module('taco')
    .factory('authService', authService);

  function authService($firebaseAuth, $ionicHistory, $state, firebaseService) {

    var service = {
      loginWithEmailPassword: loginWithEmailPassword,
      logout: logout,
      signUp: signUp
    };

    init();

    return service;

    function init() {
      setOnAuthStateChanged();
    }

    function setOnAuthStateChanged() {
      $firebaseAuth().$onAuthStateChanged(function (firebaseUser) {
        if (firebaseUser) {
          console.log("Signed in as:", firebaseUser.uid);
          if (firebaseUser.uid) {
            var user = firebaseService.getUserWithFirebaseUserId(firebaseUser.uid);
            if (user) {
              firebaseService.setUser(user);
              goToOverview(user.key);
            }
          }
        } else {
          console.log("Signed out");
        }
      });
    }

    function loginWithEmailPassword(email, password) {
      $firebaseAuth().$signInWithEmailAndPassword(email, password).then(function () {
        // Never called because of page redirect
        // Instead, use $onAuthStateChanged() to detect successful authentication
      }).catch(function (error) {
        console.error("Authentication failed:", error);
      });
    }

    function logout() {
      $firebaseAuth().$signOut();
    }

    function signUp(email, password) {

      return $firebaseAuth().$createUserWithEmailAndPassword(email, password)

    }

    function goToOverview(firebaseUserId) {
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });
      $state.go('app.overview', {userId: firebaseUserId});
    }

    function goToWelcome(firebaseUserId) {
      debugger;
      $state.go('welcome', {firebaseUserId: firebaseUserId});
    }
  }
})();
