'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getDraggablesInsideDroppable = require('../get-draggables-inside-droppable');

var _getDraggablesInsideDroppable2 = _interopRequireDefault(_getDraggablesInsideDroppable);

var _position = require('../position');

var _withDroppableDisplacement = require('../with-droppable-displacement');

var _withDroppableDisplacement2 = _interopRequireDefault(_withDroppableDisplacement);

var _moveToEdge = require('../move-to-edge');

var _moveToEdge2 = _interopRequireDefault(_moveToEdge);

var _getViewport = require('../../window/get-viewport');

var _getViewport2 = _interopRequireDefault(_getViewport);

var _isTotallyVisibleInNewLocation = require('./is-totally-visible-in-new-location');

var _isTotallyVisibleInNewLocation2 = _interopRequireDefault(_isTotallyVisibleInNewLocation);

var _getForcedDisplacement = require('./get-forced-displacement');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var isMovingForward = _ref.isMovingForward,
      draggableId = _ref.draggableId,
      previousImpact = _ref.previousImpact,
      previousPageCenter = _ref.previousPageCenter,
      droppable = _ref.droppable,
      draggables = _ref.draggables;

  if (!previousImpact.destination) {
    console.error('cannot move to next index when there is not previous destination');
    return null;
  }

  var location = previousImpact.destination;
  var draggable = draggables[draggableId];
  var axis = droppable.axis;

  var insideForeignDroppable = (0, _getDraggablesInsideDroppable2.default)(droppable, draggables);

  var currentIndex = location.index;
  var proposedIndex = isMovingForward ? currentIndex + 1 : currentIndex - 1;
  var lastIndex = insideForeignDroppable.length - 1;

  if (proposedIndex > insideForeignDroppable.length) {
    return null;
  }

  if (proposedIndex < 0) {
    return null;
  }

  var movingRelativeTo = insideForeignDroppable[Math.min(proposedIndex, lastIndex)];

  var isMovingPastLastIndex = proposedIndex > lastIndex;
  var sourceEdge = 'start';
  var destinationEdge = function () {
    if (isMovingPastLastIndex) {
      return 'end';
    }

    return 'start';
  }();

  var viewport = (0, _getViewport2.default)();
  var newPageCenter = (0, _moveToEdge2.default)({
    source: draggable.page.withoutMargin,
    sourceEdge: sourceEdge,
    destination: movingRelativeTo.page.withMargin,
    destinationEdge: destinationEdge,
    destinationAxis: droppable.axis
  });

  var isVisibleInNewLocation = (0, _isTotallyVisibleInNewLocation2.default)({
    draggable: draggable,
    destination: droppable,
    newPageCenter: newPageCenter,
    viewport: viewport
  });

  var displaced = function () {
    if (isMovingForward) {
      return (0, _getForcedDisplacement.withFirstRemoved)({
        dragging: draggableId,
        isVisibleInNewLocation: isVisibleInNewLocation,
        previousImpact: previousImpact,
        droppable: droppable,
        draggables: draggables
      });
    }
    return (0, _getForcedDisplacement.withFirstAdded)({
      add: movingRelativeTo.descriptor.id,
      previousImpact: previousImpact,
      droppable: droppable,
      draggables: draggables,
      viewport: viewport
    });
  }();

  var newImpact = {
    movement: {
      displaced: displaced,
      amount: (0, _position.patch)(axis.line, draggable.page.withMargin[axis.size]),

      isBeyondStartPosition: false
    },
    destination: {
      droppableId: droppable.descriptor.id,
      index: proposedIndex
    },
    direction: droppable.axis.direction
  };

  if (isVisibleInNewLocation) {
    return {
      pageCenter: (0, _withDroppableDisplacement2.default)(droppable, newPageCenter),
      impact: newImpact,
      scrollJumpRequest: null
    };
  }

  var distanceMoving = (0, _position.subtract)(newPageCenter, previousPageCenter);
  var distanceWithScroll = (0, _withDroppableDisplacement2.default)(droppable, distanceMoving);

  return {
    pageCenter: previousPageCenter,
    impact: newImpact,
    scrollJumpRequest: distanceWithScroll
  };
};