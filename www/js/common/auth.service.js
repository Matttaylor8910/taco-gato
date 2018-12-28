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
          if (firebaseUser.uid) {
            var user = firebaseService.getUserWithFirebaseUserId(firebaseUser.uid);
          if (user) {
              firebaseService.setUser(user);
              goToOverview(user.id);
            }
          }
        } else {
          firebaseService.clearUser();
          
          // if views is defined, the user is viewing a page in the app, 
          // so we need to kick them back to the welcome page
          if ($state.current.views) {
            $ionicHistory.nextViewOptions({historyRoot: true});
            $state.go('welcome');
          }
        }
      });
    }

    function loginWithEmailPassword(email, password) {
      return $firebaseAuth().$signInWithEmailAndPassword(email, password).then(function () {
        // Never called because of page redirect
        // Instead, use $onAuthStateChanged() to detect successful authentication
      });
    }

    function logout() {
      $firebaseAuth().$signOut();
    }

    function signUp(email, password) {
      return $firebaseAuth().$createUserWithEmailAndPassword(email, password);

    }

    function goToOverview(firebaseUserId) {
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });
      $state.go('app.overview', {userId: firebaseUserId});
    }
  }
})();
