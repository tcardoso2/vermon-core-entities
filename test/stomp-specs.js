/*****************************************************
 * Stomp tests
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
let stomp = require('stomp-client')
main.utils.setLevel('debug')

// Chai will use promises for async events
chai.use(chaiAsPromised)

before(function (done) {
  done()
})

after(function (done) {
  // here you can clear fixtures, etc.
  done()
})

//Tests depend on a ActiveMQ already installed locally with user/pass = admin/admin
describe('Stomp Detector (Stomp client subscriber) tests, ', function () {
  it('should inherit the MotionDetector class', function (done) {
    // Prepare
    (new extensions.StompDetector({}, 'queue1') instanceof entities.MotionDetector).should.equal(true)
    done()
  })
  it('should require connection arguments as mandatory argument', function (done) {
    // Prepare
    try{
	  new extensions.StompDetector()
    } catch (e) {
      e.message.should.equal("Connection details must be provided as first argument")
      done()
      return
    }
  })
  it('should subscribe for queue changes', function (done) {
  	this.timeout(4000)
	let sub = new extensions.StompDetector({ host: '127.0.0.1', port: 61613, user: 'admin', pass: 'admin'}, '/queue/queue1')
	sub.startMonitoring()
	sub.on('hasDetected', (intensity, newState, source) => {
	  console.log(`Received message: `, newState.body)
	  newState.body.should.eql('Hello World!')
	  done()
	})
	setTimeout(() => {
  	  sub.getClient().publish('/queue/queue1', "Hello World!")
	}, 1000)
  })
})

describe('Stomp Notifier (Stomp client publisher) tests, ', function () {
  it('should inherit the MotionDetector class', function (done) {
    // Prepare
    (new extensions.StompNotifier({}, 'queue1') instanceof entities.BaseNotifier).should.equal(true)
    done()
  })
  it('should require connection arguments as mandatory argument', function (done) {
    // Prepare
    try{
	  new extensions.StompNotifier()
    } catch (e) {
      e.message.should.equal("Connection details must be provided as first argument")
      done()
      return
    }
  })
  it('should publish to queue changes', function (done) {
  	this.timeout(4000)
	let sub = new extensions.StompDetector({ host: '127.0.0.1', port: 61613, user: 'admin', pass: 'admin'}, '/queue/queue2')
	sub.startMonitoring()
	sub.on('hasDetected', (intensity, newState, source) => {
	  console.log(`Received message: `, newState.body)
	  newState.body.should.eql('Hello World!')
	  done()
	})
	let pub = new extensions.StompNotifier({ host: '127.0.0.1', port: 61613, user: 'admin', pass: 'admin'}, '/queue/queue2')
	setTimeout(() => {
  	  pub.notify("Hello World!")
	}, 1000)
  })
})
