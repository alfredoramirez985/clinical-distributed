import type { DoctorRoom } from "../entities/doctor-room";

export interface DoctorRoomRepository {
    findById(id: string): Promise<DoctorRoom | null>;
    findByClinicId(clinicId: string): Promise<DoctorRoom[]>;
    create(doctorRoom: DoctorRoom): Promise<DoctorRoom>;
}
