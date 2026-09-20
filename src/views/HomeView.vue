<script setup lang="ts">
import HeroBanner from '@/components/ui/HeroBanner.vue'
import SectionWrapper from '@/components/ui/SectionWrapper.vue'
import EyebrowLabel from '@/components/ui/EyebrowLabel.vue'
import StatBlock from '@/components/ui/StatBlock.vue'
import ServiceCarousel from '@/components/ui/ServiceCarousel.vue'
import IndustryCard from '@/components/ui/IndustryCard.vue'
import AdvantageGrid from '@/components/ui/AdvantageGrid.vue'
import { content } from '@/i18n'
const BASE_URL = import.meta.env.BASE_URL
</script>

<template>
  <!-- Hero -->
  <HeroBanner
    variant="white"
    bg="#C8A24A"
    :eyebrow="content.homeHero.eyebrow"
    :title="content.homeHero.title"
    :subtitle="content.homeHero.subtitle"
    :cta-text="content.homeHero.ctaText"
    :image="BASE_URL + '1.jpg'"
    :image-alt="content.homeHero.imageAlt"
  />

  <StatBlock :stats="content.stats" />

  <!-- 核心服务 -->
  <SectionWrapper id="services" bg="white">
    <div class="section-head">
      <EyebrowLabel :text="content.servicesSection.eyebrow" />
      <h2>{{ content.servicesSection.title }}</h2>
      <p class="section-head__lead">{{ content.servicesSection.lead }}</p>
    </div>
    <ServiceCarousel :services="content.services" />
  </SectionWrapper>

  <!-- 行业解决方案 -->
  <SectionWrapper id="industries" bg="neutral">
    <div class="section-head">
      <EyebrowLabel :text="content.industriesSection.eyebrow" />
      <h2>{{ content.industriesSection.title }}</h2>
      <p class="section-head__lead">{{ content.industriesSection.lead }}</p>
    </div>
    <div class="industries-list">
      <IndustryCard
        v-for="industry in content.industries"
        :key="industry.id"
        :industry="industry"
      />
    </div>
  </SectionWrapper>

  <!-- 核心定位 -->
  <SectionWrapper id="positioning" bg="white">
    <div class="section-head">
      <EyebrowLabel :text="content.positioning.eyebrow" />
      <h2>{{ content.positioning.title }}</h2>
    </div>
    <div class="positioning__grid">
      <p class="positioning__intro">{{ content.positioning.intro }}</p>
      <div class="positioning__paras">
        <p v-for="paragraph in content.positioning.paragraphs" :key="paragraph">{{ paragraph }}</p>
      </div>
    </div>
  </SectionWrapper>

  <!-- 关于我们：使命 -->
  <SectionWrapper id="about" bg="white">
    <div class="section-head">
      <EyebrowLabel :text="content.mission.eyebrow" />
    </div>
    <blockquote class="mission-quote">
      <p v-for="paragraph in content.mission.paragraphs" :key="paragraph">{{ paragraph }}</p>
    </blockquote>
  </SectionWrapper>

  <!-- 关于我们：核心优势 -->
  <SectionWrapper id="advantages" bg="primary">
    <div class="section-head">
      <EyebrowLabel :text="content.advantagesSection.eyebrow" color="accent-deep" />
      <h2>{{ content.advantagesSection.title }}</h2>
    </div>
    <AdvantageGrid :items="content.advantages" />
  </SectionWrapper>

  <!-- 关于我们：保密与安全 -->
  <SectionWrapper id="security" bg="accent">
    <div class="section-head">
      <EyebrowLabel :text="content.confidentiality.eyebrow" color="primary" />
      <h2>{{ content.confidentiality.title }}</h2>
    </div>
    <ul class="security-list">
      <li v-for="item in content.confidentiality.items" :key="item" class="security-list__item">
        <span class="security-list__marker" aria-hidden="true">◆</span>
        <p>{{ item }}</p>
      </li>
    </ul>
  </SectionWrapper>

  <!-- 咨询对接 -->
  <SectionWrapper id="contact" bg="white">
    <div class="section-head">
      <EyebrowLabel :text="content.contactHero.eyebrow" />
      <h2>{{ content.contactHero.title }}</h2>
      <p class="section-head__lead">{{ content.contactHero.subtitle }}</p>
    </div>
    <div class="contact-grid">
      <component
        :is="channel.href ? 'a' : 'div'"
        v-for="channel in content.contactChannels"
        :key="channel.label"
        :href="channel.href"
        :target="channel.href?.startsWith('http') ? '_blank' : undefined"
        :rel="channel.href?.startsWith('http') ? 'noopener noreferrer' : undefined"
        class="contact-card"
        :class="{ 'contact-card--link': !!channel.href }"
      >
        <p class="contact-card__label">{{ channel.label }}</p>
        <p class="contact-card__value">{{ channel.value }}</p>
      </component>
    </div>
    <p class="contact-note">{{ content.contactNote }}</p>
  </SectionWrapper>
</template>

<style scoped lang="scss">
// ---------- 核心定位 ----------
.positioning__grid {
  display: grid;
  gap: 32px;

  @include respond-to('l') {
    grid-template-columns: repeat(12, 1fr);
    gap: 40px;
  }
}

.positioning__intro {
  font-size: clamp(20px, 2vw, 26px);
  font-weight: $font-bold;
  line-height: 1.5;

  @include respond-to('l') {
    grid-column: span 5;
  }
}

.positioning__paras {
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-size: 16px;
  line-height: 1.8;
  color: $text-muted-light;

  @include respond-to('l') {
    grid-column: 7 / span 6;
  }
}

// ---------- 行业解决方案 ----------
.industries-list {
  display: grid;
  gap: 24px;
  // 各卡片独立高度：仅被点击的卡片展开变高，其余保持原状
  align-items: start;

  @include respond-to('l') {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
}

// ---------- 使命 ----------
.mission-quote {
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-size: clamp(22px, 2.6vw, 32px);
  font-weight: $font-bold;
  line-height: 1.6;
  letter-spacing: -0.01em;
  white-space: pre-line;

  p:last-child {
    font-weight: $font-regular;
    color: $text-muted-light;
  }
}

// ---------- 保密与安全 ----------
.security-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 880px;

  &__item {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    font-size: 16px;
    line-height: 1.8;
    color: $color-white;
  }

  &__marker {
    flex-shrink: 0;
    font-size: 12px;
    line-height: 2.4;
    color: $color-primary-deep;
  }
}

// ---------- 咨询对接 ----------
// 引导文案单行显示
#contact .section-head__lead {
  white-space: nowrap;
}

.contact-grid {
  display: grid;
  gap: 24px;

  @include respond-to('m') {
    grid-template-columns: repeat(2, 1fr);
  }

  @include respond-to('xl') {
    grid-template-columns: repeat(4, 1fr);
  }
}

.contact-card {
  background-color: $color-bg-light;
  border: 1px solid $color-bg-light;
  border-top: 2px solid $color-primary-deep;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: border-color $transition-fast;

  &--link:hover {
    border-color: $color-primary-deep;
  }

  &__label {
    @include eyebrow;
    color: $text-muted-light;
  }

  &__value {
    font-size: 18px;
    font-weight: $font-bold;
    line-height: 1.6;
    word-break: break-all;
  }
}

.contact-note {
  margin: 48px auto 0;
  padding: 24px 32px;
  background-color: $color-bg-light;
  border-top: 2px solid $color-primary-deep;
  font-size: 15px;
  font-weight: $font-bold;
  line-height: 1.7;
  max-width: 768px;
  text-align: center;
}
</style>
