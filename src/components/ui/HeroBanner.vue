<script setup lang="ts">
import { computed } from 'vue'
import EyebrowLabel from '@/components/ui/EyebrowLabel.vue'

interface Props {
  eyebrow: string
  title: string
  subtitle?: string
  ctaText?: string
  ctaTo?: string
  variant?: 'primary' | 'white'
  image?: string
  imageAlt?: string
  /** 自定义背景色（如 #C8A24A）；设置后文字自动切换为深色以保证可读性 */
  bg?: string
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: '',
  ctaText: '',
  ctaTo: '#contact',
  variant: 'white',
  image: '',
  imageAlt: '',
  bg: ''
})

const eyebrowColor = computed<'white'>(() => 'white')

const sectionStyle = computed(() =>
  props.bg ? { backgroundColor: props.bg } : undefined
)

const handleCtaClick = (event: MouseEvent) => {
  if (!props.ctaTo.startsWith('#')) return
  event.preventDefault()
  document.getElementById(props.ctaTo.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <section
    class="hero"
    :class="[`hero--${variant}`, { 'hero--split': image }]"
    :style="sectionStyle"
  >
    <div class="hero__inner">
      <div class="hero__grid">
        <div class="hero__content">
          <EyebrowLabel :text="eyebrow" :color="eyebrowColor" class="hero__eyebrow" />
          <h1 class="hero__title">{{ title }}</h1>
          <p v-if="subtitle" class="hero__subtitle">{{ subtitle }}</p>
          <a
            v-if="ctaText"
            :href="ctaTo"
            class="btn"
            :class="variant === 'primary' ? 'btn--white' : 'btn--black'"
            @click="handleCtaClick"
          >
            {{ ctaText }}
          </a>
        </div>

        <figure v-if="image" class="hero__media">
          <img :src="image" :alt="imageAlt || title" loading="eager" />
        </figure>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  padding-block: 96px 64px;

  @include respond-to('l') {
    padding-block: 120px 80px;
  }

  &__inner {
    @include container;
  }

  // ---------- 左文右图栅格 ----------
  &__grid {
    display: flex;
    flex-direction: column;
    gap: 48px;

    @include respond-to('l') {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 40px;
      align-items: stretch;
    }
  }

  &__content {
    max-width: 880px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;

    .btn {
      margin-top: 16px;
    }

    @include respond-to('l') {
      max-width: none;
      grid-column: span 7;
      align-self: center;
    }
  }

  &__title {
    max-width: 20ch;
  }

  &__subtitle {
    max-width: 640px;
    font-size: 17px;
    line-height: 1.8;
  }

  // ---------- 图片（区块高度由图片决定） ----------
  &__media {
    width: 100%;
    margin: 0;
    overflow: hidden;
    border-radius: $radius-sm;

    img {
      width: 100%;
      height: 100%;
      aspect-ratio: 4 / 3;
      object-fit: cover;
    }

    @include respond-to('l') {
      grid-column: 9 / span 4;
      aspect-ratio: 3 / 4;

      img {
        aspect-ratio: auto;
      }
    }
  }

  // ---------- 有图时的紧凑尺寸：区块高度贴合图片 ----------
  &--split {
    padding-block: 64px 0;

    @include respond-to('l') {
      padding-block: 0;
    }
  }

  &--primary {
    background-color: $color-primary-deep;
    color: $color-white;

    .hero__subtitle {
      color: $text-muted-dark;
    }
  }

  &--white {
    background-color: $color-white;
    color: $color-primary-deep;

    .hero__subtitle {
      color: $text-muted-light;
    }
  }
}
</style>
