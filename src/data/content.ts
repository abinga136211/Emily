// ============================================
// SK Management Consulting — 全站内容数据（中英同构）
// 中文内容来源：SK Management Consulting 官网设计方案（蓝白均衡版）
// 英文内容来源：SK Management Consulting Website Design Proposal (EN)
// ============================================

export interface NavItem {
  label: string
  to: string
}

export interface StatItem {
  value: string
  description: string
}

export interface ServiceItem {
  id: string
  index: string
  /** 短标题（首页列表 / 导航） */
  title: string
  /** 详情页主标题，如「管理咨询 / Management Consulting」 */
  headline: string
  /** 详情页眉标 */
  label: string
  subtitle: string
  description: string
  highlight: string
  ctaText: string
  ctaTo: string
  audienceTitle: string
  audience: string[]
  valuesTitle: string
  values: string[]
  /** 右侧正文（有值时替代适用客户 / 核心价值列表） */
  sideBody?: string
  /** 服务配图（可先用占位图） */
  image?: string
}

export interface IndustryItem {
  id: string
  image: string
  /** 短标题（首页列表 / 导航） */
  title: string
  /** 详情页眉标 */
  label: string
  /** 详情页主标题 */
  headline: string
  description: string
  ctaText: string
  ctaTo: string
  audienceTitle: string
  audience: string[]
  valuesTitle: string
  values: string[]
  /** 兼容旧字段 */
  scenario?: string
  offer?: string
  /** 配图旋转角度（必要时校正方向） */
  imageRotate?: 0 | 90 | 180 | 270
  /** object-position，如 center 70% */
  imagePosition?: string
}

export interface AdvantageItem {
  title: string
  description: string
}

export interface ContactChannel {
  id?: string
  label: string
  value: string
  href?: string
}

export interface SiteInfo {
  name: string
  group: string
  tagline: string
  description: string
}

// 全站文案聚合对象：中文 / 英文两份结构完全一致
export interface SiteContent {
  meta: {
    title: string
    description: string
  }
  siteInfo: SiteInfo
  navItems: NavItem[]
  homeHero: {
    eyebrow: string
    title: string
    subtitle: string
    ctaText: string
    imageAlt: string
  }
  homeSlides: Array<{
    image: string
    alt: string
    title?: string
    /** 双语副标题行（如中文页展示英文标题） */
    titleAlt?: string
    subtitle?: string
    /** 文案对齐：默认 left，第四屏等可用 center */
    align?: 'left' | 'center'
    /** 标题与副文案强制单行不换行 */
    nowrap?: boolean
    ctaText?: string
    ctaTo?: string
  }>
  positioning: {
    eyebrow: string
    title: string
    intro: string
    paragraphs: string[]
  }
  stats: StatItem[]
  statsSection: {
    eyebrow: string
    title: string
    subtitle: string
    body: string
    ctaTo: string
    ctaAria: string
  }
  servicesSection: {
    eyebrow: string
    title: string
    lead: string
    ctaTo: string
    ctaText: string
    ctaAria: string
  }
  services: ServiceItem[]
  servicesPage: {
    eyebrow: string
    title: string
    lead: string
    metaTitle: string
    nav: { label: string; to: string }[]
  }
  industriesSection: {
    eyebrow: string
    title: string
    lead: string
    ctaTo: string
    ctaText: string
    ctaAria: string
  }
  industries: IndustryItem[]
  industriesPage: {
    eyebrow: string
    title: string
    lead: string
    metaTitle: string
    nav: { label: string; to: string }[]
  }
  aboutPage: {
    eyebrow: string
    title: string
    lead: string
    metaTitle: string
    nav: { label: string; to: string }[]
  }
  mission: {
    eyebrow: string
    title: string
    paragraphs: string[]
  }
  advantagesSection: {
    eyebrow: string
    title: string
  }
  advantages: AdvantageItem[]
  confidentiality: {
    eyebrow: string
    title: string
    items: string[]
  }
  contactHero: {
    eyebrow: string
    title: string
    subtitle: string
    ctaText: string
  }
  contactPage: {
    eyebrow: string
    title: string
    lead: string
    metaTitle: string
    channelsTitle: string
    emailFromLabel: string
    emailSubjectLabel: string
    emailToLabel: string
    emailToValue: string
    formNameLabel: string
    formEmailLabel: string
    formMessageLabel: string
    formNamePlaceholder: string
    formEmailPlaceholder: string
    formMessagePlaceholder: string
    formSubmitLabel: string
    formRequiredError: string
    formEmailError: string
    formSuccessMessage: string
    formSuccessClose: string
  }
  notFoundPage: {
    eyebrow: string
    code: string
    title: string
    lead: string
    redirectHint: string
    ctaText: string
    metaTitle: string
  }
  contactChannels: ContactChannel[]
  contactNote: string
  footerContent: {
    copyright: string
    disclaimer: string
  }
  // 组件内置 UI 文案（按钮、标签、无障碍 aria 等）
  ui: {
    headerNavAria: string
    headerOpenMenu: string
    headerMobileNavAria: string
    headerHomeAria: string
    heroCarouselAria: string
    heroPrev: string
    heroNext: string
    heroDotsAria: string
    heroSlideLabel: string
    heroScrollHint: string
    heroScrollReadyHint: string
    statAria: string
    servicePrev: string
    serviceNext: string
    serviceTabsAria: string
    serviceLearnMore: string
    industryScenario: string
    industryOffer: string
    industryExpand: string
    industryCollapse: string
    footerNavTitle: string
    footerServicesTitle: string
    footerContactTitle: string
    footerNavAria: string
  }
}

// ============================================
// 中文
// ============================================
export const zh: SiteContent = {
  meta: {
    title: 'SK Management Consulting｜跨境金融合规与管理咨询',
    description:
      'SK Management Consulting — 您企业出海背后的全链路合规与管理顾问。提供管理咨询、全球牌照申请与维护、合规体系搭建、银行干系人管理等一站式跨境金融合规服务。'
  },
  siteInfo: {
    name: 'SK Management Consulting',
    group: 'SK Group 旗下专业咨询品牌',
    tagline: '跨境金融合规与管理咨询',
    description: '您企业出海背后的全链路合规与管理顾问'
  },
  navItems: [
    { label: '首页', to: '/' },
    { label: '核心服务', to: '/services' },
    { label: '行业解决方案', to: '/industries' },
    { label: '关于我们', to: '/about' },
    { label: '咨询对接', to: '/contact' }
  ],
  homeHero: {
    eyebrow: 'SK Group 旗下专业咨询品牌',
    title: '您企业出海背后的全链路合规与管理顾问',
    subtitle:
      '我们不做泛行业的通用咨询，而做跨境金融领域的精品专家。从战略规划到牌照落地、合规体系、银企对接，以全链路闭环服务，将复杂的跨境监管要求，化作您从容经营的日常。',
    ctaText: '预约专业咨询',
    imageAlt: '跨境金融合规与管理咨询'
  },
  homeSlides: [
    {
      image: '/hero-1.jpg',
      alt: '商务团队会议讨论与战略规划',
      title: '您企业出海背后的全链路合规与管理顾问',
      titleAlt: 'Your End-to-End Compliance & Management Partner Behind Global Expansion',
      subtitle:
        '我们不做泛行业的通用咨询，而做跨境金融领域的精品专家。从战略规划到牌照落地、合规体系、银企对接，以全链路闭环服务，将复杂的跨境监管要求，化作您从容经营的日常。'
    },
    {
      image: '/hero-2.jpg',
      alt: '香港维多利亚港天际线与国际金融中心',
      title: '一个专为跨境企业打造的精品金融合规与管理咨询品牌。',
      subtitle:
        '我们不做流水线式的通用咨询服务，而做跨境金融合规领域的专属专家——以核心团队来自四大会计师事务所、持牌金融机构与监管部门的资深经验，为您的出海全周期，提供从战略到落地的全链路专业支持。'
    },
    {
      image: '/hero-3.jpg',
      alt: '商务团队击掌庆祝合作成功',
      title: '您全球业务背后的合规与管理伙伴',
      subtitle:
        '无需自行对接复杂的各地监管、银行与持牌机构。我们为您整合全球资源，提供从管理咨询、牌照申请、合规体系搭建到银企关系维护的一站式服务，让复杂的跨境合规与经营问题，成为我们的专业日常，而非您的经营负担。'
    },
    {
      image: '/hero-4.jpg',
      alt: '河畔都市天际线夜景',
      title: '为您构建的合规护城河——专业严谨，结果导向。',
      subtitle: '为不同行业、不同阶段的跨境企业，量身定制可落地的解决方案。',
      align: 'center',
      nowrap: true,
      ctaText: '联系咨询',
      ctaTo: '/contact'
    }
  ],
  positioning: {
    eyebrow: '核心定位 POSITIONING',
    title: '您全球业务背后的合规与管理伙伴',
    intro: '一个专为跨境企业打造的精品金融合规与管理咨询品牌。',
    paragraphs: [
      '我们不做流水线式的通用咨询服务，而做跨境金融合规领域的专属专家——以核心团队来自四大会计师事务所、持牌金融机构与监管部门的资深经验，为您的出海全周期，提供从战略到落地的全链路专业支持。',
      '无需自行对接复杂的各地监管、银行与持牌机构。我们为您整合全球资源，提供从管理咨询、牌照申请、合规体系搭建到银企关系维护的一站式服务，让复杂的跨境合规与经营问题，成为我们的专业日常，而非您的经营负担。',
      '为您构建的合规护城河——专业严谨，结果导向。为不同行业、不同阶段的跨境企业，量身定制可落地的解决方案。'
    ]
  },
  stats: [
    { value: '30+', description: '覆盖全球的监管、银行与持牌机构合作网络' },
    { value: '200+', description: '已服务的跨境金融、外贸与投资类企业客户' },
    { value: '98%', description: '全球金融牌照申请一次性通过率' },
    { value: '60%', description: '平均为客户节省的合规沟通与落地时间' }
  ],
  statsSection: {
    eyebrow: '关于我们',
    title: 'SK Management Consulting',
    subtitle: 'SK Group 旗下专业咨询品牌',
    body: '为跨境企业扫除经营与合规中的一切障碍，以专业、严谨、可落地的服务，帮助企业合规出海，实现全球业务增长。真正的专业，源于对监管规则的深度理解，与对客户结果的绝对负责。',
    ctaTo: '/about',
    ctaAria: '前往关于我们'
  },
  servicesSection: {
    eyebrow: '核心服务 SERVICES & CAPABILITIES',
    title: '全链路闭环的专业服务能力',
    lead: '从顶层管理咨询、牌照申请、合规体系搭建到银企关系维护，覆盖企业出海全周期需求，一站式服务无需对接多家机构，避免信息不对称，提升落地效率。',
    ctaTo: '/services',
    ctaText: '详情信息',
    ctaAria: '前往核心服务'
  },
  services: [
    {
      id: 'management-consulting',
      index: '01',
      title: '管理咨询',
      label: '管理咨询',
      headline: '管理咨询',
      subtitle: '企业经营顶层设计',
      description: '不止输出咨询报告，更配套落地辅导与长期跟踪，确保方案真正落地。',
      highlight: '不止输出咨询报告，更配套落地辅导与长期跟踪，确保方案真正落地。',
      ctaText: '预约咨询',
      ctaTo: '/contact',
      audienceTitle: '适用客户',
      audience: [],
      valuesTitle: '核心价值',
      values: [],
      sideBody:
        '为跨境企业提供战略规划、组织架构优化、业务流程重构、落地变革辅导，从顶层设计到落地执行全流程支持，帮助企业适配海外经营环境，搭建高效的经营管理体系。',
      image: '/service-1.jpg'
    },
    {
      id: 'global-licensing',
      index: '02',
      title: '全球牌照申请与维护',
      label: '全球牌照',
      headline: '全球牌照申请与维护',
      subtitle: '全周期资质托管',
      description: '核心团队熟悉各地监管要求，牌照申请一次性通过率98%。',
      highlight: '核心团队熟悉各地监管要求，牌照申请一次性通过率98%。',
      ctaText: '预约咨询',
      ctaTo: '/contact',
      audienceTitle: '适用客户',
      audience: [],
      valuesTitle: '核心价值',
      values: [],
      sideBody:
        '覆盖香港、新加坡、东南亚、欧美等多地区金融、支付、TCSP、虚拟资产等各类牌照申请服务，包含前期评估、材料准备、监管沟通、牌照领取、年审、变更、续期全周期托管，避免牌照失效风险。',
      image: '/service-2.jpg'
    },
    {
      id: 'compliance-system',
      index: '03',
      title: '合规体系搭建',
      label: '合规体系',
      headline: '合规体系搭建',
      subtitle: '可落地的内控方案',
      description: '配套合规培训与定期更新服务，适配监管政策变化。',
      highlight: '配套合规培训与定期更新服务，适配监管政策变化。',
      ctaText: '预约咨询',
      ctaTo: '/contact',
      audienceTitle: '适用客户',
      audience: [],
      valuesTitle: '核心价值',
      values: [],
      sideBody:
        '为企业搭建符合各地监管要求的反洗钱AML、客户尽调KYC、数据合规、风险控制体系，输出全套可执行的内控制度、SOP流程、员工手册与审计材料，帮助企业通过监管核查，规避合规风险。',
      image: '/service-3.jpg'
    },
    {
      id: 'banking-stakeholder',
      index: '04',
      title: '银行干系人管理',
      label: '银行干系人',
      headline: '银行干系人管理',
      subtitle: '银企关系全链路维护',
      description: '直接对接银行决策层，解决标准流程无法处理的疑难问题。',
      highlight: '直接对接银行决策层，解决标准流程无法处理的疑难问题。',
      ctaText: '预约咨询',
      ctaTo: '/contact',
      audienceTitle: '适用客户',
      audience: [],
      valuesTitle: '核心价值',
      values: [],
      sideBody:
        '协助企业对接境内外银行、清算机构、托管行，提供开户准入沟通、账户日常维护、合作关系搭建、监管问询协同、问题排查解决全流程服务，帮助企业打通资金通道，保障账户稳定。',
      image: '/service-4.jpg'
    }
  ],
  servicesPage: {
    eyebrow: 'SERVICES & CAPABILITIES',
    title: '核心服务',
    lead: '从顶层管理咨询、牌照申请、合规体系搭建到银企关系维护，覆盖企业出海全周期需求。',
    metaTitle: '核心服务｜SK Management Consulting',
    nav: [
      { label: '管理咨询', to: '#management-consulting' },
      { label: '全球牌照', to: '#global-licensing' },
      { label: '合规体系', to: '#compliance-system' },
      { label: '银行干系人', to: '#banking-stakeholder' }
    ]
  },
  industriesSection: {
    eyebrow: '行业解决方案 SOLUTIONS',
    title: '为不同行业、不同阶段的跨境企业，量身定制可落地的解决方案',
    lead: '为您构建的合规护城河——专业严谨，结果导向。',
    ctaTo: '/industries',
    ctaText: '详情信息',
    ctaAria: '前往行业解决方案'
  },
  industries: [
    {
      id: 'cross-border-payment',
      image: '/2.jpg',
      title: '跨境支付与金融科技企业',
      label: '跨境支付',
      headline: '跨境支付与金融科技',
      description:
        '面向需要牌照落地、合规体系与银行清算通道的跨境支付与金融科技企业，提供从申请到长期跟踪的一站式解决方案。',
      ctaText: '预约咨询',
      ctaTo: '/contact',
      audienceTitle: '适用场景',
      audience: [
        '需要申请各地支付/金融牌照',
        '需要搭建符合监管要求的合规体系',
        '需要对接银行清算通道',
        '希望快速合规落地开展业务'
      ],
      valuesTitle: '我们提供',
      values: [
        '牌照申请全托管',
        '合规体系搭建',
        '银行清算通道对接',
        '监管政策长期跟踪服务'
      ],
      scenario:
        '需要申请各地支付/金融牌照，搭建合规体系，对接银行清算通道，满足监管要求。',
      offer:
        '牌照申请全托管、合规体系搭建、银行清算通道对接、监管政策长期跟踪服务，帮助企业快速合规落地开展业务。'
    },
    {
      id: 'cross-border-trade',
      image: '/3.jpg',
      imageRotate: 90,
      title: '外贸B2B与跨境电商企业',
      label: '外贸电商',
      headline: '外贸B2B与跨境电商',
      description:
        '为外贸与跨境电商企业提供多币种账户、资金通道与账户维护服务，降低汇率成本，保障供应链资金顺畅安全。',
      ctaText: '预约咨询',
      ctaTo: '/contact',
      audienceTitle: '适用场景',
      audience: [
        '需要多币种账户收付与结汇',
        '需要资金跨境流转与通道支持',
        '希望降低汇率成本与冻结风险',
        '需要保障供应链资金安全稳定'
      ],
      valuesTitle: '我们提供',
      values: [
        '多地区银行开户',
        '多币种资金通道',
        '锁汇服务',
        '账户日常维护'
      ],
      scenario:
        '需要多币种账户收付、结汇、资金跨境流转，降低汇率成本，保障资金安全，避免账户冻结。',
      offer:
        '多地区银行开户、多币种资金通道、锁汇服务、账户日常维护，保障供应链资金顺畅流转。'
    },
    {
      id: 'investment-family-office',
      image: '/4.jpg',
      imagePosition: 'center bottom',
      title: '投资控股与家族办公室',
      label: '家族办公室',
      headline: '投资控股与家族办公室',
      description:
        '为投资控股与家族办公室提供境外架构、牌照与合规支持，并对接私人银行渠道，严格保障客户隐私与资金调度安全。',
      ctaText: '预约咨询',
      ctaTo: '/contact',
      audienceTitle: '适用场景',
      audience: [
        '需要搭建境外持股架构',
        '需要资本项下资金调度支持',
        '对私密性与合规有高要求',
        '需要专业架构与牌照协同'
      ],
      valuesTitle: '我们提供',
      values: [
        '架构设计咨询',
        '相关牌照申请',
        '合规体系搭建',
        '私人银行渠道对接',
        '严格客户隐私保障'
      ],
      scenario:
        '需要搭建境外持股架构，进行资本项下资金调度，私密性要求高，需要专业的合规与架构支持。',
      offer:
        '架构设计咨询、相关牌照申请、合规体系搭建、私人银行渠道对接，严格保障客户隐私。'
    }
  ],
  industriesPage: {
    eyebrow: 'SOLUTIONS',
    title: '行业解决方案',
    lead: '为不同行业、不同阶段的跨境企业，量身定制可落地的解决方案。',
    metaTitle: '行业解决方案｜SK Management Consulting',
    nav: [
      { label: '跨境支付', to: '#cross-border-payment' },
      { label: '外贸电商', to: '#cross-border-trade' },
      { label: '家族办公室', to: '#investment-family-office' }
    ]
  },
  aboutPage: {
    eyebrow: 'ABOUT US',
    title: '关于我们',
    lead: '以专业、严谨、可落地的服务，陪伴跨境企业合规出海。',
    metaTitle: '关于我们｜SK Management Consulting',
    nav: [
      { label: '使命', to: '#mission' },
      { label: '基础', to: '#confidentiality' },
      { label: '优势', to: '#advantages' }
    ]
  },
  mission: {
    eyebrow: 'MISSION',
    title: '使命｜Mission',
    paragraphs: [
      '为跨境企业扫除经营与合规中的一切障碍，以专业、严谨、可落地的服务，帮助企业合规出海，实现全球业务增长。',
      '真正的专业，源于对监管规则的深度理解，与对客户结果的绝对负责。'
    ]
  },
  advantagesSection: {
    eyebrow: 'OUR ADVANTAGES',
    title: '我们的核心优势'
  },
  advantages: [
    {
      title: '资深专业团队',
      description:
        '核心成员均来自普华永道等四大会计师事务所、持牌金融机构合规部门与各地金融监管机构，平均拥有10年以上跨境金融合规经验，累计服务超过200家企业客户。'
    },
    {
      title: '全链路闭环服务',
      description:
        '从顶层管理咨询、牌照申请、合规体系搭建到银企关系维护，覆盖企业出海全周期需求，一站式服务无需对接多家机构，避免信息不对称，提升落地效率。'
    },
    {
      title: '1v1专属对接',
      description:
        '坚持精品化服务，每位客户配备专属项目顾问，直接对接合伙人层级，无多层外包，问题24小时内响应，保障服务质量与响应速度。'
    }
  ],
  confidentiality: {
    eyebrow: '保密与安全 CONFIDENTIALITY',
    title: '保密与安全，是我们服务的基础',
    items: [
      '所有项目签署双向保密协议NDA，客户商业信息全程加密存储，严格保密。',
      '客户档案分权限管理，仅项目相关人员可访问，绝不泄露客户信息。',
      '所有客户案例均经过严格脱敏，未经客户书面授权，绝不将客户信息用于营销宣传。'
    ]
  },
  contactHero: {
    eyebrow: 'CONSULTATION',
    title: '开启一次专业的合规对话',
    subtitle:
      '请通过官方渠道联系我们，我们将在24小时内安排专属顾问与您对接，首先发送《保密协议》与《服务介绍手册》供您参考。',
    ctaText: '联系咨询'
  },
  contactPage: {
    eyebrow: 'CONTACT',
    title: '联系咨询',
    lead: '联系我们获取更多信息',
    metaTitle: '联系咨询｜SK Management Consulting',
    channelsTitle: '官方联系方式',
    emailFromLabel: '发件人',
    emailSubjectLabel: '主题',
    emailToLabel: '收件人',
    emailToValue: '您',
    formNameLabel: '姓名',
    formEmailLabel: '邮件地址',
    formMessageLabel: '信息',
    formNamePlaceholder: '请输入您的姓名',
    formEmailPlaceholder: 'name@example.com',
    formMessagePlaceholder: '请简述您的需求或问题',
    formSubmitLabel: '发送',
    formRequiredError: '此项不能为空',
    formEmailError: '请输入有效的邮箱地址',
    formSuccessMessage: '感谢提交，我们会尽快联系你',
    formSuccessClose: '确定'
  },
  notFoundPage: {
    eyebrow: 'NOT FOUND',
    code: '404',
    title: '页面未找到',
    lead: '您访问的页面不存在或已被移除。',
    redirectHint: '{n} 秒后将返回首页',
    ctaText: '立即返回首页',
    metaTitle: '页面未找到｜SK Management Consulting'
  },
  contactChannels: [
    { label: '商务邮箱', value: 'contact@skmc-global.com', href: 'mailto:contact@skmc-global.com' },
    { label: '商务微信', value: 'SK_Consulting_Global' },
    { label: '办公地址', value: '中国广东省深圳市南山区华润总部大厦2001室' },
    { label: '官方网站', value: 'www.skmc-global.com', href: 'https://www.skmc-global.com' }
  ],
  contactNote: '您的任何信息，都将被严格保密，不会用于任何营销用途。',
  footerContent: {
    copyright: '© 2026 SK Management Consulting. All rights reserved.',
    disclaimer:
      'SK Group refers to SK Group network member firms in China, each member firm is independent and not responsible for the acts or omissions of other member firms.'
  },
  ui: {
    headerNavAria: '主导航',
    headerOpenMenu: '打开导航菜单',
    headerMobileNavAria: '移动端导航',
    headerHomeAria: 'SK Management Consulting 首页',
    heroCarouselAria: '首页形象轮播',
    heroPrev: '上一张',
    heroNext: '下一张',
    heroDotsAria: '轮播页码',
    heroSlideLabel: '幻灯片',
    heroScrollHint: '向下滚动',
    heroScrollReadyHint: '继续滚动或点击进入内容',
    statAria: '关键数据',
    servicePrev: '上一项服务',
    serviceNext: '下一项服务',
    serviceTabsAria: '服务切换',
    serviceLearnMore: '了解更多',
    industryScenario: '场景',
    industryOffer: '我们提供',
    industryExpand: '了解方案',
    industryCollapse: '收起',
    footerNavTitle: '导航',
    footerServicesTitle: '核心服务',
    footerContactTitle: '联系方式',
    footerNavAria: '页脚导航'
  }
}

// ============================================
// English
// ============================================
export const en: SiteContent = {
  meta: {
    title: 'SK Management Consulting | Cross-Border Financial Compliance & Management Consulting',
    description:
      'SK Management Consulting — Your end-to-end compliance and management partner behind global expansion. Management consulting, global licensing and maintenance, compliance framework design, and banking relationship management for cross-border enterprises.'
  },
  siteInfo: {
    name: 'SK Management Consulting',
    group: 'A Professional Consulting Brand of SK Group',
    tagline: 'Cross-border Financial Compliance & Management Consulting',
    description: 'Your End-to-End Compliance & Management Partner Behind Global Expansion'
  },
  navItems: [
    { label: 'Home', to: '/' },
    { label: 'Services', to: '/services' },
    { label: 'Solutions', to: '/industries' },
    { label: 'About', to: '/about' },
    { label: 'Consultation', to: '/contact' }
  ],
  homeHero: {
    eyebrow: 'A Professional Consulting Brand of SK Group',
    title: 'Your End-to-End Compliance & Management Partner Behind Global Expansion',
    subtitle:
      'We are not a generalist consultancy — we are dedicated specialists in cross-border financial compliance. From strategic planning to licensing, compliance systems, and banking relationships, our end-to-end service turns complex cross-border regulatory requirements into your everyday business as usual.',
    ctaText: 'Book a Consultation',
    imageAlt: 'Cross-border Financial Compliance & Management Consulting'
  },
  homeSlides: [
    {
      image: '/hero-1.jpg',
      alt: 'Business team meeting and strategic planning',
      title: 'Your End-to-End Compliance & Management Partner Behind Global Expansion',
      subtitle:
        'We are not a generalist consultancy — we are dedicated specialists in cross-border financial compliance. From strategic planning to licensing, compliance systems, and banking relationships, our end-to-end service turns complex cross-border regulatory requirements into your everyday business as usual.'
    },
    {
      image: '/hero-2.jpg',
      alt: 'Hong Kong Victoria Harbour skyline and International Commerce Centre',
      title: 'A boutique financial compliance and management consulting brand built exclusively for cross-border enterprises.',
      subtitle:
        'We do not offer one-size-fits-all consulting. We are dedicated specialists in cross-border financial compliance — our core team brings senior experience from Big Four accounting firms, licensed financial institutions, and regulatory authorities, delivering full-cycle support from strategy to execution throughout your entire overseas expansion journey.'
    },
    {
      image: '/hero-3.jpg',
      alt: 'Business team high-five celebrating partnership success',
      title: 'Your Compliance & Management Partner Behind Global Business',
      subtitle:
        'No need to navigate complex regulators, banks, and licensed institutions on your own. We integrate global resources to deliver one-stop services — from management consulting and licensing to compliance system design and banking relationship management — turning complex cross-border compliance and operational challenges into our daily expertise, not your burden.'
    },
    {
      image: '/hero-4.jpg',
      alt: 'Riverside city skyline at dusk',
      title: 'Building your compliance moat — rigorous, professional, results-driven.',
      subtitle: 'Tailored, actionable solutions for cross-border enterprises across industries and growth stages.',
      align: 'center',
      nowrap: true,
      ctaText: 'Contact Us',
      ctaTo: '/contact'
    }
  ],
  positioning: {
    eyebrow: 'POSITIONING',
    title: 'Your Compliance & Management Partner Behind Global Business',
    intro: 'A boutique financial compliance and management consulting brand built exclusively for cross-border enterprises.',
    paragraphs: [
      'We do not offer one-size-fits-all consulting. We are dedicated specialists in cross-border financial compliance — our core team brings senior experience from Big Four accounting firms, licensed financial institutions, and regulatory authorities, delivering full-cycle support from strategy to execution throughout your entire overseas expansion journey.',
      'No need to navigate complex regulators, banks, and licensed institutions on your own. We integrate global resources to deliver one-stop services — from management consulting and licensing to compliance system design and banking relationship management — turning complex cross-border compliance and operational challenges into our daily expertise, not your burden.',
      'Building your compliance moat — rigorous, professional, results-driven. Tailored, actionable solutions for cross-border enterprises across industries and growth stages.'
    ]
  },
  stats: [
    { value: '30+', description: 'Global network of regulators, banks & licensed institutions' },
    { value: '200+', description: 'Cross-border finance, trade & investment clients served' },
    { value: '98%', description: 'First-time approval rate for global financial licenses' },
    { value: '60%', description: 'Average time saved on compliance communication & execution' }
  ],
  statsSection: {
    eyebrow: 'About Us',
    title: 'SK Management Consulting',
    subtitle: 'A Professional Consulting Brand of SK Group',
    body: 'We clear every operational and compliance obstacle standing between cross-border enterprises and global growth — delivering professional, rigorous, and actionable services that help you expand compliantly and grow worldwide. True expertise comes from a deep understanding of regulatory rules and an absolute commitment to client outcomes.',
    ctaTo: '/about',
    ctaAria: 'Go to About'
  },
  servicesSection: {
    eyebrow: 'SERVICES & CAPABILITIES',
    title: 'End-to-End, Closed-Loop Professional Services',
    lead: 'From top-level consulting and licensing to compliance framework design and banking relationships, we cover your entire overseas expansion journey — one-stop service that eliminates coordinating multiple vendors and improves execution efficiency.',
    ctaTo: '/services',
    ctaText: 'Details',
    ctaAria: 'Go to Services'
  },
  services: [
    {
      id: 'management-consulting',
      index: '01',
      title: 'Management Consulting',
      label: 'Consulting',
      headline: 'Management Consulting',
      subtitle: 'Top-Level Corporate Design',
      description:
        'Beyond delivering reports, we provide hands-on implementation support and long-term follow-up to ensure real results.',
      highlight:
        'Beyond delivering reports, we provide hands-on implementation support and long-term follow-up to ensure real results.',
      ctaText: 'Book a Consultation',
      ctaTo: '/contact',
      audienceTitle: 'Who It’s For',
      audience: [],
      valuesTitle: 'Core Value',
      values: [],
      sideBody:
        'We provide cross-border enterprises with strategic planning, organizational optimization, process redesign, and hands-on change coaching — end-to-end support from top-level design through implementation — helping you adapt to overseas markets and build an efficient management system.',
      image: '/service-1.jpg'
    },
    {
      id: 'global-licensing',
      index: '02',
      title: 'Global Licensing & Maintenance',
      label: 'Licensing',
      headline: 'Global Licensing & Maintenance',
      subtitle: 'Full Lifecycle Credential Management',
      description:
        "Our team's deep regulatory expertise delivers a 98% first-time license approval rate.",
      highlight:
        "Our team's deep regulatory expertise delivers a 98% first-time license approval rate.",
      ctaText: 'Book a Consultation',
      ctaTo: '/contact',
      audienceTitle: 'Who It’s For',
      audience: [],
      valuesTitle: 'Core Value',
      values: [],
      sideBody:
        'Covering financial, payment, TCSP, and virtual asset licenses across Hong Kong, Singapore, Southeast Asia, Europe and the US — including assessment, documentation, regulatory liaison, issuance, annual review, amendments, and renewals — to reduce license lapse risk.',
      image: '/service-2.jpg'
    },
    {
      id: 'compliance-system',
      index: '03',
      title: 'Compliance Framework Design',
      label: 'Compliance',
      headline: 'Compliance Framework Design',
      subtitle: 'Actionable Internal Controls',
      description:
        'Includes compliance training and regular updates to keep pace with evolving regulations.',
      highlight:
        'Includes compliance training and regular updates to keep pace with evolving regulations.',
      ctaText: 'Book a Consultation',
      ctaTo: '/contact',
      audienceTitle: 'Who It’s For',
      audience: [],
      valuesTitle: 'Core Value',
      values: [],
      sideBody:
        'We build AML, KYC, data compliance, and risk control systems that meet local regulatory requirements, delivering executable internal policies, SOPs, employee handbooks, and audit materials to help you pass regulatory review and reduce compliance risk.',
      image: '/service-3.jpg'
    },
    {
      id: 'banking-stakeholder',
      index: '04',
      title: 'Banking Relationship Management',
      label: 'Banking',
      headline: 'Banking Relationship Management',
      subtitle: 'End-to-End Bank Relations',
      description:
        'Direct access to bank decision-makers resolves complex issues standard processes cannot.',
      highlight:
        'Direct access to bank decision-makers resolves complex issues standard processes cannot.',
      ctaText: 'Book a Consultation',
      ctaTo: '/contact',
      audienceTitle: 'Who It’s For',
      audience: [],
      valuesTitle: 'Core Value',
      values: [],
      sideBody:
        'We help you connect with domestic and overseas banks, clearing institutions, and custodians — supporting account access, day-to-day maintenance, relationship building, regulatory inquiry coordination, and issue resolution to open fund channels and keep accounts stable.',
      image: '/service-4.jpg'
    }
  ],
  servicesPage: {
    eyebrow: 'SERVICES & CAPABILITIES',
    title: 'Core Services',
    lead: 'From top-level consulting and licensing to compliance framework design and banking relationships — covering your entire overseas expansion journey.',
    metaTitle: 'Services | SK Management Consulting',
    nav: [
      { label: 'Consulting', to: '#management-consulting' },
      { label: 'Licensing', to: '#global-licensing' },
      { label: 'Compliance', to: '#compliance-system' },
      { label: 'Banking', to: '#banking-stakeholder' }
    ]
  },
  industriesSection: {
    eyebrow: 'SOLUTIONS',
    title: 'Tailored, actionable solutions for cross-border enterprises across industries and growth stages.',
    lead: 'Building your compliance moat — rigorous, professional, results-driven.',
    ctaTo: '/industries',
    ctaText: 'Details',
    ctaAria: 'Go to Solutions'
  },
  industries: [
    {
      id: 'cross-border-payment',
      image: '/2.jpg',
      title: 'Cross-Border Payment & Fintech Companies',
      label: 'Payments',
      headline: 'Cross-Border Payment & Fintech',
      description:
        'For payment and fintech companies that need licensing, compliance frameworks, and bank clearing channels — delivered as a one-stop path from application through long-term tracking.',
      ctaText: 'Book a Consultation',
      ctaTo: '/contact',
      audienceTitle: 'Typical Needs',
      audience: [
        'Payment/financial licenses across jurisdictions',
        'Compliance frameworks that meet local rules',
        'Bank clearing channel connectivity',
        'Faster compliant launch of operations'
      ],
      valuesTitle: 'What We Provide',
      values: [
        'Full-service licensing management',
        'Compliance framework design',
        'Bank clearing channel integration',
        'Ongoing regulatory policy tracking'
      ],
      scenario:
        'Need to obtain payment/financial licenses across jurisdictions, build compliance frameworks, and connect to bank clearing channels to meet regulatory requirements.',
      offer:
        'Full-service licensing, compliance framework design, bank clearing channel integration, and ongoing regulatory tracking — helping you launch compliant operations quickly.'
    },
    {
      id: 'cross-border-trade',
      image: '/3.jpg',
      imageRotate: 90,
      title: 'B2B Trade & Cross-Border E-Commerce',
      label: 'Trade',
      headline: 'B2B Trade & Cross-Border E-Commerce',
      description:
        'For trade and e-commerce businesses that need multi-currency accounts, fund channels, and account maintenance to reduce FX costs and keep supply-chain capital flowing safely.',
      ctaText: 'Book a Consultation',
      ctaTo: '/contact',
      audienceTitle: 'Typical Needs',
      audience: [
        'Multi-currency collections and FX settlement',
        'Cross-border fund transfer channels',
        'Lower FX costs and freeze risk',
        'Stable supply-chain capital security'
      ],
      valuesTitle: 'What We Provide',
      values: [
        'Multi-region bank account opening',
        'Multi-currency fund channels',
        'FX hedging support',
        'Day-to-day account maintenance'
      ],
      scenario:
        'Need multi-currency account collections, FX settlement, and cross-border fund transfers to reduce FX costs, ensure fund security, and avoid account freezes.',
      offer:
        'Multi-region bank account opening, multi-currency fund channels, FX hedging, and day-to-day account maintenance to keep supply chain funds flowing smoothly.'
    },
    {
      id: 'investment-family-office',
      image: '/4.jpg',
      imagePosition: 'center bottom',
      title: 'Investment Holding & Family Offices',
      label: 'Family Office',
      headline: 'Investment Holding & Family Offices',
      description:
        'For investment holdings and family offices that need offshore structuring, licensing and compliance support, plus private-banking access with strict confidentiality.',
      ctaText: 'Book a Consultation',
      ctaTo: '/contact',
      audienceTitle: 'Typical Needs',
      audience: [
        'Offshore holding structure setup',
        'Capital-account fund flow management',
        'High privacy and compliance requirements',
        'Professional structuring and licensing coordination'
      ],
      valuesTitle: 'What We Provide',
      values: [
        'Structuring consultation',
        'Related licensing support',
        'Compliance framework design',
        'Private banking channel access',
        'Strict client confidentiality'
      ],
      scenario:
        'Need to establish offshore holding structures and manage capital account fund flows, with high privacy requirements demanding professional compliance support.',
      offer:
        'Structuring consultation, related licensing, compliance framework design, and private banking channel access — with strict client confidentiality.'
    }
  ],
  industriesPage: {
    eyebrow: 'SOLUTIONS',
    title: 'Industry Solutions',
    lead: 'Tailored, actionable solutions for cross-border enterprises across industries and growth stages.',
    metaTitle: 'Solutions | SK Management Consulting',
    nav: [
      { label: 'Payments', to: '#cross-border-payment' },
      { label: 'Trade', to: '#cross-border-trade' },
      { label: 'Family Office', to: '#investment-family-office' }
    ]
  },
  aboutPage: {
    eyebrow: 'ABOUT US',
    title: 'About Us',
    lead: 'Professional, rigorous, and actionable counsel for compliant cross-border growth.',
    metaTitle: 'About Us | SK Management Consulting',
    nav: [
      { label: 'Mission', to: '#mission' },
      { label: 'Foundation', to: '#confidentiality' },
      { label: 'Strengths', to: '#advantages' }
    ]
  },
  mission: {
    eyebrow: 'MISSION',
    title: 'Mission',
    paragraphs: [
      'We clear every operational and compliance obstacle standing between cross-border enterprises and global growth — delivering professional, rigorous, and actionable services that help you expand compliantly and grow worldwide.',
      'True expertise comes from a deep understanding of regulatory rules and an absolute commitment to client outcomes.'
    ]
  },
  advantagesSection: {
    eyebrow: 'OUR ADVANTAGES',
    title: 'Our Core Strengths'
  },
  advantages: [
    {
      title: 'Seasoned Professional Team',
      description:
        "Our core team comes from PwC and other Big Four firms, licensed financial institutions' compliance departments, and financial regulators worldwide — averaging 10+ years of cross-border compliance experience and serving 200+ enterprise clients."
    },
    {
      title: 'End-to-End Closed-Loop Service',
      description:
        'From top-level consulting and licensing to compliance framework design and banking relationships, we cover your entire overseas expansion journey — one-stop service that eliminates coordinating multiple vendors and improves execution efficiency.'
    },
    {
      title: 'Dedicated 1-on-1 Support',
      description:
        'We provide boutique, personalized service — every client is assigned a dedicated project advisor with direct access to partner-level staff, no multi-tier outsourcing, and 24-hour issue response.'
    }
  ],
  confidentiality: {
    eyebrow: 'CONFIDENTIALITY',
    title: 'Confidentiality & Security Are the Foundation of Our Service',
    items: [
      'All engagements are covered by mutual NDAs; client business information is encrypted and stored under strict confidentiality throughout.',
      'Client files are access-controlled by permission level — accessible only to relevant project personnel — and are never disclosed.',
      'All client case studies are strictly anonymized; client information is never used for marketing without written client authorization.'
    ]
  },
  contactHero: {
    eyebrow: 'CONSULTATION',
    title: 'Start a Professional Compliance Conversation',
    subtitle:
      'Please contact us through official channels. We will arrange a dedicated advisor to reach out within 24 hours, and will first send our NDA and Service Introduction Brochure for your reference.',
    ctaText: 'Contact Us'
  },
  contactPage: {
    eyebrow: 'CONTACT',
    title: 'Contact Us',
    lead: 'Contact us for more information.',
    metaTitle: 'Contact Us | SK Management Consulting',
    channelsTitle: 'Official Channels',
    emailFromLabel: 'From',
    emailSubjectLabel: 'Subject',
    emailToLabel: 'To',
    emailToValue: 'You',
    formNameLabel: 'Name',
    formEmailLabel: 'Email',
    formMessageLabel: 'Message',
    formNamePlaceholder: 'Your name',
    formEmailPlaceholder: 'name@example.com',
    formMessagePlaceholder: 'Briefly describe your needs or questions',
    formSubmitLabel: 'Send',
    formRequiredError: 'This field is required',
    formEmailError: 'Please enter a valid email address',
    formSuccessMessage: 'Thank you for your submission. We will contact you soon.',
    formSuccessClose: 'OK'
  },
  notFoundPage: {
    eyebrow: 'NOT FOUND',
    code: '404',
    title: 'Page Not Found',
    lead: 'The page you are looking for does not exist or has been moved.',
    redirectHint: 'Returning to home in {n}s',
    ctaText: 'Back to Home',
    metaTitle: 'Page Not Found | SK Management Consulting'
  },
  contactChannels: [
    { label: 'Business Email', value: 'contact@skmc-global.com', href: 'mailto:contact@skmc-global.com' },
    { label: 'Business WeChat', value: 'SK_Consulting_Global' },
    {
      label: 'Office Address',
      value: 'Room 2001, CR Land HQ Building, Nanshan District, Shenzhen, Guangdong, China'
    },
    { label: 'Website', value: 'www.skmc-global.com', href: 'https://www.skmc-global.com' }
  ],
  contactNote:
    'All information you share will be kept strictly confidential and will never be used for marketing purposes.',
  footerContent: {
    copyright: '© 2026 SK Management Consulting. All rights reserved.',
    disclaimer:
      'SK Group refers to SK Group network member firms in China, each member firm is independent and not responsible for the acts or omissions of other member firms.'
  },
  ui: {
    headerNavAria: 'Main navigation',
    headerOpenMenu: 'Open navigation menu',
    headerMobileNavAria: 'Mobile navigation',
    headerHomeAria: 'SK Management Consulting home',
    heroCarouselAria: 'Homepage image carousel',
    heroPrev: 'Previous slide',
    heroNext: 'Next slide',
    heroDotsAria: 'Carousel pagination',
    heroSlideLabel: 'Slide',
    heroScrollHint: 'Scroll down',
    heroScrollReadyHint: 'Scroll or tap to enter',
    statAria: 'Key metrics',
    servicePrev: 'Previous service',
    serviceNext: 'Next service',
    serviceTabsAria: 'Services',
    serviceLearnMore: 'Learn more',
    industryScenario: 'Scenario',
    industryOffer: 'We provide',
    industryExpand: 'Explore solutions',
    industryCollapse: 'Collapse',
    footerNavTitle: 'Navigation',
    footerServicesTitle: 'Core Services',
    footerContactTitle: 'Contact',
    footerNavAria: 'Footer navigation'
  }
}