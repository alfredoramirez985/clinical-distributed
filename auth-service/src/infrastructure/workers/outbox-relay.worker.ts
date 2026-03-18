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
                    const payload = event.payload as Record<string, unknown>;
                    await publisher.publish(CHANNEL, JSON.stringify(payload));
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
