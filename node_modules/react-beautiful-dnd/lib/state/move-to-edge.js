'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _position = require('./position');

exports.default = function (_ref) {
  var source = _ref.source,
      sourceEdge = _ref.sourceEdge,
      destination = _ref.destination,
      destinationEdge = _ref.destinationEdge,
      destinationAxis = _ref.destinationAxis;

  var getCorner = function getCorner(area) {
    return (0, _position.patch)(destinationAxis.line, area[destinationAxis[destinationEdge]], area[destinationAxis.crossAxisStart]);
  };

  var corner = getCorner(destination);

  var centerDiff = (0, _position.absolute)((0, _position.subtract)(source.center, getCorner(source)));

  var signed = (0, _position.patch)(destinationAxis.line, (sourceEdge === 'end' ? -1 : 1) * centerDiff[destinationAxis.line], centerDiff[destinationAxis.crossAxisLine]);

  return (0, _position.add)(corner, signed);
};