import { subscriberClient } from "../redis/redis";
import { SaveAuditLogUseCase } from "../../application/use-cases/save-audit-log.use-case";

const CHANNEL = 'user:sync';

export function startAuditLogSubscriber(saveAuditLogUseCase: SaveAuditLogUseCase) {
    subscriberClient.subscribe(CHANNEL, (err, count) => {
        if (err) {
            console.error('[AuditService] Failed to subscribe: %s', err.message);
        } else {
            console.log(`[AuditService] Subscribed successfully! This client is currently subscribed to ${count} channels.`);
        }
    });

    subscriberClient.on('message', async (channel, message) => {
        if (channel === CHANNEL) {
            try {
                const envelope = JSON.parse(message);
                console.log(`[AuditService] Received event ${envelope.eventId} of type ${envelope.eventType}`);

                await saveAuditLogUseCase.execute({
                    id: crypto.randomUUID(), // Or reuse envelope.eventId ideally if schema allowed string size
                    eventType: envelope.eventType || 'unknown',
                    payload: envelope.payload || {},
                    source: `auth-service:${envelope.aggregateType}:${envelope.aggregateId}`,
                    timestamp: envelope.timestamp ? new Date(envelope.timestamp) : new Date()
                });
                
                console.log(`[AuditService] Successfully recorded audit log for event ${envelope.eventId}`);
            } catch (err) {
                console.error('[AuditService] Failed to process message:', err);
            }
        }
    });
}
