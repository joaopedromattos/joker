'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _position = require('../position');

var _getViewport = require('../../window/get-viewport');

var _getViewport2 = _interopRequireDefault(_getViewport);

var _isVisible = require('../visibility/is-visible');

var _withDroppableDisplacement = require('../with-droppable-displacement');

var _withDroppableDisplacement2 = _interopRequireDefault(_withDroppableDisplacement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var axis = _ref.axis,
      pageCenter = _ref.pageCenter,
      destination = _ref.destination,
      insideDestination = _ref.insideDestination;

  if (!insideDestination.length) {
    return null;
  }

  var viewport = (0, _getViewport2.default)();

  var result = insideDestination.filter(function (draggable) {
    return (0, _isVisible.isTotallyVisible)({
      target: draggable.page.withMargin,
      destination: destination,
      viewport: viewport
    });
  }).sort(function (a, b) {
    var distanceToA = (0, _position.distance)(pageCenter, (0, _withDroppableDisplacement2.default)(destination, a.page.withMargin.center));
    var distanceToB = (0, _position.distance)(pageCenter, (0, _withDroppableDisplacement2.default)(destination, b.page.withMargin.center));

    if (distanceToA < distanceToB) {
      return -1;
    }

    if (distanceToB < distanceToA) {
      return 1;
    }

    return a.page.withMargin[axis.start] - b.page.withMargin[axis.start];
  });

  return result.length ? result[0] : null;
};