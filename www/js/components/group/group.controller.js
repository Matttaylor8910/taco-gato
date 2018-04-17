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
      $state.go('create-group')
    }

    function goToFindGroup() {
      $state.go('find-group')
    }

    function goToJoinGroup() {
      $state.go('join-group')
    }

    function createGroup() {
      // todo: add some type of validation.
      var groupKey = firebaseService.createGroup($scope.group);
      firebaseService.assignUserToGroup($scope.group);
      $scope.modal.hide();
    }
  }
})();
