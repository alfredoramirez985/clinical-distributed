
import type { UserRepository } from "../../domain/repositories/user.repository";
import type { User } from "../../domain/entities/user";
import { ConflictError } from "../../interface/http/middlewares/error.middleware";

export class RegisterUseCase {
    constructor(private userRepo: UserRepository) { }
    async execute(dto: any): Promise<Omit<User, "passwordHash">> {
        const existing = await this.userRepo.findByEmail(dto.email);
        if (existing) throw new ConflictError("Email already registered");
        const passwordHash = await Bun.password.hash(dto.password, { algorithm: "bcrypt", cost: 12 });
        const user: User = { id: crypto.randomUUID(), email: dto.email, name: dto.name, passwordHash, createdAt: new Date() };
        const saved = await this.userRepo.save(user);
        const { passwordHash: _, ...safeUser } = saved;
        return safeUser;
    }
}
