import { ZstdInit } from '@oneidentity/zstd-js/decompress';
import axios from 'axios';
import { FileMetaData, parquetMetadata, parquetRead } from 'hyparquet';

import {
  addCompiledContracts,
  addContractCodes,
  addContractDeployments,
  addContracts,
  addVerifiedContracts,
  disconnect,
} from '@/utils/db';

const endpointUrl = 'https://pub-f4b5a1306ebd42a3b1289ab59da1d9bf.r2.dev';
const client = axios.create({
  baseURL: endpointUrl,
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
  const response = await client.get<Manifest>('/manifest.json');
  return response.data;
}

async function getParquetRows<T>(
  fileName: string,
  columns: ExtractKeys<T>[],
  rowStart?: number,
  rowEnd?: number,
): Promise<T[]> {
  console.log('getParquetRows 1');
  const response = await client.get<Buffer>(`/${fileName}`, {
    responseType: 'arraybuffer',
  });
  console.log('getParquetRows 2');
  const buffer = response.data;
  console.log('getParquetRows 3');
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ) as ArrayBuffer;
  console.log('getParquetRows 4');
  const metadata = parquetMetadata(arrayBuffer);
  console.log('getParquetRows 5');
  const rows = await readParquetFile<ObjectToTuple<T>>(
    arrayBuffer,
    metadata,
    rowStart,
    rowEnd,
  );
  console.log('getParquetRows 6');
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

const codeFiles = manifest.files.code;
for (const path of codeFiles) {
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

const contractDeploymentFiles = manifest.files.contract_deployments;
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
  1,
  1000,
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
