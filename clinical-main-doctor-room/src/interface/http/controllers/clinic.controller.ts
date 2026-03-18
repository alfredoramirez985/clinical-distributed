import type { CreateClinicUseCase } from "../../../application/use-cases/create-clinic.use-case";
import type { CreateDoctorRoomUseCase } from "../../../application/use-cases/create-doctor-room.use-case";

export class ClinicController {
    constructor(
        private createClinicUseCase: CreateClinicUseCase,
        private createDoctorRoomUseCase: CreateDoctorRoomUseCase,
    ) {}

    async createClinic({ body }: { body: any }) {
        const result = await this.createClinicUseCase.execute(body);
        return {
            message: "Clinic created",
            clinic: result.clinic,
            doctorRooms: result.doctorRooms,
        };
    }

    async createDoctorRoom({ body }: { body: any }) {
        const doctorRoom = await this.createDoctorRoomUseCase.execute(body);
        return {
            message: "Doctor room created",
            doctorRoom,
        };
    }
}
