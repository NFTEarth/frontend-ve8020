<script setup lang="ts">
import UnlockForm from '@/components/forms/lock_actions/UnlockForm/UnlockForm.vue';
import { isveNFTESupported } from '@/composables/useveNFTE';
</script>

<template>
  <UnlockForm v-if="isveNFTESupported" />
  <div v-else class="text-center">
    <div class="text-lg font-semibold">
      {{ $t('veNFTE.notSupported.title') }}
    </div>
    <div>{{ $t('veNFTE.notSupported.description') }}</div>
  </div>
</template>
