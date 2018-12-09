'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _blocked;

var _keyCodes = require('../../key-codes');

var keyCodes = _interopRequireWildcard(_keyCodes);

var _stopEvent = require('./stop-event');

var _stopEvent2 = _interopRequireDefault(_stopEvent);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var blocked = (_blocked = {}, (0, _defineProperty3.default)(_blocked, keyCodes.enter, true), (0, _defineProperty3.default)(_blocked, keyCodes.tab, true), _blocked);

exports.default = function (event) {
  if (blocked[event.keyCode]) {
    (0, _stopEvent2.default)(event);
  }
};