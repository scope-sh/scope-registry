import { Address } from 'viem';

import { ChainLabelMap } from '@/labels/base.js';

const ENTRYPOINT_0_6_0_ADDRESS = '0x5ff137d4b0fdcd49dca30c7cf57e578a026d2789';
const ENTRYPOINT_0_7_0_ADDRESS = '0x0000000071727de22e5e9d8baf0edac6f37da032';

function getEntryPoint0_6_0Accounts(
  labels: ChainLabelMap,
  factory: Address,
): Address[] {
  return Object.entries(labels).reduce((acc, val) => {
    const [addressString, labels] = val;
    const address = addressString as Address;
    const entryPointAccountLabel = labels.find(
      (label) => label.type === 'entry-point-v0.6.0-account',
    );
    if (!entryPointAccountLabel) {
      return acc;
    }
    const metadata = entryPointAccountLabel.metadata as { factory: Address };
    if (metadata.factory === factory) {
      acc.push(address);
    }
    return acc;
  }, [] as Address[]);
}

function getEntryPoint0_7_0Accounts(
  labels: ChainLabelMap,
  factory: Address,
): Address[] {
  return Object.entries(labels).reduce((acc, val) => {
    const [addressString, labels] = val;
    const address = addressString as Address;
    const entryPointAccountLabel = labels.find(
      (label) => label.type === 'entry-point-v0.7.0-account',
    );
    if (!entryPointAccountLabel) {
      return acc;
    }
    const metadata = entryPointAccountLabel.metadata as { factory: Address };
    if (metadata.factory === factory) {
      acc.push(address);
    }
    return acc;
  }, [] as Address[]);
}

export {
  ENTRYPOINT_0_6_0_ADDRESS,
  ENTRYPOINT_0_7_0_ADDRESS,
  getEntryPoint0_6_0Accounts,
  getEntryPoint0_7_0Accounts,
};
