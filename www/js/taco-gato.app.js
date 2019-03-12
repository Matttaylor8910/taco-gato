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
        if(window.Keyboard && window.Keyboard.hideFormAccessoryBar) {
          // show the accessory bar
          Keyboard.hideFormAccessoryBar(false);
        }
      });

      // connect to firebase
      firebase.initializeApp(firebaseConfig);
    });

})();
