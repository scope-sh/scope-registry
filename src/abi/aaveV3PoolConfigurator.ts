const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'proxy',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address',
      },
    ],
    name: 'ATokenUpgraded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldBorrowCap',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newBorrowCap',
        type: 'uint256',
      },
    ],
    name: 'BorrowCapChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'borrowable',
        type: 'bool',
      },
    ],
    name: 'BorrowableInIsolationChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldBridgeProtocolFee',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newBridgeProtocolFee',
        type: 'uint256',
      },
    ],
    name: 'BridgeProtocolFeeUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      { indexed: false, internalType: 'uint256', name: 'ltv', type: 'uint256' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'liquidationThreshold',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'liquidationBonus',
        type: 'uint256',
      },
    ],
    name: 'CollateralConfigurationChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldDebtCeiling',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newDebtCeiling',
        type: 'uint256',
      },
    ],
    name: 'DebtCeilingChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'oldCategoryId',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'newCategoryId',
        type: 'uint8',
      },
    ],
    name: 'EModeAssetCategoryChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint8',
        name: 'categoryId',
        type: 'uint8',
      },
      { indexed: false, internalType: 'uint256', name: 'ltv', type: 'uint256' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'liquidationThreshold',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'liquidationBonus',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'oracle',
        type: 'address',
      },
      { indexed: false, internalType: 'string', name: 'label', type: 'string' },
    ],
    name: 'EModeCategoryAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint128',
        name: 'oldFlashloanPremiumToProtocol',
        type: 'uint128',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'newFlashloanPremiumToProtocol',
        type: 'uint128',
      },
    ],
    name: 'FlashloanPremiumToProtocolUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint128',
        name: 'oldFlashloanPremiumTotal',
        type: 'uint128',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'newFlashloanPremiumTotal',
        type: 'uint128',
      },
    ],
    name: 'FlashloanPremiumTotalUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldFee',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newFee',
        type: 'uint256',
      },
    ],
    name: 'LiquidationProtocolFeeChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      { indexed: false, internalType: 'bool', name: 'active', type: 'bool' },
    ],
    name: 'ReserveActive',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      { indexed: false, internalType: 'bool', name: 'enabled', type: 'bool' },
    ],
    name: 'ReserveBorrowing',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
    ],
    name: 'ReserveDropped',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldReserveFactor',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newReserveFactor',
        type: 'uint256',
      },
    ],
    name: 'ReserveFactorChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      { indexed: false, internalType: 'bool', name: 'enabled', type: 'bool' },
    ],
    name: 'ReserveFlashLoaning',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      { indexed: false, internalType: 'bool', name: 'frozen', type: 'bool' },
    ],
    name: 'ReserveFrozen',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'aToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'stableDebtToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'variableDebtToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'interestRateStrategyAddress',
        type: 'address',
      },
    ],
    name: 'ReserveInitialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'oldStrategy',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newStrategy',
        type: 'address',
      },
    ],
    name: 'ReserveInterestRateStrategyChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      { indexed: false, internalType: 'bool', name: 'paused', type: 'bool' },
    ],
    name: 'ReservePaused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      { indexed: false, internalType: 'bool', name: 'enabled', type: 'bool' },
    ],
    name: 'ReserveStableRateBorrowing',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      { indexed: false, internalType: 'bool', name: 'oldState', type: 'bool' },
      { indexed: false, internalType: 'bool', name: 'newState', type: 'bool' },
    ],
    name: 'SiloedBorrowingChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'proxy',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address',
      },
    ],
    name: 'StableDebtTokenUpgraded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldSupplyCap',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newSupplyCap',
        type: 'uint256',
      },
    ],
    name: 'SupplyCapChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldUnbackedMintCap',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newUnbackedMintCap',
        type: 'uint256',
      },
    ],
    name: 'UnbackedMintCapChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'asset',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'proxy',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address',
      },
    ],
    name: 'VariableDebtTokenUpgraded',
    type: 'event',
  },
  {
    inputs: [],
    name: 'CONFIGURATOR_REVISION',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'asset', type: 'address' },
      { internalType: 'uint256', name: 'ltv', type: 'uint256' },
      {
        internalType: 'uint256',
        name: 'liquidationThreshold',
        type: 'uint256',
      },
      { internalType: 'uint256', name: 'liquidationBonus', type: 'uint256' },
    ],
    name: 'configureReserveAsCollateral',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: 'asset', type: 'address' }],
    name: 'dropReserve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'aTokenImpl', type: 'address' },
          {
            internalType: 'address',
            name: 'stableDebtTokenImpl',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'variableDebtTokenImpl',
            type: 'address',
          },
          {
            internalType: 'uint8',
            name: 'underlyingAssetDecimals',
            type: 'uint8',
          },
          {
            internalType: 'address',
            name: 'interestRateStrategyAddress',
            type: 'address',
          },
          { internalType: 'address', name: 'underlyingAsset', type: 'address' },
          { internalType: 'address', name: 'treasury', type: 'address' },
          {
            internalType: 'address',
            name: 'incentivesController',
            type: 'address',
          },
          { internalType: 'string', name: 'aTokenName', type: 'string' },
          { internalType: 'string', name: 'aTokenSymbol', type: 'string' },
          {
            internalType: 'string',
            name: 'variableDebtTokenName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'variableDebtTokenSymbol',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'stableDebtTokenName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'stableDebtTokenSymbol',
            type: 'string',
          },
          { internalType: 'bytes', name: 'params', type: 'bytes' },
        ],
        internalType: 'struct ConfiguratorInputTypes.InitReserveInput[]',
        name: 'input',
        type: 'tuple[]',
      },
    ],
    name: 'initReserves',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IPoolAddressesProvider',
        name: 'provider',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'asset', type: 'address' },
      { internalType: 'uint8', name: 'newCategoryId', type: 'uint8' },
    ],
    name: 'setAssetEModeCategory',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'asset', type: 'address' },
      { internalType: 'uint256', name: 'newBorrowCap', type: 'uint256' },
    ],
    name: 'setBorrowCap',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'asset', type: 'address' },
      { internalType: 'bool', name: 'borrowable', type: 'bool' },
    ],
    name: 'setBorrowableInIsolation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'asset', type: 'address' },
      { internalType: 'uint256', name: 'newDebtCeiling', type: 'uint256' },
    ],
    name: 'setDebtCeiling',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint8', name: 'categoryId', type: 'uint8' },
      { internalType: 'uint16', name: 'ltv', type: 'uint16' },
      { internalType: 'uint16', name: 'liquidationThreshold', type: 'uint16' },
      { internalType: 'uint16', name: 'liquidationBonus', type: 'uint16' },
      { internalType: 'address', name: 'oracle', type: 'address' },
      { internalType: 'string', name: 'label', type: 'string' },
    ],
    name: 'setEModeCategory',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'asset', type: 'address' },
      { internalType: 'uint256', name: 'newFee', type: 'uint256' },
    ],
    name: 'setLiquidationProtocolFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bool', name: 'paused', type: 'bool' }],
    name: 'setPoolPause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'asset', type: 'address' },
      { internalType: 'bool', name: 'active', type: 'bool' },
    ],
    name: 'setReserveActive',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'asset', type: 'address' },
      { internalType: 'bool', name: 'enabled', type: 'bool' },
    ],
    name: 'setReserveBorrowing',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'asset', type: 'address' },
      { internalType: 'uint256', name: 'newReserveFactor', type: 'uint256' },
    ],
    name: 'setReserveFactor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'asset', type: 'address' },
      { internalType: 'bool', name: 'enabled', type: 'bool' },
    ],
    name: 'setReserveFlashLoaning',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'asset', type: 'address' },
      { internalType: 'bool', name: 'freeze', type: 'bool' },
    ],
    name: 'setReserveFreeze',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'asset', type: 'address' },
      {
        internalType: 'address',
        name: 'newRateStrategyAddress',
        type: 'address',
      },
    ],
    name: 'setReserveInterestRateStrategyAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'asset', type: 'address' },
      { internalType: 'bool', name: 'paused', type: 'bool' },
    ],
    name: 'setReservePause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'asset', type: 'address' },
      { internalType: 'bool', name: 'enabled', type: 'bool' },
    ],
    name: 'setReserveStableRateBorrowing',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'asset', type: 'address' },
      { internalType: 'bool', name: 'newSiloed', type: 'bool' },
    ],
    name: 'setSiloedBorrowing',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'asset', type: 'address' },
      { internalType: 'uint256', name: 'newSupplyCap', type: 'uint256' },
    ],
    name: 'setSupplyCap',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'asset', type: 'address' },
      { internalType: 'uint256', name: 'newUnbackedMintCap', type: 'uint256' },
    ],
    name: 'setUnbackedMintCap',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'asset', type: 'address' },
          { internalType: 'address', name: 'treasury', type: 'address' },
          {
            internalType: 'address',
            name: 'incentivesController',
            type: 'address',
          },
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'string', name: 'symbol', type: 'string' },
          { internalType: 'address', name: 'implementation', type: 'address' },
          { internalType: 'bytes', name: 'params', type: 'bytes' },
        ],
        internalType: 'struct ConfiguratorInputTypes.UpdateATokenInput',
        name: 'input',
        type: 'tuple',
      },
    ],
    name: 'updateAToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newBridgeProtocolFee',
        type: 'uint256',
      },
    ],
    name: 'updateBridgeProtocolFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint128',
        name: 'newFlashloanPremiumToProtocol',
        type: 'uint128',
      },
    ],
    name: 'updateFlashloanPremiumToProtocol',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint128',
        name: 'newFlashloanPremiumTotal',
        type: 'uint128',
      },
    ],
    name: 'updateFlashloanPremiumTotal',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'asset', type: 'address' },
          {
            internalType: 'address',
            name: 'incentivesController',
            type: 'address',
          },
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'string', name: 'symbol', type: 'string' },
          { internalType: 'address', name: 'implementation', type: 'address' },
          { internalType: 'bytes', name: 'params', type: 'bytes' },
        ],
        internalType: 'struct ConfiguratorInputTypes.UpdateDebtTokenInput',
        name: 'input',
        type: 'tuple',
      },
    ],
    name: 'updateStableDebtToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'asset', type: 'address' },
          {
            internalType: 'address',
            name: 'incentivesController',
            type: 'address',
          },
          { internalType: 'string', name: 'name', type: 'string' },
          { internalType: 'string', name: 'symbol', type: 'string' },
          { internalType: 'address', name: 'implementation', type: 'address' },
          { internalType: 'bytes', name: 'params', type: 'bytes' },
        ],
        internalType: 'struct ConfiguratorInputTypes.UpdateDebtTokenInput',
        name: 'input',
        type: 'tuple',
      },
    ],
    name: 'updateVariableDebtToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export default abi;
