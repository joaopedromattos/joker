'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var offsetByPosition = exports.offsetByPosition = function offsetByPosition(spacing, point) {
  return {
    top: spacing.top + point.y,
    left: spacing.left + point.x,
    bottom: spacing.bottom + point.y,
    right: spacing.right + point.x
  };
};

var expandByPosition = exports.expandByPosition = function expandByPosition(spacing, position) {
  return {
    top: spacing.top - position.y,
    left: spacing.left - position.x,

    right: spacing.right + position.x,
    bottom: spacing.bottom + position.y
  };
};

var expandBySpacing = exports.expandBySpacing = function expandBySpacing(spacing1, spacing2) {
  return {
    top: spacing1.top - spacing2.top,
    left: spacing1.left - spacing2.left,

    bottom: spacing1.bottom + spacing2.bottom,
    right: spacing1.right + spacing2.right
  };
};

var isEqual = exports.isEqual = function isEqual(spacing1, spacing2) {
  return spacing1.top === spacing2.top && spacing1.right === spacing2.right && spacing1.bottom === spacing2.bottom && spacing1.left === spacing2.left;
};

var getCorners = exports.getCorners = function getCorners(spacing) {
  return [{ x: spacing.left, y: spacing.top }, { x: spacing.right, y: spacing.top }, { x: spacing.left, y: spacing.bottom }, { x: spacing.right, y: spacing.bottom }];
};