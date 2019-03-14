(function () {
  angular
    .module('taco')
    .service('infiniteScroll', infiniteScroll);

  function infiniteScroll() {
    var itemsToLoad = 5;

    var service = {
      loadMore: loadMore,
      canLoadMore: canLoadMore
    };

    return service;

    /**
     * Load more records based on itemsToLoad, unless override is specified
     */
    function loadMore(displayList, bigList, override) {
      var items = displayList || [];

      var start = items.length;
      var end = start + (override || itemsToLoad);

      for (var i = start; i < end; i++) {
        if (i < bigList.length) {
          items.push(bigList[i]);
        }
      }

      return items;
    }

    /**
     * @returns true if there are more items to load
     */
    function canLoadMore(records, bigList) {
      return records && bigList && records.length < bigList.length;
    }
  }
})();
