CREATE TYPE "public"."outbox_status" AS ENUM('pending', 'processed', 'failed');--> statement-breakpoint
CREATE TABLE "outbox_events" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"aggregate_type" varchar(100) NOT NULL,
	"aggregate_id" varchar(36) NOT NULL,
	"event_type" varchar(100) NOT NULL,
	"payload" jsonb NOT NULL,
	"status" "outbox_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"processed_at" timestamp
);
