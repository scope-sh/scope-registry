ALTER TABLE "labels" ADD COLUMN "source_id" text;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "labels_pseudo_pkey" ON "labels" USING btree ("chain","address","source_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "labels_chain_address_indexed" ON "labels" USING btree ("chain","address","indexed");