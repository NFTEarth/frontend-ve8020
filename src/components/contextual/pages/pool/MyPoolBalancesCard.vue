<script setup lang="ts">
import { computed, toRef } from 'vue';
import { useRouter } from 'vue-router';

import useNumbers, { FNumFormats } from '@/composables/useNumbers';
import {
  fiatValueOf,
  isveNFTEPool,
  usePoolHelpers,
} from '@/composables/usePoolHelpers';
import { useTokens } from '@/providers/tokens.provider';
import useNetwork from '@/composables/useNetwork';
import { bnum } from '@/lib/utils';
import { Pool } from '@/services/pool/types';
import useWeb3 from '@/services/web3/useWeb3';

import PoolActionsCard from './PoolActionsCard.vue';
import { usePoolStaking } from '@/providers/local/pool-staking.provider';
import { useLock } from '@/composables/useLock';
import { configService } from '@/services/config/config.service';

/**
 * TYPES
 */
type Props = {
  pool: Pool;
  missingPrices: boolean;
};

/**
 * PROPS & EMITS
 */
const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'risksClicked'): void;
}>();

/**
 * COMPOSABLES
 */
const { balanceFor } = useTokens();
const { fNum } = useNumbers();
const { isWalletReady } = useWeb3();
const { isMigratablePool } = usePoolHelpers(toRef(props, 'pool'));
const { stakedShares } = usePoolStaking();
const { networkSlug } = useNetwork();
const router = useRouter();
const { totalLockedValue } = useLock();

/**
 * COMPUTED
 */
const bptBalance = computed((): string =>
  bnum(balanceFor(props.pool.address)).plus(stakedShares.value).toString()
);

const fiatValue = computed(() => {
  if (isveNFTEPool(props.pool.id)) return totalLockedValue.value;

  return fiatValueOf(props.pool, bptBalance.value);
});

const showMigrateButton = computed(
  () =>
    (bnum(bptBalance.value).gt(0) || bnum(stakedShares.value).gt(0)) &&
    isMigratablePool(props.pool)
);

/**
 * METHODS
 */
function navigateToPoolMigration(pool: Pool) {
  router.push({
    name: 'migrate-pool',
    params: {
      from: pool.id,
      to: configService.network.pools.Migrations?.[pool.id].toPoolId,
    },
    query: {
      returnRoute: 'pool',
      returnParams: JSON.stringify({ id: pool.id, networkSlug }),
    },
  });
}
</script>

<template>
  <BalCard shadow="2xl" noPad class="rounded-xl">
    <template #header>
      <div class="card-header">
        <h5>
          {{ $t('poolTransfer.myPoolBalancesCard.title') }}
        </h5>
        <h5 class="text-2xl">
          {{ isWalletReady ? fNum(fiatValue, FNumFormats.fiat) : '-' }}
        </h5>
      </div>
    </template>
    <div v-if="showMigrateButton" class="py-2 px-4">
      <BalBtn
        color="blue"
        block
        @click.prevent="navigateToPoolMigration(props.pool)"
      >
        {{ $t('migratePool.migrateLiquidity') }}
      </BalBtn>
    </div>
    <template #footer>
      <PoolActionsCard
        :pool="pool"
        :missingPrices="missingPrices"
        @risks-clicked="emit('risksClicked')"
      />
    </template>
  </BalCard>
</template>

<style scoped>
.card-header {
  @apply p-4 w-full flex items-center justify-between;
  @apply border-b dark:border-gray-700;
}

.asset-row {
  @apply py-3 flex justify-between items-center text-lg;
}
</style>
