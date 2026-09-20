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
  title: string
  subtitle: string
  description: string
  highlight: string
}

export interface IndustryItem {
  id: string
  image: string
  title: string
  scenario: string
  offer: string
}

export interface AdvantageItem {
  title: string
  description: string
}

export interface ContactChannel {
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
  positioning: {
    eyebrow: string
    title: string
    intro: string
    paragraphs: string[]
  }
  stats: StatItem[]
  servicesSection: {
    eyebrow: string
    title: string
    lead: string
  }
  services: ServiceItem[]
  industriesSection: {
    eyebrow: string
    title: string
    lead: string
  }
  industries: IndustryItem[]
  mission: {
    eyebrow: string
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
    statAria: string
    servicePrev: string
    serviceNext: string
    serviceTabsAria: string
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
    { label: '首页', to: '#top' },
    { label: '核心服务', to: '#services' },
    { label: '行业解决方案', to: '#industries' },
    { label: '关于我们', to: '#about' },
    { label: '咨询对接', to: '#contact' }
  ],
  homeHero: {
    eyebrow: 'SK Group 旗下专业咨询品牌',
    title: '您企业出海背后的全链路合规与管理顾问',
    subtitle:
      '我们不做泛行业的通用咨询，而做跨境金融领域的精品专家。从战略规划到牌照落地、合规体系、银企对接，以全链路闭环服务，将复杂的跨境监管要求，化作您从容经营的日常。',
    ctaText: '预约专业咨询',
    imageAlt: '跨境金融合规与管理咨询'
  },
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
  servicesSection: {
    eyebrow: '核心服务 SERVICES & CAPABILITIES',
    title: '全链路闭环的专业服务能力',
    lead: '从顶层管理咨询、牌照申请、合规体系搭建到银企关系维护，覆盖企业出海全周期需求，一站式服务无需对接多家机构，避免信息不对称，提升落地效率。'
  },
  services: [
    {
      id: 'management-consulting',
      index: '01',
      title: '管理咨询',
      subtitle: '企业经营顶层设计',
      description:
        '为跨境企业提供战略规划、组织架构优化、业务流程重构、落地变革辅导，从顶层设计到落地执行全流程支持，帮助企业适配海外经营环境，搭建高效的经营管理体系。',
      highlight: '不止输出咨询报告，更配套落地辅导与长期跟踪，确保方案真正落地。'
    },
    {
      id: 'global-licensing',
      index: '02',
      title: '全球牌照申请与维护',
      subtitle: '全周期资质托管',
      description:
        '覆盖香港、新加坡、东南亚、欧美等多地区金融、支付、TCSP、虚拟资产等各类牌照申请服务，包含前期评估、材料准备、监管沟通、牌照领取、年审、变更、续期全周期托管，避免牌照失效风险。',
      highlight: '核心团队熟悉各地监管要求，牌照申请一次性通过率98%。'
    },
    {
      id: 'compliance-system',
      index: '03',
      title: '合规体系搭建',
      subtitle: '可落地的内控方案',
      description:
        '为企业搭建符合各地监管要求的反洗钱AML、客户尽调KYC、数据合规、风险控制体系，输出全套可执行的内控制度、SOP流程、员工手册与审计材料，帮助企业通过监管核查，规避合规风险。',
      highlight: '配套合规培训与定期更新服务，适配监管政策变化。'
    },
    {
      id: 'banking-stakeholder',
      index: '04',
      title: '银行干系人管理',
      subtitle: '银企关系全链路维护',
      description:
        '协助企业对接境内外银行、清算机构、托管行，提供开户准入沟通、账户日常维护、合作关系搭建、监管问询协同、问题排查解决全流程服务，帮助企业打通资金通道，保障账户稳定。',
      highlight: '直接对接银行决策层，解决标准流程无法处理的疑难问题。'
    }
  ],
  industriesSection: {
    eyebrow: '行业解决方案 SOLUTIONS',
    title: '为不同行业、不同阶段的跨境企业，量身定制可落地的解决方案',
    lead: '为您构建的合规护城河——专业严谨，结果导向。'
  },
  industries: [
    {
      id: 'cross-border-payment',
      image: '/2.jpg',
      title: '跨境支付与金融科技企业',
      scenario:
        '需要申请各地支付/金融牌照，搭建合规体系，对接银行清算通道，满足监管要求。',
      offer:
        '牌照申请全托管、合规体系搭建、银行清算通道对接、监管政策长期跟踪服务，帮助企业快速合规落地开展业务。'
    },
    {
      id: 'cross-border-trade',
      image: '/3.jpg',
      title: '外贸B2B与跨境电商企业',
      scenario:
        '需要多币种账户收付、结汇、资金跨境流转，降低汇率成本，保障资金安全，避免账户冻结。',
      offer:
        '多地区银行开户、多币种资金通道、锁汇服务、账户日常维护，保障供应链资金顺畅流转。'
    },
    {
      id: 'investment-family-office',
      image: '/4.jpg',
      title: '投资控股与家族办公室',
      scenario:
        '需要搭建境外持股架构，进行资本项下资金调度，私密性要求高，需要专业的合规与架构支持。',
      offer:
        '架构设计咨询、相关牌照申请、合规体系搭建、私人银行渠道对接，严格保障客户隐私。'
    }
  ],
  mission: {
    eyebrow: '使命 MISSION',
    paragraphs: [
      '为跨境企业扫除经营与合规中的一切障碍，以专业、严谨、可落地的服务，\n帮助企业合规出海，实现全球业务增长。',
      '真正的专业，源于对监管规则的深度理解，与对客户结果的绝对负责。'
    ]
  },
  advantagesSection: {
    eyebrow: '核心优势 OUR ADVANTAGES',
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
    eyebrow: '咨询对接 CONSULTATION',
    title: '开启一次专业的合规对话',
    subtitle:
      '请通过官方渠道联系我们，我们将在24小时内安排专属顾问与您对接，首先发送《保密协议》与《服务介绍手册》供您参考。'
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
    statAria: '关键数据',
    servicePrev: '上一项服务',
    serviceNext: '下一项服务',
    serviceTabsAria: '服务切换',
    industryScenario: '场景',
    industryOffer: '我们提供',
    industryExpand: '查看更多',
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
    { label: 'Home', to: '#top' },
    { label: 'Services', to: '#services' },
    { label: 'Solutions', to: '#industries' },
    { label: 'About Us', to: '#about' },
    { label: 'Consultation', to: '#contact' }
  ],
  homeHero: {
    eyebrow: 'A Professional Consulting Brand of SK Group',
    title: 'Your End-to-End Compliance & Management Partner Behind Global Expansion',
    subtitle:
      'We are not a generalist consultancy — we are dedicated specialists in cross-border financial compliance. From strategic planning to licensing, compliance systems, and banking relationships, our end-to-end service turns complex cross-border regulatory requirements into your everyday business as usual.',
    ctaText: 'Book a Consultation',
    imageAlt: 'Cross-border Financial Compliance & Management Consulting'
  },
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
  servicesSection: {
    eyebrow: 'SERVICES & CAPABILITIES',
    title: 'End-to-End, Closed-Loop Professional Services',
    lead: 'From top-level consulting and licensing to compliance framework design and banking relationships, we cover your entire overseas expansion journey — one-stop service that eliminates coordinating multiple vendors and improves execution efficiency.'
  },
  services: [
    {
      id: 'management-consulting',
      index: '01',
      title: 'Management Consulting',
      subtitle: 'Top-Level Corporate Design',
      description:
        'We provide cross-border enterprises with strategic planning, organizational optimization, process redesign, and change management support — from top-level design through execution — helping you adapt to overseas markets and build an efficient management system.',
      highlight: 'Beyond delivering reports, we provide hands-on implementation support and long-term follow-up to ensure real results.'
    },
    {
      id: 'global-licensing',
      index: '02',
      title: 'Global Licensing & Maintenance',
      subtitle: 'Full Lifecycle Credential Management',
      description:
        'Covering financial, payment, TCSP, and virtual asset licenses across Hong Kong, Singapore, Southeast Asia, Europe and the US, we manage the full lifecycle — assessment, documentation, regulatory liaison, issuance, annual review, amendment, and renewal.',
      highlight: "Our team's deep regulatory expertise delivers a 98% first-time license approval rate."
    },
    {
      id: 'compliance-system',
      index: '03',
      title: 'Compliance Framework Design',
      subtitle: 'Actionable Internal Controls',
      description:
        'We build AML, KYC, data compliance, and risk control systems that meet local regulatory requirements, delivering executable internal controls, SOPs, employee handbooks, and audit materials to help you pass regulatory review.',
      highlight: 'Includes compliance training and regular updates to keep pace with evolving regulations.'
    },
    {
      id: 'banking-stakeholder',
      index: '04',
      title: 'Banking Relationship Management',
      subtitle: 'End-to-End Bank Relations',
      description:
        'We help you connect with domestic and overseas banks, clearing institutions, and custodians — supporting account access, maintenance, relationship building, regulatory coordination, and issue resolution to keep fund channels open.',
      highlight: 'Direct access to bank decision-makers resolves complex issues standard processes cannot.'
    }
  ],
  industriesSection: {
    eyebrow: 'SOLUTIONS',
    title: 'Tailored, actionable solutions for cross-border enterprises across industries and growth stages.',
    lead: 'Building your compliance moat — rigorous, professional, results-driven.'
  },
  industries: [
    {
      id: 'cross-border-payment',
      image: '/2.jpg',
      title: 'Cross-Border Payment & Fintech Companies',
      scenario:
        'Need to obtain payment/financial licenses across jurisdictions, build compliance frameworks, and connect to bank clearing channels to meet regulatory requirements.',
      offer:
        'Full-service licensing, compliance framework design, bank clearing channel integration, and ongoing regulatory tracking — helping you launch compliant operations quickly.'
    },
    {
      id: 'cross-border-trade',
      image: '/3.jpg',
      title: 'B2B Trade & Cross-Border E-Commerce',
      scenario:
        'Need multi-currency account collections, FX settlement, and cross-border fund transfers to reduce FX costs, ensure fund security, and avoid account freezes.',
      offer:
        'Multi-region bank account opening, multi-currency fund channels, FX hedging, and day-to-day account maintenance to keep supply chain funds flowing smoothly.'
    },
    {
      id: 'investment-family-office',
      image: '/4.jpg',
      title: 'Investment Holding & Family Offices',
      scenario:
        'Need to establish offshore holding structures and manage capital account fund flows, with high privacy requirements demanding professional compliance support.',
      offer:
        'Structuring consultation, related licensing, compliance framework design, and private banking channel access — with strict client confidentiality.'
    }
  ],
  mission: {
    eyebrow: 'MISSION',
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
      'Please contact us through official channels. We will arrange a dedicated advisor to reach out within 24 hours, and will first send our NDA and Service Introduction Brochure for your reference.'
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
    statAria: 'Key metrics',
    servicePrev: 'Previous service',
    serviceNext: 'Next service',
    serviceTabsAria: 'Services',
    industryScenario: 'Scenario',
    industryOffer: 'We provide',
    industryExpand: 'View more',
    industryCollapse: 'Collapse',
    footerNavTitle: 'Navigation',
    footerServicesTitle: 'Core Services',
    footerContactTitle: 'Contact',
    footerNavAria: 'Footer navigation'
  }
}