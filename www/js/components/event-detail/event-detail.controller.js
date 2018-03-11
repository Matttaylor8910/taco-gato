(function () {
  angular
    .module('taco.eventDetail', [])
    .controller('EventDetailController', EventDetailController);

  function EventDetailController($scope, $state) {
    var $ctrl = this;

    $scope.$on('$ionicView.beforeEnter', getEvent);

    function getEvent() {
      console.log($state.params.eventId);
    }
  }
})();
