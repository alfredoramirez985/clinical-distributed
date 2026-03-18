import type { User } from "../entities/user.ts";

export interface UserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    upsert(user: User): Promise<User>;
}