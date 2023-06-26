<script setup lang="ts">
import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import useveNFTE from '@/composables/useveNFTE';

/**
 * TYPES
 */
type Props = {
  expectedveNFTEAmount: string;
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
</script>

<template>
  <div class="container">
    <div class="row">
      <div>{{ $t('getveNFTE.lockForm.summary.receive.title') }}</div>
      <div>
        {{
          expectedveNFTEAmount != null
            ? fNum(expectedveNFTEAmount, FNumFormats.token)
            : '-'
        }}
        {{ veNFTETokenInfo?.symbol }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  @apply border dark:border-gray-800 bg-gray-50 dark:bg-gray-800 divide-y dark:divide-gray-850 rounded-lg text-sm;
}

.row {
  @apply p-3 flex justify-between;
}
</style>
