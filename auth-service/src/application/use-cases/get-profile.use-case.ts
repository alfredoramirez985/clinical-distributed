
import type { UserRepository } from "../../domain/repositories/user.repository";
import type { User } from "../../domain/entities/user";
import { NotFoundError } from "../../interface/http/middlewares/error.middleware";

class GetProfileUseCase {
    constructor(private userRepo: UserRepository) { }

    async execute(userId: string): Promise<Omit<User, "passwordHash">> {
        const user = await this.userRepo.findById(userId);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        const { passwordHash: _, ...safeUser } = user;
        return safeUser;
    }
}

export { GetProfileUseCase };
