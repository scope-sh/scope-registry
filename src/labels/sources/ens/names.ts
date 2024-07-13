import { Address, Hex, decodeEventLog, namehash } from 'viem';

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
import { ChainId, ETHEREUM, SEPOLIA } from '@/utils/chains';
import { getLogs } from '@/utils/fetching';

const ADDRESS_ETH_REGISTRAR = '0x253553366da8546fc250f225fe3d25d0c782303b';
const ADDRESS_PUBLIC_RESOLVER = '0x231b0ee14048e9dccd1d247744d114a4eb5e8e63';
const ADDRESS_LEGACY_ETH_REGISTRAR =
  '0x283af0b28c62c092c9727f1ee09c02ca627eb7f5';
const ADDRESS_LEGACY_PUBLIC_RESOLVER =
  '0x4976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41';
const ADDRESS_REVERSE_REGISTRAR = '0xa58e81fe9b61b5c3fe2afd33cf304c454abfc7cb';

const TOPIC_NAME_RENEWED =
  '0x3da24c024582931cfaf8267d8ed24d13a82a8068d5bd337d30ec45cea4e506ae';
const TOPIC_NAME_CHANGED =
  '0xb7d29e911041e8d9b843369e890bcb72c9388692ba48b65ac54e7214c4c348f7';
const TOPIC_ADDR_CHANGED =
  '0x52d7d861f09ab3d26239d492e8968629f95e9e318cf0b73bfddc441522a15fd2';
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
        days: 1,
      },
      fetchType: 'full',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    if (chain !== ETHEREUM && chain !== SEPOLIA) {
      return {};
    }
    const reverseClaimMap = await this.#getReverseClaimMap(chain);
    const labelHashMap = await this.#getLabelHashMap(chain);
    const addressMap = await this.#getAddressMap(chain);
    const avatarMap = await this.#getAvatarMap(chain);
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
      const address = addressMap[node];
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

  async #getLabelHashMap(chain: ChainId): Promise<Record<Hex, string>> {
    const legacyNameRegistrationLogs = await getLogs(
      this.getInfo(),
      chain,
      ADDRESS_LEGACY_ETH_REGISTRAR,
      TOPIC_NAME_REGISTERED_LEGACY,
    );
    const legacyNameRenewalLogs = await getLogs(
      this.getInfo(),
      chain,
      ADDRESS_LEGACY_ETH_REGISTRAR,
      TOPIC_NAME_RENEWED,
    );
    const nameRegistrationLogs = await getLogs(
      this.getInfo(),
      chain,
      ADDRESS_ETH_REGISTRAR,
      TOPIC_NAME_REGISTERED,
    );
    const nameRenewalLogs = await getLogs(
      this.getInfo(),
      chain,
      ADDRESS_ETH_REGISTRAR,
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

  async #getReverseClaimMap(chain: ChainId): Promise<Record<Address, string>> {
    const reverseClaimedLogs = await getLogs(
      this.getInfo(),
      chain,
      ADDRESS_REVERSE_REGISTRAR,
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
      chain,
      ADDRESS_LEGACY_PUBLIC_RESOLVER,
      TOPIC_NAME_CHANGED,
    );
    const nameChangedLogs = await getLogs(
      this.getInfo(),
      chain,
      ADDRESS_PUBLIC_RESOLVER,
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

  async #getAddressMap(chain: ChainId): Promise<Record<Hex, Address>> {
    // Process "AddrChanged" events to get actively set addresses
    const legacyAddrChangedLogs = await getLogs(
      this.getInfo(),
      chain,
      ADDRESS_LEGACY_PUBLIC_RESOLVER,
      TOPIC_ADDR_CHANGED,
    );
    const addrChangedLogs = await getLogs(
      this.getInfo(),
      chain,
      ADDRESS_PUBLIC_RESOLVER,
      TOPIC_ADDR_CHANGED,
    );
    const legacyAddressChanges = legacyAddrChangedLogs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: ensLegacyPublicResolverAbi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'AddrChanged') {
        throw new Error('Unexpected event name');
      }
      return {
        node: decodedLog.args.node,
        address: decodedLog.args.a.toLowerCase() as Address,
      };
    });
    const addressChanges = addrChangedLogs.map((log) => {
      const decodedLog = decodeEventLog({
        abi: ensPublicResolverAbi,
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decodedLog.eventName !== 'AddrChanged') {
        throw new Error('Unexpected event name');
      }
      return {
        node: decodedLog.args.node,
        address: decodedLog.args.a.toLowerCase() as Address,
      };
    });
    const map: Record<Hex, Address> = Object.fromEntries(
      legacyAddressChanges
        .concat(addressChanges)
        .map((change) => [change.node, change.address]),
    );
    return map;
  }

  async #getAvatarMap(chain: ChainId): Promise<Record<Hex, string>> {
    // Process "TextChanged" events to get avatars
    const textChangedLogs = await getLogs(
      this.getInfo(),
      chain,
      ADDRESS_PUBLIC_RESOLVER,
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

    const map: Record<Hex, string> = Object.fromEntries(
      textChanges.map((change) => [change.node, change.value]),
    );

    return map;
  }
}

export default Source;
