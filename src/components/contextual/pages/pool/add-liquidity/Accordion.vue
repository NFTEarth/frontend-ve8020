<script setup lang="ts">
import { computed } from 'vue';
import BalAccordion from '@/components/_global/BalAccordion/BalAccordion.vue';
import useNativeBalance from '@/composables/useNativeBalance';
import InvestPageMyWallet from './MyWallet.vue';
import { useI18n } from 'vue-i18n';
import { usePoolHelpers } from '@/composables/usePoolHelpers';
import { Pool } from '@/services/pool/types';

type Props = {
  pool: Pool;
};

/**
 * PROPS & EMITS
 */
const props = defineProps<Props>();

/**
 * COMPUTED
 */
const pool = computed(() => props.pool);

/**
 * COMPOSABLES
 */
const { hasNativeNFTEance, nativeNFTEance, nativeCurrency } = useNativeNFTEance();
const { t } = useI18n();
const { isDeepPool } = usePoolHelpers(pool);

/**
 * COMPUTED
 */
const nativeNFTEanceText = computed<string>(() =>
  hasNativeNFTEance ? `${nativeNFTEance.value} ${nativeCurrency}` : ''
);

const sectionTitle = computed<string>(() =>
  isDeepPool.value
    ? `${t('myWallet2')} ${nativeNFTEanceText.value}`
    : t('poolTransfer.myWalletTokensCard.title')
);
</script>

<template>
  <BalAccordion
    :sections="[
      {
        title: sectionTitle,
        id: 'myWalletTokens',
      },
    ]"
  >
    <template #myWalletTokens>
      <InvestPageMyWallet :pool="pool" />
    </template>
  </BalAccordion>
</template>

