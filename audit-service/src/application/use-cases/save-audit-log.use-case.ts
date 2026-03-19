import { AuditLogRepository } from "../../domain/repositories/audit-log.repository";
import { AuditLog } from "../../domain/entities/audit-log";
import crypto from 'crypto';

export class SaveAuditLogUseCase {
    constructor(private readonly auditLogRepository: AuditLogRepository) {}

    async execute(data: Omit<AuditLog, "id"> & { id?: string }): Promise<void> {
        const logToSave: AuditLog = {
            id: data.id || crypto.randomUUID(),
            eventType: data.eventType,
            payload: data.payload,
            source: data.source,
            timestamp: data.timestamp || new Date()
        };
        await this.auditLogRepository.save(logToSave);
    }
}
