(function () {
  angular
    .module('taco.welcome', [
      'taco.overview.signin'
    ])
    .controller('WelcomeController', WelcomeController);

  function WelcomeController($scope, $state, $ionicHistory, firebaseService) {
    var $ctrl = this;

    $ctrl.newUser = false; // set to false till we know
    $ctrl.user = {
      name: '',
      tacos: undefined
    };

    $ctrl.saveUser = saveUser;

    $scope.$on('$ionicView.beforeEnter', init);

    function init() {
      if (firebaseService.user.id) {
        goToOverview(firebaseService.user.id);
      }
      else {
        $ctrl.newUser = true;
      }
    }

    function saveUser() {
      $ctrl.user.tacos = parseInt($ctrl.user.tacos || 0);
      firebaseService.addUser($ctrl.user).then(function (user) {
        goToOverview(user.id);
      });
    }

    function goToOverview(id) {
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });
      $state.go('overview', {userId: id});
    }
  }
})();
