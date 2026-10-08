<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import EyebrowLabel from '@/components/ui/EyebrowLabel.vue'
import { content } from '@/i18n'

const REDIRECT_SECONDS = 3

const router = useRouter()
const secondsLeft = ref(REDIRECT_SECONDS)
const pageEntered = ref(false)

let tickTimer: ReturnType<typeof setInterval> | null = null
let redirectTimer: ReturnType<typeof setTimeout> | null = null

const syncTitle = () => {
  document.title = content.value.notFoundPage.metaTitle
}

const redirectHint = computed(() =>
  content.value.notFoundPage.redirectHint.replace('{n}', String(secondsLeft.value))
)

const progressRatio = computed(() =>
  Math.max(0, Math.min(1, secondsLeft.value / REDIRECT_SECONDS))
)

const goHome = () => {
  clearTimers()
  router.replace({ name: 'home' })
}

const clearTimers = () => {
  if (tickTimer) {
    clearInterval(tickTimer)
    tickTimer = null
  }
  if (redirectTimer) {
    clearTimeout(redirectTimer)
    redirectTimer = null
  }
}

onMounted(() => {
  syncTitle()
  requestAnimationFrame(() => {
    pageEntered.value = true
  })

  tickTimer = setInterval(() => {
    secondsLeft.value = Math.max(0, secondsLeft.value - 1)
  }, 1000)

  redirectTimer = setTimeout(() => {
    goHome()
  }, REDIRECT_SECONDS * 1000)
})

watch(() => content.value.notFoundPage.metaTitle, syncTitle)

onBeforeUnmount(() => {
  clearTimers()
  document.title = content.value.meta.title
})
</script>

<template>
  <div class="not-found" :class="{ 'not-found--entered': pageEntered }">
    <div class="not-found__glow" aria-hidden="true" />
    <div class="not-found__inner">
      <EyebrowLabel :text="content.notFoundPage.eyebrow" color="white" />
      <p class="not-found__code" aria-hidden="true">{{ content.notFoundPage.code }}</p>
      <h1 class="not-found__title">{{ content.notFoundPage.title }}</h1>
      <p class="not-found__lead">{{ content.notFoundPage.lead }}</p>

      <div class="not-found__redirect" role="status" aria-live="polite">
        <p class="not-found__hint">{{ redirectHint }}</p>
        <div class="not-found__track" aria-hidden="true">
          <span
            class="not-found__bar"
            :style="{ transform: `scaleX(${progressRatio})` }"
          />
        </div>
      </div>

      <RouterLink
        class="btn btn--white not-found__cta"
        :to="{ name: 'home' }"
        @click="clearTimers"
      >
        {{ content.notFoundPage.ctaText }}
      </RouterLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.not-found {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: 100vh;
  padding-top: $header-height;
  display: grid;
  place-items: center;
  color: $color-white;
  background:
    radial-gradient(ellipse 70% 55% at 18% 20%, rgba(255, 255, 255, 0.08), transparent 55%),
    radial-gradient(ellipse 55% 45% at 88% 78%, rgba(18, 58, 95, 0.9), transparent 60%),
    linear-gradient(160deg, #071a2e 0%, $color-primary-deep 42%, #0e2438 100%);

  &__glow {
    position: absolute;
    inset: auto -10% -20% auto;
    width: min(56vw, 520px);
    height: min(56vw, 520px);
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.06), transparent 68%);
    pointer-events: none;
    z-index: 0;
  }

  &__inner {
    @include container;
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 720px;
    padding-block: 72px 88px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    opacity: 0;
    transform: translateY(18px);
    transition:
      opacity 0.65s $ease-standard,
      transform 0.65s $ease-standard;

    @include respond-to('l') {
      padding-block: 96px 112px;
    }
  }

  &--entered &__inner {
    opacity: 1;
    transform: translateY(0);
  }

  &__code {
    margin-top: 8px;
    font-size: clamp(72px, 14vw, 128px);
    font-weight: $font-black;
    line-height: 0.9;
    letter-spacing: -0.04em;
    color: rgba($color-white, 0.94);
  }

  &__title {
    font-size: clamp(28px, 4vw, 40px);
    font-weight: $font-black;
    line-height: 1.2;
    letter-spacing: -0.01em;
  }

  &__lead {
    max-width: 28em;
    font-size: clamp(16px, 1.5vw, 18px);
    line-height: 1.7;
    color: rgba($color-white, 0.78);
  }

  &__redirect {
    width: 100%;
    max-width: 320px;
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__hint {
    font-size: 14px;
    letter-spacing: 0.04em;
    color: rgba($color-white, 0.68);
  }

  &__track {
    height: 2px;
    width: 100%;
    background-color: rgba($color-white, 0.16);
    overflow: hidden;
  }

  &__bar {
    display: block;
    height: 100%;
    width: 100%;
    transform-origin: left center;
    background-color: $color-white;
    transition: transform 1s linear;
  }

  &__cta {
    margin-top: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .not-found__inner {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .not-found__bar {
    transition: none;
  }
}
</style>
