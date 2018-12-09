'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _position = require('../position');

var _getDisplacement = require('../get-displacement');

var _getDisplacement2 = _interopRequireDefault(_getDisplacement);

var _getViewport = require('../../window/get-viewport');

var _getViewport2 = _interopRequireDefault(_getViewport);

var _withDroppableScroll = require('../with-droppable-scroll');

var _withDroppableScroll2 = _interopRequireDefault(_withDroppableScroll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var pageCenter = _ref.pageCenter,
      draggable = _ref.draggable,
      destination = _ref.destination,
      insideDestination = _ref.insideDestination,
      previousImpact = _ref.previousImpact;

  var axis = destination.axis;
  var viewport = (0, _getViewport2.default)();

  var currentCenter = (0, _withDroppableScroll2.default)(destination, pageCenter);

  var displaced = insideDestination.filter(function (child) {
    var threshold = child.page.withoutMargin[axis.end];
    return threshold > currentCenter[axis.line];
  }).map(function (dimension) {
    return (0, _getDisplacement2.default)({
      draggable: dimension,
      destination: destination,
      previousImpact: previousImpact,
      viewport: viewport
    });
  });

  var newIndex = insideDestination.length - displaced.length;

  var movement = {
    amount: (0, _position.patch)(axis.line, draggable.page.withMargin[axis.size]),
    displaced: displaced,
    isBeyondStartPosition: false
  };

  var impact = {
    movement: movement,
    direction: axis.direction,
    destination: {
      droppableId: destination.descriptor.id,
      index: newIndex
    }
  };

  return impact;
};