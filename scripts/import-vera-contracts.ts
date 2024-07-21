import { ZstdInit } from '@oneidentity/zstd-js/decompress';
import { FileMetaData, parquetMetadata, parquetRead } from 'hyparquet';
import ky from 'ky';

import {
  addCompiledContracts,
  addContractCodes,
  addContractDeployments,
  addContracts,
  addVerifiedContracts,
  disconnect,
} from '@/utils/db';

const endpointUrl = 'https://pub-f4b5a1306ebd42a3b1289ab59da1d9bf.r2.dev';
const client = ky.create({
  prefixUrl: endpointUrl,
});

interface Manifest {
  timestamp: number;
  dateStr: string;
  files: {
    code: string[];
    contract_deployments: string[];
    compiled_contracts: string[];
    verified_contracts: string[];
  };
}

type ObjectToTuple<T> = {
  [K in keyof T]: T[K];
}[keyof T][];
type ExtractKeys<T> = keyof T;

const { ZstdStream } = await ZstdInit();

async function getManifest(): Promise<Manifest> {
  return await client.get('/manifest.json').json<Manifest>();
}

async function getParquetRows<T>(
  fileName: string,
  columns: ExtractKeys<T>[],
  rowStart?: number,
  rowEnd?: number,
): Promise<T[]> {
  const buffer = await client.get(`/${fileName}`).arrayBuffer();
  const metadata = parquetMetadata(buffer);
  const rows = await readParquetFile<ObjectToTuple<T>>(
    buffer,
    metadata,
    rowStart,
    rowEnd,
  );
  return rows.map(
    (row) =>
      Object.fromEntries(
        Object.entries(row).map(([index, value]) => [
          columns[parseInt(index)],
          value,
        ]),
      ) as T,
  );
}

async function readParquetFile<T>(
  buffer: ArrayBuffer,
  metadata: FileMetaData,
  rowStart?: number,
  rowEnd?: number,
): Promise<T[]> {
  return new Promise((resolve) => {
    parquetRead({
      file: buffer,
      metadata,
      onComplete(rows) {
        console.log('onComplete', rows.length);
        resolve(rows as T[]);
      },
      onChunk(chunk) {
        console.log('onChunk', chunk.rowStart, chunk.rowEnd, chunk.columnName);
      },
      compressors: {
        ZSTD: (input) => ZstdStream.decompress(input),
      },
      utf8: false,
      rowStart,
      rowEnd,
    });
  });
}

// Read VeRa dataset from Parquet files
// Insert them verbatim into the database
const manifest = await getManifest();

const codeFiles = [
  ...manifest.files.code,
  'code/code_1000000_1100000_zstd.parquet',
];
for (const path of codeFiles.slice(3)) {
  const codeRows = await getParquetRows<{
    codeHash: Uint8Array;
    code: Uint8Array;
  }>(path, ['codeHash', 'code']);
  await addContractCodes(
    codeRows.map((row) => ({
      codeHash: Buffer.from(row.codeHash),
      code: Buffer.from(row.code),
    })),
  );
}

const contractFilePath = 'contracts/contracts_0_1000000_zstd.parquet';
const contractRows = await getParquetRows<{
  id: string;
  creationCodeHash: Uint8Array;
  runtimeCodeHash: Uint8Array;
}>(contractFilePath, ['id', 'creationCodeHash', 'runtimeCodeHash']);
await addContracts(
  contractRows.map((row) => ({
    id: row.id,
    creationCodeHash: Buffer.from(row.creationCodeHash),
    runtimeCodeHash: Buffer.from(row.runtimeCodeHash),
  })),
);

const contractDeploymentFiles = [
  ...manifest.files.contract_deployments,
  'contract_deployments/contract_deployments_1000000_2000000_zstd.parquet',
];
for (const path of contractDeploymentFiles) {
  const contractDeploymentRows = await getParquetRows<{
    id: string;
    chainId: bigint;
    address: Uint8Array;
    transactionHash: Uint8Array;
    blockNumber: bigint;
    transactionIndex: number;
    deployer: Uint8Array;
    contractId: string;
  }>(path, [
    'id',
    'chainId',
    'address',
    'transactionHash',
    'blockNumber',
    'transactionIndex',
    'deployer',
    'contractId',
  ]);
  await addContractDeployments(
    contractDeploymentRows.map((row) => ({
      id: row.id,
      chainId: row.chainId.toString(),
      address: Buffer.from(row.address),
      transactionHash: Buffer.from(row.transactionHash),
      blockNumber: row.blockNumber.toString(),
      transactionIndex: row.transactionIndex.toString(),
      deployer: Buffer.from(row.deployer),
      contractId: row.contractId,
    })),
  );
}

const compiledContractFiles = manifest.files.compiled_contracts;
const compiledContractFilePath = compiledContractFiles[0];
if (!compiledContractFilePath) {
  throw new Error('No compiled contract file found in manifest');
}
for (let i = 0; i < 10; i++) {
  console.log('i', i);
  const compiledContractRows = await getParquetRows<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
    compiler: string;
    version: string;
    language: string;
    name: string;
    fullyQualifiedName: string;
    sources: string;
    compilerSettings: string;
    compilationArtifacts: string;
    creationCodeHash: Uint8Array;
    creationCodeArtifacts: string;
    runtimeCodeHash: Uint8Array;
    runtimeCodeArtifacts: string;
  }>(
    compiledContractFilePath,
    [
      'id',
      'createdAt',
      'updatedAt',
      'createdBy',
      'updatedBy',
      'compiler',
      'version',
      'language',
      'name',
      'fullyQualifiedName',
      'sources',
      'compilerSettings',
      'compilationArtifacts',
      'creationCodeHash',
      'creationCodeArtifacts',
      'runtimeCodeHash',
      'runtimeCodeArtifacts',
    ],
    1000 * i + 1,
    1000 * (i + 1),
  );
  await addCompiledContracts(
    compiledContractRows.map((row) => {
      return {
        id: row.id,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        createdBy: row.createdBy,
        updatedBy: row.updatedBy,
        compiler: row.compiler,
        version: row.version,
        language: row.language,
        name: row.name,
        fullyQualifiedName: row.fullyQualifiedName,
        sources: row.sources,
        compilerSettings: row.compilerSettings,
        compilationArtifacts: row.compilationArtifacts,
        creationCodeHash: Buffer.from(row.creationCodeHash),
        creationCodeArtifacts: row.creationCodeArtifacts,
        runtimeCodeHash: Buffer.from(row.runtimeCodeHash),
        runtimeCodeArtifacts: row.runtimeCodeArtifacts,
      };
    }),
  );
}

const verifiedContractFiles = manifest.files.verified_contracts;
for (const path of verifiedContractFiles) {
  const verifiedContractRows = await getParquetRows<{
    id: bigint;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
    deploymentId: string;
    compilationId: string;
    creationMatch: boolean;
    creationValues: string;
    creationTransformations: string;
    runtimeMatch: boolean;
    runtimeValues: string;
    runtimeTransformations: string;
  }>(path, [
    'id',
    'createdAt',
    'updatedAt',
    'createdBy',
    'updatedBy',
    'deploymentId',
    'compilationId',
    'creationMatch',
    'creationValues',
    'creationTransformations',
    'runtimeMatch',
    'runtimeValues',
    'runtimeTransformations',
  ]);
  await addVerifiedContracts(verifiedContractRows);
}

await disconnect();
