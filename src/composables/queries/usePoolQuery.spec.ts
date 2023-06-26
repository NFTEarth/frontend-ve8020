import usePoolQuery from '@/composables/queries/usePoolQuery';
import { initDependenciesWithDefaultMocks } from '@/dependencies/default-mocks';
import { poolsStoreService } from '@/services/pool/pools-store.service';
import {
  mountComposableWithDefaultTokensProvider,
  waitForQueryData,
} from '@tests/mount-helpers';
import { aveNFTEPool } from '@tests/unit/builders/pool.builders';

initDependenciesWithDefaultMocks();

test('Returns already downloaded pool (recovered by poolsStoreService)', async () => {
  const veNFTEPool = aveNFTEPool();
  poolsStoreService.setPools([veNFTEPool]);

  const { result } = mountComposableWithDefaultTokensProvider(() =>
    usePoolQuery(veNFTEPool.id, ref(true))
  );

  const data = await waitForQueryData(result);

  expect(data?.id).toEqual(veNFTEPool.id);
  expect(data?.address).toEqual(veNFTEPool.address);
});
