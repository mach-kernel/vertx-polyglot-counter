import { Vertx } from 'vertx-web-js'

var server = vertx.createHttpServer()
var router = vertx.router()

router.get('/').handler((context) => context.response().end("HELLO WORLD"))

server.requestHandler(router.accept()).listen(8080)