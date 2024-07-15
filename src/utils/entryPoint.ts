import { Address, decodeEventLog, encodeEventTopics, Hex } from 'viem';

import entryPointV0_6_0Abi from '@/abi/entryPointV0_6_0.js';
import entryPointV0_7_0Abi from '@/abi/entryPointV0_7_0.js';
import { SourceInfo } from '@/labels/base.js';

import { ChainId } from './chains';
import { getLogs } from './fetching';

const ENTRYPOINT_0_6_0_ADDRESS = '0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789';
const ENTRYPOINT_0_7_0_ADDRESS = '0x0000000071727de22e5e9d8baf0edac6f37da032';

interface Account {
  sender: Address;
  factory: Address;
}

async function getEntryPoint0_6_0Accounts(
  sourceInfo: SourceInfo,
  chain: ChainId,
  factory?: Address,
): Promise<Address[]> {
  const topics = encodeEventTopics({
    abi: entryPointV0_6_0Abi,
    eventName: 'AccountDeployed',
  });
  const topic = topics[0];
  if (!topic) {
    return [];
  }
  const logs = await getLogs(
    sourceInfo,
    chain,
    ENTRYPOINT_0_6_0_ADDRESS,
    topic,
  );

  const accounts: Account[] = logs.map((log) => {
    const decodedLog = decodeEventLog({
      abi: entryPointV0_6_0Abi,
      data: log.data,
      topics: log.topics as [Hex, ...Hex[]],
    });
    if (decodedLog.eventName !== 'AccountDeployed') {
      throw new Error('Invalid event name');
    }
    return {
      sender: decodedLog.args.sender.toLowerCase() as Address,
      factory: decodedLog.args.factory.toLowerCase() as Address,
    };
  });

  return accounts
    .filter((account) => !factory || account.factory === factory)
    .map((account) => account.sender);
}

async function getEntryPoint0_7_0Accounts(
  sourceInfo: SourceInfo,
  chain: ChainId,
  factory?: Address,
): Promise<Address[]> {
  const topics = encodeEventTopics({
    abi: entryPointV0_7_0Abi,
    eventName: 'AccountDeployed',
  });
  const topic = topics[0];
  if (!topic) {
    return [];
  }
  const logs = await getLogs(
    sourceInfo,
    chain,
    ENTRYPOINT_0_7_0_ADDRESS,
    topic,
  );

  const accounts: Account[] = logs.map((log) => {
    const decodedLog = decodeEventLog({
      abi: entryPointV0_7_0Abi,
      data: log.data,
      topics: log.topics as [Hex, ...Hex[]],
    });
    if (decodedLog.eventName !== 'AccountDeployed') {
      throw new Error('Invalid event name');
    }
    return {
      sender: decodedLog.args.sender.toLowerCase() as Address,
      factory: decodedLog.args.factory.toLowerCase() as Address,
    };
  });

  return accounts
    .filter((account) => !factory || account.factory === factory)
    .map((account) => account.sender);
}

export {
  ENTRYPOINT_0_6_0_ADDRESS,
  ENTRYPOINT_0_7_0_ADDRESS,
  getEntryPoint0_6_0Accounts,
  getEntryPoint0_7_0Accounts,
};
