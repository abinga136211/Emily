<script setup lang="ts">
import { ref } from 'vue'
import type { IndustryItem } from '@/data/content'
import { content } from '@/i18n'

interface Props {
  industry: IndustryItem
}

defineProps<Props>()

const expanded = ref(false)

const toggle = () => {
  expanded.value = !expanded.value
}
</script>

<template>
  <article class="industry-card">
    <img class="industry-card__image" :src="industry.image" :alt="industry.title" loading="lazy" />
    <h3 class="industry-card__title">{{ industry.title }}</h3>

    <div class="industry-card__col">
      <p class="industry-card__label">{{ content.ui.industryScenario }}</p>
      <p class="industry-card__text">{{ industry.scenario }}</p>
    </div>

    <div class="industry-card__expand" :class="{ 'industry-card__expand--open': expanded }">
      <div class="industry-card__expand-clip">
        <div class="industry-card__col industry-card__col--offer">
          <p class="industry-card__label industry-card__label--offer">{{ content.ui.industryOffer }}</p>
          <p class="industry-card__text">{{ industry.offer }}</p>
        </div>
      </div>
    </div>

    <button
      class="industry-card__toggle"
      :aria-expanded="expanded"
      @click="toggle"
    >
      {{ expanded ? content.ui.industryCollapse : content.ui.industryExpand }}
    </button>
  </article>
</template>

<style scoped lang="scss">
.industry-card {
  display: flex;
  flex-direction: column;
  background-color: $color-white;
  border: 1px solid $color-bg-light;
  border-top: 2px solid $color-primary-deep;
  padding: 32px;
  transition: border-color $transition-fast;

  @include respond-to('l') {
    padding: 40px;
  }

  &:hover {
    border-color: $color-primary-deep;
  }

  // 全出血：用负边距抵消卡片内边距，使图片紧贴卡片顶部与左右边缘
  &__image {
    max-width: none; // 解除全局 img reset 的 max-width: 100% 钳制，允许撑满全宽
    width: calc(100% + 64px);
    margin: -32px -32px 24px;
    aspect-ratio: 1 / 1;
    object-fit: cover;

    @include respond-to('l') {
      width: calc(100% + 80px);
      margin: -40px -40px 24px;
    }
  }

  &__title {
    font-size: 20px;
    margin-bottom: 24px;
  }

  &__col {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__label {
    @include eyebrow;
    color: $color-primary-deep;
  }

  &__label--offer {
    color: $color-accent-deep;
  }

  &__text {
    font-size: 15px;
    line-height: 1.8;
    color: $text-muted-light;
  }

  // ---------- 展开区（0fr/1fr 高度过渡） ----------
  &__expand {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 320ms $ease-standard;

    &--open {
      grid-template-rows: 1fr;
    }
  }

  &__expand-clip {
    overflow: hidden;
  }

  &__col--offer {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid $color-bg-light;
  }

  // ---------- 查看更多 ----------
  &__toggle {
    margin-top: auto;
    padding-top: 24px;
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: $font-bold;
    color: $color-primary-deep;
    border-bottom: 2px solid $color-primary-deep;
    padding-bottom: 4px;
    transition: gap $transition-fast;

    &::after {
      content: '↓';
      transition: transform 320ms $ease-standard;
    }

    &[aria-expanded='true']::after {
      content: '↑';
    }

    &:hover {
      gap: 16px;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }
}
</style>
