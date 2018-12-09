'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zIndexOptions = undefined;

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

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

var _Draggable$contextTyp;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _memoizeOne = require('memoize-one');

var _memoizeOne2 = _interopRequireDefault(_memoizeOne);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _draggableDimensionPublisher = require('../draggable-dimension-publisher/');

var _draggableDimensionPublisher2 = _interopRequireDefault(_draggableDimensionPublisher);

var _moveable = require('../moveable/');

var _moveable2 = _interopRequireDefault(_moveable);

var _dragHandle = require('../drag-handle');

var _dragHandle2 = _interopRequireDefault(_dragHandle);

var _getWindowScroll = require('../../window/get-window-scroll');

var _getWindowScroll2 = _interopRequireDefault(_getWindowScroll);

var _getCenterPosition = require('../get-center-position');

var _getCenterPosition2 = _interopRequireDefault(_getCenterPosition);

var _placeholder = require('../placeholder');

var _placeholder2 = _interopRequireDefault(_placeholder);

var _contextKeys = require('../context-keys');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var zIndexOptions = exports.zIndexOptions = {
  dragging: 5000,
  dropAnimating: 4500
};

var Draggable = function (_Component) {
  (0, _inherits3.default)(Draggable, _Component);

  function Draggable(props, context) {
    (0, _classCallCheck3.default)(this, Draggable);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Draggable.__proto__ || (0, _getPrototypeOf2.default)(Draggable)).call(this, props, context));

    _this.state = {
      ref: null
    };

    _this.onMoveEnd = function () {
      if (!_this.props.isDropAnimating) {
        return;
      }

      _this.props.dropAnimationFinished();
    };

    _this.onLift = function (options) {
      _this.throwIfCannotDrag();
      var client = options.client,
          autoScrollMode = options.autoScrollMode;
      var _this$props = _this.props,
          lift = _this$props.lift,
          draggableId = _this$props.draggableId;
      var ref = _this.state.ref;


      if (!ref) {
        throw new Error('cannot lift at this time');
      }

      var initial = {
        selection: client,
        center: (0, _getCenterPosition2.default)(ref)
      };

      var windowScroll = (0, _getWindowScroll2.default)();

      lift(draggableId, initial, windowScroll, autoScrollMode);
    };

    _this.onMove = function (client) {
      _this.throwIfCannotDrag();

      var _this$props2 = _this.props,
          draggableId = _this$props2.draggableId,
          dimension = _this$props2.dimension,
          move = _this$props2.move;

      if (!dimension) {
        return;
      }

      var windowScroll = (0, _getWindowScroll2.default)();

      move(draggableId, client, windowScroll);
    };

    _this.onMoveForward = function () {
      _this.throwIfCannotDrag();
      _this.props.moveForward(_this.props.draggableId);
    };

    _this.onMoveBackward = function () {
      _this.throwIfCannotDrag();
      _this.props.moveBackward(_this.props.draggableId);
    };

    _this.onCrossAxisMoveForward = function () {
      _this.throwIfCannotDrag();
      _this.props.crossAxisMoveForward(_this.props.draggableId);
    };

    _this.onCrossAxisMoveBackward = function () {
      _this.throwIfCannotDrag();
      _this.props.crossAxisMoveBackward(_this.props.draggableId);
    };

    _this.onWindowScroll = function () {
      _this.throwIfCannotDrag();
      var windowScroll = (0, _getWindowScroll2.default)();
      _this.props.moveByWindowScroll(_this.props.draggableId, windowScroll);
    };

    _this.onDrop = function () {
      _this.throwIfCannotDrag();
      _this.props.drop();
    };

    _this.onCancel = function () {
      _this.props.cancel();
    };

    _this.setRef = function (ref) {
      if (ref === null) {
        return;
      }

      if (ref === _this.state.ref) {
        return;
      }

      _this.setState({
        ref: ref
      });
    };

    _this.getDraggableRef = function () {
      return _this.state.ref;
    };

    _this.getDraggingStyle = (0, _memoizeOne2.default)(function (dimension, isDropAnimating, movementStyle) {
      var _dimension$client$wit = dimension.client.withoutMargin,
          width = _dimension$client$wit.width,
          height = _dimension$client$wit.height,
          top = _dimension$client$wit.top,
          left = _dimension$client$wit.left;

      var style = {
        position: 'fixed',
        boxSizing: 'border-box',
        zIndex: isDropAnimating ? zIndexOptions.dropAnimating : zIndexOptions.dragging,
        width: width,
        height: height,
        top: top,
        left: left,
        margin: 0,
        pointerEvents: 'none',
        transition: 'none',
        transform: movementStyle.transform ? '' + movementStyle.transform : null
      };
      return style;
    });
    _this.getNotDraggingStyle = (0, _memoizeOne2.default)(function (movementStyle, shouldAnimateDisplacement) {
      var style = {
        transform: movementStyle.transform,

        transition: shouldAnimateDisplacement ? null : 'none'
      };
      return style;
    });
    _this.getProvided = (0, _memoizeOne2.default)(function (isDragging, isDropAnimating, shouldAnimateDisplacement, dimension, dragHandleProps, movementStyle) {
      var useDraggingStyle = isDragging || isDropAnimating;

      var draggableStyle = function () {
        if (!useDraggingStyle) {
          return _this.getNotDraggingStyle(movementStyle, shouldAnimateDisplacement);
        }

        (0, _invariant2.default)(dimension, 'draggable dimension required for dragging');

        return _this.getDraggingStyle(dimension, isDropAnimating, movementStyle);
      }();

      var provided = {
        innerRef: _this.setRef,
        draggableProps: {
          'data-react-beautiful-dnd-draggable': _this.styleContext,
          style: draggableStyle
        },
        dragHandleProps: dragHandleProps,
        placeholder: useDraggingStyle ? _this.getPlaceholder() : null
      };
      return provided;
    });
    _this.getSnapshot = (0, _memoizeOne2.default)(function (isDragging, isDropAnimating, draggingOver) {
      return {
        isDragging: isDragging || isDropAnimating,
        draggingOver: draggingOver
      };
    });
    _this.getSpeed = (0, _memoizeOne2.default)(function (isDragging, shouldAnimateDragMovement, isDropAnimating) {
      if (isDropAnimating) {
        return 'STANDARD';
      }

      if (isDragging && shouldAnimateDragMovement) {
        return 'FAST';
      }

      return 'INSTANT';
    });


    var callbacks = {
      onLift: _this.onLift,
      onMove: _this.onMove,
      onDrop: _this.onDrop,
      onCancel: _this.onCancel,
      onMoveBackward: _this.onMoveBackward,
      onMoveForward: _this.onMoveForward,
      onCrossAxisMoveForward: _this.onCrossAxisMoveForward,
      onCrossAxisMoveBackward: _this.onCrossAxisMoveBackward,
      onWindowScroll: _this.onWindowScroll
    };

    _this.callbacks = callbacks;
    _this.styleContext = context[_contextKeys.styleContextKey];
    return _this;
  }

  (0, _createClass3.default)(Draggable, [{
    key: 'throwIfCannotDrag',
    value: function throwIfCannotDrag() {
      (0, _invariant2.default)(this.state.ref, 'Draggable: cannot drag as no DOM node has been provided');
      (0, _invariant2.default)(!this.props.isDragDisabled, 'Draggable: cannot drag as dragging is not enabled');
    }
  }, {
    key: 'getPlaceholder',
    value: function getPlaceholder() {
      var dimension = this.props.dimension;
      (0, _invariant2.default)(dimension, 'cannot get a drag placeholder when not dragging');

      return _react2.default.createElement(_placeholder2.default, { placeholder: dimension.placeholder });
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          draggableId = _props.draggableId,
          index = _props.index,
          offset = _props.offset,
          isDragging = _props.isDragging,
          isDropAnimating = _props.isDropAnimating,
          isDragDisabled = _props.isDragDisabled,
          dimension = _props.dimension,
          draggingOver = _props.draggingOver,
          direction = _props.direction,
          shouldAnimateDragMovement = _props.shouldAnimateDragMovement,
          shouldAnimateDisplacement = _props.shouldAnimateDisplacement,
          disableInteractiveElementBlocking = _props.disableInteractiveElementBlocking,
          children = _props.children;

      var droppableId = this.context[_contextKeys.droppableIdKey];

      var speed = this.getSpeed(isDragging, shouldAnimateDragMovement, isDropAnimating);

      return _react2.default.createElement(
        _draggableDimensionPublisher2.default,
        {
          draggableId: draggableId,
          droppableId: droppableId,
          index: index,
          targetRef: this.state.ref
        },
        _react2.default.createElement(
          _moveable2.default,
          {
            speed: speed,
            destination: offset,
            onMoveEnd: this.onMoveEnd
          },
          function (movementStyle) {
            return _react2.default.createElement(
              _dragHandle2.default,
              {
                draggableId: draggableId,
                isDragging: isDragging,
                direction: direction,
                isEnabled: !isDragDisabled,
                callbacks: _this2.callbacks,
                getDraggableRef: _this2.getDraggableRef,

                canDragInteractiveElements: disableInteractiveElementBlocking
              },
              function (dragHandleProps) {
                return children(_this2.getProvided(isDragging, isDropAnimating, shouldAnimateDisplacement, dimension, dragHandleProps, movementStyle), _this2.getSnapshot(isDragging, isDropAnimating, draggingOver));
              }
            );
          }
        )
      );
    }
  }]);
  return Draggable;
}(_react.Component);

Draggable.defaultProps = {
  isDragDisabled: false,

  disableInteractiveElementBlocking: false
};
Draggable.contextTypes = (_Draggable$contextTyp = {}, (0, _defineProperty3.default)(_Draggable$contextTyp, _contextKeys.droppableIdKey, _propTypes2.default.string.isRequired), (0, _defineProperty3.default)(_Draggable$contextTyp, _contextKeys.styleContextKey, _propTypes2.default.string.isRequired), _Draggable$contextTyp);
exports.default = Draggable;