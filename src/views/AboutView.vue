<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import SectionWrapper from '@/components/ui/SectionWrapper.vue'
import EyebrowLabel from '@/components/ui/EyebrowLabel.vue'
import AdvantageGrid from '@/components/ui/AdvantageGrid.vue'
import { content, locale } from '@/i18n'

const heroImage = `${import.meta.env.BASE_URL}about-hero.jpg`.replace(/([^:]\/)\/+/g, '$1')
const missionImage = `${import.meta.env.BASE_URL}about-mission.jpg`.replace(/([^:]\/)\/+/g, '$1')
const activeNav = ref('mission')
const secureEl = ref<HTMLElement | null>(null)
const secureInView = ref(false)

let secureObserver: IntersectionObserver | null = null

const syncTitle = () => {
  document.title = content.value.aboutPage.metaTitle
}

const navItems = computed(() => content.value.aboutPage.nav)

const navKey = (to: string) => to.replace(/^#/, '')

const scrollToSection = (event: MouseEvent, to: string) => {
  event.preventDefault()
  const id = navKey(to)
  const target = document.getElementById(id)
  if (!target) return
  activeNav.value = id
  const top = Math.max(
    0,
    Math.round(target.getBoundingClientRect().top + window.scrollY - 96 - 56)
  )
  window.scrollTo({ top, behavior: 'smooth' })
  history.replaceState(null, '', `${window.location.pathname}${to}`)
}

const updateActiveFromScroll = () => {
  const ids = navItems.value.map((item) => navKey(item.to))
  let current = ids[0] ?? 'mission'
  for (const id of ids) {
    const el = document.getElementById(id)
    if (!el) continue
    if (el.getBoundingClientRect().top <= 180) current = id
  }
  activeNav.value = current
}

onMounted(() => {
  syncTitle()
  updateActiveFromScroll()
  window.addEventListener('scroll', updateActiveFromScroll, { passive: true })

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) {
    secureInView.value = true
    return
  }

  const el = secureEl.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const vh = window.innerHeight
  if (rect.top < vh * 0.9 && rect.bottom > vh * 0.08) {
    secureInView.value = true
    return
  }

  secureObserver = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return
      secureInView.value = true
      secureObserver?.disconnect()
      secureObserver = null
    },
    { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
  )
  secureObserver.observe(el)
})

watch(() => content.value.aboutPage.metaTitle, syncTitle)

onBeforeUnmount(() => {
  document.title = content.value.meta.title
  window.removeEventListener('scroll', updateActiveFromScroll)
  secureObserver?.disconnect()
  secureObserver = null
})
</script>

<template>
  <div class="about-page">
    <!-- 页头 -->
    <header
      class="about-hero"
      :style="{ '--about-hero-image': `url('${heroImage}')` }"
    >
      <div class="about-hero__inner">
        <EyebrowLabel :text="content.aboutPage.eyebrow" color="white" />
        <h1 class="about-hero__title">{{ content.aboutPage.title }}</h1>
        <p
          class="about-hero__lead"
          :class="{ 'about-hero__lead--nowrap': locale === 'en' }"
        >
          {{ content.aboutPage.lead }}
        </p>
      </div>
    </header>

    <nav class="about-subnav" :aria-label="content.aboutPage.title">
      <div class="about-subnav__inner">
        <template v-for="(item, index) in navItems" :key="item.to">
          <span v-if="index > 0" class="about-subnav__sep" aria-hidden="true">/</span>
          <a
            :href="item.to"
            class="about-subnav__link"
            :class="{ 'about-subnav__link--active': activeNav === navKey(item.to) }"
            @click="scrollToSection($event, item.to)"
          >
            {{ item.label }}
          </a>
        </template>
      </div>
    </nav>

    <!-- 使命 -->
    <SectionWrapper id="mission" bg="white">
      <div class="about-mission">
        <div class="about-mission__copy">
          <EyebrowLabel :text="content.mission.eyebrow" color="accent-deep" />
          <h2 class="about-mission__title">{{ content.mission.title }}</h2>
          <div class="about-mission__body">
            <p
              v-for="(paragraph, index) in content.mission.paragraphs"
              :key="index"
              class="about-mission__text"
            >
              {{ paragraph }}
            </p>
          </div>
        </div>
        <figure class="about-mission__media">
          <img
            :src="missionImage"
            alt=""
            loading="lazy"
          >
        </figure>
      </div>
    </SectionWrapper>

    <!-- 保密与安全 -->
    <SectionWrapper id="confidentiality" bg="white" compact>
      <div ref="secureEl" class="about-secure-wrap">
        <div
          class="about-secure"
          :class="{ 'about-secure--inview': secureInView }"
        >
          <div class="section-head about-secure__head">
            <EyebrowLabel :text="content.confidentiality.eyebrow" color="accent-deep" />
            <h2>{{ content.confidentiality.title }}</h2>
          </div>
          <ul class="about-secure__list">
            <li
              v-for="item in content.confidentiality.items"
              :key="item"
              class="about-secure__item"
            >
              <span class="about-secure__mark" aria-hidden="true">◆</span>
              <p>{{ item }}</p>
            </li>
          </ul>
        </div>
      </div>
    </SectionWrapper>

    <!-- 核心优势 -->
    <SectionWrapper
      id="advantages"
      bg="neutral"
      class="about-advantages"
    >
      <div class="about-advantages__layout">
        <div class="section-head about-advantages__head">
          <EyebrowLabel :text="content.advantagesSection.eyebrow" color="accent-deep" />
          <h2>{{ content.advantagesSection.title }}</h2>
        </div>
        <AdvantageGrid :items="content.advantages" />
      </div>
    </SectionWrapper>
  </div>
</template>

<style scoped lang="scss">
.about-page {
  padding-top: $header-height;
}

:deep(.about-advantages.section) {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background-color: $color-bg-light !important;
  background-image: none !important;

  > .section__inner,
  .section__inner {
    position: relative;
    z-index: 1;
  }

  @include respond-to('l') {
    padding-block: 88px 96px;
  }
}

.about-advantages__layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  align-items: start;

  @include respond-to('s') {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.35fr);
    gap: 40px 48px;
  }

  @include respond-to('m') {
    gap: 48px 64px;
  }
}

:deep(.about-advantages .section-head) {
  margin-bottom: 0;
}

:deep(.about-advantages .advantage-grid) {
  gap: 28px;

  @include respond-to('m') {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

:deep(.about-advantages .advantage-grid__title) {
  color: $color-primary-deep;
}

:deep(.about-advantages .advantage-grid__desc) {
  color: rgba($color-primary-deep, 0.82);
}

.about-hero {
  position: relative;
  overflow: hidden;
  color: $color-white;
  background-color: $color-primary-deep;
  background-image:
    linear-gradient(
      105deg,
      rgba(11, 42, 74, 0.78) 0%,
      rgba(11, 42, 74, 0.52) 42%,
      rgba(11, 42, 74, 0.28) 100%
    ),
    var(--about-hero-image);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  &__inner {
    @include container;
    position: relative;
    padding-block: 64px 56px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 880px;
    animation: about-rise 0.7s $ease-standard both;

    @include respond-to('l') {
      padding-block: 88px 72px;
    }
  }

  &__title {
    font-size: clamp(36px, 5vw, 56px);
    font-weight: $font-black;
    line-height: 1.15;
    letter-spacing: -0.02em;
  }

  &__lead {
    font-size: clamp(16px, 1.6vw, 18px);
    line-height: 1.7;
    color: rgba($color-white, 0.88);
    max-width: 36em;

    &--nowrap {
      white-space: nowrap;
      max-width: none;
      font-size: clamp(13px, 1.9vw, 18px);
    }
  }
}

.about-subnav {
  position: sticky;
  top: $header-height;
  z-index: 40;
  background-color: $color-white;
  box-shadow: 0 1px 0 rgba(11, 42, 74, 0.06);

  &__inner {
    @include container;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0 4px;
    padding-block: 18px;
  }

  &__sep {
    margin-inline: 14px;
    color: rgba($color-accent, 0.55);
    font-size: 14px;
    line-height: 1;
    user-select: none;
  }

  &__link {
    position: relative;
    font-size: 15px;
    font-weight: $font-bold;
    letter-spacing: 0.06em;
    color: $color-accent;
    padding-block: 4px;
    transition: color $transition-fast;

    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 2px;
      background-color: $color-accent-deep;
      transform: scaleX(0);
      transform-origin: center;
      transition: transform 280ms $ease-standard;
    }

    &:hover {
      color: $color-accent-deep;
    }

    &--active {
      color: $color-accent-deep;

      &::after {
        transform: scaleX(1);
      }
    }

    &:focus-visible {
      @include focus-ring;
    }
  }
}

.about-mission {
  display: grid;
  grid-template-columns: 1fr;
  gap: 36px;
  align-items: center;
  animation: about-rise 0.75s $ease-standard 0.08s both;

  @include respond-to('s') {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    gap: 40px 48px;
  }

  @include respond-to('m') {
    gap: 48px 64px;
  }

  &__copy {
    display: flex;
    flex-direction: column;
    gap: 18px;
    min-width: 0;
  }

  &__title {
    margin: 0;
    font-size: clamp(28px, 3.4vw, 40px);
    font-weight: $font-black;
    line-height: 1.2;
    letter-spacing: -0.01em;
    color: $color-primary-deep;
  }

  &__body {
    margin-top: 4px;
    padding-left: 20px;
    border-left: 3px solid $color-accent;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  &__text {
    margin: 0;
    font-size: clamp(16px, 1.6vw, 18px);
    line-height: 1.85;
    font-weight: $font-light;
    color: $color-primary-deep;

    &:last-child {
      font-weight: $font-regular;
      color: $text-muted-light;
    }
  }

  &__media {
    margin: 0;
    overflow: hidden;
    aspect-ratio: 4 / 3;
    background-color: $color-bg-light;

    @include respond-to('s') {
      aspect-ratio: 5 / 4;
      min-height: 320px;
    }

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }
}

.about-secure-wrap {
  max-width: 880px;
}

.about-secure {
  display: flex;
  flex-direction: column;
  gap: 40px;

  :deep(.section-head h2) {
    white-space: normal;
  }

  &__head,
  &__item {
    clip-path: inset(0 100% 0 0);
    transition: clip-path 1.05s $ease-standard;
  }

  &__head {
    transition-delay: 0ms;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  &__item {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 14px;
    align-items: start;
    padding: 20px 0;
    border-top: 1px solid $line-light;

    @for $i from 1 through 3 {
      &:nth-child(#{$i}) {
        transition-delay: #{120ms + ($i - 1) * 140ms};
      }
    }

    &:last-child {
      border-bottom: 1px solid $line-light;
    }

    p {
      font-size: 16px;
      line-height: 1.8;
      color: $text-muted-light;
    }
  }

  &__mark {
    margin-top: 4px;
    font-size: 12px;
    color: $color-accent-deep;
    line-height: 1;
  }

  &--inview {
    .about-secure__head,
    .about-secure__item {
      clip-path: inset(0 0 0 0);
    }
  }
}

:deep(.section-head) {
  margin-bottom: 40px;

  h2 {
    margin-top: 12px;
  }
}

@keyframes about-rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .about-hero__inner,
  .about-mission {
    animation: none;
  }

  .about-secure {
    &__head,
    &__item {
      clip-path: none;
      transition: none;
    }
  }
}
</style>
