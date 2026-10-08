<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { AdvantageItem } from '@/data/content'

interface Props {
  items: AdvantageItem[]
}

defineProps<Props>()

const rootEl = ref<HTMLElement | null>(null)
const inView = ref(false)

let observer: IntersectionObserver | null = null

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
    { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
  )
  observer.observe(el)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})
</script>

<template>
  <ul
    ref="rootEl"
    class="advantage-grid"
    :class="{ 'advantage-grid--inview': inView }"
  >
    <li
      v-for="(item, index) in items"
      :key="item.title"
      class="advantage-grid__item"
    >
      <span class="advantage-grid__num" aria-hidden="true">
        {{ String(index + 1).padStart(2, '0') }}
      </span>
      <h3 class="advantage-grid__title">{{ item.title }}</h3>
      <p class="advantage-grid__desc">{{ item.description }}</p>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.advantage-grid {
  display: grid;
  gap: 40px;

  @include respond-to('m') {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }

  @include respond-to('l') {
    gap: 40px;
  }

  &__item {
    border-top: 2px solid $color-primary-deep;
    padding-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    opacity: 0;
    transform: translateY(36px);
    clip-path: inset(100% 0 0 0);
    transition:
      opacity 720ms $ease-standard,
      transform 800ms $ease-standard,
      clip-path 800ms $ease-standard;

    @for $i from 1 through 3 {
      &:nth-child(#{$i}) {
        transition-delay: #{($i - 1) * 140ms};
      }
    }
  }

  &--inview &__item {
    opacity: 1;
    transform: translateY(0);
    clip-path: inset(0 0 0 0);
  }

  &__num {
    font-size: 18px;
    font-weight: $font-bold;
    letter-spacing: 0.12em;
    color: $color-accent-deep;
  }

  &__title {
    font-size: 22px;
  }

  &__desc {
    font-size: 15px;
    line-height: 1.8;
    color: $text-muted-light;
  }
}

@media (prefers-reduced-motion: reduce) {
  .advantage-grid__item {
    opacity: 1;
    transform: none;
    clip-path: none;
    transition: none;
  }
}
</style>
