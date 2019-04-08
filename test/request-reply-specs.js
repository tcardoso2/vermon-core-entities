/*****************************************************
 * Request-Reply Notifier tests
 *****************************************************/

let chai = require('chai')
let chaiAsPromised = require('chai-as-promised')
let should = chai.should()
let fs = require('fs')
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

describe('Request-Reply Worker Notifier tests, ', function () {
  it('should inherit the StompNotifier class', function (done) {
    // Prepare
    (new extensions.RequestReplyWorker({}, 'queue1reply', 'test/script1') instanceof extensions.StompNotifier).should.equal(true)
    done()
  })
  it('should require a script', function (done) {
    try{
	    new extensions.RequestReplyWorker({}, 'queue1reply')
    } catch (e) {
      e.message.should.equal("Script must be provided as third argument")
      done()
      return
    }
  })
  it('The script should export a single function', function (done) {
    try{
      new extensions.RequestReplyWorker({}, 'queue1reply', 'test/script12')
    } catch (e) {
      e.message.should.equal(`Cannot find module '${__dirname}/script12'`)
      done()
      return
    }    
  })
  it('should pass in the detected change to the script', function (done) {
  	this.timeout(4000)
  	let worker = new extensions.RequestReplyWorker(
      { host: '127.0.0.1', port: 61613, user: 'admin', pass: 'admin'}, 
      '/queue/queue1reply',
      'test/script1')
    let sub = new extensions.StompDetector({ host: '127.0.0.1', port: 61613, user: 'admin', pass: 'admin'}, '/queue/queue1reply')
    sub.startMonitoring()
    sub.on('hasDetected', (intensity, newState, source) => {
      console.log(`Received message: `, newState.body)
      JSON.parse(newState.body).should.eql({newState:'Hello Request-Reply!!!'})
      done()
    })
    setTimeout(() => worker.notify(), 1000)
  })
  xit('when the script finishes should send result back to the reply-queue', function (done) {
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
  xit('If an exception happens during script runtime, will send the error back to the reply queue', function (done) {
  })  
})
