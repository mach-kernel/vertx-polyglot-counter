package counter

import io.vertx.core.AbstractVerticle
import io.vertx.core.Future
import io.vertx.ext.web.Router
import io.vertx.ext.web.handler.StaticHandler

class CounterEndpointVerticle: AbstractVerticle() {
    private val eb by lazy { vertx.eventBus() }

    override fun start() {
        startHttp()
        startServices()
    }

    private fun startHttp() {
        val router = Router.router(vertx)
        val http = vertx.createHttpServer()

        router.get("/counter").handler { req ->
            req.response().putHeader("Access-Control-Allow-Origin", "*")
            eb.send<Any>("count-ask", "") {service_response ->
                req.response().end(service_response.result().body().toString())
            }
        }

        router.post("/counter").handler { req ->
            req.response().putHeader("Access-Control-Allow-Origin", "*")
            eb.send<Any>("count-increment", "") {service_response ->
                req.response().end(service_response.result().body().toString())
            }
        }

        http.requestHandler(router::accept).listen(8081)
    }

    private fun startServices() {
        vertx.deployVerticle(CounterVerticle(), {
            println("Counter up!")
        })

        vertx.deployVerticle("build/js/template_verticle.js", {
            println("JS verticle up!")
        })
    }
}