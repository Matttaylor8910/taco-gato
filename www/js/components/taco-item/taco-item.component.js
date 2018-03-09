(function () {
  angular
    .module('taco')
    .component('tacoItem', {
      templateUrl: 'js/components/taco-item/taco-item.tpl.html',
      bindings: {
        event: '<'
      }
    });
})();
