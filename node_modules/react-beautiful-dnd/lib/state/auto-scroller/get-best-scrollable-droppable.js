'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _memoizeOne = require('memoize-one');

var _memoizeOne2 = _interopRequireDefault(_memoizeOne);

var _isPositionInFrame = require('../visibility/is-position-in-frame');

var _isPositionInFrame2 = _interopRequireDefault(_isPositionInFrame);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getScrollableDroppables = (0, _memoizeOne2.default)(function (droppables) {
  return (0, _keys2.default)(droppables).map(function (id) {
    return droppables[id];
  }).filter(function (droppable) {
    if (!droppable.isEnabled) {
      return false;
    }

    if (!droppable.viewport.closestScrollable) {
      return false;
    }

    return true;
  });
});

var getScrollableDroppableOver = function getScrollableDroppableOver(target, droppables) {
  var maybe = getScrollableDroppables(droppables).find(function (droppable) {
    if (!droppable.viewport.closestScrollable) {
      throw new Error('Invalid result');
    }
    return (0, _isPositionInFrame2.default)(droppable.viewport.closestScrollable.frame)(target);
  });

  return maybe;
};

exports.default = function (_ref) {
  var center = _ref.center,
      destination = _ref.destination,
      droppables = _ref.droppables;


  if (destination) {
    var _dimension = droppables[destination.droppableId];
    if (!_dimension.viewport.closestScrollable) {
      return null;
    }
    return _dimension;
  }

  var dimension = getScrollableDroppableOver(center, droppables);

  return dimension;
};