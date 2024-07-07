CREATE TABLE IF NOT EXISTS "proxies" (
	"id" uuid PRIMARY KEY NOT NULL,
	"chain_id" numeric NOT NULL,
	"address" "bytea" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "proxy_targets" (
	"proxy_id" uuid NOT NULL,
	"address" "bytea" NOT NULL,
	"block_number" numeric,
	"transaction_hash" "bytea"
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "proxy_targets" ADD CONSTRAINT "proxy_targets_proxy_id_proxies_id_fk" FOREIGN KEY ("proxy_id") REFERENCES "public"."proxies"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "proxies_pseudo_pkey" ON "proxies" USING btree ("chain_id","address");