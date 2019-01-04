(function () {
  angular
    .module('taco.group')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('app.group', {
        url: '/group',
        views: {
          'leaderboard': {
            templateUrl: 'js/components/group/group.tpl.html',
            controller: 'GroupController',
            controllerAs: '$ctrl'
          }
        }
      })
      .state('app.create-group', {
        url: '/create-group',
        views: {
          'leaderboard': {
            templateUrl: 'js/components/group/create-group/create-group.tpl.html',
            controller: 'CreateGroupController',
            controllerAs: '$ctrl'
          }
        }
      })
      .state('app.find-group', {
        url: '/find-group',
        views: {
          'leaderboard': {
            templateUrl: 'js/components/group/find-group/find-group.tpl.html',
            controller: 'FindGroupController',
            controllerAs: '$ctrl'
          }
        }
      });
  }
})();
