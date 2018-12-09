"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (lowerBound, upperBound) {
  return function (value) {
    return value <= upperBound && value >= lowerBound;
  };
};