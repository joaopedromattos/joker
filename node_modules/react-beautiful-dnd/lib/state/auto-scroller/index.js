'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fluidScroller = require('./fluid-scroller');

var _fluidScroller2 = _interopRequireDefault(_fluidScroller);

var _jumpScroller = require('./jump-scroller');

var _jumpScroller2 = _interopRequireDefault(_jumpScroller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var scrollDroppable = _ref.scrollDroppable,
      scrollWindow = _ref.scrollWindow,
      move = _ref.move;

  var fluidScroll = (0, _fluidScroller2.default)({
    scrollWindow: scrollWindow,
    scrollDroppable: scrollDroppable
  });

  var jumpScroll = (0, _jumpScroller2.default)({
    move: move,
    scrollWindow: scrollWindow,
    scrollDroppable: scrollDroppable
  });

  var onStateChange = function onStateChange(previous, current) {
    if (current.phase === 'DRAGGING') {
      if (!current.drag) {
        console.error('invalid drag state');
        return;
      }

      if (current.drag.initial.autoScrollMode === 'FLUID') {
        fluidScroll(current);
        return;
      }

      if (!current.drag.scrollJumpRequest) {
        return;
      }

      jumpScroll(current);
      return;
    }

    if (previous.phase === 'DRAGGING' && current.phase !== 'DRAGGING') {
      fluidScroll.cancel();
    }
  };

  var marshal = {
    onStateChange: onStateChange
  };

  return marshal;
};