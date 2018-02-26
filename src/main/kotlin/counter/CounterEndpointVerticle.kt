package counter

import io.vertx.core.AbstractVerticle
import io.vertx.core.Future
import io.vertx.ext.web.Router

class CounterEndpointVerticle: AbstractVerticle() {

    private val eb by lazy { vertx.eventBus() }
    private val router by lazy { Router.router(vertx) }

    override fun start() {
        startServices()
    }

    private fun startHttp() {
        val http = vertx.createHttpServer()

        router.get("/counter").handler { req ->
            eb.send<Any>("count-ask", "") {service_response ->
                req.response().end(service_response.result().body().toString())
            }
        }

        router.post("/counter").handler { req ->
            eb.send<Any>("count-increment", "") {service_response ->
                req.response().end(service_response.result().body().toString())
            }
        }

        http.requestHandler(router::accept).listen(8080)
    }

    private fun startServices() {
        vertx.deployVerticle(CounterVerticle(), {

            println("Counter up!")

            vertx.deployVerticle("build/js/template_verticle.js", {
                println("JS verticle up!")
                startHttp()
            })
        })
    }
}