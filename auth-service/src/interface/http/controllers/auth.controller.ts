import type { RegisterUseCase } from "../../../application/use-cases/register.use-case";
import type { LoginUseCase } from "../../../application/use-cases/login.use-case";
import type { GetProfileUseCase } from "../../../application/use-cases/get-profile.use-case";
import type { UpgradeUserRoleUseCase } from "../../../application/use-cases/upgrade-user-role.use-case";
import { UnauthorizedError } from "../middlewares/error.middleware";

export class AuthController {
    constructor(
        private registerUseCase: RegisterUseCase,
        private loginUseCase: LoginUseCase,
        private getProfileUseCase: GetProfileUseCase,
        private upgradeUserRoleUseCase: UpgradeUserRoleUseCase
    ) { }

    async register({ body, jwt, set }: any) {
        const user = await this.registerUseCase.execute(body);
        const token = await jwt.sign({ sub: user.id, email: user.email, role: user.role });
        set.status = 201;
        return { message: "User registered", user, token };
    }

    async login({ body, jwt, set }: any) {
        const user = await this.loginUseCase.execute(body);
        const token = await jwt.sign({ sub: user.id, email: user.email, role: user.role });
        return { message: "Login successful", user, token };
    }

    async getProfile({ jwt, bearer, set }: any) {
        const profile = await jwt.verify(bearer);
        if (!profile) {
            throw new UnauthorizedError("Invalid token");
        }
        const user = await this.getProfileUseCase.execute(profile.sub as string);
        return { user };
    }

    async logout({ set }: any) {
        set.status = 200;
        return { message: "Logged out successfully" };
    }

    async refresh({ jwt, bearer, set }: any) {
        if (!bearer) {
            throw new UnauthorizedError("No token provided");
        }
        
        const profile = await jwt.verify(bearer);
        if (!profile) {
            throw new UnauthorizedError("Invalid or expired token");
        }

        const token = await jwt.sign({ sub: profile.sub, email: profile.email, role: profile.role });
        return { message: "Token refreshed successfully", token };
    }

    async upgradeRole({ jwt, bearer, body, set }: any) {
        if (!bearer) throw new UnauthorizedError("No token provided");
        const profile = await jwt.verify(bearer);
        if (!profile || profile.role !== "admin") {
            throw new UnauthorizedError("Forbidden: Admin privileges required");
        }
        
        const updatedUser = await this.upgradeUserRoleUseCase.execute(body.userId, body.role);
        set.status = 200;
        return { message: "User role upgraded successfully", user: updatedUser };
    }
}
