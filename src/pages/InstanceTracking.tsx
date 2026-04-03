// 易方达 MOT 系统 - 链路追踪
// 来源：MOT调研情况汇总 + 玄武ICC全链路转化追踪
// 两大功能：实例追踪 | 转化漏斗

import { useState } from 'react'
import {
  GitBranch, CheckCircle2, Clock, XCircle, AlertTriangle,
  ArrowRight, ChevronRight, Search, Filter,
  Activity, Zap, Eye, MousePointer, ShoppingCart,
  BarChart3,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { motInstances, conversionFunnelData } from '@/data/channelData'
import type { TraceNode } from '@/data/types'

type TabType = 'instances' | 'funnel'

const tabs: { key: TabType; label: string; icon: React.ElementType }[] = [
  { key: 'instances', label: '实例追踪', icon: GitBranch },
  { key: 'funnel', label: '转化漏斗', icon: Filter },
]

export default function InstanceTracking() {
  const [activeTab, setActiveTab] = useState<TabType>('instances')

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">链路追踪</h1>
          <p className="text-xs text-muted-foreground mt-0.5">MOT实例全链路可视化 / 转化漏斗分析 — 执行监控与优化</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded bg-primary/8 px-2 py-1">
            <Activity className="h-3 w-3 text-primary" />
            <span className="text-[10px] text-primary font-medium">实时追踪中</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg bg-secondary/50 p-0.5">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                activeTab === tab.key
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

      {/* Content */}
      {activeTab === 'instances' && <InstanceTraceTab />}
      {activeTab === 'funnel' && <ConversionFunnelTab />}
    </div>
  )
}

// ===== Tab 1: 实例追踪 =====
function InstanceTraceTab() {
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

  // 统计
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
                    <StatusBadge status={inst.status} label={inst.statusLabel} />
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
              {/* 实例概览 */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-foreground">{instance.motRuleName}</h3>
                    <StatusBadge status={instance.status} label={instance.statusLabel} />
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

// ===== Tab 2: 转化漏斗 =====
function ConversionFunnelTab() {
  const funnelColors = [
    'hsl(207 85% 42%)', // primary
    'hsl(207 85% 48%)',
    'hsl(207 75% 52%)',
    'hsl(191 78% 50%)',
    'hsl(191 78% 55%)', // accent
    'hsl(152 62% 42%)',
    'hsl(152 62% 38%)', // success
    'hsl(38 88% 52%)', // gold
    'hsl(0 72% 51%)', // destructive
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

function StatusBadge({ status, label }: { status: string; label: string }) {
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
      {/* 时间线 */}
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
      {/* 内容 */}
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
