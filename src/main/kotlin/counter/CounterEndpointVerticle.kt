package counter

import io.vertx.core.AbstractVerticle
import io.vertx.core.DeploymentOptions
import io.vertx.ext.bridge.PermittedOptions
import io.vertx.ext.web.Router
import io.vertx.ext.web.handler.CorsHandler
import io.vertx.ext.web.handler.StaticHandler
import io.vertx.ext.web.handler.TemplateHandler
import io.vertx.ext.web.handler.sockjs.BridgeOptions
import io.vertx.ext.web.handler.sockjs.SockJSHandler
import io.vertx.ext.web.templ.HandlebarsTemplateEngine
import io.vertx.ext.web.templ.MessageBackedRenderEngine
import io.vertx.ext.web.templ.MiddlewareStackTemplateEngine
import io.vertx.kotlin.core.json.json
import io.vertx.kotlin.core.json.obj

class CounterEndpointVerticle: AbstractVerticle() {
    private val eb by lazy { vertx.eventBus() }

    private val templateEngine by lazy {
        MiddlewareStackTemplateEngine.create()
                .addMiddleware(MessageBackedRenderEngine.create(vertx))
                .setOutputEngine(HandlebarsTemplateEngine.create())
    }

    private val templateHandler by lazy { TemplateHandler.create(templateEngine) }

    private val staticHandler by lazy { StaticHandler.create() }

    private val sockJSHandler by lazy { SockJSHandler.create(vertx) }
    private val options = BridgeOptions()

    override fun start() {
        arrayOf("ssr", "count-ask", "count-increment").forEach {
            options.addInboundPermitted(PermittedOptions().setAddress(it))
            options.addOutboundPermitted(PermittedOptions().setAddress(it))
        }

        sockJSHandler.bridge(options)

        startServices()

        startHttp()
    }

    private fun startHttp() {
        val router = Router.router(vertx)
        val http = vertx.createHttpServer()

        // EB + Static
        router.route("/eventbus/*").handler(sockJSHandler)
        router.route().handler(CorsHandler.create("*"))
        router.get("/static/*").handler(staticHandler::handle)

        // App
        router.get("/").handler { req ->
            eb.send<Any>("count-ask", "") {ask_res ->
                val counterComponent = json {
                    obj(
                            "name" to "Counter",
                            "token" to "my_counter",
                            "props" to obj("count" to ask_res.result().body().toString())
                    )
                }

                req.put("components", listOf(counterComponent))

                if (!req.response().ended()) req.next()
            }
        }

        // Template
        router.get("/").handler(templateHandler::handle)

        // Get current count
        router.get("/counter").handler { req ->
            eb.send<Any>("count-ask", "") {service_response ->
                req.response().end(service_response.result().body().toString())
            }
        }

        // Increment counter
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

        vertx.deployVerticle(
                "build/js/template_verticle.js",
                DeploymentOptions().setWorker(true).setInstances(2)
        )
    }
}