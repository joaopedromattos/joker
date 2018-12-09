'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getBestCrossAxisDroppable = require('./get-best-cross-axis-droppable');

var _getBestCrossAxisDroppable2 = _interopRequireDefault(_getBestCrossAxisDroppable);

var _getClosestDraggable = require('./get-closest-draggable');

var _getClosestDraggable2 = _interopRequireDefault(_getClosestDraggable);

var _moveToNewDroppable = require('./move-to-new-droppable/');

var _moveToNewDroppable2 = _interopRequireDefault(_moveToNewDroppable);

var _noImpact = require('../no-impact');

var _noImpact2 = _interopRequireDefault(_noImpact);

var _getDraggablesInsideDroppable = require('../get-draggables-inside-droppable');

var _getDraggablesInsideDroppable2 = _interopRequireDefault(_getDraggablesInsideDroppable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var isMovingForward = _ref.isMovingForward,
      pageCenter = _ref.pageCenter,
      draggableId = _ref.draggableId,
      droppableId = _ref.droppableId,
      home = _ref.home,
      draggables = _ref.draggables,
      droppables = _ref.droppables,
      previousImpact = _ref.previousImpact;

  var draggable = draggables[draggableId];
  var source = droppables[droppableId];

  var destination = (0, _getBestCrossAxisDroppable2.default)({
    isMovingForward: isMovingForward,
    pageCenter: pageCenter,
    source: source,
    droppables: droppables
  });

  if (!destination) {
    return null;
  }

  var insideDestination = (0, _getDraggablesInsideDroppable2.default)(destination, draggables);

  var target = (0, _getClosestDraggable2.default)({
    axis: destination.axis,
    pageCenter: pageCenter,
    destination: destination,
    insideDestination: insideDestination
  });

  if (insideDestination.length && !target) {
    return null;
  }

  return (0, _moveToNewDroppable2.default)({
    pageCenter: pageCenter,
    destination: destination,
    draggable: draggable,
    target: target,
    insideDestination: insideDestination,
    home: home,
    previousImpact: previousImpact || _noImpact2.default
  });
};