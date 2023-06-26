<script setup lang="ts">
import { computed, ref } from 'vue';

import { bnum } from '@/lib/utils';
import { veNFTELockInfo } from '@/services/balancer/contracts/contracts/veNFTE';
import { configService } from '@/services/config/config.service';
import { Pool } from '@/services/pool/types';
import useWeb3 from '@/services/web3/useWeb3';
import { TokenInfo } from '@/types/TokenList';

import UnlockPreviewModal from '../UnlockPreviewModal/UnlockPreviewModal.vue';
import LockedAmount from './components/LockedAmount.vue';

/**
 * TYPES
 */
type Props = {
  lockablePool: Pool;
  lockablePoolTokenInfo: TokenInfo;
  veNFTELockInfo: veNFTELockInfo;
};

/**
 * PROPS
 */
const props = defineProps<Props>();

/**
 * STATE
 */
const showPreviewModal = ref(false);

/**
 * COMPOSABLES
 */
const { isWalletReady, startConnectWithInjectedProvider, isMismatchedNetwork } =
  useWeb3();

/**
 * COMPUTED
 */
const totalLpTokens = computed(() =>
  props.veNFTELockInfo?.isExpired ? props.veNFTELockInfo.lockedAmount : '0'
);

const fiatTotalLpTokens = computed(() =>
  bnum(props.lockablePool.totalLiquidity)
    .div(props.lockablePool.totalShares)
    .times(totalLpTokens.value)
    .toString()
);

const submissionDisabled = computed(() => {
  if (isMismatchedNetwork.value) {
    return true;
  }

  return bnum(totalLpTokens.value).isZero();
});
</script>

<template>
  <BalCard shadow="xl" exposeOverflow noBorder>
    <template #header>
      <div class="w-full">
        <div class="text-xs leading-none text-secondary">
          {{ configService.network.chainName }}
        </div>
        <div class="flex justify-between items-center">
          <h4>
            {{ $t('unlockveNFTE.unlockForm.title') }}
          </h4>
        </div>
      </div>
    </template>

    <LockedAmount
      :lockablePool="lockablePool"
      :lockablePoolTokenInfo="lockablePoolTokenInfo"
      :totalLpTokens="totalLpTokens"
      :fiatTotalLpTokens="fiatTotalLpTokens"
    />

    <div class="mt-6">
      <BalBtn
        v-if="!isWalletReady"
        :label="$t('connectWallet')"
        color="gradient"
        block
        @click="startConnectWithInjectedProvider"
      />
      <BalBtn
        v-else
        color="gradient"
        block
        :disabled="submissionDisabled"
        @click="showPreviewModal = true"
      >
        {{ $t('preview') }}
      </BalBtn>
    </div>
  </BalCard>
  <teleport to="#modal">
    <UnlockPreviewModal
      v-if="showPreviewModal"
      :lockablePool="lockablePool"
      :lockablePoolTokenInfo="lockablePoolTokenInfo"
      :veNFTELockInfo="veNFTELockInfo"
      :totalLpTokens="totalLpTokens"
      :fiatTotalLpTokens="fiatTotalLpTokens"
      @close="showPreviewModal = false"
    />
  </teleport>
</template>
