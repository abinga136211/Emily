<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import SectionWrapper from '@/components/ui/SectionWrapper.vue'
import { content, locale } from '@/i18n'
import { submitConsultation } from '@/api/site'
import { displayChannels } from '@/composables/useSiteConfig'

const heroImage = `${import.meta.env.BASE_URL}contact-hero.jpg`.replace(/([^:]\/)\/+/g, '$1')
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const form = reactive({
  name: '',
  email: '',
  message: ''
})

const errors = reactive({
  name: '',
  email: '',
  message: ''
})

const showSuccess = ref(false)
const pageEntered = ref(false)
const submitting = ref(false)
const submitError = ref('')

const syncTitle = () => {
  document.title = content.value.contactPage.metaTitle
}

onMounted(() => {
  syncTitle()
  requestAnimationFrame(() => {
    pageEntered.value = true
  })
})
watch(() => content.value.contactPage.metaTitle, syncTitle)

onBeforeUnmount(() => {
  document.title = content.value.meta.title
})

const isExternal = (href?: string) => Boolean(href?.startsWith('http'))

const clearError = (field: keyof typeof errors) => {
  errors[field] = ''
  submitError.value = ''
}

const validate = () => {
  const page = content.value.contactPage
  const name = form.name.trim()
  const email = form.email.trim()
  const message = form.message.trim()

  errors.name = name ? '' : page.formRequiredError
  errors.message = message ? '' : page.formRequiredError

  if (!email) {
    errors.email = page.formRequiredError
  } else if (!EMAIL_RE.test(email)) {
    errors.email = page.formEmailError
  } else {
    errors.email = ''
  }

  return !errors.name && !errors.email && !errors.message
}

const onSubmit = async () => {
  if (!validate() || submitting.value) return

  submitting.value = true
  submitError.value = ''
  try {
    await submitConsultation({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim()
    })
    form.name = ''
    form.email = ''
    form.message = ''
    errors.name = ''
    errors.email = ''
    errors.message = ''
    showSuccess.value = true
  } catch {
    submitError.value =
      locale.value === 'en'
        ? 'Submission failed. Please try again later.'
        : '提交失败，请稍后重试'
  } finally {
    submitting.value = false
  }
}

const closeSuccess = () => {
  showSuccess.value = false
}
</script>

<template>
  <div class="contact-page" :class="{ 'contact-page--entered': pageEntered }">
    <header
      class="contact-hero"
      :style="{ '--contact-hero-image': `url('${heroImage}')` }"
    >
      <div class="contact-hero__inner">
        <p class="contact-hero__eyebrow contact-reveal" style="--reveal-i: 0">
          {{ content.contactPage.eyebrow }}
        </p>
        <h1 class="contact-hero__title contact-reveal" style="--reveal-i: 1">
          {{ content.contactPage.title }}
        </h1>
        <p class="contact-hero__lead contact-reveal" style="--reveal-i: 2">
          {{ content.contactPage.lead }}
        </p>
      </div>
    </header>

    <SectionWrapper
      id="channels"
      bg="white"
      class="contact-channels-section"
      :style="{ '--contact-mail-image': `url('${heroImage}')` }"
    >
      <article class="mail-letter contact-reveal" style="--reveal-i: 3" aria-label="email">
        <div class="mail-letter__main">
          <div class="mail-letter__main-left">
            <p class="mail-letter__copy contact-reveal" style="--reveal-i: 4">
              {{ content.contactHero.subtitle }}
            </p>
            <p class="mail-letter__note contact-reveal" style="--reveal-i: 5">
              {{ content.contactNote }}
            </p>

            <form id="contact-inquiry" class="mail-letter__form" novalidate @submit.prevent="onSubmit">
              <label
                class="mail-letter__control contact-reveal"
                style="--reveal-i: 6"
                :class="{ 'mail-letter__control--error': errors.name }"
              >
                <span class="mail-letter__label">{{ content.contactPage.formNameLabel }}</span>
                <input
                  v-model="form.name"
                  type="text"
                  name="name"
                  autocomplete="name"
                  :aria-invalid="Boolean(errors.name)"
                  :aria-describedby="errors.name ? 'contact-name-error' : undefined"
                  :placeholder="content.contactPage.formNamePlaceholder"
                  @input="clearError('name')"
                />
                <span
                  v-if="errors.name"
                  id="contact-name-error"
                  class="mail-letter__error"
                  role="alert"
                >
                  {{ errors.name }}
                </span>
              </label>
              <label
                class="mail-letter__control contact-reveal"
                style="--reveal-i: 7"
                :class="{ 'mail-letter__control--error': errors.email }"
              >
                <span class="mail-letter__label">{{ content.contactPage.formEmailLabel }}</span>
                <input
                  v-model="form.email"
                  type="email"
                  name="email"
                  autocomplete="email"
                  :aria-invalid="Boolean(errors.email)"
                  :aria-describedby="errors.email ? 'contact-email-error' : undefined"
                  :placeholder="content.contactPage.formEmailPlaceholder"
                  @input="clearError('email')"
                />
                <span
                  v-if="errors.email"
                  id="contact-email-error"
                  class="mail-letter__error"
                  role="alert"
                >
                  {{ errors.email }}
                </span>
              </label>
              <label
                class="mail-letter__control contact-reveal"
                style="--reveal-i: 8"
                :class="{ 'mail-letter__control--error': errors.message }"
              >
                <span class="mail-letter__label">{{ content.contactPage.formMessageLabel }}</span>
                <textarea
                  v-model="form.message"
                  name="message"
                  rows="4"
                  :aria-invalid="Boolean(errors.message)"
                  :aria-describedby="errors.message ? 'contact-message-error' : undefined"
                  :placeholder="content.contactPage.formMessagePlaceholder"
                  @input="clearError('message')"
                />
                <span
                  v-if="errors.message"
                  id="contact-message-error"
                  class="mail-letter__error"
                  role="alert"
                >
                  {{ errors.message }}
                </span>
              </label>
            </form>

            <footer class="mail-letter__signoff contact-reveal" style="--reveal-i: 9">
              <p v-if="submitError" class="mail-letter__error mail-letter__submit-error" role="alert">
                {{ submitError }}
              </p>
              <button
                type="submit"
                form="contact-inquiry"
                class="btn btn--black mail-letter__cta"
                :disabled="submitting"
              >
                {{ content.contactPage.formSubmitLabel }}
              </button>
            </footer>
          </div>

          <aside class="mail-letter__aside">
            <dl class="mail-letter__fields">
              <div
                v-for="(channel, index) in displayChannels"
                :key="channel.id || `${channel.label}-${index}`"
                class="mail-letter__field contact-reveal"
                :style="{ '--reveal-i': 5 + index }"
              >
                <dt>{{ channel.label }}</dt>
                <dd>
                  <a
                    v-if="channel.href"
                    :href="channel.href"
                    :target="isExternal(channel.href) ? '_blank' : undefined"
                    :rel="isExternal(channel.href) ? 'noopener noreferrer' : undefined"
                  >
                    {{ channel.value }}
                  </a>
                  <template v-else>{{ channel.value }}</template>
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </article>
    </SectionWrapper>

    <div
      v-if="showSuccess"
      class="contact-success"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-success-title"
    >
      <button
        type="button"
        class="contact-success__backdrop"
        aria-label="close"
        @click="closeSuccess"
      />
      <div class="contact-success__panel">
        <p id="contact-success-title" class="contact-success__message">
          {{ content.contactPage.formSuccessMessage }}
        </p>
        <button type="button" class="btn btn--black contact-success__btn" @click="closeSuccess">
          {{ content.contactPage.formSuccessClose }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.contact-page {
  padding-top: $header-height;
}

.contact-reveal {
  opacity: 0;
  transform: translateY(-22px);
  transition:
    opacity 620ms $ease-standard,
    transform 620ms $ease-standard;
  transition-delay: calc(var(--reveal-i, 0) * 90ms);
  will-change: opacity, transform;
}

.contact-page--entered .contact-reveal {
  opacity: 1;
  transform: translateY(0);
}

.contact-hero {
  position: relative;
  overflow: hidden;
  color: $color-white;
  background-color: $color-primary-deep;
  background-image:
    linear-gradient(
      105deg,
      rgba(11, 42, 74, 0.82) 0%,
      rgba(11, 42, 74, 0.58) 45%,
      rgba(11, 42, 74, 0.32) 100%
    ),
    var(--contact-hero-image);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  &__inner {
    @include container;
    position: relative;
    padding-block: 64px 56px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 880px;

    @include respond-to('l') {
      padding-block: 88px 72px;
    }
  }

  &__eyebrow {
    @include eyebrow;
    color: $color-white;
  }

  &__title {
    font-size: clamp(36px, 5vw, 56px);
    font-weight: $font-black;
    line-height: 1.15;
    letter-spacing: -0.02em;
  }

  &__lead {
    font-size: clamp(16px, 1.6vw, 18px);
    line-height: 1.7;
    color: rgba($color-white, 0.88);
    max-width: 36em;
  }
}

:deep(.contact-channels-section.section) {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  background-color: $color-bg-light !important;
  background-image: none !important;

  &::before {
    content: '';
    position: absolute;
    inset: -20px;
    z-index: 0;
    background-image: var(--contact-mail-image);
    background-size: cover;
    background-position: center;
    filter: blur(8px);
    transform: scale(1.05);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    background: rgba(11, 42, 74, 0.28);
    pointer-events: none;
  }

  > .section__inner,
  .section__inner {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
  }

  @include respond-to('l') {
    padding-block: 72px 88px;
  }
}

.mail-letter {
  position: relative;
  width: min(100%, 960px);
  background-color: $color-white;
  color: $color-primary-deep;
  padding: 36px 28px 40px;
  box-shadow:
    0 18px 48px rgba(11, 42, 74, 0.16),
    0 1px 0 rgba(11, 42, 74, 0.06);

  @include respond-to('m') {
    padding: 44px 48px 48px;
  }

  &__main {
    display: grid;
    gap: 28px;
    align-items: start;

    @include respond-to('s') {
      grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
      gap: 28px 32px;
    }

    @include respond-to('l') {
      grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
      gap: 40px 48px;
    }
  }

  &__main-left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
    min-width: 0;
  }

  &__aside {
    display: flex;
    flex-direction: column;
    min-width: 0;

    @include respond-to('s') {
      padding-left: 24px;
      border-left: 1px solid $line-light;
    }

    @include respond-to('l') {
      padding-left: 32px;
    }
  }

  &__copy {
    font-size: 16px;
    line-height: 1.8;
    color: $text-muted-light;
  }

  &__fields {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 16px 0;
    border-bottom: 1px solid $line-light;

    dt {
      font-size: 13px;
      font-weight: $font-bold;
      letter-spacing: 0.04em;
      color: $color-accent-deep;
    }

    dd {
      font-size: 15px;
      font-weight: $font-bold;
      line-height: 1.55;
      color: $color-primary-deep;
      word-break: break-word;

      a {
        color: inherit;
        transition: color $transition-fast;

        &:hover {
          color: $color-accent-deep;
        }

        &:focus-visible {
          @include focus-ring;
        }
      }
    }
  }

  &__note {
    font-size: 14px;
    font-weight: $font-bold;
    line-height: 1.7;
    color: $color-accent-deep;
  }

  &__form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 4px;
  }

  &__control {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
  }

  &__label {
    font-size: 13px;
    font-weight: $font-bold;
    letter-spacing: 0.04em;
    color: $color-accent-deep;
  }

  &__control input,
  &__control textarea {
    width: 100%;
    margin: 0;
    padding: 10px 0 12px;
    border: 0;
    border-bottom: 1px solid $line-light;
    border-radius: 0;
    background: transparent;
    color: $color-primary-deep;
    font: inherit;
    font-size: 15px;
    font-weight: $font-bold;
    line-height: 1.5;
    resize: vertical;
    transition: border-color $transition-fast;

    &::placeholder {
      color: rgba($color-primary-deep, 0.35);
      font-weight: $font-regular;
    }

    &:hover {
      border-bottom-color: rgba($color-primary-deep, 0.28);
    }

    &:focus {
      outline: none;
      border-bottom-color: $color-accent-deep;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  &__control textarea {
    min-height: 96px;
  }

  &__control--error input,
  &__control--error textarea {
    border-bottom-color: #b42318;
  }

  &__error {
    font-size: 13px;
    font-weight: $font-bold;
    line-height: 1.4;
    color: #b42318;
  }

  &__signoff {
    margin-top: 4px;
  }

  &__cta {
    margin-top: 0;
  }
}

.contact-success {
  position: fixed;
  inset: 0;
  z-index: 1200;
  display: grid;
  place-items: center;
  padding: 24px;

  &__backdrop {
    position: absolute;
    inset: 0;
    border: 0;
    margin: 0;
    padding: 0;
    cursor: pointer;
    background: rgba(11, 42, 74, 0.48);
  }

  &__panel {
    position: relative;
    z-index: 1;
    width: min(100%, 400px);
    padding: 36px 28px 28px;
    background: $color-white;
    color: $color-primary-deep;
    text-align: center;
    box-shadow: 0 18px 48px rgba(11, 42, 74, 0.2);
    animation: contact-rise 0.35s $ease-standard both;
  }

  &__message {
    margin: 0 0 24px;
    font-size: 17px;
    font-weight: $font-bold;
    line-height: 1.6;
  }

  &__btn {
    min-width: 120px;
  }
}

@keyframes contact-rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .contact-reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .contact-success__panel {
    animation: none;
  }
}
</style>
