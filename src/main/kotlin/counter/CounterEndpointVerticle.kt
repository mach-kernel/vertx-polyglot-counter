package counter

import io.vertx.core.AbstractVerticle
import io.vertx.core.DeploymentOptions
import io.vertx.core.Future
import io.vertx.core.eventbus.Message
import io.vertx.core.json.Json
import io.vertx.core.json.JsonObject
import io.vertx.ext.bridge.PermittedOptions
import io.vertx.ext.web.Router
import io.vertx.ext.web.handler.CorsHandler
import io.vertx.ext.web.handler.StaticHandler
import io.vertx.ext.web.handler.sockjs.BridgeOptions
import io.vertx.ext.web.handler.sockjs.SockJSHandler
import io.vertx.ext.web.templ.HandlebarsTemplateEngine
import io.vertx.ext.web.templ.MessageBackedRenderEngine
import io.vertx.ext.web.templ.StackableTemplateEngine
import io.vertx.ext.web.templ.impl.MessageBackedRenderEngineImpl
import io.vertx.ext.web.templ.impl.StackableTemplateEngineImpl


class CounterEndpointVerticle: AbstractVerticle() {
    private val eb by lazy { vertx.eventBus() }

    private val templateEngine by lazy { HandlebarsTemplateEngine.create() }
    private val staticHandler by lazy { StaticHandler.create() }

    private val stackableTemplateEngine by lazy { StackableTemplateEngine.create() }
    private val mbre by lazy { MessageBackedRenderEngine.create(vertx) }

    private val sockJSHandler by lazy { SockJSHandler.create(vertx) }
    private val options = BridgeOptions()

    override fun start() {
        stackableTemplateEngine.addEngine(mbre)
                               .addEngine(templateEngine);

        startHttp()
        startServices()
    }

    private fun startHttp() {
        val router = Router.router(vertx)
        val http = vertx.createHttpServer()

        arrayOf("ssr", "count-ask", "count-increment").forEach {
            options.addInboundPermitted(PermittedOptions().setAddress(it))
            options.addOutboundPermitted(PermittedOptions().setAddress(it))
        }

        sockJSHandler.bridge(options)
        router.route("/eventbus/*").handler(sockJSHandler)

        router.route().handler(CorsHandler.create("*"))
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

        // This can also be tuned if you're on a large multi-core machine!
        val deployOpts = DeploymentOptions(JsonObject(mapOf("instances" to 2)))
        deployOpts.setWorker(true)

        vertx.deployVerticle("build/js/template_verticle.js", deployOpts, { println("JS verticle up!") })
    }
}