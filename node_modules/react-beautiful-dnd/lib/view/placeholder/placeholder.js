'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Placeholder = function (_PureComponent) {
  (0, _inherits3.default)(Placeholder, _PureComponent);

  function Placeholder() {
    (0, _classCallCheck3.default)(this, Placeholder);
    return (0, _possibleConstructorReturn3.default)(this, (Placeholder.__proto__ || (0, _getPrototypeOf2.default)(Placeholder)).apply(this, arguments));
  }

  (0, _createClass3.default)(Placeholder, [{
    key: 'render',
    value: function render() {

      var placeholder = this.props.placeholder;
      var _placeholder$margin = placeholder.margin,
          top = _placeholder$margin.top,
          left = _placeholder$margin.left,
          bottom = _placeholder$margin.bottom,
          right = _placeholder$margin.right;
      var _placeholder$withoutM = placeholder.withoutMargin,
          width = _placeholder$withoutM.width,
          height = _placeholder$withoutM.height;


      var style = {
        width: width,
        height: height,
        marginTop: top,
        marginLeft: left,
        marginBottom: bottom,
        marginRight: right,
        pointerEvents: 'none',
        boxSizing: 'border-box'
      };
      return _react2.default.createElement('div', { style: style });
    }
  }]);
  return Placeholder;
}(_react.PureComponent);

exports.default = Placeholder;