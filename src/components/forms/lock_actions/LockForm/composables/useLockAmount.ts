import { computed, Ref } from 'vue';

import { bnum } from '@/lib/utils';
import { veNFTELockInfo } from '@/services/balancer/contracts/contracts/veNFTE';

import useLockState from './useLockState';

export default function useLockAmount(
  veNFTELockInfo?: Ref<veNFTELockInfo> | Ref<undefined>
) {
  /**
   * COMPOSABLES
   */
  const { lockAmount } = useLockState();

  /**
   * COMPUTED
   */
  const isValidLockAmount = computed(() => bnum(lockAmount.value || '0').gt(0));

  const isIncreasedLockAmount = computed(
    () => veNFTELockInfo?.value?.hasExistingLock && isValidLockAmount.value
  );

  const totalLpTokens = computed(() => {
    return veNFTELockInfo?.value?.hasExistingLock
      ? bnum(veNFTELockInfo.value.lockedAmount)
          .plus(lockAmount.value || '0')
          .toString()
      : lockAmount.value || '0';
  });

  return {
    // computed
    isValidLockAmount,
    isIncreasedLockAmount,
    totalLpTokens,
  };
}
