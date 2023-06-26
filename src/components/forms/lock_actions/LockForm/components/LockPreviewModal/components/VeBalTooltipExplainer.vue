<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import useveNFTE from '@/composables/useveNFTE';

/**
 * TYPES
 */
type Props = {
  totalLpTokens: string;
  lockEndDate: string;
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
const { t } = useI18n();

/**
 * COMPUTED
 */
const conversationTableRows = computed(() => [
  {
    label: t('getveNFTE.lockForm.lockPeriods.1y'),
    value: `~1 ${veNFTETokenInfo.value?.symbol}`,
  },
  {
    label: t('getveNFTE.lockForm.lockPeriods.6m'),
    value: `~0.5 ${veNFTETokenInfo.value?.symbol}`,
  },
  {
    label: t('getveNFTE.lockForm.lockPeriods.3m'),
    value: `~0.25 ${veNFTETokenInfo.value?.symbol}`,
  },
]);
</script>

<template>
  <BalTooltip width="72" noPad class="ml-2">
    <template #activator>
      <BalIcon name="info" size="sm" class="text-secondary" />
    </template>
    <div class="text-sm divide-y dark:divide-gray-900">
      <div class="p-3 bg-gray-50 dark:bg-gray-700 rounded-t">
        <h5>
          {{ fNum(expectedveNFTEAmount, FNumFormats.token) }}
          {{ veNFTETokenInfo?.symbol }}
        </h5>
      </div>
      <div class="p-3">
        <div class="mb-3 text-secondary">
          {{
            $t(
              'getveNFTE.previewModal.summary.totalVotingEscrowTooltip.explainer'
            )
          }}
        </div>
        <div class="flex items-center mb-1 whitespace-nowrap">
          <table class="w-full table-fixed">
            <thead>
              <tr>
                <th class="table-header-cell">
                  {{
                    $t(
                      'getveNFTE.previewModal.summary.totalVotingEscrowTooltip.table.lockPeriod'
                    )
                  }}
                </th>
                <th class="table-header-cell">
                  {{
                    $t(
                      'getveNFTE.previewModal.summary.totalVotingEscrowTooltip.table.totalveNFTE'
                    )
                  }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in conversationTableRows" :key="i">
                <td class="table-body-cell">
                  {{ row.label }}
                </td>
                <td class="table-body-cell">
                  {{ row.value }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </BalTooltip>
</template>

<style scoped>
.table-header-cell {
  @apply border dark:border-gray-700 p-2 text-left;
}

.table-body-cell {
  @apply border dark:border-gray-700 p-2;
}
</style>
