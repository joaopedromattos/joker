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

var _reactMotion = require('react-motion');

var _animation = require('../animation');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var origin = {
  x: 0,
  y: 0
};

var noMovement = {
  transform: null
};

var isAtOrigin = function isAtOrigin(point) {
  return point.x === origin.x && point.y === origin.y;
};

var getStyle = function getStyle(isNotMoving, x, y) {
  if (isNotMoving) {
    return noMovement;
  }

  var point = { x: x, y: y };

  if (isAtOrigin(point)) {
    return noMovement;
  }
  var style = {
    transform: 'translate(' + point.x + 'px, ' + point.y + 'px)'
  };
  return style;
};

var Movable = function (_Component) {
  (0, _inherits3.default)(Movable, _Component);

  function Movable() {
    var _ref;

    var _temp, _this, _ret;

    (0, _classCallCheck3.default)(this, Movable);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = (0, _possibleConstructorReturn3.default)(this, (_ref = Movable.__proto__ || (0, _getPrototypeOf2.default)(Movable)).call.apply(_ref, [this].concat(args))), _this), _this.onRest = function () {
      var onMoveEnd = _this.props.onMoveEnd;


      if (!onMoveEnd) {
        return;
      }

      setTimeout(function () {
        return onMoveEnd();
      });
    }, _this.getFinal = function () {
      var destination = _this.props.destination;
      var speed = _this.props.speed;

      if (speed === 'INSTANT') {
        return destination;
      }

      var selected = speed === 'FAST' ? _animation.physics.fast : _animation.physics.standard;

      return {
        x: (0, _reactMotion.spring)(destination.x, selected),
        y: (0, _reactMotion.spring)(destination.y, selected)
      };
    }, _temp), (0, _possibleConstructorReturn3.default)(_this, _ret);
  }

  (0, _createClass3.default)(Movable, [{
    key: 'render',
    value: function render() {
      var _this2 = this;

      var final = this.getFinal();

      var isNotMoving = isAtOrigin(final);

      return _react2.default.createElement(
        _reactMotion.Motion,
        { defaultStyle: origin, style: final, onRest: this.onRest },
        function (current) {
          return _this2.props.children(getStyle(isNotMoving, current.x, current.y));
        }
      );
    }
  }]);
  return Movable;
}(_react.Component);

Movable.defaultProps = {
  destination: origin
};
exports.default = Movable;