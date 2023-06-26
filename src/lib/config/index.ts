import { Config } from './types';

import arbitrum from './arbitrum';
import docker from './docker';
import mainnet from './mainnet';
import optimism from './optimism';
import polygon from './polygon';
import test from './test';

// We don't import Network from sdk to avoid extra bundle size when loading app (while the SDK is not tree-shakable)
export enum Network {
  MAINNET = 1,
  OPTIMISM = 10,
  POLYGON = 137,
  FANTOM = 250,
  ARBITRUM = 42161,
}

const config: Record<Network | number, Config> = {
  [Network.MAINNET]: mainnet,
  [Network.POLYGON]: polygon,
  [Network.ARBITRUM]: arbitrum,
  [Network.OPTIMISM]: optimism,

  // @ts-ignore
  12345: test,
  // @ts-ignore
  17: docker,
};

export default config;
