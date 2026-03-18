import type { UserRepository } from "../../domain/repositories/user.repository";
import type { User } from "../../domain/entities/user";
import { NotFoundError } from "../../interface/http/middlewares/error.middleware";
import { publishUserEvent } from "../../infrastructure/redis/redis";

class UpgradeUserRoleUseCase {
    constructor(private userRepo: UserRepository) {}

    async execute(id: string, role: "admin" | "doctor" | "invited"): Promise<Omit<User, "passwordHash">> {
        const user = await this.userRepo.findById(id);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        const updatedUser = await this.userRepo.updateRole(id, role);
        const { passwordHash: _, ...safeUser } = updatedUser;

        // Publish updated user data to Redis for other services to replicate
        await publishUserEvent({
            id: safeUser.id,
            email: safeUser.email,
            name: safeUser.name,
            role: safeUser.role,
            createdAt: safeUser.createdAt.toISOString(),
        });

        return safeUser;
    }
}

export { UpgradeUserRoleUseCase };
