(function () {
  angular
    .module('taco.activity', [
      'taco.eventDetail'
    ])
    .controller('ActivityController', ActivityController);

  function ActivityController($scope, $rootScope, infiniteScroll, firebaseService) {
    var $ctrl = this;

    $ctrl.activity = undefined;
    $ctrl.firebase = firebaseService;
    
    $ctrl.loadMore = loadMore;
    $ctrl.canLoadMore = canLoadMore;

    loadMore();

    $rootScope.$on('firebase.leaderboardUpdated', activityUpdated);

    function activityUpdated() {
      var length = $ctrl.activity ? $ctrl.activity.length : undefined;
      $ctrl.activity = infiniteScroll.loadMore([], $ctrl.firebase.activity, length);
    }

    function loadMore() {
      if ($ctrl.firebase.activity) {
        $ctrl.activity = infiniteScroll.loadMore($ctrl.activity, $ctrl.firebase.activity);
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
    }

    function canLoadMore() {
      return $ctrl.firebase.activity && infiniteScroll.canLoadMore($ctrl.activity, $ctrl.firebase.activity);
    }
  }
})();
