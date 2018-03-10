(function () {
  angular
    .module('taco.editor', [])
    .directive('tacoEditor', tacoEditor);

  function tacoEditor($ionicModal, firebaseService) {
    var directive = {
      restrict: 'A',
      scope: {
        event: '<'
      },
      link: link
    };


    return directive;

    function link($scope, $elem) {
      $scope.tacos = 1;

      $scope.save = save;
      $scope.cancel = closeAndResetModal;
      $elem.on('click', openModal);
      init();

      function init() {
        $ionicModal.fromTemplateUrl('js/components/taco-editor/taco-editor.modal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function (modal) {
          $scope.modal = modal;
        });
      }

      function openModal () {
        $scope.modal.show();
      }

      function save(tacos) {
        firebaseService.addTacos(tacos);
        closeAndResetModal();
      }

      function closeAndResetModal() {
        $scope.modal.hide().then(function () {
          $scope.tacos = 1;
        });
      }
    }
  }
})();
