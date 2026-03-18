import { eq } from "drizzle-orm";
import type { User } from "../../domain/entities/user";
import type { UserRepository } from "../../domain/repositories/user.repository";
import { db, type DbClient } from "../database/database";
import { users } from "../database/schema";

export class PostgresUserRepository implements UserRepository {
    constructor(private dbClient: DbClient = db) {}

    async findByEmail(email: string): Promise<User | null> {
        const result = await this.dbClient.select().from(users).where(eq(users.email, email));
        return result[0] ? this.toDomain(result[0]) : null;
    }

    async findById(id: string): Promise<User | null> {
        const result = await this.dbClient.select().from(users).where(eq(users.id, id));
        return result[0] ? this.toDomain(result[0]) : null;
    }

    async save(user: User): Promise<User> {
        const result = await this.dbClient.insert(users).values({
            id: user.id,
            email: user.email,
            name: user.name,
            passwordHash: user.passwordHash,
            role: user.role,
            createdAt: user.createdAt,
        }).returning();
        if (!result[0]) throw new Error("Failed to insert user");
        return this.toDomain(result[0]);
    }

    async updateRole(id: string, role: "admin" | "doctor" | "invited"): Promise<User> {
        const result = await this.dbClient.update(users)
            .set({ role })
            .where(eq(users.id, id))
            .returning();
            
        if (!result[0]) throw new Error("User not found or failed to update role");
        return this.toDomain(result[0]);
    }

    private toDomain(row: typeof users.$inferSelect): User {
        return {
            id: row.id,
            email: row.email,
            name: row.name,
            passwordHash: row.passwordHash,
            role: row.role as "admin" | "doctor" | "invited",
            createdAt: row.createdAt!,
        };
    }
}
