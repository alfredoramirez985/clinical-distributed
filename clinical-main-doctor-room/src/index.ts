import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { errorMiddleware } from "./interface/http/middlewares/error.middleware";
import { PostgresUserRepository } from "./infrastructure/repositories/postgres-user.repository";
import { PostgresClinicRepository } from "./infrastructure/repositories/postgres-clinic.repository";
import { PostgresDoctorRoomRepository } from "./infrastructure/repositories/postgres-doctor-room.repository";
import { SyncUserUseCase } from "./application/use-cases/sync-user.use-case";
import { CreateClinicUseCase } from "./application/use-cases/create-clinic.use-case";
import { CreateDoctorRoomUseCase } from "./application/use-cases/create-doctor-room.use-case";
import { clinicRoutes } from "./interface/http/routes/clinic.routes";
import { startUserSyncWorker } from "./infrastructure/workers/user-sync.worker";

// Repositories
const userRepository = new PostgresUserRepository();
const clinicRepository = new PostgresClinicRepository();
const doctorRoomRepository = new PostgresDoctorRoomRepository();

// Use cases
const syncUserUseCase = new SyncUserUseCase(userRepository);
const createClinicUseCase = new CreateClinicUseCase(clinicRepository, doctorRoomRepository);
const createDoctorRoomUseCase = new CreateDoctorRoomUseCase(doctorRoomRepository, clinicRepository);

// Start the Redis subscriber worker
startUserSyncWorker(syncUserUseCase);

const app = new Elysia()
    .use(cors())
    .use(errorMiddleware)
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
    .group("/v1", (app) => app.use(clinicRoutes(createClinicUseCase, createDoctorRoomUseCase)))
    .listen(3001);

console.log(`Clinical Main Doctor Room service running at http://localhost:${app.server?.port}`);
