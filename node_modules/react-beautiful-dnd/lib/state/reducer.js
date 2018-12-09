'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends6 = require('babel-runtime/helpers/extends');

var _extends7 = _interopRequireDefault(_extends6);

var _memoizeOne = require('memoize-one');

var _memoizeOne2 = _interopRequireDefault(_memoizeOne);

var _position = require('./position');

var _noImpact = require('./no-impact');

var _getDragImpact = require('./get-drag-impact/');

var _getDragImpact2 = _interopRequireDefault(_getDragImpact);

var _moveToNextIndex = require('./move-to-next-index/');

var _moveToNextIndex2 = _interopRequireDefault(_moveToNextIndex);

var _moveCrossAxis = require('./move-cross-axis/');

var _moveCrossAxis2 = _interopRequireDefault(_moveCrossAxis);

var _dimension3 = require('./dimension');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var noDimensions = {
  request: null,
  draggable: {},
  droppable: {}
};

var origin = { x: 0, y: 0 };

var clean = (0, _memoizeOne2.default)(function () {
  var phase = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'IDLE';
  return {
    phase: phase,
    drag: null,
    drop: null,
    dimension: noDimensions
  };
});

var canPublishDimension = function canPublishDimension(phase) {
  return ['IDLE', 'DROP_ANIMATING', 'DROP_COMPLETE'].indexOf(phase) === -1;
};

var move = function move(_ref) {
  var state = _ref.state,
      clientSelection = _ref.clientSelection,
      shouldAnimate = _ref.shouldAnimate,
      windowScroll = _ref.windowScroll,
      impact = _ref.impact,
      scrollJumpRequest = _ref.scrollJumpRequest;

  if (state.phase !== 'DRAGGING') {
    console.error('cannot move while not dragging');
    return clean();
  }

  var last = state.drag;

  if (last == null) {
    console.error('cannot move if there is no drag information');
    return clean();
  }

  var previous = last.current;
  var initial = last.initial;
  var currentWindowScroll = windowScroll || previous.windowScroll;

  var client = function () {
    var offset = (0, _position.subtract)(clientSelection, initial.client.selection);

    var result = {
      offset: offset,
      selection: clientSelection,
      center: (0, _position.add)(offset, initial.client.center)
    };
    return result;
  }();

  var page = {
    selection: (0, _position.add)(client.selection, currentWindowScroll),
    offset: (0, _position.add)(client.offset, currentWindowScroll),
    center: (0, _position.add)(client.center, currentWindowScroll)
  };

  var current = {
    client: client,
    page: page,
    shouldAnimate: shouldAnimate,
    windowScroll: currentWindowScroll,
    hasCompletedFirstBulkPublish: previous.hasCompletedFirstBulkPublish
  };

  var newImpact = impact || (0, _getDragImpact2.default)({
    pageCenter: page.center,
    draggable: state.dimension.draggable[initial.descriptor.id],
    draggables: state.dimension.draggable,
    droppables: state.dimension.droppable,
    previousImpact: last.impact
  });

  var drag = {
    initial: initial,
    impact: newImpact,
    current: current,
    scrollJumpRequest: scrollJumpRequest
  };

  return (0, _extends7.default)({}, state, {
    drag: drag
  });
};

var updateStateAfterDimensionChange = function updateStateAfterDimensionChange(newState, impact) {
  if (newState.phase === 'COLLECTING_INITIAL_DIMENSIONS') {
    return newState;
  }

  if (newState.phase !== 'DRAGGING') {
    return newState;
  }

  if (!newState.drag) {
    console.error('cannot update a draggable dimension in an existing drag as there is invalid drag state');
    return clean();
  }

  return move({
    state: newState,

    clientSelection: newState.drag.current.client.selection,
    shouldAnimate: newState.drag.current.shouldAnimate,
    impact: impact
  });
};

exports.default = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : clean('IDLE');
  var action = arguments[1];

  if (action.type === 'CLEAN') {
    return clean();
  }

  if (action.type === 'PREPARE') {
    return clean('PREPARING');
  }

  if (action.type === 'REQUEST_DIMENSIONS') {
    if (state.phase !== 'PREPARING') {
      console.error('trying to start a lift while not preparing for a lift');
      return clean();
    }

    var request = action.payload;

    return {
      phase: 'COLLECTING_INITIAL_DIMENSIONS',
      drag: null,
      drop: null,
      dimension: {
        request: request,
        draggable: {},
        droppable: {}
      }
    };
  }

  if (action.type === 'PUBLISH_DRAGGABLE_DIMENSION') {
    var dimension = action.payload;

    if (!canPublishDimension(state.phase)) {
      console.warn('dimensions rejected as no longer allowing dimension capture in phase', state.phase);
      return state;
    }

    var newState = (0, _extends7.default)({}, state, {
      dimension: {
        request: state.dimension.request,
        droppable: state.dimension.droppable,
        draggable: (0, _extends7.default)({}, state.dimension.draggable, (0, _defineProperty3.default)({}, dimension.descriptor.id, dimension))
      }
    });

    return updateStateAfterDimensionChange(newState);
  }

  if (action.type === 'PUBLISH_DROPPABLE_DIMENSION') {
    var _dimension = action.payload;

    if (!canPublishDimension(state.phase)) {
      console.warn('dimensions rejected as no longer allowing dimension capture in phase', state.phase);
      return state;
    }

    var _newState = (0, _extends7.default)({}, state, {
      dimension: {
        request: state.dimension.request,
        draggable: state.dimension.draggable,
        droppable: (0, _extends7.default)({}, state.dimension.droppable, (0, _defineProperty3.default)({}, _dimension.descriptor.id, _dimension))
      }
    });

    return updateStateAfterDimensionChange(_newState);
  }

  if (action.type === 'BULK_DIMENSION_PUBLISH') {
    var draggables = action.payload.draggables;
    var droppables = action.payload.droppables;

    if (!canPublishDimension(state.phase)) {
      console.warn('dimensions rejected as no longer allowing dimension capture in phase', state.phase);
      return state;
    }

    var newDraggables = draggables.reduce(function (previous, current) {
      previous[current.descriptor.id] = current;
      return previous;
    }, {});

    var newDroppables = droppables.reduce(function (previous, current) {
      previous[current.descriptor.id] = current;
      return previous;
    }, {});

    var drag = function () {
      var existing = state.drag;
      if (!existing) {
        return null;
      }

      if (existing.current.hasCompletedFirstBulkPublish) {
        return existing;
      }

      var newDrag = (0, _extends7.default)({}, existing, {
        current: (0, _extends7.default)({}, existing.current, {
          hasCompletedFirstBulkPublish: true
        })
      });

      return newDrag;
    }();

    var _newState2 = (0, _extends7.default)({}, state, {
      drag: drag,
      dimension: {
        request: state.dimension.request,
        draggable: (0, _extends7.default)({}, state.dimension.draggable, newDraggables),
        droppable: (0, _extends7.default)({}, state.dimension.droppable, newDroppables)
      }
    });

    return updateStateAfterDimensionChange(_newState2);
  }

  if (action.type === 'COMPLETE_LIFT') {
    if (state.phase !== 'COLLECTING_INITIAL_DIMENSIONS') {
      console.error('trying complete lift without collecting dimensions');
      return state;
    }

    var _action$payload = action.payload,
        id = _action$payload.id,
        client = _action$payload.client,
        _windowScroll = _action$payload.windowScroll,
        autoScrollMode = _action$payload.autoScrollMode;

    var page = {
      selection: (0, _position.add)(client.selection, _windowScroll),
      center: (0, _position.add)(client.center, _windowScroll)
    };

    var draggable = state.dimension.draggable[id];

    if (!draggable) {
      console.error('could not find draggable in store after lift');
      return clean();
    }

    var descriptor = draggable.descriptor;

    var initial = {
      descriptor: descriptor,
      autoScrollMode: autoScrollMode,
      client: client,
      page: page,
      windowScroll: _windowScroll
    };

    var current = {
      client: {
        selection: client.selection,
        center: client.center,
        offset: origin
      },
      page: {
        selection: page.selection,
        center: page.center,
        offset: origin
      },
      windowScroll: _windowScroll,
      hasCompletedFirstBulkPublish: false,
      shouldAnimate: false
    };

    var home = state.dimension.droppable[descriptor.droppableId];

    if (!home) {
      console.error('Cannot find home dimension for initial lift');
      return clean();
    }

    var destination = {
      index: descriptor.index,
      droppableId: descriptor.droppableId
    };

    var _impact = {
      movement: _noImpact.noMovement,
      direction: home.axis.direction,
      destination: destination
    };

    return (0, _extends7.default)({}, state, {
      phase: 'DRAGGING',
      drag: {
        initial: initial,
        current: current,
        impact: _impact,
        scrollJumpRequest: null
      }
    });
  }

  if (action.type === 'UPDATE_DROPPABLE_DIMENSION_SCROLL') {
    if (state.phase !== 'DRAGGING') {
      console.error('cannot update a droppable dimensions scroll when not dragging');
      return clean();
    }

    var _drag = state.drag;

    if (_drag == null) {
      console.error('invalid store state');
      return clean();
    }

    var _action$payload2 = action.payload,
        _id = _action$payload2.id,
        offset = _action$payload2.offset;


    var target = state.dimension.droppable[_id];

    if (!target) {
      console.warn('cannot update scroll for droppable as it has not yet been collected');
      return state;
    }

    var _dimension2 = (0, _dimension3.scrollDroppable)(target, offset);

    var _impact2 = _drag.initial.autoScrollMode === 'JUMP' ? _drag.impact : null;

    var _newState3 = (0, _extends7.default)({}, state, {
      dimension: {
        request: state.dimension.request,
        draggable: state.dimension.draggable,
        droppable: (0, _extends7.default)({}, state.dimension.droppable, (0, _defineProperty3.default)({}, _id, _dimension2))
      }
    });

    return updateStateAfterDimensionChange(_newState3, _impact2);
  }

  if (action.type === 'UPDATE_DROPPABLE_DIMENSION_IS_ENABLED') {
    if (!(0, _keys2.default)(state.dimension.droppable).length) {
      return state;
    }

    var _action$payload3 = action.payload,
        _id2 = _action$payload3.id,
        isEnabled = _action$payload3.isEnabled;

    var _target = state.dimension.droppable[_id2];

    if (!_target) {
      console.warn('cannot update enabled state for droppable as it has not yet been collected');
      return state;
    }

    if (_target.isEnabled === isEnabled) {
      console.warn('trying to set droppable isEnabled to ' + String(isEnabled) + ' but it is already ' + String(isEnabled));
      return state;
    }

    var updatedDroppableDimension = (0, _extends7.default)({}, _target, {
      isEnabled: isEnabled
    });

    var result = (0, _extends7.default)({}, state, {
      dimension: (0, _extends7.default)({}, state.dimension, {
        droppable: (0, _extends7.default)({}, state.dimension.droppable, (0, _defineProperty3.default)({}, _id2, updatedDroppableDimension))
      })
    });

    return updateStateAfterDimensionChange(result);
  }

  if (action.type === 'MOVE') {
    var _action$payload4 = action.payload,
        _client = _action$payload4.client,
        _windowScroll2 = _action$payload4.windowScroll,
        _shouldAnimate = _action$payload4.shouldAnimate;

    var _drag2 = state.drag;

    if (!_drag2) {
      console.error('Cannot move while there is no drag state');
      return state;
    }

    var _impact3 = function () {
      if (!_drag2.current.hasCompletedFirstBulkPublish) {
        return _drag2.impact;
      }

      if (_drag2.initial.autoScrollMode === 'JUMP') {
        return _drag2.impact;
      }

      return null;
    }();

    return move({
      state: state,
      clientSelection: _client,
      windowScroll: _windowScroll2,
      shouldAnimate: _shouldAnimate,
      impact: _impact3
    });
  }

  if (action.type === 'MOVE_BY_WINDOW_SCROLL') {
    var _windowScroll3 = action.payload.windowScroll;

    var _drag3 = state.drag;

    if (!_drag3) {
      console.error('cannot move with window scrolling if no current drag');
      return clean();
    }

    if ((0, _position.isEqual)(_windowScroll3, _drag3.current.windowScroll)) {
      return state;
    }

    var isJumpScrolling = _drag3.initial.autoScrollMode === 'JUMP';

    var _impact4 = isJumpScrolling ? _drag3.impact : null;

    return move({
      state: state,
      clientSelection: _drag3.current.client.selection,
      windowScroll: _windowScroll3,
      shouldAnimate: false,
      impact: _impact4
    });
  }

  if (action.type === 'MOVE_FORWARD' || action.type === 'MOVE_BACKWARD') {
    if (state.phase !== 'DRAGGING') {
      console.error('cannot move while not dragging', action);
      return clean();
    }

    if (!state.drag) {
      console.error('cannot move if there is no drag information');
      return clean();
    }

    var existing = state.drag;
    var isMovingForward = action.type === 'MOVE_FORWARD';

    if (!existing.impact.destination) {
      console.error('cannot move if there is no previous destination');
      return clean();
    }

    var droppable = state.dimension.droppable[existing.impact.destination.droppableId];

    var _result = (0, _moveToNextIndex2.default)({
      isMovingForward: isMovingForward,
      draggableId: existing.initial.descriptor.id,
      droppable: droppable,
      draggables: state.dimension.draggable,
      previousPageCenter: existing.current.page.center,
      previousImpact: existing.impact
    });

    if (!_result) {
      return state;
    }

    var _impact5 = _result.impact;
    var _page = _result.pageCenter;
    var _client2 = (0, _position.subtract)(_page, existing.current.windowScroll);

    return move({
      state: state,
      impact: _impact5,
      clientSelection: _client2,
      shouldAnimate: true,
      scrollJumpRequest: _result.scrollJumpRequest
    });
  }

  if (action.type === 'CROSS_AXIS_MOVE_FORWARD' || action.type === 'CROSS_AXIS_MOVE_BACKWARD') {
    if (state.phase !== 'DRAGGING') {
      console.error('cannot move cross axis when not dragging');
      return clean();
    }

    if (!state.drag) {
      console.error('cannot move cross axis if there is no drag information');
      return clean();
    }

    if (!state.drag.impact.destination) {
      console.error('cannot move cross axis if not in a droppable');
      return clean();
    }

    var _current = state.drag.current;
    var _descriptor = state.drag.initial.descriptor;
    var draggableId = _descriptor.id;
    var center = _current.page.center;
    var droppableId = state.drag.impact.destination.droppableId;
    var _home = {
      index: _descriptor.index,
      droppableId: _descriptor.droppableId
    };

    var _result2 = (0, _moveCrossAxis2.default)({
      isMovingForward: action.type === 'CROSS_AXIS_MOVE_FORWARD',
      pageCenter: center,
      draggableId: draggableId,
      droppableId: droppableId,
      home: _home,
      draggables: state.dimension.draggable,
      droppables: state.dimension.droppable,
      previousImpact: state.drag.impact
    });

    if (!_result2) {
      return state;
    }

    var _page2 = _result2.pageCenter;
    var _client3 = (0, _position.subtract)(_page2, _current.windowScroll);

    return move({
      state: state,
      clientSelection: _client3,
      impact: _result2.impact,
      shouldAnimate: true
    });
  }

  if (action.type === 'DROP_ANIMATE') {
    var _action$payload5 = action.payload,
        newHomeOffset = _action$payload5.newHomeOffset,
        _impact6 = _action$payload5.impact,
        _result3 = _action$payload5.result;


    if (state.phase !== 'DRAGGING') {
      console.error('cannot animate drop while not dragging', action);
      return state;
    }

    if (!state.drag) {
      console.error('cannot animate drop - invalid drag state');
      return clean();
    }

    var pending = {
      newHomeOffset: newHomeOffset,
      result: _result3,
      impact: _impact6
    };

    return {
      phase: 'DROP_ANIMATING',
      drag: null,
      drop: {
        pending: pending,
        result: null
      },
      dimension: state.dimension
    };
  }

  if (action.type === 'DROP_COMPLETE') {
    var _result4 = action.payload;

    return {
      phase: 'DROP_COMPLETE',
      drag: null,
      drop: {
        pending: null,
        result: _result4
      },
      dimension: noDimensions
    };
  }

  return state;
};