<script setup lang="ts">
import type { StatItem } from '@/data/content'
import { content } from '@/i18n'

interface Props {
  stats: StatItem[]
}

defineProps<Props>()
</script>

<template>
  <section class="stat-block" :aria-label="content.ui.statAria">
    <div class="stat-block__inner">
      <ul class="stat-block__grid">
        <li v-for="stat in stats" :key="stat.value" class="stat-block__item">
          <p class="stat-block__value">{{ stat.value }}</p>
          <p class="stat-block__desc">{{ stat.description }}</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.stat-block {
  background-color: $color-white;
  color: $color-primary-deep;
  padding-block: 48px;

  @include respond-to('l') {
    padding-block: 72px;
  }

  &__inner {
    @include container;
  }

  &__grid {
    display: grid;
    gap: 40px;

    @include respond-to('m') {
      grid-template-columns: repeat(2, 1fr);
      gap: 48px 40px;
    }

    @include respond-to('l') {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  &__item {
    border-top: 2px solid $line-light;
    padding-top: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  &__value {
    font-size: clamp(40px, 4vw, 64px);
    font-weight: $font-black;
    line-height: 1;
    letter-spacing: -0.02em;
    color: $color-primary-deep;
  }

  &__desc {
    margin-top: 16px;
    font-size: 15px;
    line-height: 1.7;
    color: $text-muted-light;
    max-width: 280px;
  }
}
</style>
