(function () {
  angular
    .module('taco.welcome', [])
    .controller('WelcomeController', WelcomeController);

  function WelcomeController(firebaseService) {
    var $ctrl = this;

    $ctrl.user = {
      name: '',
      tacos: 0
    };

    $ctrl.saveUser = saveUser;

    function saveUser() {
      $ctrl.user.tacos = parseInt($ctrl.user.tacos);
      firebaseService.addUser($ctrl.user);
    }
  }
})();
