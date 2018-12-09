'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeSelector = undefined;

var _memoizeOne = require('memoize-one');

var _memoizeOne2 = _interopRequireDefault(_memoizeOne);

var _reactRedux = require('react-redux');

var _reselect = require('reselect');

var _draggable = require('./draggable');

var _draggable2 = _interopRequireDefault(_draggable);

var _contextKeys = require('../context-keys');

var _position = require('../../state/position');

var _getDisplacementMap = require('../../state/get-displacement-map');

var _getDisplacementMap2 = _interopRequireDefault(_getDisplacementMap);

var _actionCreators = require('../../state/action-creators');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var origin = { x: 0, y: 0 };

var defaultMapProps = {
  isDropAnimating: false,
  isDragging: false,
  offset: origin,
  shouldAnimateDragMovement: false,

  shouldAnimateDisplacement: true,

  dimension: null,
  direction: null,
  draggingOver: null
};

var makeSelector = exports.makeSelector = function makeSelector() {
  var memoizedOffset = (0, _memoizeOne2.default)(function (x, y) {
    return {
      x: x, y: y
    };
  });

  var getNotDraggingProps = (0, _memoizeOne2.default)(function (offset, shouldAnimateDisplacement) {
    return {
      isDropAnimating: false,
      isDragging: false,
      offset: offset,
      shouldAnimateDisplacement: shouldAnimateDisplacement,

      shouldAnimateDragMovement: false,
      dimension: null,
      direction: null,
      draggingOver: null
    };
  });

  var getDraggingProps = (0, _memoizeOne2.default)(function (offset, shouldAnimateDragMovement, dimension, direction, draggingOver) {
    return {
      isDragging: true,
      isDropAnimating: false,
      shouldAnimateDisplacement: false,
      offset: offset,
      shouldAnimateDragMovement: shouldAnimateDragMovement,
      dimension: dimension,
      direction: direction,
      draggingOver: draggingOver
    };
  });

  var draggingSelector = function draggingSelector(state, ownProps) {
    if (state.phase !== 'DRAGGING' && state.phase !== 'DROP_ANIMATING') {
      return null;
    }

    if (state.phase === 'DRAGGING') {
      if (!state.drag) {
        console.error('invalid drag state found in selector');
        return null;
      }

      if (state.drag.initial.descriptor.id !== ownProps.draggableId) {
        return null;
      }

      var offset = state.drag.current.client.offset;
      var dimension = state.dimension.draggable[ownProps.draggableId];
      var _direction = state.drag.impact.direction;
      var shouldAnimateDragMovement = state.drag.current.shouldAnimate;
      var _draggingOver = state.drag.impact.destination ? state.drag.impact.destination.droppableId : null;

      return getDraggingProps(memoizedOffset(offset.x, offset.y), shouldAnimateDragMovement, dimension, _direction, _draggingOver);
    }

    var pending = state.drop && state.drop.pending;

    if (!pending) {
      console.error('cannot provide props for dropping item when there is invalid state');
      return null;
    }

    if (pending.result.draggableId !== ownProps.draggableId) {
      return null;
    }

    var draggingOver = pending.result.destination ? pending.result.destination.droppableId : null;
    var direction = pending.impact.direction ? pending.impact.direction : null;

    return {
      isDragging: false,
      isDropAnimating: true,
      offset: pending.newHomeOffset,

      dimension: state.dimension.draggable[ownProps.draggableId],
      draggingOver: draggingOver,
      direction: direction,

      shouldAnimateDragMovement: false,

      shouldAnimateDisplacement: false
    };
  };

  var getOutOfTheWayMovement = function getOutOfTheWayMovement(id, movement) {
    var map = (0, _getDisplacementMap2.default)(movement.displaced);
    var displacement = map[id];

    if (!displacement) {
      return null;
    }

    if (!displacement.isVisible) {
      return null;
    }

    var amount = movement.isBeyondStartPosition ? (0, _position.negate)(movement.amount) : movement.amount;

    return getNotDraggingProps(memoizedOffset(amount.x, amount.y), displacement.shouldAnimate);
  };

  var movingOutOfTheWaySelector = function movingOutOfTheWaySelector(state, ownProps) {
    if (state.phase !== 'DRAGGING' && state.phase !== 'DROP_ANIMATING') {
      return null;
    }

    if (state.phase === 'DRAGGING') {
      if (!state.drag) {
        console.error('cannot correctly move item out of the way when there is invalid state');
        return null;
      }

      if (state.drag.initial.descriptor.id === ownProps.draggableId) {
        return null;
      }

      return getOutOfTheWayMovement(ownProps.draggableId, state.drag.impact.movement);
    }

    if (!state.drop || !state.drop.pending) {
      console.error('cannot provide props for dropping item when there is invalid state');
      return null;
    }

    if (state.drop.pending.result.draggableId === ownProps.draggableId) {
      return null;
    }

    return getOutOfTheWayMovement(ownProps.draggableId, state.drop.pending.impact.movement);
  };

  return (0, _reselect.createSelector)([draggingSelector, movingOutOfTheWaySelector], function (dragging, movingOutOfTheWay) {
    if (dragging) {
      return dragging;
    }

    if (movingOutOfTheWay) {
      return movingOutOfTheWay;
    }

    return defaultMapProps;
  });
};

var makeMapStateToProps = function makeMapStateToProps() {
  var selector = makeSelector();

  return function (state, props) {
    return selector(state, props);
  };
};

var mapDispatchToProps = {
  lift: _actionCreators.lift,
  move: _actionCreators.move,
  moveForward: _actionCreators.moveForward,
  moveBackward: _actionCreators.moveBackward,
  crossAxisMoveForward: _actionCreators.crossAxisMoveForward,
  crossAxisMoveBackward: _actionCreators.crossAxisMoveBackward,
  moveByWindowScroll: _actionCreators.moveByWindowScroll,
  drop: _actionCreators.drop,
  dropAnimationFinished: _actionCreators.dropAnimationFinished,
  cancel: _actionCreators.cancel
};

exports.default = (0, _reactRedux.connect)(makeMapStateToProps, mapDispatchToProps, null, { storeKey: _contextKeys.storeKey })(_draggable2.default);