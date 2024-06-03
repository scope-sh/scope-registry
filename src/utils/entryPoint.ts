import { Address, Hex, decodeEventLog } from 'viem';

import entryPointV0_6_0Abi from '@/abi/entryPointV0_6_0.js';
import entryPointV0_7_0Abi from '@/abi/entryPointV0_7_0.js';

import { Event } from './fetching.js';

const ENTRYPOINT_0_6_0_ADDRESS = '0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789';
const ENTRYPOINT_0_7_0_ADDRESS = '0x0000000071727de22e5e9d8baf0edac6f37da032';

function getEntryPoint0_6_0Predicate(
  factory: Address,
): (event: Event) => boolean {
  return (event) => {
    const decodedEvent = decodeEventLog({
      abi: entryPointV0_6_0Abi,
      data: event.data,
      topics: event.topics as [Hex, ...Hex[]],
    });
    if (decodedEvent.eventName !== 'AccountDeployed') {
      return false;
    }
    return decodedEvent.args.factory.toLowerCase() === factory;
  };
}

function getEntryPoint0_7_0Predicate(
  factory: Address,
): (event: Event) => boolean {
  return (event) => {
    const decodedEvent = decodeEventLog({
      abi: entryPointV0_7_0Abi,
      data: event.data,
      topics: event.topics as [Hex, ...Hex[]],
    });
    if (decodedEvent.eventName !== 'AccountDeployed') {
      return false;
    }
    return decodedEvent.args.factory.toLowerCase() === factory;
  };
}

export {
  ENTRYPOINT_0_6_0_ADDRESS,
  ENTRYPOINT_0_7_0_ADDRESS,
  getEntryPoint0_6_0Predicate,
  getEntryPoint0_7_0Predicate,
};
