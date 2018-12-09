'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _messagePreset = require('./message-preset');

var _messagePreset2 = _interopRequireDefault(_messagePreset);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var notDragging = {
  isDragging: false,
  start: null,
  lastDestination: null,
  hasMovedFromStartLocation: false
};

var areLocationsEqual = function areLocationsEqual(current, next) {
  if (current == null && next == null) {
    return true;
  }

  if (current == null || next == null) {
    return false;
  }

  return current.droppableId === next.droppableId && current.index === next.index;
};

var getAnnouncerForConsumer = function getAnnouncerForConsumer(announce) {
  var wasCalled = false;
  var isExpired = false;

  setTimeout(function () {
    isExpired = true;
  });

  var result = function result(message) {
    if (wasCalled) {
      console.warn('Announcement already made. Not making a second announcement');
      return;
    }

    if (isExpired) {
      console.warn('\n        Announcements cannot be made asynchronously.\n        Default message has already been announced.\n      ');
      return;
    }

    wasCalled = true;
    announce(message);
  };

  result.wasCalled = function () {
    return wasCalled;
  };

  return result;
};

exports.default = function (announce) {
  var state = notDragging;

  var setState = function setState(partial) {
    var newState = (0, _extends3.default)({}, state, partial);
    state = newState;
  };

  var getDragStart = function getDragStart(appState) {
    if (!appState.drag) {
      return null;
    }

    var descriptor = appState.drag.initial.descriptor;
    var home = appState.dimension.droppable[descriptor.droppableId];

    if (!home) {
      return null;
    }

    var source = {
      index: descriptor.index,
      droppableId: descriptor.droppableId
    };

    var start = {
      draggableId: descriptor.id,
      type: home.descriptor.type,
      source: source
    };

    return start;
  };

  var execute = function execute(hook, data, getDefaultMessage) {
    if (!hook) {
      announce(getDefaultMessage(data));
      return;
    }

    var managed = getAnnouncerForConsumer(announce);
    var provided = {
      announce: managed
    };

    hook(data, provided);

    if (!managed.wasCalled()) {
      announce(getDefaultMessage(data));
    }
  };

  var onDrag = function onDrag(current, onDragUpdate) {
    if (!state.isDragging) {
      console.error('Cannot process dragging update if drag has not started');
      return;
    }

    var drag = current.drag;
    var start = getDragStart(current);
    if (!start || !drag) {
      console.error('Cannot update drag when there is invalid state');
      return;
    }

    var destination = drag.impact.destination;
    var update = {
      draggableId: start.draggableId,
      type: start.type,
      source: start.source,
      destination: destination
    };

    if (!state.hasMovedFromStartLocation) {
      if (areLocationsEqual(start.source, destination)) {
        return;
      }

      setState({
        lastDestination: destination,
        hasMovedFromStartLocation: true
      });

      execute(onDragUpdate, update, _messagePreset2.default.onDragUpdate);

      return;
    }

    if (areLocationsEqual(state.lastDestination, destination)) {
      return;
    }

    setState({
      lastDestination: destination
    });

    execute(onDragUpdate, update, _messagePreset2.default.onDragUpdate);
  };

  var onStateChange = function onStateChange(hooks, previous, current) {
    var onDragStart = hooks.onDragStart,
        onDragUpdate = hooks.onDragUpdate,
        onDragEnd = hooks.onDragEnd;

    var currentPhase = current.phase;
    var previousPhase = previous.phase;

    if (currentPhase === 'DRAGGING' && previousPhase === 'DRAGGING') {
      onDrag(current, onDragUpdate);
      return;
    }

    if (state.isDragging) {
      setState(notDragging);
    }

    if (currentPhase === previousPhase) {
      return;
    }

    if (currentPhase === 'DRAGGING' && previousPhase !== 'DRAGGING') {
      var _start = getDragStart(current);

      if (!_start) {
        console.error('Unable to publish onDragStart');
        return;
      }

      setState({
        isDragging: true,
        hasMovedFromStartLocation: false,
        start: _start
      });

      execute(onDragStart, _start, _messagePreset2.default.onDragStart);
      return;
    }

    if (currentPhase === 'DROP_COMPLETE' && previousPhase !== 'DROP_COMPLETE') {
      if (!current.drop || !current.drop.result) {
        console.error('cannot fire onDragEnd hook without drag state', { current: current, previous: previous });
        return;
      }
      var result = current.drop.result;

      execute(onDragEnd, result, _messagePreset2.default.onDragEnd);
      return;
    }

    if (currentPhase === 'IDLE' && previousPhase === 'DRAGGING') {
      if (!previous.drag) {
        console.error('cannot fire onDragEnd for cancel because cannot find previous drag');
        return;
      }

      var descriptor = previous.drag.initial.descriptor;
      var home = previous.dimension.droppable[descriptor.droppableId];

      if (!home) {
        console.error('cannot find dimension for home droppable');
        return;
      }

      var source = {
        index: descriptor.index,
        droppableId: descriptor.droppableId
      };
      var _result = {
        draggableId: descriptor.id,
        type: home.descriptor.type,
        source: source,
        destination: null,
        reason: 'CANCEL'
      };

      execute(onDragEnd, _result, _messagePreset2.default.onDragEnd);
      return;
    }

    if (currentPhase === 'IDLE' && previousPhase === 'DROP_ANIMATING') {
      if (!previous.drop || !previous.drop.pending) {
        console.error('cannot fire onDragEnd for cancel because cannot find previous pending drop');
        return;
      }

      var _result2 = {
        draggableId: previous.drop.pending.result.draggableId,
        type: previous.drop.pending.result.type,
        source: previous.drop.pending.result.source,
        destination: null,
        reason: 'CANCEL'
      };

      execute(onDragEnd, _result2, _messagePreset2.default.onDragEnd);
    }
  };

  var caller = {
    onStateChange: onStateChange
  };

  return caller;
};