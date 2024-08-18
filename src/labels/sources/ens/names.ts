import { Address, Hex, decodeEventLog, namehash, size } from 'viem';

import ensEthRegistrarControllerAbi from '@/abi/ensEthRegistrarController';
import ensLegacyEthRegistrarControllerAbi from '@/abi/ensLegacyEthRegistrarController';
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
import { getLogs } from '@/utils/fetching';
import { getObject, putObject } from '@/utils/storage';

const TOPIC_NAME_RENEWED =
  '0x3da24c024582931cfaf8267d8ed24d13a82a8068d5bd337d30ec45cea4e506ae';
const TOPIC_NAME_CHANGED =
  '0xb7d29e911041e8d9b843369e890bcb72c9388692ba48b65ac54e7214c4c348f7';
const TOPIC_ADDRESS_CHANGED =
  '0x65412581168e88a1e60c6459d7f44ae83ad0832e670826c05a4e2476b57af752';
const TOPIC_TEXT_CHANGED =
  '0x448bc014f1536726cf8d54ff3d6481ed3cbc683c2591ca204274009afa09b1a1';
const TOPIC_NAME_REGISTERED =
  '0x69e37f151eb98a09618ddaa80c8cfaf1ce5996867c489f45b555b412271ebf27';
const TOPIC_NAME_REGISTERED_LEGACY =
  '0xca6abbe9d7f11422cb6ca7629fbf6fe9efb1c621f71ce8f02b9f2a230097404f';
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
        days: 14,
      },
      fetchType: 'full',
      requiresDeletion: true,
    };
  }

  cache: Partial<
    Record<
      ChainId,
      {
        reverseClaimMap: Record<Address, string>;
        labelHashMap: Record<Hex, string>;
        addressMap: Record<Hex, Record<ChainId, Address>>;
        avatarMap: Record<Hex, string>;
      }
    >
  > = {};

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const ensChain = getEnsChain(chain);
    const reverseClaimMap = this.cache[ensChain]?.reverseClaimMap
      ? this.cache[ensChain].reverseClaimMap
      : await this.#getReverseClaimMap(ensChain);
    console.log('fetch 1');
    const labelHashMap = this.cache[ensChain]?.labelHashMap
      ? this.cache[ensChain].labelHashMap
      : await this.#getLabelHashMap(ensChain);
    console.log('fetch 2');
    const addressMap = this.cache[ensChain]?.addressMap
      ? this.cache[ensChain].addressMap
      : await this.#getAddressMap(ensChain);
    console.log('fetch 3');
    const avatarMap = this.cache[ensChain]?.avatarMap
      ? this.cache[ensChain].avatarMap
      : await this.#getAvatarMap(ensChain);
    console.log('fetch 4');
    this.cache[ensChain] = {
      reverseClaimMap,
      labelHashMap,
      addressMap,
      avatarMap,
    };
    const labels: ChainSingleLabelMap = {};
    // First priority: reverse claims
    for (const addressString in reverseClaimMap) {
      const address = addressString as Address;
      const name = reverseClaimMap[address];
      if (!name) {
        continue;
      }
      const nameHash = namehash(name);
      const avatar = avatarMap[nameHash];
      const label: Label = {
        value: name,
        sourceId: this.getInfo().id,
        indexed: false,
        iconUrl: avatar,
      };
      labels[address] = label;
    }
    // Second priority: regular registrations
    for (const nodeString in labelHashMap) {
      const node = nodeString as Hex;
      const name = labelHashMap[node];
      if (!name) {
        continue;
      }
      const chainMap = addressMap[node] || ({} as Record<ChainId, Address>);
      const chains = Object.keys(chainMap).map(
        (chain) => parseInt(chain) as ChainId,
      );
      chains.sort((a, b) => {
        // First priority: the chain we are fetching for
        if (a === chain) return -1;
        if (b === chain) return 1;
        // Second priority: Ethereum
        if (a === ETHEREUM) return -1;
        if (b === ETHEREUM) return 1;
        // Third priority: other chains
        return a - b;
      });
      const topChain = chains[0];
      if (!topChain) {
        continue;
      }
      const address = chainMap[topChain];
      if (!address) {
        continue;
      }
      if (labels[address]) {
        continue;
      }
      const avatar = avatarMap[node];
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

  async #getLabelHashMap(ensChain: ChainId): Promise<Record<Hex, string>> {
    const legacyEthRegistrarAddress = getLegacyEthRegistrarAddress(ensChain);
    const ethRegistrarAddress = getEthRegistrarAddress(ensChain);
    const legacyNameRegistrationLogs = await getLogs(
      this.getInfo(),
      ensChain,
      legacyEthRegistrarAddress,
      TOPIC_NAME_REGISTERED_LEGACY,
    );
    const legacyNameRenewalLogs = await getLogs(
      this.getInfo(),
      ensChain,
      legacyEthRegistrarAddress,
      TOPIC_NAME_RENEWED,
    );
    const nameRegistrationLogs = await getLogs(
      this.getInfo(),
      ensChain,
      ethRegistrarAddress,
      TOPIC_NAME_REGISTERED,
    );
    const nameRenewalLogs = await getLogs(
      this.getInfo(),
      ensChain,
      ethRegistrarAddress,
      TOPIC_NAME_RENEWED,
    );

    const legacyNameRegistrations = legacyNameRegistrationLogs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: ensLegacyEthRegistrarControllerAbi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'NameRegistered') {
        throw new Error('Unexpected event name');
      }
      return {
        block: log.blockNumber,
        name: decodedLog.args.name,
        expires: decodedLog.args.expires,
      };
    });
    const legacyNameRenewals = legacyNameRenewalLogs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: ensLegacyEthRegistrarControllerAbi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'NameRenewed') {
        throw new Error('Unexpected event name');
      }
      return {
        block: log.blockNumber,
        name: decodedLog.args.name,
        expires: decodedLog.args.expires,
      };
    });
    const nameRegistrations = nameRegistrationLogs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: ensEthRegistrarControllerAbi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'NameRegistered') {
        throw new Error('Unexpected event name');
      }
      return {
        block: log.blockNumber,
        name: decodedLog.args.name,
        expires: decodedLog.args.expires,
      };
    });
    const nameRenewals = nameRenewalLogs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: ensEthRegistrarControllerAbi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'NameRenewed') {
        throw new Error('Unexpected event name');
      }
      return {
        block: log.blockNumber,
        name: decodedLog.args.name,
        expires: decodedLog.args.expires,
      };
    });
    const registrationList = [
      ...legacyNameRegistrations,
      ...legacyNameRenewals,
      ...nameRegistrations,
      ...nameRenewals,
    ];
    registrationList.sort((a, b) => a.block - b.block);
    // Store the most recent registration for each name
    // But preserve the order of name registrations to get the first name for each address
    const names: Record<string, bigint> = {};
    for (const registration of registrationList) {
      const name = registration.name;
      const expires = registration.expires;
      const previousExpires = names[name];
      if (!previousExpires || previousExpires < expires) {
        names[name] = expires;
      }
    }
    const map: Record<Hex, string> = Object.fromEntries(
      Object.entries(names)
        .filter(([, expires]) => expires > Date.now() / 1000)
        .map(([name]) => {
          const fullName = `${name}.eth`;
          return [namehash(fullName), fullName];
        }),
    );
    return map;
  }

  async #getReverseClaimMap(
    ensChain: ChainId,
  ): Promise<Record<Address, string>> {
    const reverseRegistrarAddress = getReverseRegistrarAddress(ensChain);
    const legacyPublicResolverAddress =
      getLegacyPublicResolverAddress(ensChain);
    const publicResolverAddress = getPublicResolverAddress(ensChain);

    const reverseClaimedLogs = await getLogs(
      this.getInfo(),
      ensChain,
      reverseRegistrarAddress,
      TOPIC_REVERSE_CLAIMED,
    );
    const reverseClaims = reverseClaimedLogs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: ensReverseRegistrarAbi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'ReverseClaimed') {
        throw new Error('Unexpected event name');
      }
      return {
        node: decodedLog.args.node,
        address: decodedLog.args.addr.toLowerCase() as Address,
      };
    });

    const legacyNameChangedLogs = await getLogs(
      this.getInfo(),
      ensChain,
      legacyPublicResolverAddress,
      TOPIC_NAME_CHANGED,
    );
    const nameChangedLogs = await getLogs(
      this.getInfo(),
      ensChain,
      publicResolverAddress,
      TOPIC_NAME_CHANGED,
    );
    const legacyNameChanges = legacyNameChangedLogs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: ensLegacyPublicResolverAbi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'NameChanged') {
        throw new Error('Unexpected event name');
      }
      return {
        node: decodedLog.args.node,
        name: decodedLog.args.name,
      };
    });
    const nameChanges = nameChangedLogs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: ensPublicResolverAbi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'NameChanged') {
        throw new Error('Unexpected event name');
      }
      return {
        node: decodedLog.args.node,
        name: decodedLog.args.name,
      };
    });
    const nameMap = Object.fromEntries(
      legacyNameChanges
        .concat(nameChanges)
        .map((change) => [change.node, change.name]),
    );

    return Object.fromEntries(
      reverseClaims.map((claim) => [
        claim.address,
        nameMap[claim.node] as string,
      ]),
    );
  }

  async #getAddressMap(
    ensChain: ChainId,
  ): Promise<Record<Hex, Record<ChainId, Address>>> {
    const publicResolverAddress = getPublicResolverAddress(ensChain);

    const addressChangedLogs = await getLogs(
      this.getInfo(),
      ensChain,
      publicResolverAddress,
      TOPIC_ADDRESS_CHANGED,
    );
    console.log('getAddressMap 1', addressChangedLogs.length);
    const map: Record<Hex, Record<ChainId, Address>> = await getAddressMapCache(
      ensChain,
    );
    for (const log of addressChangedLogs) {
      const index = addressChangedLogs.indexOf(log);
      if (index % 10000 === 0) {
        console.log(`Processing log ${index}/${addressChangedLogs.length}`);
      }
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
        const newAddress = decodedLog.args.newAddress.toLowerCase() as Address;
        if (size(newAddress) === 0) {
          // Removal
          delete nodeMap[chainId];
        } else {
          nodeMap[chainId] = newAddress;
        }
      }
    }

    await setAddressMapCache(ensChain, map);
    console.log('getAddressMap 2');
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
    console.log('getAvatarMap 1', textChangedLogs.length);
    const textChanges = textChangedLogs
      .map((log) => {
        const index = textChangedLogs.indexOf(log);
        if (index % 10000 === 0) {
          console.log(`Processing log ${index}/${textChangedLogs.length}`);
        }
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
    console.log('getAvatarMap 2');

    const map: Record<Hex, string> = Object.fromEntries(
      textChanges.map((change) => [change.node, change.value]),
    );
    console.log('getAvatarMap 3');

    return map;
  }
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

function getEthRegistrarAddress(chain: ChainId): Address {
  switch (chain) {
    case ETHEREUM:
      return '0x253553366da8546fc250f225fe3d25d0c782303b';
    case SEPOLIA:
      return '0xfed6a969aaa60e4961fcd3ebf1a2e8913ac65b72';
    default:
      throw new Error('Unsupported chain');
  }
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

function getLegacyEthRegistrarAddress(chain: ChainId): Address {
  switch (chain) {
    case ETHEREUM:
      return '0x283af0b28c62c092c9727f1ee09c02ca627eb7f5';
    case SEPOLIA:
      return '0x7e02892cfc2bfd53a75275451d73cf620e793fc0';
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
