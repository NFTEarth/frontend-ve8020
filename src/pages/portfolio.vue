<script setup lang="ts">
import StakedPoolsTable from '@/components/contextual/pages/pools/StakedPoolsTable.vue';
import UnstakedPoolsTable from '@/components/contextual/pages/pools/UnstakedPoolsTable.vue';
import veNFTEPoolTable from '@/components/contextual/pages/pools/veNFTEPoolTable.vue';
import PortfolioPageHero from '@/components/heros/PortfolioPageHero.vue';
import { useLock } from '@/composables/useLock';
import { providerUserPools } from '@/providers/local/user-pools.provider';
import { provideUserStaking } from '@/providers/local/user-staking.provider';

/**
 * PROVIDERS
 */
const userStaking = provideUserStaking();
providerUserPools(userStaking);

/**
 * COMPOSABLES
 */
const { lockPool, lock } = useLock();
</script>

<template>
  <div>
    <PortfolioPageHero />
    <div class="xl:container xl:px-4 pt-10 md:pt-12 xl:mx-auto">
      <BalStack vertical>
        <div class="px-4 xl:px-0">
          <BalStack horizontal justify="between" align="center">
            <h3>{{ $t('myLiquidityInBalancerPools') }}</h3>
          </BalStack>
        </div>
        <BalStack vertical spacing="2xl">
          <UnstakedPoolsTable />
          <StakedPoolsTable />
          <veNFTEPoolTable
            v-if="lockPool && Number(lock?.lockedAmount) > 0"
            :lock="lock"
            :lockPool="lockPool"
          />
        </BalStack>
      </BalStack>
    </div>
  </div>
</template>
