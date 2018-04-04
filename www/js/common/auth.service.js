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
            // // TODO: remove checking if the user is already logged-in in later builds. It's only necessary while porting everyone from build 0.0.14
            // // If the user is previously logged in, we need to check whether they have linked their firebaseUser.
            // // If not, then we need to simply add it.
            // var isLoggedIn = !_(firebaseService.user).isEmpty();
            // if (isLoggedIn) {
            //   var isLinked = (!!firebaseService.user.firebaseUserId);
            //   if (isLoggedIn && !isLinked) {
            //     firebaseService.linkUserToFirebaseUser(firebaseService.user, firebaseUser.uid);
            //   }
            //
            //   goToOverview(firebaseService.user.id);
            // }
            // else {
              var user = firebaseService.getUserWithFirebaseUserId(firebaseUser.uid);
              if (user) {
                // existing user
                goToOverview(user.key);
              }
              // else {
              //   // new user
              //   goToWelcome(firebaseUser.uid);
              // }
            }
          // }
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
