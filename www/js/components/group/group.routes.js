(function () {
  angular
    .module('taco.group')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('group', {
        url: '/group',
        templateUrl: 'js/components/group/group.tpl.html',
        controller: 'GroupController',
        controllerAs: '$ctrl'
      })
      .state('create-group', {
        url: '/create-group',
        templateUrl: 'js/components/group/create-group/create-group.tpl.html',
        controller: 'CreateGroupController',
        controllerAs: '$ctrl'
      })
      .state('find-group', {
        url: '/find-group',
        templateUrl: 'js/components/group/find-group/find-group.tpl.html',
        controller: 'FindGroupController',
        controllerAs: '$ctrl'
      })
      .state('join-group', {
        url: '/join-group',
        templateUrl: 'js/components/group/join-group/join-group.tpl.html',
        controller: 'JoinGroupController',
        controllerAs: '$ctrl'
      })
  }
})();
