'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _extends4 = require('babel-runtime/helpers/extends');

var _extends5 = _interopRequireDefault(_extends4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (callbacks) {
  var state = {
    droppables: {},
    draggables: {},
    isCollecting: false,
    scrollOptions: null,
    request: null,
    frameId: null
  };

  var setState = function setState(partial) {
    var newState = (0, _extends5.default)({}, state, partial);
    state = newState;
  };

  var cancel = function cancel() {
    var _console;

    (_console = console).error.apply(_console, arguments);

    if (!state.isCollecting) {
      return;
    }

    stopCollecting();
    callbacks.cancel();
  };

  var registerDraggable = function registerDraggable(descriptor, getDimension) {
    var id = descriptor.id;

    if (!state.droppables[descriptor.droppableId]) {
      cancel('Cannot register Draggable ' + id + ' as there is no entry for the Droppable ' + descriptor.droppableId);
      return;
    }

    var entry = {
      descriptor: descriptor,
      getDimension: getDimension
    };
    var draggables = (0, _extends5.default)({}, state.draggables, (0, _defineProperty3.default)({}, id, entry));

    setState({
      draggables: draggables
    });

    if (!state.isCollecting) {
      return;
    }

    console.warn('Adding a draggable during a drag is currently not supported');
  };

  var registerDroppable = function registerDroppable(descriptor, droppableCallbacks) {
    var id = descriptor.id;

    var entry = {
      descriptor: descriptor,
      callbacks: droppableCallbacks
    };

    var droppables = (0, _extends5.default)({}, state.droppables, (0, _defineProperty3.default)({}, id, entry));

    setState({
      droppables: droppables
    });

    if (!state.isCollecting) {
      return;
    }

    console.warn('Currently not supporting updating Droppables during a drag');
  };

  var updateDroppableIsEnabled = function updateDroppableIsEnabled(id, isEnabled) {
    if (!state.droppables[id]) {
      cancel('Cannot update the scroll on Droppable ' + id + ' as it is not registered');
      return;
    }

    if (!state.isCollecting) {
      return;
    }
    callbacks.updateDroppableIsEnabled(id, isEnabled);
  };

  var updateDroppableScroll = function updateDroppableScroll(id, newScroll) {
    if (!state.droppables[id]) {
      cancel('Cannot update the scroll on Droppable ' + id + ' as it is not registered');
      return;
    }

    if (!state.isCollecting) {
      return;
    }
    callbacks.updateDroppableScroll(id, newScroll);
  };

  var scrollDroppable = function scrollDroppable(id, change) {
    var entry = state.droppables[id];
    if (!entry) {
      return;
    }

    if (!state.isCollecting) {
      return;
    }

    entry.callbacks.scroll(change);
  };

  var unregisterDraggable = function unregisterDraggable(descriptor) {
    var entry = state.draggables[descriptor.id];

    if (!entry) {
      cancel('Cannot unregister Draggable with id ' + descriptor.id + ' as it is not registered');
      return;
    }

    if (entry.descriptor !== descriptor) {
      return;
    }

    var newMap = (0, _extends5.default)({}, state.draggables);
    delete newMap[descriptor.id];

    setState({
      draggables: newMap
    });

    if (!state.isCollecting) {
      return;
    }

    console.warn('currently not supporting unmounting a Draggable during a drag');
  };

  var unregisterDroppable = function unregisterDroppable(descriptor) {
    var entry = state.droppables[descriptor.id];

    if (!entry) {
      cancel('Cannot unregister Droppable with id ' + descriptor.id + ' as as it is not registered');
      return;
    }

    if (entry.descriptor !== descriptor) {
      return;
    }

    var newMap = (0, _extends5.default)({}, state.droppables);
    delete newMap[descriptor.id];

    setState({
      droppables: newMap
    });

    if (!state.isCollecting) {
      return;
    }

    console.warn('currently not supporting unmounting a Droppable during a drag');
  };

  var getToBeCollected = function getToBeCollected() {
    var draggables = state.draggables;
    var droppables = state.droppables;
    var request = state.request;

    if (!request) {
      console.error('cannot find request in state');
      return [];
    }
    var draggableId = request.draggableId;
    var descriptor = draggables[draggableId].descriptor;
    var home = droppables[descriptor.droppableId].descriptor;

    var draggablesToBeCollected = (0, _keys2.default)(draggables).map(function (id) {
      return draggables[id].descriptor;
    }).filter(function (item) {
      return item.id !== descriptor.id;
    }).filter(function (item) {
      var entry = droppables[item.droppableId];

      if (!entry) {
        console.warn('Orphan Draggable found ' + item.id + ' which says it belongs to unknown Droppable ' + item.droppableId);
        return false;
      }

      return entry.descriptor.type === home.type;
    });

    var droppablesToBeCollected = (0, _keys2.default)(droppables).map(function (id) {
      return droppables[id].descriptor;
    }).filter(function (item) {
      return item.id !== home.id;
    }).filter(function (item) {
      var droppable = droppables[item.id].descriptor;
      return droppable.type === home.type;
    });

    var toBeCollected = [].concat((0, _toConsumableArray3.default)(droppablesToBeCollected), (0, _toConsumableArray3.default)(draggablesToBeCollected));

    return toBeCollected;
  };

  var processPrimaryDimensions = function processPrimaryDimensions(request) {
    if (state.isCollecting) {
      cancel('Cannot start capturing dimensions for a drag it is already dragging');
      return;
    }

    if (!request) {
      cancel('Cannot start capturing dimensions with an invalid request', request);
      return;
    }

    var draggableId = request.draggableId;

    setState({
      isCollecting: true,
      request: request
    });

    var draggables = state.draggables;
    var droppables = state.droppables;
    var draggableEntry = draggables[draggableId];

    if (!draggableEntry) {
      cancel('Cannot find Draggable with id ' + draggableId + ' to start collecting dimensions');
      return;
    }

    var homeEntry = droppables[draggableEntry.descriptor.droppableId];

    if (!homeEntry) {
      cancel('\n        Cannot find home Droppable [id:' + draggableEntry.descriptor.droppableId + ']\n        for Draggable [id:' + request.draggableId + ']\n      ');
      return;
    }

    var home = homeEntry.callbacks.getDimension();
    var draggable = draggableEntry.getDimension();

    callbacks.publishDroppable(home);
    callbacks.publishDraggable(draggable);

    homeEntry.callbacks.watchScroll(request.scrollOptions);
  };

  var setFrameId = function setFrameId(frameId) {
    setState({
      frameId: frameId
    });
  };

  var processSecondaryDimensions = function processSecondaryDimensions(requestInAppState) {
    if (!state.isCollecting) {
      cancel('Cannot collect secondary dimensions when collection is not occurring');
      return;
    }

    var request = state.request;

    if (!request) {
      cancel('Cannot process secondary dimensions without a request');
      return;
    }

    if (!requestInAppState) {
      cancel('Cannot process secondary dimensions without a request on the state');
      return;
    }

    if (requestInAppState.draggableId !== request.draggableId) {
      cancel('Cannot process secondary dimensions as local request does not match app state');
      return;
    }

    var toBeCollected = getToBeCollected();

    var collectFrameId = requestAnimationFrame(function () {
      var toBePublishedBuffer = toBeCollected.map(function (descriptor) {
        if (descriptor.type) {
          return state.droppables[descriptor.id].callbacks.getDimension();
        }

        return state.draggables[descriptor.id].getDimension();
      });

      var publishFrameId = requestAnimationFrame(function () {
        var toBePublished = toBePublishedBuffer.reduce(function (previous, dimension) {
          if (dimension.placeholder) {
            previous.draggables.push(dimension);
          } else {
            previous.droppables.push(dimension);
          }
          return previous;
        }, { draggables: [], droppables: [] });

        callbacks.bulkPublish(toBePublished.droppables, toBePublished.draggables);

        toBePublished.droppables.forEach(function (dimension) {
          var entry = state.droppables[dimension.descriptor.id];
          entry.callbacks.watchScroll(request.scrollOptions);
        });

        setFrameId(null);
      });

      setFrameId(publishFrameId);
    });

    setFrameId(collectFrameId);
  };

  var stopCollecting = function stopCollecting() {
    (0, _keys2.default)(state.droppables).forEach(function (id) {
      return state.droppables[id].callbacks.unwatchScroll();
    });

    if (state.frameId) {
      cancelAnimationFrame(state.frameId);
    }

    setState({
      isCollecting: false,
      request: null,
      frameId: null
    });
  };

  var onPhaseChange = function onPhaseChange(current) {
    var phase = current.phase;

    if (phase === 'COLLECTING_INITIAL_DIMENSIONS') {
      processPrimaryDimensions(current.dimension.request);
      return;
    }

    if (phase === 'DRAGGING') {
      processSecondaryDimensions(current.dimension.request);
      return;
    }

    if (phase === 'DROP_ANIMATING' || phase === 'DROP_COMPLETE') {
      if (state.isCollecting) {
        stopCollecting();
      }
      return;
    }

    if (phase === 'IDLE') {
      if (state.isCollecting) {
        stopCollecting();
      }
    }
  };

  var marshal = {
    registerDraggable: registerDraggable,
    unregisterDraggable: unregisterDraggable,
    registerDroppable: registerDroppable,
    unregisterDroppable: unregisterDroppable,
    updateDroppableIsEnabled: updateDroppableIsEnabled,
    scrollDroppable: scrollDroppable,
    updateDroppableScroll: updateDroppableScroll,
    onPhaseChange: onPhaseChange
  };

  return marshal;
};