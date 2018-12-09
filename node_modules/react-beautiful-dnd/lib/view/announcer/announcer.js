'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var count = 0;

var visuallyHidden = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  margin: '-1px',
  border: '0',
  padding: '0',
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',

  'clip-path': 'inset(100%)'
};

exports.default = function () {
  var id = 'react-beautiful-dnd-announcement-' + count++;

  var state = {
    el: null
  };

  var setState = function setState(newState) {
    state = newState;
  };

  var announce = function announce(message) {
    var el = state.el;
    if (!el) {
      console.error('Cannot announce to unmounted node');
      return;
    }

    el.textContent = message;
  };

  var mount = function mount() {
    if (state.el) {
      console.error('Announcer already mounted');
      return;
    }

    var el = document.createElement('div');

    el.id = id;

    el.setAttribute('aria-live', 'assertive');
    el.setAttribute('role', 'log');

    el.setAttribute('aria-atomic', 'true');

    (0, _assign2.default)(el.style, visuallyHidden);

    if (!document.body) {
      throw new Error('Cannot find the head to append a style to');
    }

    document.body.appendChild(el);
    setState({
      el: el
    });
  };

  var unmount = function unmount() {
    if (!state.el) {
      console.error('Will not unmount annoucer as it is already unmounted');
      return;
    }
    var node = state.el;

    setState({
      el: null
    });

    if (!node.parentNode) {
      console.error('Cannot unmount style marshal as cannot find parent');
      return;
    }

    node.parentNode.removeChild(node);
  };

  var announcer = {
    announce: announce,
    id: id,
    mount: mount,
    unmount: unmount
  };

  return announcer;
};