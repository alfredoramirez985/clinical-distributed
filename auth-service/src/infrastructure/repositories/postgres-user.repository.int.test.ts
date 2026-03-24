
import { beforeAll, afterAll, describe, it, expect } from "bun:test";
import { inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

import { PostgresUserRepository } from "./postgres-user.repository";
import type { User } from "../../domain/entities/user";
import * as schema from "../database/schema";

describe("PostgresUserRepository Integration", () => {
    let queryClient: postgres.Sql;
    let dbClient: any;
    let repository: PostgresUserRepository;

    beforeAll(async () => {
        queryClient = postgres("postgresql://firstuser:firstuser@localhost:5432/authdb");
        dbClient = drizzle(queryClient, { schema });
        
        // Local dev database should already have the schema applied
        // await migrate(dbClient, { migrationsFolder: "./drizzle" });
        
        // Clean up any test users that might be left over
        await dbClient.delete(schema.users).where(inArray(schema.users.id, ["user-int-123", "user-int-456"]));

        repository = new PostgresUserRepository(dbClient);
    });

    afterAll(async () => {
        // Clean up test data
        await dbClient.delete(schema.users).where(inArray(schema.users.id, ["user-int-123", "user-int-456"]));
        await queryClient.end();
    });

    it("should successfully save a user to the database and retrieve it by id", async () => {
        const newUser: User = {
            id: "user-int-123",
            email: "int-test@example.com",
            name: "Integration Test User",
            passwordHash: "hash123",
            role: "doctor",
            createdAt: new Date(),
        };

        const savedUser = await repository.save(newUser);
        expect(savedUser.id).toBe(newUser.id);
        expect(savedUser.email).toBe(newUser.email);

        const retrievedUser = await repository.findById("user-int-123");
        expect(retrievedUser).not.toBeNull();
        expect(retrievedUser?.email).toBe("int-test@example.com");
    });
    
    it("should retrieve a user by email", async () => {
        const retrievedUser = await repository.findByEmail("int-test@example.com");
        expect(retrievedUser).not.toBeNull();
        expect(retrievedUser?.id).toBe("user-int-123");
    });

    it("should update user role", async () => {
        const updatedUser = await repository.updateRole("user-int-123", "admin");
        expect(updatedUser.role).toBe("admin");

        const retrievedUser = await repository.findById("user-int-123");
        expect(retrievedUser?.role).toBe("admin");
    });
    
    it("should fail to save user with duplicate email", async () => {
        const duplicateUser: User = {
            id: "user-int-456",
            email: "int-test@example.com", // same email
            name: "Duplicate User",
            passwordHash: "hash123",
            role: "invited",
            createdAt: new Date(),
        };

        expect(repository.save(duplicateUser)).rejects.toThrow();
    });
});
