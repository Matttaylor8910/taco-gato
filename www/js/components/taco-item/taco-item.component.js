(function () {
  angular
    .module('taco')
    .component('tacoItem', {
      templateUrl: 'js/components/taco-item/taco-item.tpl.html',
      controller: controller,
      bindings: {
        event: '<'
      }
    });

  function controller($state, firebaseService) {
    var $ctrl = this;

    $ctrl.firebase = firebaseService;

    $ctrl.$onInit = onChanges;
    $ctrl.$onChanges = onChanges;
    $ctrl.goToEventDetail = goToEventDetail;

    function onChanges() {
      if (firebaseService.user.id && $ctrl.event) {
        $ctrl.you = firebaseService.user.id === $ctrl.event.userId;
      }
    }

    function goToEventDetail() {
      if (!$state.current.name.includes('overview')) {
        $state.go('activity-overview', {userId: $ctrl.event.userId});
      }
      // $state.go($state.current.name + '-event-detail', {eventId: $ctrl.event.id});
    }
  }
})();
