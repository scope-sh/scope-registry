const abi = [
  { inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
  { inputs: [], name: 'AccessDenied', type: 'error' },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'AddressInsufficientBalance',
    type: 'error',
  },
  { inputs: [], name: 'AlreadyExists', type: 'error' },
  {
    inputs: [{ internalType: 'address', name: 'module', type: 'address' }],
    name: 'AlreadyRegistered',
    type: 'error',
  },
  { inputs: [], name: 'AlreadyRevoked', type: 'error' },
  { inputs: [], name: 'AlreadyRevokedOffchain', type: 'error' },
  { inputs: [], name: 'AlreadyTimestamped', type: 'error' },
  { inputs: [], name: 'AttestationNotFound', type: 'error' },
  { inputs: [], name: 'FailedInnerCall', type: 'error' },
  {
    inputs: [
      { internalType: 'bytes32', name: 'sourceCodeHash', type: 'bytes32' },
      { internalType: 'bytes32', name: 'targetCodeHash', type: 'bytes32' },
    ],
    name: 'IncompatibleAttestation',
    type: 'error',
  },
  { inputs: [], name: 'InsufficientAttestations', type: 'error' },
  { inputs: [], name: 'InsufficientValue', type: 'error' },
  { inputs: [], name: 'InvalidAttestation', type: 'error' },
  {
    inputs: [
      { internalType: 'bytes32', name: 'missingRefUID', type: 'bytes32' },
    ],
    name: 'InvalidAttestationRefUID',
    type: 'error',
  },
  { inputs: [], name: 'InvalidAttestations', type: 'error' },
  { inputs: [], name: 'InvalidDeployment', type: 'error' },
  { inputs: [], name: 'InvalidExpirationTime', type: 'error' },
  { inputs: [], name: 'InvalidLength', type: 'error' },
  { inputs: [], name: 'InvalidOffset', type: 'error' },
  { inputs: [], name: 'InvalidRegistry', type: 'error' },
  { inputs: [], name: 'InvalidResolver', type: 'error' },
  { inputs: [], name: 'InvalidRevocation', type: 'error' },
  { inputs: [], name: 'InvalidRevocations', type: 'error' },
  { inputs: [], name: 'InvalidSchema', type: 'error' },
  {
    inputs: [
      { internalType: 'address', name: 'moduleAddr', type: 'address' },
      { internalType: 'address', name: 'sender', type: 'address' },
    ],
    name: 'InvalidSender',
    type: 'error',
  },
  { inputs: [], name: 'InvalidSignature', type: 'error' },
  { inputs: [], name: 'InvalidVerifier', type: 'error' },
  { inputs: [], name: 'NotFound', type: 'error' },
  { inputs: [], name: 'NotPayable', type: 'error' },
  {
    inputs: [{ internalType: 'address', name: 'attester', type: 'address' }],
    name: 'RevokedAttestation',
    type: 'error',
  },
  { inputs: [], name: 'WrongSchema', type: 'error' },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'subject',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'attester',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'SchemaUID',
        name: 'schema',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'AttestationDataRef',
        name: 'dataPointer',
        type: 'address',
      },
    ],
    name: 'Attested',
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
      { indexed: true, internalType: 'bytes32', name: 'salt', type: 'bytes32' },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'resolver',
        type: 'bytes32',
      },
    ],
    name: 'ModuleDeployed',
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
      {
        indexed: true,
        internalType: 'address',
        name: 'factory',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'resolver',
        type: 'bytes32',
      },
    ],
    name: 'ModuleDeployedExternalFactory',
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
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'resolver',
        type: 'bytes32',
      },
    ],
    name: 'ModuleRegistration',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'ResolverUID',
        name: 'uid',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'resolver',
        type: 'address',
      },
    ],
    name: 'NewSchemaResolver',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'subject',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'revoker',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'SchemaUID',
        name: 'schema',
        type: 'bytes32',
      },
    ],
    name: 'Revoked',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'revoker',
        type: 'address',
      },
      { indexed: true, internalType: 'bytes32', name: 'data', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'uint64',
        name: 'timestamp',
        type: 'uint64',
      },
    ],
    name: 'RevokedOffchain',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'SchemaUID',
        name: 'uid',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'registerer',
        type: 'address',
      },
    ],
    name: 'SchemaRegistered',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'ResolverUID',
        name: 'uid',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'registerer',
        type: 'address',
      },
    ],
    name: 'SchemaResolverRegistered',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'bytes32', name: 'data', type: 'bytes32' },
      {
        indexed: true,
        internalType: 'uint64',
        name: 'timestamp',
        type: 'uint64',
      },
    ],
    name: 'Timestamped',
    type: 'event',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'SchemaUID', name: 'schemaUID', type: 'bytes32' },
          {
            components: [
              { internalType: 'address', name: 'subject', type: 'address' },
              {
                internalType: 'uint48',
                name: 'expirationTime',
                type: 'uint48',
              },
              { internalType: 'uint256', name: 'value', type: 'uint256' },
              { internalType: 'bytes', name: 'data', type: 'bytes' },
            ],
            internalType: 'struct AttestationRequestData',
            name: 'data',
            type: 'tuple',
          },
        ],
        internalType: 'struct AttestationRequest',
        name: 'request',
        type: 'tuple',
      },
    ],
    name: 'attest',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'SchemaUID', name: 'schemaUID', type: 'bytes32' },
          {
            components: [
              { internalType: 'address', name: 'subject', type: 'address' },
              {
                internalType: 'uint48',
                name: 'expirationTime',
                type: 'uint48',
              },
              { internalType: 'uint256', name: 'value', type: 'uint256' },
              { internalType: 'bytes', name: 'data', type: 'bytes' },
            ],
            internalType: 'struct AttestationRequestData',
            name: 'data',
            type: 'tuple',
          },
          { internalType: 'address', name: 'attester', type: 'address' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct DelegatedAttestationRequest',
        name: 'delegatedRequest',
        type: 'tuple',
      },
    ],
    name: 'attest',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'module', type: 'address' },
      { internalType: 'address', name: 'attester', type: 'address' },
    ],
    name: 'check',
    outputs: [{ internalType: 'uint256', name: 'attestedAt', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'module', type: 'address' },
      { internalType: 'address[]', name: 'attesters', type: 'address[]' },
      { internalType: 'uint256', name: 'threshold', type: 'uint256' },
    ],
    name: 'checkN',
    outputs: [
      { internalType: 'uint256[]', name: 'attestedAtArray', type: 'uint256[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'module', type: 'address' },
      { internalType: 'address[]', name: 'attesters', type: 'address[]' },
      { internalType: 'uint256', name: 'threshold', type: 'uint256' },
    ],
    name: 'checkNUnsafe',
    outputs: [
      { internalType: 'uint256[]', name: 'attestedAtArray', type: 'uint256[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes', name: 'code', type: 'bytes' },
      { internalType: 'bytes', name: 'deployParams', type: 'bytes' },
      { internalType: 'bytes32', name: 'salt', type: 'bytes32' },
      { internalType: 'bytes', name: 'metadata', type: 'bytes' },
      { internalType: 'ResolverUID', name: 'resolverUID', type: 'bytes32' },
    ],
    name: 'deploy',
    outputs: [{ internalType: 'address', name: 'moduleAddr', type: 'address' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'bytes', name: 'code', type: 'bytes' },
      { internalType: 'bytes', name: 'deployParams', type: 'bytes' },
      { internalType: 'bytes32', name: 'salt', type: 'bytes32' },
      { internalType: 'bytes', name: 'metadata', type: 'bytes' },
      { internalType: 'ResolverUID', name: 'resolverUID', type: 'bytes32' },
    ],
    name: 'deployC3',
    outputs: [{ internalType: 'address', name: 'moduleAddr', type: 'address' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'factory', type: 'address' },
      { internalType: 'bytes', name: 'callOnFactory', type: 'bytes' },
      { internalType: 'bytes', name: 'metadata', type: 'bytes' },
      { internalType: 'ResolverUID', name: 'resolverUID', type: 'bytes32' },
    ],
    name: 'deployViaFactory',
    outputs: [{ internalType: 'address', name: 'moduleAddr', type: 'address' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { internalType: 'bytes1', name: 'fields', type: 'bytes1' },
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'version', type: 'string' },
      { internalType: 'uint256', name: 'chainId', type: 'uint256' },
      { internalType: 'address', name: 'verifyingContract', type: 'address' },
      { internalType: 'bytes32', name: 'salt', type: 'bytes32' },
      { internalType: 'uint256[]', name: 'extensions', type: 'uint256[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'module', type: 'address' },
      { internalType: 'address', name: 'attesters', type: 'address' },
    ],
    name: 'findAttestation',
    outputs: [
      {
        components: [
          { internalType: 'uint48', name: 'time', type: 'uint48' },
          { internalType: 'uint48', name: 'expirationTime', type: 'uint48' },
          { internalType: 'uint48', name: 'revocationTime', type: 'uint48' },
          { internalType: 'SchemaUID', name: 'schemaUID', type: 'bytes32' },
          { internalType: 'address', name: 'subject', type: 'address' },
          { internalType: 'address', name: 'attester', type: 'address' },
          {
            internalType: 'AttestationDataRef',
            name: 'dataPointer',
            type: 'address',
          },
        ],
        internalType: 'struct AttestationRecord',
        name: 'attestation',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'module', type: 'address' },
      { internalType: 'address[]', name: 'attesters', type: 'address[]' },
    ],
    name: 'findAttestations',
    outputs: [
      {
        components: [
          { internalType: 'uint48', name: 'time', type: 'uint48' },
          { internalType: 'uint48', name: 'expirationTime', type: 'uint48' },
          { internalType: 'uint48', name: 'revocationTime', type: 'uint48' },
          { internalType: 'SchemaUID', name: 'schemaUID', type: 'bytes32' },
          { internalType: 'address', name: 'subject', type: 'address' },
          { internalType: 'address', name: 'attester', type: 'address' },
          {
            internalType: 'AttestationDataRef',
            name: 'dataPointer',
            type: 'address',
          },
        ],
        internalType: 'struct AttestationRecord[]',
        name: 'attestations',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAttestTypeHash',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'subject', type: 'address' },
          { internalType: 'uint48', name: 'expirationTime', type: 'uint48' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
        ],
        internalType: 'struct AttestationRequestData',
        name: 'attData',
        type: 'tuple',
      },
      { internalType: 'SchemaUID', name: 'schemaUID', type: 'bytes32' },
      { internalType: 'uint256', name: 'nonce', type: 'uint256' },
    ],
    name: 'getAttestationDigest',
    outputs: [{ internalType: 'bytes32', name: 'digest', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'subject', type: 'address' },
          { internalType: 'uint48', name: 'expirationTime', type: 'uint48' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
          { internalType: 'bytes', name: 'data', type: 'bytes' },
        ],
        internalType: 'struct AttestationRequestData',
        name: 'attData',
        type: 'tuple',
      },
      { internalType: 'SchemaUID', name: 'schemaUID', type: 'bytes32' },
      { internalType: 'address', name: 'attester', type: 'address' },
    ],
    name: 'getAttestationDigest',
    outputs: [{ internalType: 'bytes32', name: 'digest', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getDomainSeparator',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'moduleAddress', type: 'address' },
    ],
    name: 'getModule',
    outputs: [
      {
        components: [
          { internalType: 'ResolverUID', name: 'resolverUID', type: 'bytes32' },
          { internalType: 'address', name: 'implementation', type: 'address' },
          { internalType: 'address', name: 'sender', type: 'address' },
          { internalType: 'bytes', name: 'metadata', type: 'bytes' },
        ],
        internalType: 'struct ModuleRecord',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'getNonce',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'ResolverUID', name: 'uid', type: 'bytes32' }],
    name: 'getResolver',
    outputs: [
      {
        components: [
          {
            internalType: 'contract IResolver',
            name: 'resolver',
            type: 'address',
          },
          { internalType: 'address', name: 'resolverOwner', type: 'address' },
        ],
        internalType: 'struct ResolverRecord',
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
        components: [
          { internalType: 'address', name: 'subject', type: 'address' },
          { internalType: 'address', name: 'attester', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        internalType: 'struct RevocationRequestData',
        name: 'revData',
        type: 'tuple',
      },
      { internalType: 'SchemaUID', name: 'schemaUID', type: 'bytes32' },
      { internalType: 'address', name: 'revoker', type: 'address' },
    ],
    name: 'getRevocationDigest',
    outputs: [{ internalType: 'bytes32', name: 'digest', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'subject', type: 'address' },
          { internalType: 'address', name: 'attester', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' },
        ],
        internalType: 'struct RevocationRequestData',
        name: 'revData',
        type: 'tuple',
      },
      { internalType: 'SchemaUID', name: 'schemaUID', type: 'bytes32' },
      { internalType: 'uint256', name: 'nonce', type: 'uint256' },
    ],
    name: 'getRevocationDigest',
    outputs: [{ internalType: 'bytes32', name: 'digest', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getRevokeTypeHash',
    outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'SchemaUID', name: 'uid', type: 'bytes32' }],
    name: 'getSchema',
    outputs: [
      {
        components: [
          { internalType: 'uint48', name: 'registeredAt', type: 'uint48' },
          {
            internalType: 'contract ISchemaValidator',
            name: 'validator',
            type: 'address',
          },
          { internalType: 'string', name: 'schema', type: 'string' },
        ],
        internalType: 'struct SchemaRecord',
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
        components: [
          { internalType: 'SchemaUID', name: 'schemaUID', type: 'bytes32' },
          {
            components: [
              { internalType: 'address', name: 'subject', type: 'address' },
              {
                internalType: 'uint48',
                name: 'expirationTime',
                type: 'uint48',
              },
              { internalType: 'uint256', name: 'value', type: 'uint256' },
              { internalType: 'bytes', name: 'data', type: 'bytes' },
            ],
            internalType: 'struct AttestationRequestData[]',
            name: 'data',
            type: 'tuple[]',
          },
          { internalType: 'bytes[]', name: 'signatures', type: 'bytes[]' },
          { internalType: 'address', name: 'attester', type: 'address' },
        ],
        internalType: 'struct MultiDelegatedAttestationRequest[]',
        name: 'multiDelegatedRequests',
        type: 'tuple[]',
      },
    ],
    name: 'multiAttest',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'SchemaUID', name: 'schemaUID', type: 'bytes32' },
          {
            components: [
              { internalType: 'address', name: 'subject', type: 'address' },
              {
                internalType: 'uint48',
                name: 'expirationTime',
                type: 'uint48',
              },
              { internalType: 'uint256', name: 'value', type: 'uint256' },
              { internalType: 'bytes', name: 'data', type: 'bytes' },
            ],
            internalType: 'struct AttestationRequestData[]',
            name: 'data',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct MultiAttestationRequest[]',
        name: 'multiRequests',
        type: 'tuple[]',
      },
    ],
    name: 'multiAttest',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'SchemaUID', name: 'schemaUID', type: 'bytes32' },
          {
            components: [
              { internalType: 'address', name: 'subject', type: 'address' },
              { internalType: 'address', name: 'attester', type: 'address' },
              { internalType: 'uint256', name: 'value', type: 'uint256' },
            ],
            internalType: 'struct RevocationRequestData[]',
            name: 'data',
            type: 'tuple[]',
          },
          { internalType: 'address', name: 'revoker', type: 'address' },
          { internalType: 'bytes[]', name: 'signatures', type: 'bytes[]' },
        ],
        internalType: 'struct MultiDelegatedRevocationRequest[]',
        name: 'multiDelegatedRequests',
        type: 'tuple[]',
      },
    ],
    name: 'multiRevoke',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'SchemaUID', name: 'schemaUID', type: 'bytes32' },
          {
            components: [
              { internalType: 'address', name: 'subject', type: 'address' },
              { internalType: 'address', name: 'attester', type: 'address' },
              { internalType: 'uint256', name: 'value', type: 'uint256' },
            ],
            internalType: 'struct RevocationRequestData[]',
            name: 'data',
            type: 'tuple[]',
          },
        ],
        internalType: 'struct MultiRevocationRequest[]',
        name: 'multiRequests',
        type: 'tuple[]',
      },
    ],
    name: 'multiRevoke',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'ResolverUID', name: 'resolverUID', type: 'bytes32' },
      { internalType: 'address', name: 'moduleAddress', type: 'address' },
      { internalType: 'bytes', name: 'metadata', type: 'bytes' },
    ],
    name: 'register',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IResolver',
        name: '_resolver',
        type: 'address',
      },
    ],
    name: 'registerResolver',
    outputs: [{ internalType: 'ResolverUID', name: 'uid', type: 'bytes32' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: 'schema', type: 'string' },
      {
        internalType: 'contract ISchemaValidator',
        name: 'validator',
        type: 'address',
      },
    ],
    name: 'registerSchema',
    outputs: [{ internalType: 'SchemaUID', name: 'uid', type: 'bytes32' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'SchemaUID', name: 'schemaUID', type: 'bytes32' },
          {
            components: [
              { internalType: 'address', name: 'subject', type: 'address' },
              { internalType: 'address', name: 'attester', type: 'address' },
              { internalType: 'uint256', name: 'value', type: 'uint256' },
            ],
            internalType: 'struct RevocationRequestData',
            name: 'data',
            type: 'tuple',
          },
          { internalType: 'address', name: 'revoker', type: 'address' },
          { internalType: 'bytes', name: 'signature', type: 'bytes' },
        ],
        internalType: 'struct DelegatedRevocationRequest',
        name: 'request',
        type: 'tuple',
      },
    ],
    name: 'revoke',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'SchemaUID', name: 'schemaUID', type: 'bytes32' },
          {
            components: [
              { internalType: 'address', name: 'subject', type: 'address' },
              { internalType: 'address', name: 'attester', type: 'address' },
              { internalType: 'uint256', name: 'value', type: 'uint256' },
            ],
            internalType: 'struct RevocationRequestData',
            name: 'data',
            type: 'tuple',
          },
        ],
        internalType: 'struct RevocationRequest',
        name: 'request',
        type: 'tuple',
      },
    ],
    name: 'revoke',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'ResolverUID', name: 'uid', type: 'bytes32' },
      { internalType: 'contract IResolver', name: 'resolver', type: 'address' },
    ],
    name: 'setResolver',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export default abi;
