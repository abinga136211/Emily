<script setup lang="ts">
import type { ServiceItem } from '@/data/content'

interface Props {
  service: ServiceItem
  layout?: 'card' | 'wide'
}

withDefaults(defineProps<Props>(), {
  layout: 'card'
})
</script>

<template>
  <article class="service-card" :class="`service-card--${layout}`">
    <header class="service-card__head">
      <span class="service-card__index" aria-hidden="true">{{ service.index }}</span>
      <div class="service-card__heading">
        <h3 class="service-card__title">{{ service.title }}</h3>
        <p class="service-card__subtitle">{{ service.subtitle }}</p>
      </div>
    </header>
    <div class="service-card__body">
      <p class="service-card__desc">{{ service.description }}</p>
      <div class="service-card__highlight">
        <p>{{ service.highlight }}</p>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.service-card {
  display: flex;
  flex-direction: column;
  gap: 24px;

  &__head {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__index {
    font-size: 13px;
    font-weight: $font-bold;
    letter-spacing: 0.12em;
    color: $text-muted-light;
  }

  &__heading {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__title {
    font-size: 22px;
  }

  &__subtitle {
    font-size: 14px;
    color: $text-muted-light;
    letter-spacing: 0.02em;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &__desc {
    font-size: 15px;
    line-height: 1.8;
    color: $text-muted-light;
  }

  &__highlight {
    background-color: $color-bg-light;
    border-left: 2px solid $color-primary-deep;
    padding: 16px 24px;

    p {
      font-size: 14px;
      font-weight: $font-bold;
      line-height: 1.7;
    }
  }

  // ---------- Card 模式（网格卡片） ----------
  &--card {
    background-color: $color-white;
    border: 1px solid $color-bg-light;
    border-top: 2px solid $color-primary-deep;
    padding: 32px;
    height: 100%;
    transition: border-color $transition-fast;

    &:hover {
      border-color: $color-primary-deep;
    }
  }

  // ---------- Wide 模式（平行四边形卡片） ----------
  &--wide {
    background-color: $color-white;
    border: 1px solid $line-light;
    transform: skewX(6deg);
    padding: 40px 48px;

    @include respond-to('l') {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 40px;

      // 去掉纵向内边距，使头部平行四边形撑满卡片全高
      padding: 0 88px;
    }

    .service-card__index {
      font-size: 48px;
      font-weight: $font-black;
      line-height: 1;
      letter-spacing: -0.02em;
      color: $color-white;
    }

    .service-card__title {
      font-size: clamp(24px, 2.4vw, 32px);
    }

    .service-card__subtitle {
      font-size: 15px;
      color: $text-muted-dark;
    }

    // 头部：单个平行四边形装载编号、标题、副标题（与卡片同向倾斜）
    .service-card__head {
      background-color: $color-primary-deep;
      color: $color-white;
      padding: 24px 32px;

      @include respond-to('l') {
        grid-column: span 4;
        padding: 32px 40px;
      }

      // 头内文字反向转正
      .service-card__index,
      .service-card__heading {
        transform: skewX(-6deg);
      }
    }

    .service-card__body {
      transform: skewX(-6deg);

      @include respond-to('l') {
        grid-column: 6 / span 7;
        padding-block: 56px;
      }
    }

    .service-card__desc {
      font-size: 17px;
    }
  }
}
</style>
