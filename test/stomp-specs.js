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
  	let sub = new extensions.StompDetector({ host: '127.0.0.1', port: 61613, user: 'admin', pass: 'admin'}, '/queue/queue1', true)
  	sub.startMonitoring()
  	sub.on('hasDetected', (intensity, newState, source) => {
  	  console.log(`Received message: `, newState)
  	  newState.body.should.eql('Hello World!')
  	  done()
  	})
  	setTimeout(() => {
    	  sub.getClient().publish('/queue/queue1', "Hello World!")
  	}, 1000)
  })
  it('Danger: Can cause an infinite loop if a StompDetector and a StompNotifier are within the same environment', function (done) {
    // Prepare
    this.timeout(10000)
    let sub = new extensions.StompDetector({ host: '127.0.0.1', port: 61613, user: 'admin', pass: 'admin'}, '/queue/queue123', true)
    sub.startMonitoring()
    let count = 0
    sub.on('hasDetected', (intensity, newState, source) => {
      let message = newState.body
      console.log(`Received message: `, message)
      //Message will also continuously nest!! :(
      let iterate = count
      while (iterate > 0) {
        console.log(`Will go one nested level: ${iterate}`)
        iterate--
        message = message.newState.body
      }
      message.should.eql("Hello World!")
      if (count >= 3) {
        sub.removeAllListeners('hasDetected')
        console.log("Ok, enough of this infinite loop, I'm stoping it, unbinded detector :)")
        done()
        return       
      } //Will let the loop go on until 10 times
      else {
        console.log(`infinite loop on the making! ${count} time(s)`)
        count++
      }
    })
    let pub = new extensions.StompNotifier({ host: '127.0.0.1', port: 61613, user: 'admin', pass: 'admin'}, '/queue/queue123')
    setTimeout(() => {
        pub.notify("Hello World!")
    }, 1000)
    pub.bindToDetector(sub) //This will cause an infinite loop
  })
  it('should avoid propagating to Notifiers by default to avoid infinite loop', function (done) {
    // Prepare
    this.timeout(2000)
    let sub = new extensions.StompDetector({ host: '127.0.0.1', port: 61613, user: 'admin', pass: 'admin'}, '/queue/q345')
    sub.startMonitoring()
    let count = 0
    sub.on('hasDetected', (intensity, newState, source) => {
      should.fail('Should not reach here!');
    })
    sub.on('hasSkipped', (intensity, newState, source) => {
      let message = newState.body
      console.log(`Received message: `, message)
      message.should.eql("Hello World!")
      done()
    })
    let pub = new extensions.StompNotifier({ host: '127.0.0.1', port: 61613, user: 'admin', pass: 'admin'}, '/queue/q345')
    setTimeout(() => {
        pub.notify("Hello World!")
    }, 1000)
    pub.bindToDetector(sub) //This will NOT cause an infinite loop
  })
  it('if needed to still propagate, a Filter (ObjectKeyValueFilter) should exist which limits to which queues messages can be propagated to', function (done) {
    // Prepare
    this.timeout(4000)
    let sub = new extensions.StompDetector({ host: '127.0.0.1', port: 61613, user: 'admin', pass: 'admin'}, '/queue/q123', true)
    sub.applyFilter(new filters.ObjectKeyValueFilter({
      key: [ 'headers', 'destination' ],
      val: '/queue/q123'
    }))
    sub.startMonitoring()
    let count = 0
    sub.on('hasDetected', (intensity, newState, source) => {
      let message = newState.body
      should.fail('Should not get here because of the filter')
    })
    let pub = new extensions.StompNotifier({ host: '127.0.0.1', port: 61613, user: 'admin', pass: 'admin'}, '/queue/q123')
    setTimeout(() => {
      pub.notify("Hello World!")
    }, 1000)
    pub.bindToDetector(sub) //This will cause an infinite loop
    setTimeout(() => {
      done()
    }, 3500)
  })
})

describe('Stomp Notifier (Stomp client publisher) tests, ', function () {
  it('should inherit the BaseNotifier class', function (done) {
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
  	let sub = new extensions.StompDetector({ host: '127.0.0.1', port: 61613, user: 'admin', pass: 'admin'}, '/queue/queue123456')
  	sub.startMonitoring()
  	sub.on('hasSkipped', (intensity, newState, source) => {
  	  console.log(`Received message: `, newState.body)
  	  newState.body.should.eql("Hello World!")
  	  done()
  	})
  	let pub = new extensions.StompNotifier({ host: '127.0.0.1', port: 61613, user: 'admin', pass: 'admin'}, '/queue/queue123456')
  	setTimeout(() => {
    	  pub.notify("Hello World!")
  	}, 1000)
  })
})
