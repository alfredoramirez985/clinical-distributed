import { eq } from "drizzle-orm";
import type { User } from "../../domain/entities/user";
import type { UserRepository } from "../../domain/repositories/user.repository";
import { db } from "../database/database";
import { users } from "../database/schema";

export class PostgresUserRepository implements UserRepository {
    async findByEmail(email: string): Promise<User | null> {
        const result = await db.select().from(users).where(eq(users.email, email));
        return result[0] ? this.toDomain(result[0]) : null;
    }

    async findById(id: string): Promise<User | null> {
        const result = await db.select().from(users).where(eq(users.id, id));
        return result[0] ? this.toDomain(result[0]) : null;
    }

    async save(user: User): Promise<User> {
        const result = await db.insert(users).values({
            id: user.id,
            email: user.email,
            name: user.name,
            passwordHash: user.passwordHash,
            createdAt: user.createdAt,
        }).returning();
        if (!result[0]) throw new Error("Failed to insert user");
        return this.toDomain(result[0]);
    }

    private toDomain(row: typeof users.$inferSelect): User {
        return {
            id: row.id,
            email: row.email,
            name: row.name,
            passwordHash: row.passwordHash,
            createdAt: row.createdAt!,
        };
    }
}
