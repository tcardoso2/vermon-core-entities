#!/usr/bin/env node

'use strict'

exports = module.exports = (data) => { 
  console.log("Script test 2 received Data from queue!")
  console.log(data.newState.body)
  return { response_from_script: data.newState.body }  
} 