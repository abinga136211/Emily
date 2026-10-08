<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import EyebrowLabel from '@/components/ui/EyebrowLabel.vue'
import { content } from '@/i18n'

const router = useRouter()
const heroImage = `${import.meta.env.BASE_URL}industries-hero.jpg`.replace(/([^:]\/)\/+/g, '$1')
const logoUrl = `${import.meta.env.BASE_URL}logo.png`.replace(/([^:]\/)\/+/g, '$1')
const activeNav = ref('cross-border-payment')
const subnavInView = ref(false)
const subnavEl = ref<HTMLElement | null>(null)
const revealed = reactive<Record<string, boolean>>({})

let subnavObserver: IntersectionObserver | null = null
let bandsObserver: IntersectionObserver | null = null

const syncTitle = () => {
  document.title = content.value.industriesPage.metaTitle
}

const navItems = computed(() => content.value.industriesPage.nav)
const industries = computed(() => content.value.industries)

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
  let current = ids[0] ?? 'cross-border-payment'
  for (const id of ids) {
    const el = document.getElementById(id)
    if (!el) continue
    if (el.getBoundingClientRect().top <= 180) current = id
  }
  activeNav.value = current
}

const goCta = (event: MouseEvent, to: string) => {
  event.preventDefault()
  router.push({ path: to })
}

onMounted(() => {
  syncTitle()
  updateActiveFromScroll()
  window.addEventListener('scroll', updateActiveFromScroll, { passive: true })

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  nextTick(() => {
    if (subnavEl.value) {
      if (reduceMotion) {
        subnavInView.value = true
      } else {
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
      }
    }

    if (reduceMotion) {
      for (const industry of industries.value) {
        revealed[industry.id] = true
      }
    } else {
      bandsObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            const id = (entry.target as HTMLElement).id
            if (!id) continue
            revealed[id] = true
            bandsObserver?.unobserve(entry.target)
          }
        },
        { threshold: 0.22, rootMargin: '0px 0px -6% 0px' }
      )

      for (const industry of industries.value) {
        const el = document.getElementById(industry.id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight
        if (rect.top < vh * 0.88 && rect.bottom > vh * 0.12) {
          revealed[industry.id] = true
          continue
        }
        bandsObserver.observe(el)
      }
    }
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

watch(() => content.value.industriesPage.metaTitle, syncTitle)

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateActiveFromScroll)
  subnavObserver?.disconnect()
  subnavObserver = null
  bandsObserver?.disconnect()
  bandsObserver = null
  document.title = content.value.meta.title
})
</script>

<template>
  <div
    class="industries-page"
    :style="{ '--industries-logo': `url('${logoUrl}')` }"
  >
    <header
      class="industries-hero"
      :style="{ '--industries-hero-image': `url('${heroImage}')` }"
    >
      <div class="industries-hero__inner">
        <EyebrowLabel :text="content.industriesPage.eyebrow" color="white" />
        <h1 class="industries-hero__title">{{ content.industriesPage.title }}</h1>
        <p class="industries-hero__lead">{{ content.industriesPage.lead }}</p>
      </div>
    </header>

    <nav
      ref="subnavEl"
      class="industries-subnav"
      :class="{ 'industries-subnav--inview': subnavInView }"
      :aria-label="content.industriesPage.title"
    >
      <div class="industries-subnav__inner">
        <a
          v-for="item in navItems"
          :key="item.to"
          :href="item.to"
          class="industries-subnav__link"
          :class="{ 'industries-subnav__link--active': activeNav === navKey(item.to) }"
          @click="scrollToSection($event, item.to)"
        >
          {{ item.label }}
        </a>
      </div>
    </nav>

    <section class="industries-page__bands" aria-label="industries">
      <div class="industries-page__shell">
        <article
          v-for="(industry, index) in industries"
          :id="industry.id"
          :key="industry.id"
          class="industry-detail"
          :class="{
            'industry-detail--inview': revealed[industry.id],
            'industry-detail--alt': index % 2 === 1,
          }"
        >
          <h2 class="industry-detail__headline">{{ industry.headline }}</h2>
          <p class="industry-detail__desc">{{ industry.description }}</p>

          <div class="industry-detail__side">
            <section class="industry-detail__group">
              <h3 class="industry-detail__group-title">{{ industry.audienceTitle }}</h3>
              <ul class="industry-detail__list">
                <li
                  v-for="item in industry.audience"
                  :key="item"
                  class="industry-detail__item"
                >
                  {{ item }}
                </li>
              </ul>
            </section>

            <section class="industry-detail__group">
              <h3 class="industry-detail__group-title">{{ industry.valuesTitle }}</h3>
              <ul class="industry-detail__list">
                <li
                  v-for="item in industry.values"
                  :key="item"
                  class="industry-detail__item"
                >
                  {{ item }}
                </li>
              </ul>
            </section>
          </div>

          <a
            class="industry-detail__cta"
            :href="industry.ctaTo"
            @click="goCta($event, industry.ctaTo)"
          >
            {{ industry.ctaText }}
          </a>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.industries-page {
  position: relative;
  padding-top: $header-height;
  isolation: isolate;
}

.industries-hero {
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
    var(--industries-hero-image);
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
    animation: industries-rise 0.7s $ease-standard both;

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

.industries-subnav {
  position: sticky;
  top: $header-height;
  z-index: 20;
  background-color: $color-white;
  border-bottom: 1px solid #e8e8e8;

  &__inner {
    width: min(calc(100% - 40px), 1080px);
    margin-inline: auto;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
    gap: 28px;
    padding-block: 16px;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__link {
    flex-shrink: 0;
    font-size: 15px;
    font-weight: $font-regular;
    letter-spacing: 0.02em;
    line-height: 1.4;
    color: #6b6b6b;
    white-space: nowrap;
    opacity: 0;
    transform: translateX(-18px);
    transition:
      opacity 520ms $ease-standard,
      transform 620ms $ease-standard,
      color $transition-fast;

    @for $i from 1 through 4 {
      &:nth-child(#{$i}) {
        transition-delay: #{80ms + ($i - 1) * 90ms};
      }
    }

    &:hover {
      color: $color-primary-deep;
    }

    &--active {
      color: $color-primary-deep;
      font-weight: $font-bold;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &--inview &__link {
    opacity: 1;
    transform: translateX(0);
  }
}

.industries-page__bands {
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
    background-image: var(--industries-logo);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    opacity: 0.06;
    pointer-events: none;
  }
}

.industries-page__shell {
  position: relative;
  z-index: 1;
  width: min(calc(100% - 40px), 1080px);
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.industry-detail {
  --industry-accent: #1a1a1a;
  --industry-ink: #2a2a2a;
  --industry-muted: #6b6b6b;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 28px;
  scroll-margin-top: calc(#{$header-height} + 56px + 16px);
  color: var(--industry-ink);
  padding-block: 48px;
  opacity: 0;
  transform: translateY(-28px);
  transition:
    opacity 720ms $ease-standard,
    transform 820ms $ease-standard;

  &--inview {
    opacity: 1;
    transform: translateY(0);
  }

  &--alt {
    background-color: $color-bg-light;
    width: 100vw;
    max-width: 100vw;
    margin-left: calc(50% - 50vw);
    padding-inline: calc((100vw - min(calc(100vw - 40px), 1080px)) / 2);
    box-sizing: border-box;
  }

  @include respond-to('l') {
    padding-block: 64px;
  }

  @include respond-to('m') {
    gap: 32px;
  }

  &__headline {
    margin: 0;
    text-align: center;
    font-family:
      'Noto Serif SC',
      'Source Han Serif SC',
      'Songti SC',
      'SimSun',
      Georgia,
      serif;
    font-size: clamp(28px, 3.6vw, 40px);
    font-weight: 700;
    line-height: 1.25;
    letter-spacing: 0.01em;
    color: var(--industry-ink);
  }

  &__side {
    display: grid;
    grid-template-columns: 1fr;
    gap: 28px;
    width: 100%;
    max-width: 720px;
    margin-inline: auto;
    justify-items: center;

    @include respond-to('s') {
      grid-template-columns: 1fr 1fr;
      gap: 24px 32px;
      align-items: start;
    }

    @include respond-to('m') {
      gap: 24px 40px;
    }
  }

  &__group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    width: 100%;
    text-align: center;
  }

  &__group-title {
    margin: 0;
    font-size: 18px;
    font-weight: $font-bold;
    line-height: 1.3;
    color: var(--industry-ink);
  }

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 14px;
    width: fit-content;
    max-width: min(100%, 36ch);
    margin-inline: auto;
  }

  &__item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    width: 100%;
    font-size: 14px;
    line-height: 1.7;
    color: var(--industry-muted);
    text-align: left;

    &::before {
      content: '';
      flex-shrink: 0;
      width: 0;
      height: 0;
      margin-top: 0.45em;
      border-style: solid;
      border-width: 5px 0 5px 8px;
      border-color: transparent transparent transparent var(--industry-accent);
    }
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    align-self: stretch;
    min-height: 52px;
    width: 100%;
    max-width: 420px;
    margin-inline: auto;
    padding: 0 28px;
    border-radius: 2px;
    background-color: var(--industry-accent);
    color: $color-white;
    font-size: 15px;
    font-weight: $font-bold;
    letter-spacing: 0.08em;
    transition:
      background-color $transition-fast,
      transform $transition-fast;

    &:hover {
      background-color: #000000;
      transform: translateY(-1px);
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__desc {
    margin: 0;
    text-align: center;
    font-size: 14px;
    line-height: 1.9;
    color: var(--industry-muted);
    max-width: 52em;
    margin-inline: auto;
  }
}

@keyframes industries-rise {
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
  .industries-hero__inner {
    animation: none;
  }

  .industries-subnav__link,
  .industry-detail {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
