const abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_defaultAdmin',
        type: 'address',
      },
      {
        internalType: 'contract IEntryPoint',
        name: '_entrypoint',
        type: 'address',
      },
      {
        components: [
          {
            components: [
              {
                internalType: 'string',
                name: 'name',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'metadataURI',
                type: 'string',
              },
              {
                internalType: 'address',
                name: 'implementation',
                type: 'address',
              },
            ],
            internalType: 'struct IExtension.ExtensionMetadata',
            name: 'metadata',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'bytes4',
                name: 'functionSelector',
                type: 'bytes4',
              },
              {
                internalType: 'string',
                name: 'functionSignature',
                type: 'string',
              },
            ],
            internalType: 'struct IExtension.ExtensionFunction[]',
            name: 'functions',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct IExtension.Extension[]',
        name: '_defaultExtensions',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_size',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_start',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_end',
        type: 'uint256',
      },
    ],
    name: 'InvalidCodeAtRange',
    type: 'error',
  },
  {
    inputs: [],
    name: 'WriteError',
    type: 'error',
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
        name: 'accountAdmin',
        type: 'address',
      },
    ],
    name: 'AccountCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'prevURI',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'newURI',
        type: 'string',
      },
    ],
    name: 'ContractURIUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address',
      },
      {
        components: [
          {
            components: [
              {
                internalType: 'string',
                name: 'name',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'metadataURI',
                type: 'string',
              },
              {
                internalType: 'address',
                name: 'implementation',
                type: 'address',
              },
            ],
            internalType: 'struct IExtension.ExtensionMetadata',
            name: 'metadata',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'bytes4',
                name: 'functionSelector',
                type: 'bytes4',
              },
              {
                internalType: 'string',
                name: 'functionSignature',
                type: 'string',
              },
            ],
            internalType: 'struct IExtension.ExtensionFunction[]',
            name: 'functions',
            type: 'tuple[]',
          },
        ],
        indexed: false,
        internalType: 'struct IExtension.Extension',
        name: 'extension',
        type: 'tuple',
      },
    ],
    name: 'ExtensionAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        components: [
          {
            components: [
              {
                internalType: 'string',
                name: 'name',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'metadataURI',
                type: 'string',
              },
              {
                internalType: 'address',
                name: 'implementation',
                type: 'address',
              },
            ],
            internalType: 'struct IExtension.ExtensionMetadata',
            name: 'metadata',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'bytes4',
                name: 'functionSelector',
                type: 'bytes4',
              },
              {
                internalType: 'string',
                name: 'functionSignature',
                type: 'string',
              },
            ],
            internalType: 'struct IExtension.ExtensionFunction[]',
            name: 'functions',
            type: 'tuple[]',
          },
        ],
        indexed: false,
        internalType: 'struct IExtension.Extension',
        name: 'extension',
        type: 'tuple',
      },
    ],
    name: 'ExtensionRemoved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address',
      },
      {
        components: [
          {
            components: [
              {
                internalType: 'string',
                name: 'name',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'metadataURI',
                type: 'string',
              },
              {
                internalType: 'address',
                name: 'implementation',
                type: 'address',
              },
            ],
            internalType: 'struct IExtension.ExtensionMetadata',
            name: 'metadata',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'bytes4',
                name: 'functionSelector',
                type: 'bytes4',
              },
              {
                internalType: 'string',
                name: 'functionSignature',
                type: 'string',
              },
            ],
            internalType: 'struct IExtension.ExtensionFunction[]',
            name: 'functions',
            type: 'tuple[]',
          },
        ],
        indexed: false,
        internalType: 'struct IExtension.Extension',
        name: 'extension',
        type: 'tuple',
      },
    ],
    name: 'ExtensionReplaced',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'bytes4',
        name: 'functionSelector',
        type: 'bytes4',
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'metadataURI',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'implementation',
            type: 'address',
          },
        ],
        indexed: false,
        internalType: 'struct IExtension.ExtensionMetadata',
        name: 'extMetadata',
        type: 'tuple',
      },
    ],
    name: 'FunctionDisabled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'bytes4',
        name: 'functionSelector',
        type: 'bytes4',
      },
      {
        components: [
          {
            internalType: 'bytes4',
            name: 'functionSelector',
            type: 'bytes4',
          },
          {
            internalType: 'string',
            name: 'functionSignature',
            type: 'string',
          },
        ],
        indexed: false,
        internalType: 'struct IExtension.ExtensionFunction',
        name: 'extFunction',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'metadataURI',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'implementation',
            type: 'address',
          },
        ],
        indexed: false,
        internalType: 'struct IExtension.ExtensionMetadata',
        name: 'extMetadata',
        type: 'tuple',
      },
    ],
    name: 'FunctionEnabled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'previousAdminRole',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'newAdminRole',
        type: 'bytes32',
      },
    ],
    name: 'RoleAdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleGranted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'RoleRevoked',
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
        name: 'signer',
        type: 'address',
      },
    ],
    name: 'SignerAdded',
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
        name: 'signer',
        type: 'address',
      },
    ],
    name: 'SignerRemoved',
    type: 'event',
  },
  {
    stateMutability: 'payable',
    type: 'fallback',
  },
  {
    inputs: [],
    name: 'DEFAULT_ADMIN_ROLE',
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
    inputs: [
      {
        internalType: 'string',
        name: '_extensionName',
        type: 'string',
      },
      {
        internalType: 'bytes4',
        name: '_functionSelector',
        type: 'bytes4',
      },
    ],
    name: '_disableFunctionInExtension',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'accountImplementation',
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
        components: [
          {
            components: [
              {
                internalType: 'string',
                name: 'name',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'metadataURI',
                type: 'string',
              },
              {
                internalType: 'address',
                name: 'implementation',
                type: 'address',
              },
            ],
            internalType: 'struct IExtension.ExtensionMetadata',
            name: 'metadata',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'bytes4',
                name: 'functionSelector',
                type: 'bytes4',
              },
              {
                internalType: 'string',
                name: 'functionSignature',
                type: 'string',
              },
            ],
            internalType: 'struct IExtension.ExtensionFunction[]',
            name: 'functions',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct IExtension.Extension',
        name: '_extension',
        type: 'tuple',
      },
    ],
    name: 'addExtension',
    outputs: [],
    stateMutability: 'nonpayable',
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
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_admin',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'createAccount',
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
    name: 'defaultExtensions',
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
        internalType: 'string',
        name: '_extensionName',
        type: 'string',
      },
      {
        internalType: 'bytes4',
        name: '_functionSelector',
        type: 'bytes4',
      },
    ],
    name: 'disableFunctionInExtension',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_extensionName',
        type: 'string',
      },
      {
        components: [
          {
            internalType: 'bytes4',
            name: 'functionSelector',
            type: 'bytes4',
          },
          {
            internalType: 'string',
            name: 'functionSignature',
            type: 'string',
          },
        ],
        internalType: 'struct IExtension.ExtensionFunction',
        name: '_function',
        type: 'tuple',
      },
    ],
    name: 'enableFunctionInExtension',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'entrypoint',
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
        internalType: 'uint256',
        name: '_start',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_end',
        type: 'uint256',
      },
    ],
    name: 'getAccounts',
    outputs: [
      {
        internalType: 'address[]',
        name: 'accounts',
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
        name: 'signer',
        type: 'address',
      },
    ],
    name: 'getAccountsOfSigner',
    outputs: [
      {
        internalType: 'address[]',
        name: 'accounts',
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
        name: '_adminSigner',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: '_data',
        type: 'bytes',
      },
    ],
    name: 'getAddress',
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
    name: 'getAllAccounts',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllExtensions',
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'string',
                name: 'name',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'metadataURI',
                type: 'string',
              },
              {
                internalType: 'address',
                name: 'implementation',
                type: 'address',
              },
            ],
            internalType: 'struct IExtension.ExtensionMetadata',
            name: 'metadata',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'bytes4',
                name: 'functionSelector',
                type: 'bytes4',
              },
              {
                internalType: 'string',
                name: 'functionSignature',
                type: 'string',
              },
            ],
            internalType: 'struct IExtension.ExtensionFunction[]',
            name: 'functions',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct IExtension.Extension[]',
        name: 'allExtensions',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'extensionName',
        type: 'string',
      },
    ],
    name: 'getExtension',
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'string',
                name: 'name',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'metadataURI',
                type: 'string',
              },
              {
                internalType: 'address',
                name: 'implementation',
                type: 'address',
              },
            ],
            internalType: 'struct IExtension.ExtensionMetadata',
            name: 'metadata',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'bytes4',
                name: 'functionSelector',
                type: 'bytes4',
              },
              {
                internalType: 'string',
                name: 'functionSignature',
                type: 'string',
              },
            ],
            internalType: 'struct IExtension.ExtensionFunction[]',
            name: 'functions',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct IExtension.Extension',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: '_functionSelector',
        type: 'bytes4',
      },
    ],
    name: 'getImplementationForFunction',
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
        internalType: 'bytes4',
        name: 'functionSelector',
        type: 'bytes4',
      },
    ],
    name: 'getMetadataForFunction',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'name',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'metadataURI',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'implementation',
            type: 'address',
          },
        ],
        internalType: 'struct IExtension.ExtensionMetadata',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
    ],
    name: 'getRoleAdmin',
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
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'getRoleMember',
    outputs: [
      {
        internalType: 'address',
        name: 'member',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
    ],
    name: 'getRoleMemberCount',
    outputs: [
      {
        internalType: 'uint256',
        name: 'count',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'grantRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'hasRole',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'hasRoleWithSwitch',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_account',
        type: 'address',
      },
    ],
    name: 'isRegistered',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes[]',
        name: 'data',
        type: 'bytes[]',
      },
    ],
    name: 'multicall',
    outputs: [
      {
        internalType: 'bytes[]',
        name: 'results',
        type: 'bytes[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '_salt',
        type: 'bytes32',
      },
    ],
    name: 'onRegister',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_signer',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: '_salt',
        type: 'bytes32',
      },
    ],
    name: 'onSignerAdded',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_signer',
        type: 'address',
      },
      {
        internalType: 'bytes32',
        name: '_salt',
        type: 'bytes32',
      },
    ],
    name: 'onSignerRemoved',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_extensionName',
        type: 'string',
      },
    ],
    name: 'removeExtension',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'renounceRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'string',
                name: 'name',
                type: 'string',
              },
              {
                internalType: 'string',
                name: 'metadataURI',
                type: 'string',
              },
              {
                internalType: 'address',
                name: 'implementation',
                type: 'address',
              },
            ],
            internalType: 'struct IExtension.ExtensionMetadata',
            name: 'metadata',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'bytes4',
                name: 'functionSelector',
                type: 'bytes4',
              },
              {
                internalType: 'string',
                name: 'functionSignature',
                type: 'string',
              },
            ],
            internalType: 'struct IExtension.ExtensionFunction[]',
            name: 'functions',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct IExtension.Extension',
        name: '_extension',
        type: 'tuple',
      },
    ],
    name: 'replaceExtension',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'revokeRole',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '_uri',
        type: 'string',
      },
    ],
    name: 'setContractURI',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalAccounts',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export default abi;
