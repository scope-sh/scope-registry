import { Address } from 'viem';

import { Source as BaseSource } from '@/labels/base.js';
import type { ChainSingleLabelMap, SourceInfo } from '@/labels/base.js';
import { ChainId } from '@/utils/chains.js';
import { getDeployed } from '@/utils/fetching.js';

import { toChainLabelMap } from '../../utils.js';

class Source extends BaseSource {
  getInfo(): SourceInfo {
    return {
      name: 'Rhinestone V1 Modules',
      id: 'rhinestone-v1-modules',
    };
  }

  async fetch(chain: ChainId): Promise<ChainSingleLabelMap> {
    const labels: Record<Address, string> = {
      // Validators
      '0x2483da3a338895199e5e538530213157e931bf06': 'Ownable Validator',
      '0xd990393c670dcce8b4d8f858fb98c9912dbfaa06': 'Webauthn Validator',
      '0xf6bdf42c9be18ceca5c06c42a43daf7fbbe7896b': 'Multi Factor Validator',

      // Session keys
      '0x00000000002b0ecfbd0496ee71e01257da0e37de': 'Smart Sessions',
      '0x00000088d48cf102a8cdb0137a9b173f957c6343':
        'ERC20 Spending Limit Policy',
      '0x0000006dda6c463511c4e9b05cfc34c1247fcf1f': 'Universal Action Policy',
      '0x0000003111cd8e92337c100f22b7a9dbf8dee301': 'Sudo Policy',
      '0x8177451511de0577b911c254e9551d981c26dc72': 'Timeframe Policy',
      '0x1f34ef8311345a3a4a4566af321b313052f51493': 'Usage Limit Policy',
      '0x730da93267e7e513e932301b47f2ac7d062abc83': 'Value Limit Policy',

      // Executors
      '0x6ae48bd83b6bdc8489584ea0814086f963d1bd95': 'Auto Savings Executor',
      '0x40dc90d670c89f322fa8b9f685770296428dcb6b': 'Scheduled Orders Executor',
      '0xa8e374779aee60413c974b484d6509c7e4ddb6ba':
        'Scheduled Transfers Executor',
      '0x4fd8d57b94966982b62e9588c27b4171b55e8354': 'Ownable Executor',

      // Chain abstraction
      '0x0000000000f6ed8be424d673c63eeff8b9267420': 'Omni Account Hook',
      '0x0000000000e5a37279a001301a837a91b5de1d5e': 'Omni Account Target',
      '0x000000000043ff16d5776c7f0f65ec485c17ca04': 'Omni Account Same-chain',

      '0x7e31543b269632ddc55a23553f902f84c9dd8454': 'Cold Storage Hook',
      '0x4422dbc3d055d59ee08f4a4d60e1046a9afb287f': 'Cold Storage Flashloan',
      '0xa04d053b3c8021e8d5bf641816c42daa75d8b597': 'Social Recovery',
      '0x0ac6160dba30d665cca6e6b6a2cdf147dc3ded22': 'Registry Hook',
      '0x8bade54bca47199b6732eb2f92318dd666bde413': 'Deadman Switch',
      '0xf6782ed057f95f334d04f0af1af4d14fb84de549': 'Hook Multiplexer',
    };
    const chainAddresses = await getDeployed(chain, labels);
    return toChainLabelMap(
      this.getInfo().id,
      chainAddresses,
      true,
      'rhinestone-v1',
      'erc7579-module',
    );
  }
}

export default Source;
