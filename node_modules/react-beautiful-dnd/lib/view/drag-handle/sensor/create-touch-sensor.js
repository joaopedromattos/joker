'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forcePressThreshold = exports.timeForLongPress = undefined;

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _stopEvent = require('../util/stop-event');

var _stopEvent2 = _interopRequireDefault(_stopEvent);

var _createScheduler = require('../util/create-scheduler');

var _createScheduler2 = _interopRequireDefault(_createScheduler);

var _getWindowFromRef = require('../../get-window-from-ref');

var _getWindowFromRef2 = _interopRequireDefault(_getWindowFromRef);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var timeForLongPress = exports.timeForLongPress = 150;
var forcePressThreshold = exports.forcePressThreshold = 0.15;

var noop = function noop() {};

var initial = {
  isDragging: false,
  pending: null,
  hasMoved: false,
  preventClick: false,
  longPressTimerId: null
};

exports.default = function (_ref) {
  var callbacks = _ref.callbacks,
      getDraggableRef = _ref.getDraggableRef,
      canStartCapturing = _ref.canStartCapturing;

  var state = initial;

  var setState = function setState(partial) {
    state = (0, _extends3.default)({}, state, partial);
  };
  var isDragging = function isDragging() {
    return state.isDragging;
  };
  var isCapturing = function isCapturing() {
    return Boolean(state.pending || state.isDragging || state.longPressTimerId);
  };
  var schedule = (0, _createScheduler2.default)(callbacks);

  var startDragging = function startDragging() {
    var pending = state.pending;

    if (!pending) {
      console.error('cannot start a touch drag without a pending position');
      kill();
      return;
    }

    setState({
      isDragging: true,

      hasMoved: false,

      pending: null,
      longPressTimerId: null
    });

    callbacks.onLift({
      client: pending,
      autoScrollMode: 'FLUID'
    });
  };
  var stopDragging = function stopDragging() {
    var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;

    schedule.cancel();
    unbindWindowEvents();
    setState((0, _extends3.default)({}, initial, {
      preventClick: true
    }));
    fn();
  };

  var startPendingDrag = function startPendingDrag(event) {
    var touch = event.touches[0];
    var clientX = touch.clientX,
        clientY = touch.clientY;

    var point = {
      x: clientX,
      y: clientY
    };

    var longPressTimerId = setTimeout(startDragging, timeForLongPress);

    setState({
      longPressTimerId: longPressTimerId,
      pending: point,
      isDragging: false,
      hasMoved: false
    });
    bindWindowEvents();
  };

  var stopPendingDrag = function stopPendingDrag() {
    clearTimeout(state.longPressTimerId);
    schedule.cancel();
    unbindWindowEvents();

    setState(initial);
  };

  var kill = function kill() {
    var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;

    if (state.pending) {
      stopPendingDrag();
      return;
    }
    stopDragging(fn);
  };

  var cancel = function cancel() {
    kill(callbacks.onCancel);
  };

  var windowBindings = {
    touchmove: function touchmove(event) {
      if (state.pending) {
        stopPendingDrag();
        return;
      }

      if (!state.hasMoved) {
        setState({
          hasMoved: true
        });
      }

      (0, _stopEvent2.default)(event);

      var _event$touches$ = event.touches[0],
          clientX = _event$touches$.clientX,
          clientY = _event$touches$.clientY;


      var point = {
        x: clientX,
        y: clientY
      };

      schedule.move(point);
    },
    touchend: function touchend(event) {
      if (state.pending) {
        stopPendingDrag();

        return;
      }

      stopDragging(callbacks.onDrop);
      (0, _stopEvent2.default)(event);
    },
    touchcancel: cancel,
    touchstart: function touchstart() {
      if (isDragging()) {
        console.error('touch start fired while already dragging');
        cancel();
      }
    },

    orientationchange: cancel,

    resize: cancel,
    scroll: function scroll() {
      if (state.pending) {
        stopPendingDrag();
        return;
      }
      schedule.windowScrollMove();
    },

    contextmenu: _stopEvent2.default,

    keydown: cancel,

    touchforcechange: function touchforcechange(event) {
      if (state.hasMoved) {
        return;
      }

      var touch = event.touches[0];

      if (touch.force >= forcePressThreshold) {
        cancel();
      }
    }
  };

  var eventKeys = (0, _keys2.default)(windowBindings);

  var bindWindowEvents = function bindWindowEvents() {
    var win = (0, _getWindowFromRef2.default)(getDraggableRef());

    eventKeys.forEach(function (eventKey) {
      var fn = windowBindings[eventKey];

      if (eventKey === 'touchmove') {
        win.addEventListener(eventKey, fn, { passive: false });
        return;
      }

      if (eventKey === 'scroll') {
        win.addEventListener(eventKey, fn, { passive: true });
        return;
      }

      win.addEventListener(eventKey, fn);
    });
  };

  var unbindWindowEvents = function unbindWindowEvents() {
    var win = (0, _getWindowFromRef2.default)(getDraggableRef());

    eventKeys.forEach(function (eventKey) {
      return win.removeEventListener(eventKey, windowBindings[eventKey]);
    });
  };

  var onTouchStart = function onTouchStart(event) {
    if (!canStartCapturing(event)) {
      return;
    }

    if (isCapturing()) {
      console.error('should not be able to perform a touch start while a drag or pending drag is occurring');
      cancel();
      return;
    }

    event.stopPropagation();

    startPendingDrag(event);
  };

  var onTouchMove = function onTouchMove() {
    if (state.pending) {
      stopPendingDrag();
    }
  };

  var onClick = function onClick(event) {
    if (!state.preventClick) {
      return;
    }

    (0, _stopEvent2.default)(event);
    setState(initial);
  };

  var sensor = {
    onTouchStart: onTouchStart,
    onTouchMove: onTouchMove,
    onClick: onClick,
    kill: kill,
    isCapturing: isCapturing,
    isDragging: isDragging
  };

  return sensor;
};