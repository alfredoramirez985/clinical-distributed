import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { bearer } from "@elysiajs/bearer";
import { AuthController } from "../controllers/auth.controller";
import type { RegisterUseCase } from "../../../application/use-cases/register.use-case";
import type { LoginUseCase } from "../../../application/use-cases/login.use-case";
import type { GetProfileUseCase } from "../../../application/use-cases/get-profile.use-case";
import type { UpgradeUserRoleUseCase } from "../../../application/use-cases/upgrade-user-role.use-case";

// --- Env validation (runs once at module load / startup) ---
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error("JWT_SECRET environment variable is required");

const jwtExpiration = process.env.JWT_EXPIRATION;
if (!jwtExpiration) throw new Error("JWT_EXPIRATION environment variable is required");

// Non-null assertions are safe here: the guards above throw before reaching this point
const JWT_SECRET = jwtSecret!;
const JWT_EXPIRATION = jwtExpiration!;

export function authRoutes(
    registerUseCase: RegisterUseCase,
    loginUseCase: LoginUseCase,
    getProfileUseCase: GetProfileUseCase,
    upgradeUserRoleUseCase: UpgradeUserRoleUseCase
) {
    const controller = new AuthController(registerUseCase, loginUseCase, getProfileUseCase, upgradeUserRoleUseCase);

    return new Elysia({ prefix: "/auth" })
        .use(jwt({ name: "jwt", secret: JWT_SECRET, exp: JWT_EXPIRATION }))
        .use(bearer())

        // --- Public routes (no token required) ---
        .post("/register", controller.register.bind(controller), {
            body: t.Object({ email: t.String({ format: "email" }), name: t.String(), password: t.String() }),
        })
        .post("/login", controller.login.bind(controller), {
            body: t.Object({ email: t.String({ format: "email" }), password: t.String() }),
        })

        // --- Authenticated routes (valid token required) ---
        .get("/profile", controller.getProfile.bind(controller))
        .post("/logout", controller.logout.bind(controller))
        .post("/refresh", controller.refresh.bind(controller))

        // --- Admin routes (admin role required) ---
        .post("/admin/upgrade-user", controller.upgradeRole.bind(controller), {
            body: t.Object({
                userId: t.String(),
                role: t.Union([t.Literal("admin"), t.Literal("doctor"), t.Literal("invited")]),
            }),
        });
}