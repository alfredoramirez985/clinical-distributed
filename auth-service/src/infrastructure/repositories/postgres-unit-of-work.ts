import { db } from "../database/database";
import { PostgresUserRepository } from "./postgres-user.repository";
import { OutboxRepository, type OutboxEvent } from "./outbox.repository";
import type { UnitOfWork, Repositories } from "../../application/ports/unit-of-work";

export class PostgresUnitOfWork implements UnitOfWork {
    constructor(private database: typeof db = db) {}

    async execute<T>(work: (repos: Repositories) => Promise<T>): Promise<T> {
        return await this.database.transaction(async (tx) => {
            const userRepo = new PostgresUserRepository(tx);
            const outboxRepo = new OutboxRepository(tx);
            
            const pendingEvents: OutboxEvent[] = [];
            
            const events = {
                publish: (aggregateType: string, aggregateId: string, eventType: string, payload: Record<string, unknown>) => {
                    pendingEvents.push({
                        id: crypto.randomUUID(),
                        aggregateType,
                        aggregateId,
                        eventType,
                        payload
                    });
                }
            };

            const result = await work({ userRepo, outboxRepo, events });

            for (const event of pendingEvents) {
                await outboxRepo.save(event);
            }

            return result;
        });
    }
}
