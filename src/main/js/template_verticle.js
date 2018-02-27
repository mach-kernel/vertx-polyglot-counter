import 'babel-polyfill';

import { Counter } from './components/counter.jsx'
import ReactDOM from 'react-dom/server'
import React from 'react'

// vertx is implicitly scoped for you, but look at the
// webpack config to understand how to deal with other externals

var eb = vertx.eventBus()

eb.consumer("ssr", (message) => {
  let count = message.body()
  message.reply(ReactDOM.renderToString(<Counter count={count}/>))
})