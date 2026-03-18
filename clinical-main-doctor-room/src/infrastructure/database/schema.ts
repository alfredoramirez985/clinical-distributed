import { pgTable, varchar, text, timestamp, pgEnum, numeric, unique } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["admin", "doctor", "invited"]);

export const users = pgTable("users", {
    id: varchar("id", { length: 36 }).primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    role: roleEnum("role").default("invited").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull()
});

export const clinics = pgTable("clinics", {
    id: varchar("id", { length: 36 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    latitude: numeric("latitude", { precision: 10, scale: 7 }),
    longitude: numeric("longitude", { precision: 10, scale: 7 }),
    logoUrl: varchar("logo_url", { length: 500 }),
    createdAt: timestamp("created_at").defaultNow().notNull()
});

export const doctorRooms = pgTable("doctor_rooms", {
    id: varchar("id", { length: 36 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    clinicId: varchar("clinic_id", { length: 36 }).notNull().references(() => clinics.id),
    createdAt: timestamp("created_at").defaultNow().notNull()
});

export const clinicMembers = pgTable("clinic_members", {
    id: varchar("id", { length: 36 }).primaryKey(),
    clinicId: varchar("clinic_id", { length: 36 }).notNull().references(() => clinics.id),
    userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id),
    role: roleEnum("role").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull()
}, (table) => [
    unique("clinic_members_clinic_id_user_id_unique").on(table.clinicId, table.userId)
]);

