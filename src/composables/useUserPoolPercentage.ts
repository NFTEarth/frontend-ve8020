import { bnum } from '@/lib/utils';
import { Pool } from '@/services/pool/types';
import { computed, Ref } from 'vue';
import useNumbers from '@/composables/useNumbers';
import { useTokens } from '@/providers/tokens.provider';
import { usePoolStaking } from '@/providers/local/pool-staking.provider';
import { useLock } from './useLock';
import { isveNFTEPool } from './usePoolHelpers';

export function useUserPoolPercentage(pool: Ref<Pool>) {
  const { balanceFor } = useTokens();
  const { stakedShares } = usePoolStaking();

  const isveNFTE = computed(() => isveNFTEPool(pool.value.id));

  const { totalLockedShares } = useLock({
    // Avoid lock queries when pool is not veNFTE:
    enabled: isveNFTE.value,
  });
  const { fNum } = useNumbers();

  const userPoolPercentage = computed(() => {
    let bptBalance = bnum(balanceFor(pool.value.address)).plus(
      stakedShares.value
    );
    if (isveNFTE.value && totalLockedShares.value) {
      bptBalance = bptBalance.plus(totalLockedShares.value);
    }
    return bptBalance.div(bnum(pool.value.totalShares)).multipliedBy(100);
  });

  const userPoolPercentageLabel = computed(
    () =>
      fNum(userPoolPercentage.value.toString(), {
        maximumFractionDigits: 4,
        minimumFractionDigits: 0,
      }) + '%'
  );

  return {
    userPoolPercentage,
    userPoolPercentageLabel,
  };
}
