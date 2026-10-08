<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { cookieCopy, locale } from '@/i18n'

const COOKIE_NAME = 'skmc-cookie-consent'
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60 // 1 year
const LEGACY_STORAGE_KEY = 'skmc-cookie-consent'

type Consent = 'accepted' | 'rejected'

const visible = ref(false)

const useBookMarks = computed(() => locale.value !== 'en')

const linkJoiner = computed(() => (locale.value === 'en' ? ` ${cookieCopy.value.mid} ` : cookieCopy.value.mid))

function readCookie(name: string): string | null {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

function writeCookie(name: string, value: string, maxAge = COOKIE_MAX_AGE) {
  const parts = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    'Path=/',
    `Max-Age=${maxAge}`,
    'SameSite=Lax'
  ]
  if (location.protocol === 'https:') {
    parts.push('Secure')
  }
  document.cookie = parts.join('; ')
}

function getConsent(): Consent | null {
  const fromCookie = readCookie(COOKIE_NAME)
  if (fromCookie === 'accepted' || fromCookie === 'rejected') return fromCookie

  // 迁移旧版 localStorage 偏好到真正的 Cookie
  const legacy = localStorage.getItem(LEGACY_STORAGE_KEY)
  if (legacy === 'accepted' || legacy === 'rejected') {
    writeCookie(COOKIE_NAME, legacy)
    localStorage.removeItem(LEGACY_STORAGE_KEY)
    return legacy
  }

  return null
}

function setConsent(choice: Consent) {
  writeCookie(COOKIE_NAME, choice)
  localStorage.removeItem(LEGACY_STORAGE_KEY)
}

onMounted(() => {
  if (!getConsent()) {
    visible.value = true
  }
})

function dismiss(choice: Consent) {
  setConsent(choice)
  visible.value = false
}
</script>

<template>
  <Transition name="cookie-slide">
    <aside
      v-if="visible"
      class="cookie-banner"
      role="dialog"
      aria-live="polite"
      :aria-label="cookieCopy.ariaLabel"
    >
      <div class="cookie-banner__inner">
        <div class="cookie-banner__copy">
          <p class="cookie-banner__title">{{ cookieCopy.title }}</p>
          <p class="cookie-banner__text">
            {{ cookieCopy.beforeLinks }}<!--
            --><template v-if="useBookMarks"><span class="cookie-banner__book">《</span></template><!--
            --><a class="cookie-banner__link" href="#privacy" @click.prevent>{{ cookieCopy.privacyLabel }}</a><!--
            --><template v-if="useBookMarks"><span class="cookie-banner__book">》</span></template><!--
            -->{{ linkJoiner }}<!--
            --><template v-if="useBookMarks"><span class="cookie-banner__book">《</span></template><!--
            --><a class="cookie-banner__link" href="#cookie-policy" @click.prevent>{{ cookieCopy.cookieLabel }}</a><!--
            --><template v-if="useBookMarks"><span class="cookie-banner__book">》</span></template><!--
            -->{{ cookieCopy.afterLinks }}
          </p>
        </div>

        <div class="cookie-banner__actions">
          <button type="button" class="cookie-banner__btn" @click="dismiss('rejected')">
            {{ cookieCopy.reject }}
          </button>
          <button type="button" class="cookie-banner__btn cookie-banner__btn--accept" @click="dismiss('accepted')">
            {{ cookieCopy.accept }}
          </button>
        </div>
      </div>
    </aside>
  </Transition>
</template>

<style scoped lang="scss">
.cookie-banner {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 300;
  padding: 22px 40px;
  background: rgba(8, 18, 32, 0.58);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  color: $color-white;
  font-family: $font-family-base;
}

.cookie-banner__inner {
  max-width: $max-width;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
}

.cookie-banner__copy {
  flex: 1;
  min-width: 0;
}

.cookie-banner__title {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: $font-bold;
  line-height: 1.4;
  color: $color-white;
  letter-spacing: 0.01em;
}

.cookie-banner__text {
  margin: 0;
  font-size: 14px;
  font-weight: $font-regular;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.9);
}

.cookie-banner__book {
  color: rgba(255, 255, 255, 0.9);
}

.cookie-banner__link {
  color: $color-white;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: opacity $transition-fast;

  &:hover {
    opacity: 0.8;
  }
}

.cookie-banner__actions {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 14px;
}

.cookie-banner__btn {
  min-width: 96px;
  padding: 9px 30px;
  border: 1px solid rgba(255, 255, 255, 0.75);
  border-radius: 9999px;
  background: transparent;
  color: $color-white;
  font-family: inherit;
  font-size: 14px;
  font-weight: $font-regular;
  line-height: 1.2;
  cursor: pointer;
  transition:
    background-color $transition-fast,
    border-color $transition-fast,
    color $transition-fast;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: $color-white;
  }

  &:focus-visible {
    outline: 2px solid $color-white;
    outline-offset: 2px;
  }
}

.cookie-banner__btn--accept {
  background: rgba(0, 0, 0, 0.28);
  border-color: rgba(255, 255, 255, 0.85);

  &:hover {
    background: rgba(0, 0, 0, 0.42);
  }
}

.cookie-slide-enter-active,
.cookie-slide-leave-active {
  transition:
    transform 280ms $ease-standard,
    opacity 280ms $ease-standard;
}

.cookie-slide-enter-from,
.cookie-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

@media (max-width: #{$bp-m - 1px}) {
  .cookie-banner {
    padding: 16px 20px;
  }

  .cookie-banner__inner {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .cookie-banner__actions {
    justify-content: flex-end;
  }

  .cookie-banner__btn {
    flex: 1;
    min-width: 0;
  }
}
</style>
