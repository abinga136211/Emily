<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import EyebrowLabel from '@/components/ui/EyebrowLabel.vue'
import ServiceCarousel from '@/components/ui/ServiceCarousel.vue'
import { content } from '@/i18n'

const heroImage = `${import.meta.env.BASE_URL}service-1.jpg`.replace(/([^:]\/)\/+/g, '$1')
const logoUrl = `${import.meta.env.BASE_URL}logo.png`.replace(/([^:]\/)\/+/g, '$1')
const activeNav = ref('management-consulting')
const subnavInView = ref(false)
const subnavEl = ref<HTMLElement | null>(null)

let subnavObserver: IntersectionObserver | null = null

const syncTitle = () => {
  document.title = content.value.servicesPage.metaTitle
}

const navItems = computed(() => content.value.servicesPage.nav)

const navKey = (to: string) => to.replace(/^#/, '')

const scrollOffset = () => 96 + 56

const scrollToSection = (event: MouseEvent, to: string) => {
  event.preventDefault()
  const id = navKey(to)
  const target = document.getElementById(id)
  if (!target) return
  activeNav.value = id
  const top = Math.max(
    0,
    Math.round(target.getBoundingClientRect().top + window.scrollY - scrollOffset())
  )
  window.scrollTo({ top, behavior: 'smooth' })
  history.replaceState(null, '', `${window.location.pathname}${to}`)
}

const updateActiveFromScroll = () => {
  const ids = navItems.value.map((item) => navKey(item.to))
  let current = ids[0] ?? 'management-consulting'
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

  nextTick(() => {
    if (!subnavEl.value) return
    subnavObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        subnavInView.value = true
        subnavObserver?.disconnect()
        subnavObserver = null
      },
      { threshold: 0.35 }
    )
    subnavObserver.observe(subnavEl.value)
  })

  const hash = window.location.hash.replace(/^#/, '')
  if (!hash) return
  requestAnimationFrame(() => {
    const target = document.getElementById(hash)
    if (!target) return
    activeNav.value = hash
    const top = Math.max(
      0,
      Math.round(target.getBoundingClientRect().top + window.scrollY - scrollOffset())
    )
    window.scrollTo({ top, behavior: 'smooth' })
  })
})

watch(() => content.value.servicesPage.metaTitle, syncTitle)

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateActiveFromScroll)
  subnavObserver?.disconnect()
  subnavObserver = null
  document.title = content.value.meta.title
})
</script>

<template>
  <div
    class="services-page"
    :style="{ '--services-logo': `url('${logoUrl}')` }"
  >
    <header
      class="services-hero"
      :style="{ '--services-hero-image': `url('${heroImage}')` }"
    >
      <div class="services-hero__inner">
        <EyebrowLabel :text="content.servicesPage.eyebrow" color="white" />
        <h1 class="services-hero__title">{{ content.servicesPage.title }}</h1>
        <p class="services-hero__lead">{{ content.servicesPage.lead }}</p>
      </div>
    </header>

    <nav
      ref="subnavEl"
      class="services-subnav"
      :class="{ 'services-subnav--inview': subnavInView }"
      :aria-label="content.servicesPage.title"
    >
      <div class="services-subnav__inner">
        <template v-for="(item, index) in navItems" :key="item.to">
          <span v-if="index > 0" class="services-subnav__sep" aria-hidden="true">/</span>
          <a
            :href="item.to"
            class="services-subnav__link"
            :class="{ 'services-subnav__link--active': activeNav === navKey(item.to) }"
            @click="scrollToSection($event, item.to)"
          >
            {{ item.label }}
          </a>
        </template>
      </div>
    </nav>

    <section class="services-page__bands" aria-label="services">
      <div class="services-page__shell">
        <ServiceCarousel :services="content.services" />
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.services-page {
  position: relative;
  padding-top: $header-height;
  isolation: isolate;
}

.services-hero {
  position: relative;
  overflow: hidden;
  color: $color-white;
  background-color: $color-primary-deep;
  background-image:
    linear-gradient(
      105deg,
      rgba(11, 42, 74, 0.82) 0%,
      rgba(11, 42, 74, 0.56) 42%,
      rgba(11, 42, 74, 0.32) 100%
    ),
    var(--services-hero-image);
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
    animation: services-rise 0.7s $ease-standard both;

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
    max-width: 40em;
  }
}

.services-subnav {
  position: sticky;
  top: $header-height;
  z-index: 20;
  background-color: $color-white;
  border-bottom: 1px solid rgba($color-primary-deep, 0.1);

  &__inner {
    width: min(calc(100% - 40px), 1080px);
    margin-inline: auto;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 12px;
    padding-block: 14px;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__sep,
  &__link {
    opacity: 0;
    transform: translateX(-18px);
    transition:
      opacity 520ms $ease-standard,
      transform 620ms $ease-standard,
      color $transition-fast;

    @for $i from 1 through 7 {
      &:nth-child(#{$i}) {
        transition-delay: #{80ms + ($i - 1) * 90ms};
      }
    }
  }

  &--inview &__sep,
  &--inview &__link {
    opacity: 1;
    transform: translateX(0);
  }

  &__sep {
    color: rgba($color-primary-deep, 0.28);
    font-size: 12px;
  }

  &__link {
    font-size: 13px;
    font-weight: $font-bold;
    letter-spacing: 0.04em;
    color: rgba($color-primary-deep, 0.55);
    white-space: nowrap;

    &:hover,
    &--active {
      color: $color-primary-deep;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }
}

.services-page__bands {
  position: relative;
  z-index: 1;
  background-color: $color-white;
  padding-block: 0 24px;
  overflow-x: clip;

  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 42%;
    z-index: 2;
    width: min(72vw, 560px);
    height: min(72vw, 560px);
    transform: translate(-50%, -50%);
    background-image: var(--services-logo);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    opacity: 0.06;
    pointer-events: none;
  }
}

.services-page__shell {
  position: relative;
  z-index: 1;
  width: min(calc(100% - 40px), 1080px);
  margin-inline: auto;
}

@keyframes services-rise {
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
  .services-hero__inner {
    animation: none;
  }

  .services-subnav__sep,
  .services-subnav__link {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
