CREATE TABLE "audit_logs" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"event_type" varchar(255) NOT NULL,
	"payload" jsonb NOT NULL,
	"source" varchar(255) NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
