import { Elysia } from "elysia";
import { AuditLogController } from "../controllers/audit-log.controller";

export const auditLogRoutes = (controller: AuditLogController) => {
    return new Elysia({ prefix: '/v1' })
        .get("/logs", () => controller.getLogs());
};
