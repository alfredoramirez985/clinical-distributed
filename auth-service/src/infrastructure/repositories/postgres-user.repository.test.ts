import { describe, expect, it, mock, beforeEach } from "bun:test";
import { PostgresUserRepository } from "./postgres-user.repository";
import type { DbClient } from "../database/database";
import type { User } from "../../domain/entities/user";
import { eq } from "drizzle-orm";
import { users } from "../database/schema";

describe("PostgresUserRepository", () => {
    let mockDb: any;
    let repository: PostgresUserRepository;

    const mockDbUser = {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        passwordHash: "hash123",
        role: "doctor",
        createdAt: new Date("2026-01-01T00:00:00.000Z"),
        updatedAt: new Date("2026-01-01T00:00:00.000Z")
    };

    beforeEach(() => {
        const whereMock = mock().mockResolvedValue([mockDbUser]);
        const returningMock = mock().mockResolvedValue([mockDbUser]);
        
        mockDb = {
            select: mock().mockReturnValue({
                from: mock().mockReturnValue({
                    where: whereMock
                })
            }),
            insert: mock().mockReturnValue({
                values: mock().mockReturnValue({
                    returning: returningMock
                })
            }),
            update: mock().mockReturnValue({
                set: mock().mockReturnValue({
                    where: mock().mockReturnValue({
                        returning: returningMock
                    })
                })
            })
        };

        repository = new PostgresUserRepository(mockDb as unknown as DbClient);
    });

    describe("findByEmail", () => {
        it("should return parsed user if found", async () => {
            const user = await repository.findByEmail("test@example.com");
            expect(user).not.toBeNull();
            expect(user?.id).toBe("user-123");
            expect(mockDb.select).toHaveBeenCalled();
        });

        it("should return null if not found", async () => {
            mockDb.select().from().where.mockResolvedValueOnce([]);
            const user = await repository.findByEmail("test@example.com");
            expect(user).toBeNull();
        });
    });

    describe("findById", () => {
        it("should return parsed user if found", async () => {
            const user = await repository.findById("user-123");
            expect(user).not.toBeNull();
            expect(user?.id).toBe("user-123");
            expect(mockDb.select).toHaveBeenCalled();
        });

        it("should return null if not found", async () => {
            mockDb.select().from().where.mockResolvedValueOnce([]);
            const user = await repository.findById("non-existent");
            expect(user).toBeNull();
        });
    });

    describe("save", () => {
        it("should correctly map and return user on successful insert", async () => {
            const newUser: User = {
                id: "user-123",
                email: "test@example.com",
                name: "Test User",
                passwordHash: "hash123",
                role: "doctor",
                createdAt: new Date("2026-01-01T00:00:00.000Z"),
            };
            
            const savedUser = await repository.save(newUser);
            expect(savedUser.id).toBe(newUser.id);
            expect(mockDb.insert).toHaveBeenCalled();
        });

        it("should throw an error if no record is returned", async () => {
            mockDb.insert().values().returning.mockResolvedValueOnce([]);
            expect(repository.save({} as User)).rejects.toThrow("Failed to insert user");
        });
    });

    describe("updateRole", () => {
        it("should update and return user", async () => {
            const updatedUser = await repository.updateRole("user-123", "admin");
            expect(updatedUser.id).toBe("user-123");
            expect(mockDb.update).toHaveBeenCalled();
        });

        it("should throw an error if user not found to update", async () => {
            mockDb.update().set().where().returning.mockResolvedValueOnce([]);
            expect(repository.updateRole("user-123", "admin")).rejects.toThrow("User not found or failed to update role");
        });
    });
});
