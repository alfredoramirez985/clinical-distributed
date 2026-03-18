import { eq, and } from "drizzle-orm";
import { db, type DbClient } from "../database/database";
import { outboxEvents } from "../database/schema";

export interface OutboxEvent {
    id: string;
    aggregateType: string;
    aggregateId: string;
    eventType: string;
    payload: Record<string, unknown>;
}

export class OutboxRepository {
    constructor(private dbClient: DbClient = db) {}

    async save(event: OutboxEvent): Promise<void> {
        await this.dbClient.insert(outboxEvents).values({
            id: event.id,
            aggregateType: event.aggregateType,
            aggregateId: event.aggregateId,
            eventType: event.eventType,
            payload: event.payload,
        });
    }

    async findPending(limit = 50): Promise<typeof outboxEvents.$inferSelect[]> {
        return this.dbClient
            .select()
            .from(outboxEvents)
            .where(eq(outboxEvents.status, "pending"))
            .limit(limit);
    }

    async markProcessed(id: string): Promise<void> {
        await this.dbClient
            .update(outboxEvents)
            .set({ status: "processed", processedAt: new Date() })
            .where(eq(outboxEvents.id, id));
    }

    async markFailed(id: string): Promise<void> {
        await this.dbClient
            .update(outboxEvents)
            .set({ status: "failed" })
            .where(eq(outboxEvents.id, id));
    }
}
