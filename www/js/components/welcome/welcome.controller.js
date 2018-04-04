(function () {
  angular
    .module('taco.welcome', [])
    .controller('WelcomeController', WelcomeController);

  function WelcomeController($scope, $state, $ionicHistory, firebaseService) {
    var $ctrl = this;

    $ctrl.user = {
      name: '',
      realName: '',
      firebaseUserId: '',
      tacos: undefined
    };

    $ctrl.saveUser = saveUser;

    function saveUser() {
      $ctrl.user.tacos = parseInt($ctrl.user.tacos || 0);
      $ctrl.user.firebaseUserId = $state.params.firebaseUserId;
      firebaseService.addUser($ctrl.user).then(function (user) {
        goToOverview(user.id);
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
