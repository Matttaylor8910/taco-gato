(function () {
  angular
    .module('taco.settings', [])
    .directive('settings', settings);

  function settings($ionicModal, $state, firebaseService, settings, authService, $ionicHistory) {
    var directive = {
      restrict: 'A',
      replace: true,
      template: '<button class="button button-icon ion-gear-a button-clear button-positive"></button>',
      link: link
    };

    return directive;

    function link($scope, $elem) {
      $scope.settings = settings;

      $scope.updateUser = updateUser;
      $scope.isInvalid = isInvalid;
      $scope.logOut = logOut;
      $scope.migrateTacos = migrateTacos;

      $elem.on('click', openModal);
      init();

      function init() {
        $ionicModal.fromTemplateUrl('js/components/settings/settings.modal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function (modal) {
          $scope.modal = modal;
        });
      }

      function openModal () {
        $scope.editableUser = _.clone(firebaseService.user);
        $scope.modal.show();
      }

      function updateUser() {
        firebaseService.editUser($scope.editableUser);
        $scope.modal.hide();
      }

      function isInvalid() {
        if (firebaseService.user && $scope.editableUser) {
          var nameIsEmpty = !$scope.editableUser.name;
          var nameIsSame = firebaseService.user.name === $scope.editableUser.name;
          var realNameIsEmpty = !$scope.editableUser.realName;
          var realNameIsSame = firebaseService.user.realName === $scope.editableUser.realName;
          return (nameIsEmpty || nameIsSame) && (realNameIsEmpty || realNameIsSame);
        }
        else {
          return true;
        }
      }

      function logOut() {
        authService.logout();
        firebaseService.clearUser();
        $scope.modal.hide();

        $ionicHistory.nextViewOptions({
          disableBack: true,
          historyRoot: true
        });
        $state.go('welcome');
      }

      function migrateTacos() {
        firebaseService.migrateTacos();
      }
    }
  }
})();
