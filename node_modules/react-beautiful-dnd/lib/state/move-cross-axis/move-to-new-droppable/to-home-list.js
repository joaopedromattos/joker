'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _moveToEdge = require('../../move-to-edge');

var _moveToEdge2 = _interopRequireDefault(_moveToEdge);

var _getViewport = require('../../../window/get-viewport');

var _getViewport2 = _interopRequireDefault(_getViewport);

var _getDisplacement = require('../../get-displacement');

var _getDisplacement2 = _interopRequireDefault(_getDisplacement);

var _withDroppableDisplacement = require('../../with-droppable-displacement');

var _withDroppableDisplacement2 = _interopRequireDefault(_withDroppableDisplacement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var amount = _ref.amount,
      originalIndex = _ref.originalIndex,
      target = _ref.target,
      insideDroppable = _ref.insideDroppable,
      draggable = _ref.draggable,
      droppable = _ref.droppable,
      previousImpact = _ref.previousImpact;

  if (!target) {
    console.error('there will always be a target in the original list');
    return null;
  }

  var axis = droppable.axis;
  var targetIndex = insideDroppable.indexOf(target);

  if (targetIndex === -1) {
    console.error('unable to find target in destination droppable');
    return null;
  }

  if (targetIndex === originalIndex) {
    var _newCenter = draggable.page.withoutMargin.center;
    var _newImpact = {
      movement: {
        displaced: [],
        amount: amount,
        isBeyondStartPosition: false
      },
      direction: droppable.axis.direction,
      destination: {
        droppableId: droppable.descriptor.id,
        index: originalIndex
      }
    };

    return {
      pageCenter: (0, _withDroppableDisplacement2.default)(droppable, _newCenter),
      impact: _newImpact
    };
  }

  var isMovingPastOriginalIndex = targetIndex > originalIndex;
  var edge = isMovingPastOriginalIndex ? 'end' : 'start';

  var newCenter = (0, _moveToEdge2.default)({
    source: draggable.page.withoutMargin,
    sourceEdge: edge,
    destination: isMovingPastOriginalIndex ? target.page.withoutMargin : target.page.withMargin,
    destinationEdge: edge,
    destinationAxis: axis
  });

  var modified = function () {
    if (!isMovingPastOriginalIndex) {
      return insideDroppable.slice(targetIndex, originalIndex);
    }

    var from = originalIndex + 1;

    var to = targetIndex + 1;

    return insideDroppable.slice(from, to).reverse();
  }();

  var viewport = (0, _getViewport2.default)();
  var displaced = modified.map(function (dimension) {
    return (0, _getDisplacement2.default)({
      draggable: dimension,
      destination: droppable,
      previousImpact: previousImpact,
      viewport: viewport
    });
  });

  var newImpact = {
    movement: {
      displaced: displaced,
      amount: amount,
      isBeyondStartPosition: isMovingPastOriginalIndex
    },
    direction: axis.direction,
    destination: {
      droppableId: droppable.descriptor.id,
      index: targetIndex
    }
  };

  return {
    pageCenter: (0, _withDroppableDisplacement2.default)(droppable, newCenter),
    impact: newImpact
  };
};