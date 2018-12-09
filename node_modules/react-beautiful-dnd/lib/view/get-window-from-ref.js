"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (ref) {
  return ref ? ref.ownerDocument.defaultView : window;
};