(function () {
  angular
    .module('taco.welcome', [])
    .controller('WelcomeController', WelcomeController);

  function WelcomeController($scope, $state, $ionicHistory, firebaseService) {
    var $ctrl = this;
  }
})();
