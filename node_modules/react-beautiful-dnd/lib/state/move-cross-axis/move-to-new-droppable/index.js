'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toHomeList = require('./to-home-list');

var _toHomeList2 = _interopRequireDefault(_toHomeList);

var _toForeignList = require('./to-foreign-list');

var _toForeignList2 = _interopRequireDefault(_toForeignList);

var _position = require('../../position');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (_ref) {
  var pageCenter = _ref.pageCenter,
      destination = _ref.destination,
      draggable = _ref.draggable,
      target = _ref.target,
      home = _ref.home,
      insideDestination = _ref.insideDestination,
      previousImpact = _ref.previousImpact;

  var amount = (0, _position.patch)(destination.axis.line, draggable.client.withMargin[destination.axis.size]);

  if (destination.descriptor.id === draggable.descriptor.droppableId) {
    return (0, _toHomeList2.default)({
      amount: amount,
      originalIndex: home.index,
      target: target,
      insideDroppable: insideDestination,
      draggable: draggable,
      droppable: destination,
      previousImpact: previousImpact
    });
  }

  return (0, _toForeignList2.default)({
    amount: amount,
    pageCenter: pageCenter,
    target: target,
    insideDroppable: insideDestination,
    draggable: draggable,
    droppable: destination,
    previousImpact: previousImpact
  });
};