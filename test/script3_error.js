#!/usr/bin/env node

'use strict'

exports = module.exports = (data) => {
  //The below will fail with a runtime error
  let someVar = deliberateError.shouldBePropagated() 
  return { response_from_script: JSON.parse(data.newState.body) }  
} 