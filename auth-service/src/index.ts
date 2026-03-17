import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { PostgresUserRepository } from "./infrastructure/repositories/postgres-user.repository";
import { RegisterUseCase } from "./application/use-cases/register.use-case";
import { LoginUseCase } from "./application/use-cases/login.use-case";
import { GetProfileUseCase } from "./application/use-cases/get-profile.use-case";
import { UpgradeUserRoleUseCase } from "./application/use-cases/upgrade-user-role.use-case";
import { authRoutes } from "./interface/http/routes/auth.routes";
import { errorMiddleware } from "./interface/http/middlewares/error.middleware";

const userRepository = new PostgresUserRepository();
const registerUseCase = new RegisterUseCase(userRepository);
const loginUseCase = new LoginUseCase(userRepository);
const getProfileUseCase = new GetProfileUseCase(userRepository);
const upgradeUserRoleUseCase = new UpgradeUserRoleUseCase(userRepository);

const app = new Elysia()
    .use(cors())
    .use(errorMiddleware)
    .use(swagger({
        documentation: {
            info: {
                title: "Auth Service API",
                version: "1.0.0",
                description: "Authentication service with user registration, login, and profile management",
            },
        },
    }))
    .get("/health", () => ({ status: "ok" }))
    .group("/v1", (app) => app.use(authRoutes(registerUseCase, loginUseCase, getProfileUseCase, upgradeUserRoleUseCase)))
    .listen(3000);

console.log(`Auth service running at http://localhost:${app.server?.port}`);