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
      var dateFormat = 'ddd MMM D';
      var timeFormat = ', h:mm a';

      $scope.tacos = 1;
      $scope.confirmRemove = false;
      $scope.time = undefined;
      $scope.future = false;

      $scope.save = save;
      $scope.setConfirmRemove = setConfirmRemove;
      $scope.remove = remove;
      $scope.increment = increment;
      $scope.decrement = decrement;
      $scope.timeChanged = timeChanged;
      $scope.isDisabled = isDisabled;

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

      function openModal($event) {
        $event.stopPropagation();
        $scope.confirmRemove = false;
        $scope.tacos = $scope.event ? $scope.event.tacos : 1;
        $scope.modal.show();

        // set up the time for the first time
        setUpTime();
      }

      function save(tacos) {
        $scope.modal.hide().then(function() {
          if ($scope.event) {
            firebaseService.editTacos($scope.event, tacos, $scope.time.unix);
          }
          else {
            firebaseService.addTacos(tacos, $scope.time.unix);
          }
        });
      }

      function setConfirmRemove(remove) {
        $scope.confirmRemove = remove;
      }

      function remove() {
        $scope.modal.hide().then(function() {
          firebaseService.deleteTacos($scope.event);
        });
      }

      function increment() {
        $scope.tacos++;
      }

      function decrement() {
        $scope.tacos--;
      }

      /**
       * Set up an inital date object and display text for this event
       */
      function setUpTime() {
        if ($scope.event) {
          $scope.time = {
            value: new Date($scope.event.time * 1000)
          };
        }
        else {
          $scope.time = {
            value: new Date()
          }
        }

        timeChanged();
      }

      /**
       * When the datetime picker changes, update the text and the unix value to save
       */
      function timeChanged() {
        // if they clear the datetime value, reset the time and hide the keyboard on native
        if (!$scope.time.value) {
          setUpTime();

          if (window.Keyboard && window.Keyboard.hide) {
            Keyboard.hide();
          }
        }

        // update the time text and unix timestamo for this date
        var thisMoment = moment($scope.time.value);
        $scope.time.text = getTimeText(thisMoment);
        $scope.time.unix = thisMoment.unix();

        // show a message when the time selected is in the future
        $scope.future = isInTheFuture(thisMoment);
      }

      /**
       * Get the time text to show for the button 
       * @param {*} thisMoment a moment object
       */
      function getTimeText(thisMoment) {
        var today = thisMoment.format('DDMMYYYY') === moment().format('DDMMYYYY');
        return (today ? 'Today' : thisMoment.format(dateFormat)) + thisMoment.format(timeFormat);
      }

      /**
       * Determine if the button should be in a disabled state
       */
      function isDisabled() {
        return $scope.tacos <= 0 || // you need positive tacos!

        $scope.future || // the time selected is in the future

        // also disabled if nothing has changed for existing event
        ($scope.event && $scope.tacos === $scope.event.tacos &&
          $scope.time && $scope.time.unix === $scope.event.time)
      }

      /**
       * 
       * @param {*} thisMoment 
       */
      function isInTheFuture(thisMoment) {
        return thisMoment.diff(moment()) > 0;
      }
    }
  }
})();
