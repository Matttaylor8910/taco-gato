(function () {
  angular
    .module('taco')
    .filter('tacoFilter', tacoFilter);

  function tacoFilter() {
    return function (numTacos) {
      var returnVal = '';
      while (numTacos > 0) {
        numTacos--;
        returnVal += '🌮';
      }
      return returnVal;
    }
  }
})();
