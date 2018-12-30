(function () {
  angular
    .module('taco.create-group', [])
    .controller('CreateGroupController', CreateGroupController);

  function CreateGroupController($ionicModal, $state, firebaseService, $ionicHistory) {
    var $ctrl = this;

    // disallow double taps
    $ctrl.created = false;

    $ctrl.createGroup = createGroup;
    $ctrl.isInvalid = isInvalid;
    $ctrl.group = {
      name: ''
    };

    function createGroup() {
      // short-circuit in case anything fucky is happening
      if ($ctrl.created) return;
      else $ctrl.created = true;

      firebaseService.createGroup($ctrl.group, firebaseService.user)
        .then(function (group) {
          firebaseService.assignUserToGroup(group.key);
        });

      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });
      $state.go('app.leaderboard');
    }

    function isInvalid() {
      return !$ctrl.group.name;
    }
  }
})();
