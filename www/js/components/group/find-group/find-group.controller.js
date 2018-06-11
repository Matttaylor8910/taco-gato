(function () {
  angular
    .module('taco.find-group', [])
    .controller('FindGroupController', FindGroupController);

  function FindGroupController($rootScope, $ionicModal, $state, firebaseService, $ionicHistory) {
    var $ctrl = this;

    $ctrl.groups = firebaseService.groups;

    $rootScope.$on('firebase.groupsUpdated', reloadData);
    function reloadData() {
      $ctrl.groups = firebaseService.groups;
    }

    $ctrl.getGroupCreatorName = getGroupCreatorName;
    function getGroupCreatorName(group) {
      if (!group.creatorId) return 'TacoGato Staff';

      var user = _(firebaseService.users)
        .find(function (user) {
          return user.id === group.creatorId;
        });

      return user.name;
    }

    $ctrl.joinGroup = joinGroup;
    function joinGroup(group) {
      firebaseService.assignUserToGroup(group.key);

      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });
      $state.go('app.leaderboard');
    }
  }
})();
