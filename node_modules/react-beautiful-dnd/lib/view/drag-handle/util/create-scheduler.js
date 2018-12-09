'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _memoizeOne = require('memoize-one');

var _memoizeOne2 = _interopRequireDefault(_memoizeOne);

var _rafSchd = require('raf-schd');

var _rafSchd2 = _interopRequireDefault(_rafSchd);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (callbacks) {
  var memoizedMove = (0, _memoizeOne2.default)(function (x, y) {
    var point = { x: x, y: y };
    callbacks.onMove(point);
  });

  var move = (0, _rafSchd2.default)(function (point) {
    return memoizedMove(point.x, point.y);
  });
  var moveForward = (0, _rafSchd2.default)(callbacks.onMoveForward);
  var moveBackward = (0, _rafSchd2.default)(callbacks.onMoveBackward);
  var crossAxisMoveForward = (0, _rafSchd2.default)(callbacks.onCrossAxisMoveForward);
  var crossAxisMoveBackward = (0, _rafSchd2.default)(callbacks.onCrossAxisMoveBackward);
  var windowScrollMove = (0, _rafSchd2.default)(callbacks.onWindowScroll);

  var cancel = function cancel() {

    move.cancel();
    moveForward.cancel();
    moveBackward.cancel();
    crossAxisMoveForward.cancel();
    crossAxisMoveBackward.cancel();
    windowScrollMove.cancel();
  };

  return {
    move: move,
    moveForward: moveForward,
    moveBackward: moveBackward,
    crossAxisMoveForward: crossAxisMoveForward,
    crossAxisMoveBackward: crossAxisMoveBackward,
    windowScrollMove: windowScrollMove,
    cancel: cancel
  };
};