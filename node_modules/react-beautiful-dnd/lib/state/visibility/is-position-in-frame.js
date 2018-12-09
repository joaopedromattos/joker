'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isWithin = require('../is-within');

var _isWithin2 = _interopRequireDefault(_isWithin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (frame) {
  var isWithinVertical = (0, _isWithin2.default)(frame.top - 100, frame.bottom + 300);
  var isWithinHorizontal = (0, _isWithin2.default)(frame.left, frame.right);

  return function (point) {
    return isWithinVertical(point.y) && isWithinVertical(point.y) && isWithinHorizontal(point.x) && isWithinHorizontal(point.x);
  };
};