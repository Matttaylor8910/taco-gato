(function () {
  angular
    .module('taco.activity')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('app.activity', {
        url: '/activity',
        views: {
          'activity' : {
            templateUrl: 'js/components/activity/activity.tpl.html',
            controller: 'ActivityController',
            controllerAs: '$ctrl'
          }
        }
      });
  }
})();
