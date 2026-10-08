<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import type { ServiceItem } from '@/data/content'

const props = defineProps<{ services: ServiceItem[] }>()

const router = useRouter()
const revealed = reactive<Record<string, boolean>>({})

let observer: IntersectionObserver | null = null

const goCta = (event: MouseEvent, to: string) => {
  event.preventDefault()
  router.push({ path: to })
}

onMounted(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) {
    for (const service of props.services) {
      revealed[service.id] = true
    }
    return
  }

  nextTick(() => {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const id = (entry.target as HTMLElement).id
          if (!id) continue
          revealed[id] = true
          observer?.unobserve(entry.target)
        }
      },
      { threshold: 0.22, rootMargin: '0px 0px -6% 0px' }
    )

    for (const service of props.services) {
      const el = document.getElementById(service.id)
      if (!el) continue
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      if (rect.top < vh * 0.88 && rect.bottom > vh * 0.12) {
        revealed[service.id] = true
        continue
      }
      observer.observe(el)
    }
  })
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <div class="service-bands">
    <article
      v-for="(service, index) in services"
      :id="service.id"
      :key="service.id"
      class="service-band"
      :class="{
        'service-band--inview': revealed[service.id],
        'service-band--alt': index % 2 === 1,
      }"
    >
      <div class="service-band__main">
        <p class="service-band__label">
          <span class="service-band__label-line" aria-hidden="true" />
          {{ service.label }}
        </p>
        <h2 class="service-band__headline">{{ service.headline }}</h2>
        <p
          v-if="service.subtitle"
          class="service-band__subtitle"
        >
          {{ service.subtitle }}
        </p>
        <a
          class="service-band__cta"
          :href="service.ctaTo"
          @click="goCta($event, service.ctaTo)"
        >
          {{ service.ctaText }}
        </a>
        <p class="service-band__desc">{{ service.description }}</p>
      </div>

      <div class="service-band__side">
        <p
          v-if="service.sideBody"
          class="service-band__side-body"
        >
          {{ service.sideBody }}
        </p>
        <template v-else>
          <section class="service-band__group">
            <h3 class="service-band__group-title">{{ service.audienceTitle }}</h3>
            <ul class="service-band__list">
              <li
                v-for="item in service.audience"
                :key="item"
                class="service-band__item"
              >
                {{ item }}
              </li>
            </ul>
          </section>

          <section class="service-band__group">
            <h3 class="service-band__group-title">{{ service.valuesTitle }}</h3>
            <ul class="service-band__list">
              <li
                v-for="item in service.values"
                :key="item"
                class="service-band__item"
              >
                {{ item }}
              </li>
            </ul>
          </section>
        </template>
      </div>
    </article>
  </div>
</template>

<style scoped lang="scss">
.service-bands {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.service-band {
  --service-accent: #1a1a1a;
  --service-ink: #2a2a2a;
  --service-muted: #6b6b6b;

  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  scroll-margin-top: calc(#{$header-height} + 56px + 16px);
  color: var(--service-ink);
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

  @include respond-to('s') {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    gap: 36px 40px;
    align-items: start;

    &:has(.service-band__side-body) {
      align-items: center;
    }
  }

  @include respond-to('m') {
    gap: 40px 56px;
  }

  @include respond-to('l') {
    padding-block: 64px;
    gap: 48px 72px;
  }

  &__main {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 22px;
  }

  &__label {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    gap: 10px;
    margin: 0;
    font-size: 13px;
    font-weight: $font-regular;
    letter-spacing: 0.04em;
    color: var(--service-ink);
  }

  &__label-line {
    width: 28px;
    height: 2px;
    background-color: var(--service-accent);
  }

  &__headline {
    margin: 0;
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
    color: var(--service-ink);
  }

  &__subtitle {
    margin: -8px 0 0;
    font-size: 16px;
    font-weight: $font-regular;
    line-height: 1.5;
    letter-spacing: 0.04em;
    color: var(--service-muted);
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    align-self: stretch;
    min-height: 52px;
    width: 100%;
    padding: 0 28px;
    border-radius: 2px;
    background-color: var(--service-accent);
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
    font-size: 14px;
    line-height: 1.9;
    color: var(--service-muted);
  }

  &__side {
    display: flex;
    flex-direction: column;
    gap: 36px;
    padding-top: 8px;

    &:has(.service-band__side-body) {
      padding-top: 0;
    }
  }

  &__side-body {
    margin: 0;
    font-size: 15px;
    line-height: 2;
    color: var(--service-ink);
  }

  &__group {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__group-title {
    margin: 0;
    font-size: 18px;
    font-weight: $font-bold;
    line-height: 1.3;
    color: var(--service-ink);
  }

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  &__item {
    position: relative;
    padding-left: 18px;
    font-size: 14px;
    line-height: 1.7;
    color: var(--service-muted);

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0.55em;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 5px 0 5px 8px;
      border-color: transparent transparent transparent var(--service-accent);
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .service-band {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
