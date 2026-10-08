<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { StatItem } from '@/data/content'
import { content } from '@/i18n'

interface Props {
  stats: StatItem[]
}

defineProps<Props>()

const router = useRouter()
const rootEl = ref<HTMLElement | null>(null)
const inView = ref(false)

let observer: IntersectionObserver | null = null

onMounted(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) {
    inView.value = true
    return
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return
      inView.value = true
      observer?.disconnect()
      observer = null
    },
    { threshold: 0.22, rootMargin: '0px 0px -10% 0px' }
  )

  if (rootEl.value) observer.observe(rootEl.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})

const handleCtaClick = (event: MouseEvent) => {
  const to = content.value.statsSection.ctaTo
  if (to.startsWith('#')) {
    event.preventDefault()
    document.getElementById(to.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }
  if (to.startsWith('/')) {
    event.preventDefault()
    router.push(to)
  }
}
</script>

<template>
  <section
    id="stats"
    ref="rootEl"
    class="stat-block"
    :class="{ 'stat-block--inview': inView }"
    :aria-label="content.ui.statAria"
  >
    <div class="stat-block__inner">
      <div class="stat-block__intro">
        <div class="stat-block__mask stat-block__mask--eyebrow">
          <p class="stat-block__eyebrow">{{ content.statsSection.eyebrow }}</p>
        </div>
        <div class="stat-block__mask stat-block__mask--title">
          <h2 class="stat-block__title">{{ content.statsSection.title }}</h2>
        </div>
        <div class="stat-block__mask stat-block__mask--subtitle">
          <p class="stat-block__subtitle">{{ content.statsSection.subtitle }}</p>
        </div>
        <p class="stat-block__body">{{ content.statsSection.body }}</p>
        <a
          class="stat-block__cta"
          :href="content.statsSection.ctaTo"
          :aria-label="content.statsSection.ctaAria"
          @click="handleCtaClick"
        >
          <span class="stat-block__cta-icon" aria-hidden="true">→</span>
        </a>
      </div>

      <div class="stat-block__panel">
        <ul class="stat-block__grid">
          <li
            v-for="(stat, index) in stats"
            :key="stat.value"
            class="stat-block__item"
          >
            <p class="stat-block__value" :aria-label="stat.value">
              {{ stat.value }}
            </p>
            <div class="stat-block__desc-mask">
              <p class="stat-block__desc">{{ stat.description }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.stat-block {
  --stat-accent: #1a1a1a;
  --stat-ink: #1a1a1a;
  --stat-muted: #8a8a8a;

  scroll-margin-top: calc(#{$header-height} + 16px);
  background-color: $color-white;
  color: var(--stat-ink);
  padding-block: 64px 72px;

  @include respond-to('l') {
    padding-block: 96px 112px;
  }

  &__inner {
    @include container;
    display: grid;
    gap: 56px;

    @include respond-to('l') {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
      gap: 48px 64px;
      align-items: stretch;
    }
  }

  &__intro {
    max-width: 520px;
    align-self: center;
  }

  // 顶部滑入：遮罩裁切 + 文字自上而下滑入
  &__mask {
    overflow: hidden;

    &--eyebrow {
      margin-bottom: 20px;
    }

    &--subtitle {
      margin-top: 12px;
    }
  }

  &__eyebrow,
  &__title,
  &__subtitle {
    transform: translateY(-110%);
    transition: transform 900ms $ease-standard;
  }

  &__eyebrow {
    font-size: 14px;
    font-weight: $font-regular;
    letter-spacing: 0.08em;
    color: var(--stat-accent);
  }

  &__title {
    font-size: clamp(26px, 3.2vw, 36px);
    font-weight: $font-black;
    line-height: 1.25;
    letter-spacing: -0.01em;
    color: var(--stat-ink);
    transition-delay: 120ms;
  }

  &__subtitle {
    font-size: 16px;
    line-height: 1.6;
    color: var(--stat-ink);
    transition-delay: 240ms;
  }

  &__body {
    position: relative;
    margin-top: 40px;
    padding-left: 20px;
    font-size: 14px;
    line-height: 1.9;
    color: var(--stat-muted);
    clip-path: inset(0 100% 0 0);
    transition: clip-path 1.2s $ease-standard 380ms;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0.35em;
      bottom: 0.35em;
      width: 2px;
      background-color: var(--stat-accent);
    }
  }

  &__cta {
    margin-top: 36px;
    width: 44px;
    height: 44px;
    display: inline-grid;
    place-items: center;
    border: 1px solid rgba(26, 26, 26, 0.28);
    border-radius: 50%;
    color: var(--stat-ink);
    transition:
      border-color $transition-fast,
      background-color $transition-fast,
      color $transition-fast,
      transform $transition-fast;

    &:hover {
      border-color: var(--stat-accent);
      color: var(--stat-accent);
      transform: translateX(2px);
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__cta-icon {
    font-size: 18px;
    line-height: 1;
    transform: translateY(-1px);
  }

  &__panel {
    position: relative;
    min-height: 480px;
    display: grid;
    place-items: center;
    overflow: hidden;

    @include respond-to('l') {
      min-height: 0;
      align-self: stretch;
      height: 100%;
    }
  }

  &__grid {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 36px;
    width: min(100%, 320px);
    padding-block: 24px;
  }

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;

    @for $i from 1 through 4 {
      &:nth-child(#{$i}) {
        .stat-block__desc {
          transition-delay: #{420ms + ($i - 1) * 120ms};
        }
      }
    }
  }

  &__value {
    font-size: clamp(36px, 4vw, 48px);
    font-weight: $font-bold;
    line-height: 1;
    letter-spacing: -0.02em;
    color: var(--stat-accent);
    font-variant-numeric: tabular-nums;
  }

  &__desc-mask {
    overflow: hidden;
    max-width: 260px;
  }

  &__desc {
    font-size: 13px;
    line-height: 1.55;
    color: var(--stat-muted);
    // 自底部向上滑入
    transform: translateY(110%);
    transition: transform 850ms $ease-standard;
  }

  &--inview {
    .stat-block__eyebrow,
    .stat-block__title,
    .stat-block__subtitle {
      transform: translateY(0);
    }

    .stat-block__body {
      clip-path: inset(0 0 0 0);
    }

    .stat-block__desc {
      transform: translateY(0);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .stat-block {
    &__eyebrow,
    &__title,
    &__subtitle,
    &__body,
    &__desc {
      transform: none;
      clip-path: none;
      transition: none;
    }
  }
}
</style>
