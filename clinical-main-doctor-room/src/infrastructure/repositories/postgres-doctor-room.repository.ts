import { eq } from "drizzle-orm";
import type { DoctorRoom } from "../../domain/entities/doctor-room";
import type { DoctorRoomRepository } from "../../domain/repositories/doctor-room.repository";
import { db } from "../database/database";
import { doctorRooms } from "../database/schema";

export class PostgresDoctorRoomRepository implements DoctorRoomRepository {
    async findById(id: string): Promise<DoctorRoom | null> {
        const result = await db.select().from(doctorRooms).where(eq(doctorRooms.id, id));
        return result[0] ? this.toDomain(result[0]) : null;
    }

    async findByClinicId(clinicId: string): Promise<DoctorRoom[]> {
        const result = await db.select().from(doctorRooms).where(eq(doctorRooms.clinicId, clinicId));
        return result.map((row) => this.toDomain(row));
    }

    async create(doctorRoom: DoctorRoom): Promise<DoctorRoom> {
        const result = await db.insert(doctorRooms).values({
            id: doctorRoom.id,
            name: doctorRoom.name,
            clinicId: doctorRoom.clinicId,
            createdAt: doctorRoom.createdAt,
        }).returning();

        if (!result[0]) throw new Error("Failed to create doctor room");
        return this.toDomain(result[0]);
    }

    private toDomain(row: typeof doctorRooms.$inferSelect): DoctorRoom {
        return {
            id: row.id,
            name: row.name,
            clinicId: row.clinicId,
            createdAt: row.createdAt!,
        };
    }
}
