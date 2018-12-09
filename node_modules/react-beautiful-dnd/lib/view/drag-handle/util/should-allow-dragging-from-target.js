'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var interactiveTagNames = exports.interactiveTagNames = {
  input: true,
  button: true,
  textarea: true,
  select: true,
  option: true,
  optgroup: true,
  video: true,
  audio: true
};

var isContentEditable = function isContentEditable(parent, current) {
  if (current == null) {
    return false;
  }

  var attribute = current.getAttribute('contenteditable');
  if (attribute === 'true' || attribute === '') {
    return true;
  }

  if (current === parent) {
    return false;
  }

  return isContentEditable(parent, current.parentElement);
};

exports.default = function (event, props) {
  if (props.canDragInteractiveElements) {
    return true;
  }

  var target = event.target,
      currentTarget = event.currentTarget;

  if (!(target instanceof HTMLElement) || !(currentTarget instanceof HTMLElement)) {
    return true;
  }

  var isTargetInteractive = Boolean(interactiveTagNames[target.tagName.toLowerCase()]);

  if (isTargetInteractive) {
    return false;
  }

  return !isContentEditable(currentTarget, target);
};