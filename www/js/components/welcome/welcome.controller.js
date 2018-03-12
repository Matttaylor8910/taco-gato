(function () {
  angular
    .module('taco.welcome', [
      'taco.overview.signin'
    ])
    .controller('WelcomeController', WelcomeController);

  function WelcomeController($scope, $state, $ionicModal, $ionicHistory, firebaseService) {
    var $ctrl = this;

    $ctrl.newUser = false; // set to false till we know
    $ctrl.user = {
      name: '',
      tacos: undefined
    };

    $ctrl.saveUser = saveUser;
    $ctrl.logBackIn = logBackIn;

    $scope.$on('$ionicView.beforeEnter', init);

    function init() {
      if (firebaseService.user.id) {
        goToOverview(firebaseService.user.id);
      }
      else {
        $ctrl.newUser = true;
      }

      $ionicModal.fromTemplateUrl('js/components/welcome/welcome-help.modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
      });
    }

    function saveUser() {
      $ctrl.user.tacos = parseInt($ctrl.user.tacos || 0);
      firebaseService.addUser($ctrl.user).then(function (user) {
        goToOverview(user.id);
      });
    }

    function logBackIn() {
      $scope.modal.hide();
      $state.go('welcome-sign-in');
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
