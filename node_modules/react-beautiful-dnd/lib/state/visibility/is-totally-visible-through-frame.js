'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isWithin = require('../is-within');

var _isWithin2 = _interopRequireDefault(_isWithin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (frame) {
  var isWithinVertical = (0, _isWithin2.default)(frame.top, frame.bottom);
  var isWithinHorizontal = (0, _isWithin2.default)(frame.left, frame.right);

  return function (subject) {
    var isContained = isWithinVertical(subject.top) && isWithinVertical(subject.bottom) && isWithinHorizontal(subject.left) && isWithinHorizontal(subject.right);

    return isContained;
  };
};