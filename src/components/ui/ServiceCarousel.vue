<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import ServiceCard from '@/components/ui/ServiceCard.vue'
import type { ServiceItem } from '@/data/content'
import { content } from '@/i18n'

const props = defineProps<{ services: ServiceItem[] }>()

const active = ref(0)

const goTo = (index: number) => {
  if (index < 0 || index >= props.services.length) return
  active.value = index
}

const next = () => goTo((active.value + 1) % props.services.length)
const prev = () => goTo((active.value - 1 + props.services.length) % props.services.length)

// 供页脚等服务深链切换到指定卡片
const onServiceShow = (event: Event) => {
  const id = (event as CustomEvent<string>).detail
  const index = props.services.findIndex((service) => service.id === id)
  if (index >= 0) goTo(index)
}

onMounted(() => window.addEventListener('service:show', onServiceShow))
onBeforeUnmount(() => window.removeEventListener('service:show', onServiceShow))
</script>

<template>
  <div class="service-carousel">
    <div class="service-carousel__viewport">
      <div
        v-for="(service, index) in services"
        :id="service.id"
        :key="service.id"
        class="service-carousel__slide"
        :class="{
          'service-carousel__slide--active': index === active,
          'service-carousel__slide--left': index < active,
          'service-carousel__slide--right': index > active
        }"
        :aria-hidden="index !== active"
      >
        <ServiceCard :service="service" layout="wide" />
      </div>
    </div>

    <div class="service-carousel__controls">
      <button class="service-carousel__arrow" :aria-label="content.ui.servicePrev" @click="prev">←</button>

      <div class="service-carousel__tabs" role="tablist" :aria-label="content.ui.serviceTabsAria">
        <button
          v-for="(service, index) in services"
          :key="service.id"
          class="service-carousel__tab"
          :class="{ 'service-carousel__tab--active': index === active }"
          role="tab"
          :aria-selected="index === active"
          @click="goTo(index)"
        >
          <span class="service-carousel__tab-num">{{ service.index }}</span>
          <span class="service-carousel__tab-label">{{ service.title }}</span>
        </button>
      </div>

      <button class="service-carousel__arrow" :aria-label="content.ui.serviceNext" @click="next">→</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.service-carousel {
  // ---------- 卡片堆叠视口 ----------
  &__viewport {
    position: relative;
  }

  &__slide {
    position: absolute;
    inset: 0 0 auto;
    z-index: 0;
    opacity: 0;
    visibility: hidden;
    // 左右滑动：位于右侧等待进入
    transform: translateX(40px);
    transition:
      opacity 320ms $ease-standard,
      transform 320ms $ease-standard,
      visibility 0s linear 320ms;

    &--left {
      // 已滑过的卡片停在左侧
      transform: translateX(-40px);
    }

    &--right {
      transform: translateX(40px);
    }

    &--active {
      position: relative;
      inset: auto;
      z-index: 1;
      opacity: 1;
      visibility: visible;
      transform: none;
      transition-delay: 0s;
    }
  }

  // ---------- 切换控件 ----------
  &__controls {
    margin-top: 40px;
    padding-top: 24px;
    border-top: 1px solid $color-bg-light;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &__arrow {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid $line-light;
    border-radius: $radius-sm;
    font-size: 18px;
    transition:
      background-color $transition-fast,
      color $transition-fast,
      border-color $transition-fast;

    &:hover {
      background-color: $color-primary-deep;
      border-color: $color-primary-deep;
      color: $color-white;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__tabs {
    display: flex;
    flex: 1;
    gap: 8px;
    overflow-x: auto;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__tab {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    min-height: 48px;
    padding: 0 16px;
    border: 1px solid transparent;
    border-radius: $radius-sm;
    font-size: 14px;
    font-weight: $font-bold;
    color: $text-muted-light;
    white-space: nowrap;
    transition:
      background-color $transition-fast,
      color $transition-fast,
      border-color $transition-fast;

    &-num {
      font-size: 13px;
      letter-spacing: 0.08em;
    }

    &-label {
      display: none;

      @include respond-to('m') {
        display: inline;
      }
    }

    &:hover {
      color: $color-primary-deep;
      border-color: $line-light;
    }

    &--active {
      background-color: $color-primary-deep;
      border-color: $color-primary-deep;
      color: $color-white;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }
}
</style>
