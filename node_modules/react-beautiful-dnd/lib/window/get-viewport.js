'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getArea = require('../state/get-area');

var _getArea2 = _interopRequireDefault(_getArea);

var _getWindowScroll = require('./get-window-scroll');

var _getWindowScroll2 = _interopRequireDefault(_getWindowScroll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var windowScroll = (0, _getWindowScroll2.default)();

  var top = windowScroll.y;
  var left = windowScroll.x;

  var doc = document.documentElement;

  var width = doc.clientWidth;
  var height = doc.clientHeight;

  var right = left + width;
  var bottom = top + height;

  return (0, _getArea2.default)({
    top: top, left: left, right: right, bottom: bottom
  });
};