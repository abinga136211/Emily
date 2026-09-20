<script setup lang="ts">
interface Props {
  id?: string
  bg?: 'white' | 'primary' | 'neutral' | 'accent'
  compact?: boolean
}

withDefaults(defineProps<Props>(), {
  id: undefined,
  bg: 'white',
  compact: false,
})
</script>

<template>
  <section :id="id" class="section" :class="[`section--${bg}`, { 'section--compact': compact }]">
    <div class="section__inner">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.section {
  padding-block: 48px;

  @include respond-to('l') {
    padding-block: 72px;
  }

  &--compact {
    padding-block: 40px;

    @include respond-to('l') {
      padding-block: 56px;
    }
  }

  &__inner {
    @include container;
  }

  &--white {
    background-color: $color-white;
    color: $color-primary-deep;
  }

  &--primary {
    background-color: $color-primary-deep;
    color: $color-white;
  }

  &--neutral {
    background-color: $color-bg-light;
    color: $color-primary-deep;
  }

  &--accent {
    background-color: $color-accent;
    color: $color-primary-deep;
  }
}
</style>
