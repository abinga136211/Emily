<script setup lang="ts">
import type { AdvantageItem } from '@/data/content'

interface Props {
  items: AdvantageItem[]
}

defineProps<Props>()
</script>

<template>
  <ul class="advantage-grid">
    <li v-for="(item, index) in items" :key="item.title" class="advantage-grid__item">
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
    color: $text-muted-dark;
  }
}
</style>
