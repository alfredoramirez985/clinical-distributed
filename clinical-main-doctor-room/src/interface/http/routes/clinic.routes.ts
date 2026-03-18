import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { bearer } from "@elysiajs/bearer";
import { ClinicController } from "../controllers/clinic.controller";
import type { CreateClinicUseCase } from "../../../application/use-cases/create-clinic.use-case";
import type { CreateDoctorRoomUseCase } from "../../../application/use-cases/create-doctor-room.use-case";
import { UnauthorizedError } from "../middlewares/error.middleware";

export function clinicRoutes(
    createClinicUseCase: CreateClinicUseCase,
    createDoctorRoomUseCase: CreateDoctorRoomUseCase,
) {
    const controller = new ClinicController(createClinicUseCase, createDoctorRoomUseCase);

    return new Elysia({ prefix: "/clinics" })
        .use(jwt({ name: "jwt", secret: process.env.JWT_SECRET || "super_secret_jwt_key_for_auth_service", exp: "1h" }))
        .use(bearer())
        .onBeforeHandle(async ({ bearer, jwt }) => {
            if (!bearer) throw new UnauthorizedError("Missing token");
            const payload = await jwt.verify(bearer);
            if (!payload) throw new UnauthorizedError("Invalid token");
        })
        .post("/", controller.createClinic.bind(controller), {
            body: t.Object({
                name: t.String(),
                description: t.Optional(t.String()),
                latitude: t.Optional(t.String()),
                longitude: t.Optional(t.String()),
                logoUrl: t.Optional(t.String()),
                doctorRooms: t.Optional(t.Array(t.Object({
                    name: t.String(),
                }))),
            }),
        })
        .post("/doctor-rooms", controller.createDoctorRoom.bind(controller), {
            body: t.Object({
                name: t.String(),
                clinicId: t.String(),
            }),
        });
}
