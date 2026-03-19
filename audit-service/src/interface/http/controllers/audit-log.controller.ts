import { GetAuditLogsUseCase } from "../../../application/use-cases/get-audit-logs.use-case";

export class AuditLogController {
    constructor(private readonly getAuditLogsUseCase: GetAuditLogsUseCase) {}

    async getLogs() {
        try {
            const logs = await this.getAuditLogsUseCase.execute(50);
            return { success: true, data: logs };
        } catch (err) {
            console.error(err);
            return { success: false, error: "Failed to fetch audit logs" };
        }
    }
}
