import type { Clinic } from "../entities/clinic";

export interface ClinicRepository {
    findById(id: string): Promise<Clinic | null>;
    create(clinic: Clinic): Promise<Clinic>;
}
