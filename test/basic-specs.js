/*****************************************************
 * Basic tests
 *****************************************************/

let chai = require('chai')
let chaiAsPromised = require('chai-as-promised')
let should = chai.should()
let fs = require('fs')
let entities = require('../Entities')
let em = require('../EnvironmentManager')
let extensions = require('../Extensions')
let filters = require('../Filters')
let main = require('../main')

// Chai will use promises for async events
chai.use(chaiAsPromised)

before(function (done) {
  done()
})

after(function (done) {
  // here you can clear fixtures, etc.
  done()
})

describe('Basic tests, ', function () {
  it('makes sure dependencies are loaded correctly (code does nothing)', function (done) {
    // Prepare
    done()
  })
})
