<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { IndustryItem } from '@/data/content'
import { content } from '@/i18n'

defineProps<{ industry: IndustryItem }>()

const router = useRouter()

const handleCtaClick = (event: MouseEvent) => {
  event.preventDefault()
  router.push({ path: '/contact' })
}
</script>

<template>
  <article class="industry-card">
    <div class="industry-card__copy">
      <h3 class="industry-card__title">{{ industry.title }}</h3>
      <p class="industry-card__text">{{ industry.scenario }}</p>
      <p class="industry-card__text">{{ industry.offer }}</p>
      <a href="/contact" class="industry-card__cta" @click="handleCtaClick">
        {{ content.ui.industryExpand }}
        <span class="industry-card__cta-arrow" aria-hidden="true">→</span>
      </a>
    </div>

    <figure class="industry-card__visual">
      <img
        class="industry-card__image"
        :src="industry.image"
        :alt="industry.title"
        loading="lazy"
      />
    </figure>
  </article>
</template>

<style scoped lang="scss">
.industry-card {
  display: grid;
  gap: 32px;
  align-items: center;
  padding: 32px 24px;
  background-color: transparent;

  @include respond-to('m') {
    padding: 40px 8px;
  }

  @include respond-to('l') {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
    gap: 48px 56px;
    padding: 48px 0;
  }

  &__copy {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    max-width: 520px;
  }

  &__title {
    font-size: clamp(28px, 3.4vw, 40px);
    font-weight: $font-black;
    line-height: 1.2;
    letter-spacing: -0.01em;
    color: $color-primary-deep;
  }

  &__text {
    font-size: 16px;
    line-height: 1.75;
    color: $text-muted-light;
  }

  &__cta {
    margin-top: 8px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: $font-bold;
    color: $color-primary;
    transition:
      color $transition-fast,
      gap $transition-fast;

    &:hover {
      color: $color-primary-deep;
      gap: 12px;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__cta-arrow {
    font-size: 18px;
    line-height: 1;
  }

  &__visual {
    margin: 0;
    width: 100%;
    border-radius: 16px;
    overflow: hidden;
    background-color: $color-white;
    box-shadow:
      0 18px 40px rgba(11, 42, 74, 0.1),
      0 2px 8px rgba(11, 42, 74, 0.06);
  }

  &__image {
    display: block;
    width: 100%;
    max-width: none;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    object-position: center;
  }
}
</style>








