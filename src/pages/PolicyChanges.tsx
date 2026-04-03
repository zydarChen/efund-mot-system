import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { policyItems } from '@/data/policyData'
import { useToast, ToastContainer } from '@/components/ui/toast'
import MOTRecommendationPanel, { policyRecommendations } from '@/components/strategy/MOTRecommendation'
import {
  ScrollText,
  AlertTriangle,
  Filter,
  RefreshCw,
  ExternalLink,
  Search,
  Shield,
  FileText,
  Clock,
  ArrowUpRight,
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const IMPACT_COLORS = ['hsl(0, 72%, 51%)', 'hsl(38, 92%, 55%)', 'hsl(215, 80%, 52%)']

export default function PolicyChanges() {
  const [policyFilter, setPolicyFilter] = useState<string>('all')
  const [searchText, setSearchText] = useState('')
  const { toasts, showToast, dismiss } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const impactStyle: Record<string, string> = {
    high: 'bg-destructive/15 text-destructive border-destructive/20',
    medium: 'bg-warning/15 text-warning border-warning/20',
    low: 'bg-sky-500/15 text-sky-400 border-sky-500/20',
  }
  const impactLabel: Record<string, string> = { high: '高影响', medium: '中等', low: '低' }

  const filteredPolicies = policyItems.filter((p) => {
    const matchFilter = policyFilter === 'all' || p.impactLevel === policyFilter
    const matchSearch = !searchText || p.title.toLowerCase().includes(searchText.toLowerCase())
    return matchFilter && matchSearch
  })

  // 影响级别分布
  const impactDistribution = [
    { name: '高影响', value: policyItems.filter((p) => p.impactLevel === 'high').length, color: IMPACT_COLORS[0] },
    { name: '中等', value: policyItems.filter((p) => p.impactLevel === 'medium').length, color: IMPACT_COLORS[1] },
    { name: '低', value: policyItems.filter((p) => p.impactLevel === 'low').length, color: IMPACT_COLORS[2] },
  ]

  // 按发布机构分类
  const institutionGroups = policyItems.reduce(
    (acc, item) => {
      acc[item.institution] = (acc[item.institution] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // KPI
  const kpiStats = [
    {
      label: '存续监控政策',
      value: policyItems.length,
      icon: ScrollText,
      color: 'text-primary',
      bg: 'bg-primary/15',
      badge: '监控中',
      badgeBg: 'bg-primary/10 text-primary',
    },
    {
      label: '高影响政策',
      value: policyItems.filter((p) => p.impactLevel === 'high').length,
      icon: AlertTriangle,
      color: 'text-destructive',
      bg: 'bg-destructive/15',
      badge: '需关注',
      badgeBg: 'bg-destructive/10 text-destructive',
    },
    {
      label: '本月生效',
      value: policyItems.filter((p) => p.effectDate.startsWith('2026-04')).length,
      icon: Clock,
      color: 'text-warning',
      bg: 'bg-warning/15',
      badge: '即将生效',
      badgeBg: 'bg-warning/10 text-warning',
    },
    {
      label: '关联MOT规则',
      value: new Set(policyItems.flatMap((p) => p.relatedMOTRules)).size,
      icon: Shield,
      color: 'text-success',
      bg: 'bg-success/15',
      badge: '已关联',
      badgeBg: 'bg-success/10 text-success',
    },
  ]

  return (
    <div className="flex gap-6 animate-fade-in">
      {/* 左侧：主内容区 */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">政策变化</h1>
            <p className="mt-1 text-sm text-muted-foreground">政策法规监控 · 影响评估 · MOT规则关联</p>
          </div>
          <Button variant="outline" size="sm" disabled={isRefreshing} onClick={() => {
            setIsRefreshing(true)
            setTimeout(() => { setIsRefreshing(false); showToast('政策数据已刷新') }, 800)
          }}>
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? '刷新中...' : '刷新'}
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-4 animate-stagger">
          {kpiStats.map((kpi) => {
            const Icon = kpi.icon
            return (
              <Card key={kpi.label} className="group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-md ${kpi.bg}`}>
                      <Icon className={`h-4.5 w-4.5 ${kpi.color}`} />
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${kpi.badgeBg}`}>{kpi.badge}</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Policy List */}
          <div className="col-span-2">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    政策法规实时监控
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="搜索政策..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="h-8 w-40 rounded-md border border-border bg-secondary/50 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                      {[
                        { key: 'all', label: '全部' },
                        { key: 'high', label: '高影响' },
                        { key: 'medium', label: '中等' },
                        { key: 'low', label: '低' },
                      ].map((f) => (
                        <button
                          key={f.key}
                          onClick={() => setPolicyFilter(f.key)}
                          className={`rounded px-2.5 py-1 text-[11px] font-medium transition-all ${
                            policyFilter === f.key
                              ? 'bg-primary/15 text-primary border border-primary/30'
                              : 'text-muted-foreground hover:text-foreground border border-transparent'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {filteredPolicies.map((policy) => (
                    <div key={policy.id} className="px-5 py-4 transition-colors hover:bg-secondary/30">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold text-foreground">{policy.title}</h3>
                            <Badge className={`text-[10px] border ${impactStyle[policy.impactLevel]}`}>{impactLabel[policy.impactLevel]}</Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="bg-secondary px-1.5 py-0.5 rounded text-foreground/70">{policy.institution}</span>
                            <span>{policy.type}</span>
                            <span>
                              生效: <span className="text-foreground/70">{policy.effectDate}</span>
                            </span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="shrink-0" onClick={() => showToast(`已打开政策原文: ${policy.title}`, 'info')}>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{policy.summary}</p>
                      {policy.relatedMOTRules.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2">
                          <span className="text-[10px] text-muted-foreground">关联MOT规则:</span>
                          {policy.relatedMOTRules.map((r) => (
                            <span key={r} className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
                              {r}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Impact Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">影响级别分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie data={impactDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                        {impactDistribution.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '4px',
                          fontSize: '12px',
                          color: 'hsl(var(--foreground))',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 space-y-2">
                  {impactDistribution.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
                        <span className="text-foreground">{item.name}</span>
                      </div>
                      <span className="text-muted-foreground font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Institution Groups */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  发布机构分布
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {Object.entries(institutionGroups)
                  .sort(([, a], [, b]) => b - a)
                  .map(([institution, count]) => (
                    <div key={institution} className="flex items-center justify-between">
                      <span className="text-xs text-foreground">{institution}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${(count / policyItems.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-muted-foreground font-medium tabular-nums">{count}</span>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Upcoming Effective Dates */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-warning" />
                  即将生效
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5">
                {[...policyItems]
                  .sort((a, b) => a.effectDate.localeCompare(b.effectDate))
                  .slice(0, 4)
                  .map((policy) => (
                    <div key={policy.id} className="flex items-start gap-2 group cursor-pointer">
                      <div className="mt-1 h-1.5 w-1.5 rounded-full bg-warning shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground group-hover:text-primary transition-colors truncate">{policy.title}</p>
                        <p className="text-[10px] text-muted-foreground">{policy.effectDate}</p>
                      </div>
                      <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* 右侧：AI 策略推荐 */}
      <div className="w-[340px] shrink-0">
        <div className="sticky top-4">
          <MOTRecommendationPanel
            title="政策变化 · AI 策略推荐"
            recommendations={policyRecommendations}
            onAdopt={(rec) => showToast(`策略「${rec.title}」已采纳，将在策略中心创建草稿`, 'success')}
          />
        </div>
      </div>

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  )
}
