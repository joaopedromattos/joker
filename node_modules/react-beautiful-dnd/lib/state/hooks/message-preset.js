'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var onDragStart = function onDragStart(start) {
  return '\n  You have lifted an item in position ' + (start.source.index + 1) + '.\n  Use the arrow keys to move, space bar to drop, and escape to cancel.\n';
};

var onDragUpdate = function onDragUpdate(update) {
  if (!update.destination) {
    return 'You are currently not dragging over a droppable area';
  }

  if (update.source.droppableId === update.destination.droppableId) {
    return 'You have moved the item to position ' + (update.destination.index + 1);
  }

  return '\n    You have moved the item from list ' + update.source.droppableId + ' in position ' + (update.source.index + 1) + '\n    to list ' + update.destination.droppableId + ' in position ' + (update.destination.index + 1) + '\n  ';
};

var onDragEnd = function onDragEnd(result) {
  if (result.reason === 'CANCEL') {
    return '\n      Movement cancelled.\n      The item has returned to its starting position of ' + (result.source.index + 1) + '\n    ';
  }

  if (!result.destination) {
    return '\n      The item has been dropped while not over a droppable location.\n      The item has returned to its starting position of ' + (result.source.index + 1) + '\n    ';
  }

  if (result.source.droppableId === result.destination.droppableId) {
    if (result.source.index === result.destination.index) {
      return '\n        You have dropped the item.\n        It has been dropped on its starting position of ' + (result.source.index + 1) + '\n      ';
    }

    return '\n      You have dropped the item.\n      It has moved from position ' + (result.source.index + 1) + ' to ' + (result.destination.index + 1) + '\n    ';
  }

  return '\n    You have dropped the item.\n    It has moved from position ' + (result.source.index + 1) + ' in list ' + result.source.droppableId + '\n    to position ' + (result.destination.index + 1) + ' in list ' + result.destination.droppableId + '\n  ';
};

var preset = {
  onDragStart: onDragStart, onDragUpdate: onDragUpdate, onDragEnd: onDragEnd
};

exports.default = preset;