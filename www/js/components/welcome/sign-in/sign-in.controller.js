(function () {
  angular
    .module('taco.overview.signin', [])
    .controller('SignInController', SignInController);

  function SignInController($state, $ionicHistory, firebaseService) {
    var $ctrl = this;

    $ctrl.firebase = firebaseService;

    $ctrl.selectUser = selectUser;
    $ctrl.signIn = signIn;

    function selectUser(userItem) {
      _.each(firebaseService.users, function (user) {
        user.selected = user === userItem;
      });
    }

    function signIn(userItem) {
      firebaseService.setUser(userItem);
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $state.go('overview', {userId: userItem.key});
    }
  }
})();
