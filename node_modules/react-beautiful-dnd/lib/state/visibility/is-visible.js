'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isTotallyVisible = exports.isPartiallyVisible = undefined;

var _isPartiallyVisibleThroughFrame = require('./is-partially-visible-through-frame');

var _isPartiallyVisibleThroughFrame2 = _interopRequireDefault(_isPartiallyVisibleThroughFrame);

var _isTotallyVisibleThroughFrame = require('./is-totally-visible-through-frame');

var _isTotallyVisibleThroughFrame2 = _interopRequireDefault(_isTotallyVisibleThroughFrame);

var _spacing = require('../spacing');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var origin = { x: 0, y: 0 };

var isVisible = function isVisible(_ref) {
  var target = _ref.target,
      destination = _ref.destination,
      viewport = _ref.viewport,
      isVisibleThroughFrameFn = _ref.isVisibleThroughFrameFn;

  var displacement = destination.viewport.closestScrollable ? destination.viewport.closestScrollable.scroll.diff.displacement : origin;
  var withDisplacement = (0, _spacing.offsetByPosition)(target, displacement);

  if (!destination.viewport.clipped) {
    return false;
  }

  var isVisibleInDroppable = isVisibleThroughFrameFn(destination.viewport.clipped)(withDisplacement);

  var isVisibleInViewport = isVisibleThroughFrameFn(viewport)(withDisplacement);

  return isVisibleInDroppable && isVisibleInViewport;
};

var isPartiallyVisible = exports.isPartiallyVisible = function isPartiallyVisible(_ref2) {
  var target = _ref2.target,
      destination = _ref2.destination,
      viewport = _ref2.viewport;
  return isVisible({
    target: target,
    destination: destination,
    viewport: viewport,
    isVisibleThroughFrameFn: _isPartiallyVisibleThroughFrame2.default
  });
};

var isTotallyVisible = exports.isTotallyVisible = function isTotallyVisible(_ref3) {
  var target = _ref3.target,
      destination = _ref3.destination,
      viewport = _ref3.viewport;
  return isVisible({
    target: target,
    destination: destination,
    viewport: viewport,
    isVisibleThroughFrameFn: _isTotallyVisibleThroughFrame2.default
  });
};