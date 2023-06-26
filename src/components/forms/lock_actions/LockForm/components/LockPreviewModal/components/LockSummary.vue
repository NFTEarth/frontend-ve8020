<script setup lang="ts">
import { format } from 'date-fns';
import { computed } from 'vue';

import { PRETTY_DATE_FORMAT } from '@/components/forms/lock_actions/constants';
import { LockType } from '@/components/forms/lock_actions/LockForm/types';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import useveNFTE from '@/composables/useveNFTE';
import { bnum } from '@/lib/utils';
import { veNFTELockInfo } from '@/services/balancer/contracts/contracts/veNFTE';
import { Pool } from '@/services/pool/types';

import veNFTETooltipExplainer from './veNFTETooltipExplainer.vue';

/**
 * TYPES
 */
type Props = {
  lockablePool: Pool;
  totalLpTokens: string;
  lockEndDate: string;
  lockAmount: string;
  expectedveNFTEAmount: string;
  lockType: LockType[];
  veNFTELockInfo: veNFTELockInfo;
};

/**
 * PROPS
 */
const props = defineProps<Props>();

/**
 * COMPOSABLES
 */
const { fNum } = useNumbers();
const { veNFTETokenInfo } = useveNFTE();

/**
 * COMPUTED
 */
const poolShares = computed(() =>
  bnum(props.lockablePool.totalLiquidity).div(props.lockablePool.totalShares)
);

const fiatTotalLockedAmount = computed(() =>
  poolShares.value.times(props.veNFTELockInfo.lockedAmount).toString()
);

const fiatTotalLockAmount = computed(() =>
  poolShares.value.times(props.lockAmount).toString()
);

const fiatTotalLpTokens = computed(() =>
  poolShares.value.times(props.totalLpTokens).toString()
);

const isExtendLockOnly = computed(
  () =>
    props.lockType.length === 1 && props.lockType.includes(LockType.EXTEND_LOCK)
);

const isIncreaseLockOnly = computed(
  () =>
    props.lockType.length === 1 &&
    props.lockType.includes(LockType.INCREASE_LOCK)
);

// const fiatWeeklyYield = computed(() => '0');
</script>

<template>
  <div class="summary-table">
    <h6 class="p-2">
      {{ $t('getveNFTE.previewModal.summary.title') }}
    </h6>
    <div class="p-2">
      <div class="summary-item-row">
        <div>
          {{
            isExtendLockOnly || isIncreaseLockOnly
              ? $t('getveNFTE.previewModal.summary.totalAlreadyLocked')
              : $t('getveNFTE.previewModal.summary.totalToLock')
          }}
        </div>
        <div>
          {{
            fNum(
              isIncreaseLockOnly ? fiatTotalLockedAmount : fiatTotalLpTokens,
              FNumFormats.fiat
            )
          }}
        </div>
      </div>
      <div v-if="isIncreaseLockOnly" class="summary-item-row">
        <div>
          {{ $t('getveNFTE.previewModal.summary.increasedLockAmount') }}
        </div>
        <div>{{ fNum(fiatTotalLockAmount, FNumFormats.fiat) }}</div>
      </div>
      <div class="summary-item-row">
        <div>
          {{
            isExtendLockOnly
              ? $t('getveNFTE.previewModal.summary.newLockEndDate')
              : $t('getveNFTE.previewModal.summary.lockEndDate')
          }}
        </div>
        <div>{{ format(new Date(lockEndDate), PRETTY_DATE_FORMAT) }}</div>
      </div>
      <div class="summary-item-row">
        <div>{{ $t('getveNFTE.previewModal.summary.totalVotingEscrow') }}</div>
        <div class="flex items-center">
          {{ fNum(expectedveNFTEAmount, FNumFormats.token) }}
          {{ veNFTETokenInfo?.symbol }}
          <veNFTETooltipExplainer
            :expectedveNFTEAmount="expectedveNFTEAmount"
            :lockEndDate="lockEndDate"
            :totalLpTokens="totalLpTokens"
          />
        </div>
      </div>
      <!-- <div class="summary-item-row">
        <div>
          {{ $t('getveNFTE.previewModal.summary.potentialWeeklyYield') }}
        </div>
        <div>{{ fNum(fiatWeeklyYield, FNumFormats.fiat) }}</div>
      </div> -->
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
