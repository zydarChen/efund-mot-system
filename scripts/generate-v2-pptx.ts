/**
 * 科学化客户服务思考汇报 V3 — PPTX 生成脚本
 * 融合《科学化客户服务思考汇报v2.pptx》+ VMOT 系统功能
 *
 * 运行: npx tsx scripts/generate-v2-pptx.ts
 */

import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const PptxGenJS = require('pptxgenjs')
type Slide = any

// ===== 全局配色 =====
const C = {
  BG_FROM: '0D1B2A',
  BG_TO: '001E3D',
  CARD: '142336',
  CARD_BORDER: '1A3A5C',
  ACCENT: '2FC5E7',
  PRIMARY: '005096',
  GOLD: 'D4A017',
  SUCCESS: '10B981',
  TEXT: 'FFFFFF',
  TEXT_SEC: '94A3B8',
  TEXT_DIM: '64748B',
  RED: 'EF4444',
  ORANGE: 'F97316',
  YELLOW: 'F59E0B',
}

const TOTAL = 16

// ===== 工具函数 =====
function setBg(slide: Slide) {
  slide.background = { color: C.BG_FROM }
  slide.addShape('rect', {
    x: 0, y: 0, w: '100%', h: '100%',
    fill: { type: 'solid', color: C.BG_FROM },
  })
}

function addPageNum(slide: Slide, n: number) {
  slide.addText(`${String(n).padStart(2, '0')} / ${TOTAL}`, {
    x: 11.5, y: 7.0, w: 1.5, h: 0.3,
    fontSize: 8, color: C.TEXT_DIM, align: 'right',
  })
}

function addAccentLine(slide: Slide, x: number, y: number) {
  slide.addShape('rect', {
    x, y, w: 0.6, h: 0.04,
    fill: { type: 'solid', color: C.ACCENT },
    rectRadius: 0.02,
  })
}

function addTitle(slide: Slide, title: string, y = 0.5) {
  addAccentLine(slide, 0.8, y)
  slide.addText(title, {
    x: 0.8, y: y + 0.1, w: 11, h: 0.5,
    fontSize: 24, bold: true, color: C.TEXT,
  })
}

function addCard(slide: Slide, x: number, y: number, w: number, h: number, highlight = false) {
  slide.addShape('roundRect', {
    x, y, w, h,
    fill: { type: 'solid', color: C.CARD },
    line: { color: highlight ? C.ACCENT : C.CARD_BORDER, width: 1 },
    rectRadius: 0.1,
    shadow: highlight ? { type: 'outer', blur: 8, color: C.ACCENT, opacity: 0.15, offset: 0, angle: 0 } : undefined,
  })
}

// ===== 创建 PPT =====
const pptx = new PptxGenJS()
pptx.defineLayout({ name: 'WIDE', width: 13.333, height: 7.5 })
pptx.layout = 'WIDE'
pptx.author = '客服产研团队'
pptx.company = '易方达基金管理有限公司'
pptx.subject = '科学化客户服务体系思考'
pptx.title = '破局求新、牢筑壁垒 — 科学客户服务体系思考'

// ===== Slide 01: 封面 =====
function makeSlide01() {
  const s = pptx.addSlide()
  setBg(s)

  // Decorative rings
  s.addShape('ellipse', {
    x: 8.5, y: 0.5, w: 5, h: 5,
    line: { color: C.ACCENT, width: 1.5 },
    fill: { type: 'solid', color: C.BG_FROM },
    shadow: { type: 'outer', blur: 20, color: C.ACCENT, opacity: 0.1, offset: 0, angle: 0 },
  })
  s.addShape('ellipse', {
    x: 9.0, y: 1.0, w: 4, h: 4,
    line: { color: C.ACCENT, width: 0.8 },
    fill: { type: 'solid', color: C.BG_FROM },
  })

  s.addText('STRATEGIC TRANSFORMATION', {
    x: 2, y: 1.5, w: 9, h: 0.3,
    fontSize: 9, color: C.TEXT_DIM, align: 'center', charSpacing: 3,
  })

  s.addShape('rect', {
    x: 6.2, y: 2.0, w: 1.0, h: 0.05,
    fill: { type: 'solid', color: C.ACCENT },
    rectRadius: 0.02,
  })

  s.addText('破局求新、牢筑壁垒', {
    x: 2, y: 2.2, w: 9, h: 0.8,
    fontSize: 42, bold: true, color: C.ACCENT, align: 'center',
  })
  s.addText('科学客户服务体系思考', {
    x: 2, y: 3.0, w: 9, h: 0.6,
    fontSize: 22, bold: true, color: C.TEXT, align: 'center',
  })
  s.addText('AI赋能客服，从"客户找服务"到"服务找客户"', {
    x: 2, y: 3.6, w: 9, h: 0.4,
    fontSize: 12, italic: true, color: C.TEXT_DIM, align: 'center',
  })

  s.addText('客服产研团队战略汇报  |  2026年战略规划', {
    x: 2, y: 5.2, w: 9, h: 0.3,
    fontSize: 10, color: C.TEXT_DIM, align: 'center',
  })
  s.addText('CRM Customer Service Team', {
    x: 2, y: 5.6, w: 9, h: 0.3,
    fontSize: 9, color: C.TEXT_DIM, align: 'center',
  })
}

// ===== Slide 02: 背景与定位 =====
function makeSlide02() {
  const s = pptx.addSlide()
  setBg(s)
  addTitle(s, '业务与金科产研团队挑战')
  addPageNum(s, 2)

  const sections = [
    { label: '金科大中台定位', desc: '金科作为公司大中台板块，承担着受理各个板块、部门需求的核心职责', highlight: '核心使命：连接前台业务与后台资源，提供高效、敏捷的能力支撑' },
    { label: '公司战略要求', desc: '公司要求谋求新发展、新变革，不仅是AI技术探索，更是未来业务商业逻辑的根本性变化', highlight: '' },
    { label: '业务板块压力', desc: '通过AI技术重构各块业务领域的展业模式，建立难以复制的新业务壁垒', highlight: '' },
    { label: '产研团队发展', desc: '缺乏质变，难以继续发展，亟需突破瓶颈', highlight: '' },
  ]

  sections.forEach((sec, i) => {
    const row = Math.floor(i / 2)
    const col = i % 2
    const x = 0.8 + col * 6.0
    const y = 1.5 + row * 2.6
    addCard(s, x, y, 5.6, 2.2, i === 0)
    s.addText(sec.label, {
      x: x + 0.3, y: y + 0.2, w: 5, h: 0.4,
      fontSize: 13, bold: true, color: C.ACCENT,
    })
    s.addText(sec.desc, {
      x: x + 0.3, y: y + 0.7, w: 5, h: 0.7,
      fontSize: 10, color: C.TEXT_SEC, lineSpacingMultiple: 1.3,
    })
    if (sec.highlight) {
      s.addText(sec.highlight, {
        x: x + 0.3, y: y + 1.5, w: 5, h: 0.4,
        fontSize: 9, italic: true, color: C.GOLD,
      })
    }
  })
}

// ===== Slide 03: 过去的贡献 =====
function makeSlide03() {
  const s = pptx.addSlide()
  setBg(s)
  addTitle(s, '过去工作贡献与转型契机')
  addPageNum(s, 3)

  const achievements = [
    { num: '01', title: '投资者之家', desc: '整体业务开展，构建投资者服务生态体系' },
    { num: '02', title: '智能客户顾问', desc: '小易建议系统，提供智能化投资建议服务' },
    { num: '03', title: '社区陪伴服务', desc: '持续建设陪伴服务体系，增强客户粘性' },
    { num: '04', title: '业务服务触点', desc: '基础设施不断投入，完善全渠道服务网络' },
  ]

  achievements.forEach((a, i) => {
    const x = 0.8 + i * 3.0
    addCard(s, x, 1.5, 2.7, 2.5)
    s.addShape('ellipse', {
      x: x + 0.3, y: 1.8, w: 0.45, h: 0.45,
      fill: { type: 'solid', color: C.ACCENT },
    })
    s.addText(a.num, {
      x: x + 0.3, y: 1.8, w: 0.45, h: 0.45,
      fontSize: 11, bold: true, color: C.BG_FROM, align: 'center', valign: 'middle',
    })
    s.addText(a.title, {
      x: x + 0.9, y: 1.8, w: 1.5, h: 0.4,
      fontSize: 12, bold: true, color: C.TEXT,
    })
    s.addText(a.desc, {
      x: x + 0.3, y: 2.5, w: 2.1, h: 0.8,
      fontSize: 9, color: C.TEXT_SEC, lineSpacingMultiple: 1.3,
    })
  })

  // Touchpoints
  s.addText('服务触点:', { x: 0.8, y: 4.3, w: 1.5, h: 0.3, fontSize: 10, bold: true, color: C.ACCENT })
  const tp = ['电话服务', '在线客服', '易服务', '易陪伴']
  tp.forEach((t, i) => {
    s.addText(t, { x: 2.5 + i * 2.0, y: 4.3, w: 1.8, h: 0.3, fontSize: 9, color: C.TEXT_SEC })
  })

  // Quote
  s.addText('"想走的更远一点、更超前一点，让团队发展更好一些。"', {
    x: 1.5, y: 5.2, w: 10, h: 0.4,
    fontSize: 11, italic: true, color: C.GOLD, align: 'center',
  })
  s.addText('基于过去积累，把握AI技术机遇，实现从量变到质变的跨越式发展。', {
    x: 1.5, y: 5.7, w: 10, h: 0.3,
    fontSize: 9, color: C.TEXT_DIM, align: 'center',
  })
}

// ===== Slide 04: 目标愿景 =====
function makeSlide04() {
  const s = pptx.addSlide()
  setBg(s)
  addTitle(s, '从客户找服务到服务找客户')
  addPageNum(s, 4)

  // Traditional vs Target
  addCard(s, 1.0, 1.5, 5.0, 1.5)
  s.addText('传统模式', { x: 1.3, y: 1.6, w: 2, h: 0.3, fontSize: 9, color: C.TEXT_DIM })
  s.addText('客户找服务', { x: 1.3, y: 1.95, w: 3, h: 0.4, fontSize: 16, bold: true, color: C.TEXT_SEC })
  s.addText('被动响应，等待客户需求', { x: 1.3, y: 2.4, w: 4, h: 0.3, fontSize: 9, color: C.TEXT_DIM })

  // Arrow
  s.addText('→', { x: 6.0, y: 1.8, w: 1.2, h: 0.8, fontSize: 28, bold: true, color: C.ACCENT, align: 'center', valign: 'middle' })

  addCard(s, 7.2, 1.5, 5.0, 1.5, true)
  s.addText('目标方向', { x: 7.5, y: 1.6, w: 2, h: 0.3, fontSize: 9, color: C.ACCENT })
  s.addText('服务找客户', { x: 7.5, y: 1.95, w: 3, h: 0.4, fontSize: 16, bold: true, color: C.ACCENT })
  s.addText('主动触达，预测客户需求', { x: 7.5, y: 2.4, w: 4, h: 0.3, fontSize: 9, color: C.TEXT_SEC })

  // Four pillars
  const pillars = [
    { title: '以客户为中心', desc: '聚合客户所有渠道触点数据，利用AI快速分析客户特征', tag: '核心理念' },
    { title: '投资旅程分析', desc: '基于客户投资旅程地图，深度分析不同阶段的核心诉求', tag: '关键能力' },
    { title: '关键时点挖掘', desc: '识别高价值服务关键时刻（MOT），主动提供服务', tag: '服务策略' },
    { title: '千人千面服务', desc: '基于客户画像与行为数据，个性化差异化服务体验', tag: '服务目标' },
  ]

  pillars.forEach((p, i) => {
    const x = 0.8 + i * 3.1
    addCard(s, x, 3.5, 2.8, 3.0)
    s.addText(p.tag, {
      x: x + 0.2, y: 3.7, w: 1.2, h: 0.25,
      fontSize: 8, color: C.BG_FROM, bold: true,
      fill: { type: 'solid', color: C.ACCENT },
    })
    s.addText(p.title, {
      x: x + 0.2, y: 4.1, w: 2.4, h: 0.35,
      fontSize: 12, bold: true, color: C.TEXT,
    })
    s.addText(p.desc, {
      x: x + 0.2, y: 4.6, w: 2.4, h: 1.2,
      fontSize: 9, color: C.TEXT_SEC, lineSpacingMultiple: 1.4,
    })
  })
}

// ===== Slide 05: 服务优势 =====
function makeSlide05() {
  const s = pptx.addSlide()
  setBg(s)
  addTitle(s, '资管机构服务优势分析')
  addPageNum(s, 5)

  // Touchpoint coverage
  addCard(s, 0.8, 1.5, 7.5, 2.8)
  s.addText('触点覆盖优势', { x: 1.1, y: 1.7, w: 3, h: 0.3, fontSize: 13, bold: true, color: C.ACCENT })
  s.addText('客户服务领域触点众多，形成全渠道、全场景的服务网络', { x: 1.1, y: 2.1, w: 7, h: 0.3, fontSize: 9, color: C.TEXT_SEC })

  s.addText('内部触点', { x: 1.1, y: 2.6, w: 2, h: 0.25, fontSize: 9, bold: true, color: C.SUCCESS })
  const internal = ['电话', '在线', '智能客服', '易服务', '易陪伴']
  internal.forEach((t, i) => {
    s.addText(t, { x: 1.1 + i * 1.4, y: 2.9, w: 1.2, h: 0.3, fontSize: 9, color: C.TEXT_SEC })
  })

  s.addText('外部触点', { x: 1.1, y: 3.3, w: 2, h: 0.25, fontSize: 9, bold: true, color: C.ORANGE })
  const external = ['互联网社区', '内容运营', '活动运营', '工具服务']
  external.forEach((t, i) => {
    s.addText(t, { x: 1.1 + i * 1.7, y: 3.6, w: 1.5, h: 0.3, fontSize: 9, color: C.TEXT_SEC })
  })

  // Data advantage
  addCard(s, 8.7, 1.5, 3.8, 2.8)
  s.addText('数据积累优势', { x: 9.0, y: 1.7, w: 3.2, h: 0.3, fontSize: 13, bold: true, color: C.GOLD })
  const dataItems = ['客户画像数据', '行为轨迹数据', '服务交互数据', '投资偏好数据']
  dataItems.forEach((d, i) => {
    s.addText(`• ${d}`, { x: 9.0, y: 2.3 + i * 0.4, w: 3, h: 0.3, fontSize: 9, color: C.TEXT_SEC })
  })

  // Conclusion
  s.addText('触点全覆盖+数据深积累，形成难以复制的服务护城河，为AI转型提供独特优势。', {
    x: 1.5, y: 5.0, w: 10, h: 0.4,
    fontSize: 10, italic: true, color: C.GOLD, align: 'center',
  })
}

// ===== Slide 06: 内容载体与投资者 =====
function makeSlide06() {
  const s = pptx.addSlide()
  setBg(s)
  addTitle(s, '服务内容载体与新生代投资者')
  addPageNum(s, 6)

  // Content carriers
  addCard(s, 0.8, 1.5, 6.0, 2.5)
  s.addText('服务内容载体', { x: 1.1, y: 1.7, w: 4, h: 0.3, fontSize: 13, bold: true, color: C.ACCENT })
  const items = [
    { name: '产品营销', tag: '产品介绍' },
    { name: '投资教育', tag: '知识普及' },
    { name: '宣传策划', tag: '品牌传播' },
    { name: '投研成果', tag: '专业洞察' },
  ]
  items.forEach((item, i) => {
    const x = 1.1 + i * 1.4
    s.addText(item.name, { x, y: 2.3, w: 1.2, h: 0.3, fontSize: 10, bold: true, color: C.TEXT })
    s.addText(item.tag, { x, y: 2.6, w: 1.2, h: 0.25, fontSize: 8, color: C.TEXT_DIM })
  })

  // New-gen investors
  addCard(s, 7.2, 1.5, 5.3, 2.5)
  s.addText('新生代投资者特征', { x: 7.5, y: 1.7, w: 4, h: 0.3, fontSize: 13, bold: true, color: C.ORANGE })
  const traits = [
    { label: '地缘政治敏感', desc: '关注宏观环境变化' },
    { label: '舆情热点追踪', desc: '快速响应市场热点' },
    { label: 'Z时代线上习惯', desc: '偏好数字化交互' },
  ]
  traits.forEach((t, i) => {
    s.addText(`${t.label} — ${t.desc}`, { x: 7.5, y: 2.2 + i * 0.45, w: 4.5, h: 0.35, fontSize: 9, color: C.TEXT_SEC })
  })

  // Drivers
  s.addText('监管要求', { x: 1.0, y: 4.5, w: 5.5, h: 0.3, fontSize: 11, bold: true, color: C.SUCCESS })
  s.addText('监管强调以客户为中心，要求金融机构提升服务质量，保护投资者权益', { x: 1.0, y: 4.9, w: 5.5, h: 0.4, fontSize: 9, color: C.TEXT_SEC })
  s.addText('公司战略', { x: 7.0, y: 4.5, w: 5.5, h: 0.3, fontSize: 11, bold: true, color: C.PRIMARY })
  s.addText('公司要求降本增效，通过AI技术提升服务效率，降低运营成本', { x: 7.0, y: 4.9, w: 5.5, h: 0.4, fontSize: 9, color: C.TEXT_SEC })
}

// ===== Slide 07: 战略结论 =====
function makeSlide07() {
  const s = pptx.addSlide()
  setBg(s)
  addTitle(s, '战略结论与价值主张')
  addPageNum(s, 7)

  s.addText(
    '建立符合未来投资者客户社会属性变化的、\n发挥公司已有业务能力优势、\n能够构造新业务竞争优势的、\n非传统人力模式的客户服务体系。',
    { x: 1.5, y: 1.5, w: 10, h: 1.6, fontSize: 13, color: C.TEXT_SEC, align: 'center', lineSpacingMultiple: 1.5 }
  )

  // Customer value
  addCard(s, 1.5, 3.3, 4.8, 2.0)
  s.addText('客户价值', { x: 1.5, y: 3.4, w: 4.8, h: 0.4, fontSize: 12, bold: true, color: C.ACCENT, align: 'center' })
  s.addText('获得感提升 · 个性化服务体验\n体验优化 · 全旅程无缝服务\n满意度提高 · 主动精准触达', {
    x: 1.8, y: 3.9, w: 4.2, h: 1.2, fontSize: 10, color: C.TEXT_SEC, align: 'center', lineSpacingMultiple: 1.4,
  })

  // Enterprise value
  addCard(s, 7.0, 3.3, 4.8, 2.0)
  s.addText('企业价值', { x: 7.0, y: 3.4, w: 4.8, h: 0.4, fontSize: 12, bold: true, color: C.GOLD, align: 'center' })
  s.addText('品牌认可 · 差异化服务优势\n规模增长 · 客户留存提升\n降本增效 · AI替代人力', {
    x: 7.3, y: 3.9, w: 4.2, h: 1.2, fontSize: 10, color: C.TEXT_SEC, align: 'center', lineSpacingMultiple: 1.4,
  })

  // Drivers
  const drivers = ['客户需求变化', '监管政策推动', '业务场景丰富', '技术能力成熟']
  drivers.forEach((d, i) => {
    s.addText(d, { x: 1.5 + i * 2.8, y: 5.8, w: 2.5, h: 0.4, fontSize: 10, color: C.TEXT_SEC, align: 'center' })
  })
}

// ===== Slide 08: AI大脑架构 =====
function makeSlide08() {
  const s = pptx.addSlide()
  setBg(s)
  addTitle(s, 'AI大脑 — 业务手脚与智慧核心')
  addPageNum(s, 8)

  const organs = [
    { name: '脑干', system: 'CSDP', role: '负责基本生命中枢：呼吸、心跳、血压、睡眠', meaning: '没有它，人无法存活', color: C.ACCENT },
    { name: '大脑皮层', system: 'VMOT', role: '负责高级神经活动：意识、思维、感知、运动、决策', meaning: '没有它，人没有自我、思想、认知', color: C.PRIMARY },
    { name: '脑脊液', system: '数据流', role: '负责大脑营养保护：供氧、排废物、稳定颅内压', meaning: '没有它，大脑无法正常工作', color: C.GOLD },
  ]

  // Brain circle
  s.addShape('ellipse', {
    x: 4.5, y: 1.5, w: 4.3, h: 4.3,
    line: { color: C.ACCENT, width: 2 },
    fill: { type: 'solid', color: C.BG_FROM },
    shadow: { type: 'outer', blur: 15, color: C.ACCENT, opacity: 0.12, offset: 0, angle: 0 },
  })
  s.addText('AI\n大脑', {
    x: 5.5, y: 2.8, w: 2.3, h: 1.2,
    fontSize: 24, bold: true, color: C.ACCENT, align: 'center', valign: 'middle',
  })

  organs.forEach((org, i) => {
    const x = i === 0 ? 0.5 : i === 1 ? 9.5 : 5.0
    const y = i === 2 ? 6.0 : 2.0
    const w = i === 2 ? 3.3 : 3.2

    addCard(s, x, y, w, i === 2 ? 1.0 : 3.5, i === 0)
    s.addText(org.name, { x: x + 0.2, y: y + 0.15, w: w - 0.4, h: 0.35, fontSize: 12, bold: true, color: org.color })
    s.addText(org.system, { x: x + 0.2, y: y + 0.5, w: w - 0.4, h: 0.3, fontSize: 10, bold: true, color: C.TEXT })
    if (i < 2) {
      s.addText(org.role, { x: x + 0.2, y: y + 1.0, w: w - 0.4, h: 0.8, fontSize: 8, color: C.TEXT_SEC, lineSpacingMultiple: 1.3 })
      s.addText(org.meaning, { x: x + 0.2, y: y + 2.0, w: w - 0.4, h: 0.5, fontSize: 8, italic: true, color: C.TEXT_DIM })
    }
  })
}

// ===== Slide 09: CSDP =====
function makeSlide09() {
  const s = pptx.addSlide()
  setBg(s)
  addTitle(s, 'CSDP — 客户综合信息管理（AI大脑脑干）')
  addPageNum(s, 9)

  s.addText('Customer Synthetic Data Platform', {
    x: 0.8, y: 1.2, w: 11, h: 0.3,
    fontSize: 10, italic: true, color: C.TEXT_DIM,
  })

  // Modules
  const modules = [
    { num: '01', name: '数据整合层', desc: '统一接入多源异构数据' },
    { num: '02', name: '画像构建层', desc: '360度客户画像建模' },
    { num: '03', name: '实时分析层', desc: '流式数据实时处理' },
    { num: '04', name: '服务支撑层', desc: 'API化数据服务能力' },
  ]
  modules.forEach((m, i) => {
    const x = 0.8 + i * 3.1
    addCard(s, x, 1.7, 2.8, 1.5)
    s.addText(m.num, {
      x: x + 0.2, y: 1.85, w: 0.4, h: 0.3,
      fontSize: 10, bold: true, color: C.ACCENT,
    })
    s.addText(m.name, {
      x: x + 0.7, y: 1.85, w: 1.8, h: 0.3,
      fontSize: 11, bold: true, color: C.TEXT,
    })
    s.addText(m.desc, {
      x: x + 0.2, y: 2.4, w: 2.4, h: 0.5,
      fontSize: 9, color: C.TEXT_SEC,
    })
  })

  // 13 Dimensions
  s.addText('13维度客户画像', { x: 0.8, y: 3.5, w: 5, h: 0.3, fontSize: 11, bold: true, color: C.ACCENT })
  const dims = ['基础信息', '资产分布', '交易行为', '持仓偏好', '风险特征', '收益表现', '渠道偏好', '内容偏好', '活动参与', '服务记录', '生命周期', '社交属性', '预测标签']
  dims.forEach((d, i) => {
    const row = Math.floor(i / 5)
    const col = i % 5
    s.addText(d, { x: 0.8 + col * 2.4, y: 3.9 + row * 0.35, w: 2.2, h: 0.3, fontSize: 8, color: C.TEXT_SEC })
  })

  // KPIs
  const kpis = [
    { label: '响应延迟', value: '毫秒级' },
    { label: '日处理量', value: '千万级' },
    { label: '可用性', value: '99.9%' },
  ]
  kpis.forEach((k, i) => {
    const x = 0.8 + i * 4.0
    addCard(s, x, 5.3, 3.6, 1.2)
    s.addText(k.value, { x: x + 0.3, y: 5.4, w: 3.0, h: 0.5, fontSize: 18, bold: true, color: C.ACCENT })
    s.addText(k.label, { x: x + 0.3, y: 5.95, w: 3.0, h: 0.3, fontSize: 9, color: C.TEXT_DIM })
  })
}

// ===== Slide 10: VMOT =====
function makeSlide10() {
  const s = pptx.addSlide()
  setBg(s)
  addTitle(s, 'VMOT — 客户高价值MOT服务管理（AI大脑皮层）')
  addPageNum(s, 10)

  s.addText('Valuable Moment of Truth', {
    x: 0.8, y: 1.2, w: 11, h: 0.3,
    fontSize: 10, italic: true, color: C.TEXT_DIM,
  })

  // MOT Quote
  addCard(s, 0.8, 1.7, 11.7, 1.2)
  s.addText(
    '"北欧航空公司每年接触1000万名乘客，每位乘客平均接触5位员工，每次15秒，这5000万次"15秒钟的关键时刻"决定了公司未来的成败。"',
    { x: 1.2, y: 1.8, w: 10.5, h: 0.6, fontSize: 10, italic: true, color: C.TEXT_SEC, lineSpacingMultiple: 1.3 }
  )
  s.addText('—— 詹·卡尔森', { x: 1.2, y: 2.5, w: 10.5, h: 0.3, fontSize: 9, color: C.GOLD, align: 'right' })

  // Peaks
  const peaks = ['最初 · 第一印象', '最高 · 峰值体验', '最终 · 最后印象']
  peaks.forEach((p, i) => {
    s.addText(p, { x: 0.8 + i * 4.2, y: 3.2, w: 3.8, h: 0.3, fontSize: 10, bold: true, color: i === 1 ? C.ACCENT : C.TEXT_SEC, align: 'center' })
  })

  // Modules
  const modules = [
    { n: '1', name: '关键时刻识别', desc: '基于客户旅程地图，识别投资全生命周期中的关键时刻' },
    { n: '2', name: '需求预测模型', desc: '利用AI算法预测客户需求与行为，提前洞察服务机会' },
    { n: '3', name: '智能推荐引擎', desc: '根据客户画像与场景，智能推荐最优服务策略' },
    { n: '4', name: '自动化触发', desc: '在关键时刻自动触发服务，实现千人千面精准触达' },
  ]
  modules.forEach((m, i) => {
    const x = 0.8 + i * 3.1
    addCard(s, x, 3.7, 2.8, 1.8)
    s.addText(m.n, { x: x + 0.2, y: 3.8, w: 0.3, h: 0.3, fontSize: 10, bold: true, color: C.ACCENT })
    s.addText(m.name, { x: x + 0.6, y: 3.8, w: 2.0, h: 0.3, fontSize: 10, bold: true, color: C.TEXT })
    s.addText(m.desc, { x: x + 0.2, y: 4.3, w: 2.4, h: 0.8, fontSize: 8, color: C.TEXT_SEC, lineSpacingMultiple: 1.3 })
  })

  // Scenarios
  const scenarios = ['新客开户引导', '首投转化促进', '异常波动安抚', '流失客户挽回']
  s.addText('应用场景:', { x: 0.8, y: 5.8, w: 1.5, h: 0.3, fontSize: 9, bold: true, color: C.ACCENT })
  scenarios.forEach((sc, i) => {
    s.addText(sc, { x: 2.5 + i * 2.5, y: 5.8, w: 2.3, h: 0.3, fontSize: 9, color: C.TEXT_SEC })
  })
}

// ===== Slide 11: 策略体系 =====
function makeSlide11() {
  const s = pptx.addSlide()
  setBg(s)
  addTitle(s, '策略中心 + 策略挖掘')
  addPageNum(s, 11)

  // Strategy Center
  addCard(s, 0.8, 1.5, 6.0, 3.5)
  s.addText('策略全生命周期管理', { x: 1.1, y: 1.7, w: 5, h: 0.3, fontSize: 12, bold: true, color: C.ACCENT })
  const features = ['规则配置', '审批流程', '灰度发布', '效果追踪', 'A/B测试']
  features.forEach((f, i) => {
    s.addText(`• ${f}`, { x: 1.1 + (i % 3) * 1.8, y: 2.3 + Math.floor(i / 3) * 0.35, w: 1.6, h: 0.3, fontSize: 9, color: C.TEXT_SEC })
  })

  // Mining
  addCard(s, 7.2, 1.5, 5.3, 3.5)
  s.addText('四维度外部感知', { x: 7.5, y: 1.7, w: 4, h: 0.3, fontSize: 12, bold: true, color: C.GOLD })
  const dims = ['客户之声', '市场舆情', '政策变化', '行情分析']
  dims.forEach((d, i) => {
    s.addText(`${i + 1}. ${d}`, { x: 7.5, y: 2.3 + i * 0.5, w: 4, h: 0.35, fontSize: 10, color: C.TEXT_SEC })
  })
  s.addText('AI 自动推荐新的 MOT 规则和服务策略', {
    x: 7.5, y: 4.3, w: 4.5, h: 0.3, fontSize: 9, italic: true, color: C.TEXT_DIM,
  })
}

// ===== Slide 12: 多渠道触达 =====
function makeSlide12() {
  const s = pptx.addSlide()
  setBg(s)
  addTitle(s, '多渠道触达 + 全链路追踪')
  addPageNum(s, 12)

  // Channel table header
  const headers = ['渠道', '日均量', '送达率', '打开率', '转化率', '成本']
  headers.forEach((h, i) => {
    s.addText(h, {
      x: 0.8 + i * 2.0, y: 1.5, w: 1.8, h: 0.35,
      fontSize: 9, bold: true, color: C.ACCENT,
    })
  })

  // Channels data
  const channels = [
    { name: 'APP推送', daily: '50,000', delivery: '98%', open: '12%', convert: '3.2%', cost: '低' },
    { name: '企微消息', daily: '15,000', delivery: '95%', open: '35%', convert: '8.5%', cost: '低' },
    { name: '短信', daily: '30,000', delivery: '99%', open: '5%', convert: '1.8%', cost: '中' },
    { name: '邮件', daily: '10,000', delivery: '92%', open: '18%', convert: '4.2%', cost: '中' },
    { name: 'AI外呼', daily: '2,000', delivery: '85%', open: '45%', convert: '12%', cost: '高' },
  ]
  channels.forEach((ch, ri) => {
    const cells = [ch.name, ch.daily, ch.delivery, ch.open, ch.convert, ch.cost]
    cells.forEach((cell, ci) => {
      s.addText(cell, {
        x: 0.8 + ci * 2.0, y: 1.95 + ri * 0.38, w: 1.8, h: 0.3,
        fontSize: 8, color: ci === 0 ? C.TEXT : C.TEXT_SEC,
      })
    })
  })

  // Trace steps
  s.addText('全链路追踪（8步闭环）', { x: 0.8, y: 4.2, w: 5, h: 0.3, fontSize: 10, bold: true, color: C.ACCENT })
  const steps = ['触发', '策略匹配', '内容生成', '合规审查', '渠道下发', '送达确认', '行为追踪', '效果归因']
  steps.forEach((step, i) => {
    s.addText(step, { x: 0.8 + i * 1.55, y: 4.7, w: 1.3, h: 0.4, fontSize: 9, color: C.TEXT_SEC, align: 'center' })
    if (i < steps.length - 1) {
      s.addText('→', { x: 1.8 + i * 1.55, y: 4.7, w: 0.3, h: 0.4, fontSize: 9, color: C.TEXT_DIM, align: 'center' })
    }
  })

  // Compliance
  const compliance = ['内容合规审查', '频次上限管控', '敏感时段禁推', '客户偏好尊重']
  s.addText('合规管控:', { x: 0.8, y: 5.5, w: 1.5, h: 0.3, fontSize: 9, color: C.TEXT_DIM })
  compliance.forEach((c, i) => {
    s.addText(c, { x: 2.5 + i * 2.5, y: 5.5, w: 2.3, h: 0.3, fontSize: 9, color: C.SUCCESS })
  })
}

// ===== Slide 13: 系统原型展示 =====
function makeSlide13() {
  const s = pptx.addSlide()
  setBg(s)
  addTitle(s, '系统原型展示')
  addPageNum(s, 13)

  // Status
  s.addShape('roundRect', {
    x: 0.8, y: 1.3, w: 2.5, h: 0.35,
    fill: { type: 'solid', color: '0A3828' },
    line: { color: C.SUCCESS, width: 0.8 },
    rectRadius: 0.15,
  })
  s.addText('已完成前端原型开发', {
    x: 0.8, y: 1.3, w: 2.5, h: 0.35,
    fontSize: 9, bold: true, color: C.SUCCESS, align: 'center',
  })

  // Stats
  const stats = [
    { label: '功能页面', value: '11个' },
    { label: '模拟客户', value: '10位 × 13维度' },
    { label: 'MOT规则', value: '18条' },
    { label: '服务策略', value: '8项' },
    { label: '服务任务', value: '33个' },
    { label: '认证系统', value: 'SHA256 + HMAC' },
  ]
  stats.forEach((st, i) => {
    const col = i % 3
    const row = Math.floor(i / 3)
    const x = 0.8 + col * 4.2
    const y = 2.0 + row * 1.5
    addCard(s, x, y, 3.8, 1.2)
    s.addText(st.value, { x: x + 0.3, y: y + 0.15, w: 3.2, h: 0.5, fontSize: 16, bold: true, color: C.ACCENT })
    s.addText(st.label, { x: x + 0.3, y: y + 0.7, w: 3.2, h: 0.3, fontSize: 9, color: C.TEXT_DIM })
  })

  // Screenshots
  const screenshots = ['MOT总览看板', 'AI服务大脑', '客户360画像', '策略画布']
  screenshots.forEach((sc, i) => {
    const x = 0.8 + i * 3.1
    addCard(s, x, 5.2, 2.8, 1.5)
    s.addText(sc, { x: x + 0.3, y: 5.8, w: 2.2, h: 0.3, fontSize: 10, bold: true, color: C.TEXT, align: 'center' })
  })
}

// ===== Slide 14: 实施路径 =====
function makeSlide14() {
  const s = pptx.addSlide()
  setBg(s)
  addTitle(s, '方案演示与下一步计划')
  addPageNum(s, 14)

  // Demos
  const demos = ['CSDP客户画像演示', 'VMOT关键时刻触发演示', '领导决策提意']
  demos.forEach((dm, i) => {
    const x = 0.8 + i * 4.2
    addCard(s, x, 1.5, 3.8, 0.8)
    s.addText(dm, { x: x + 0.3, y: 1.6, w: 3.2, h: 0.5, fontSize: 10, bold: true, color: C.TEXT, align: 'center' })
  })

  // Phases
  const phases = [
    { name: 'P1', title: '业务想法打磨', time: 'X个月', desc: '邀请1-2位业务一线骨干，基于生产业务数据信息和原型重构，形成真实想法方案' },
    { name: 'P2', title: 'AI MVP构建、试点验证', time: 'X个月', desc: '根据公司战略业务方向，使用AI工程计算落地MVP系统，在小范围一线业务试点辅助使用' },
    { name: 'P3', title: '丰富场景、沉淀经验', time: '3个月', desc: '小范围试点、效果评估优化' },
  ]
  phases.forEach((p, i) => {
    const x = 0.8 + i * 4.2
    addCard(s, x, 2.8, 3.8, 2.8, i === 0)
    // Top accent bar
    s.addShape('rect', { x, y: 2.8, w: 3.8, h: 0.06, fill: { type: 'solid', color: i === 0 ? C.ACCENT : C.CARD_BORDER } })
    s.addText(p.name, { x: x + 0.2, y: 3.0, w: 0.6, h: 0.3, fontSize: 9, bold: true, color: C.ACCENT })
    s.addText(p.time, { x: x + 0.9, y: 3.0, w: 1.5, h: 0.3, fontSize: 8, color: C.TEXT_DIM })
    s.addText(p.title, { x: x + 0.2, y: 3.4, w: 3.4, h: 0.35, fontSize: 12, bold: true, color: C.TEXT })
    s.addText(p.desc, { x: x + 0.2, y: 3.9, w: 3.4, h: 1.2, fontSize: 9, color: C.TEXT_SEC, lineSpacingMultiple: 1.3 })
  })

  // Principles & Risks
  addCard(s, 0.8, 6.0, 6.0, 1.0)
  s.addText('实施原则', { x: 1.1, y: 6.1, w: 2, h: 0.25, fontSize: 9, bold: true, color: C.ACCENT })
  s.addText('快速迭代 · MVP快速验证  |  持续优化 · 数据驱动改进', { x: 1.1, y: 6.4, w: 5.5, h: 0.3, fontSize: 8, color: C.TEXT_SEC })

  addCard(s, 7.2, 6.0, 5.3, 1.0)
  s.addText('风险管控', { x: 7.5, y: 6.1, w: 2, h: 0.25, fontSize: 9, bold: true, color: C.YELLOW })
  s.addText('数据安全保障  |  合规性审查  |  效果监控机制', { x: 7.5, y: 6.4, w: 4.8, h: 0.3, fontSize: 8, color: C.TEXT_SEC })
}

// ===== Slide 15: 双赢与支持 =====
function makeSlide15() {
  const s = pptx.addSlide()
  setBg(s)
  addTitle(s, '双赢发展与支持需求')
  addPageNum(s, 15)

  // Customer value
  addCard(s, 0.8, 1.5, 5.8, 3.0)
  s.addText('客户价值', { x: 1.1, y: 1.7, w: 3, h: 0.4, fontSize: 14, bold: true, color: C.ACCENT })
  const cv = ['获得感 · 个性化体验', '体验 · 全旅程服务', '满意度 · 主动精准']
  cv.forEach((v, i) => {
    s.addText(`• ${v}`, { x: 1.3, y: 2.3 + i * 0.5, w: 5, h: 0.4, fontSize: 10, color: C.TEXT_SEC })
  })

  // Enterprise value
  addCard(s, 7.0, 1.5, 5.5, 3.0)
  s.addText('企业价值', { x: 7.3, y: 1.7, w: 3, h: 0.4, fontSize: 14, bold: true, color: C.GOLD })
  const ev = ['品牌 · 差异化优势', '规模 · 客户留存', '效率 · AI赋能']
  ev.forEach((v, i) => {
    s.addText(`• ${v}`, { x: 7.5, y: 2.3 + i * 0.5, w: 5, h: 0.4, fontSize: 10, color: C.TEXT_SEC })
  })

  // Support needs
  s.addText('需要的支持', { x: 0.8, y: 5.0, w: 11.7, h: 0.35, fontSize: 11, bold: true, color: C.ACCENT })
  const support = [
    { title: 'AI模型资源', desc: 'EFundAI 算力支持' },
    { title: 'CSDP数据接口', desc: '数据接口开放' },
    { title: '渠道系统配合', desc: '渠道系统改造' },
    { title: '合规业务指导', desc: '合规部门指导' },
  ]
  support.forEach((sp, i) => {
    const x = 0.8 + i * 3.1
    addCard(s, x, 5.5, 2.8, 1.2)
    s.addText(sp.title, { x: x + 0.2, y: 5.6, w: 2.4, h: 0.35, fontSize: 11, bold: true, color: C.TEXT, align: 'center' })
    s.addText(sp.desc, { x: x + 0.2, y: 6.0, w: 2.4, h: 0.3, fontSize: 9, color: C.TEXT_DIM, align: 'center' })
  })
}

// ===== Slide 16: 结尾 =====
function makeSlide16() {
  const s = pptx.addSlide()
  setBg(s)

  // Glow
  s.addShape('ellipse', {
    x: 4.5, y: 4.5, w: 4.3, h: 4.3,
    fill: { type: 'solid', color: C.BG_FROM },
    line: { color: C.ACCENT, width: 0.5 },
    shadow: { type: 'outer', blur: 30, color: C.ACCENT, opacity: 0.08, offset: 0, angle: 0 },
  })

  s.addText('谢谢', {
    x: 2, y: 2.2, w: 9, h: 1.2,
    fontSize: 54, bold: true, color: C.ACCENT, align: 'center',
  })

  s.addText('期待开启服务新篇章', {
    x: 2, y: 3.5, w: 9, h: 0.5,
    fontSize: 18, bold: true, color: C.TEXT, align: 'center',
  })

  s.addShape('rect', {
    x: 5.7, y: 4.2, w: 2.0, h: 0.03,
    fill: { type: 'solid', color: C.ACCENT },
    rectRadius: 0.01,
  })

  s.addText('AI赋能客户服务，从"客户找服务"到"服务找客户"', {
    x: 2, y: 4.5, w: 9, h: 0.4,
    fontSize: 11, color: C.TEXT_SEC, align: 'center',
  })

  s.addText('实现客户价值与企业价值的双赢', {
    x: 2, y: 5.1, w: 9, h: 0.3,
    fontSize: 10, color: C.TEXT_DIM, align: 'center',
  })

  addPageNum(s, 16)
}

// ===== 主函数 =====
async function main() {
  makeSlide01()
  makeSlide02()
  makeSlide03()
  makeSlide04()
  makeSlide05()
  makeSlide06()
  makeSlide07()
  makeSlide08()
  makeSlide09()
  makeSlide10()
  makeSlide11()
  makeSlide12()
  makeSlide13()
  makeSlide14()
  makeSlide15()
  makeSlide16()

  const outPath = 'public/presentation-v2.pptx'
  await pptx.writeFile({ fileName: outPath })
  console.log(`PPT V2 生成成功: ${outPath}`)

  // Also save to docs
  const docsPath = 'docs/科学化客户服务思考汇报v3.pptx'
  await pptx.writeFile({ fileName: docsPath })
  console.log(`PPT V2 副本: ${docsPath}`)
}

main().catch(console.error)
