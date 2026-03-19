import { OutboxRepository } from "../repositories/outbox.repository";
import { publisher } from "../redis/redis";

const CHANNEL = "user:sync";
const POLL_INTERVAL_MS = 5000; // every 5 seconds

export function startOutboxRelayWorker(): void {
    console.log("[OutboxRelay] Worker started, polling every", POLL_INTERVAL_MS, "ms");

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
                    
                    await publisher.publish(CHANNEL, JSON.stringify(envelope));
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

        setTimeout(poll, POLL_INTERVAL_MS);
    };

    // Start on next tick so the server is fully initialized
    setTimeout(poll, 0);
}
