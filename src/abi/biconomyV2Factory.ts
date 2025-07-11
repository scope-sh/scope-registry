const abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_basicImplementation',
        type: 'address',
      },
      { internalType: 'address', name: '_newOwner', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'initialAuthModule',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'AccountCreation',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'initialAuthModule',
        type: 'address',
      },
    ],
    name: 'AccountCreationWithoutIndex',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [],
    name: 'accountCreationCode',
    outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'epAddress', type: 'address' },
      { internalType: 'uint32', name: 'unstakeDelaySec', type: 'uint32' },
    ],
    name: 'addStake',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'basicImplementation',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'moduleSetupContract', type: 'address' },
      { internalType: 'bytes', name: 'moduleSetupData', type: 'bytes' },
    ],
    name: 'deployAccount',
    outputs: [{ internalType: 'address', name: 'proxy', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'moduleSetupContract', type: 'address' },
      { internalType: 'bytes', name: 'moduleSetupData', type: 'bytes' },
      { internalType: 'uint256', name: 'index', type: 'uint256' },
    ],
    name: 'deployCounterFactualAccount',
    outputs: [{ internalType: 'address', name: 'proxy', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'moduleSetupContract', type: 'address' },
      { internalType: 'bytes', name: 'moduleSetupData', type: 'bytes' },
      { internalType: 'uint256', name: 'index', type: 'uint256' },
    ],
    name: 'getAddressForCounterFactualAccount',
    outputs: [{ internalType: 'address', name: '_account', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'minimalHandler',
    outputs: [
      {
        internalType: 'contract DefaultCallbackHandler',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'epAddress', type: 'address' }],
    name: 'unlockStake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'epAddress', type: 'address' },
      {
        internalType: 'address payable',
        name: 'withdrawAddress',
        type: 'address',
      },
    ],
    name: 'withdrawStake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export default abi;
