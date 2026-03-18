import type { DoctorRoomRepository } from "../../domain/repositories/doctor-room.repository";
import type { ClinicRepository } from "../../domain/repositories/clinic.repository";
import type { DoctorRoom } from "../../domain/entities/doctor-room";
import { NotFoundError } from "../../interface/http/middlewares/error.middleware";

interface CreateDoctorRoomDto {
    name: string;
    clinicId: string;
}

export class CreateDoctorRoomUseCase {
    constructor(
        private doctorRoomRepo: DoctorRoomRepository,
        private clinicRepo: ClinicRepository,
    ) {}

    async execute(dto: CreateDoctorRoomDto): Promise<DoctorRoom> {
        const clinic = await this.clinicRepo.findById(dto.clinicId);
        if (!clinic) {
            throw new NotFoundError("Clinic not found");
        }

        const doctorRoom: DoctorRoom = {
            id: crypto.randomUUID(),
            name: dto.name,
            clinicId: dto.clinicId,
            createdAt: new Date(),
        };

        return this.doctorRoomRepo.create(doctorRoom);
    }
}
