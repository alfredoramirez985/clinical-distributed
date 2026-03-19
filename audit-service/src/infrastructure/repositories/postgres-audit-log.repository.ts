import { AuditLogRepository } from "../../domain/repositories/audit-log.repository";
import { AuditLog } from "../../domain/entities/audit-log";
import { db } from "../database/database";
import { auditLogs } from "../database/schema";
import { desc } from "drizzle-orm";

export class PostgresAuditLogRepository implements AuditLogRepository {
    async save(log: AuditLog): Promise<void> {
        await db.insert(auditLogs).values({
            id: log.id,
            eventType: log.eventType,
            payload: log.payload,
            source: log.source,
            timestamp: log.timestamp
        });
    }

    async getLatest(limit: number): Promise<AuditLog[]> {
        const results = await db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp)).limit(limit);
        return results.map(row => ({
            id: row.id,
            eventType: row.eventType,
            payload: row.payload,
            source: row.source,
            timestamp: row.timestamp
        }));
    }
}
