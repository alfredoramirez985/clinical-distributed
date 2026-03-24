import { describe, expect, it, mock, spyOn } from "bun:test";
import { LoginUseCase } from "./login.use-case";
import { UnauthorizedError } from "../../interface/http/middlewares/error.middleware";
import type { UserRepository } from "../../domain/repositories/user.repository";
import type { User } from "../../domain/entities/user";

describe("LoginUseCase", () => {
    it("should return user without passwordHash on successful login", async () => {
        const mockUser: User = {
            id: "123",
            name: "John Doe",
            email: "john@example.com",
            passwordHash: "hashed_password",
            role: "doctor",
            createdAt: new Date()
        };

        const mockUserRepo = {
            findByEmail: mock().mockResolvedValue(mockUser)
        } as unknown as UserRepository;

        const verifySpy = spyOn(Bun.password, "verify").mockResolvedValue(true);

        const useCase = new LoginUseCase(mockUserRepo);
        const dto = { email: "john@example.com", password: "password123" };
        
        const result = await useCase.execute(dto);

        expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(dto.email);
        expect(verifySpy).toHaveBeenCalledWith(dto.password, mockUser.passwordHash);
        expect(result).not.toHaveProperty("passwordHash");
        expect(result.id).toBe(mockUser.id);
        expect(result.email).toBe(mockUser.email);
        
        verifySpy.mockRestore();
    });

    it("should throw UnauthorizedError when user is not found", async () => {
        const mockUserRepo = {
            findByEmail: mock().mockResolvedValue(null)
        } as unknown as UserRepository;

        const useCase = new LoginUseCase(mockUserRepo);
        const dto = { email: "nonexistent@example.com", password: "password123" };

        expect(useCase.execute(dto)).rejects.toThrow(new UnauthorizedError("Invalid email or password"));
        expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(dto.email);
    });

    it("should throw UnauthorizedError when password is invalid", async () => {
        const mockUser: User = {
            id: "123",
            name: "John Doe",
            email: "john@example.com",
            passwordHash: "hashed_password",
            role: "doctor",
            createdAt: new Date()
        };

        const mockUserRepo = {
            findByEmail: mock().mockResolvedValue(mockUser)
        } as unknown as UserRepository;

        const verifySpy = spyOn(Bun.password, "verify").mockResolvedValue(false);

        const useCase = new LoginUseCase(mockUserRepo);
        const dto = { email: "john@example.com", password: "wrong_password" };

        expect(useCase.execute(dto)).rejects.toThrow(new UnauthorizedError("Invalid email or password"));
        expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(dto.email);
        expect(verifySpy).toHaveBeenCalledWith(dto.password, mockUser.passwordHash);

        verifySpy.mockRestore();
    });
});
