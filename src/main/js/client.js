/**
 * Here we just hydrate with the same state that we
 * were provided with on the server.
 */

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import { Counter } from './components/counter.jsx'

window.addEventListener(
  'load',
  () => {
    ReactDOM.hydrate(<Counter {...window.countstate} />, document.getElementById("app-root"))
  }
)
