import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { PostgresUserRepository } from "./infrastructure/repositories/postgres-user.repository";
import { SyncUserUseCase } from "./application/use-cases/sync-user.use-case";
import { startUserSyncWorker } from "./infrastructure/workers/user-sync.worker";

const userRepository = new PostgresUserRepository();
const syncUserUseCase = new SyncUserUseCase(userRepository);

// Start the Redis subscriber worker
startUserSyncWorker(syncUserUseCase);

const app = new Elysia()
    .use(cors())
    .use(swagger({
        documentation: {
            info: {
                title: "Clinical Main Doctor Room Service API",
                version: "1.0.0",
                description: "Doctor room service with replicated user data and clinical functionality",
            },
        },
    }))
    .get("/health", () => ({ status: "ok" }))
    .listen(3001);

console.log(`Clinical Main Doctor Room service running at http://localhost:${app.server?.port}`);
