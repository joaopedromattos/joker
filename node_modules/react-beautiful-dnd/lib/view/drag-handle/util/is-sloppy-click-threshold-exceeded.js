'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var sloppyClickThreshold = exports.sloppyClickThreshold = 5;

exports.default = function (original, current) {
  return Math.abs(current.x - original.x) >= sloppyClickThreshold || Math.abs(current.y - original.y) >= sloppyClickThreshold;
};