<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { IndustryItem } from '@/data/content'
import { content } from '@/i18n'

const props = defineProps<{ industries: IndustryItem[] }>()
const router = useRouter()

const rootEl = ref<HTMLElement | null>(null)
const inView = ref(false)
const lockedId = ref<string | null>(null)
const hoveredId = ref<string | null>(null)

let observer: IntersectionObserver | null = null

const activeId = computed(() => lockedId.value ?? hoveredId.value)
const activeIndustry = computed(
  () => props.industries.find((item) => item.id === activeId.value) ?? null
)
const isExpanded = computed(() => !!activeIndustry.value)

const setHover = (id: string | null) => {
  hoveredId.value = id
}

const onBoardPointerLeave = (event: PointerEvent) => {
  const board = event.currentTarget as HTMLElement
  const next = event.relatedTarget as Node | null
  if (next && board.contains(next)) return
  setHover(null)
}

const toggleLock = (id: string) => {
  lockedId.value = lockedId.value === id ? null : id
}

const handleCtaClick = (event: MouseEvent) => {
  event.preventDefault()
  event.stopPropagation()
  router.push({ path: '/contact' })
}

const tileStyle = (industry: IndustryItem) => {
  const style: Record<string, string> = {}
  const deg = industry.imageRotate ?? 0
  if (deg) style['--tile-rotate'] = `${deg}deg`
  if (industry.imagePosition) style['--tile-position'] = industry.imagePosition
  return Object.keys(style).length ? style : undefined
}

onMounted(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) {
    inView.value = true
    return
  }

  const el = rootEl.value
  if (!el) return

  const rect = el.getBoundingClientRect()
  const vh = window.innerHeight
  if (rect.top < vh * 0.88 && rect.bottom > vh * 0.1) {
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
    { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
  )
  observer.observe(el)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <div
    ref="rootEl"
    class="industry-mosaic"
    :class="{
      'industry-mosaic--expanded': isExpanded,
      'industry-mosaic--inview': inView,
    }"
  >
    <div
      class="industry-mosaic__board"
      role="list"
      @pointerleave="onBoardPointerLeave"
    >
      <button
        v-for="(industry, index) in industries"
        :key="industry.id"
        type="button"
        class="industry-mosaic__tile"
        :class="[
          `industry-mosaic__tile--${index + 1}`,
          {
            'industry-mosaic__tile--active': activeId === industry.id,
            'industry-mosaic__tile--dimmed': isExpanded && activeId !== industry.id,
            'industry-mosaic__tile--rotated': !!industry.imageRotate,
          },
        ]"
        :style="tileStyle(industry)"
        role="listitem"
        :aria-expanded="activeId === industry.id"
        :aria-controls="`industry-panel-${industry.id}`"
        @mouseenter="setHover(industry.id)"
        @focus="setHover(industry.id)"
        @pointerenter="setHover(industry.id)"
        @click="toggleLock(industry.id)"
      >
        <span class="industry-mosaic__media">
          <img :src="industry.image" :alt="industry.title" loading="lazy" />
        </span>
        <span class="industry-mosaic__tile-label">{{ industry.title }}</span>
      </button>

      <Transition name="industry-panel">
        <aside
          v-if="activeIndustry"
          :id="`industry-panel-${activeIndustry.id}`"
          class="industry-mosaic__panel"
          :aria-label="activeIndustry.title"
          @pointerenter="setHover(activeIndustry.id)"
          @click.stop
        >
          <h3 class="industry-mosaic__title">{{ activeIndustry.title }}</h3>
          <p class="industry-mosaic__text">
            <span class="industry-mosaic__label">{{ content.ui.industryScenario }}</span>
            {{ activeIndustry.scenario }}
          </p>
          <p class="industry-mosaic__text">
            <span class="industry-mosaic__label">{{ content.ui.industryOffer }}</span>
            {{ activeIndustry.offer }}
          </p>
          <a href="/contact" class="industry-mosaic__cta" @click="handleCtaClick">
            {{ content.ui.industryExpand }}
            <span aria-hidden="true">→</span>
          </a>
        </aside>
      </Transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
.industry-mosaic {
  position: relative;
  width: 100%;

  &__board {
    position: relative;
    display: grid;
    width: 100%;
    gap: 10px;
    grid-template-columns: 1fr;
    grid-auto-rows: minmax(180px, 28vw);
    // 不在 board 上做 clip，避免进场动画被父级裁切
    overflow: visible;

    @include respond-to('m') {
      grid-template-columns: 1.35fr 1fr;
      grid-template-rows: 1fr 1fr;
      aspect-ratio: 16 / 10;
      grid-auto-rows: unset;
      gap: 12px;
      overflow: hidden;
    }

    @include respond-to('l') {
      aspect-ratio: 16 / 9;
      gap: 14px;
    }
  }

  &__tile {
    --tile-rotate: 0deg;
    --tile-position: center center;

    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    min-height: 0;
    padding: 0;
    border: 0;
    overflow: hidden;
    cursor: pointer;
    color: $color-white;
    background-color: #0a1624;
    // 进场：由下向上 + 淡入，错开延迟
    opacity: 0;
    transform: translateY(28px);
    transition:
      opacity 700ms $ease-standard,
      transform 700ms $ease-standard,
      filter 320ms $ease-standard;

    @for $i from 1 through 3 {
      &--#{$i} {
        transition-delay: #{($i - 1) * 140ms};
      }
    }

    @include respond-to('m') {
      &--1 {
        grid-column: 1;
        grid-row: 1 / -1;
      }

      &--2 {
        grid-column: 2;
        grid-row: 1;
      }

      &--3 {
        grid-column: 2;
        grid-row: 2;
      }
    }

    &--active {
      z-index: 2;
      box-shadow: inset 0 0 0 2px $color-white;
    }

    &--dimmed {
      opacity: 0.45;
      filter: grayscale(0.25);
    }

    &:focus-visible {
      @include focus-ring;
      z-index: 3;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 1;
      background: linear-gradient(
        to top,
        rgba(11, 42, 74, 0.55) 0%,
        rgba(11, 42, 74, 0.08) 55%,
        transparent 100%
      );
      pointer-events: none;
      transition: opacity 280ms $ease-standard;
    }
  }

  &--inview &__tile {
    opacity: 1;
    transform: translateY(0);
  }

  &--inview &__tile--dimmed {
    opacity: 0.45;
  }

  // 展开时减弱单图底部标题，避免与浮层文案叠字
  &--expanded &__tile-label {
    opacity: 0;
  }

  &--expanded &__tile::after {
    opacity: 0.35;
  }

  &__media {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    overflow: hidden;

    img {
      display: block;
      width: 100%;
      height: 100%;
      max-width: none;
      object-fit: cover;
      object-position: var(--tile-position);
      transform: rotate(var(--tile-rotate)) scale(1.06);
      transform-origin: center center;
      transition: transform 900ms $ease-standard;
    }
  }

  &--inview &__media img {
    transform: rotate(var(--tile-rotate)) scale(1);
  }

  &__tile--rotated &__media img {
    width: 100%;
    height: 100%;
  }

  &__tile:hover &__media img,
  &__tile--active &__media img {
    transform: rotate(var(--tile-rotate)) scale(1.04);
  }

  &__tile-label {
    position: absolute;
    left: 16px;
    right: 16px;
    bottom: 16px;
    z-index: 2;
    font-size: clamp(14px, 1.6vw, 18px);
    font-weight: $font-bold;
    line-height: 1.35;
    text-align: left;
    text-shadow: 0 1px 8px rgba(11, 42, 74, 0.45);
    transition: opacity 240ms $ease-standard;
  }

  // 直接叠在照片组上（底部渐变浮层）
  &__panel {
    position: absolute;
    inset: auto 0 0;
    z-index: 8;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 48px 24px 28px;
    max-height: 78%;
    overflow-y: auto;
    color: $color-white;
    background: linear-gradient(
      to top,
      rgba(11, 42, 74, 0.96) 0%,
      rgba(11, 42, 74, 0.88) 48%,
      rgba(11, 42, 74, 0.35) 78%,
      rgba(11, 42, 74, 0) 100%
    );
    pointer-events: auto;

    @include respond-to('l') {
      padding: 56px 40px 36px;
      gap: 14px;
      max-height: 70%;
    }
  }

  &__title {
    font-size: clamp(22px, 2.8vw, 32px);
    font-weight: $font-black;
    line-height: 1.25;
    animation: industry-panel-line-up 700ms $ease-standard both;
  }

  &__label {
    display: block;
    margin-bottom: 4px;
    font-size: 12px;
    font-weight: $font-bold;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.72);
  }

  &__text {
    font-size: 15px;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.88);
    max-width: 56ch;
    animation: industry-panel-line-up 700ms $ease-standard both;

    &:nth-of-type(1) {
      animation-delay: 90ms;
    }

    &:nth-of-type(2) {
      animation-delay: 180ms;
    }
  }

  &__cta {
    margin-top: 4px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: $font-bold;
    color: $color-white;
    transition: gap $transition-fast;
    animation: industry-panel-line-up 700ms $ease-standard 260ms both;

    &:hover {
      gap: 12px;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }
}

// 浮层整体：自底部向上擦出 + 上滑
.industry-panel-enter-active,
.industry-panel-leave-active {
  transition:
    clip-path 720ms $ease-standard,
    transform 720ms $ease-standard,
    opacity 520ms $ease-standard;
}

.industry-panel-enter-from,
.industry-panel-leave-to {
  opacity: 0.6;
  transform: translateY(18%);
  clip-path: inset(100% 0 0 0);
}

.industry-panel-enter-to,
.industry-panel-leave-from {
  opacity: 1;
  transform: translateY(0);
  clip-path: inset(0 0 0 0);
}

@keyframes industry-panel-line-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .industry-mosaic {
    &__tile,
    &__media img,
    &__tile-label,
    &__title,
    &__text,
    &__cta {
      opacity: 1;
      transform: none;
      transition: none;
      animation: none;
    }
  }

  .industry-panel-enter-active,
  .industry-panel-leave-active {
    transition: none;
  }

  .industry-panel-enter-from,
  .industry-panel-leave-to {
    opacity: 1;
    transform: none;
    clip-path: none;
  }
}
</style>
