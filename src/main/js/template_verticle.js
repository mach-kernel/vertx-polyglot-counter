import 'babel-polyfill';

import { Counter } from './components/Counter.jsx'
import ReactDOM from 'react-dom/server'
import React from 'react'

// vert.x is implicitly scoped by the JVM runtime,
// however there exist separate JS interop packages
// that we need to link in. See webpack config on how to
// ignore this import and treat it as commonjs (where the Nashorn wrapper)
// will resolve it

import Router from 'vertx-web-js/router'

var server = vertx.createHttpServer()
var eb = vertx.eventBus()

var router = Router.router(vertx)

// When doing SSR, we can query our service verticles for data
// while we do the render. Ostensibly you can conditionally perform
// SSR depending on the server response!
router.get('/').handler((context) => {
  eb.send("count-ask", "", (res, err) => {
    console.log(res, err);

    // console.log(askResult)
    context.response().end(
        ReactDOM.renderToString(<Counter />)
    )
  })
})

server.requestHandler(router.accept).listen(8080)