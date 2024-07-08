DROP INDEX IF EXISTS "compiled_contracts_creation_code_hash";--> statement-breakpoint
DROP INDEX IF EXISTS "compiled_contracts_runtime_code_hash";--> statement-breakpoint
DROP INDEX IF EXISTS "contract_deployments_contract_id";--> statement-breakpoint
DROP INDEX IF EXISTS "contracts_creation_code_hash";--> statement-breakpoint
DROP INDEX IF EXISTS "contracts_runtime_code_hash";--> statement-breakpoint
DROP INDEX IF EXISTS "contracts_creation_code_hash_runtime_code_hash";--> statement-breakpoint
DROP INDEX IF EXISTS "verified_contracts_deployment_id";--> statement-breakpoint
DROP INDEX IF EXISTS "verified_contracts_compilation_id";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "compiled_contracts_creation_code_hash" ON "compiled_contracts" USING btree ("creation_code_hash");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "compiled_contracts_runtime_code_hash" ON "compiled_contracts" USING btree ("runtime_code_hash");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "contract_deployments_contract_id" ON "contract_deployments" USING btree ("contract_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "contracts_creation_code_hash" ON "contracts" USING btree ("creation_code_hash");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "contracts_runtime_code_hash" ON "contracts" USING btree ("runtime_code_hash");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "contracts_creation_code_hash_runtime_code_hash" ON "contracts" USING btree ("creation_code_hash","runtime_code_hash");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verified_contracts_deployment_id" ON "verified_contracts" USING btree ("deployment_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "verified_contracts_compilation_id" ON "verified_contracts" USING btree ("compilation_id");