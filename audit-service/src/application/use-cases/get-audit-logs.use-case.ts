import { AuditLogRepository } from "../../domain/repositories/audit-log.repository";
import { AuditLog } from "../../domain/entities/audit-log";

export class GetAuditLogsUseCase {
    constructor(private readonly auditLogRepository: AuditLogRepository) {}

    async execute(limit: number = 50): Promise<AuditLog[]> {
        return this.auditLogRepository.getLatest(limit);
    }
}
