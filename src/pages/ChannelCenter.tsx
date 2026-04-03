// 易方达 MOT 系统 - 触达中心
// 来源：ICP-MOT消息推送平台 + 玄武ICC通信平台 + 广发博时数字化营销方案
// 三大功能：渠道管理 | 内容工厂 | 消息管控

import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Send, Layers, ShieldCheck, GitBranch,
  Smartphone, MessageSquare, Zap, Mail, Phone, MessagesSquare, Video, Globe, Brain,
  ArrowRight, ChevronDown, ChevronUp, CheckCircle2, Clock, XCircle, AlertTriangle,
  FileText, Tag, Filter, ToggleLeft, ToggleRight, Eye, Copy, TrendingUp,
  ArrowDownRight, Shield, Search, BarChart3, ChevronRight,
  Activity, MousePointer, ShoppingCart,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, Cell } from 'recharts'
import { deliveryChannels, routingRules, contentTemplates, messageControlRules, channelTrends, motInstances, conversionFunnelData } from '@/data/channelData'
import type { TraceNode } from '@/data/types'

const iconMap: Record<string, React.ElementType> = {
  Smartphone, MessageSquare, Zap, Mail, Phone, MessagesSquare, Video, Globe, Brain,
}

type TabType = 'channels' | 'content' | 'control' | 'tracking'

const tabs: { key: TabType; label: string; icon: React.ElementType }[] = [
  { key: 'channels', label: '渠道管理', icon: Send },
  { key: 'content', label: '内容工厂', icon: Layers },
  { key: 'control', label: '消息管控', icon: ShieldCheck },
  { key: 'tracking', label: '链路追踪', icon: GitBranch },
]

export default function ChannelCenter() {
  const [searchParams] = useSearchParams()
  const tabFromUrl = searchParams.get('tab') as TabType | null
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (tabFromUrl && ['channels', 'content', 'control', 'tracking'].includes(tabFromUrl)) return tabFromUrl
    return 'channels'
  })

  useEffect(() => {
    if (tabFromUrl && ['channels', 'content', 'control', 'tracking'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl)
    }
  }, [tabFromUrl])

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">触达中心</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {activeTab === 'channels' ? '智能渠道路由与通信矩阵管理' :
             activeTab === 'content' ? '陪伴式内容模板工厂' :
             activeTab === 'control' ? '消息合规管控体系' :
             '全链路实例追踪与转化漏斗'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded bg-success/8 px-2 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] text-success/80 font-medium">9个渠道在线</span>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'channels' && <ChannelManagementTab />}
      {activeTab === 'content' && <ContentFactoryTab />}
      {activeTab === 'control' && <MessageControlTab />}
      {activeTab === 'tracking' && <InstanceTraceTab />}
    </div>
  )
}

// ===== Tab 1: 渠道管理 =====
function ChannelManagementTab() {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const [showRouting, setShowRouting] = useState(false)

  const channel = selectedChannel ? deliveryChannels.find(c => c.id === selectedChannel) : null

  // 汇总统计
  const totalVolume = deliveryChannels.reduce((s, c) => s + c.dailyVolume, 0)
  const avgDeliveryRate = (deliveryChannels.reduce((s, c) => s + c.deliveryRate, 0) / deliveryChannels.length).toFixed(1)
  const avgOpenRate = (deliveryChannels.reduce((s, c) => s + c.openRate, 0) / deliveryChannels.length).toFixed(1)
  const avgConversion = (deliveryChannels.reduce((s, c) => s + c.conversionRate, 0) / deliveryChannels.length).toFixed(1)

  return (
    <div className="space-y-4">
      {/* KPI */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: '日均发送量', value: (totalVolume / 10000).toFixed(1) + '万', sub: '9个渠道合计', color: 'primary' },
          { label: '平均送达率', value: avgDeliveryRate + '%', sub: '全渠道均值', color: 'success' },
          { label: '平均打开率', value: avgOpenRate + '%', sub: '含APP/邮件/短信', color: 'accent' },
          { label: '平均转化率', value: avgConversion + '%', sub: '行为转化口径', color: 'gold' },
        ].map(kpi => (
          <div key={kpi.label} className="rounded-lg border border-border bg-card p-3">
            <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
            <p className={`text-xl font-bold mt-0.5 text-${kpi.color === 'primary' ? 'primary' : kpi.color === 'gold' ? '[hsl(var(--gold))]' : kpi.color === 'accent' ? 'accent' : 'success'}`}>{kpi.value}</p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* 渠道列表 */}
        <div className="col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">通信渠道矩阵</h3>
            <button
              onClick={() => setShowRouting(!showRouting)}
              className="text-[11px] text-primary hover:underline flex items-center gap-1"
            >
              {showRouting ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {showRouting ? '收起路由规则' : '查看路由规则'}
            </button>
          </div>

          {/* 路由规则展开区 */}
          {showRouting && (
            <div className="rounded-lg border border-primary/20 bg-primary/4 p-3 space-y-2 animate-in fade-in">
              <h4 className="text-xs font-semibold text-primary flex items-center gap-1.5">
                <ArrowDownRight className="h-3.5 w-3.5" />
                智能路由策略（含降级/并行）
              </h4>
              {routingRules.map(rule => (
                <div key={rule.id} className="flex items-start gap-2 rounded bg-card/80 p-2 border border-border/50">
                  <span className="text-[10px] font-mono text-muted-foreground mt-0.5 shrink-0">{rule.id}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground">{rule.name}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                        rule.strategy === 'sequential' ? 'bg-primary/10 text-primary' :
                        rule.strategy === 'parallel' ? 'bg-accent/10 text-accent' :
                        'bg-warning/10 text-[hsl(var(--warning))]'
                      }`}>
                        {rule.strategy === 'sequential' ? '顺序降级' : rule.strategy === 'parallel' ? '并行发送' : '并行+降级'}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{rule.description}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {rule.applicableScenarios.map(s => (
                        <span key={s} className="text-[9px] px-1 py-0.5 rounded bg-secondary text-muted-foreground">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 渠道网格 */}
          <div className="grid grid-cols-3 gap-2">
            {deliveryChannels.map(ch => {
              const Icon = iconMap[ch.icon] || Smartphone
              const isSelected = selectedChannel === ch.id
              return (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChannel(isSelected ? null : ch.id)}
                  className={`text-left rounded-lg border p-3 transition-all duration-200 ${
                    isSelected
                      ? 'border-primary bg-primary/4 shadow-sm'
                      : 'border-border bg-card hover:border-primary/30 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className={`h-7 w-7 rounded flex items-center justify-center ${
                        isSelected ? 'bg-primary/12' : 'bg-secondary'
                      }`}>
                        <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{ch.name}</p>
                        <p className="text-[9px] text-muted-foreground">{ch.typeLabel}</p>
                      </div>
                    </div>
                    <span className={`h-2 w-2 rounded-full ${
                      ch.status === 'online' ? 'bg-success' : ch.status === 'maintenance' ? 'bg-warning' : 'bg-destructive'
                    }`} />
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                    <div>
                      <p className="text-[9px] text-muted-foreground">送达率</p>
                      <p className="text-xs font-semibold text-foreground">{ch.deliveryRate}%</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground">打开率</p>
                      <p className="text-xs font-semibold text-foreground">{ch.openRate}%</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground">转化率</p>
                      <p className="text-xs font-semibold text-primary">{ch.conversionRate}%</p>
                    </div>
                    <div>
                      <p className="text-[9px] text-muted-foreground">日均量</p>
                      <p className="text-xs font-semibold text-foreground">{(ch.dailyVolume / 1000).toFixed(1)}k</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* 右侧面板 */}
        <div className="space-y-3">
          {channel ? (
            <div className="rounded-lg border border-border bg-card p-3 space-y-3">
              <div className="flex items-center gap-2">
                {(() => { const Icon = iconMap[channel.icon] || Smartphone; return <Icon className="h-4 w-4 text-primary" /> })()}
                <h3 className="text-sm font-semibold text-foreground">{channel.name}</h3>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                  channel.status === 'online' ? 'bg-success/10 text-success' : 'bg-warning/10 text-[hsl(var(--warning))]'
                }`}>{channel.status === 'online' ? '在线' : '维护中'}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">{channel.description}</p>
              <div className="space-y-2">
                {[
                  { l: '路由优先级', v: `#${channel.routingPriority}` },
                  { l: '单条成本', v: `¥${channel.costPerMessage}` },
                  { l: '日限额', v: channel.dailyLimit.toLocaleString() + '条' },
                  { l: '适用客群', v: channel.applicableSegments.join('、') },
                  { l: '最佳时段', v: channel.bestTimeSlots.join('、') },
                ].map(item => (
                  <div key={item.l} className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">{item.l}</span>
                    <span className="text-foreground font-medium">{item.v}</span>
                  </div>
                ))}
                {channel.fallbackChannelId && (
                  <div className="flex items-center gap-1.5 mt-1 p-1.5 rounded bg-primary/4 border border-primary/10">
                    <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                    <span className="text-[10px] text-primary">
                      降级渠道：{deliveryChannels.find(c => c.id === channel.fallbackChannelId)?.name}
                    </span>
                  </div>
                )}
              </div>
              {/* 效果指标条 */}
              <div className="space-y-1.5 mt-2">
                {[
                  { label: '送达率', value: channel.deliveryRate, color: 'bg-success' },
                  { label: '打开率', value: channel.openRate, color: 'bg-primary' },
                  { label: '转化率', value: channel.conversionRate, color: 'bg-accent' },
                ].map(bar => (
                  <div key={bar.label}>
                    <div className="flex justify-between text-[10px] mb-0.5">
                      <span className="text-muted-foreground">{bar.label}</span>
                      <span className="font-medium text-foreground">{bar.value}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className={`h-full rounded-full ${bar.color} transition-all duration-500`} style={{ width: `${bar.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-card/50 p-6 text-center">
              <Send className="h-6 w-6 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">点击左侧渠道卡片查看详情</p>
            </div>
          )}

          {/* 渠道发送量趋势 */}
          <div className="rounded-lg border border-border bg-card p-3">
            <h4 className="text-xs font-semibold text-foreground mb-2">渠道发送量趋势</h4>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={channelTrends} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ fontSize: 10, background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 6 }} />
                <Line type="monotone" dataKey="APP推送" stroke="hsl(207 85% 42%)" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="短信" stroke="hsl(152 62% 38%)" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="5G消息" stroke="hsl(191 78% 55%)" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="企业微信" stroke="hsl(38 88% 52%)" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== Tab 2: 内容工厂 =====
function ContentFactoryTab() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const categories = [
    { key: 'all', label: '全部', count: contentTemplates.length },
    { key: 'volatility_companion', label: '波动陪伴', count: contentTemplates.filter(t => t.category === 'volatility_companion').length },
    { key: 'holding_companion', label: '持有陪伴', count: contentTemplates.filter(t => t.category === 'holding_companion').length },
    { key: 'lifecycle', label: '生命周期', count: contentTemplates.filter(t => t.category === 'lifecycle').length },
    { key: 'marketing', label: '营销活动', count: contentTemplates.filter(t => t.category === 'marketing').length },
    { key: 'risk_alert', label: '风险提醒', count: contentTemplates.filter(t => t.category === 'risk_alert').length },
    { key: 'compliance', label: '合规通知', count: contentTemplates.filter(t => t.category === 'compliance').length },
  ]

  const filteredTemplates = contentTemplates.filter(t => {
    const matchCategory = selectedCategory === 'all' || t.category === selectedCategory
    const matchSearch = !searchQuery || t.name.includes(searchQuery) || t.content.includes(searchQuery)
    return matchCategory && matchSearch
  })

  const template = selectedTemplate ? contentTemplates.find(t => t.id === selectedTemplate) : null

  // 统计
  const approvedCount = contentTemplates.filter(t => t.complianceStatus === 'approved').length
  const totalUsage = contentTemplates.reduce((s, t) => s + t.usageCount, 0)
  const avgCheckPoints = Math.round(contentTemplates.reduce((s, t) => s + t.complianceCheckPoints, 0) / contentTemplates.length)

  return (
    <div className="space-y-4">
      {/* KPI */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: '模板总数', value: contentTemplates.length.toString(), sub: `${approvedCount}个已审核通过`, color: 'primary' },
          { label: '累计使用', value: (totalUsage / 10000).toFixed(1) + '万次', sub: '全模板累计', color: 'success' },
          { label: 'AI合规检测', value: '587个', sub: '检测点覆盖', color: 'accent' },
          { label: '平均检测点', value: avgCheckPoints + '个', sub: '每模板平均', color: 'gold' },
        ].map(kpi => (
          <div key={kpi.label} className="rounded-lg border border-border bg-card p-3">
            <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
            <p className={`text-xl font-bold mt-0.5 ${
              kpi.color === 'primary' ? 'text-primary' :
              kpi.color === 'success' ? 'text-success' :
              kpi.color === 'accent' ? 'text-accent' :
              'text-[hsl(var(--gold))]'
            }`}>{kpi.value}</p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* 模板列表 */}
        <div className="col-span-2 space-y-3">
          {/* 搜索 + 分类 */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索模板名称或内容..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-7 w-full rounded border border-border bg-card pl-7 pr-3 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`text-[11px] px-2 py-1 rounded-full transition-colors ${
                  selectedCategory === cat.key
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat.label}
                <span className="ml-1 text-[9px] opacity-60">{cat.count}</span>
              </button>
            ))}
          </div>

          {/* 模板卡片 */}
          <div className="space-y-2 max-h-[520px] overflow-y-auto">
            {filteredTemplates.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(selectedTemplate === t.id ? null : t.id)}
                className={`w-full text-left rounded-lg border p-3 transition-all duration-200 ${
                  selectedTemplate === t.id
                    ? 'border-primary bg-primary/4'
                    : 'border-border bg-card hover:border-primary/20'
                }`}
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                      t.category === 'volatility_companion' ? 'bg-destructive/10 text-destructive' :
                      t.category === 'holding_companion' ? 'bg-primary/10 text-primary' :
                      t.category === 'marketing' ? 'bg-accent/10 text-accent' :
                      t.category === 'risk_alert' ? 'bg-warning/10 text-[hsl(var(--warning))]' :
                      t.category === 'compliance' ? 'bg-muted text-muted-foreground' :
                      'bg-success/10 text-success'
                    }`}>
                      {t.categoryLabel}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                      t.timingType === 'T+0' ? 'bg-success/8 text-success' :
                      t.timingType === 'T+3' ? 'bg-primary/8 text-primary' :
                      'bg-accent/8 text-accent'
                    }`}>
                      {t.timingType}
                    </span>
                    <h4 className="text-xs font-medium text-foreground">{t.name}</h4>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {t.complianceStatus === 'approved' ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                    ) : t.complianceStatus === 'pending_review' ? (
                      <Clock className="h-3.5 w-3.5 text-[hsl(var(--warning))]" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-destructive" />
                    )}
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground line-clamp-2">{t.content}</p>
                <div className="flex items-center gap-3 mt-2 text-[9px] text-muted-foreground/60">
                  <span>渠道: {t.channels.join(' / ')}</span>
                  <span>使用 {t.usageCount.toLocaleString()} 次</span>
                  <span>检测点 {t.complianceCheckPoints}个</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 模板详情 */}
        <div>
          {template ? (
            <div className="rounded-lg border border-border bg-card p-3 space-y-3 sticky top-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">{template.name}</h3>
                <div className="flex gap-1">
                  <button onClick={() => setShowPreview(prev => !prev)} title="预览模板" className={`h-6 w-6 rounded flex items-center justify-center transition-colors ${showPreview ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
                    <Eye className="h-3 w-3" />
                  </button>
                  <button onClick={() => { navigator.clipboard.writeText(template.content); setCopied(true); setTimeout(() => setCopied(false), 1500) }} title="复制模板" className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                    {copied ? <CheckCircle2 className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>

              {/* 模板内容预览 */}
              <div className={`rounded p-2.5 border transition-all ${showPreview ? 'bg-card border-primary/30 ring-1 ring-primary/10' : 'bg-secondary/50 border-border/50'}`}>
                {showPreview && <p className="text-[9px] text-primary font-semibold mb-1.5">模板预览模式</p>}
                <p className={`leading-relaxed whitespace-pre-wrap ${showPreview ? 'text-xs text-foreground' : 'text-[11px] text-foreground'}`}>
                  {showPreview
                    ? template.content.replace(/\{\{customerName\}\}/g, '张建国').replace(/\{\{fundName\}\}/g, '易方达蓝筹精选混合').replace(/\{\{(\w+)\}\}/g, (_, p) => `[示例${p}]`)
                    : template.content.replace(/\{\{(\w+)\}\}/g, (_, param) => `[${param}]`)}
                </p>
              </div>

              {/* 动态参数 */}
              <div>
                <h4 className="text-[10px] font-semibold text-muted-foreground mb-1.5">动态参数</h4>
                <div className="flex flex-wrap gap-1">
                  {template.dynamicParams.map(p => (
                    <span key={p} className="text-[9px] px-1.5 py-0.5 rounded bg-primary/8 text-primary font-mono">
                      {`{{${p}}}`}
                    </span>
                  ))}
                </div>
              </div>

              {/* 关联信息 */}
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">分类</span>
                  <span className="text-foreground">{template.categoryLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">时序类型</span>
                  <span className="text-foreground">{template.timingType === 'T+0' ? '即时触达' : template.timingType === 'T+3' ? '3日跟进' : '7日复盘'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">适用渠道</span>
                  <span className="text-foreground">{template.channels.length}个</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">关联规则</span>
                  <span className="text-foreground">{template.linkedMotRules.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">合规检测点</span>
                  <span className="text-foreground">{template.complianceCheckPoints}个</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">使用次数</span>
                  <span className="text-foreground font-medium">{template.usageCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">创建时间</span>
                  <span className="text-foreground">{template.createdAt}</span>
                </div>
              </div>

              {/* 合规状态 */}
              <div className={`flex items-center gap-2 rounded p-2 ${
                template.complianceStatus === 'approved' ? 'bg-success/8 border border-success/20' :
                template.complianceStatus === 'pending_review' ? 'bg-warning/8 border border-warning/20' :
                'bg-destructive/8 border border-destructive/20'
              }`}>
                <Shield className={`h-3.5 w-3.5 ${
                  template.complianceStatus === 'approved' ? 'text-success' :
                  template.complianceStatus === 'pending_review' ? 'text-[hsl(var(--warning))]' :
                  'text-destructive'
                }`} />
                <span className="text-[10px] font-medium">
                  {template.complianceStatus === 'approved' ? 'AI合规审核通过' :
                   template.complianceStatus === 'pending_review' ? '待人工审核' : '审核未通过'}
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-card/50 p-6 text-center">
              <FileText className="h-6 w-6 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">点击模板查看详情</p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">支持T+0/T+3/T+7时序化内容</p>
            </div>
          )}

          {/* 陪伴服务模型说明 */}
          <div className="rounded-lg border border-border bg-card p-3 mt-3">
            <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-primary" />
              陪伴服务模型
            </h4>
            <div className="space-y-2">
              {[
                { label: '波动陪伴', desc: 'T+0即时安抚 → T+3跟进关怀 → T+7复盘总结', color: 'destructive' },
                { label: '持有陪伴', desc: '定投鼓励 → 百日纪念 → 季度复盘 → 年度回顾', color: 'primary' },
                { label: '生命周期', desc: '首投欢迎 → 成长引导 → 成熟维系 → 流失挽回', color: 'success' },
              ].map(model => (
                <div key={model.label} className="flex items-start gap-2">
                  <span className={`mt-0.5 h-1.5 w-1.5 rounded-full shrink-0 bg-${model.color}`} />
                  <div>
                    <p className="text-[10px] font-medium text-foreground">{model.label}</p>
                    <p className="text-[9px] text-muted-foreground">{model.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== Tab 3: 消息管控 =====
function MessageControlTab() {
  const [rules, setRules] = useState(messageControlRules)

  const totalIntercepted = rules.reduce((s, r) => s + r.interceptCount, 0)
  const enabledCount = rules.filter(r => r.enabled).length

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r))
  }

  // 拦截类型分布
  const interceptByType = [
    { type: '频次管控', count: rules.filter(r => r.type === 'frequency').reduce((s, r) => s + r.interceptCount, 0) },
    { type: '时段管控', count: rules.filter(r => r.type === 'time_window').reduce((s, r) => s + r.interceptCount, 0) },
    { type: '内容审核', count: rules.filter(r => r.type === 'sensitive_word').reduce((s, r) => s + r.interceptCount, 0) },
    { type: '黑名单', count: rules.filter(r => r.type === 'blacklist').reduce((s, r) => s + r.interceptCount, 0) },
    { type: '人工审核', count: rules.filter(r => r.type === 'manual_review').reduce((s, r) => s + r.interceptCount, 0) },
  ]

  return (
    <div className="space-y-4">
      {/* KPI */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: '管控规则', value: rules.length.toString(), sub: `${enabledCount}个启用中`, color: 'primary' },
          { label: '累计拦截', value: (totalIntercepted / 10000).toFixed(1) + '万次', sub: '保护客户体验', color: 'destructive' },
          { label: '敏感词库', value: '587个', sub: 'AI检测点覆盖', color: 'accent' },
          { label: '黑名单客户', value: '356人', sub: '含投诉升级客户', color: 'gold' },
        ].map(kpi => (
          <div key={kpi.label} className="rounded-lg border border-border bg-card p-3">
            <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
            <p className={`text-xl font-bold mt-0.5 ${
              kpi.color === 'primary' ? 'text-primary' :
              kpi.color === 'destructive' ? 'text-destructive' :
              kpi.color === 'accent' ? 'text-accent' :
              'text-[hsl(var(--gold))]'
            }`}>{kpi.value}</p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* 规则列表 */}
        <div className="col-span-2 space-y-2">
          <h3 className="text-sm font-semibold text-foreground">管控规则列表</h3>
          {rules.map(rule => (
            <div key={rule.id} className={`rounded-lg border p-3 transition-colors ${
              rule.enabled ? 'border-border bg-card' : 'border-border/50 bg-card/50 opacity-60'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2.5 flex-1">
                  <div className={`mt-0.5 h-7 w-7 rounded flex items-center justify-center shrink-0 ${
                    rule.type === 'frequency' ? 'bg-primary/10' :
                    rule.type === 'time_window' ? 'bg-accent/10' :
                    rule.type === 'sensitive_word' ? 'bg-destructive/10' :
                    rule.type === 'blacklist' ? 'bg-warning/10' :
                    'bg-success/10'
                  }`}>
                    {rule.type === 'frequency' ? <Filter className="h-3.5 w-3.5 text-primary" /> :
                     rule.type === 'time_window' ? <Clock className="h-3.5 w-3.5 text-accent" /> :
                     rule.type === 'sensitive_word' ? <AlertTriangle className="h-3.5 w-3.5 text-destructive" /> :
                     rule.type === 'blacklist' ? <XCircle className="h-3.5 w-3.5 text-[hsl(var(--warning))]" /> :
                     <Eye className="h-3.5 w-3.5 text-success" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="text-xs font-medium text-foreground">{rule.name}</h4>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                        rule.type === 'frequency' ? 'bg-primary/10 text-primary' :
                        rule.type === 'time_window' ? 'bg-accent/10 text-accent' :
                        rule.type === 'sensitive_word' ? 'bg-destructive/10 text-destructive' :
                        rule.type === 'blacklist' ? 'bg-warning/10 text-[hsl(var(--warning))]' :
                        'bg-success/10 text-success'
                      }`}>{rule.typeLabel}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{rule.config}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[9px] text-muted-foreground/60">
                      <span>拦截 {rule.interceptCount.toLocaleString()} 次</span>
                      <span>最近: {rule.lastIntercepted.split(' ')[0]}</span>
                      <span>优先级 #{rule.priority}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleRule(rule.id)}
                  className="shrink-0 ml-2"
                >
                  {rule.enabled ? (
                    <ToggleRight className="h-5 w-5 text-primary" />
                  ) : (
                    <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 右侧分析 */}
        <div className="space-y-3">
          {/* 拦截分布 */}
          <div className="rounded-lg border border-border bg-card p-3">
            <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 text-primary" />
              拦截类型分布
            </h4>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={interceptByType} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis dataKey="type" type="category" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} width={50} />
                <Tooltip contentStyle={{ fontSize: 10, background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 6 }} />
                <Bar dataKey="count" fill="hsl(207 85% 42%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* 合规保护说明 */}
          <div className="rounded-lg border border-border bg-card p-3">
            <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-success" />
              消息合规保护体系
            </h4>
            <div className="space-y-2">
              {[
                { step: 1, label: '频次管控', desc: '日/周/月频次上限，防止过度打扰' },
                { step: 2, label: '时段过滤', desc: '22:00-08:00免打扰，仅允许紧急通知' },
                { step: 3, label: 'AI内容审核', desc: '587个检测点，过滤违规承诺/敏感词' },
                { step: 4, label: '黑名单过滤', desc: '拒收客户/投诉客户/冷静期客户' },
                { step: 5, label: '去重校验', desc: '72小时内同内容不重复发送' },
                { step: 6, label: '人工审核', desc: '收益预测/投资建议类需人工确认' },
              ].map(item => (
                <div key={item.step} className="flex items-start gap-2">
                  <span className="h-4 w-4 rounded-full bg-primary/10 text-primary text-[9px] flex items-center justify-center shrink-0 font-medium">{item.step}</span>
                  <div>
                    <p className="text-[10px] font-medium text-foreground">{item.label}</p>
                    <p className="text-[9px] text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 今日拦截概览 */}
          <div className="rounded-lg border border-destructive/20 bg-destructive/4 p-3">
            <h4 className="text-xs font-semibold text-destructive mb-2">今日拦截概览</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: '频次超限', value: '1,280' },
                { label: '时段拦截', value: '562' },
                { label: '敏感词命中', value: '34' },
                { label: '黑名单拦截', value: '189' },
              ].map(stat => (
                <div key={stat.label} className="text-center">
                  <p className="text-sm font-bold text-destructive">{stat.value}</p>
                  <p className="text-[9px] text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== Tab 4: 链路追踪 =====
function InstanceTraceTab() {
  const [subTab, setSubTab] = useState<'instances' | 'funnel'>('instances')

  return (
    <div className="space-y-4">
      {/* Sub-tab 切换 */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-lg bg-secondary/50 p-0.5">
          {[
            { key: 'instances' as const, label: '实例追踪', icon: GitBranch },
            { key: 'funnel' as const, label: '转化漏斗', icon: Filter },
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setSubTab(tab.key)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  subTab === tab.key
                    ? 'bg-card text-primary shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            )
          })}
        </div>
        <div className="flex items-center gap-1 rounded bg-primary/8 px-2 py-1">
          <Activity className="h-3 w-3 text-primary" />
          <span className="text-[10px] text-primary font-medium">实时追踪中</span>
        </div>
      </div>

      {subTab === 'instances' && <InstanceListView />}
      {subTab === 'funnel' && <ConversionFunnelView />}
    </div>
  )
}

// ===== 实例列表视图 =====
function InstanceListView() {
  const [selectedInstance, setSelectedInstance] = useState<string | null>(motInstances[0]?.id ?? null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const statusOptions = [
    { key: 'all', label: '全部', count: motInstances.length },
    { key: 'converted', label: '已转化', count: motInstances.filter(i => i.status === 'converted').length },
    { key: 'opened', label: '已打开', count: motInstances.filter(i => i.status === 'opened').length },
    { key: 'delivered', label: '已送达', count: motInstances.filter(i => i.status === 'delivered').length },
    { key: 'failed', label: '执行失败', count: motInstances.filter(i => i.status === 'failed').length },
  ]

  const filteredInstances = motInstances.filter(i => {
    const matchStatus = statusFilter === 'all' || i.status === statusFilter
    const matchSearch = !searchQuery || i.motRuleName.includes(searchQuery) || i.customerName.includes(searchQuery)
    return matchStatus && matchSearch
  })

  const instance = selectedInstance ? motInstances.find(i => i.id === selectedInstance) : null

  const convertedCount = motInstances.filter(i => i.status === 'converted').length
  const failedCount = motInstances.filter(i => i.status === 'failed').length
  const avgDuration = motInstances.filter(i => i.duration).reduce((s, i) => s + (i.duration || 0), 0) / motInstances.filter(i => i.duration).length

  return (
    <div className="space-y-4">
      {/* KPI */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: '追踪实例', value: motInstances.length.toString(), sub: '本周MOT执行实例', color: 'primary' },
          { label: '转化成功', value: convertedCount.toString(), sub: `转化率 ${((convertedCount / motInstances.length) * 100).toFixed(0)}%`, color: 'success' },
          { label: '执行失败', value: failedCount.toString(), sub: '需人工关注', color: 'destructive' },
          { label: '平均耗时', value: avgDuration > 60000 ? `${(avgDuration / 60000).toFixed(0)}分` : `${(avgDuration / 1000).toFixed(0)}秒`, sub: '从触发到完成', color: 'accent' },
        ].map(kpi => (
          <div key={kpi.label} className="rounded-lg border border-border bg-card p-3">
            <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
            <p className={`text-xl font-bold mt-0.5 ${
              kpi.color === 'primary' ? 'text-primary' :
              kpi.color === 'success' ? 'text-success' :
              kpi.color === 'destructive' ? 'text-destructive' :
              'text-accent'
            }`}>{kpi.value}</p>
            <p className="text-[10px] text-muted-foreground/60 mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 xl:grid-cols-5 gap-3 xl:gap-4">
        {/* 实例列表 */}
        <div className="col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索规则或客户..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-7 w-full rounded border border-border bg-card pl-7 pr-3 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {statusOptions.map(opt => (
              <button
                key={opt.key}
                onClick={() => setStatusFilter(opt.key)}
                className={`text-[10px] px-2 py-0.5 rounded-full transition-colors ${
                  statusFilter === opt.key
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                {opt.label} <span className="opacity-60">{opt.count}</span>
              </button>
            ))}
          </div>

          <div className="space-y-1.5 max-h-[520px] overflow-y-auto">
            {filteredInstances.map(inst => (
              <button
                key={inst.id}
                onClick={() => setSelectedInstance(inst.id)}
                className={`w-full text-left rounded-lg border p-2.5 transition-all duration-200 ${
                  selectedInstance === inst.id
                    ? 'border-primary bg-primary/4'
                    : 'border-border bg-card hover:border-primary/20'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <TrackingStatusBadge status={inst.status} label={inst.statusLabel} />
                    <span className="text-[10px] font-mono text-muted-foreground">{inst.id}</span>
                  </div>
                  <span className="text-[9px] text-muted-foreground">{inst.triggeredAt.split(' ')[0]}</span>
                </div>
                <p className="text-xs font-medium text-foreground">{inst.motRuleName}</p>
                <div className="flex items-center gap-2 mt-1 text-[9px] text-muted-foreground">
                  <span>客户: {inst.customerName}</span>
                  <span>|</span>
                  <span>渠道: {inst.channel}</span>
                </div>
                {/* 迷你链路预览 */}
                <div className="flex items-center gap-0.5 mt-2">
                  {inst.traceNodes.map((node, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className={`h-1.5 w-1.5 rounded-full ${
                        node.status === 'success' ? 'bg-success' :
                        node.status === 'warning' ? 'bg-[hsl(var(--warning))]' :
                        node.status === 'error' ? 'bg-destructive' :
                        node.status === 'skipped' ? 'bg-muted-foreground/20' :
                        'bg-primary/30'
                      }`} />
                      {idx < inst.traceNodes.length - 1 && (
                        <div className={`h-px w-2 ${
                          node.status === 'success' ? 'bg-success/30' : 'bg-muted-foreground/10'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 链路详情 */}
        <div className="col-span-3">
          {instance ? (
            <div className="rounded-lg border border-border bg-card p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-foreground">{instance.motRuleName}</h3>
                    <TrackingStatusBadge status={instance.status} label={instance.statusLabel} />
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    <span>实例: {instance.id}</span>
                    <span>客户: {instance.customerName}</span>
                    <span>策略: {instance.strategyName}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">触发时间</p>
                  <p className="text-xs font-medium text-foreground">{instance.triggeredAt}</p>
                </div>
              </div>

              {/* 执行管道 */}
              <div className="flex items-center gap-1 py-2 px-3 bg-secondary/30 rounded-lg overflow-x-auto">
                {instance.traceNodes.map((node, idx) => (
                  <div key={idx} className="flex items-center shrink-0">
                    <div className={`flex items-center gap-1 px-2 py-1 rounded text-[9px] font-medium ${
                      node.status === 'success' ? 'bg-success/10 text-success' :
                      node.status === 'warning' ? 'bg-warning/10 text-[hsl(var(--warning))]' :
                      node.status === 'error' ? 'bg-destructive/10 text-destructive' :
                      node.status === 'skipped' ? 'bg-muted text-muted-foreground/50' :
                      'bg-primary/10 text-primary'
                    }`}>
                      {node.status === 'success' ? <CheckCircle2 className="h-2.5 w-2.5" /> :
                       node.status === 'warning' ? <AlertTriangle className="h-2.5 w-2.5" /> :
                       node.status === 'error' ? <XCircle className="h-2.5 w-2.5" /> :
                       node.status === 'skipped' ? <ChevronRight className="h-2.5 w-2.5" /> :
                       <Clock className="h-2.5 w-2.5" />}
                      <span className="whitespace-nowrap">{node.name}</span>
                    </div>
                    {idx < instance.traceNodes.length - 1 && (
                      <ArrowRight className={`h-3 w-3 mx-0.5 shrink-0 ${
                        node.status === 'success' ? 'text-success/40' : 'text-muted-foreground/20'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              {/* 详细链路时间线 */}
              <div className="space-y-0">
                {instance.traceNodes.map((node, idx) => (
                  <TraceNodeRow key={idx} node={node} isLast={idx === instance.traceNodes.length - 1} />
                ))}
              </div>

              {/* 实例摘要 */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-2 pt-2 border-t border-border">
                <div className="text-center">
                  <p className="text-[9px] text-muted-foreground">规则ID</p>
                  <p className="text-xs font-mono font-medium text-foreground">{instance.motRuleId}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-muted-foreground">使用渠道</p>
                  <p className="text-xs font-medium text-foreground">{instance.channel}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-muted-foreground">内容模板</p>
                  <p className="text-xs font-medium text-foreground truncate" title={instance.templateName}>{instance.templateName}</p>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-muted-foreground">总耗时</p>
                  <p className="text-xs font-medium text-foreground">
                    {instance.duration
                      ? instance.duration > 60000
                        ? `${(instance.duration / 60000).toFixed(1)}分钟`
                        : `${(instance.duration / 1000).toFixed(1)}秒`
                      : '进行中'
                    }
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-card/50 p-12 text-center">
              <GitBranch className="h-8 w-8 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">选择左侧实例查看完整链路</p>
              <p className="text-xs text-muted-foreground/60 mt-1">支持 10 步全链路可视化追踪</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ===== 转化漏斗视图 =====
function ConversionFunnelView() {
  const funnelColors = [
    'hsl(207 85% 42%)',
    'hsl(207 85% 48%)',
    'hsl(207 75% 52%)',
    'hsl(191 78% 50%)',
    'hsl(191 78% 55%)',
    'hsl(152 62% 42%)',
    'hsl(152 62% 38%)',
    'hsl(38 88% 52%)',
    'hsl(0 72% 51%)',
  ]

  return (
    <div className="space-y-4">
      {/* 总览 KPI */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: '本周触发事件', value: '18,920', sub: '全部MOT事件', icon: Zap, color: 'primary' },
          { label: '最终送达', value: '12,680', sub: `送达率 ${((12680 / 18920) * 100).toFixed(1)}%`, icon: Eye, color: 'success' },
          { label: '客户打开', value: '5,320', sub: `打开率 ${((5320 / 12680) * 100).toFixed(1)}%`, icon: MousePointer, color: 'accent' },
          { label: '行为转化', value: '2,280', sub: `总转化率 ${((2280 / 18920) * 100).toFixed(1)}%`, icon: ShoppingCart, color: 'gold' },
        ].map(kpi => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className={`h-3.5 w-3.5 ${
                  kpi.color === 'primary' ? 'text-primary' :
                  kpi.color === 'success' ? 'text-success' :
                  kpi.color === 'accent' ? 'text-accent' :
                  'text-[hsl(var(--gold))]'
                }`} />
                <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
              </div>
              <p className={`text-xl font-bold ${
                kpi.color === 'primary' ? 'text-primary' :
                kpi.color === 'success' ? 'text-success' :
                kpi.color === 'accent' ? 'text-accent' :
                'text-[hsl(var(--gold))]'
              }`}>{kpi.value}</p>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">{kpi.sub}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* 漏斗可视化 */}
        <div className="col-span-2 rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-1.5">
            <Filter className="h-4 w-4 text-primary" />
            全链路转化漏斗
          </h3>

          <div className="space-y-1.5">
            {conversionFunnelData.map((stage, idx) => {
              const maxCount = conversionFunnelData[0].count
              const widthPercent = (stage.count / maxCount) * 100
              return (
                <div key={stage.stage} className="flex items-center gap-3">
                  <span className="text-[10px] text-muted-foreground w-16 text-right shrink-0">{stage.stage}</span>
                  <div className="flex-1 relative">
                    <div className="h-8 rounded bg-secondary/30 overflow-hidden">
                      <div
                        className="h-full rounded transition-all duration-700 flex items-center justify-end pr-2"
                        style={{
                          width: `${widthPercent}%`,
                          background: funnelColors[idx],
                          minWidth: '60px',
                        }}
                      >
                        <span className="text-[10px] font-bold text-white">
                          {stage.count.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-14 text-right shrink-0">
                    <span className="text-xs font-semibold text-foreground">{stage.rate}%</span>
                  </div>
                  {idx > 0 && (
                    <div className="w-16 text-right shrink-0">
                      <span className="text-[10px] text-destructive">
                        -{stage.dropoff}%
                      </span>
                    </div>
                  )}
                  {idx === 0 && <div className="w-16 shrink-0" />}
                </div>
              )
            })}
          </div>

          {/* 漏斗柱状图 */}
          <div className="mt-6">
            <h4 className="text-xs font-semibold text-muted-foreground mb-2">漏斗阶段数量分布</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={conversionFunnelData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="stage" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{ fontSize: 10, background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 6 }}
                  formatter={(value: number) => [value.toLocaleString(), '数量']}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {conversionFunnelData.map((_, idx) => (
                    <Cell key={idx} fill={funnelColors[idx]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 右侧分析 */}
        <div className="space-y-3">
          {/* 流失分析 */}
          <div className="rounded-lg border border-border bg-card p-3">
            <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <BarChart3 className="h-3.5 w-3.5 text-destructive" />
              关键流失节点分析
            </h4>
            <div className="space-y-2">
              {conversionFunnelData.filter(s => s.dropoff > 5).map(stage => (
                <div key={stage.stage} className="p-2 rounded bg-secondary/30 border border-border/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-medium text-foreground">{stage.stage}</span>
                    <span className="text-[10px] font-bold text-destructive">-{stage.dropoff}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-destructive/60 transition-all duration-500" style={{ width: `${stage.dropoff}%` }} />
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-1">
                    {stage.stage === '客户筛选' ? '15.3%客户不符合触达条件（频次/黑名单/冷静期）' :
                     stage.stage === '客户打开' ? '58.1%未打开消息，考虑优化渠道选择和推送时间' :
                     stage.stage === '行为转化' ? '57.1%打开后未转化，需优化内容引导和CTA设计' :
                     stage.stage === '规则匹配' ? '10.9%事件未匹配到MOT规则，考虑扩充规则库' :
                     `流失率 ${stage.dropoff}%`}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 优化建议 */}
          <div className="rounded-lg border border-primary/20 bg-primary/4 p-3">
            <h4 className="text-xs font-semibold text-primary mb-2">智能优化建议</h4>
            <div className="space-y-2">
              {[
                { priority: '高', suggestion: '客户打开率仅41.9%，建议启用5G富媒体消息替代普通短信，预计提升打开率16%', impact: '+16%打开率' },
                { priority: '高', suggestion: '行为转化率42.9%偏低，建议增加T+3跟进关怀模板覆盖，提升二次触达', impact: '+8%转化率' },
                { priority: '中', suggestion: '规则匹配率89.1%，10.9%事件未匹配，建议补充行为维度规则覆盖', impact: '+2K触达量/周' },
                { priority: '低', suggestion: '合规审核流失3.8%，部分为人工审核排队，建议扩大AI审核范围', impact: '-3.8%流失' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className={`text-[9px] px-1 py-0.5 rounded font-medium shrink-0 mt-0.5 ${
                    item.priority === '高' ? 'bg-destructive/10 text-destructive' :
                    item.priority === '中' ? 'bg-warning/10 text-[hsl(var(--warning))]' :
                    'bg-success/10 text-success'
                  }`}>
                    {item.priority}
                  </span>
                  <div>
                    <p className="text-[10px] text-foreground">{item.suggestion}</p>
                    <p className="text-[9px] text-primary font-medium mt-0.5">{item.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 全链路指标 */}
          <div className="rounded-lg border border-border bg-card p-3">
            <h4 className="text-xs font-semibold text-foreground mb-2">全链路核心指标</h4>
            <div className="space-y-1.5">
              {[
                { label: '端到端转化率', value: '12.1%', trend: '+1.2%' },
                { label: '平均响应时间', value: '2.3分钟', trend: '-0.5分' },
                { label: '渠道路由成功率', value: '99.7%', trend: '+0.1%' },
                { label: '合规通过率', value: '96.2%', trend: '+0.8%' },
                { label: '客户满意度', value: '87.3分', trend: '+0.3分' },
              ].map(metric => (
                <div key={metric.label} className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground">{metric.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{metric.value}</span>
                    <span className={`text-[9px] ${metric.trend.startsWith('+') ? 'text-success' : 'text-primary'}`}>
                      {metric.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== 辅助组件 =====
function TrackingStatusBadge({ status, label }: { status: string; label: string }) {
  const styles: Record<string, string> = {
    converted: 'bg-success/10 text-success',
    opened: 'bg-primary/10 text-primary',
    delivered: 'bg-accent/10 text-accent',
    failed: 'bg-destructive/10 text-destructive',
    triggered: 'bg-warning/10 text-[hsl(var(--warning))]',
    matched: 'bg-primary/10 text-primary',
    filtered: 'bg-muted text-muted-foreground',
    content_generated: 'bg-primary/10 text-primary',
    routed: 'bg-accent/10 text-accent',
  }
  return (
    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${styles[status] || 'bg-muted text-muted-foreground'}`}>
      {label}
    </span>
  )
}

function TraceNodeRow({ node, isLast }: { node: TraceNode; isLast: boolean }) {
  const statusIcon = {
    success: <CheckCircle2 className="h-3.5 w-3.5 text-success" />,
    warning: <AlertTriangle className="h-3.5 w-3.5 text-[hsl(var(--warning))]" />,
    error: <XCircle className="h-3.5 w-3.5 text-destructive" />,
    pending: <Clock className="h-3.5 w-3.5 text-primary/50" />,
    skipped: <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/30" />,
  }

  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center shrink-0">
        <div className={`h-7 w-7 rounded-full flex items-center justify-center border-2 ${
          node.status === 'success' ? 'border-success/30 bg-success/8' :
          node.status === 'warning' ? 'border-warning/30 bg-warning/8' :
          node.status === 'error' ? 'border-destructive/30 bg-destructive/8' :
          node.status === 'skipped' ? 'border-muted bg-muted/50' :
          'border-primary/20 bg-primary/4'
        }`}>
          {statusIcon[node.status]}
        </div>
        {!isLast && (
          <div className={`w-px h-8 ${
            node.status === 'success' ? 'bg-success/20' :
            node.status === 'error' ? 'bg-destructive/20' :
            'bg-border'
          }`} />
        )}
      </div>
      <div className="flex-1 pb-3 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-foreground">{node.step}. {node.name}</span>
            {node.duration > 0 && (
              <span className="text-[9px] text-muted-foreground/60 font-mono">{node.duration}ms</span>
            )}
          </div>
          <span className="text-[9px] text-muted-foreground font-mono">
            {node.timestamp !== '-' ? node.timestamp.split(' ')[1] : '-'}
          </span>
        </div>
        <p className={`text-[10px] ${
          node.status === 'error' ? 'text-destructive' :
          node.status === 'warning' ? 'text-[hsl(var(--warning))]' :
          node.status === 'skipped' ? 'text-muted-foreground/40' :
          'text-muted-foreground'
        }`}>{node.detail}</p>
      </div>
    </div>
  )
}
