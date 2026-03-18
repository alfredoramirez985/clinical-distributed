
import type { User } from "../../domain/entities/user";
import { ConflictError } from "../../interface/http/middlewares/error.middleware";
import type { UnitOfWork } from "../ports/unit-of-work";

class RegisterUseCase {
    constructor(private uow: UnitOfWork) {}

    async execute(dto: any): Promise<Omit<User, "passwordHash">> {
        return await this.uow.execute(async ({ userRepo, events }) => {
            const existing = await userRepo.findByEmail(dto.email);
            if (existing) throw new ConflictError("Email already registered");

            const passwordHash = await Bun.password.hash(dto.password, { algorithm: "bcrypt", cost: 12 });

            const user: User = {
                id: crypto.randomUUID(),
                email: dto.email,
                name: dto.name,
                passwordHash,
                role: "invited",
                createdAt: new Date(),
            };

            const saved = await userRepo.save(user);
            const { passwordHash: _, ...safeUser } = saved;

            // Emit domain event for UoW to persist to outbox automatically
            events.publish("user", safeUser.id, "user.registered", {
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

export { RegisterUseCase };
