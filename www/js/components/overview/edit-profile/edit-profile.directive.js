(function () {
  angular
    .module('taco.overview.profile', [])
    .directive('editProfile', tacoEditor);

  function tacoEditor($ionicModal, $state, firebaseService) {
    var directive = {
      restrict: 'A',
      scope: {
        user: '<editProfile'
      },
      link: link
    };


    return directive;

    function link($scope, $elem) {

      $scope.updateUser = updateUser;
      $scope.isInvalid = isInvalid;
      $scope.logOut = logOut;

      $elem.on('click', openModal);
      init();

      function init() {
        $ionicModal.fromTemplateUrl('js/components/overview/edit-profile/edit-profile.modal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function (modal) {
          $scope.modal = modal;
        });
      }

      function openModal () {
        $scope.editableUser = _.clone($scope.user);
        $scope.modal.show();
      }

      function updateUser() {
        firebaseService.editUser($scope.editableUser);
        $scope.modal.hide();
      }

      function isInvalid() {
        if ($scope.user && $scope.editableUser) {
          var nameIsEmpty = !$scope.editableUser.name;
          var nameIsSame = $scope.user.name === $scope.editableUser.name;
          return nameIsEmpty || nameIsSame;
        }
        else {
          return true;
        }
      }

      function logOut() {
        firebaseService.clearUser();
        $scope.modal.hide();
        $state.go('welcome');
      }
    }
  }
})();
