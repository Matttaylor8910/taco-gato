(function () {
  angular
    .module('taco.join-group', [])
    .controller('JoinGroupController', JoinGroupController);

  function JoinGroupController($ionicModal, $state, firebaseService, $ionicHistory) {
    var $ctrl = this;

    $ctrl.joinGroup = joinGroup;

    function joinGroup() {

    }
  }
})();
