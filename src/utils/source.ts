import { Address, Hex } from 'viem';

import { type SourceInterval, Source, SourceInfo } from '@/labels/base';

import { ChainId } from './chains';
import { getObject, putObject } from './storage';

interface SourceMetadata {
  latestFetch: number;
  latestLogBlock: Record<Address, Record<Hex, number>>;
}

function validate(source: Source[]): boolean {
  // Source IDs must be unique
  const ids = new Set<string>();
  for (const s of source) {
    const id = s.getInfo().id;
    if (ids.has(id)) {
      return false;
    }
    ids.add(id);
  }
  return true;
}

async function getMetadata(
  chain: ChainId,
  sourceInfo: SourceInfo,
): Promise<SourceMetadata> {
  const id = sourceInfo.id;
  const metadataKey = `sources/${chain}/${id}.json`;
  const metadataString = await getObject(metadataKey);
  const metadata: SourceMetadata =
    metadataString === null
      ? {
          latestFetch: 0,
          latestLogBlock: {},
        }
      : JSON.parse(metadataString);
  return metadata;
}

async function updateFetchTimestamp(
  chain: ChainId,
  sourceInfo: SourceInfo,
  metadata: SourceMetadata,
): Promise<void> {
  const id = sourceInfo.id;
  const metadataKey = `sources/${chain}/${id}.json`;
  metadata.latestFetch = Date.now();
  await putObject(metadataKey, JSON.stringify(metadata));
}

async function updateLogBlock(
  chain: ChainId,
  sourceInfo: SourceInfo,
  metadata: SourceMetadata,
  address: Address,
  topic0: Hex,
  startBlock: number,
): Promise<void> {
  const id = sourceInfo.id;
  const metadataKey = `sources/${chain}/${id}.json`;
  metadata.latestLogBlock[address] = metadata.latestLogBlock[address] || {};
  metadata.latestLogBlock[address][topic0] = startBlock;
  await putObject(metadataKey, JSON.stringify(metadata));
}

function isTimeToFetch(
  metadata: SourceMetadata,
  interval: SourceInterval,
  now: number,
): boolean {
  const intervalSeconds =
    interval.seconds +
    60 * interval.minutes +
    3600 * interval.hours +
    86400 * interval.days;
  return now - metadata.latestFetch >= 1000 * intervalSeconds;
}

export {
  getMetadata,
  validate,
  isTimeToFetch,
  updateFetchTimestamp,
  updateLogBlock,
};
export type { SourceMetadata };
