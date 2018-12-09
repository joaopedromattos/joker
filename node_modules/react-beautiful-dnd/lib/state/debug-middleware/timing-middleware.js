'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  return function (next) {
    return function (action) {
      var key = 'action: ' + action.type;
      console.time(key);

      var result = next(action);

      console.timeEnd(key);

      return result;
    };
  };
};