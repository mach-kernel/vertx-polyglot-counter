/**
 * This is the clientside bundle, notice how in the template
 * verticle we do the exact same thing as we do here!
 */

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import { Counter } from './components/counter.jsx'

window.addEventListener(
  'load',
  () => {
    ReactDOM.hydrate(<Counter />, document.getElementById("app-root"))
  }
)
