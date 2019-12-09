'use strict'

// Filter classes used to filter incoming signals
// Collaborator: Environment, MotionDetector
// Base filter
// This should be inherited but you can in practice still use it,
// But by defult it does nothing (pass-all), override the method
// "filter" to change behaviour

let utils = require('./utils.js')
let log = utils.log
/**
 * @class: Filters.BaseFilter
 * @classDesc: Creates a base filter to be applicable to a Motion Detector and attaches a value to it
 * @public
 */
class BaseFilter {
  constructor (val, applyTo) {
    // Despite populating this, will do nothing with it
    this.valueToFilter = val
    if (applyTo) {
      this.applyToName = applyTo
    }
  }

  // Simply returns the state which is given (no changes)
  filter (newState, env, detector) {
    // will pass all;
    return newState
  }

  bindToDetectors (motionDetectors) {
    switch (typeof this.applyToName) {
      case 'undefined':
        log.info('>>>>> applying to all motion detectors:')
        // applies to all motion detectors
        for (let i in motionDetectors) {
          // applies to all Motion detectors
          motionDetectors[i].applyFilter(this)
        }
        break
      case 'string':
        // applies all motion detectors matching name
        log.info(`>>>>> applying to motion detectors with name: ${this.applyToName}`)
        this._applyToDetectorNames(motionDetectors, [ this.applyToName ])
        break
      case 'object':
        // Assumes it is a motion detector, or at least an object which implements the applyFilter method
        log.info('>>>>> applying to motion detector:')
        // could be an array
        if (Array.isArray(this.applyToName)) {
          this._applyToDetectorNames(motionDetectors, this.applyToName)
        } else {
          this.applyToName.applyFilter(this)
        }
        break
      default:
        break
    }
  }
  // Internal. Requires dName to be a string
  _applyToDetectorNames (motionDetectors, dName) {
    for (let i in motionDetectors) {
      log.debug(`Filter to be applied to items of name: "${dName}". Searching current motion detectors...`)
      if (dName.indexOf(motionDetectors[i].name) >= 0) {
        log.debug('Found. Applying filter.')
        motionDetectors[i].applyFilter(this)
      }
    }
  }
}

// Block All filter
// Pretty self explanatory :)
// Note: If you create your own filters make sure you are calling the parent filter class
class BlockAllFilter extends BaseFilter {
  constructor (val, applyTo) {
    super(val, applyTo)
  }

  // Simply returns nothing (opposite of it's base class)
  filter (newState, env, detector) {
    return false
  }
}

class NameFilter extends BaseFilter {
  constructor (val, applyTo) {
    super(val, applyTo)
  }

  filter (newState, env, detector) {
    return detector.name == this.valueToFilter ? false : newState
  }
}

class ValueFilter extends BaseFilter {
  constructor (val, applyTo) {
    super(val, applyTo)
  }

  filter (newState, env, detector) {
    return newState == this.valueToFilter ? false : newState
  }
}

class HighPassFilter extends BaseFilter {
  constructor (val, applyTo) {
    super(val, applyTo)
  }

  filter (newState, env, detector) {
    return newState < this.valueToFilter ? false : newState
  }
}

class LowPassFilter extends BaseFilter {
  constructor (val, applyTo) {
    super(val, applyTo)
  }

  filter (newState, env, detector) {
    return newState > this.valueToFilter ? false : newState
  }
}

class SystemEnvironmentFilter extends BaseFilter {
  constructor (freeMemBelow, applyTo, stdoutMatchesRegex) {
    super(freeMemBelow, applyTo)
    this.stdoutMatchesRegex = stdoutMatchesRegex
  }

  filter (newState, source, detector) {
    let source_c = source ? source.constructor.name : undefined
    log.info(`Filter ${this.constructor.name} is filtering values from detector: ${detector.name}: ${newState}, sent by ${source_c}`)
    // Tests first if the signal is comming from a System Environment
    if (source_c == 'SystemEnvironment') {
      if (newState.freemem && newState.stdout) {
        // Then Tests first if it is below memory
        if ((newState.freemem < this.valueToFilter) ||
          (this.stdoutMatchesRegex && newState.stdout.data.match(this.stdoutMatchesRegex))) {
          return newState
        }
      }
    } else {
      log.info(`Signal does not come from a SystemEnvironment (${source_c} instead), ignoring filter.`)
      return newState
    }

    return false
  }
}

//Filters Objects which val.key matches val.val
//val.key is an array of key and sub-keys, e.g. object.key1.key2 is expressed as val.key = ['key1','key2']
class ObjectKeyValueFilter extends BaseFilter {
  constructor (val, applyTo) {
    super(val, applyTo)
  }

  filter (newState, env, detector) {
    let val = newState
    for(let k in this.valueToFilter.key) {
      val = val[this.valueToFilter.key[k]]
      if(val === undefined) return newState
    }
    return val == this.valueToFilter.val ? false : newState
  }
}

//Gets from the Dictionary the specific object matching the key
//this.valueToFilter
class ObjectKeyFilter extends BaseFilter {
  constructor (val, applyTo) {
    super(val, applyTo)
  }

  filter (newState, env, detector) {
    let val = newState.stdout.data[this.valueToFilter]
    return val ? false : val
  }
}

exports.classes = {
  BaseFilter, BlockAllFilter, ValueFilter, NameFilter, LowPassFilter, HighPassFilter, ObjectKeyFilter, ObjectKeyValueFilter, SystemEnvironmentFilter
}

exports.BaseFilter = BaseFilter
exports.BlockAllFilter = BlockAllFilter
exports.HighPassFilter = HighPassFilter
exports.LowPassFilter = LowPassFilter
exports.NameFilter = NameFilter
exports.ValueFilter = ValueFilter
exports.ObjectKeyFilter = ObjectKeyFilter
exports.ObjectKeyValueFilter = ObjectKeyValueFilter
exports.SystemEnvironmentFilter = SystemEnvironmentFilter
