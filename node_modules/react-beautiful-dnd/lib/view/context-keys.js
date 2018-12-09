'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var prefix = function prefix(key) {
  return 'private-react-beautiful-dnd-key-do-not-use-' + key;
};

var storeKey = exports.storeKey = prefix('store');
var droppableIdKey = exports.droppableIdKey = prefix('droppable-id');
var dimensionMarshalKey = exports.dimensionMarshalKey = prefix('dimension-marshal');
var styleContextKey = exports.styleContextKey = prefix('style-context');
var canLiftContextKey = exports.canLiftContextKey = prefix('can-lift');