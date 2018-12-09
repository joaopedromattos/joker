'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getArea = require('../state/get-area');

var _getArea2 = _interopRequireDefault(_getArea);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (el) {
  return (0, _getArea2.default)(el.getBoundingClientRect()).center;
};