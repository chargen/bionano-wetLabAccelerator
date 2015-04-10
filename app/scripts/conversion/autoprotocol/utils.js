var _                    = require('lodash'),
    converters           = require('./converters.js'),
    converterField       = converters.field,
    converterInstruction = converters.instruction,
    omniConv             = global.omniprotocol.conv;

//takes an autoprotocol instruction, wraps in pipette group
function wrapInPipette (instruction) {
  return {
    op    : "pipette",
    groups: [instruction]
  };
}

function convertInstruction (inst, localParams) {
  //todo - handle validation of each field too?

  var converter = converterInstruction[inst.operation];

  if (!_.isFunction(converter)) {
    console.error('converter doesn\'t exist for ' + inst.operation);
    return null;
  }

  return converter(inst, localParams);
}

// todo - would be great to abstract this out of requiring conversion inline
// need to handle way of defining dictionary per step, so that loop index doesn't need to be fed directly to function,
// but can be part of data object instead
function unwrapGroup (group) {
  var unwrapped = [];

  _.times(group.loop || 1, function (loopIndex) {
    _.forEach(group.steps, function (step, stepIndex) {
      //var stepIndex = (loopIndex * group.steps.length) + stepIndex;
      unwrapped.push(convertInstruction(step, {index: loopIndex}));
    });
  });
  return unwrapped;
}

function makeReference (ref) {
  var obj = {};
  var internal = {};

  if (!!ref.isNew || _.isUndefined(ref.id)) {
    _.assign(internal, {new: ref.type});
  } else {
    _.assign(internal, {id: ref.id});
  }

  if (!!ref.storage) {
    internal.store = {
      where: ref.storage
    };
  } else {
    internal.discard = true;
  }

  obj[ref.name] = internal;
  return obj;
}

module.exports = {
  wrapInPipette     : wrapInPipette,
  makeReference     : makeReference,
  convertInstruction: convertInstruction,
  unwrapGroup       : unwrapGroup
};