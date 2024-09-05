import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { Address, Hex, decodeEventLog, namehash, size } from 'viem';

import ensLegacyPublicResolverAbi from '@/abi/ensLegacyPublicResolver';
import ensPublicResolverAbi from '@/abi/ensPublicResolver';
import ensReverseRegistrarAbi from '@/abi/ensReverseRegistrar';
import {
  Source as BaseSource,
  ChainSingleLabelMap,
  Label,
  SourceInfo,
} from '@/labels/base.js';
import { ChainId, ETHEREUM, SEPOLIA, getChainData } from '@/utils/chains';
import { getLogs, Log } from '@/utils/fetching';
import { getObject, putObject } from '@/utils/storage';

const TOPIC_NAME_CHANGED =
  '0xb7d29e911041e8d9b843369e890bcb72c9388692ba48b65ac54e7214c4c348f7';
const TOPIC_ADDRESS_CHANGED =
  '0x65412581168e88a1e60c6459d7f44ae83ad0832e670826c05a4e2476b57af752';
const TOPIC_TEXT_CHANGED =
  '0x448bc014f1536726cf8d54ff3d6481ed3cbc683c2591ca204274009afa09b1a1';
const TOPIC_REVERSE_CLAIMED =
  '0x6ada868dd3058cf77a48a74489fd7963688e5464b2b0fa957ace976243270e92';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'ENS Names',
      id: 'ens-names',
      interval: {
        seconds: 0,
        minutes: 0,
        hours: 0,
        days: 1,
      },
      fetchType: 'incremental',
      requiresDeletion: true,
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const ensChain = getEnsChain(chain);
    const reverseClaimMap = await this.#getReverseClaimMap(ensChain);
    console.log('fetch 1');
    const addressMap = await this.#getAddressMap(ensChain);
    console.log('fetch 2');
    const avatarMap = await this.#getAvatarMap(ensChain);
    console.log('fetch 3');
    const labels: ChainSingleLabelMap = {};
    // Start with the legacy claims
    const legacyReverseMapString = await readFile(
      join(__dirname, './legacyReverseMap.json'),
      'utf-8',
    );
    const legacyReverseMap = JSON.parse(legacyReverseMapString) as Record<
      ChainId,
      Record<Address, string>
    >;
    const chainLegacyReverseMap = legacyReverseMap[ensChain] || {};
    for (const addressString in chainLegacyReverseMap) {
      const address = addressString as Address;
      const name = chainLegacyReverseMap[address];
      if (!name) {
        continue;
      }
      const nameHash = namehash(name);
      // Only use the reverse record if the name itself resolves to the address
      const resolvedAddress = (addressMap[nameHash] || {})[chain];
      const ensChainResolvedAddress = (addressMap[nameHash] || {})[ensChain];
      if (resolvedAddress !== address && ensChainResolvedAddress !== address) {
        continue;
      }
      const avatar = avatarMap[nameHash];
      const label: Label = {
        value: name,
        sourceId: this.getInfo().id,
        indexed: false,
        iconUrl: avatar,
      };
      labels[address] = label;
    }
    for (const addressString in reverseClaimMap) {
      const address = addressString as Address;
      const name = reverseClaimMap[address];
      if (!name) {
        continue;
      }
      const nameHash = namehash(name);
      // Only use the reverse record if the name itself resolves to the address
      const resolvedAddress = (addressMap[nameHash] || {})[chain];
      const ensChainResolvedAddress = (addressMap[nameHash] || {})[ensChain];
      if (resolvedAddress !== address && ensChainResolvedAddress !== address) {
        continue;
      }
      const avatar = avatarMap[nameHash];
      const label: Label = {
        value: name,
        sourceId: this.getInfo().id,
        indexed: false,
        iconUrl: avatar,
      };
      labels[address] = label;
    }
    return labels;
  }

  async #getReverseClaimMap(
    ensChain: ChainId,
  ): Promise<Record<Address, string>> {
    const reverseRegistrarAddress = getReverseRegistrarAddress(ensChain);
    const legacyPublicResolverAddress =
      getLegacyPublicResolverAddress(ensChain);
    const publicResolverAddress = getPublicResolverAddress(ensChain);

    const reverseClaimMap = await getReverseClaimMapCache(ensChain);
    const reverseClaimedLogs = await getLogs(
      this.getInfo(),
      ensChain,
      reverseRegistrarAddress,
      TOPIC_REVERSE_CLAIMED,
    );
    for (const log of reverseClaimedLogs) {
      const decodedLog = decodeEventLog({
        abi: ensReverseRegistrarAbi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'ReverseClaimed') {
        throw new Error('Unexpected event name');
      }
      reverseClaimMap[decodedLog.args.node] =
        decodedLog.args.addr.toLowerCase() as Address;
    }
    setReverseClaimMapCache(ensChain, reverseClaimMap);

    const legacyNameMap = await getLegacyNameMapCache(ensChain);
    const legacyNameChangedLogs = await getLogs(
      this.getInfo(),
      ensChain,
      legacyPublicResolverAddress,
      TOPIC_NAME_CHANGED,
    );
    for (const log of legacyNameChangedLogs) {
      const decodedLog = decodeEventLog({
        abi: ensLegacyPublicResolverAbi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'NameChanged') {
        throw new Error('Unexpected event name');
      }
      legacyNameMap[decodedLog.args.node] = decodedLog.args.name;
    }
    await setLegacyNameMapCache(ensChain, legacyNameMap);

    const nameMap = await getNameMapCache(ensChain);
    const nameChangedLogs = await getLogs(
      this.getInfo(),
      ensChain,
      publicResolverAddress,
      TOPIC_NAME_CHANGED,
    );
    for (const log of nameChangedLogs) {
      const decodedLog = decodeEventLog({
        abi: ensPublicResolverAbi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'NameChanged') {
        throw new Error('Unexpected event name');
      }
      nameMap[decodedLog.args.node] = decodedLog.args.name;
    }
    await setNameMapCache(ensChain, nameMap);

    const names = {
      ...legacyNameMap,
      ...nameMap,
    };

    return Object.fromEntries(
      Object.entries(reverseClaimMap).map(([node, address]) => [
        address,
        names[node as Hex] as string,
      ]),
    );
  }

  async #getAddressMap(
    ensChain: ChainId,
  ): Promise<Record<Hex, Record<ChainId, Address>>> {
    function process(
      logs: Log[],
      map: Record<Hex, Record<ChainId, Address>>,
    ): void {
      for (const log of logs) {
        const decodedLog = decodeEventLog({
          abi: ensPublicResolverAbi,
          data: log.data,
          topics: log.topics as [Hex, ...Hex[]],
        });
        if (decodedLog.eventName !== 'AddressChanged') {
          throw new Error('Unexpected event name');
        }
        const coinType = decodedLog.args.coinType;
        const chainId = convertCoinTypeToEvmChainId(coinType, ensChain);
        if (!map[decodedLog.args.node]) {
          map[decodedLog.args.node] = {} as Record<ChainId, Address>;
        }
        const nodeMap = map[decodedLog.args.node];
        if (nodeMap) {
          const newAddress =
            decodedLog.args.newAddress.toLowerCase() as Address;
          if (size(newAddress) === 0) {
            // Removal
            delete nodeMap[chainId];
          } else {
            nodeMap[chainId] = newAddress;
          }
        }
      }
    }

    const legacyPublicResolverAddress =
      getLegacyPublicResolverAddress(ensChain);
    const publicResolverAddress = getPublicResolverAddress(ensChain);

    const legacyAddressChangedLogs = await getLogs(
      this.getInfo(),
      ensChain,
      legacyPublicResolverAddress,
      TOPIC_ADDRESS_CHANGED,
    );
    const legacyAddressMap = await getLegacyAddressMapCache(ensChain);
    process(legacyAddressChangedLogs, legacyAddressMap);
    await setLegacyAddressMapCache(ensChain, legacyAddressMap);

    const addressChangedLogs = await getLogs(
      this.getInfo(),
      ensChain,
      publicResolverAddress,
      TOPIC_ADDRESS_CHANGED,
    );
    const addressMap = await getAddressMapCache(ensChain);
    process(addressChangedLogs, addressMap);
    await setAddressMapCache(ensChain, addressMap);

    const map: Record<Hex, Record<ChainId, Address>> = {};
    for (const node in legacyAddressMap) {
      map[node as Address] =
        legacyAddressMap[node as Address] || ({} as Record<ChainId, Address>);
    }
    for (const node in addressMap) {
      map[node as Address] = {
        ...map[node as Address],
        ...addressMap[node as Address],
      } as Record<ChainId, Address>;
    }
    return map;
  }

  async #getAvatarMap(ensChain: ChainId): Promise<Record<Hex, string>> {
    const publicResolverAddress = getPublicResolverAddress(ensChain);

    // Process "TextChanged" events to get avatars
    const textChangedLogs = await getLogs(
      this.getInfo(),
      ensChain,
      publicResolverAddress,
      TOPIC_TEXT_CHANGED,
    );
    const textChanges = textChangedLogs
      .map((log) => {
        const decodedLog = decodeEventLog({
          abi: ensPublicResolverAbi,
          data: log.data,
          topics: log.topics as [Hex, ...Hex[]],
        });
        if (decodedLog.eventName !== 'TextChanged') {
          throw new Error('Unexpected event name');
        }
        return {
          node: decodedLog.args.node,
          key: decodedLog.args.key,
          value: decodedLog.args.value,
        };
      })
      .filter((change) => change.key === 'avatar');

    const map = await getAvatarMapCache(ensChain);
    for (const change of textChanges) {
      map[change.node] = change.value;
    }
    await setAvatarMapCache(ensChain, map);

    return map;
  }
}

async function getReverseClaimMapCache(
  chain: ChainId,
): Promise<Record<Hex, Address>> {
  return getCache(chain, 'reverseClaimMap');
}

async function setReverseClaimMapCache(
  chain: ChainId,
  map: Record<Hex, Address>,
): Promise<void> {
  return setCache(chain, 'reverseClaimMap', map);
}

async function getLegacyNameMapCache(
  chain: ChainId,
): Promise<Record<Hex, string>> {
  return getCache(chain, 'legacyNameMap');
}

async function setLegacyNameMapCache(
  chain: ChainId,
  map: Record<Hex, string>,
): Promise<void> {
  return setCache(chain, 'legacyNameMap', map);
}

async function getNameMapCache(chain: ChainId): Promise<Record<Hex, string>> {
  return getCache(chain, 'nameMap');
}

async function setNameMapCache(
  chain: ChainId,
  map: Record<Hex, string>,
): Promise<void> {
  return setCache(chain, 'nameMap', map);
}

async function getLegacyAddressMapCache(
  chain: ChainId,
): Promise<Record<Hex, Record<ChainId, Address>>> {
  return getCache(chain, 'legacyAddressMap');
}

async function setLegacyAddressMapCache(
  chain: ChainId,
  map: Record<Hex, Record<ChainId, Address>>,
): Promise<void> {
  return setCache(chain, 'legacyAddressMap', map);
}

async function getAddressMapCache(
  chain: ChainId,
): Promise<Record<Hex, Record<ChainId, Address>>> {
  return getCache(chain, 'addressMap');
}

async function setAddressMapCache(
  chain: ChainId,
  map: Record<Hex, Record<ChainId, Address>>,
): Promise<void> {
  return setCache(chain, 'addressMap', map);
}

async function getAvatarMapCache(chain: ChainId): Promise<Record<Hex, string>> {
  return getCache(chain, 'avatarMap');
}

async function setAvatarMapCache(
  chain: ChainId,
  map: Record<Hex, string>,
): Promise<void> {
  return setCache(chain, 'avatarMap', map);
}

async function getCache<K extends string, V>(
  chain: ChainId,
  cacheId: string,
): Promise<Record<K, V>> {
  const cacheKey = `ens/${chain}/${cacheId}.json`;
  const cacheString = await getObject(cacheKey);
  const cache: Record<K, V> = cacheString ? JSON.parse(cacheString) : {};
  return cache;
}

async function setCache<K extends string, V>(
  chain: ChainId,
  cacheId: string,
  cache: Record<K, V>,
): Promise<void> {
  const cacheKey = `ens/${chain}/${cacheId}.json`;
  await putObject(cacheKey, JSON.stringify(cache));
}

function getPublicResolverAddress(chain: ChainId): Address {
  switch (chain) {
    case ETHEREUM:
      return '0x231b0ee14048e9dccd1d247744d114a4eb5e8e63';
    case SEPOLIA:
      return '0x8fade66b79cc9f707ab26799354482eb93a5b7dd';
    default:
      throw new Error('Unsupported chain');
  }
}

function getLegacyPublicResolverAddress(chain: ChainId): Address {
  switch (chain) {
    case ETHEREUM:
      return '0x4976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41';
    case SEPOLIA:
      return '0x0ceec524b2807841739d3b5e161f5bf1430ffa48';
    default:
      throw new Error('Unsupported chain');
  }
}

function getReverseRegistrarAddress(chain: ChainId): Address {
  switch (chain) {
    case ETHEREUM:
      return '0xa58e81fe9b61b5c3fe2afd33cf304c454abfc7cb';
    case SEPOLIA:
      return '0xa0a1abcdae1a2a4a2ef8e9113ff0e02dd81dc0c6';
    default:
      throw new Error('Unsupported chain');
  }
}

function getEnsChain(chain: ChainId): ChainId {
  const chainData = getChainData(chain);
  return chainData.testnet ? SEPOLIA : ETHEREUM;
}

function convertCoinTypeToEvmChainId(
  coinType: bigint,
  ensChain: ChainId,
): ChainId {
  const coinTypeNumber = parseInt(coinType.toString());
  if (coinTypeNumber === 60) return ensChain;
  return ((0x7fffffff & coinTypeNumber) >> 0) as ChainId;
}

export default Source;
