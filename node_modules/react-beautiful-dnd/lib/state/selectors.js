'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.draggingDraggableSelector = exports.dragSelector = exports.pendingDropSelector = exports.phaseSelector = undefined;

var _reselect = require('reselect');

var phaseSelector = exports.phaseSelector = function phaseSelector(state) {
  return state.phase;
};

var pendingDropSelector = exports.pendingDropSelector = function pendingDropSelector(state) {
  if (!state.drop || !state.drop.pending) {
    return null;
  }
  return state.drop.pending;
};

var dragSelector = exports.dragSelector = function dragSelector(state) {
  return state.drag;
};

var draggableMapSelector = function draggableMapSelector(state) {
  return state.dimension.draggable;
};

var draggingDraggableSelector = exports.draggingDraggableSelector = (0, _reselect.createSelector)([phaseSelector, dragSelector, pendingDropSelector, draggableMapSelector], function (phase, drag, pending, draggables) {
  if (phase === 'DRAGGING') {
    if (!drag) {
      console.error('cannot get placeholder dimensions as there is an invalid drag state');
      return null;
    }

    var draggable = draggables[drag.initial.descriptor.id];
    return draggable;
  }

  if (phase === 'DROP_ANIMATING') {
    if (!pending) {
      console.error('cannot get placeholder dimensions as there is an invalid drag state');
      return null;
    }

    if (!pending.result.destination) {
      return null;
    }

    var _draggable = draggables[pending.result.draggableId];
    return _draggable;
  }

  return null;
});