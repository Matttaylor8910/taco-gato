(function () {
  angular
    .module('taco.groupsLeaderboard')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('app.groups-leaderboard', {
        url: '/groups',
        views: {
          'groups' : {
            templateUrl: 'js/components/groups-leaderboard/groups-leaderboard.tpl.html',
            controller: 'GroupsLeaderboardController',
            controllerAs: '$ctrl'
          }
        }
      })
      .state('app.group-leaderboard', {
        url: '/groups/:groupId',
        views: {
          'groups' : {
            templateUrl: 'js/components/groups-leaderboard/group-leaderboard/group-leaderboard.tpl.html',
            controller: 'GroupLeaderboardController',
            controllerAs: '$ctrl'
          }
        }
      });
  }
})();
