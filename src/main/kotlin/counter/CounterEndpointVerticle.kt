package counter

import io.vertx.core.AbstractVerticle
import io.vertx.core.DeploymentOptions
import io.vertx.core.Future
import io.vertx.core.eventbus.Message
import io.vertx.core.json.Json
import io.vertx.core.json.JsonObject
import io.vertx.ext.web.Router
import io.vertx.ext.web.handler.StaticHandler
import io.vertx.ext.web.templ.HandlebarsTemplateEngine

class CounterEndpointVerticle: AbstractVerticle() {
    private val eb by lazy { vertx.eventBus() }

    private val templateEngine by lazy { HandlebarsTemplateEngine.create() }
    private val staticHandler by lazy { StaticHandler.create() }

    override fun start() {
        startHttp()
        startServices()
    }

    private fun startHttp() {
        val router = Router.router(vertx)
        val http = vertx.createHttpServer()

        router.get("/js/*").handler(staticHandler::handle)

        router.get("/").handler { req ->
            eb.send<Any>("count-ask", "") {service_response ->
                val count = service_response.result().body().toString()
                req.put("initial", JsonObject(mapOf("count" to count)).toString())

                eb.send<Any>("ssr", count) { ssrd ->
                    req.put("component", ssrd.result().body().toString())

                    templateEngine.render(req, "templates/index.hbs", {
                        req.response().end(it.result().toString())
                    })
                }
            }
        }

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
        })

        vertx.deployVerticle("build/js/template_verticle.js", DeploymentOptions(JsonObject(mapOf("instances" to 5))), {
            println("JS verticle up!")
        })
    }
}