(function () {
  angular
    .module('taco')
    .component('leaderboardListItem', {
      templateUrl: 'js/components/leaderboard/leaderboard-list-item/leaderboard-list-item.tpl.html',
      controller: controller,
      bindings: {
        eater: '<'
      }
    });

  function controller($state, firebaseService) {
    var $ctrl = this;
    
    $ctrl.goToOverview = goToOverview;

    function goToOverview() {
      $state.go('app.leaderboard-overview', {userId: $ctrl.eater.id});
    }
  }
})();
