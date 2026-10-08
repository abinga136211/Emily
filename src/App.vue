<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import CookieBanner from '@/components/ui/CookieBanner.vue'
import { startSiteConfigSync, stopSiteConfigSync } from '@/composables/useSiteConfig'

const route = useRoute()
const isAdmin = computed(() => route.path.startsWith('/admin'))
const isNotFound = computed(() => route.name === 'not-found')

onMounted(() => {
  startSiteConfigSync()
})

onBeforeUnmount(() => {
  stopSiteConfigSync()
})
</script>

<template>
  <template v-if="isAdmin">
    <RouterView />
  </template>
  <template v-else>
    <AppHeader />
    <main id="main">
      <RouterView />
    </main>
    <AppFooter v-if="!isNotFound" />
    <CookieBanner />
  </template>
</template>
