'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (store) {
  return function (next) {
    return function (action) {
      console.group('action: ' + action.type);
      var before = store.getState();

      var result = next(action);

      var after = store.getState();

      console.log({ action: action, before: before, after: after });
      console.groupEnd();

      return result;
    };
  };
};