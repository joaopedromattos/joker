'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getDisplacementMap = require('./get-displacement-map');

var _getDisplacementMap2 = _interopRequireDefault(_getDisplacementMap);

var _isVisible = require('./visibility/is-visible');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var draggable = _ref.draggable,
      destination = _ref.destination,
      previousImpact = _ref.previousImpact,
      viewport = _ref.viewport;

  var id = draggable.descriptor.id;
  var map = (0, _getDisplacementMap2.default)(previousImpact.movement.displaced);

  var isVisible = (0, _isVisible.isPartiallyVisible)({
    target: draggable.page.withMargin,
    destination: destination,
    viewport: viewport
  });

  var shouldAnimate = function () {
    if (!isVisible) {
      return false;
    }

    var previous = map[id];

    if (!previous) {
      return true;
    }

    return previous.shouldAnimate;
  }();

  var displacement = {
    draggableId: id,
    isVisible: isVisible,
    shouldAnimate: shouldAnimate
  };

  return displacement;
};