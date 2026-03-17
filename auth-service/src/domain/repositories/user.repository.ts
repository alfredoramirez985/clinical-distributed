import type { User } from "../entities/user.ts";
export interface UserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    save(user: User): Promise<User>;
    updateRole(id: string, role: "admin" | "doctor" | "invited"): Promise<User>;
}