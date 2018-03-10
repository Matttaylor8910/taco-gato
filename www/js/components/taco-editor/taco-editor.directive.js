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
        $scope.tacos = $scope.event ? $scope.event.tacos : 1;
        $scope.modal.show();
      }

      function save(tacos) {
        if ($scope.event) {
          firebaseService.editTacos($scope.event, tacos);
        }
        else {
          firebaseService.addTacos(tacos);
        }
        $scope.modal.hide();
      }
    }
  }
})();
