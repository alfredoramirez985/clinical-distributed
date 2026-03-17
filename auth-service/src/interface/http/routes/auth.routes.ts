import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { bearer } from "@elysiajs/bearer";
import { AuthController } from "../controllers/auth.controller";
import type { RegisterUseCase } from "../../../application/use-cases/register.use-case";
import type { LoginUseCase } from "../../../application/use-cases/login.use-case";
import type { GetProfileUseCase } from "../../../application/use-cases/get-profile.use-case";
import type { UpgradeUserRoleUseCase } from "../../../application/use-cases/upgrade-user-role.use-case";

export function authRoutes(
    registerUseCase: RegisterUseCase,
    loginUseCase: LoginUseCase,
    getProfileUseCase: GetProfileUseCase,
    upgradeUserRoleUseCase: UpgradeUserRoleUseCase
) {
    const authController = new AuthController(registerUseCase, loginUseCase, getProfileUseCase, upgradeUserRoleUseCase);

    return new Elysia({ prefix: "/auth" })
        .use(jwt({ name: "jwt", secret: process.env.JWT_SECRET || "secret", exp: "1h" }))
        .use(bearer())
        .post("/register", authController.register.bind(authController), {
            body: t.Object({ email: t.String({ format: 'email' }), name: t.String(), password: t.String() })
        })
        .post("/login", authController.login.bind(authController), {
            body: t.Object({ email: t.String({ format: 'email' }), password: t.String() })
        })
        .get("/profile", authController.getProfile.bind(authController))
        .post("/logout", authController.logout.bind(authController))
        .post("/refresh", authController.refresh.bind(authController))
        .get("/profile", authController.getProfile.bind(authController))
        .post("/admin/upgrade-user", authController.upgradeRole.bind(authController), {
            body: t.Object({ userId: t.String(), role: t.Union([t.Literal('admin'), t.Literal('doctor'), t.Literal('invited')]) })
        });
}