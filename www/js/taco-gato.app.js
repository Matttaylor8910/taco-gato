(function () {
  angular
    .module('taco', [
      'ionic',
      'ionic.utils',
      'firebase',
      'angularMoment',

      'taco.tabs',
      'taco.welcome',
      'taco.login',
      'taco.sign-up',
      'taco.link-account',
      'taco.settings',
      'taco.overview',
      'taco.leaderboard',
      'taco.activity',
      'taco.editor',
      'taco.group'
    ])

    // set up some default platform configurations
    .config(function ($ionicConfigProvider) {
      $ionicConfigProvider.navBar.alignTitle('center');
      $ionicConfigProvider.tabs.style('standard').position('bottom');
      $ionicConfigProvider.backButton.text('').icon('ion-android-arrow-back');
    })

    .run(function($ionicPlatform, firebaseConfig) {
      $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
          // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
          // for form inputs)
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

          // Don't remove this line unless you know what you are doing. It stops the viewport
          // from snapping when text inputs are focused. Ionic handles this internally for
          // a much nicer keyboard experience.
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }
      });

      // connect to firebase
      firebase.initializeApp(firebaseConfig);


    });

})();
