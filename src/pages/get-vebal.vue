<script setup lang="ts">
import LockForm from '@/components/forms/lock_actions/LockForm/LockForm.vue';
import { isveNFTESupported } from '@/composables/useveNFTE';
</script>

<template>
  <LockForm v-if="isveNFTESupported" />
  <div v-else class="text-center">
    <div class="text-lg font-semibold">
      {{ $t('veNFTE.notSupported.title') }}
    </div>
    <div>{{ $t('veNFTE.notSupported.description') }}</div>
  </div>
</template>
