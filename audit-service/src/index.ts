import { Elysia } from "elysia";
import { PostgresAuditLogRepository } from "./infrastructure/repositories/postgres-audit-log.repository";
import { SaveAuditLogUseCase } from "./application/use-cases/save-audit-log.use-case";
import { GetAuditLogsUseCase } from "./application/use-cases/get-audit-logs.use-case";
import { startAuditLogSubscriber } from "./infrastructure/workers/audit-log.subscriber";
import { AuditLogController } from "./interface/http/controllers/audit-log.controller";
import { auditLogRoutes } from "./interface/http/routes/audit-log.routes";

// 1. Repositories
const auditLogRepository = new PostgresAuditLogRepository();

// 2. Use Cases
const saveAuditLogUseCase = new SaveAuditLogUseCase(auditLogRepository);
const getAuditLogsUseCase = new GetAuditLogsUseCase(auditLogRepository);

// 3. Workers
startAuditLogSubscriber(saveAuditLogUseCase);

// 4. Controllers
const auditLogController = new AuditLogController(getAuditLogsUseCase);

// 5. App
const app = new Elysia()
  .get("/", () => "Hello Elysia from Audit Service (Clean Architecture)")
  .get("/health", () => ({ status: "ok" }))
  .use(auditLogRoutes(auditLogController))
  .listen(3001);

console.log(`🦊 Audit Service running at ${app.server?.hostname}:${app.server?.port}`);
