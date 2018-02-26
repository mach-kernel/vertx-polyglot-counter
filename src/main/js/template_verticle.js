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
import HandlebarsTemplateEngine from 'vertx-web-js/handlebars_template_engine'
import StaticHandler from 'vertx-web-js/static_handler'

var server = vertx.createHttpServer()
var eb = vertx.eventBus()
var router = Router.router(vertx)

var templateEngine = HandlebarsTemplateEngine.create()
var staticHandler = StaticHandler.create()

staticHandler.setDirectoryListing(true)

// When doing SSR, we can query our service verticles for data
// while we do the render. Ostensibly you can conditionally perform
// SSR depending on the server response!
router.get('/').handler((context) => {
  eb.send("count-ask", "hello from JS!", (countMessage, err) => {
    context.put('component', ReactDOM.renderToString(<Counter count={countMessage.body()}/>))

    templateEngine.render(
      context,
      'templates/index.hbs',
      (rendered, _err) => context.response().end(rendered)
    )

  })
})

router.get('/js/*').handler(staticHandler.handle)
server.requestHandler(router.accept).listen(8080)