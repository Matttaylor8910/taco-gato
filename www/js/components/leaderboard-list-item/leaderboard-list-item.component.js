(function () {
  angular
    .module('taco')
    .component('leaderboardListItem', {
      templateUrl: 'js/components/leaderboard-list-item/leaderboard-list-item.tpl.html',
      bindings: {
        eater: '<'
      }
    });
})();
