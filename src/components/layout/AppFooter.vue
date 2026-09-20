<script setup lang="ts">
import { content } from "@/i18n";
import logoUrl from "/logo.png";

const handleNavClick = (event: MouseEvent, to: string) => {
  event.preventDefault();
  if (to === "#top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  document
    .getElementById(to.slice(1))
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
};

// 服务深链：切到对应卡片并滚动到服务区块
const handleServiceClick = (event: MouseEvent, id: string) => {
  event.preventDefault();
  window.dispatchEvent(new CustomEvent("service:show", { detail: id }));
  document
    .getElementById("services")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
};
</script>

<template>
  <footer class="app-footer">
    <div class="app-footer__inner">
      <div class="app-footer__grid">
        <div class="app-footer__brand">
          <a
            href="#top"
            class="app-footer__logo-row"
            :aria-label="content.ui.headerHomeAria"
            @click="handleNavClick($event, '#top')"
          >
            <img class="app-footer__logo" :src="logoUrl" alt="" aria-hidden="true" />
          </a>
          <p class="app-footer__tagline">{{ content.siteInfo.tagline }}</p>
          <p class="app-footer__slogan">{{ content.siteInfo.description }}</p>
        </div>

        <nav class="app-footer__col" :aria-label="content.ui.footerNavAria">
          <p class="app-footer__col-title">{{ content.ui.footerNavTitle }}</p>
          <a
            v-for="item in content.navItems"
            :key="item.to"
            :href="item.to"
            class="app-footer__link"
            @click="handleNavClick($event, item.to)"
          >
            {{ item.label }}
          </a>
        </nav>

        <div class="app-footer__col">
          <p class="app-footer__col-title">{{ content.ui.footerServicesTitle }}</p>
          <a
            v-for="service in content.services"
            :key="service.id"
            :href="`#${service.id}`"
            class="app-footer__link"
            @click="handleServiceClick($event, service.id)"
          >
            {{ service.title }}
          </a>
        </div>

        <div class="app-footer__col">
          <p class="app-footer__col-title">{{ content.ui.footerContactTitle }}</p>
          <template v-for="channel in content.contactChannels" :key="channel.label">
            <a
              v-if="channel.href"
              :href="channel.href"
              class="app-footer__contact"
              :target="channel.href.startsWith('http') ? '_blank' : undefined"
              :rel="
                channel.href.startsWith('http')
                  ? 'noopener noreferrer'
                  : undefined
              "
            >
              <span class="app-footer__contact-label">{{ channel.label }}</span>
              <span class="app-footer__contact-value">{{ channel.value }}</span>
            </a>
            <p v-else class="app-footer__contact">
              <span class="app-footer__contact-label">{{ channel.label }}</span>
              <span class="app-footer__contact-value">{{ channel.value }}</span>
            </p>
          </template>
        </div>
      </div>

      <div class="app-footer__bottom">
        <p class="app-footer__copyright">{{ content.footerContent.copyright }}</p>
        <p class="app-footer__disclaimer">{{ content.footerContent.disclaimer }}</p>
      </div>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.app-footer {
  background-color: $color-primary-deep;
  color: $color-white;
  padding-top: 64px;

  @include respond-to("l") {
    padding-top: 96px;
  }

  &__inner {
    @include container;
  }

  &__grid {
    display: grid;
    gap: 48px;

    @include respond-to("m") {
      grid-template-columns: repeat(2, 1fr);
    }

    @include respond-to("l") {
      grid-template-columns: 2fr 1fr 1fr 1.5fr;
      gap: 40px;
    }
  }

  // ---------- Brand ----------
  &__brand {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  &__logo-row {
    display: inline-flex;
    align-items: center;
    gap: 12px;
  }

  &__logo {
    width: 200px;
    height: 200px;
    flex-shrink: 0;
  }

  &__tagline {
    margin-top: 16px;
    font-size: 16px;
    font-weight: $font-bold;
    line-height: 1.5;
    color: rgba($color-white, 0.75);
    letter-spacing: 0.02em;
  }

  &__slogan {
    margin-top: 12px;
    font-size: 14px;
    font-weight: $font-regular;
    line-height: 1.6;
    opacity: 0.75;
  }

  // ---------- Columns ----------
  &__col {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  &__col-title {
    font-size: 13px;
    font-weight: $font-bold;
    letter-spacing: 0.12em;
    color: $text-muted-dark;
    margin-bottom: 16px;
  }

  &__link {
    font-size: 15px;
    color: $color-text-footer;
    padding-block: 6px;
    transition: color $transition-fast;

    &:hover {
      color: $color-white;
    }
  }

  &__contact {
    display: block;
    font-size: 15px;
    color: $color-text-footer;
    padding-block: 6px;
    line-height: 1.6;
    transition: color $transition-fast;
    word-break: break-all;
  }

  a#{&}__contact:hover {
    color: $color-white;
  }

  &__contact-label {
    display: block;
    font-size: 12px;
    color: $text-muted-dark;
    letter-spacing: 0.08em;
  }

  &__contact-value {
    color: $color-white;
  }

  // ---------- Bottom ----------
  &__bottom {
    margin-top: 64px;
    border-top: 1px solid $line-dark;
    padding-block: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  &__copyright {
    font-size: 14px;
    color: $color-text-footer;
  }

  &__disclaimer {
    margin-top: 12px;
    font-size: 12px;
    line-height: 1.7;
    color: $text-muted-dark;
    max-width: 960px;
  }
}
</style>
