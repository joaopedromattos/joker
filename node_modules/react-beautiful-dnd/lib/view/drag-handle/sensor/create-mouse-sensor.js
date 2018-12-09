'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _stopEvent = require('../util/stop-event');

var _stopEvent2 = _interopRequireDefault(_stopEvent);

var _createScheduler = require('../util/create-scheduler');

var _createScheduler2 = _interopRequireDefault(_createScheduler);

var _isSloppyClickThresholdExceeded = require('../util/is-sloppy-click-threshold-exceeded');

var _isSloppyClickThresholdExceeded2 = _interopRequireDefault(_isSloppyClickThresholdExceeded);

var _getWindowFromRef = require('../../get-window-from-ref');

var _getWindowFromRef2 = _interopRequireDefault(_getWindowFromRef);

var _keyCodes = require('../../key-codes');

var keyCodes = _interopRequireWildcard(_keyCodes);

var _blockStandardKeyEvents = require('../util/block-standard-key-events');

var _blockStandardKeyEvents2 = _interopRequireDefault(_blockStandardKeyEvents);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var primaryButton = 0;
var noop = function noop() {};

exports.default = function (_ref) {
  var callbacks = _ref.callbacks,
      getDraggableRef = _ref.getDraggableRef,
      canStartCapturing = _ref.canStartCapturing;

  var state = {
    isDragging: false,
    pending: null,
    preventClick: false
  };
  var setState = function setState(partial) {
    var newState = (0, _extends3.default)({}, state, partial);
    state = newState;
  };
  var isDragging = function isDragging() {
    return state.isDragging;
  };
  var isCapturing = function isCapturing() {
    return Boolean(state.pending || state.isDragging);
  };
  var schedule = (0, _createScheduler2.default)(callbacks);

  var startDragging = function startDragging() {
    var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;

    setState({
      pending: null,
      isDragging: true,
      preventClick: true
    });
    fn();
  };
  var stopDragging = function stopDragging() {
    var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;

    schedule.cancel();
    unbindWindowEvents();
    setState({
      isDragging: false,
      pending: null
    });
    fn();
  };
  var startPendingDrag = function startPendingDrag(point) {
    setState({ pending: point, isDragging: false });
    bindWindowEvents();
  };
  var stopPendingDrag = function stopPendingDrag() {
    setState({
      preventClick: false
    });
    stopDragging();
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
    mousemove: function mousemove(event) {
      var button = event.button,
          clientX = event.clientX,
          clientY = event.clientY;

      if (button !== primaryButton) {
        return;
      }

      var point = {
        x: clientX,
        y: clientY
      };

      if (state.isDragging) {
        schedule.move(point);
        return;
      }

      if (!state.pending) {
        console.error('invalid state');
        return;
      }

      if (!(0, _isSloppyClickThresholdExceeded2.default)(state.pending, point)) {
        return;
      }

      startDragging(function () {
        return callbacks.onLift({
          client: point,
          autoScrollMode: 'FLUID'
        });
      });
    },
    mouseup: function mouseup() {
      if (state.pending) {
        stopPendingDrag();
        return;
      }

      stopDragging(callbacks.onDrop);
    },
    mousedown: function mousedown() {
      stopDragging(callbacks.onCancel);
    },
    keydown: function keydown(event) {
      if (event.keyCode === keyCodes.escape) {
        (0, _stopEvent2.default)(event);
        cancel();
        return;
      }

      (0, _blockStandardKeyEvents2.default)(event);
    },
    resize: cancel,
    scroll: function scroll() {
      if (state.pending) {
        stopPendingDrag();
        return;
      }
      schedule.windowScrollMove();
    },

    webkitmouseforcechanged: function webkitmouseforcechanged(event) {
      if (event.webkitForce == null || MouseEvent.WEBKIT_FORCE_AT_FORCE_MOUSE_DOWN == null) {
        console.error('handling a mouse force changed event when it is not supported');
        return;
      }

      var forcePressThreshold = MouseEvent.WEBKIT_FORCE_AT_FORCE_MOUSE_DOWN;
      var isForcePressing = event.webkitForce >= forcePressThreshold;

      if (isForcePressing) {
        cancel();
      }
    }
  };

  var eventKeys = (0, _keys2.default)(windowBindings);

  var bindWindowEvents = function bindWindowEvents() {
    var win = (0, _getWindowFromRef2.default)(getDraggableRef());

    eventKeys.forEach(function (eventKey) {
      if (eventKey === 'scroll') {
        win.addEventListener(eventKey, windowBindings.scroll, { passive: true });
        return;
      }

      win.addEventListener(eventKey, windowBindings[eventKey]);
    });
  };

  var unbindWindowEvents = function unbindWindowEvents() {
    var win = (0, _getWindowFromRef2.default)(getDraggableRef());

    eventKeys.forEach(function (eventKey) {
      return win.removeEventListener(eventKey, windowBindings[eventKey]);
    });
  };

  var onMouseDown = function onMouseDown(event) {
    if (!canStartCapturing(event)) {
      return;
    }

    if (isCapturing()) {
      console.error('should not be able to perform a mouse down while a drag or pending drag is occurring');
      cancel();
      return;
    }

    var button = event.button,
        clientX = event.clientX,
        clientY = event.clientY;

    if (button !== primaryButton) {
      return;
    }

    (0, _stopEvent2.default)(event);
    var point = {
      x: clientX,
      y: clientY
    };

    startPendingDrag(point);
  };

  var onClick = function onClick(event) {
    if (!state.preventClick) {
      return;
    }

    setState({
      preventClick: false
    });
    (0, _stopEvent2.default)(event);
  };

  var sensor = {
    onMouseDown: onMouseDown,
    onClick: onClick,
    kill: kill,
    isCapturing: isCapturing,
    isDragging: isDragging
  };

  return sensor;
};