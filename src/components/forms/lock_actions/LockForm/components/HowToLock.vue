<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { Pool } from '@/services/pool/types';
import { TokenInfo } from '@/types/TokenList';

import useNetwork from '@/composables/useNetwork';

/**
 * TYPES
 */
type Props = {
  lockablePool: Pool;
  lockablePoolTokenInfo: TokenInfo;
};

/**
 * PROPS
 */
const props = defineProps<Props>();

/**
 * COMPOSABLES
 */
const { t } = useI18n();
const { networkSlug } = useNetwork();

/**
 * COMPUTED
 */
const steps = computed(() => [
  t('getveNFTE.howToLock.steps.lock', [props.lockablePoolTokenInfo.symbol]),
  t('getveNFTE.howToLock.earn.boost'),
  t('getveNFTE.howToLock.earn.voting'),
]);
</script>

<template>
  <BalAccordion
    class="mt-4"
    :showSectionBorder="false"
    :sections="[
      {
        title: $t('getveNFTE.howToLock.title'),
        id: 'how-to-lock',
        handle: 'how-to-lock-handle',
      },
    ]"
  >
    <template #how-to-lock-handle>
      <button
        class="group flex justify-between items-center p-4 w-full rounded-xl"
      >
        <h6 class="group-hover:text-blue-500 transition-colors">
          {{ $t('getveNFTE.howToLock.title') }}
        </h6>
        <BalIcon
          name="chevron-down"
          class="text-blue-500 group-hover:text-pink-500 transition-colors"
        />
      </button>
    </template>
    <template #how-to-lock>
      <div class="p-4 border-t dark:border-gray-900">
        <div class="text-secondary">
          <ol class="text-sm steps">
            <li>
              {{ $t('getveNFTE.howToLock.steps.investPart1') }}
              <BalLink
                tag="router-link"
                :to="{
                  name: 'add-liquidity',
                  params: { networkSlug, id: lockablePool.id },
                }"
                external
              >
                {{ lockablePoolTokenInfo.symbol }}
              </BalLink>
              {{ $t('getveNFTE.howToLock.steps.investPart2') }}
            </li>
            <li v-for="(step, i) in steps" :key="i" v-html="step" />
          </ol>
        </div>
      </div>
    </template>
  </BalAccordion>
</template>
<style scoped>
.steps {
  @apply list-decimal px-4;
}

.steps li {
  @apply pb-2;
}
</style>
