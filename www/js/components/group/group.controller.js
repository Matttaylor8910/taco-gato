(function () {
  angular
    .module('taco.group', ['taco.create-group', 'taco.find-group', 'taco.join-group'])
    .controller('GroupController', GroupController);

  function GroupController($ionicModal, $state, firebaseService, $ionicHistory) {
    var $ctrl = this;

    $ctrl.createGroup = createGroup;
    $ctrl.goToCreateGroup = goToCreateGroup;
    $ctrl.goToFindGroup = goToFindGroup;
    $ctrl.goToJoinGroup = goToJoinGroup;

    function goToCreateGroup() {
      $state.go('app.create-group')
    }

    function goToFindGroup() {
      $state.go('app.find-group')
    }

    function goToJoinGroup() {
      $state.go('app.join-group')
    }
  }
})();
