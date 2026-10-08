<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import HeroCarousel from '@/components/ui/HeroCarousel.vue'
import SectionWrapper from '@/components/ui/SectionWrapper.vue'
import EyebrowLabel from '@/components/ui/EyebrowLabel.vue'
import StatBlock from '@/components/ui/StatBlock.vue'
import { content } from '@/i18n'

const router = useRouter()
const servicesHeadEl = ref<HTMLElement | null>(null)
const servicesHeadInView = ref(false)
const industriesHeadEl = ref<HTMLElement | null>(null)
const industriesHeadInView = ref(false)
const contactBlockEl = ref<HTMLElement | null>(null)
const contactBlockInView = ref(false)

let servicesObserver: IntersectionObserver | null = null
let industriesObserver: IntersectionObserver | null = null
let contactObserver: IntersectionObserver | null = null

const observeOnce = (
  el: HTMLElement | null,
  onEnter: () => void,
  assign: (observer: IntersectionObserver | null) => void
) => {
  if (!el) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) {
    onEnter()
    return
  }

  // 已在视口内则直接触发（避免深链 / HMR 后 IO 不回调）
  const rect = el.getBoundingClientRect()
  const vh = window.innerHeight
  if (rect.top < vh * 0.9 && rect.bottom > vh * 0.08) {
    onEnter()
    return
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return
      onEnter()
      observer.disconnect()
      assign(null)
    },
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  )
  assign(observer)
  observer.observe(el)
}

onMounted(() => {
  observeOnce(
    servicesHeadEl.value,
    () => {
      servicesHeadInView.value = true
    },
    (observer) => {
      servicesObserver = observer
    }
  )
  observeOnce(
    industriesHeadEl.value,
    () => {
      industriesHeadInView.value = true
    },
    (observer) => {
      industriesObserver = observer
    }
  )
  observeOnce(
    contactBlockEl.value,
    () => {
      contactBlockInView.value = true
    },
    (observer) => {
      contactObserver = observer
    }
  )
})

onBeforeUnmount(() => {
  servicesObserver?.disconnect()
  servicesObserver = null
  industriesObserver?.disconnect()
  industriesObserver = null
  contactObserver?.disconnect()
  contactObserver = null
})

const goContact = (event: MouseEvent) => {
  event.preventDefault()
  router.push({ path: '/contact' })
}

const goServicesPage = (event: MouseEvent) => {
  event.preventDefault()
  router.push({ path: '/services' })
}

const goService = (event: MouseEvent, id: string) => {
  event.preventDefault()
  router.push({ path: '/services', hash: `#${id}` })
}

const goIndustriesPage = (event: MouseEvent) => {
  event.preventDefault()
  router.push({ path: '/industries' })
}

const goIndustry = (event: MouseEvent, id: string) => {
  event.preventDefault()
  router.push({ path: '/industries', hash: `#${id}` })
}
</script>

<template>
  <!-- 全屏形象轮播：首屏锁滚动，看完所有幻灯片后再进入下方内容 -->
  <HeroCarousel :slides="content.homeSlides" />

  <StatBlock :stats="content.stats" />

  <!-- 核心服务（详情见 /services） -->
  <section id="services" class="services-section">
    <div ref="servicesHeadEl" class="services-section__intro">
      <div
        class="section-head services-section__head"
        :class="{ 'services-section__head--inview': servicesHeadInView }"
      >
        <EyebrowLabel :text="content.servicesSection.eyebrow" />
        <h2>{{ content.servicesSection.title }}</h2>
        <p class="section-head__lead">{{ content.servicesSection.lead }}</p>
        <ul class="services-section__list" aria-label="核心服务">
          <li
            v-for="service in content.services"
            :key="service.id"
            class="services-section__item"
          >
            <a
              class="services-section__link"
              :href="`/services#${service.id}`"
              @click="goService($event, service.id)"
            >
              {{ service.title }}
            </a>
          </li>
        </ul>
        <a
          class="services-section__cta"
          :href="content.servicesSection.ctaTo"
          :aria-label="content.servicesSection.ctaAria"
          @click="goServicesPage"
        >
          <span class="services-section__cta-text">{{ content.servicesSection.ctaText }}</span>
          <span class="services-section__cta-icon" aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </section>

  <!-- 行业解决方案（详情见 /industries） -->
  <SectionWrapper id="industries" bg="neutral">
    <div ref="industriesHeadEl" class="industries-section__intro">
      <div
        class="section-head industries-section__head"
        :class="{ 'industries-section__head--inview': industriesHeadInView }"
      >
        <EyebrowLabel :text="content.industriesSection.eyebrow" />
        <h2>{{ content.industriesSection.title }}</h2>
        <p class="section-head__lead">{{ content.industriesSection.lead }}</p>
        <ul class="industries-section__list" aria-label="行业解决方案">
          <li
            v-for="industry in content.industries"
            :key="industry.id"
            class="industries-section__item"
          >
            <a
              class="industries-section__link"
              :href="`/industries#${industry.id}`"
              @click="goIndustry($event, industry.id)"
            >
              {{ industry.title }}
            </a>
          </li>
        </ul>
        <a
          class="industries-section__cta"
          :href="content.industriesSection.ctaTo"
          :aria-label="content.industriesSection.ctaAria"
          @click="goIndustriesPage"
        >
          <span class="industries-section__cta-text">{{ content.industriesSection.ctaText }}</span>
          <span class="industries-section__cta-icon" aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </SectionWrapper>

  <!-- 咨询对接 -->
  <SectionWrapper id="contact" bg="white">
    <div
      ref="contactBlockEl"
      class="contact-block"
      :class="{ 'contact-block--inview': contactBlockInView }"
    >
      <h2 class="contact-block__title">{{ content.contactHero.title }}</h2>
      <p class="contact-block__lead">{{ content.contactHero.subtitle }}</p>
      <p class="contact-block__note">{{ content.contactNote }}</p>
      <a
        href="/contact"
        class="btn btn--black contact-block__cta"
        @click="goContact"
      >
        {{ content.contactHero.ctaText }}
      </a>
    </div>
  </SectionWrapper>
</template>

<style scoped lang="scss">
// ---------- 核心服务（通栏交错图文） ----------
.services-section {
  background-color: $color-white;
  color: $color-primary-deep;

  &__intro {
    @include container;
    padding-block: 48px 40px;

    @include respond-to('l') {
      padding-block: 72px 48px;
    }
  }

  &__head {
    position: relative;
    max-width: none;
    clip-path: inset(0 100% 0 0);
    transition: clip-path 1.15s $ease-standard;

    &--inview {
      clip-path: inset(0 0 0 0);
    }

    :deep(.eyebrow-label) {
      white-space: nowrap;
      font-size: clamp(16px, 3.2vw, 40px);
    }
  }

  &__list {
    list-style: none;
    margin: 28px 0 0;
    padding: 0 0 0 8ch;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  &__item {
    margin: 0;
    padding: 0;
    opacity: 0;
    transform: translateY(-18px);
    transition:
      opacity 650ms $ease-standard,
      transform 700ms $ease-standard;

    @for $i from 1 through 4 {
      &:nth-child(#{$i}) {
        transition-delay: #{280ms + ($i - 1) * 120ms};
      }
    }
  }

  &__head--inview &__item {
    opacity: 1;
    transform: translateY(0);
  }

  &__link {
    display: inline-flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 16px;
    font-weight: $font-regular;
    line-height: 1.55;
    color: rgba($color-primary-deep, 0.72);
    transition: color $transition-fast;

    &::before {
      content: '';
      flex-shrink: 0;
      width: 9px;
      height: 9px;
      margin-top: 0.45em;
      background-color: $color-accent;
      clip-path: polygon(0 0, 0 100%, 100% 100%);
    }

    &:hover {
      color: $color-primary-deep;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__cta {
    margin: 28px 0 0 8ch;
    min-height: 44px;
    padding: 0 18px 0 20px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    border: 1px solid rgba(26, 26, 26, 0.28);
    border-radius: 999px;
    color: $color-accent;
    transition:
      border-color $transition-fast,
      color $transition-fast,
      transform $transition-fast;

    &:hover {
      border-color: $color-accent-deep;
      color: $color-accent-deep;
      transform: translateX(2px);
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__cta-text {
    font-size: 14px;
    font-weight: $font-bold;
    letter-spacing: 0.04em;
    line-height: 1;
    white-space: nowrap;
  }

  &__cta-icon {
    font-size: 18px;
    line-height: 1;
    transform: translateY(-1px);
  }
}

// ---------- 行业解决方案标题进场 ----------
.industries-section {
  &__head {
    position: relative;
    max-width: none;
    width: 100%;
    clip-path: inset(0 100% 0 0);
    transition: clip-path 1.15s $ease-standard;

    &--inview {
      clip-path: inset(0 0 0 0);
    }

    :deep(h2) {
      white-space: nowrap;
      // 长标题单行：随视口收字号，避免裁切
      font-size: clamp(18px, 2.55vw, 32px);
    }
  }

  :lang(en) &__head :deep(h2) {
    font-size: clamp(14px, 1.9vw, 26px);
  }

  &__list {
    list-style: none;
    margin: 28px 0 0;
    padding: 0 0 0 8ch;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  &__item {
    margin: 0;
    padding: 0;
    opacity: 0;
    transform: translateY(-18px);
    transition:
      opacity 650ms $ease-standard,
      transform 700ms $ease-standard;

    @for $i from 1 through 3 {
      &:nth-child(#{$i}) {
        transition-delay: #{280ms + ($i - 1) * 120ms};
      }
    }
  }

  &__head--inview &__item {
    opacity: 1;
    transform: translateY(0);
  }

  &__link {
    display: inline-flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 16px;
    font-weight: $font-regular;
    line-height: 1.55;
    color: rgba($color-primary-deep, 0.72);
    transition: color $transition-fast;

    &::before {
      content: '';
      flex-shrink: 0;
      width: 9px;
      height: 9px;
      margin-top: 0.45em;
      background-color: $color-accent;
      clip-path: polygon(0 0, 0 100%, 100% 100%);
    }

    &:hover {
      color: $color-primary-deep;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__cta {
    margin: 28px 0 0 8ch;
    min-height: 44px;
    padding: 0 18px 0 20px;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    border: 1px solid rgba(26, 26, 26, 0.28);
    border-radius: 999px;
    color: $color-accent;
    transition:
      border-color $transition-fast,
      color $transition-fast,
      transform $transition-fast;

    &:hover {
      border-color: $color-accent-deep;
      color: $color-accent-deep;
      transform: translateX(2px);
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__cta-text {
    font-size: 14px;
    font-weight: $font-bold;
    letter-spacing: 0.04em;
    line-height: 1;
    white-space: nowrap;
  }

  &__cta-icon {
    font-size: 18px;
    line-height: 1;
    transform: translateY(-1px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .services-section__head,
  .industries-section__head {
    clip-path: none;
    transition: none;
  }

  .services-section__item,
  .industries-section__item {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

// ---------- 咨询对接 ----------
.contact-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
  max-width: 720px;
  margin-inline: auto;

  &__title,
  &__lead,
  &__note,
  &__cta {
    // 自底部向上擦出 + 上滑
    opacity: 0;
    transform: translateY(28px);
    clip-path: inset(100% 0 0 0);
    transition:
      opacity 700ms $ease-standard,
      transform 800ms $ease-standard,
      clip-path 800ms $ease-standard;
  }

  &__title {
    font-size: clamp(28px, 3.6vw, 44px);
    font-weight: $font-black;
    line-height: 1.2;
    letter-spacing: -0.01em;
    transition-delay: 0ms;

    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 2px;
      margin: 20px auto 0;
      background-color: $color-accent;
      transform: scaleX(0);
      transform-origin: center;
      transition: transform 600ms $ease-standard 280ms;
    }
  }

  &__lead {
    font-size: 17px;
    line-height: 1.8;
    color: $text-muted-light;
    transition-delay: 120ms;
  }

  &__note {
    font-size: 15px;
    font-weight: $font-bold;
    line-height: 1.7;
    color: $color-accent;
    transition-delay: 240ms;
  }

  &__cta {
    margin-top: 8px;
    transition-delay: 360ms;
  }

  &--inview {
    .contact-block__title,
    .contact-block__lead,
    .contact-block__note,
    .contact-block__cta {
      opacity: 1;
      transform: translateY(0);
      clip-path: inset(0 0 0 0);
    }

    .contact-block__title::after {
      transform: scaleX(1);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .contact-block {
    &__title,
    &__lead,
    &__note,
    &__cta {
      opacity: 1;
      transform: none;
      clip-path: none;
      transition: none;
    }

    &__title::after {
      transform: none;
      transition: none;
    }
  }
}
</style>
