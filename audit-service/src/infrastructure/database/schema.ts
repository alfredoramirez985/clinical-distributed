import { pgTable, text, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id", { length: 128 }).primaryKey(),
  eventType: varchar("event_type", { length: 255 }).notNull(),
  payload: jsonb("payload").notNull(),
  source: varchar("source", { length: 255 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});
