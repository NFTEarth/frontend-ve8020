import { initDependenciesWithDefaultMocks } from '@/dependencies/default-mocks';
import {
  initMulticallerAsPoolMulticallerMock,
  initMulticallPoolId,
} from '@/dependencies/Multicaller.mocks';
import { poolsStoreService } from '@/services/pool/pools-store.service';
import { mountComposableWithDefaultTokensProvider as mountComposable } from '@tests/mount-helpers';
import { aveNFTEPool } from '@tests/unit/builders/pool.builders';
import waitForExpect from 'wait-for-expect';
import { poolProvider } from './pool.provider';

initDependenciesWithDefaultMocks();
initMulticallerAsPoolMulticallerMock();

async function mountUserPoolProvider(poolId: string) {
  const { result } = mountComposable(() => poolProvider(poolId));

  await waitForExpect(() => {
    expect(result.isLoadingPool.value).toBeFalse();
  });

  return result;
}

test('returns pool from store service', async () => {
  const veNFTEPool = aveNFTEPool();
  initMulticallPoolId(veNFTEPool.id);
  poolsStoreService.setPools([veNFTEPool]);
  const { pool } = await mountUserPoolProvider(veNFTEPool.id);

  expect(pool.value?.id).toEqual(veNFTEPool.id);
});

test('refetches onchain pool data', async () => {
  const veNFTEPool = aveNFTEPool();
  poolsStoreService.setPools([veNFTEPool]);
  const { refetchOnchainPoolData, pool } = await mountUserPoolProvider(
    veNFTEPool.id
  );

  await refetchOnchainPoolData();
  expect(pool.value?.id).toEqual(veNFTEPool.id);
});
