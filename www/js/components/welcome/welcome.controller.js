(function () {
  angular
    .module('tagoGato.welcome', [])
    .controller('WelcomeController', WelcomeController);

  function WelcomeController() {
    var $ctrl = this;

    $ctrl.user = {
      name: '',
      tacos: 0
    };

    $ctrl.saveUser = saveUser;

    function saveUser() {
      console.log($ctrl.user);
    }
  }
})();
