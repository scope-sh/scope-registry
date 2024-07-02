CREATE TABLE IF NOT EXISTS "labels" (
	"id" serial PRIMARY KEY NOT NULL,
	"chain" integer NOT NULL,
	"address" text NOT NULL,
	"value" text NOT NULL,
	"indexed" boolean NOT NULL,
	"type_id" text,
	"namespace_id" text,
	"icon_url" text
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_labels" ON "labels" USING btree ("chain","address");