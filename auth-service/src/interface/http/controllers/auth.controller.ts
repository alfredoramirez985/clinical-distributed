import type { RegisterUseCase } from "../../../application/use-cases/register.use-case";
import type { LoginUseCase } from "../../../application/use-cases/login.use-case";
import type { GetProfileUseCase } from "../../../application/use-cases/get-profile.use-case";
import { UnauthorizedError } from "../middlewares/error.middleware";

export class AuthController {
    constructor(
        private registerUseCase: RegisterUseCase,
        private loginUseCase: LoginUseCase,
        private getProfileUseCase: GetProfileUseCase
    ) { }

    async register({ body, jwt, set }: any) {
        const user = await this.registerUseCase.execute(body);
        const token = await jwt.sign({ sub: user.id, email: user.email });
        set.status = 201;
        return { message: "User registered", user, token };
    }

    async login({ body, jwt, set }: any) {
        const user = await this.loginUseCase.execute(body);
        const token = await jwt.sign({ sub: user.id, email: user.email });
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
}
