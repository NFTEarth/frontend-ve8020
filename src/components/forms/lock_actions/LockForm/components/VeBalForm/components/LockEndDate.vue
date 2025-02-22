<script setup lang="ts">
import { addWeeks, format } from 'date-fns';
import { computed, onBeforeMount } from 'vue';
import { useI18n } from 'vue-i18n';

import { INPUT_DATE_FORMAT } from '@/components/forms/lock_actions/constants';
import { veNFTELockInfo } from '@/services/balancer/contracts/contracts/veNFTE';

import useLockState from '../../../composables/useLockState';

/**
 * TYPES
 */
type Props = {
  minLockEndDateTimestamp: number;
  maxLockEndDateTimestamp: number;
  veNFTELockInfo?: veNFTELockInfo | null;
};

/**
 * COMPOSABLES
 */

const { t } = useI18n();

/**
 * PROPS
 */
const props = withDefaults(defineProps<Props>(), {
  veNFTELockInfo: null,
});
/**
 * STATE
 */
const { lockEndDate } = useLockState();

/**
 * COMPUTED
 */
const lockDates = computed(() => [
  {
    label: t('getveNFTE.lockForm.lockPeriods.2w'),
    action: () => updateLockEndDate(props.minLockEndDateTimestamp),
  },
  {
    label: t('getveNFTE.lockForm.lockPeriods.1m'),
    action: () =>
      updateLockEndDate(addWeeks(props.minLockEndDateTimestamp, 4).getTime()),
  },
  {
    label: t('getveNFTE.lockForm.lockPeriods.3m'),
    action: () =>
      updateLockEndDate(addWeeks(props.minLockEndDateTimestamp, 12).getTime()),
  },
  {
    label: t('getveNFTE.lockForm.lockPeriods.6m'),
    action: () =>
      updateLockEndDate(addWeeks(props.minLockEndDateTimestamp, 24).getTime()),
  },
  {
    label: t('getveNFTE.lockForm.lockPeriods.1y'),
    action: () => {
      lockEndDate.value = formatDateInput(props.maxLockEndDateTimestamp);
    },
  },
]);

/**
 * CALLBACKS
 */
onBeforeMount(() => {
  lockEndDate.value = props.veNFTELockInfo?.hasExistingLock
    ? formatDateInput(props.veNFTELockInfo.lockedEndDate)
    : formatDateInput(props.maxLockEndDateTimestamp);
});

/**
 * METHODS
 */
function updateLockEndDate(timestamp: number) {
  lockEndDate.value = formatDateInput(
    Math.min(timestamp, props.maxLockEndDateTimestamp)
  );
}

function formatDateInput(date: Date | number) {
  return format(date, INPUT_DATE_FORMAT);
}
</script>

<template>
  <div class="mb-6">
    <div>
      <p class="pb-2 font-semibold">
        {{ $t('getveNFTE.lockForm.lockEndDate.title') }}
      </p>
    </div>
    <BalTextInput
      v-model="lockEndDate"
      name="lockEndDate"
      type="date"
      :min="formatDateInput(minLockEndDateTimestamp)"
      :max="formatDateInput(maxLockEndDateTimestamp)"
      step="7"
    />
    <div class="flex px-1 mt-2 text-sm text-secondary">
      <div
        v-for="(lockDate, index) in lockDates"
        :key="index"
        class="mr-3 hover:text-pink-500 focus:text-pink-500 cursor-pointer"
        @click="lockDate.action"
      >
        ~{{ lockDate.label }}
      </div>
    </div>
  </div>
</template>
