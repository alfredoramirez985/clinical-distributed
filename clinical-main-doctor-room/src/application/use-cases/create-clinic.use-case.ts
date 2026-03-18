import type { ClinicRepository } from "../../domain/repositories/clinic.repository";
import type { DoctorRoomRepository } from "../../domain/repositories/doctor-room.repository";
import type { Clinic } from "../../domain/entities/clinic";
import type { DoctorRoom } from "../../domain/entities/doctor-room";

interface CreateClinicDto {
    name: string;
    description?: string;
    latitude?: string;
    longitude?: string;
    logoUrl?: string;
    doctorRooms?: { name: string }[];
}

export class CreateClinicUseCase {
    constructor(
        private clinicRepo: ClinicRepository,
        private doctorRoomRepo: DoctorRoomRepository,
    ) {}

    async execute(dto: CreateClinicDto): Promise<{ clinic: Clinic; doctorRooms: DoctorRoom[] }> {
        const clinic: Clinic = {
            id: crypto.randomUUID(),
            name: dto.name,
            description: dto.description ?? null,
            latitude: dto.latitude ?? null,
            longitude: dto.longitude ?? null,
            logoUrl: dto.logoUrl ?? null,
            createdAt: new Date(),
        };

        const savedClinic = await this.clinicRepo.create(clinic);

        const savedRooms: DoctorRoom[] = [];
        if (dto.doctorRooms && dto.doctorRooms.length > 0) {
            for (const room of dto.doctorRooms) {
                const doctorRoom: DoctorRoom = {
                    id: crypto.randomUUID(),
                    name: room.name,
                    clinicId: savedClinic.id,
                    createdAt: new Date(),
                };
                const savedRoom = await this.doctorRoomRepo.create(doctorRoom);
                savedRooms.push(savedRoom);
            }
        }

        return { clinic: savedClinic, doctorRooms: savedRooms };
    }
}
