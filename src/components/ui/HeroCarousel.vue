<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { content } from '@/i18n'

interface Slide {
  image: string
  alt: string
  title?: string
  titleAlt?: string
  subtitle?: string
  align?: 'left' | 'center'
  nowrap?: boolean
  imagePosition?: string
  ctaText?: string
  ctaTo?: string
}

const props = defineProps<{
  slides: Slide[]
  interval?: number
  /** 首屏锁定：先看完所有幻灯片，再自动滚到下方区块 */
  gateScroll?: boolean
  /** 解锁后滚动到的目标选择器，默认下一节 .stat-block */
  releaseTarget?: string
}>()

const router = useRouter()
const intervalMs = computed(() => props.interval ?? 5500)
const current = ref(0)
const paused = ref(false)
const reduceMotion = ref(false)
const introLocked = ref(false)
const visited = ref<Set<number>>(new Set([0]))

let timer: ReturnType<typeof setInterval> | null = null
let scrollTimer: ReturnType<typeof setTimeout> | null = null
let wheelCooldown = false
let touchStartY = 0

const slideCount = computed(() => props.slides.length)
const activeSlide = computed(() => props.slides[current.value])
const showCopy = computed(
  () => !!(activeSlide.value?.title || activeSlide.value?.subtitle)
)
const isCenter = computed(() => activeSlide.value?.align === 'center')
const isLastSlide = computed(() => current.value >= slideCount.value - 1)
const allSlidesSeen = computed(
  () => visited.value.size >= slideCount.value && slideCount.value > 0
)
/** 四张都看过后，下一次向前切换 / 下滑即进入数据区 */
const readyToRelease = computed(() => allSlidesSeen.value)

const markVisited = (index: number) => {
  if (visited.value.has(index)) return
  const nextSet = new Set(visited.value)
  nextSet.add(index)
  visited.value = nextSet
}

const clearScrollTimer = () => {
  if (scrollTimer !== null) {
    clearTimeout(scrollTimer)
    scrollTimer = null
  }
}

const setBodyScrollLock = (locked: boolean) => {
  document.documentElement.classList.toggle('hero-intro-locked', locked)
  // 通知顶栏等依赖 scroll 的逻辑刷新（锁定时可能收不到原生 scroll）
  window.dispatchEvent(new Event('scroll'))
}

const scrollToReleaseTarget = () => {
  const selector = props.releaseTarget ?? '#stats'
  const target = document.querySelector(selector)
  if (!(target instanceof HTMLElement)) {
    ;(window as unknown as { __skmcScroll?: unknown }).__skmcScroll = { ok: false, reason: 'no-target', selector }
    return
  }

  const headerOffset = 96
  const top = Math.max(
    0,
    Math.round(target.getBoundingClientRect().top + window.scrollY - headerOffset)
  )
  ;(window as unknown as { __skmcScroll?: unknown }).__skmcScroll = {
    ok: true,
    top,
    before: window.scrollY,
    selector,
  }
  window.scrollTo({ top, behavior: reduceMotion.value ? 'auto' : 'smooth' })
  ;(window as unknown as { __skmcScroll?: { after?: number } }).__skmcScroll.after = window.scrollY
}

const unlockIntro = (scroll = true) => {
  if (!introLocked.value) return
  clearScrollTimer()
  introLocked.value = false
  setBodyScrollLock(false)
  if (scroll) {
    // 用户手势触发时尽快滚入，避免再空等
    const delay = reduceMotion.value ? 40 : 180
    scrollTimer = setTimeout(() => {
      scrollTimer = null
      scrollToReleaseTarget()
    }, delay)
  }
  startAutoplay()
}

/** 供顶栏等外部导航在锁定期间强制解锁（不自动滚到数据区） */
const onExternalUnlock = () => unlockIntro(false)

const goTo = (index: number) => {
  if (slideCount.value === 0) return
  current.value = ((index % slideCount.value) + slideCount.value) % slideCount.value
  markVisited(current.value)
}

const next = () => {
  // 四张都看完后：再次向前切换 → 进入 #stats
  if (introLocked.value && allSlidesSeen.value) {
    unlockIntro(true)
    return
  }
  if (introLocked.value && isLastSlide.value && !allSlidesSeen.value) {
    for (let i = 0; i < slideCount.value; i++) {
      if (!visited.value.has(i)) {
        goTo(i)
        return
      }
    }
  }
  goTo(current.value + 1)
}

const prev = () => {
  if (introLocked.value && current.value === 0) return
  goTo(current.value - 1)
}

const stopAutoplay = () => {
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
}

const startAutoplay = () => {
  stopAutoplay()
  // 首屏锁定期间只用滚轮/按钮切换，避免自动播完直接跳过
  if (introLocked.value || reduceMotion.value || slideCount.value <= 1) return
  timer = setInterval(() => {
    if (!paused.value) next()
  }, intervalMs.value)
}

const advanceFromGesture = (direction: 1 | -1) => {
  if (!introLocked.value) return false
  if (direction > 0) {
    next()
  } else {
    prev()
  }
  return true
}

const onWheel = (event: WheelEvent) => {
  if (!introLocked.value) return
  if (Math.abs(event.deltaY) < 8) return
  event.preventDefault()
  if (wheelCooldown) return
  wheelCooldown = true
  window.setTimeout(() => {
    wheelCooldown = false
  }, 750)
  advanceFromGesture(event.deltaY > 0 ? 1 : -1)
}

const onTouchStart = (event: TouchEvent) => {
  if (!introLocked.value) return
  touchStartY = event.touches[0]?.clientY ?? 0
}

const onTouchEnd = (event: TouchEvent) => {
  if (!introLocked.value) return
  const endY = event.changedTouches[0]?.clientY ?? touchStartY
  const delta = touchStartY - endY
  if (Math.abs(delta) < 48) return
  advanceFromGesture(delta > 0 ? 1 : -1)
}

onMounted(() => {
  reduceMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // 刷新 / 进入首页时强制回到顶端，再决定是否锁定首屏
  if (props.gateScroll) {
    window.scrollTo({ top: 0 })
  }

  const shouldGate =
    !!props.gateScroll &&
    !reduceMotion.value &&
    slideCount.value > 1

  if (shouldGate) {
    introLocked.value = true
    visited.value = new Set([0])
    current.value = 0
    window.scrollTo({ top: 0 })
    setBodyScrollLock(true)
  }

  startAutoplay()

  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchend', onTouchEnd, { passive: true })
  window.addEventListener('skmc:hero-unlock', onExternalUnlock)
})

onBeforeUnmount(() => {
  stopAutoplay()
  clearScrollTimer()
  if (introLocked.value) setBodyScrollLock(false)
  window.removeEventListener('wheel', onWheel)
  window.removeEventListener('touchstart', onTouchStart)
  window.removeEventListener('touchend', onTouchEnd)
  window.removeEventListener('skmc:hero-unlock', onExternalUnlock)
})

watch([intervalMs, slideCount, reduceMotion, introLocked], startAutoplay)

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    next()
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    prev()
  } else if (introLocked.value && (event.key === 'ArrowDown' || event.key === 'PageDown')) {
    event.preventDefault()
    next()
  } else if (introLocked.value && (event.key === 'ArrowUp' || event.key === 'PageUp')) {
    event.preventDefault()
    prev()
  }
}

const handleCtaClick = (event: MouseEvent) => {
  const to = activeSlide.value?.ctaTo
  if (!to) return
  if (to.startsWith('#')) {
    event.preventDefault()
    if (introLocked.value) unlockIntro(false)
    document.getElementById(to.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return
  }
  if (to.startsWith('/')) {
    event.preventDefault()
    if (introLocked.value) unlockIntro(false)
    router.push(to)
  }
}

const scrollToStats = () => {
  const target = document.getElementById('stats')
  if (!(target instanceof HTMLElement)) return
  const top = Math.max(
    0,
    Math.round(target.getBoundingClientRect().top + window.scrollY - 96)
  )
  window.scrollTo({ top, behavior: reduceMotion.value ? 'auto' : 'smooth' })
}
</script>

<template>
  <section
    id="top"
    class="hero-carousel"
    :class="{
      'hero-carousel--with-copy': showCopy,
      'hero-carousel--center': isCenter,
      'hero-carousel--intro-locked': introLocked,
    }"
    aria-roledescription="carousel"
    :aria-label="content.ui.heroCarouselAria"
    tabindex="0"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
    @focusin="paused = true"
    @focusout="paused = false"
    @keydown="onKeydown"
  >
    <div class="hero-carousel__track">
      <figure
        v-for="(slide, index) in slides"
        :key="slide.image"
        class="hero-carousel__slide"
        :class="{ 'hero-carousel__slide--active': index === current }"
        :aria-hidden="index !== current"
      >
        <img
          :src="slide.image"
          :alt="slide.alt"
          :style="slide.imagePosition ? { objectPosition: slide.imagePosition } : undefined"
          :loading="index === 0 ? 'eager' : 'lazy'"
          :fetchpriority="index === 0 ? 'high' : 'auto'"
        />
      </figure>
    </div>

    <div class="hero-carousel__veil" aria-hidden="true" />
    <div class="hero-carousel__scrim" aria-hidden="true" />

    <div
      v-if="showCopy && activeSlide"
      class="hero-carousel__copy"
      :class="{
        'hero-carousel__copy--center': activeSlide.align === 'center',
        'hero-carousel__copy--nowrap': activeSlide.nowrap,
      }"
    >
      <div class="hero-carousel__copy-inner">
        <h1 v-if="activeSlide.title" class="hero-carousel__title">
          {{ activeSlide.title }}
        </h1>
        <p v-if="activeSlide.titleAlt" class="hero-carousel__title-alt">
          {{ activeSlide.titleAlt }}
        </p>
        <p v-if="activeSlide.subtitle" class="hero-carousel__subtitle">
          {{ activeSlide.subtitle }}
        </p>
        <a
          v-if="activeSlide.ctaText"
          class="btn btn--white hero-carousel__cta"
          :href="activeSlide.ctaTo || '/contact'"
          @click="handleCtaClick"
        >
          {{ activeSlide.ctaText }}
        </a>
      </div>
    </div>

    <div class="hero-carousel__controls">
      <button
        type="button"
        class="hero-carousel__arrow hero-carousel__arrow--prev"
        :aria-label="content.ui.heroPrev"
        @click="prev"
      >
        <span aria-hidden="true">‹</span>
      </button>
      <button
        type="button"
        class="hero-carousel__arrow hero-carousel__arrow--next"
        :aria-label="content.ui.heroNext"
        @click="next"
      >
        <span aria-hidden="true">›</span>
      </button>
    </div>

    <div class="hero-carousel__dots" :aria-label="content.ui.heroDotsAria" role="tablist">
      <button
        v-for="(slide, index) in slides"
        :key="`dot-${slide.image}`"
        type="button"
        class="hero-carousel__dot"
        :class="{
          'hero-carousel__dot--active': index === current,
          'hero-carousel__dot--seen': visited.has(index),
        }"
        role="tab"
        :aria-selected="index === current"
        :aria-label="`${content.ui.heroSlideLabel} ${index + 1}`"
        @click="goTo(index)"
      />
    </div>

    <button
      type="button"
      class="hero-carousel__hint"
      :aria-label="content.ui.heroScrollHint"
      @click="scrollToStats"
    >
      <span class="hero-carousel__hint-text">{{ content.ui.heroScrollHint }}</span>
      <span class="hero-carousel__hint-chevron" aria-hidden="true" />
    </button>
  </section>
</template>

<style scoped lang="scss">
.hero-carousel {
  position: relative;
  width: 100%;
  height: clamp(420px, 72vh, 760px);
  overflow: hidden;
  background-color: $color-primary-deep;
  outline: none;

  &__track {
    position: absolute;
    inset: 0;
  }

  &__slide {
    position: absolute;
    inset: 0;
    margin: 0;
    opacity: 0;
    transition: opacity 900ms $ease-standard;
    pointer-events: none;

    &--active {
      opacity: 1;
      pointer-events: auto;
      z-index: 1;
    }

    img {
      width: 100%;
      height: 100%;
      max-width: none;
      object-fit: cover;
      object-position: center center;
      transform: scale(1.04);
      transform-origin: center center;
      transition: transform 6.5s $ease-standard;
    }

    &--active img {
      transform: scale(1);
    }
  }

  &__veil {
    position: absolute;
    inset: 0 0 auto;
    height: 140px;
    z-index: 2;
    background: linear-gradient(
      to bottom,
      rgba(11, 42, 74, 0.45) 0%,
      rgba(11, 42, 74, 0) 100%
    );
    pointer-events: none;
  }

  &__scrim {
    position: absolute;
    inset: 0;
    z-index: 2;
    background: linear-gradient(
      105deg,
      rgba(11, 42, 74, 0.72) 0%,
      rgba(11, 42, 74, 0.42) 38%,
      rgba(11, 42, 74, 0.08) 62%,
      transparent 78%
    );
    pointer-events: none;
    opacity: 0;
    transition: opacity 500ms $ease-standard;
  }

  &--with-copy &__scrim {
    opacity: 1;
  }

  &--center &__scrim {
    background: radial-gradient(
      ellipse 70% 55% at 50% 48%,
      rgba(11, 42, 74, 0.62) 0%,
      rgba(11, 42, 74, 0.28) 55%,
      rgba(11, 42, 74, 0.1) 100%
    );
  }

  &__copy {
    position: absolute;
    inset: 0;
    z-index: 3;
    display: flex;
    align-items: center;
    pointer-events: none;
    padding: calc(#{$header-height} + 24px) 72px 80px 20px;

    @include respond-to('m') {
      padding-inline: 88px 96px;
    }

    @include respond-to('l') {
      padding-inline: 120px 120px;
    }

    &--center {
      justify-content: center;
      padding-inline: 24px;
      text-align: center;

      @include respond-to('m') {
        padding-inline: 48px;
      }

      .hero-carousel__copy-inner {
        max-width: none;
        align-items: center;
      }

      .hero-carousel__title,
      .hero-carousel__subtitle {
        max-width: none;
      }
    }

    &--nowrap {
      .hero-carousel__title,
      .hero-carousel__subtitle {
        white-space: nowrap;
      }

      .hero-carousel__title {
        font-size: clamp(18px, 2.8vw, 40px);
      }

      .hero-carousel__subtitle {
        font-size: clamp(13px, 1.5vw, 18px);
      }
    }
  }

  &__copy-inner {
    max-width: min(920px, calc(100vw - 140px));
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    color: $color-white;
  }

  &__title {
    font-size: clamp(20px, 2.8vw, 40px);
    font-weight: $font-black;
    line-height: 1.2;
    letter-spacing: -0.01em;
    white-space: nowrap;
    max-width: none;
  }

  &__title-alt {
    font-size: clamp(14px, 1.5vw, 18px);
    font-weight: $font-regular;
    line-height: 1.55;
    letter-spacing: 0.01em;
    color: rgba(255, 255, 255, 0.88);
    max-width: 52ch;
  }

  &__subtitle {
    font-size: clamp(14px, 1.35vw, 17px);
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.82);
    max-width: 46ch;
  }

  &__cta {
    pointer-events: auto;
    margin-top: 8px;
  }

  // 英文主标题允许换行（中文仍保持单行）；字号略收以适配长句
  :lang(en) &__title {
    white-space: normal;
    text-wrap: balance;
    max-width: 100%;
    font-size: clamp(24px, 3.4vw, 40px);
    line-height: 1.18;
  }

  :lang(en) &__copy--nowrap &__title {
    white-space: nowrap;
    text-wrap: unset;
    max-width: none;
    font-size: clamp(16px, 2.35vw, 34px);
  }

  :lang(en) &__subtitle {
    font-size: clamp(13px, 1.2vw, 16px);
    line-height: 1.65;
    max-width: 52ch;
  }

  :lang(en) &__copy-inner {
    gap: 16px;
    max-width: 640px;
  }

  &__controls {
    position: absolute;
    inset: 0;
    z-index: 4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-inline: 12px;
    pointer-events: none;

    @include respond-to('m') {
      padding-inline: 24px;
    }
  }

  &__arrow {
    pointer-events: auto;
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background-color: rgba(11, 42, 74, 0.28);
    color: $color-white;
    font-size: 28px;
    line-height: 1;
    backdrop-filter: blur(4px);
    transition:
      background-color $transition-fast,
      transform $transition-fast;

    &:hover {
      background-color: rgba(11, 42, 74, 0.5);
    }

    &:focus-visible {
      @include focus-ring;
    }

    span {
      margin-top: -2px;
    }
  }

  &__dots {
    position: absolute;
    left: 50%;
    bottom: 64px;
    z-index: 4;
    display: flex;
    gap: 10px;
    transform: translateX(-50%);
  }

  &__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.45);
    transition:
      background-color $transition-fast,
      transform $transition-fast;

    &--seen:not(&--active) {
      background-color: rgba(255, 255, 255, 0.7);
    }

    &--active {
      background-color: $color-white;
      transform: scale(1.25);
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__hint {
    position: absolute;
    left: 50%;
    bottom: 16px;
    z-index: 4;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    margin: 0;
    padding: 8px 12px;
    border: 0;
    background: transparent;
    transform: translateX(-50%);
    color: $color-white;
    text-shadow: 0 1px 10px rgba(11, 42, 74, 0.55);
    cursor: pointer;
    animation: hero-hint-in 900ms $ease-standard 600ms both;

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__hint-text {
    font-size: 12px;
    font-weight: $font-bold;
    letter-spacing: 0.08em;
    white-space: nowrap;
    color: $color-white;
    opacity: 1;
  }

  &__hint-chevron {
    width: 12px;
    height: 12px;
    border-right: 2px solid $color-white;
    border-bottom: 2px solid $color-white;
    transform: rotate(45deg);
    animation: hero-hint-bounce 1.6s $ease-standard infinite;
  }

  &--intro-locked &__arrow--next {
    animation: hero-arrow-pulse 2.2s $ease-standard infinite;
  }
}

@keyframes hero-hint-in {
  from {
    opacity: 0;
    transform: translate(-50%, 8px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@keyframes hero-hint-bounce {
  0%,
  100% {
    transform: translateY(0) rotate(45deg);
    opacity: 0.85;
  }
  50% {
    transform: translateY(6px) rotate(45deg);
    opacity: 1;
  }
}

@keyframes hero-arrow-pulse {
  0%,
  100% {
    transform: translateX(0);
    background-color: rgba(11, 42, 74, 0.28);
  }
  50% {
    transform: translateX(4px);
    background-color: rgba(11, 42, 74, 0.48);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-carousel {
    &__slide,
    &__slide img,
    &__scrim,
    &__hint,
    &__hint-chevron,
    &__arrow--next {
      transition: none;
      animation: none;
    }

    &__slide img {
      transform: none;
    }
  }
}
</style>
