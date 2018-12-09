'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPixelThresholds = exports.config = undefined;

var _rafSchd = require('raf-schd');

var _rafSchd2 = _interopRequireDefault(_rafSchd);

var _getViewport = require('../../window/get-viewport');

var _getViewport2 = _interopRequireDefault(_getViewport);

var _position = require('../position');

var _getBestScrollableDroppable = require('./get-best-scrollable-droppable');

var _getBestScrollableDroppable2 = _interopRequireDefault(_getBestScrollableDroppable);

var _axis = require('../axis');

var _canScroll = require('./can-scroll');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = exports.config = {
  startFrom: 0.25,
  maxSpeedAt: 0.05,

  maxScrollSpeed: 28,

  ease: function ease(percentage) {
    return Math.pow(percentage, 2);
  }
};

var origin = { x: 0, y: 0 };

var clean = (0, _position.apply)(function (value) {
  return value === 0 ? 0 : value;
});

var getPixelThresholds = exports.getPixelThresholds = function getPixelThresholds(container, axis) {
  var startFrom = container[axis.size] * config.startFrom;
  var maxSpeedAt = container[axis.size] * config.maxSpeedAt;
  var accelerationPlane = startFrom - maxSpeedAt;

  var thresholds = {
    startFrom: startFrom,
    maxSpeedAt: maxSpeedAt,
    accelerationPlane: accelerationPlane
  };

  return thresholds;
};

var getSpeed = function getSpeed(distance, thresholds) {
  if (distance >= thresholds.startFrom) {
    return 0;
  }

  if (distance <= thresholds.maxSpeedAt) {
    return config.maxScrollSpeed;
  }

  var distancePastStart = thresholds.startFrom - distance;
  var percentage = distancePastStart / thresholds.accelerationPlane;
  var transformed = config.ease(percentage);

  var speed = config.maxScrollSpeed * transformed;

  return speed;
};

var adjustForSizeLimits = function adjustForSizeLimits(_ref) {
  var container = _ref.container,
      subject = _ref.subject,
      proposedScroll = _ref.proposedScroll;

  var isTooBigVertically = subject.height > container.height;
  var isTooBigHorizontally = subject.width > container.width;

  if (!isTooBigHorizontally && !isTooBigVertically) {
    return proposedScroll;
  }

  if (isTooBigHorizontally && isTooBigVertically) {
    return null;
  }

  return {
    x: isTooBigHorizontally ? 0 : proposedScroll.x,
    y: isTooBigVertically ? 0 : proposedScroll.y
  };
};

var getRequiredScroll = function getRequiredScroll(_ref2) {
  var container = _ref2.container,
      subject = _ref2.subject,
      center = _ref2.center;

  var distance = {
    top: center.y - container.top,
    right: container.right - center.x,
    bottom: container.bottom - center.y,
    left: center.x - container.left
  };

  var y = function () {
    var thresholds = getPixelThresholds(container, _axis.vertical);
    var isCloserToBottom = distance.bottom < distance.top;

    if (isCloserToBottom) {
      return getSpeed(distance.bottom, thresholds);
    }

    return -1 * getSpeed(distance.top, thresholds);
  }();

  var x = function () {
    var thresholds = getPixelThresholds(container, _axis.horizontal);
    var isCloserToRight = distance.right < distance.left;

    if (isCloserToRight) {
      return getSpeed(distance.right, thresholds);
    }

    return -1 * getSpeed(distance.left, thresholds);
  }();

  var required = clean({ x: x, y: y });

  if ((0, _position.isEqual)(required, origin)) {
    return null;
  }

  var limited = adjustForSizeLimits({
    container: container,
    subject: subject,
    proposedScroll: required
  });

  if (!limited) {
    return null;
  }

  return (0, _position.isEqual)(limited, origin) ? null : limited;
};

var withPlaceholder = function withPlaceholder(droppable, draggable) {
  var closest = droppable.viewport.closestScrollable;

  if (!closest) {
    return null;
  }

  var isOverHome = droppable.descriptor.id === draggable.descriptor.droppableId;
  var max = closest.scroll.max;
  var current = closest.scroll.current;

  if (isOverHome) {
    return { max: max, current: current };
  }

  var spaceForPlaceholder = (0, _position.patch)(droppable.axis.line, draggable.placeholder.withoutMargin[droppable.axis.size]);

  var newMax = (0, _position.add)(max, spaceForPlaceholder);

  var newCurrent = {
    x: Math.min(current.x, newMax.x),
    y: Math.min(current.y, newMax.y)
  };

  return {
    max: newMax,
    current: newCurrent
  };
};

exports.default = function (_ref3) {
  var scrollWindow = _ref3.scrollWindow,
      scrollDroppable = _ref3.scrollDroppable;

  var scheduleWindowScroll = (0, _rafSchd2.default)(scrollWindow);
  var scheduleDroppableScroll = (0, _rafSchd2.default)(scrollDroppable);

  var scroller = function scroller(state) {
    var drag = state.drag;
    if (!drag) {
      console.error('Invalid drag state');
      return;
    }

    var center = drag.current.page.center;

    var draggable = state.dimension.draggable[drag.initial.descriptor.id];
    var subject = draggable.page.withMargin;
    var viewport = (0, _getViewport2.default)();
    var requiredWindowScroll = getRequiredScroll({
      container: viewport,
      subject: subject,
      center: center
    });

    if (requiredWindowScroll && (0, _canScroll.canScrollWindow)(requiredWindowScroll)) {
      scheduleWindowScroll(requiredWindowScroll);
      return;
    }

    var droppable = (0, _getBestScrollableDroppable2.default)({
      center: center,
      destination: drag.impact.destination,
      droppables: state.dimension.droppable
    });

    if (!droppable) {
      return;
    }

    var closestScrollable = droppable.viewport.closestScrollable;

    if (!closestScrollable) {
      return;
    }

    var requiredFrameScroll = getRequiredScroll({
      container: closestScrollable.frame,
      subject: subject,
      center: center
    });

    if (!requiredFrameScroll) {
      return;
    }

    var result = withPlaceholder(droppable, draggable);

    if (!result) {
      return;
    }

    var canScrollDroppable = (0, _canScroll.canPartiallyScroll)({
      max: result.max,
      current: result.current,
      change: requiredFrameScroll
    });

    if (canScrollDroppable) {
      scheduleDroppableScroll(droppable.descriptor.id, requiredFrameScroll);
    }
  };

  scroller.cancel = function () {
    scheduleWindowScroll.cancel();
    scheduleDroppableScroll.cancel();
  };

  return scroller;
};