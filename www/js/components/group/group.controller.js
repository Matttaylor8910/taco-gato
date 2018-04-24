(function () {
  angular
    .module('taco.group', ['taco.create-group', 'taco.find-group', 'taco.join-group'])
    .controller('GroupController', GroupController);

  function GroupController($ionicModal, $state, firebaseService, $ionicHistory) {
    var $ctrl = this;

    $ctrl.goToCreateGroup = goToCreateGroup;
    $ctrl.goToFindGroup = goToFindGroup;
    $ctrl.goToJoinGroup = goToJoinGroup;
    $ctrl.hasGroup = firebaseService.hasGroup;

    function goToCreateGroup() {
      $state.go('app.create-group')
    }

    function goToFindGroup() {
      $state.go('app.find-group')
    }

    function goToJoinGroup() {
      $state.go('app.join-group')
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

    // todo: refactor with leaderboard.controller
    $ctrl.groupName = groupName;
    function groupName() {
      if (!firebaseService.hasGroup()) return '';

      var group = firebaseService.getGroup(firebaseService.user.groupId);
      return group.name;
    }
  }
})();
