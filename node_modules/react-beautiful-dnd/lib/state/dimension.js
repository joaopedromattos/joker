'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDroppableDimension = exports.scrollDroppable = exports.clip = exports.getDraggableDimension = exports.noSpacing = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _axis = require('./axis');

var _getArea = require('./get-area');

var _getArea2 = _interopRequireDefault(_getArea);

var _spacing = require('./spacing');

var _position = require('./position');

var _getMaxScroll = require('./get-max-scroll');

var _getMaxScroll2 = _interopRequireDefault(_getMaxScroll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var origin = { x: 0, y: 0 };

var noSpacing = exports.noSpacing = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};

var getDraggableDimension = exports.getDraggableDimension = function getDraggableDimension(_ref) {
  var descriptor = _ref.descriptor,
      client = _ref.client,
      _ref$margin = _ref.margin,
      margin = _ref$margin === undefined ? noSpacing : _ref$margin,
      _ref$windowScroll = _ref.windowScroll,
      windowScroll = _ref$windowScroll === undefined ? origin : _ref$windowScroll;

  var withScroll = (0, _spacing.offsetByPosition)(client, windowScroll);

  var dimension = {
    descriptor: descriptor,
    placeholder: {
      margin: margin,
      withoutMargin: {
        width: client.width,
        height: client.height
      }
    },

    client: {
      withoutMargin: (0, _getArea2.default)(client),
      withMargin: (0, _getArea2.default)((0, _spacing.expandBySpacing)(client, margin))
    },

    page: {
      withoutMargin: (0, _getArea2.default)(withScroll),
      withMargin: (0, _getArea2.default)((0, _spacing.expandBySpacing)(withScroll, margin))
    }
  };

  return dimension;
};

var clip = exports.clip = function clip(frame, subject) {
  var result = (0, _getArea2.default)({
    top: Math.max(subject.top, frame.top),
    right: Math.min(subject.right, frame.right),
    bottom: Math.min(subject.bottom, frame.bottom),
    left: Math.max(subject.left, frame.left)
  });

  if (result.width <= 0 || result.height <= 0) {
    return null;
  }

  return result;
};

var scrollDroppable = exports.scrollDroppable = function scrollDroppable(droppable, newScroll) {
  if (!droppable.viewport.closestScrollable) {
    console.error('Cannot scroll droppble that does not have a closest scrollable');
    return droppable;
  }

  var existingScrollable = droppable.viewport.closestScrollable;

  var frame = existingScrollable.frame;

  var scrollDiff = (0, _position.subtract)(newScroll, existingScrollable.scroll.initial);

  var scrollDisplacement = (0, _position.negate)(scrollDiff);

  var closestScrollable = {
    frame: existingScrollable.frame,
    shouldClipSubject: existingScrollable.shouldClipSubject,
    scroll: {
      initial: existingScrollable.scroll.initial,
      current: newScroll,
      diff: {
        value: scrollDiff,
        displacement: scrollDisplacement
      },

      max: existingScrollable.scroll.max
    }
  };

  var displacedSubject = (0, _spacing.offsetByPosition)(droppable.viewport.subject, scrollDisplacement);

  var clipped = closestScrollable.shouldClipSubject ? clip(frame, displacedSubject) : (0, _getArea2.default)(displacedSubject);

  var viewport = {
    closestScrollable: closestScrollable,
    subject: droppable.viewport.subject,
    clipped: clipped
  };

  return (0, _extends3.default)({}, droppable, {
    viewport: viewport
  });
};

var getDroppableDimension = exports.getDroppableDimension = function getDroppableDimension(_ref2) {
  var descriptor = _ref2.descriptor,
      client = _ref2.client,
      closest = _ref2.closest,
      _ref2$direction = _ref2.direction,
      direction = _ref2$direction === undefined ? 'vertical' : _ref2$direction,
      _ref2$margin = _ref2.margin,
      margin = _ref2$margin === undefined ? noSpacing : _ref2$margin,
      _ref2$padding = _ref2.padding,
      padding = _ref2$padding === undefined ? noSpacing : _ref2$padding,
      _ref2$windowScroll = _ref2.windowScroll,
      windowScroll = _ref2$windowScroll === undefined ? origin : _ref2$windowScroll,
      _ref2$isEnabled = _ref2.isEnabled,
      isEnabled = _ref2$isEnabled === undefined ? true : _ref2$isEnabled;

  var withMargin = (0, _spacing.expandBySpacing)(client, margin);
  var withWindowScroll = (0, _spacing.offsetByPosition)(client, windowScroll);
  var subject = (0, _getArea2.default)((0, _spacing.expandBySpacing)(withWindowScroll, margin));

  var closestScrollable = function () {
    if (!closest) {
      return null;
    }

    var frame = (0, _getArea2.default)((0, _spacing.offsetByPosition)(closest.frameClient, windowScroll));

    var maxScroll = (0, _getMaxScroll2.default)({
      scrollHeight: closest.scrollHeight,
      scrollWidth: closest.scrollWidth,
      height: frame.height,
      width: frame.width
    });

    var result = {
      frame: frame,
      shouldClipSubject: closest.shouldClipSubject,
      scroll: {
        initial: closest.scroll,

        current: closest.scroll,
        max: maxScroll,
        diff: {
          value: origin,
          displacement: origin
        }
      }
    };

    return result;
  }();

  var clipped = closestScrollable && closestScrollable.shouldClipSubject ? clip(closestScrollable.frame, subject) : subject;

  var viewport = {
    closestScrollable: closestScrollable,
    subject: subject,
    clipped: clipped
  };

  var dimension = {
    descriptor: descriptor,
    isEnabled: isEnabled,
    axis: direction === 'vertical' ? _axis.vertical : _axis.horizontal,
    client: {
      withoutMargin: (0, _getArea2.default)(client),
      withMargin: (0, _getArea2.default)(withMargin),
      withMarginAndPadding: (0, _getArea2.default)((0, _spacing.expandBySpacing)(withMargin, padding))
    },
    page: {
      withoutMargin: (0, _getArea2.default)(withWindowScroll),
      withMargin: subject,
      withMarginAndPadding: (0, _getArea2.default)((0, _spacing.expandBySpacing)((0, _spacing.expandBySpacing)(withWindowScroll, margin), padding))
    },
    viewport: viewport
  };

  return dimension;
};