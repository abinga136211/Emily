<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { content, locale, setLocale } from "@/i18n";

const router = useRouter();
const route = useRoute();

const menuOpen = ref(false);
const overHero = ref(true);

let heroObserver: IntersectionObserver | null = null;

const isHome = () => route.name === "home";
const isNotFound = () => route.name === "not-found";

const pageNameFromPath = (to: string) => {
  const clean = to.replace(/\/+$/, "");
  if (clean === "/" || clean === "") return "home";
  if (clean === "/services" || clean.endsWith("/services")) return "services";
  if (clean === "/industries" || clean.endsWith("/industries")) return "industries";
  if (clean === "/about" || clean.endsWith("/about")) return "about";
  if (clean === "/contact" || clean.endsWith("/contact")) return "contact";
  return null;
};

const activePage = computed(() => {
  if (route.name === "home") return "home";
  if (
    route.name === "services" ||
    route.name === "industries" ||
    route.name === "about" ||
    route.name === "contact"
  ) {
    return String(route.name);
  }
  return "";
});

const navKey = (to: string) => pageNameFromPath(to) ?? to;

const updateOverHero = () => {
  if (isNotFound()) {
    overHero.value = true;
    return;
  }

  if (!isHome()) {
    overHero.value = false;
    return;
  }

  // 首页接近顶部时始终透明，避免刷新/路由重进时滚动位置尚未归零导致误判为 solid
  if (window.scrollY <= 16) {
    overHero.value = true;
    return;
  }

  const hero = document.getElementById("top");
  if (!hero) {
    overHero.value = window.scrollY < window.innerHeight * 0.72;
    return;
  }
  // 用首屏实际可见比例判断，避免 overflow:hidden / scrollTo 时 scroll 事件丢失导致顶栏变白底
  const rect = hero.getBoundingClientRect();
  overHero.value = rect.bottom > window.innerHeight * 0.28;
};

const refreshOverHero = () => {
  requestAnimationFrame(() => {
    updateOverHero();
    requestAnimationFrame(updateOverHero);
  });
};

const setupHeroObserver = () => {
  heroObserver?.disconnect();
  heroObserver = null;

  if (isNotFound()) {
    overHero.value = true;
    return;
  }

  if (!isHome()) {
    overHero.value = false;
    return;
  }

  const hero = document.getElementById("top");
  if (!hero) {
    updateOverHero();
    return;
  }

  heroObserver = new IntersectionObserver(
    () => {
      updateOverHero();
    },
    { threshold: [0, 0.28, 0.72, 1] },
  );
  heroObserver.observe(hero);
  updateOverHero();
};

const onPageShow = () => {
  if (isHome() && !window.location.hash) {
    window.scrollTo(0, 0);
  }
  refreshOverHero();
};

onMounted(() => {
  setupHeroObserver();
  refreshOverHero();
  window.addEventListener("scroll", updateOverHero, { passive: true });
  window.addEventListener("resize", updateOverHero, { passive: true });
  window.addEventListener("pageshow", onPageShow);
  window.addEventListener("load", refreshOverHero);
});

onBeforeUnmount(() => {
  heroObserver?.disconnect();
  window.removeEventListener("scroll", updateOverHero);
  window.removeEventListener("resize", updateOverHero);
  window.removeEventListener("pageshow", onPageShow);
  window.removeEventListener("load", refreshOverHero);
});

watch(
  () => route.fullPath,
  () => {
    refreshOverHero();
    requestAnimationFrame(() => {
      setupHeroObserver();
      updateOverHero();
    });
  },
);

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
};

const closeMenu = () => {
  menuOpen.value = false;
};

watch(menuOpen, (open) => {
  if (open) {
    document.body.style.overflow = "hidden";
    return;
  }
  // 首屏轮播锁定时，关闭菜单不要清掉页面锁
  if (!document.documentElement.classList.contains("hero-intro-locked")) {
    document.body.style.overflow = "";
  }
});

const isActive = (to: string) => activePage.value === navKey(to);

const handleNavClick = async (event: MouseEvent, to: string) => {
  event.preventDefault();
  closeMenu();
  // 首屏轮播锁定时，先解锁再执行导航滚动
  window.dispatchEvent(new Event("skmc:hero-unlock"));

  const page = pageNameFromPath(to);
  const path =
    page === "home" || to === "/" || to === "#top"
      ? "/"
      : page
        ? `/${page}`
        : to.split("#")[0] || "/";

  if (route.path === path || (page === "home" && isHome())) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  await router.push({ path });
};
</script>

<template>
  <header
    class="app-header"
    :class="{
      'app-header--over-hero': overHero && !menuOpen,
      'app-header--solid': !overHero || menuOpen,
    }"
  >
    <div class="app-header__inner">
      <a
        href="/"
        class="app-header__brand"
        :aria-label="content.ui.headerHomeAria"
        @click="handleNavClick($event, '/')"
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
            'app-header__link--cta': navKey(item.to) === 'contact',
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
          简
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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  background-color: $color-white;
  border-bottom: 1px solid $color-bg-light;
  transition:
    background-color $transition-fast,
    border-color $transition-fast,
    color $transition-fast,
    backdrop-filter $transition-fast;

  &--over-hero {
    background-color: transparent;
    border-bottom-color: transparent;
    color: $color-white;

    .app-header__tagline {
      color: rgba(255, 255, 255, 0.78);
    }

    .app-header__link {
      &::after {
        background-color: $color-white;
      }

      &--cta {
        background-color: $color-white;
        color: $color-primary-deep;

        &:hover {
          background-color: rgba(255, 255, 255, 0.9);
        }
      }
    }

    .app-header__lang-btn {
      border-color: rgba(255, 255, 255, 0.45);
      color: $color-white;

      &--active {
        background-color: $color-white;
        border-color: $color-white;
        color: $color-primary-deep;
      }

      &:hover:not(.app-header__lang-btn--active) {
        border-color: $color-white;
      }
    }

    .app-header__burger span {
      background-color: $color-white;
    }
  }

  &--solid {
    background-color: $color-white;
    border-bottom-color: $color-bg-light;
    color: $color-primary-deep;
  }

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
