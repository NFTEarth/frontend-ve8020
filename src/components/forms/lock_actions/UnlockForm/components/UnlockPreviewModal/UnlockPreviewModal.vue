<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import useveNFTELockInfoQuery from '@/composables/queries/useveNFTELockInfoQuery';
import { veNFTELockInfo } from '@/services/balancer/contracts/contracts/veNFTE';
import { Pool } from '@/services/pool/types';
import { TokenInfo } from '@/types/TokenList';

import UnlockActions from './components/UnlockActions.vue';
import UnlockAmount from './components/UnlockAmount.vue';
import UnlockSummary from './components/UnlockSummary.vue';

/**
 * TYPES
 */
type Props = {
  lockablePool: Pool;
  lockablePoolTokenInfo: TokenInfo;
  veNFTELockInfo: veNFTELockInfo;
  totalLpTokens: string;
  fiatTotalLpTokens: string;
};

/**
 * PROPS & EMITS
 */
const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

/**
 * COMPOSABLES
 */
const { refetch: refetchLockInfo } = useveNFTELockInfoQuery();

/**
 * STATE
 */
const unlockConfirmed = ref(false);
const lockablePool = ref(props.lockablePool);
const lockablePoolTokenInfo = ref(props.lockablePoolTokenInfo);
const veNFTELockInfo = ref(props.veNFTELockInfo);
const totalLpTokens = ref(props.totalLpTokens);
const fiatTotalLpTokens = ref(props.fiatTotalLpTokens);

/**
 * COMPOSABLES
 */
const { t } = useI18n();

/**
 * COMPUTED
 */
const title = computed(() => {
  return unlockConfirmed.value
    ? t(`unlockveNFTE.previewModal.titles.unlock.confirmed`)
    : t(`unlockveNFTE.previewModal.titles.unlock.default`);
});

/**
 * METHODS
 */
function handleClose() {
  emit('close');
}

function handleSuccess() {
  unlockConfirmed.value = true;
  refetchLockInfo();
}
</script>

<template>
  <BalModal show :fireworks="unlockConfirmed" @close="handleClose">
    <template #header>
      <div class="flex items-center">
        <BalCircle
          v-if="unlockConfirmed"
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

    <UnlockAmount :lockablePool="lockablePool" :totalLpTokens="totalLpTokens" />

    <UnlockSummary
      :fiatTotalLpTokens="fiatTotalLpTokens"
      :veNFTELockInfo="veNFTELockInfo"
    />

    <UnlockActions
      :lockablePool="lockablePool"
      :lockablePoolTokenInfo="lockablePoolTokenInfo"
      :totalLpTokens="totalLpTokens"
      :veNFTELockInfo="veNFTELockInfo"
      class="mt-4"
      @success="handleSuccess"
      @close="handleClose"
    />
  </BalModal>
</template>
