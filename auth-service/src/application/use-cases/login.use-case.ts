
import type { UserRepository } from "../../domain/repositories/user.repository";
import type { User } from "../../domain/entities/user";
import { UnauthorizedError } from "../../interface/http/middlewares/error.middleware";

export class LoginUseCase {
    constructor(private userRepo: UserRepository) { }

    async execute(dto: any): Promise<Omit<User, "passwordHash">> {
        const user = await this.userRepo.findByEmail(dto.email);
        if (!user) {
            throw new UnauthorizedError("Invalid email or password");
        }

        const isPasswordValid = await Bun.password.verify(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new UnauthorizedError("Invalid email or password");
        }

        const { passwordHash: _, ...safeUser } = user;
        return safeUser;
    }
}
