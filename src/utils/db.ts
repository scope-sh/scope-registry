import { and, eq, sql } from 'drizzle-orm';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { Address, Hex } from 'viem';

import {
  type ContractCode as ContractCodeValues,
  type Contract as ContractValues,
  type ContractDeployment as ContractDeploymentValues,
  type CompiledContract as CompiledContractValues,
  type VerifiedContract as VerifiedContractValues,
  type Label as LabelValues,
  labels as tableLabels,
  contractCode as tableContractCode,
  contracts as tableContracts,
  contractDeployments as tableContractDeployments,
  compiledContracts as tableCompiledContracts,
  verifiedContracts as tableVerifiedContracts,
} from '@/db/schema';
import { Label } from '@/index.js';

import { ChainId } from './chains';

const databaseUrl = process.env.DATABASE_URL as string;

interface Log {
  data: Hex;
  topics: Hex[];
  blockNumber: number;
  logIndex: number;
}

type LabelWithAddress = Label & {
  address: Address;
};

// eslint-disable-next-line import/no-named-as-default-member
const client = new pg.Client({
  connectionString: databaseUrl,
});
await client.connect();

async function addLabels(
  chain: ChainId,
  labels: LabelWithAddress[],
): Promise<void> {
  const db = getDb();
  const batchSize = 1_000;
  const batchCount = Math.ceil(labels.length / batchSize);
  for (let i = 0; i < batchCount; i++) {
    const batch = labels.slice(i * batchSize, (i + 1) * batchSize);
    const labelBatch: LabelValues[] = batch.map((label) => {
      return {
        chain,
        address: label.address,
        sourceId: label.sourceId,
        value: label.value,
        indexed: label.indexed,
        typeId: label.type,
        namespaceId: label.namespace,
        iconUrl: label.iconUrl,
        metadata: label.metadata,
      };
    });
    await db
      .insert(tableLabels)
      .values(labelBatch)
      .onConflictDoUpdate({
        target: [tableLabels.chain, tableLabels.address, tableLabels.sourceId],
        set: {
          value: sql`excluded.value`,
          indexed: sql`excluded.indexed`,
          typeId: sql`excluded.type_id`,
          namespaceId: sql`excluded.namespace_id`,
          iconUrl: sql`excluded.icon_url`,
          metadata: sql`excluded.metadata`,
        },
      })
      .execute();
  }
}

async function removeSourceLabels(
  chain: ChainId,
  sourceId: string,
): Promise<void> {
  const db = getDb();
  await db
    .delete(tableLabels)
    .where(
      and(eq(tableLabels.chain, chain), eq(tableLabels.sourceId, sourceId)),
    )
    .execute();
}

async function addContractCodes(codes: ContractCodeValues[]): Promise<void> {
  const db = getDb();
  const batchSize = 5_000;
  const batchCount = Math.ceil(codes.length / batchSize);
  for (let i = 0; i < batchCount; i++) {
    const batch = codes.slice(i * batchSize, (i + 1) * batchSize);
    const codeBatch: ContractCodeValues[] = batch.map((code) => {
      return code;
    });
    await db.insert(tableContractCode).values(codeBatch).execute();
  }
}

async function addContracts(contracts: ContractValues[]): Promise<void> {
  const db = getDb();
  const batchSize = 5_000;
  const batchCount = Math.ceil(contracts.length / batchSize);
  for (let i = 0; i < batchCount; i++) {
    const batch = contracts.slice(i * batchSize, (i + 1) * batchSize);
    const contractBatch: ContractValues[] = batch.map((contract) => {
      return contract;
    });
    await db
      .insert(tableContracts)
      .values(contractBatch)
      .onConflictDoNothing()
      .execute();
  }
}

async function addContractDeployments(
  contractDeployments: ContractDeploymentValues[],
): Promise<void> {
  const db = getDb();
  const batchSize = 1;
  const batchCount = Math.ceil(contractDeployments.length / batchSize);
  for (let i = 0; i < batchCount; i++) {
    const batch = contractDeployments.slice(i * batchSize, (i + 1) * batchSize);
    const contractDeploymentBatch: ContractDeploymentValues[] = batch.map(
      (contractDeployment) => {
        return contractDeployment;
      },
    );
    try {
      await db
        .insert(tableContractDeployments)
        .values(contractDeploymentBatch)
        .onConflictDoNothing()
        .execute();
    } catch (e) {
      console.log('Error adding contract deployments');
    }
  }
}

async function addCompiledContracts(
  compiledContracts: CompiledContractValues[],
): Promise<void> {
  const db = getDb();
  const batchSize = 1;
  const batchCount = Math.ceil(compiledContracts.length / batchSize);
  for (let i = 0; i < batchCount; i++) {
    const batch = compiledContracts.slice(i * batchSize, (i + 1) * batchSize);
    const compiledContractBatch: CompiledContractValues[] = batch.map(
      (compiledContract) => {
        return compiledContract;
      },
    );
    try {
      await db
        .insert(tableCompiledContracts)
        .values(compiledContractBatch)
        .onConflictDoNothing()
        .execute();
    } catch (e) {
      console.log('Error adding compiled contracts', e);
    }
  }
}

async function addVerifiedContracts(
  verifiedContracts: VerifiedContractValues[],
): Promise<void> {
  const db = getDb();
  const batchSize = 1;
  const batchCount = Math.ceil(verifiedContracts.length / batchSize);
  for (let i = 0; i < batchCount; i++) {
    const batch = verifiedContracts.slice(i * batchSize, (i + 1) * batchSize);
    const verifiedContractBatch: VerifiedContractValues[] = batch.map(
      (verifiedContract) => {
        return verifiedContract;
      },
    );
    try {
      await db
        .insert(tableVerifiedContracts)
        .values(verifiedContractBatch)
        .onConflictDoNothing()
        .execute();
    } catch (e) {
      console.log('Error adding verified contracts', e);
    }
  }
}

async function disconnect(): Promise<void> {
  await client.end();
}

function getDb(): NodePgDatabase {
  return drizzle(client);
}

export {
  addLabels,
  removeSourceLabels,
  addContractCodes,
  addContracts,
  addContractDeployments,
  addCompiledContracts,
  addVerifiedContracts,
  disconnect,
};
export type { LabelWithAddress, Log };
