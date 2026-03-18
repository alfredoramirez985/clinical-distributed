import { eq } from "drizzle-orm";
import type { Clinic } from "../../domain/entities/clinic";
import type { ClinicRepository } from "../../domain/repositories/clinic.repository";
import { db } from "../database/database";
import { clinics } from "../database/schema";

export class PostgresClinicRepository implements ClinicRepository {
    async findById(id: string): Promise<Clinic | null> {
        const result = await db.select().from(clinics).where(eq(clinics.id, id));
        return result[0] ? this.toDomain(result[0]) : null;
    }

    async create(clinic: Clinic): Promise<Clinic> {
        const result = await db.insert(clinics).values({
            id: clinic.id,
            name: clinic.name,
            description: clinic.description,
            latitude: clinic.latitude,
            longitude: clinic.longitude,
            logoUrl: clinic.logoUrl,
            createdAt: clinic.createdAt,
        }).returning();

        if (!result[0]) throw new Error("Failed to create clinic");
        return this.toDomain(result[0]);
    }

    private toDomain(row: typeof clinics.$inferSelect): Clinic {
        return {
            id: row.id,
            name: row.name,
            description: row.description,
            latitude: row.latitude,
            longitude: row.longitude,
            logoUrl: row.logoUrl,
            createdAt: row.createdAt!,
        };
    }
}
