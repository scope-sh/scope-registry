import { Address, Hex, decodeEventLog, namehash } from 'viem';

import ensEthRegistrarControllerAbi from '@/abi/ensEthRegistrarController';
import ensLegacyEthRegistrarControllerAbi from '@/abi/ensLegacyEthRegistrarController';
import ensLegacyPublicResolverAbi from '@/abi/ensLegacyPublicResolver';
import ensPublicResolverAbi from '@/abi/ensPublicResolver';
import {
  Source as BaseSource,
  ChainSingleLabelMap,
  Label,
} from '@/labels/base.js';
import { ChainId, ETHEREUM, SEPOLIA } from '@/utils/chains';
import { getEvents } from '@/utils/fetching';

const ADDRESS_ETH_REGISTRAR = '0x253553366da8546fc250f225fe3d25d0c782303b';
const ADDRESS_PUBLIC_RESOLVER = '0x231b0ee14048e9dccd1d247744d114a4eb5e8e63';
const ADDRESS_LEGACY_ETH_REGISTRAR =
  '0x283af0b28c62c092c9727f1ee09c02ca627eb7f5';
const ADDRESS_LEGACY_PUBLIC_RESOLVER =
  '0x4976fb03c32e5b8cfe2b6ccb31c09ba78ebaba41';

const TOPIC_NAME_RENEWED =
  '0x3da24c024582931cfaf8267d8ed24d13a82a8068d5bd337d30ec45cea4e506ae';
const TOPIC_ADDR_CHANGED =
  '0x52d7d861f09ab3d26239d492e8968629f95e9e318cf0b73bfddc441522a15fd2';
const TOPIC_TEXT_CHANGED =
  '0x448bc014f1536726cf8d54ff3d6481ed3cbc683c2591ca204274009afa09b1a1';
const TOPIC_NAME_REGISTERED =
  '0x69e37f151eb98a09618ddaa80c8cfaf1ce5996867c489f45b555b412271ebf27';
const TOPIC_NAME_REGISTERED_LEGACY =
  '0xca6abbe9d7f11422cb6ca7629fbf6fe9efb1c621f71ce8f02b9f2a230097404f';

class Source extends BaseSource {
  getName(): string {
    return 'ENS Names';
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    if (chain !== ETHEREUM && chain !== SEPOLIA) {
      return {};
    }
    const labelHashMap = await this.#getLabelHashMap(chain);
    const addressMap = await this.#getAddressMap(chain);
    const avatarMap = await this.#getAvatarMap(chain);
    const labels: ChainSingleLabelMap = {};
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
        iconUrl: avatar,
      };
      labels[address] = label;
    }
    return labels;
  }

  async #getLabelHashMap(chain: ChainId): Promise<Record<Hex, string>> {
    const legacyNameRegistrationEvents = await getEvents(
      chain,
      ADDRESS_LEGACY_ETH_REGISTRAR,
      TOPIC_NAME_REGISTERED_LEGACY,
    );
    const legacyNameRenewalEvents = await getEvents(
      chain,
      ADDRESS_LEGACY_ETH_REGISTRAR,
      TOPIC_NAME_RENEWED,
    );
    const nameRegistrationEvents = await getEvents(
      chain,
      ADDRESS_ETH_REGISTRAR,
      TOPIC_NAME_REGISTERED,
    );
    const nameRenewalEvents = await getEvents(
      chain,
      ADDRESS_ETH_REGISTRAR,
      TOPIC_NAME_RENEWED,
    );

    const legacyNameRegistrations = legacyNameRegistrationEvents
      .map((event) => {
        const decodedEvent = decodeEventLog({
          abi: ensLegacyEthRegistrarControllerAbi,
          data: event.data,
          topics: event.topics as [Hex, ...Hex[]],
        });
        if (decodedEvent.eventName !== 'NameRegistered') {
          throw new Error('Unexpected event name');
        }
        return {
          name: decodedEvent.args.name,
          expires: decodedEvent.args.expires,
        };
      })
      .filter((registration) => registration.expires > Date.now() / 1000)
      .map((registration) => registration.name);
    const legacyNameRenewals = legacyNameRenewalEvents
      .map((event) => {
        const decodedEvent = decodeEventLog({
          abi: ensLegacyEthRegistrarControllerAbi,
          data: event.data,
          topics: event.topics as [Hex, ...Hex[]],
        });
        if (decodedEvent.eventName !== 'NameRenewed') {
          throw new Error('Unexpected event name');
        }
        return {
          name: decodedEvent.args.name,
          expires: decodedEvent.args.expires,
        };
      })
      .filter((renewal) => renewal.expires > Date.now() / 1000)
      .map((renewal) => renewal.name);
    const nameRegistrations = nameRegistrationEvents
      .map((event) => {
        const decodedEvent = decodeEventLog({
          abi: ensEthRegistrarControllerAbi,
          data: event.data,
          topics: event.topics as [Hex, ...Hex[]],
        });
        if (decodedEvent.eventName !== 'NameRegistered') {
          throw new Error('Unexpected event name');
        }
        return {
          name: decodedEvent.args.name,
          expires: decodedEvent.args.expires,
        };
      })
      .filter((registration) => registration.expires > Date.now() / 1000)
      .map((registration) => registration.name);
    const nameRenewals = nameRenewalEvents
      .map((event) => {
        const decodedEvent = decodeEventLog({
          abi: ensEthRegistrarControllerAbi,
          data: event.data,
          topics: event.topics as [Hex, ...Hex[]],
        });
        if (decodedEvent.eventName !== 'NameRenewed') {
          throw new Error('Unexpected event name');
        }
        return {
          name: decodedEvent.args.name,
          expires: decodedEvent.args.expires,
        };
      })
      .filter((renewal) => renewal.expires > Date.now() / 1000)
      .map((renewal) => renewal.name);
    const map: Record<Hex, string> = Object.fromEntries(
      legacyNameRegistrations
        .concat(legacyNameRenewals)
        .concat(nameRegistrations)
        .concat(nameRenewals)
        .map((name) => {
          const fullName = `${name}.eth`;
          return [namehash(fullName), fullName];
        }),
    );
    return map;
  }

  async #getAddressMap(chain: ChainId): Promise<Record<Hex, Address>> {
    // Process "AddrChanged" events to get actively set addresses
    const legacyAddrChangedEvents = await getEvents(
      chain,
      ADDRESS_LEGACY_PUBLIC_RESOLVER,
      TOPIC_ADDR_CHANGED,
    );
    const addrChangedEvents = await getEvents(
      chain,
      ADDRESS_PUBLIC_RESOLVER,
      TOPIC_ADDR_CHANGED,
    );
    const legacyAddressChanges = legacyAddrChangedEvents.map((event) => {
      const decodedEvent = decodeEventLog({
        abi: ensLegacyPublicResolverAbi,
        data: event.data,
        topics: event.topics as [Hex, ...Hex[]],
      });
      if (decodedEvent.eventName !== 'AddrChanged') {
        throw new Error('Unexpected event name');
      }
      return {
        node: decodedEvent.args.node,
        address: decodedEvent.args.a.toLowerCase() as Address,
      };
    });
    const addressChanges = addrChangedEvents.map((event) => {
      const decodedEvent = decodeEventLog({
        abi: ensPublicResolverAbi,
        data: event.data,
        topics: event.topics as [Hex, ...Hex[]],
      });
      if (decodedEvent.eventName !== 'AddrChanged') {
        throw new Error('Unexpected event name');
      }
      return {
        node: decodedEvent.args.node,
        address: decodedEvent.args.a.toLowerCase() as Address,
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
    const textChangedEvents = await getEvents(
      chain,
      ADDRESS_PUBLIC_RESOLVER,
      TOPIC_TEXT_CHANGED,
    );
    const textChanges = textChangedEvents
      .map((event) => {
        const decodedEvent = decodeEventLog({
          abi: ensPublicResolverAbi,
          data: event.data,
          topics: event.topics as [Hex, ...Hex[]],
        });
        if (decodedEvent.eventName !== 'TextChanged') {
          throw new Error('Unexpected event name');
        }
        return {
          node: decodedEvent.args.node,
          key: decodedEvent.args.key,
          value: decodedEvent.args.value,
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
