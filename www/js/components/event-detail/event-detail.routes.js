(function () {
  angular
    .module('taco.eventDetail')
    .config(config);

  function config($stateProvider) {
    $stateProvider
      .state('app.activity-event-detail', {
        url: '/activity/event/:eventId',
        views: {
          'activity': {
            templateUrl: 'js/components/event-detail/event-detail.tpl.html',
            controller: 'EventDetailController',
            controllerAs: '$ctrl'
          }
        }
      });
  }
})();
