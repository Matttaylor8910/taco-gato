(function () {
  angular
    .module('taco.welcome', [])
    .controller('WelcomeController', WelcomeController);

  function WelcomeController($state, firebaseService) {
    var $ctrl = this;

    $ctrl.newUser = false; // set to false till we know
    $ctrl.user = {
      name: '',
      tacos: 0
    };

    $ctrl.saveUser = saveUser;

    init();

    function init() {
      if (firebaseService.user.id) {
        goToOverview(firebaseService.user.id);
      }
      else {
        $ctrl.newUser = true;
      }
    }

    function saveUser() {
      $ctrl.user.tacos = parseInt($ctrl.user.tacos);
      firebaseService.addUser($ctrl.user).then(function (user) {
        goToOverview(user.id);
      });
    }

    function goToOverview(id) {
      $state.go('overview', {id: id});
    }
  }
})();
