'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _position = require('./position');

exports.default = function (droppable, point) {
  var closestScrollable = droppable.viewport.closestScrollable;
  if (!closestScrollable) {
    return point;
  }

  return (0, _position.add)(point, closestScrollable.scroll.diff.displacement);
};