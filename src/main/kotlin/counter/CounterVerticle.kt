package counter

import io.vertx.core.AbstractVerticle
import java.util.concurrent.atomic.AtomicInteger

class CounterVerticle: AbstractVerticle() {
    private val count = AtomicInteger(0)

    private val eb by lazy { vertx.eventBus() }

    override fun start() {
        super.start()

        eb.consumer<Any>("count-ask") { message ->
            message.reply(count.get())
        }

        eb.consumer<Any>("count-increment") { message ->
            message.reply(count.incrementAndGet().toString())
        }
    }
}