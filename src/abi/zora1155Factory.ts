const abi = [
  {
    inputs: [
      {
        internalType: 'contract IZoraCreator1155',
        name: '_zora1155Impl',
        type: 'address',
      },
      {
        internalType: 'contract IMinter1155',
        name: '_merkleMinter',
        type: 'address',
      },
      {
        internalType: 'contract IMinter1155',
        name: '_fixedPriceMinter',
        type: 'address',
      },
      {
        internalType: 'contract IMinter1155',
        name: '_redeemMinterFactory',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'ADDRESS_DELEGATECALL_TO_NON_CONTRACT',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ADDRESS_LOW_LEVEL_CALL_FAILED',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Constructor_ImplCannotBeZero',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ERC1967_NEW_IMPL_NOT_CONTRACT',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ERC1967_NEW_IMPL_NOT_UUPS',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ERC1967_UNSUPPORTED_PROXIABLEUUID',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'expectedContractAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'calculcatedContractAddress',
        type: 'address',
      },
    ],
    name: 'ExpectedContractAddressDoesNotMatchCalculatedContractAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'FUNCTION_MUST_BE_CALLED_THROUGH_ACTIVE_PROXY',
    type: 'error',
  },
  {
    inputs: [],
    name: 'FUNCTION_MUST_BE_CALLED_THROUGH_DELEGATECALL',
    type: 'error',
  },
  {
    inputs: [],
    name: 'INITIALIZABLE_CONTRACT_ALREADY_INITIALIZED',
    type: 'error',
  },
  {
    inputs: [],
    name: 'INITIALIZABLE_CONTRACT_IS_NOT_INITIALIZING',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ONLY_OWNER',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ONLY_PENDING_OWNER',
    type: 'error',
  },
  {
    inputs: [],
    name: 'OWNER_CANNOT_BE_ZERO_ADDRESS',
    type: 'error',
  },
  {
    inputs: [],
    name: 'UUPS_UPGRADEABLE_MUST_NOT_BE_CALLED_THROUGH_DELEGATECALL',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'expected',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'actual',
        type: 'string',
      },
    ],
    name: 'UpgradeToMismatchedContractName',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'previousAdmin',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newAdmin',
        type: 'address',
      },
    ],
    name: 'AdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'beacon',
        type: 'address',
      },
    ],
    name: 'BeaconUpgraded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'calculatedContractAddress',
        type: 'address',
      },
    ],
    name: 'ContractAlreadyExistsSkippingDeploy',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'FactorySetup',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'canceledOwner',
        type: 'address',
      },
    ],
    name: 'OwnerCanceled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'pendingOwner',
        type: 'address',
      },
    ],
    name: 'OwnerPending',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'prevOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnerUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'newContract',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'creator',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'defaultAdmin',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'contractURI',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        components: [
          {
            internalType: 'uint32',
            name: 'royaltyMintSchedule',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'royaltyBPS',
            type: 'uint32',
          },
          {
            internalType: 'address',
            name: 'royaltyRecipient',
            type: 'address',
          },
        ],
        indexed: false,
        internalType: 'struct ICreatorRoyaltiesControl.RoyaltyConfiguration',
        name: 'defaultRoyaltyConfiguration',
        type: 'tuple',
      },
    ],
    name: 'SetupNewContract',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address',
      },
    ],
    name: 'Upgraded',
    type: 'event',
  },
  {
    inputs: [],
    name: 'acceptOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'cancelOwnershipTransfer',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'contractName',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'contractURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'contractVersion',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'newContractURI',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        components: [
          {
            internalType: 'uint32',
            name: 'royaltyMintSchedule',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'royaltyBPS',
            type: 'uint32',
          },
          {
            internalType: 'address',
            name: 'royaltyRecipient',
            type: 'address',
          },
        ],
        internalType: 'struct ICreatorRoyaltiesControl.RoyaltyConfiguration',
        name: 'defaultRoyaltyConfiguration',
        type: 'tuple',
      },
      {
        internalType: 'address payable',
        name: 'defaultAdmin',
        type: 'address',
      },
      {
        internalType: 'bytes[]',
        name: 'setupActions',
        type: 'bytes[]',
      },
    ],
    name: 'createContract',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'newContractURI',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        components: [
          {
            internalType: 'uint32',
            name: 'royaltyMintSchedule',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'royaltyBPS',
            type: 'uint32',
          },
          {
            internalType: 'address',
            name: 'royaltyRecipient',
            type: 'address',
          },
        ],
        internalType: 'struct ICreatorRoyaltiesControl.RoyaltyConfiguration',
        name: 'defaultRoyaltyConfiguration',
        type: 'tuple',
      },
      {
        internalType: 'address payable',
        name: 'defaultAdmin',
        type: 'address',
      },
      {
        internalType: 'bytes[]',
        name: 'setupActions',
        type: 'bytes[]',
      },
    ],
    name: 'createContractDeterministic',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'defaultMinters',
    outputs: [
      {
        internalType: 'contract IMinter1155[]',
        name: 'minters',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'msgSender',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'newContractURI',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'address',
        name: 'contractAdmin',
        type: 'address',
      },
    ],
    name: 'deterministicContractAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'msgSender',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'newContractURI',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'address',
        name: 'contractAdmin',
        type: 'address',
      },
      {
        internalType: 'bytes[]',
        name: 'setupActions',
        type: 'bytes[]',
      },
    ],
    name: 'deterministicContractAddressWithSetupActions',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'fixedPriceMinter',
    outputs: [
      {
        internalType: 'contract IMinter1155',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'expectedContractAddress',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'newContractURI',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        components: [
          {
            internalType: 'uint32',
            name: 'royaltyMintSchedule',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'royaltyBPS',
            type: 'uint32',
          },
          {
            internalType: 'address',
            name: 'royaltyRecipient',
            type: 'address',
          },
        ],
        internalType: 'struct ICreatorRoyaltiesControl.RoyaltyConfiguration',
        name: 'defaultRoyaltyConfiguration',
        type: 'tuple',
      },
      {
        internalType: 'address payable',
        name: 'defaultAdmin',
        type: 'address',
      },
      {
        internalType: 'bytes[]',
        name: 'setupActions',
        type: 'bytes[]',
      },
    ],
    name: 'getOrCreateContractDeterministic',
    outputs: [
      {
        internalType: 'address',
        name: 'calculatedContractAddress',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'implementation',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_initialOwner',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'merkleMinter',
    outputs: [
      {
        internalType: 'contract IMinter1155',
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
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pendingOwner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'proxiableUUID',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'redeemMinterFactory',
    outputs: [
      {
        internalType: 'contract IMinter1155',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'resignOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_newOwner',
        type: 'address',
      },
    ],
    name: 'safeTransferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address',
      },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'zora1155Impl',
    outputs: [
      {
        internalType: 'contract IZoraCreator1155',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export default abi;
