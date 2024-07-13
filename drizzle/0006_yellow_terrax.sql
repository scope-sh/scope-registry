DROP INDEX IF EXISTS "idx_labels";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "labels_chain_address" ON "labels" USING btree ("chain","address");