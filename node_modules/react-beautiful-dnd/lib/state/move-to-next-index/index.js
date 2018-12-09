'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _inHomeList = require('./in-home-list');

var _inHomeList2 = _interopRequireDefault(_inHomeList);

var _inForeignList = require('./in-foreign-list');

var _inForeignList2 = _interopRequireDefault(_inForeignList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (args) {
  var draggableId = args.draggableId,
      draggables = args.draggables,
      droppable = args.droppable;


  var draggable = draggables[draggableId];
  var isInHomeList = draggable.descriptor.droppableId === droppable.descriptor.id;

  if (!droppable.isEnabled) {
    return null;
  }

  if (isInHomeList) {
    return (0, _inHomeList2.default)(args);
  }

  return (0, _inForeignList2.default)(args);
};