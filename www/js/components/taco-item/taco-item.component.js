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

  function controller(firebaseService, $ionicPopup) {
    var $ctrl = this;

    $ctrl.firebase = firebaseService;

    $ctrl.$onInit = onChanges;
    $ctrl.$onChanges = onChanges;
    $ctrl.editEvent = editEvent;

    function onChanges() {
      if (firebaseService.user.id && $ctrl.event) {
        $ctrl.you = firebaseService.user.id === $ctrl.event.userId;
      }
    }

    function editEvent() {
      console.log('edit', $ctrl.event);
      $ionicPopup.alert({
        title: 'Editing taco events coming soon!'
      });
    }
  }
})();
