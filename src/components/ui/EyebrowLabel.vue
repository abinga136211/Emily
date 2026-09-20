<script setup lang="ts">
interface Props {
  text: string
  color?: 'accent' | 'accent-deep' | 'white' | 'primary'
}

withDefaults(defineProps<Props>(), {
  color: 'accent'
})
</script>

<template>
  <p class="eyebrow-label" :class="`eyebrow-label--${color}`">{{ text }}</p>
</template>

<style scoped lang="scss">
.eyebrow-label {
  @include eyebrow;

  &--accent {
    color: $color-accent;
  }

  &--accent-deep {
    color: $color-accent-deep;
  }

  &--white {
    color: $color-white;
  }

  &--primary {
    color: $color-primary-deep;
  }
}
</style>