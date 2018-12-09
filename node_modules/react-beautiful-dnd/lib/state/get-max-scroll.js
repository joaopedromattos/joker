'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _position = require('./position');

exports.default = function (_ref) {
  var scrollHeight = _ref.scrollHeight,
      scrollWidth = _ref.scrollWidth,
      height = _ref.height,
      width = _ref.width;

  var maxScroll = (0, _position.subtract)({ x: scrollWidth, y: scrollHeight }, { x: width, y: height });

  var adjustedMaxScroll = {
    x: Math.max(0, maxScroll.x),
    y: Math.max(0, maxScroll.y)
  };

  return adjustedMaxScroll;
};