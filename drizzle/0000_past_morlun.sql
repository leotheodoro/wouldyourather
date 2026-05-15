CREATE TABLE "shared_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"profile" jsonb NOT NULL,
	"history" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
