import { sql } from 'drizzle-orm';
import {
  bigserial,
  boolean,
  customType,
  index,
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

const bytea = customType<{
  data: Buffer;
  default: false;
}>({
  dataType() {
    return 'bytea';
  },
});

const labels = pgTable(
  'labels',
  {
    id: serial('id').primaryKey(),
    chain: integer('chain').notNull(),
    address: text('address').notNull(),
    value: text('value').notNull(),
    indexed: boolean('indexed').notNull(),
    typeId: text('type_id'),
    namespaceId: text('namespace_id'),
    iconUrl: text('icon_url'),
  },
  (table) => {
    return {
      idx: index('idx_labels').on(table.chain, table.address),
    };
  },
);

const contractCode = pgTable('contract_code', {
  codeHash: bytea('code_hash').primaryKey().notNull(),
  code: bytea('code'),
});

const contracts = pgTable(
  'contracts',
  {
    id: uuid('id').primaryKey().notNull(),
    creationCodeHash: bytea('creation_code_hash')
      .references(() => contractCode.codeHash)
      .notNull(),
    runtimeCodeHash: bytea('runtime_code_hash')
      .references(() => contractCode.codeHash)
      .notNull(),
  },
  (table) => ({
    uniqueCreationRuntimeHash: uniqueIndex('contracts_pseudo_pkey').on(
      table.creationCodeHash,
      table.runtimeCodeHash,
    ),
    creationCodeHashIndex: index('contracts_creation_code_hash').on(
      table.creationCodeHash,
    ),
    runtimeCodeHashIndex: index('contracts_runtime_code_hash').on(
      table.runtimeCodeHash,
    ),
    creationRuntimeCodeHashIndex: index(
      'contracts_creation_code_hash_runtime_code_hash',
    ).on(table.creationCodeHash, table.runtimeCodeHash),
  }),
);

const contractDeployments = pgTable(
  'contract_deployments',
  {
    id: uuid('id').primaryKey().notNull(),
    chainId: numeric('chain_id').notNull(),
    address: bytea('address').notNull(),
    transactionHash: bytea('transaction_hash').notNull(),
    blockNumber: numeric('block_number').notNull(),
    transactionIndex: numeric('transaction_index').notNull(),
    deployer: bytea('deployer').notNull(),
    contractId: uuid('contract_id')
      .references(() => contracts.id)
      .notNull(),
  },
  (table) => ({
    uniqueChainAddressTransaction: uniqueIndex(
      'contract_deployments_pseudo_pkey',
    ).on(table.chainId, table.address, table.transactionHash),
    contractIdIndex: index('contract_deployments_contract_id').on(
      table.contractId,
    ),
    chainIdAddressIndex: index('contract_deployments_chain_id_address').on(
      table.chainId,
      table.address,
    ),
  }),
);

const compiledContracts = pgTable(
  'compiled_contracts',
  {
    id: uuid('id').primaryKey().notNull(),
    createdAt: timestamp('created_at')
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp('updated_at')
      .default(sql`now()`)
      .notNull(),
    createdBy: varchar('created_by')
      .default(sql`current_user`)
      .notNull(),
    updatedBy: varchar('updated_by')
      .default(sql`current_user`)
      .notNull(),
    compiler: varchar('compiler').notNull(),
    version: varchar('version').notNull(),
    language: varchar('language').notNull(),
    name: varchar('name').notNull(),
    fullyQualifiedName: varchar('fully_qualified_name').notNull(),
    sources: jsonb('sources').notNull(),
    compilerSettings: jsonb('compiler_settings').notNull(),
    compilationArtifacts: jsonb('compilation_artifacts').notNull(),
    creationCodeHash: bytea('creation_code_hash')
      .references(() => contractCode.codeHash)
      .notNull(),
    creationCodeArtifacts: jsonb('creation_code_artifacts').notNull(),
    runtimeCodeHash: bytea('runtime_code_hash')
      .references(() => contractCode.codeHash)
      .notNull(),
    runtimeCodeArtifacts: jsonb('runtime_code_artifacts').notNull(),
  },
  (table) => ({
    uniqueCompiledContracts: uniqueIndex('compiled_contracts_pseudo_pkey').on(
      table.compiler,
      table.language,
      table.creationCodeHash,
      table.runtimeCodeHash,
    ),
    creationCodeHashIndex: index('compiled_contracts_creation_code_hash').on(
      table.creationCodeHash,
    ),
    runtimeCodeHashIndex: index('compiled_contracts_runtime_code_hash').on(
      table.runtimeCodeHash,
    ),
  }),
);

const verifiedContracts = pgTable(
  'verified_contracts',
  {
    id: bigserial('id', { mode: 'bigint' }).primaryKey().notNull(),
    createdAt: timestamp('created_at')
      .default(sql`now()`)
      .notNull(),
    updatedAt: timestamp('updated_at')
      .default(sql`now()`)
      .notNull(),
    createdBy: varchar('created_by')
      .default(sql`current_user`)
      .notNull(),
    updatedBy: varchar('updated_by')
      .default(sql`current_user`)
      .notNull(),
    deploymentId: uuid('deployment_id')
      .references(() => contractDeployments.id)
      .notNull(),
    compilationId: uuid('compilation_id')
      .references(() => compiledContracts.id)
      .notNull(),
    creationMatch: boolean('creation_match').notNull(),
    creationValues: jsonb('creation_values'),
    creationTransformations: jsonb('creation_transformations'),
    runtimeMatch: boolean('runtime_match').notNull(),
    runtimeValues: jsonb('runtime_values'),
    runtimeTransformations: jsonb('runtime_transformations'),
  },
  (table) => ({
    uniqueVerifiedContracts: uniqueIndex('verified_contracts_pseudo_pkey').on(
      table.compilationId,
      table.deploymentId,
    ),
    deploymentIdIndex: index('verified_contracts_deployment_id').on(
      table.deploymentId,
    ),
    compilationIdIndex: index('verified_contracts_compilation_id').on(
      table.compilationId,
    ),
  }),
);

const proxies = pgTable(
  'proxies',
  {
    id: uuid('id').primaryKey().notNull(),
    chainId: numeric('chain_id').notNull(),
    address: bytea('address').notNull(),
  },
  (table) => ({
    uniqueChainAddress: uniqueIndex('proxies_pseudo_pkey').on(
      table.chainId,
      table.address,
    ),
  }),
);

const proxyTargets = pgTable('proxy_targets', {
  proxyId: uuid('proxy_id')
    .references(() => proxies.id)
    .notNull(),
  address: bytea('address').notNull(),
  blockNumber: numeric('block_number'),
  transactionHash: bytea('transaction_hash'),
});

type Label = typeof labels.$inferInsert;
type ContractCode = typeof contractCode.$inferInsert;
type Contract = typeof contracts.$inferInsert;
type ContractDeployment = typeof contractDeployments.$inferInsert;
type CompiledContract = typeof compiledContracts.$inferInsert;
type VerifiedContract = typeof verifiedContracts.$inferInsert;
type Proxy = typeof proxies.$inferInsert;
type ProxyTarget = typeof proxyTargets.$inferInsert;

export {
  labels,
  contractCode,
  contracts,
  contractDeployments,
  compiledContracts,
  verifiedContracts,
  proxies,
  proxyTargets,
};
export type {
  Label,
  ContractCode,
  Contract,
  ContractDeployment,
  CompiledContract,
  VerifiedContract,
  Proxy,
  ProxyTarget,
};
