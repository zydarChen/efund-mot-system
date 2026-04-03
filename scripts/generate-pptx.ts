/**
 * VMOT 领导汇报 PPT 生成脚本
 * 使用 PptxGenJS 生成 .pptx 文件
 * 数据来源: src/presentation/data/slideContent.ts
 *
 * 运行: npx tsx scripts/generate-pptx.ts
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

// ===== 工具函数 =====
function setGradientBg(slide: Slide) {
  slide.background = { color: C.BG_FROM }
  // Add a subtle overlay rectangle for gradient feel
  slide.addShape('rect', {
    x: 0, y: 0, w: '100%', h: '100%',
    fill: { type: 'solid', color: C.BG_FROM },
  })
}

function addPageNum(slide: Slide, n: number) {
  slide.addText(`${String(n).padStart(2, '0')} / 15`, {
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
pptx.author = '陈泽濠'
pptx.company = '易方达基金管理有限公司'
pptx.subject = 'VMOT 客户高价值服务管理系统建设方案汇报'
pptx.title = 'VMOT 建设方案汇报'

// ===== Slide 1: 封面 =====
function makeSlide01() {
  const s = pptx.addSlide()
  setGradientBg(s)

  // Decorative ring
  s.addShape('ellipse', {
    x: 8.5, y: 0.5, w: 5, h: 5,
    line: { color: C.ACCENT, width: 1.5 },
    fill: { type: 'solid', color: C.BG_FROM },
    shadow: { type: 'outer', blur: 20, color: C.ACCENT, opacity: 0.1, offset: 0, angle: 0 },
  })

  // Accent line
  s.addShape('rect', {
    x: 6.2, y: 2.0, w: 1.0, h: 0.05,
    fill: { type: 'solid', color: C.ACCENT },
    rectRadius: 0.02,
  })

  // Title
  s.addText('VMOT', {
    x: 2, y: 2.2, w: 9, h: 1.0,
    fontSize: 54, bold: true, color: C.ACCENT, align: 'center',
  })
  s.addText('客户高价值服务管理系统', {
    x: 2, y: 3.1, w: 9, h: 0.6,
    fontSize: 24, bold: true, color: C.TEXT, align: 'center',
  })
  s.addText('建设方案汇报', {
    x: 2, y: 3.65, w: 9, h: 0.5,
    fontSize: 18, color: C.ACCENT, align: 'center',
  })

  // Motto
  s.addText('"在每一个关键时刻，让服务触达客户内心"', {
    x: 2, y: 4.5, w: 9, h: 0.4,
    fontSize: 11, italic: true, color: C.TEXT_DIM, align: 'center',
  })

  // Info
  s.addText('陈泽濠  |  金融科技部 · 客服产研团队  |  2026年4月', {
    x: 2, y: 5.5, w: 9, h: 0.3,
    fontSize: 10, color: C.TEXT_DIM, align: 'center',
  })
  s.addText('易方达基金管理有限公司', {
    x: 2, y: 5.9, w: 9, h: 0.3,
    fontSize: 9, color: C.TEXT_DIM, align: 'center',
  })
}

// ===== Slide 2: 目录 =====
function makeSlide02() {
  const s = pptx.addSlide()
  setGradientBg(s)
  addTitle(s, '汇报大纲')
  addPageNum(s, 2)

  const sections = [
    { part: '一、背景与挑战', items: ['01  行业变革趋势', '02  公司战略方向', '03  团队沉淀基础', '04  现存痛点分析'] },
    { part: '二、方案设计', items: ['05  目标愿景', '06  系统架构与核心功能'] },
    { part: '三、实施与展望', items: ['07  原型展示与建设规划', '08  总结展望'] },
  ]

  let xPos = 0.8
  sections.forEach((sec) => {
    const colW = 3.7
    s.addText(sec.part, {
      x: xPos, y: 1.5, w: colW, h: 0.4,
      fontSize: 12, bold: true, color: C.ACCENT,
    })
    s.addShape('rect', {
      x: xPos, y: 1.9, w: colW, h: 0.01,
      fill: { type: 'solid', color: C.CARD_BORDER },
    })
    sec.items.forEach((item, i) => {
      s.addText(item, {
        x: xPos, y: 2.1 + i * 0.55, w: colW, h: 0.4,
        fontSize: 11, color: C.TEXT_SEC,
      })
    })
    xPos += colW + 0.6
  })
}

// ===== Slide 3: 行业背景 =====
function makeSlide03() {
  const s = pptx.addSlide()
  setGradientBg(s)
  addTitle(s, '资管行业客户服务变革趋势')
  addPageNum(s, 3)

  const cards = [
    { num: '01', title: '客户变了', desc: '新生代投资者线上投资习惯深刻改变', details: '地缘政治敏感、社交化投资行为' },
    { num: '02', title: '监管变了', desc: '"以客户为中心"高质量发展要求', details: '适当性管理趋严、投资者保护加大' },
    { num: '03', title: '技术变了', desc: 'AI大模型技术爆发', details: '情绪分析、智能话术、合规自动审查' },
  ]

  cards.forEach((card, i) => {
    const x = 0.8 + i * 4.0
    addCard(s, x, 1.5, 3.6, 3.5)
    // Num circle
    s.addShape('ellipse', {
      x: x + 0.3, y: 1.8, w: 0.5, h: 0.5,
      fill: { type: 'solid', color: C.ACCENT },
    })
    s.addText(card.num, {
      x: x + 0.3, y: 1.8, w: 0.5, h: 0.5,
      fontSize: 12, bold: true, color: C.BG_FROM, align: 'center', valign: 'middle',
    })
    s.addText(card.title, {
      x: x + 1.0, y: 1.85, w: 2.3, h: 0.4,
      fontSize: 16, bold: true, color: C.TEXT,
    })
    s.addText(card.desc, {
      x: x + 0.3, y: 2.6, w: 3.0, h: 0.7,
      fontSize: 11, color: C.TEXT_SEC,
    })
    s.addText(card.details, {
      x: x + 0.3, y: 3.4, w: 3.0, h: 0.7,
      fontSize: 9, color: C.TEXT_DIM,
    })
  })

  s.addText('行业竞争从"产品驱动"转向"服务驱动"，头部机构纷纷布局MOT客户关键时刻服务', {
    x: 0.8, y: 5.5, w: 11.7, h: 0.4,
    fontSize: 11, italic: true, color: C.ACCENT, align: 'center',
  })
}

// ===== Slide 4: 公司战略 =====
function makeSlide04() {
  const s = pptx.addSlide()
  setGradientBg(s)
  addTitle(s, '零售业务三大方向与金科使命')
  addPageNum(s, 4)

  const dirs = [
    { title: '销售服务', desc: '总分公司销售服务数字化', hl: false },
    { title: '营销服务', desc: '线上化产品营销服务智能化', hl: false },
    { title: '客户服务', desc: '线上化客户运营服务精细化', hl: true },
  ]

  dirs.forEach((d, i) => {
    const y = 1.5 + i * 1.3
    addCard(s, 0.8, y, 5.5, 1.1, d.hl)
    s.addShape('rect', {
      x: 1.0, y: y + 0.2, w: 0.06, h: 0.7,
      fill: { type: 'solid', color: d.hl ? C.ACCENT : C.TEXT_DIM },
      rectRadius: 0.03,
    })
    s.addText(d.title + (d.hl ? '  ← 我们的主战场' : ''), {
      x: 1.3, y: y + 0.15, w: 4.5, h: 0.4,
      fontSize: 14, bold: true, color: d.hl ? C.ACCENT : C.TEXT,
    })
    s.addText(d.desc, {
      x: 1.3, y: y + 0.55, w: 4.5, h: 0.35,
      fontSize: 10, color: C.TEXT_SEC,
    })
  })

  // Right: Mission
  addCard(s, 7.0, 1.5, 5.5, 4.0)
  s.addText('金科使命', {
    x: 7.3, y: 1.7, w: 4.5, h: 0.35,
    fontSize: 11, bold: true, color: C.ACCENT,
  })
  s.addText('金科定位：公司大中台，受理各板块需求\n核心使命：为业务线提供AI技术赋能', {
    x: 7.3, y: 2.2, w: 4.9, h: 0.8,
    fontSize: 10, color: C.TEXT_SEC,
  })
  const keyPoints = ['不仅是AI技术探索', '本质是未来业务商业逻辑的变化', '建立新的业务竞争壁垒']
  keyPoints.forEach((p, i) => {
    s.addText(`▶  ${p}`, {
      x: 7.3, y: 3.3 + i * 0.45, w: 4.9, h: 0.35,
      fontSize: 11, color: C.TEXT,
    })
  })
}

// ===== Slide 5: 团队沉淀 =====
function makeSlide05() {
  const s = pptx.addSlide()
  setGradientBg(s)
  addTitle(s, '过去的探索与成果')
  s.addText('从寥寥数人 → 10多人的专业产研团队', {
    x: 0.8, y: 1.0, w: 11, h: 0.3,
    fontSize: 11, color: C.TEXT_SEC,
  })
  addPageNum(s, 5)

  const items = [
    { title: '投资者之家', desc: '整体业务开展' },
    { title: '智能客服小易', desc: '客服知识库智能化升级' },
    { title: '社区陪伴服务', desc: '自动回复率37.6% | 通过率95.6%' },
    { title: '易服务', desc: '线上服务平台' },
    { title: '易陪伴', desc: '客户陪伴服务体系' },
    { title: '数字人工厂', desc: '3000+图文 | 500+视频' },
  ]

  items.forEach((it, i) => {
    const col = i % 3
    const row = Math.floor(i / 3)
    const x = 0.8 + col * 4.0
    const y = 1.7 + row * 2.1
    addCard(s, x, y, 3.6, 1.8)
    s.addText(it.title, {
      x: x + 0.3, y: y + 0.3, w: 3.0, h: 0.4,
      fontSize: 13, bold: true, color: C.TEXT,
    })
    s.addText(it.desc, {
      x: x + 0.3, y: y + 0.8, w: 3.0, h: 0.6,
      fontSize: 10, color: C.ACCENT,
    })
  })

  s.addText('"想走得更远一点、更超前一点，让团队发展得更好一些"', {
    x: 0.8, y: 6.2, w: 11.7, h: 0.4,
    fontSize: 11, italic: true, color: C.GOLD, align: 'center',
  })
}

// ===== Slide 6: 痛点分析 =====
function makeSlide06() {
  const s = pptx.addSlide()
  setGradientBg(s)
  addTitle(s, '当前客户服务面临的六大挑战')
  addPageNum(s, 6)

  const points = [
    { num: '01', title: '服务被动', desc: '客户遇到问题才来找服务', impact: '错过最佳服务时机', color: C.RED },
    { num: '02', title: '千人一面', desc: '统一话术/内容群发', impact: '客户感知差，转化低', color: C.ORANGE },
    { num: '03', title: '洞察不足', desc: '单一维度客户标签', impact: '无法精准理解需求', color: C.YELLOW },
    { num: '04', title: '效率低下', desc: '人工逐一处理任务', impact: '人力成本高，响应慢', color: C.YELLOW },
    { num: '05', title: '策略滞后', desc: '事后补救，被动应对', impact: '缺乏实时感知能力', color: C.TEXT_DIM },
    { num: '06', title: '缺乏闭环', desc: '发送后无法追踪', impact: '无法评估优化服务', color: C.TEXT_DIM },
  ]

  points.forEach((p, i) => {
    const col = i % 3
    const row = Math.floor(i / 3)
    const x = 0.8 + col * 4.0
    const y = 1.5 + row * 2.2
    addCard(s, x, y, 3.6, 1.9)
    s.addText(p.num, { x: x + 0.3, y: y + 0.2, w: 0.6, h: 0.4, fontSize: 16, bold: true, color: p.color })
    s.addText(p.title, { x: x + 0.9, y: y + 0.2, w: 2.4, h: 0.4, fontSize: 14, bold: true, color: C.TEXT })
    s.addText(p.desc, { x: x + 0.3, y: y + 0.7, w: 3.0, h: 0.35, fontSize: 10, color: C.TEXT_SEC })
    s.addText(`→ ${p.impact}`, { x: x + 0.3, y: y + 1.15, w: 3.0, h: 0.35, fontSize: 9, color: p.color })
  })

  addCard(s, 0.8, 5.8, 11.7, 0.6, true)
  s.addText('服务的主动性、个性化和智能化程度远不能满足新时代客户的期望', {
    x: 0.8, y: 5.85, w: 11.7, h: 0.5,
    fontSize: 11, color: C.ACCENT, align: 'center', valign: 'middle',
  })
}

// ===== Slide 7: 目标愿景 =====
function makeSlide07() {
  const s = pptx.addSlide()
  setGradientBg(s)
  addTitle(s, '从"客户找服务"到"服务找客户"')
  addPageNum(s, 7)

  // Traditional
  addCard(s, 0.8, 1.5, 4.5, 2.8)
  s.addText('传统模式', { x: 1.0, y: 1.6, w: 4.0, h: 0.35, fontSize: 10, bold: true, color: C.TEXT_DIM })
  const tradSteps = ['客户遇到问题', '客户主动联系', '客服被动响应', '通用话术回复']
  tradSteps.forEach((st, i) => {
    s.addText(`${i + 1}  ${st}`, { x: 1.2, y: 2.1 + i * 0.5, w: 3.8, h: 0.4, fontSize: 11, color: C.TEXT_SEC })
  })

  // Arrow
  s.addText('→', { x: 5.6, y: 2.5, w: 0.8, h: 0.6, fontSize: 28, bold: true, color: C.ACCENT, align: 'center' })

  // VMOT
  addCard(s, 6.8, 1.5, 5.7, 2.8, true)
  s.addText('VMOT 模式', { x: 7.0, y: 1.6, w: 5.0, h: 0.35, fontSize: 10, bold: true, color: C.ACCENT })
  const vmotSteps = ['系统识别关键时刻', 'AI 分析客户画像', '智能推荐服务策略', '个性化千人千面触达']
  vmotSteps.forEach((st, i) => {
    s.addText(`${i + 1}  ${st}`, { x: 7.2, y: 2.1 + i * 0.5, w: 5.0, h: 0.4, fontSize: 11, color: C.TEXT })
  })

  // Concept
  s.addText('MOT — Moment of Truth（关键时刻）', {
    x: 0.8, y: 4.5, w: 11.7, h: 0.35, fontSize: 12, bold: true, color: C.ACCENT, align: 'center',
  })

  // KPIs
  const kpis = [
    { label: '服务主动触达率', from: '<10%', to: '60%' },
    { label: '客户满意度', from: '78分', to: '90分' },
    { label: '客户留存率', from: '89%', to: '96%' },
    { label: '服务响应时间', from: '>24h', to: '<2h' },
  ]
  kpis.forEach((kpi, i) => {
    const x = 0.8 + i * 3.1
    addCard(s, x, 5.2, 2.8, 1.5)
    s.addText(kpi.to, { x, y: 5.3, w: 2.8, h: 0.6, fontSize: 24, bold: true, color: C.ACCENT, align: 'center' })
    s.addText(kpi.label, { x, y: 5.9, w: 2.8, h: 0.3, fontSize: 10, color: C.TEXT, align: 'center' })
    s.addText(`${kpi.from} → ${kpi.to}`, { x, y: 6.2, w: 2.8, h: 0.25, fontSize: 8, color: C.TEXT_DIM, align: 'center' })
  })
}

// ===== Slide 8: 方案概述 =====
function makeSlide08() {
  const s = pptx.addSlide()
  setGradientBg(s)
  addTitle(s, 'VMOT 系统定位 — AI 大脑的核心器官')
  addPageNum(s, 8)

  // Brain ring
  s.addShape('ellipse', {
    x: 4.2, y: 1.5, w: 5, h: 3.2,
    line: { color: C.ACCENT, width: 1.5 },
    fill: { type: 'solid', color: C.BG_FROM },
    shadow: { type: 'outer', blur: 15, color: C.ACCENT, opacity: 0.12, offset: 0, angle: 0 },
  })
  s.addText('AI 大脑', { x: 4.2, y: 1.3, w: 5, h: 0.4, fontSize: 10, bold: true, color: C.ACCENT, align: 'center' })

  // CSDP
  addCard(s, 4.8, 2.2, 2.0, 1.6)
  s.addText('CSDP', { x: 4.8, y: 2.3, w: 2.0, h: 0.4, fontSize: 14, bold: true, color: C.ACCENT, align: 'center' })
  s.addText('客户综合信息管理\n(数据汇聚)', { x: 4.8, y: 2.7, w: 2.0, h: 0.8, fontSize: 8, color: C.TEXT_SEC, align: 'center' })

  // VMOT
  addCard(s, 7.2, 2.2, 2.0, 1.6, true)
  s.addText('VMOT', { x: 7.2, y: 2.3, w: 2.0, h: 0.4, fontSize: 14, bold: true, color: C.ACCENT, align: 'center' })
  s.addText('高价值MOT服务\n(决策执行)', { x: 7.2, y: 2.7, w: 2.0, h: 0.8, fontSize: 8, color: C.TEXT_SEC, align: 'center' })

  // Channels
  const channels = ['APP推送', '短信', '邮件', '电话', '企微', '社区']
  channels.forEach((ch, i) => {
    const x = 2.7 + i * 1.4
    s.addShape('roundRect', {
      x, y: 5.3, w: 1.2, h: 0.5,
      fill: { type: 'solid', color: C.CARD },
      line: { color: C.CARD_BORDER, width: 0.5 },
      rectRadius: 0.15,
    })
    s.addText(ch, { x, y: 5.3, w: 1.2, h: 0.5, fontSize: 8, color: C.TEXT_SEC, align: 'center', valign: 'middle' })
  })

  // Flow
  const flow = ['感知', '决策', '执行', '追踪']
  flow.forEach((step, i) => {
    const x = 3.2 + i * 2.0
    s.addShape('roundRect', {
      x, y: 6.2, w: 1.0, h: 0.8,
      fill: { type: 'solid', color: C.CARD },
      line: { color: C.CARD_BORDER, width: 0.5 },
      rectRadius: 0.08,
    })
    s.addText(step, { x, y: 6.2, w: 1.0, h: 0.8, fontSize: 11, bold: true, color: C.ACCENT, align: 'center', valign: 'middle' })
    if (i < 3) {
      s.addText('→', { x: x + 1.1, y: 6.35, w: 0.5, h: 0.4, fontSize: 14, color: C.ACCENT, align: 'center' })
    }
  })
}

// ===== Slide 9: 系统架构 =====
function makeSlide09() {
  const s = pptx.addSlide()
  setGradientBg(s)
  addTitle(s, '五大功能模块')
  addPageNum(s, 9)

  const modules = [
    { name: 'MOT 总览', features: ['智能看板', 'AI服务大脑', '任务聚合'] },
    { name: '客户 360', features: ['13维度画像', '客群管理', '生命周期追踪'] },
    { name: '策略中心', features: ['策略CRUD', '可视化画布', '效果模拟'] },
    { name: '策略挖掘', features: ['客户之声', '舆情', '政策', '行情'] },
    { name: '触达中心', features: ['渠道管理', '内容工厂', '管控', '追踪'] },
  ]

  modules.forEach((mod, i) => {
    const x = 0.5 + i * 2.5
    addCard(s, x, 1.5, 2.3, 4.0)
    s.addText(mod.name, { x, y: 1.7, w: 2.3, h: 0.5, fontSize: 13, bold: true, color: C.TEXT, align: 'center' })
    mod.features.forEach((f, fi) => {
      s.addShape('roundRect', {
        x: x + 0.2, y: 2.5 + fi * 0.55, w: 1.9, h: 0.4,
        fill: { type: 'solid', color: '0D2137' },
        rectRadius: 0.05,
      })
      s.addText(f, { x: x + 0.2, y: 2.5 + fi * 0.55, w: 1.9, h: 0.4, fontSize: 9, color: C.TEXT_SEC, align: 'center', valign: 'middle' })
    })
  })

  s.addText('+ 系统设置（基础配置 / 合规风控 / 数据统计）', {
    x: 0.8, y: 5.8, w: 11.7, h: 0.3, fontSize: 9, color: C.TEXT_DIM, align: 'center',
  })

  const techStack = ['React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Recharts']
  techStack.forEach((t, i) => {
    const x = 3.5 + i * 1.4
    s.addShape('roundRect', {
      x, y: 6.3, w: 1.2, h: 0.4,
      fill: { type: 'solid', color: C.CARD },
      line: { color: C.CARD_BORDER, width: 0.5 },
      rectRadius: 0.1,
    })
    s.addText(t, { x, y: 6.3, w: 1.2, h: 0.4, fontSize: 8, color: C.TEXT_SEC, align: 'center', valign: 'middle' })
  })
}

// ===== Slide 10: 核心功能1 =====
function makeSlide10() {
  const s = pptx.addSlide()
  setGradientBg(s)
  addTitle(s, 'MOT 智能看板 + AI 服务大脑')
  addPageNum(s, 10)

  const features = [
    { title: '智能聚合', desc: '同规则×同客群自动聚合，支持批量操作\n例：基金净值回撤 × 积极交易型 → 3位客户聚合为1组' },
    { title: 'AI 服务大脑', desc: '三栏式决策界面\n左栏: 客户360卡片  |  中栏: AI建议  |  右栏: 执行操作' },
    { title: '合规前置审核', desc: '敏感词检测 → 适当性匹配 → 频率控制\n通过 / 需审核 / 拦截 三级状态' },
  ]

  features.forEach((f, i) => {
    const x = 0.8 + i * 4.0
    addCard(s, x, 1.5, 3.6, 2.8)
    s.addText(f.title, { x: x + 0.3, y: 1.7, w: 3.0, h: 0.35, fontSize: 13, bold: true, color: C.ACCENT })
    s.addText(f.desc, { x: x + 0.3, y: 2.2, w: 3.0, h: 1.8, fontSize: 9, color: C.TEXT_SEC })
  })

  const kpis = [
    { label: '今日MOT触发', value: '3,456' },
    { label: 'AI建议', value: '8条' },
    { label: '待处理任务', value: '23' },
    { label: 'MOT规则', value: '18条' },
  ]
  kpis.forEach((kpi, i) => {
    const x = 0.8 + i * 3.1
    addCard(s, x, 4.8, 2.8, 1.5)
    s.addText(kpi.value, { x, y: 4.9, w: 2.8, h: 0.6, fontSize: 22, bold: true, color: C.ACCENT, align: 'center' })
    s.addText(kpi.label, { x, y: 5.5, w: 2.8, h: 0.3, fontSize: 10, color: C.TEXT_SEC, align: 'center' })
  })
}

// ===== Slide 11: 核心功能2 =====
function makeSlide11() {
  const s = pptx.addSlide()
  setGradientBg(s)
  addTitle(s, '客户 360 画像 + 策略挖掘')
  addPageNum(s, 11)

  // Dimensions grid
  const dims = [
    ['资产概览', '行为分析', '社区画像', '投资能力'],
    ['内容消费', '服务互动', '渠道偏好', '生活事件'],
    ['社交关系', '持仓详情', '交易记录', '风险等级'],
  ]
  s.addText('13维度全景分析', { x: 0.8, y: 1.5, w: 5, h: 0.3, fontSize: 10, bold: true, color: C.ACCENT })
  dims.forEach((row, ri) => {
    row.forEach((dim, di) => {
      const x = 0.8 + di * 1.5
      const y = 1.9 + ri * 0.55
      s.addShape('roundRect', {
        x, y, w: 1.35, h: 0.45,
        fill: { type: 'solid', color: C.CARD },
        line: { color: C.CARD_BORDER, width: 0.5 },
        rectRadius: 0.05,
      })
      s.addText(dim, { x, y, w: 1.35, h: 0.45, fontSize: 8, color: C.TEXT_SEC, align: 'center', valign: 'middle' })
    })
  })

  // Segments
  const segs = [
    { name: '稳健价值型', pct: '35%', color: C.PRIMARY },
    { name: '积极交易型', pct: '30%', color: C.ACCENT },
    { name: '新手小白型', pct: '35%', color: C.GOLD },
  ]
  s.addText('3大客群', { x: 7.5, y: 1.5, w: 4, h: 0.3, fontSize: 10, bold: true, color: C.ACCENT })
  segs.forEach((seg, i) => {
    const y = 1.9 + i * 0.7
    addCard(s, 7.5, y, 4.8, 0.55)
    s.addShape('ellipse', { x: 7.7, y: y + 0.1, w: 0.35, h: 0.35, fill: { type: 'solid', color: seg.color } })
    s.addText(seg.name, { x: 8.2, y, w: 2.0, h: 0.55, fontSize: 10, color: C.TEXT, valign: 'middle' })
    s.addText(seg.pct, { x: 10.5, y, w: 1.5, h: 0.55, fontSize: 16, bold: true, color: seg.color, valign: 'middle', align: 'right' })
  })

  // Mining
  s.addText('策略挖掘 — 四维度外部感知', { x: 0.8, y: 4.3, w: 11, h: 0.3, fontSize: 10, bold: true, color: C.ACCENT })
  const mining = ['客户之声', '市场舆情', '政策变化', '行情分析']
  mining.forEach((m, i) => {
    const x = 0.8 + i * 3.1
    addCard(s, x, 4.8, 2.8, 1.2)
    s.addText(m, { x, y: 4.9, w: 2.8, h: 0.9, fontSize: 12, bold: true, color: C.TEXT, align: 'center', valign: 'middle' })
  })
  s.addText('↓ AI 自动推荐新的 MOT 规则和服务策略', {
    x: 0.8, y: 6.2, w: 11.7, h: 0.3, fontSize: 10, color: C.ACCENT, align: 'center',
  })
}

// ===== Slide 12: 核心功能3 =====
function makeSlide12() {
  const s = pptx.addSlide()
  setGradientBg(s)
  addTitle(s, '多渠道触达 + 全链路追踪')
  addPageNum(s, 12)

  // Channel table
  const headers = ['渠道', '日均量', '送达率', '打开率', '转化率', '成本']
  const rows = [
    ['APP推送', '45,600', '98%', '68-88%', '32-72%', '0.01元'],
    ['短信', '24,800', '99%', '45%', '22%', '0.08元'],
    ['邮件', '9,700', '95%', '72-85%', '28%', '0.02元'],
    ['客服电话', '580', '100%', '100%', '65%', '5.00元'],
    ['企微', '12,300', '97%', '82%', '48%', '0.00元'],
  ]

  const tableW = 11.7
  const colW = tableW / 6
  headers.forEach((h, i) => {
    s.addText(h, { x: 0.8 + i * colW, y: 1.5, w: colW, h: 0.4, fontSize: 9, bold: true, color: C.ACCENT })
  })
  rows.forEach((row, ri) => {
    row.forEach((cell, ci) => {
      s.addText(cell, { x: 0.8 + ci * colW, y: 1.95 + ri * 0.42, w: colW, h: 0.4, fontSize: 9, color: ci === 0 ? C.TEXT : C.TEXT_SEC })
    })
  })

  // Trace steps
  s.addText('全链路追踪（8步闭环）', { x: 0.8, y: 4.3, w: 11, h: 0.3, fontSize: 10, bold: true, color: C.ACCENT })
  const steps = [
    { label: '触发', time: '12ms' }, { label: '匹配', time: '45ms' },
    { label: '过滤', time: '23ms' }, { label: '生成', time: '156ms' },
    { label: '路由', time: '8ms' }, { label: '投递', time: '342ms' },
    { label: '打开', time: '~1h' }, { label: '转化', time: '~2h' },
  ]
  steps.forEach((st, i) => {
    const x = 0.8 + i * 1.55
    s.addShape('roundRect', {
      x, y: 4.8, w: 1.2, h: 0.8,
      fill: { type: 'solid', color: C.CARD },
      line: { color: C.CARD_BORDER, width: 0.5 },
      rectRadius: 0.08,
    })
    s.addText(st.label, { x, y: 4.8, w: 1.2, h: 0.5, fontSize: 10, bold: true, color: C.ACCENT, align: 'center' })
    s.addText(st.time, { x, y: 5.25, w: 1.2, h: 0.3, fontSize: 7, color: C.TEXT_DIM, align: 'center' })
    if (i < 7) {
      s.addText('→', { x: x + 1.2, y: 4.9, w: 0.35, h: 0.5, fontSize: 10, color: C.CARD_BORDER, align: 'center' })
    }
  })

  // Compliance
  const compliance = ['敏感词检测', '适当性匹配', '频率控制', '时间窗口', '人工审核']
  s.addText('合规管控:', { x: 0.8, y: 6.0, w: 1.2, h: 0.4, fontSize: 9, color: C.TEXT_DIM })
  compliance.forEach((c, i) => {
    s.addShape('roundRect', {
      x: 2.2 + i * 1.8, y: 6.05, w: 1.5, h: 0.35,
      fill: { type: 'solid', color: '0D2A20' },
      rectRadius: 0.15,
    })
    s.addText(c, { x: 2.2 + i * 1.8, y: 6.05, w: 1.5, h: 0.35, fontSize: 8, color: C.SUCCESS, align: 'center', valign: 'middle' })
  })
}

// ===== Slide 13: 原型展示 =====
function makeSlide13() {
  const s = pptx.addSlide()
  setGradientBg(s)
  addTitle(s, '系统原型展示')
  addPageNum(s, 13)

  const screenshots = ['MOT总览看板', 'AI服务大脑', '客户360画像', '策略画布']
  screenshots.forEach((ss, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = 0.8 + col * 6.2
    const y = 1.5 + row * 2.3
    addCard(s, x, y, 5.8, 2.0)
    s.addText(ss, { x, y, w: 5.8, h: 2.0, fontSize: 14, color: C.ACCENT, align: 'center', valign: 'middle' })
  })

  // Stats
  addCard(s, 0.8, 6.0, 11.7, 0.8, true)
  s.addText('✓ 已完成前端原型开发', {
    x: 0.8, y: 6.0, w: 11.7, h: 0.35, fontSize: 11, bold: true, color: C.SUCCESS, align: 'center',
  })
  const stats = ['11个页面', '10位客户×13维度', '18条规则', '8项策略', '33个任务', 'SHA256+HMAC']
  s.addText(stats.join('    |    '), {
    x: 0.8, y: 6.35, w: 11.7, h: 0.35, fontSize: 9, color: C.TEXT_SEC, align: 'center',
  })
}

// ===== Slide 14: 实施路径 =====
function makeSlide14() {
  const s = pptx.addSlide()
  setGradientBg(s)
  addTitle(s, '分阶段建设规划')
  addPageNum(s, 14)

  // Timeline line
  s.addShape('rect', { x: 1.5, y: 2.3, w: 10.5, h: 0.03, fill: { type: 'solid', color: C.CARD_BORDER } })

  const phases = [
    { name: 'Phase 1', title: '前端MVP', time: 'Q1 2026 | 4周', items: ['核心UI + 交互验证', 'Mock数据驱动'], done: true },
    { name: 'Phase 2', title: '后端对接', time: 'Q2 2026 | 8周', items: ['RESTful API', '数据库建模', '实时推送'], done: false },
    { name: 'Phase 3', title: 'AI能力建设', time: 'Q3 2026 | 8周', items: ['情绪分析模型', '智能话术生成', '合规审查'], done: false },
    { name: 'Phase 4', title: '数据打通', time: 'Q3-Q4 | 8周', items: ['CSDP接入', '社区数据', '渠道对接'], done: false },
    { name: 'Phase 5', title: '试运营', time: 'Q4 2026', items: ['灰度发布', '效果评估', '持续优化'], done: false },
  ]

  phases.forEach((ph, i) => {
    const x = 1.3 + i * 2.2
    // Node
    s.addShape('ellipse', {
      x: x + 0.35, y: 1.95, w: 0.7, h: 0.7,
      fill: { type: 'solid', color: ph.done ? C.ACCENT : C.CARD },
      line: { color: ph.done ? C.ACCENT : C.CARD_BORDER, width: 1.5 },
      shadow: ph.done ? { type: 'outer', blur: 10, color: C.ACCENT, opacity: 0.25, offset: 0, angle: 0 } : undefined,
    })
    s.addText(ph.done ? '✓' : ph.name.replace('Phase ', 'P'), {
      x: x + 0.35, y: 1.95, w: 0.7, h: 0.7,
      fontSize: 10, bold: true, color: ph.done ? C.BG_FROM : C.TEXT_SEC, align: 'center', valign: 'middle',
    })
    // Card
    addCard(s, x, 3.0, 2.0, 3.2, ph.done)
    s.addText(ph.title, {
      x, y: 3.1, w: 2.0, h: 0.4, fontSize: 12, bold: true,
      color: ph.done ? C.ACCENT : C.TEXT, align: 'center',
    })
    s.addText(ph.time, { x, y: 3.5, w: 2.0, h: 0.3, fontSize: 8, color: C.TEXT_DIM, align: 'center' })
    ph.items.forEach((item, ii) => {
      s.addText(item, { x: x + 0.15, y: 3.9 + ii * 0.35, w: 1.7, h: 0.3, fontSize: 8, color: C.TEXT_SEC })
    })
    if (ph.done) {
      s.addText('已完成 ✓', { x, y: 5.5, w: 2.0, h: 0.3, fontSize: 9, bold: true, color: C.SUCCESS, align: 'center' })
    }
  })
}

// ===== Slide 15: 总结与展望 =====
function makeSlide15() {
  const s = pptx.addSlide()
  setGradientBg(s)
  addTitle(s, '总结与展望')
  addPageNum(s, 15)

  s.addText(
    '建立符合未来投资者客户社会属性变化的、\n发挥公司已有业务能力优势、\n能够构造新业务竞争优势的、\n非传统人力模式的客户服务体系。',
    { x: 1.5, y: 1.5, w: 10, h: 1.6, fontSize: 13, color: C.TEXT_SEC, align: 'center', lineSpacingMultiple: 1.5 }
  )

  // Win-win
  addCard(s, 2.5, 3.3, 3.8, 1.8)
  s.addText('客户端', { x: 2.5, y: 3.4, w: 3.8, h: 0.4, fontSize: 11, bold: true, color: C.ACCENT, align: 'center' })
  s.addText('获得感提升\n满意度 90+\n留存率 96%+', { x: 2.5, y: 3.8, w: 3.8, h: 1.0, fontSize: 10, color: C.TEXT_SEC, align: 'center' })

  addCard(s, 7.0, 3.3, 3.8, 1.8)
  s.addText('公司端', { x: 7.0, y: 3.4, w: 3.8, h: 0.4, fontSize: 11, bold: true, color: C.GOLD, align: 'center' })
  s.addText('品牌认可\n规模增长\n降本增效', { x: 7.0, y: 3.8, w: 3.8, h: 1.0, fontSize: 10, color: C.TEXT_SEC, align: 'center' })

  // Support
  s.addText('需要的支持', { x: 0.8, y: 5.4, w: 11.7, h: 0.3, fontSize: 9, color: C.TEXT_DIM, align: 'center' })
  const support = ['AI 模型资源\nEFundAI 算力支持', 'CSDP 数据接口\n数据接口开放', '渠道系统配合\n渠道系统改造', '合规业务指导\n合规部门指导']
  support.forEach((sp, i) => {
    s.addText(sp, { x: 1.5 + i * 2.8, y: 5.8, w: 2.5, h: 0.8, fontSize: 9, color: C.TEXT_SEC, align: 'center' })
  })

  // Closing
  s.addText('感谢聆听！', {
    x: 2, y: 6.6, w: 9, h: 0.6, fontSize: 28, bold: true, color: C.ACCENT, align: 'center',
  })
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

  const outPath = 'docs/VMOT领导汇报PPT_v2.pptx'
  await pptx.writeFile({ fileName: outPath })
  console.log(`PPT 生成成功: ${outPath}`)
}

main().catch(console.error)
