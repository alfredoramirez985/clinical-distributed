import { pgTable, varchar, text, timestamp, pgEnum, jsonb } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["admin", "doctor", "invited"]);
export const outboxStatusEnum = pgEnum("outbox_status", ["pending", "processed", "failed"]);

export const users = pgTable("users", {
    id: varchar("id", { length: 36 }).primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }).notNull(),
    passwordHash: text("password_hash").notNull(),
    role: roleEnum("role").default("invited").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull()
});

export const outboxEvents = pgTable("outbox_events", {
    id: varchar("id", { length: 36 }).primaryKey(),
    aggregateType: varchar("aggregate_type", { length: 100 }).notNull(), // e.g. "user"
    aggregateId: varchar("aggregate_id", { length: 36 }).notNull(),      // e.g. user id
    eventType: varchar("event_type", { length: 100 }).notNull(),          // e.g. "user.registered"
    payload: jsonb("payload").notNull(),
    status: outboxStatusEnum("status").default("pending").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    processedAt: timestamp("processed_at"),
});

