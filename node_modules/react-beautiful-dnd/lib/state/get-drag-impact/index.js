'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getDroppableOver = require('../get-droppable-over');

var _getDroppableOver2 = _interopRequireDefault(_getDroppableOver);

var _getDraggablesInsideDroppable = require('../get-draggables-inside-droppable');

var _getDraggablesInsideDroppable2 = _interopRequireDefault(_getDraggablesInsideDroppable);

var _noImpact = require('../no-impact');

var _noImpact2 = _interopRequireDefault(_noImpact);

var _inHomeList = require('./in-home-list');

var _inHomeList2 = _interopRequireDefault(_inHomeList);

var _inForeignList = require('./in-foreign-list');

var _inForeignList2 = _interopRequireDefault(_inForeignList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var pageCenter = _ref.pageCenter,
      draggable = _ref.draggable,
      draggables = _ref.draggables,
      droppables = _ref.droppables,
      previousImpact = _ref.previousImpact;

  var previousDroppableOverId = previousImpact.destination && previousImpact.destination.droppableId;

  var destinationId = (0, _getDroppableOver2.default)({
    target: pageCenter,
    draggable: draggable,
    draggables: draggables,
    droppables: droppables,
    previousDroppableOverId: previousDroppableOverId
  });

  if (!destinationId) {
    return _noImpact2.default;
  }

  var destination = droppables[destinationId];

  if (!destination.isEnabled) {
    return _noImpact2.default;
  }

  var home = droppables[draggable.descriptor.droppableId];
  var isWithinHomeDroppable = home.descriptor.id === destinationId;
  var insideDestination = (0, _getDraggablesInsideDroppable2.default)(destination, draggables);

  if (isWithinHomeDroppable) {
    return (0, _inHomeList2.default)({
      pageCenter: pageCenter,
      draggable: draggable,
      home: home,
      insideHome: insideDestination,
      previousImpact: previousImpact || _noImpact2.default
    });
  }

  return (0, _inForeignList2.default)({
    pageCenter: pageCenter,
    draggable: draggable,
    destination: destination,
    insideDestination: insideDestination,
    previousImpact: previousImpact || _noImpact2.default
  });
};