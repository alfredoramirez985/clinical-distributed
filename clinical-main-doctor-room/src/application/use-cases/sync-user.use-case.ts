import type { UserRepository } from "../../domain/repositories/user.repository";

export class SyncUserUseCase {
    constructor(private userRepo: UserRepository) {}

    async execute(data: {
        id: string;
        email: string;
        name: string;
        role: "admin" | "doctor" | "invited";
        createdAt: string;
    }) {
        const user = {
            id: data.id,
            email: data.email,
            name: data.name,
            role: data.role,
            createdAt: new Date(data.createdAt),
        };

        const upserted = await this.userRepo.upsert(user);
        console.log(`[SyncUser] Upserted user ${upserted.id} (${upserted.email})`);
        return upserted;
    }
}
