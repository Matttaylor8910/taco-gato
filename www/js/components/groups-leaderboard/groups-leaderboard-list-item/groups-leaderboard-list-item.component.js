(function () {
  angular
    .module('taco.groupsLeaderboard')
    .component('groupsLeaderboardListItem', {
      templateUrl: 'js/components/groups-leaderboard/groups-leaderboard-list-item/groups-leaderboard-list-item.tpl.html',
      controller: controller,
      bindings: {
        group: '<',
      }
    });

  function controller($state, firebaseService) {
    var $ctrl = this;
    
    $ctrl.goToGroup = goToGroup;
    $ctrl.getGroupName = getGroupName;

    function goToGroup() {
      $state.go('app.group-leaderboard', {groupId: $ctrl.group.groupId});
    }

    function getGroupName() {
      var group = _.find(firebaseService.groups, ['id', $ctrl.group.groupId]);
      return group ? group.name : '';
    }
  }
})();
