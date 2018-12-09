'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _scrollJumpKeys;

var _stopEvent = require('../util/stop-event');

var _stopEvent2 = _interopRequireDefault(_stopEvent);

var _createScheduler = require('../util/create-scheduler');

var _createScheduler2 = _interopRequireDefault(_createScheduler);

var _blockStandardKeyEvents = require('../util/block-standard-key-events');

var _blockStandardKeyEvents2 = _interopRequireDefault(_blockStandardKeyEvents);

var _keyCodes = require('../../key-codes');

var keyCodes = _interopRequireWildcard(_keyCodes);

var _getWindowFromRef = require('../../get-window-from-ref');

var _getWindowFromRef2 = _interopRequireDefault(_getWindowFromRef);

var _getCenterPosition = require('../../get-center-position');

var _getCenterPosition2 = _interopRequireDefault(_getCenterPosition);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scrollJumpKeys = (_scrollJumpKeys = {}, (0, _defineProperty3.default)(_scrollJumpKeys, keyCodes.pageDown, true), (0, _defineProperty3.default)(_scrollJumpKeys, keyCodes.pageUp, true), (0, _defineProperty3.default)(_scrollJumpKeys, keyCodes.home, true), (0, _defineProperty3.default)(_scrollJumpKeys, keyCodes.end, true), _scrollJumpKeys);

var noop = function noop() {};

exports.default = function (_ref) {
  var callbacks = _ref.callbacks,
      getDraggableRef = _ref.getDraggableRef,
      canStartCapturing = _ref.canStartCapturing;

  var state = {
    isDragging: false
  };
  var setState = function setState(newState) {
    state = newState;
  };
  var startDragging = function startDragging() {
    var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;

    setState({
      isDragging: true
    });
    bindWindowEvents();
    fn();
  };
  var stopDragging = function stopDragging() {
    var fn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : noop;

    schedule.cancel();
    unbindWindowEvents();
    setState({
      isDragging: false
    });
    fn();
  };
  var kill = function kill() {
    return stopDragging();
  };
  var cancel = function cancel() {
    stopDragging(callbacks.onCancel);
  };
  var isDragging = function isDragging() {
    return state.isDragging;
  };
  var schedule = (0, _createScheduler2.default)(callbacks);

  var onKeyDown = function onKeyDown(event, props) {
    var direction = props.direction;

    if (!isDragging()) {
      if (!canStartCapturing(event)) {
        return;
      }

      if (event.keyCode !== keyCodes.space) {
        return;
      }

      (0, _stopEvent2.default)(event);

      var ref = getDraggableRef();

      if (!ref) {
        console.error('cannot start a keyboard drag without a draggable ref');
        return;
      }

      var center = (0, _getCenterPosition2.default)(ref);

      startDragging(function () {
        return callbacks.onLift({
          client: center,
          autoScrollMode: 'JUMP'
        });
      });
      return;
    }

    if (event.keyCode === keyCodes.escape) {
      (0, _stopEvent2.default)(event);
      cancel();
      return;
    }

    if (event.keyCode === keyCodes.space) {
      (0, _stopEvent2.default)(event);
      stopDragging(callbacks.onDrop);
      return;
    }

    if (!direction) {
      console.error('Cannot handle keyboard movement event if direction is not provided');
      (0, _stopEvent2.default)(event);
      cancel();
      return;
    }

    var executeBasedOnDirection = function executeBasedOnDirection(fns) {
      if (direction === 'vertical') {
        fns.vertical();
        return;
      }
      fns.horizontal();
    };

    if (event.keyCode === keyCodes.arrowDown) {
      (0, _stopEvent2.default)(event);
      executeBasedOnDirection({
        vertical: schedule.moveForward,
        horizontal: schedule.crossAxisMoveForward
      });
      return;
    }

    if (event.keyCode === keyCodes.arrowUp) {
      (0, _stopEvent2.default)(event);
      executeBasedOnDirection({
        vertical: schedule.moveBackward,
        horizontal: schedule.crossAxisMoveBackward
      });
      return;
    }

    if (event.keyCode === keyCodes.arrowRight) {
      (0, _stopEvent2.default)(event);
      executeBasedOnDirection({
        vertical: schedule.crossAxisMoveForward,
        horizontal: schedule.moveForward
      });
      return;
    }

    if (event.keyCode === keyCodes.arrowLeft) {
      (0, _stopEvent2.default)(event);
      executeBasedOnDirection({
        vertical: schedule.crossAxisMoveBackward,
        horizontal: schedule.moveBackward
      });
    }

    (0, _blockStandardKeyEvents2.default)(event);

    if (scrollJumpKeys[event.keyCode]) {
      (0, _stopEvent2.default)(event);
    }
  };

  var windowBindings = {
    mousedown: cancel,
    mouseup: cancel,
    click: cancel,
    touchstart: cancel,

    resize: cancel,

    wheel: cancel,

    scroll: callbacks.onWindowScroll
  };

  var eventKeys = (0, _keys2.default)(windowBindings);

  var bindWindowEvents = function bindWindowEvents() {
    var win = (0, _getWindowFromRef2.default)(getDraggableRef());

    eventKeys.forEach(function (eventKey) {
      win.addEventListener(eventKey, windowBindings[eventKey]);
    });
  };

  var unbindWindowEvents = function unbindWindowEvents() {
    var win = (0, _getWindowFromRef2.default)(getDraggableRef());

    eventKeys.forEach(function (eventKey) {
      win.removeEventListener(eventKey, windowBindings[eventKey]);
    });
  };

  var sensor = {
    onKeyDown: onKeyDown,
    kill: kill,
    isDragging: isDragging,

    isCapturing: isDragging
  };

  return sensor;
};