import type { User } from "../../domain/entities/user";
import { NotFoundError } from "../../interface/http/middlewares/error.middleware";
import type { UnitOfWork } from "../ports/unit-of-work";

class UpgradeUserRoleUseCase {
    constructor(private uow: UnitOfWork) {}

    async execute(id: string, role: "admin" | "doctor" | "invited"): Promise<Omit<User, "passwordHash">> {
        return await this.uow.execute(async ({ userRepo, events }) => {
            const user = await userRepo.findById(id);
            if (!user) throw new NotFoundError("User not found");

            const updatedUser = await userRepo.updateRole(id, role);
            const { passwordHash: _, ...safeUser } = updatedUser;

            // Emit domain event for UoW to persist to outbox automatically
            events.publish("user", safeUser.id, "user.role_upgraded", {
                id: safeUser.id,
                email: safeUser.email,
                name: safeUser.name,
                role: safeUser.role,
                createdAt: safeUser.createdAt.toISOString(),
            });

            return safeUser;
        });
    }
}

export { UpgradeUserRoleUseCase };
