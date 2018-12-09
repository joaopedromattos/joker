'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _position = require('../position');

var _spacing = require('../spacing');

var _isVisible = require('../visibility/is-visible');

exports.default = function (_ref) {
  var draggable = _ref.draggable,
      destination = _ref.destination,
      newPageCenter = _ref.newPageCenter,
      viewport = _ref.viewport;

  var diff = (0, _position.subtract)(newPageCenter, draggable.page.withoutMargin.center);
  var shifted = (0, _spacing.offsetByPosition)(draggable.page.withoutMargin, diff);

  return (0, _isVisible.isTotallyVisible)({
    target: shifted,
    destination: destination,
    viewport: viewport
  });
};