<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import { content, locale, setLocale } from "@/i18n";

const menuOpen = ref(false);
const activeSection = ref("top");

// 页面区块 → 导航项映射
const sectionToNav: Record<string, string> = {
  positioning: "top",
  services: "services",
  industries: "industries",
  about: "about",
  advantages: "about",
  security: "about",
  contact: "contact",
};

let observer: IntersectionObserver | null = null;

onMounted(() => {
  const sections = Object.keys(sectionToNav)
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null);

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeSection.value = sectionToNav[entry.target.id] ?? "top";
        }
      }
    },
    { rootMargin: "-160px 0px -55% 0px", threshold: 0 },
  );

  sections.forEach((section) => observer?.observe(section));
});

onBeforeUnmount(() => {
  observer?.disconnect();
});

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const closeMenu = () => {
  menuOpen.value = false;
};

watch(menuOpen, (open) => {
  document.body.style.overflow = open ? "hidden" : "";
});

const isActive = (to: string) => activeSection.value === to.replace("#", "");

const handleNavClick = (event: MouseEvent, to: string) => {
  event.preventDefault();
  closeMenu();
  if (to === "#top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  document
    .getElementById(to.slice(1))
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
};
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <a
        href="#top"
        class="app-header__brand"
        :aria-label="content.ui.headerHomeAria"
        @click="handleNavClick($event, '#top')"
      >
        <img class="app-header__logo" src="/logo.png" alt="" aria-hidden="true" />
        <span class="app-header__wordmark">
          <span class="app-header__name">SK Management Consulting</span>
          <span class="app-header__tagline">{{
            content.siteInfo.tagline
          }}</span>
        </span>
      </a>

      <nav class="app-header__nav" :aria-label="content.ui.headerNavAria">
        <a
          v-for="item in content.navItems"
          :key="item.to"
          :href="item.to"
          class="app-header__link"
          :class="{
            'app-header__link--active': isActive(item.to),
            'app-header__link--cta': item.to === '#contact',
          }"
          @click="handleNavClick($event, item.to)"
        >
          {{ item.label }}
        </a>
      </nav>

      <div class="app-header__lang" role="group" aria-label="Language / 语言">
        <button
          type="button"
          class="app-header__lang-btn"
          :class="{ 'app-header__lang-btn--active': locale === 'zh' }"
          :aria-pressed="locale === 'zh'"
          @click="setLocale('zh')"
        >
          CN
        </button>
        <button
          type="button"
          class="app-header__lang-btn"
          :class="{ 'app-header__lang-btn--active': locale === 'en' }"
          :aria-pressed="locale === 'en'"
          @click="setLocale('en')"
        >
          EN
        </button>
      </div>

      <button
        class="app-header__burger"
        :class="{ 'app-header__burger--open': menuOpen }"
        :aria-expanded="menuOpen"
        aria-controls="mobile-nav"
        :aria-label="content.ui.headerOpenMenu"
        @click="toggleMenu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <Transition name="menu-fade">
      <nav
        v-if="menuOpen"
        id="mobile-nav"
        class="app-header__mobile"
        :aria-label="content.ui.headerMobileNavAria"
      >
        <a
          v-for="item in content.navItems"
          :key="item.to"
          :href="item.to"
          class="app-header__mobile-link"
          :class="{ 'app-header__mobile-link--active': isActive(item.to) }"
          @click="handleNavClick($event, item.to)"
        >
          {{ item.label }}
        </a>
        <p class="app-header__mobile-note">{{ content.siteInfo.tagline }}</p>
      </nav>
    </Transition>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  position: sticky;
  top: 0;
  z-index: 200;
  background-color: $color-white;
  border-bottom: 1px solid $color-bg-light;

  &__inner {
    @include container;
    height: $header-height;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
  }

  // ---------- Brand ----------
  &__brand {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  &__logo {
    width: 72px;
    height: 72px;
    flex-shrink: 0;
  }

  &__wordmark {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__name {
    font-size: 15px;
    font-weight: $font-black;
    letter-spacing: -0.01em;
    line-height: 1.2;
  }

  &__tagline {
    font-size: 11px;
    color: $text-muted-light;
    letter-spacing: 0.04em;
    line-height: 1.2;
  }

  // ---------- Desktop Nav ----------
  &__nav {
    display: none;
    align-items: center;
    gap: 32px;

    @include respond-to("l") {
      display: flex;
    }
  }

  &__link {
    position: relative;
    font-size: 15px;
    padding-block: 8px;
    transition: color $transition-fast;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 2px;
      background-color: $color-primary-deep;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform $transition-fast;
    }

    &:hover::after,
    &--active::after {
      transform: scaleX(1);
    }

    &--active {
      font-weight: $font-bold;
    }

    &--cta {
      background-color: $color-primary-deep;
      color: $color-white;
      padding: 12px 24px;
      border-radius: $radius-sm;
      transition: background-color $transition-fast;

      &::after {
        display: none;
      }

      &:hover {
        background-color: $color-primary;
      }
    }
  }

  // ---------- Lang Toggle ----------
  &__lang {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  &__lang-btn {
    padding: 8px 16px;
    font-size: 13px;
    font-weight: $font-bold;
    letter-spacing: 0.04em;
    line-height: 1;
    border: 1px solid $line-light;
    border-radius: $radius-sm;
    transition:
      background-color $transition-fast,
      color $transition-fast,
      border-color $transition-fast;

    &--active {
      background-color: $color-primary-deep;
      border-color: $color-primary-deep;
      color: $color-white;
    }

    &:hover:not(&--active) {
      border-color: $color-primary-deep;
    }

    &:focus-visible {
      @include focus-ring;
    }
  }

  // ---------- Burger ----------
  &__burger {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    width: 40px;
    height: 40px;
    padding: 8px;

    span {
      display: block;
      width: 100%;
      height: 2px;
      background-color: $color-primary-deep;
      transition:
        transform $transition-fast,
        opacity $transition-fast;
    }

    &--open {
      span:nth-child(1) {
        transform: translateY(7px) rotate(45deg);
      }

      span:nth-child(2) {
        opacity: 0;
      }

      span:nth-child(3) {
        transform: translateY(-7px) rotate(-45deg);
      }
    }

    @include respond-to("l") {
      display: none;
    }
  }

  // ---------- Mobile Nav ----------
  &__mobile {
    position: fixed;
    top: $header-height;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 190;
    background-color: $color-white;
    padding: 24px 20px 40px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  &__mobile-link {
    display: flex;
    align-items: center;
    padding-block: 20px;
    font-size: 24px;
    font-weight: $font-bold;
    border-bottom: 1px solid $color-bg-light;

    &--active {
      font-weight: $font-black;
      box-shadow: inset 4px 0 0 0 $color-primary-deep;
      padding-left: 16px;
    }
  }

  &__mobile-note {
    margin-top: 32px;
    font-size: 12px;
    color: $text-muted-light;
    letter-spacing: 0.06em;
  }
}

.menu-fade-enter-active,
.menu-fade-leave-active {
  transition:
    opacity $transition-fast,
    transform $transition-fast;
}

.menu-fade-enter-from,
.menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
