<script setup lang="ts">
/**
 * veNFTE page
 */
import Hero from '@/components/contextual/pages/veNFTE/Hero.vue';
import LMVoting from '@/components/contextual/pages/veNFTE/LMVoting/LMVoting.vue';
import MyveNFTE from '@/components/contextual/pages/veNFTE/MyveNFTE/MyveNFTE.vue';
import { isveNFTESupported } from '@/composables/useveNFTE';
</script>

<template>
  <div>
    <Hero v-if="isveNFTESupported" v-once />

    <div class="py-16 xl:py-20 bg-gray-50 dark:bg-gray-900">
      <div v-if="isveNFTESupported" class="lg:container lg:mx-auto">
        <div class="px-4">
          <MyveNFTE />
        </div>
      </div>
    </div>
    <div
      v-if="isveNFTESupported"
      class="xl:container xl:px-4 pt-16 xl:pt-20 xl:mx-auto"
    >
      <div class="xl:px-0 mb-16">
        <LMVoting />
      </div>
    </div>
    <div v-else class="text-center">
      <div class="text-lg font-semibold">
        {{ $t('veNFTE.notSupported.title') }}
      </div>
      <div>{{ $t('veNFTE.notSupported.description') }}</div>
    </div>
  </div>
</template>
