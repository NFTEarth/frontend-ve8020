<script setup lang="ts">
import { computed } from 'vue';

import Col3Layout from '@/components/layouts/Col3Layout.vue';
import usePoolQuery from '@/composables/queries/usePoolQuery';
import useveNFTELockInfoQuery from '@/composables/queries/useveNFTELockInfoQuery';
import { useTokens } from '@/providers/tokens.provider';
import useveNFTE from '@/composables/useveNFTE';
import { Pool } from '@/services/pool/types';
import useWeb3 from '@/services/web3/useWeb3';

import MyveNFTE from '../LockForm/components/MyveNFTE.vue';
import veNFTEUnlockForm from './components/veNFTEUnlockForm/veNFTEUnlockForm.vue';

/**
 * COMPOSABLES
 */
const { getToken } = useTokens();
const { isWalletReady } = useWeb3();
const { lockablePoolId } = useveNFTE();

/**
 * QUERIES
 */
const lockablePoolQuery = usePoolQuery(lockablePoolId.value as string);
const veNFTELockInfoQuery = useveNFTELockInfoQuery();

/**
 * COMPUTED
 */
const lockablePoolLoading = computed(() => lockablePoolQuery.isLoading.value);

const veNFTEQueryLoading = computed(() => veNFTELockInfoQuery.isLoading.value);

const lockablePool = computed<Pool | undefined>(
  () => lockablePoolQuery.data.value
);

const lockablePoolTokenInfo = computed(() =>
  lockablePool.value != null ? getToken(lockablePool.value.address) : null
);

const veNFTELockInfo = computed(() => veNFTELockInfoQuery.data.value);

const isLoading = computed(() =>
  isWalletReady.value
    ? lockablePoolLoading.value || veNFTEQueryLoading.value
    : lockablePoolLoading.value
);
</script>

<template>
  <Col3Layout offsetGutters>
    <BalLoadingBlock
      v-if="
        isLoading || !veNFTELockInfo || !lockablePool || !lockablePoolTokenInfo
      "
      class="h-96"
    />
    <veNFTEUnlockForm
      v-else
      :key="
        veNFTELockInfo?.hasExistingLock
          ? 'veNFTEUnlockForm-hasLock'
          : 'veNFTEUnlockForm-noLock'
      "
      :lockablePool="lockablePool"
      :lockablePoolTokenInfo="lockablePoolTokenInfo"
      :veNFTELockInfo="veNFTELockInfo"
    />

    <template #gutterRight>
      <BalLoadingBlock v-if="isLoading" class="h-64" />
      <MyveNFTE v-else :veNFTELockInfo="veNFTELockInfo" />
    </template>
  </Col3Layout>
</template>
