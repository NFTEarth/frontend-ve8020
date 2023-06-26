<script setup lang="ts">
import { format } from 'date-fns';

import { PRETTY_DATE_FORMAT } from '@/components/forms/lock_actions/constants';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import useveNFTE from '@/composables/useveNFTE';
import { veNFTELockInfo } from '@/services/balancer/contracts/contracts/veNFTE';

/**
 * TYPES
 */
type Props = {
  fiatTotalLpTokens: string;
  veNFTELockInfo: veNFTELockInfo;
};

/**
 * PROPS
 */
defineProps<Props>();

/**
 * COMPOSABLES
 */
const { fNum } = useNumbers();
const { veNFTETokenInfo } = useveNFTE();

/**
 * COMPUTED
 */
</script>

<template>
  <div class="summary-table">
    <h6 class="p-2">
      {{ $t('unlockveNFTE.previewModal.summary.title') }}
    </h6>
    <div class="p-2">
      <div class="summary-item-row">
        <div>
          {{ $t('unlockveNFTE.previewModal.summary.totalToUnlock') }}
        </div>
        <div>
          {{ fNum(fiatTotalLpTokens, FNumFormats.fiat) }}
        </div>
      </div>
      <div class="summary-item-row">
        <div>
          {{ $t('unlockveNFTE.previewModal.summary.totalVotingEscrow') }}
        </div>
        <div>
          {{ fNum(0, FNumFormats.token) }}
          {{ veNFTETokenInfo?.symbol }}
        </div>
      </div>
      <div class="summary-item-row">
        <div>
          {{ $t('unlockveNFTE.previewModal.summary.expiredOn') }}
        </div>
        <div>
          {{ format(veNFTELockInfo.lockedEndDate, PRETTY_DATE_FORMAT) }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.summary-table {
  @apply border dark:border-gray-700 divide-y dark:divide-gray-700 rounded-lg mt-4;
}

.summary-item-row {
  @apply flex justify-between pb-2;
}
</style>
