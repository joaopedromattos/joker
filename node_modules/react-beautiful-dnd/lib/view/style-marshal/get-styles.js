'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _animation = require('../animation');

var prefix = 'data-react-beautiful-dnd';

exports.default = function (styleContext) {
  var dragHandleSelector = '[' + prefix + '-drag-handle="' + styleContext + '"]';
  var draggableSelector = '[' + prefix + '-draggable="' + styleContext + '"]';
  var droppableSelector = '[' + prefix + '-droppable="' + styleContext + '"]';

  var dragHandleStyles = {
    base: '\n      ' + dragHandleSelector + ' {\n        -webkit-touch-callout: none;\n        -webkit-tap-highlight-color: rgba(0,0,0,0);\n        touch-action: manipulation;\n      }\n    ',
    grabCursor: '\n      ' + dragHandleSelector + ' {\n        cursor: -webkit-grab;\n        cursor: grab;\n      }\n    ',
    blockPointerEvents: '\n      ' + dragHandleSelector + ' {\n        pointer-events: none;\n      }\n    '
  };

  var draggableStyles = {
    animateMovement: '\n      ' + draggableSelector + ' {\n        transition: ' + _animation.css.outOfTheWay + ';\n      }\n    '
  };

  var droppableStyles = {
    base: '\n      ' + droppableSelector + ' {\n        overflow-anchor: none;\n      }\n    '
  };

  var bodyStyles = {
    whileActiveDragging: '\n      body {\n        cursor: grabbing;\n        cursor: -webkit-grabbing;\n        user-select: none;\n        -webkit-user-select: none;\n        -moz-user-select: none;\n        -ms-user-select: none;\n      }\n    '
  };

  var base = [dragHandleStyles.base, droppableStyles.base];

  var resting = [].concat(base, [dragHandleStyles.grabCursor]).join('');

  var dragging = [].concat(base, [dragHandleStyles.blockPointerEvents, draggableStyles.animateMovement, bodyStyles.whileActiveDragging]).join('');

  var dropAnimating = [].concat(base, [dragHandleStyles.grabCursor, draggableStyles.animateMovement]).join('');

  var userCancel = [].concat(base, [draggableStyles.animateMovement]).join('');

  return { resting: resting, dragging: dragging, dropAnimating: dropAnimating, userCancel: userCancel };
};