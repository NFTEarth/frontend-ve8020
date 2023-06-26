<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { LockType } from '@/components/forms/lock_actions/LockForm/types';
import useveNFTELockInfoQuery from '@/composables/queries/useveNFTELockInfoQuery';
import { expectedveNFTE } from '@/composables/useveNFTE';
import { veNFTELockInfo } from '@/services/balancer/contracts/contracts/veNFTE';
import { Pool } from '@/services/pool/types';
import { TokenInfo } from '@/types/TokenList';

import useLockState from '../../composables/useLockState';
import LockActions from './components/LockActions.vue';
import LockAmount from './components/LockAmount.vue';
import LockSummary from './components/LockSummary.vue';

/**
 * TYPES
 */
type Props = {
  lockablePool: Pool;
  lockablePoolTokenInfo: TokenInfo;
  lockAmount: string;
  lockEndDate: string;
  lockType: LockType[];
  veNFTELockInfo: veNFTELockInfo;
  totalLpTokens: string;
};

/**
 * PROPS & EMITS
 */
const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

/**
 * STATE
 */
const lockConfirmed = ref(false);
const lockablePool = ref(props.lockablePool);
const lockablePoolTokenInfo = ref(props.lockablePoolTokenInfo);
const lockAmount = ref(props.lockAmount);
const lockEndDate = ref(props.lockEndDate);
const lockType = ref(props.lockType);
const veNFTELockInfo = ref(props.veNFTELockInfo);
const totalLpTokens = ref(props.totalLpTokens);

// This value should be static when modal is opened.
const expectedveNFTEAmount = expectedveNFTE(
  totalLpTokens.value,
  lockEndDate.value
);

/**
 * COMPOSABLES
 */
const { t } = useI18n();
const { refetch: refetchLockInfo } = useveNFTELockInfoQuery();
const { resetState } = useLockState();

/**
 * COMPUTED
 */
const title = computed(() => {
  if (lockType.value.length === 1) {
    return lockConfirmed.value
      ? t(`getveNFTE.previewModal.titles.${lockType.value[0]}.confirmed`)
      : t(`getveNFTE.previewModal.titles.${lockType.value[0]}.default`);
  }
  return lockConfirmed.value
    ? t(`getveNFTE.previewModal.titles.${LockType.CREATE_LOCK}.confirmed`)
    : t(`getveNFTE.previewModal.titles.${LockType.CREATE_LOCK}.default`);
});

/**
 * METHODS
 */
function handleClose() {
  emit('close');
}

function handleSuccess() {
  lockConfirmed.value = true;
  refetchLockInfo();
  resetState();
}
</script>

<template>
  <BalModal show :fireworks="lockConfirmed" @close="handleClose">
    <template #header>
      <div class="flex items-center">
        <BalCircle
          v-if="lockConfirmed"
          size="8"
          color="green"
          class="mr-2 text-white"
        >
          <BalIcon name="check" />
        </BalCircle>
        <h4>
          {{ title }}
        </h4>
      </div>
    </template>

    <LockAmount :lockablePool="lockablePool" :totalLpTokens="totalLpTokens" />

    <LockSummary
      :lockablePool="lockablePool"
      :totalLpTokens="totalLpTokens"
      :lockAmount="lockAmount"
      :lockEndDate="lockEndDate"
      :expectedveNFTEAmount="expectedveNFTEAmount"
      :lockType="lockType"
      :veNFTELockInfo="veNFTELockInfo"
    />
    <LockActions
      :veNFTELockInfo="veNFTELockInfo"
      :lockConfirmed="lockConfirmed"
      :lockAmount="lockAmount"
      :lockEndDate="lockEndDate"
      :lockType="lockType"
      :lockablePoolTokenInfo="lockablePoolTokenInfo"
      class="mt-4"
      @success="handleSuccess"
    />
  </BalModal>
</template>
