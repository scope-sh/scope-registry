CREATE TABLE IF NOT EXISTS "contract_code" (
	"code_hash" "bytea" PRIMARY KEY NOT NULL,
	"code" "bytea"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "compiled_contracts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar DEFAULT current_user NOT NULL,
	"updated_by" varchar DEFAULT current_user NOT NULL,
	"compiler" varchar NOT NULL,
	"version" varchar NOT NULL,
	"language" varchar NOT NULL,
	"name" varchar NOT NULL,
	"fully_qualified_name" varchar NOT NULL,
	"sources" jsonb NOT NULL,
	"compiler_settings" jsonb NOT NULL,
	"compilation_artifacts" jsonb NOT NULL,
	"creation_code_hash" "bytea" NOT NULL,
	"creation_code_artifacts" jsonb NOT NULL,
	"runtime_code_hash" "bytea" NOT NULL,
	"runtime_code_artifacts" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contract_deployments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"chain_id" numeric NOT NULL,
	"address" "bytea" NOT NULL,
	"transaction_hash" "bytea" NOT NULL,
	"block_number" numeric NOT NULL,
	"transaction_index" numeric NOT NULL,
	"deployer" "bytea" NOT NULL,
	"contract_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contracts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"creation_code_hash" "bytea" NOT NULL,
	"runtime_code_hash" "bytea" NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verified_contracts" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_by" varchar DEFAULT current_user NOT NULL,
	"updated_by" varchar DEFAULT current_user NOT NULL,
	"deployment_id" uuid NOT NULL,
	"compilation_id" uuid NOT NULL,
	"creation_match" boolean NOT NULL,
	"creation_values" jsonb,
	"creation_transformations" jsonb,
	"runtime_match" boolean NOT NULL,
	"runtime_values" jsonb,
	"runtime_transformations" jsonb
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "compiled_contracts" ADD CONSTRAINT "compiled_contracts_creation_code_hash_contract_code_code_hash_fk" FOREIGN KEY ("creation_code_hash") REFERENCES "public"."contract_code"("code_hash") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "compiled_contracts" ADD CONSTRAINT "compiled_contracts_runtime_code_hash_contract_code_code_hash_fk" FOREIGN KEY ("runtime_code_hash") REFERENCES "public"."contract_code"("code_hash") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contract_deployments" ADD CONSTRAINT "contract_deployments_contract_id_contracts_id_fk" FOREIGN KEY ("contract_id") REFERENCES "public"."contracts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contracts" ADD CONSTRAINT "contracts_creation_code_hash_contract_code_code_hash_fk" FOREIGN KEY ("creation_code_hash") REFERENCES "public"."contract_code"("code_hash") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contracts" ADD CONSTRAINT "contracts_runtime_code_hash_contract_code_code_hash_fk" FOREIGN KEY ("runtime_code_hash") REFERENCES "public"."contract_code"("code_hash") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "verified_contracts" ADD CONSTRAINT "verified_contracts_deployment_id_contract_deployments_id_fk" FOREIGN KEY ("deployment_id") REFERENCES "public"."contract_deployments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "verified_contracts" ADD CONSTRAINT "verified_contracts_compilation_id_compiled_contracts_id_fk" FOREIGN KEY ("compilation_id") REFERENCES "public"."compiled_contracts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "compiled_contracts_pseudo_pkey" ON "compiled_contracts" USING btree ("compiler","language","creation_code_hash","runtime_code_hash");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "compiled_contracts_creation_code_hash" ON "compiled_contracts" USING btree ("creation_code_hash");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "compiled_contracts_runtime_code_hash" ON "compiled_contracts" USING btree ("runtime_code_hash");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "contract_deployments_pseudo_pkey" ON "contract_deployments" USING btree ("chain_id","address","transaction_hash");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "contract_deployments_contract_id" ON "contract_deployments" USING btree ("contract_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "contract_deployments_chain_id_address" ON "contract_deployments" USING btree ("chain_id","address");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "contracts_pseudo_pkey" ON "contracts" USING btree ("creation_code_hash","runtime_code_hash");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "contracts_creation_code_hash" ON "contracts" USING btree ("creation_code_hash");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "contracts_runtime_code_hash" ON "contracts" USING btree ("runtime_code_hash");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "contracts_creation_code_hash_runtime_code_hash" ON "contracts" USING btree ("creation_code_hash","runtime_code_hash");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "verified_contracts_pseudo_pkey" ON "verified_contracts" USING btree ("compilation_id","deployment_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "verified_contracts_deployment_id" ON "verified_contracts" USING btree ("deployment_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "verified_contracts_compilation_id" ON "verified_contracts" USING btree ("compilation_id");