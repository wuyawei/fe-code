(function() {
    var _state;
    function useState(initialValue) {
      _state = _state | initialValue;
      function setState(newState) {
        _state = newState;
        render();
      }
      return [_state, setState];
    }
})();