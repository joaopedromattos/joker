'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (change) {
  window.scrollBy(change.x, change.y);
};