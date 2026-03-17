CREATE TYPE "public"."role" AS ENUM('admin', 'doctor', 'invited');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "role" DEFAULT 'invited' NOT NULL;