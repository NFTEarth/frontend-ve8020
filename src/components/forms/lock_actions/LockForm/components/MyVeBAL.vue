<script setup lang="ts">
import { format } from 'date-fns';
import { computed } from 'vue';

import { PRETTY_DATE_FORMAT } from '@/components/forms/lock_actions/constants';
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import useveNFTE from '@/composables/useveNFTE';
import { bnum } from '@/lib/utils';
import { veNFTELockInfo } from '@/services/balancer/contracts/contracts/veNFTE';

/**
 * TYPES
 */
type Props = {
  veNFTELockInfo?: veNFTELockInfo;
};

/**
 * PROPS
 */
const props = defineProps<Props>();

/**
 * COMPOSABLES
 */
const { veNFTEBalance, veNFTETokenInfo } = useveNFTE();
const { fNum } = useNumbers();

/**
 * COMPUTED
 */
const percentveNFTE = computed(() => {
  if (props.veNFTELockInfo != null) {
    const totalSupply = bnum(props.veNFTELockInfo.totalSupply);

    if (totalSupply.gt(0)) {
      return bnum(veNFTEBalance.value).div(totalSupply).toString();
    }
  }

  return '0';
});
</script>

<template>
  <BalCard noPad shadow="none">
    <div class="p-4 w-full border-b dark:border-gray-900">
      <h6>
        {{ $t('getveNFTE.myveNFTE.title') }}
      </h6>
    </div>
    <div class="flex justify-center items-center p-10 -mt-2">
      <div class="text-2xl font-semibold">
        {{ fNum(veNFTEBalance, FNumFormats.token) }}
        {{ veNFTETokenInfo?.symbol }}
      </div>
    </div>
    <div class="flex justify-center border-t dark:border-gray-900">
      <div class="p-2 w-1/2 text-center border-r dark:border-gray-900">
        <div>
          {{
            veNFTELockInfo?.hasExistingLock
              ? fNum(percentveNFTE, {
                  style: 'percent',
                  maximumFractionDigits: 4,
                })
              : '-'
          }}
        </div>
        <div class="text-gray-400">
          {{ $t('getveNFTE.myveNFTE.percentveNFTE') }}
        </div>
      </div>
      <div class="p-3 w-1/2 text-center">
        <div>
          {{
            props.veNFTELockInfo?.hasExistingLock
              ? format(props.veNFTELockInfo.lockedEndDate, PRETTY_DATE_FORMAT)
              : '-'
          }}
        </div>
        <div class="text-gray-400">
          {{
            props.veNFTELockInfo?.isExpired
              ? $t('getveNFTE.myveNFTE.expiredOn')
              : $t('getveNFTE.myveNFTE.lockedEndDate')
          }}
        </div>
      </div>
    </div>
  </BalCard>
</template>
