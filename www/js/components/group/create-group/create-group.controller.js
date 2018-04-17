(function () {
  angular
    .module('taco.create-group', [])
    .controller('CreateGroupController', CreateGroupController);

  function CreateGroupController($ionicModal, $state, firebaseService, $ionicHistory) {
    var $ctrl = this;

    $ctrl.createGroup = createGroup;
    $ctrl.group = {
      name: ''
    };

    function createGroup() {
      // todo: add some type of validation.
      firebaseService.createGroup($ctrl.group, firebaseService.user)
        .then(function (group) {
          firebaseService.assignUserToGroup(firebaseService.user, group.key);
        });

      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });
      $state.go('app.leaderboard');
    }
  }
})();
