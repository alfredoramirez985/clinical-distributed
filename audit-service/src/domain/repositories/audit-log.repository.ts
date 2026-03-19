import { AuditLog } from "../entities/audit-log";

export interface AuditLogRepository {
    save(log: AuditLog): Promise<void>;
    getLatest(limit: number): Promise<AuditLog[]>;
}
