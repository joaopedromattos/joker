'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (state, id) {
  var phase = state.phase;

  if (phase === 'IDLE' || phase === 'DROP_COMPLETE') {
    return true;
  }

  if (phase === 'PREPARING' || phase === 'COLLECTING_INITIAL_DIMENSIONS' || phase === 'DRAGGING') {
    return false;
  }

  if (phase === 'DROP_ANIMATING') {
    if (!state.drop || !state.drop.pending) {
      console.error('Invalid state shape for drop animating');
      return false;
    }

    if (state.drop.pending.result.draggableId === id) {
      return false;
    }

    return state.drop.pending.result.reason === 'DROP';
  }

  console.warn('unhandled phase ' + phase + ' in canLift check');
  return false;
};