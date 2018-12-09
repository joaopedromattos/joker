'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.apply = exports.closest = exports.distance = exports.patch = exports.absolute = exports.negate = exports.isEqual = exports.subtract = exports.add = undefined;

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var add = exports.add = function add(point1, point2) {
  return {
    x: point1.x + point2.x,
    y: point1.y + point2.y
  };
};

var subtract = exports.subtract = function subtract(point1, point2) {
  return {
    x: point1.x - point2.x,
    y: point1.y - point2.y
  };
};

var isEqual = exports.isEqual = function isEqual(point1, point2) {
  return point1.x === point2.x && point1.y === point2.y;
};

var negate = exports.negate = function negate(point) {
  return {
    x: point.x !== 0 ? -point.x : 0,
    y: point.y !== 0 ? -point.y : 0
  };
};

var absolute = exports.absolute = function absolute(point) {
  return {
    x: Math.abs(point.x),
    y: Math.abs(point.y)
  };
};

var patch = exports.patch = function patch(line, value) {
  var _ref;

  var otherValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  return _ref = {}, (0, _defineProperty3.default)(_ref, line, value), (0, _defineProperty3.default)(_ref, line === 'x' ? 'y' : 'x', otherValue), _ref;
};

var distance = exports.distance = function distance(point1, point2) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};

var closest = exports.closest = function closest(target, points) {
  return Math.min.apply(Math, (0, _toConsumableArray3.default)(points.map(function (point) {
    return distance(target, point);
  })));
};

var apply = exports.apply = function apply(fn) {
  return function (point) {
    return {
      x: fn(point.x),
      y: fn(point.y)
    };
  };
};