import Elysia from "elysia";

export class AppError extends Error {
    constructor(
        public override message: string,
        public statusCode: number = 400,
    ) {
        super(message);
        this.name = "AppError";
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Resource not found") {
        super(message, 404);
    }
}

export class ConflictError extends AppError {
    constructor(message = "Resource already exists") {
        super(message, 409);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "Forbidden") {
        super(message, 403);
    }
}

export const errorMiddleware = new Elysia({ name: "error-middleware" })
    .onError(({ error, set }) => {
        const err = error as any;

        if (err instanceof AppError) {
            set.status = err.statusCode;
            return { error: err.message };
        }

        if (err.message?.includes("NOT_FOUND")) {
            set.status = 404;
            return { error: "Route not found" };
        }

        if (err.message?.includes("VALIDATION")) {
            set.status = 422;
            return { error: "Validation failed", details: err.message };
        }

        console.error("Unhandled error:", err);
        set.status = 500;
        return { error: "Internal server error" };
    });

