import { initDependenciesWithDefaultMocks } from '@/dependencies/default-mocks';
import { provideUserData } from '@/providers/user-data.provider';
import { poolsStoreService } from '@/services/pool/pools-store.service';
import { Pool } from '@/services/pool/types';
import { mountComposable, provideFakePoolStaking } from '@tests/mount-helpers';
import { aPool, aveNFTEPool } from '@tests/unit/builders/pool.builders';
import { noop } from 'lodash';
import { ref } from 'vue';
import waitForExpect from 'wait-for-expect';
import { useUserPoolPercentage } from './useUserPoolPercentage';

initDependenciesWithDefaultMocks();

const bptBalance = '10';

vi.mock('@/providers/tokens.provider', () => {
  return {
    useTokens() {
      return {
        balanceFor: () => bptBalance,
        injectTokens: noop,
      };
    },
  };
});

function mountUserPoolPercentage(pool: Pool) {
  const { result } = mountComposable(() => useUserPoolPercentage(ref(pool)), {
    extraProvidersCb: () => {
      provideUserData();
    },
  });
  return result;
}

it('calculates user pool percentage', () => {
  const pool = aPool({ totalShares: '100' });
  const result = mountUserPoolPercentage(pool);
  expect(result.userPoolPercentage.value.toString()).toBe('15');
});

it('calculates user pool percentage label', () => {
  const pool = aPool({ totalShares: '8888888' });
  const result = mountUserPoolPercentage(pool);
  expect(result.userPoolPercentageLabel.value.toString()).toBe('0.0002%');
});

it('calculates user pool percentage label when user has a very small share', () => {
  const pool = aPool({ totalShares: '88888888888' });
  const result = mountUserPoolPercentage(pool);
  expect(result.userPoolPercentageLabel.value.toString()).toBe('< 0.0001%');
});

it('includes locked shares given a veNFTE pool', async () => {
  const veNFTEPool = aveNFTEPool({
    totalLiquidity: '100',
    totalShares: '100',
  });

  poolsStoreService.setPools([veNFTEPool]);

  const { result } = mountComposable(
    () => useUserPoolPercentage(ref(veNFTEPool)),
    {
      extraProvidersCb: () => {
        provideUserData();
        // Locked pool does not have stacking
        provideFakePoolStaking('0');
      },
    }
  );
  expect(result.userPoolPercentageLabel.value.toString()).toBe('10%');

  await waitForExpect(() =>
    expect(result.userPoolPercentageLabel.value.toString()).toBe('10.5%')
  );
});
