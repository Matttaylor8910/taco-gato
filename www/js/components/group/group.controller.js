(function () {
  angular
    .module('taco.group', ['taco.create-group', 'taco.find-group'])
    .controller('GroupController', GroupController);

  function GroupController($state, firebaseService, $ionicHistory) {
    var $ctrl = this;

    $ctrl.goToCreateGroup = goToCreateGroup;
    $ctrl.goToFindGroup = goToFindGroup;
    $ctrl.hasGroup = firebaseService.hasGroup;
    $ctrl.groupName = firebaseService.getGroupName;

    function goToCreateGroup() {
      $state.go('app.create-group')
    }

    function goToFindGroup() {
      $state.go('app.find-group')
    }

    $ctrl.leaveGroup = leaveGroup;
    function leaveGroup() {
      firebaseService.unassignUserFromGroup();

      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });
      $state.go('app.leaderboard');
    }

  }
})();
