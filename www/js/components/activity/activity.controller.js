(function () {
  angular
    .module('taco.activity', [
      'taco.eventDetail'
    ])
    .controller('ActivityController', ActivityController);

  function ActivityController(firebaseService) {
    var $ctrl = this;

    $ctrl.firebase = firebaseService;
  }
})();
