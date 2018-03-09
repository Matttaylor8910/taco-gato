(function () {
  angular
    .module('taco.activity', [])
    .controller('ActivityController', ActivityController);

  function ActivityController(firebaseService) {
    var $ctrl = this;

    $ctrl.firebase = firebaseService;
  }
})();
