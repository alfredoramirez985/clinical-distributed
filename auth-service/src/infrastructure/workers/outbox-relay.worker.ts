import postgres from "postgres";
import { OutboxRepository } from "../repositories/outbox.repository";
import { publisher } from "../redis/redis";

const CHANNEL = "user:sync";
const FALLBACK_POLL_INTERVAL_MS = 60000; // 60 seconds fallback

export function startOutboxRelayWorker(): void {
    console.log("[OutboxRelay] Worker started, utilizing PostgreSQL LISTEN and falling back every", FALLBACK_POLL_INTERVAL_MS, "ms");

    const outboxRepo = new OutboxRepository();

    const poll = async () => {
        try {
            const pending = await outboxRepo.findPending(50);

            for (const event of pending) {
                try {
                    // Publish the FULL envelope, not just the payload
                    const envelope = {
                        eventId: event.id,
                        aggregateType: event.aggregateType,
                        aggregateId: event.aggregateId,
                        eventType: event.eventType,
                        payload: event.payload,
                        timestamp: new Date().toISOString()
                    };
                    
                    await publisher.xadd(CHANNEL, "*", "event", JSON.stringify(envelope));
                    await outboxRepo.markProcessed(event.id);
                    console.log(`[OutboxRelay] Published and marked processed: ${event.eventType} for aggregate ${event.aggregateId}`);
                } catch (err) {
                    await outboxRepo.markFailed(event.id);
                    console.error(`[OutboxRelay] Failed to publish event ${event.id}:`, err);
                }
            }
        } catch (err) {
            console.error("[OutboxRelay] Error polling outbox:", err);
        }

        setTimeout(poll, FALLBACK_POLL_INTERVAL_MS);
    };

    // Listen for real-time notifications from PostgreSQL
    const listener = postgres(process.env.DATABASE_URL!);
    listener.listen("new_outbox_event", (payload) => {
        console.log(`[OutboxRelay] Received pg_notify! Waking up immediately. Event ID: ${payload}`);
        poll();
    }).catch(err => {
        console.error("[OutboxRelay] Failed to start Postgres listener:", err);
    });

    // Start on next tick so the server is fully initialized
    setTimeout(poll, 0);
}
