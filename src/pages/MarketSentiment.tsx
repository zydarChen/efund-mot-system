import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { sentimentItems, responseStrategies } from '@/data/policyData'
import { useToast, ToastContainer } from '@/components/ui/toast'
import MOTRecommendationPanel, { sentimentRecommendations } from '@/components/strategy/MOTRecommendation'
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Flame,
  TrendingUp,
  RefreshCw,
  Copy,
  ArrowUpRight,
  Zap,
  Filter,
  Search,
  AlertTriangle,
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'

const COLORS = ['hsl(168, 70%, 42%)', 'hsl(0, 72%, 51%)', 'hsl(215, 20%, 55%)']

export default function MarketSentiment() {
  const [sentimentFilter, setSentimentFilter] = useState<string>('all')
  const [searchText, setSearchText] = useState('')
  const { toasts, showToast, dismiss } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const sentimentDistribution = [
    { name: '正面', value: sentimentItems.filter((s) => s.sentiment === 'positive').length, color: COLORS[0] },
    { name: '负面', value: sentimentItems.filter((s) => s.sentiment === 'negative').length, color: COLORS[1] },
    { name: '中性', value: sentimentItems.filter((s) => s.sentiment === 'neutral').length, color: COLORS[2] },
  ]

  const sentimentStyle: Record<string, string> = {
    positive: 'bg-success/15 text-success border-success/20',
    negative: 'bg-destructive/15 text-destructive border-destructive/20',
    neutral: 'bg-muted text-muted-foreground border-border',
  }
  const sentimentLabel: Record<string, string> = { positive: '正面', negative: '负面', neutral: '中性' }

  // 按来源分布统计
  const sourceStats = sentimentItems.reduce(
    (acc, item) => {
      acc[item.source] = (acc[item.source] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )
  const sourceChartData = Object.entries(sourceStats)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  const filteredItems = sentimentItems.filter((item) => {
    const matchFilter = sentimentFilter === 'all' || item.sentiment === sentimentFilter
    const matchSearch = !searchText || item.title.toLowerCase().includes(searchText.toLowerCase())
    return matchFilter && matchSearch
  })

  // KPI
  const kpiStats = [
    {
      label: '全网舆情声量',
      value: (sentimentItems.length * 128).toLocaleString(),
      icon: MessageSquare,
      color: 'text-primary',
      bg: 'bg-primary/15',
      badge: '24h',
      badgeBg: 'bg-primary/10 text-primary',
    },
    {
      label: '负面舆情占比',
      value: Math.round((sentimentItems.filter((s) => s.sentiment === 'negative').length / sentimentItems.length) * 100) + '%',
      icon: AlertTriangle,
      color: 'text-destructive',
      bg: 'bg-destructive/15',
      badge: '需关注',
      badgeBg: 'bg-destructive/10 text-destructive',
    },
    {
      label: '最高热度',
      value: Math.max(...sentimentItems.map((s) => s.heatScore)),
      icon: Flame,
      color: 'text-warning',
      bg: 'bg-warning/15',
      badge: 'TOP1',
      badgeBg: 'bg-warning/10 text-warning',
    },
    {
      label: '应对策略库',
      value: responseStrategies.length,
      icon: Zap,
      color: 'text-success',
      bg: 'bg-success/15',
      badge: '可用',
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
            <h1 className="text-2xl font-bold text-foreground">市场舆情</h1>
            <p className="mt-1 text-sm text-muted-foreground">舆情实时监控 · 情感分析 · 标准应对策略库</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-md bg-success/10 px-2.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-success font-medium">舆情监控中</span>
            </div>
            <Button variant="outline" size="sm" disabled={isRefreshing} onClick={() => {
              setIsRefreshing(true)
              setTimeout(() => { setIsRefreshing(false); showToast('舆情数据已刷新') }, 800)
            }}>
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? '刷新中...' : '刷新'}
            </Button>
          </div>
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
                  <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Sentiment Feed */}
          <div className="col-span-2 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    舆情实时监控
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="搜索舆情..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="h-8 w-40 rounded-md border border-border bg-secondary/50 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                      {[
                        { key: 'all', label: '全部' },
                        { key: 'positive', label: '正面' },
                        { key: 'negative', label: '负面' },
                        { key: 'neutral', label: '中性' },
                      ].map((f) => (
                        <button
                          key={f.key}
                          onClick={() => setSentimentFilter(f.key)}
                          className={`rounded px-2.5 py-1 text-[11px] font-medium transition-all ${
                            sentimentFilter === f.key
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
                  {filteredItems.map((item) => (
                    <div key={item.id} className="px-5 py-4 transition-colors hover:bg-secondary/30">
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg mt-0.5 ${
                            item.sentiment === 'positive'
                              ? 'bg-success/15'
                              : item.sentiment === 'negative'
                                ? 'bg-destructive/15'
                                : 'bg-secondary'
                          }`}
                        >
                          {item.sentiment === 'positive' ? (
                            <ThumbsUp className="h-4 w-4 text-success" />
                          ) : item.sentiment === 'negative' ? (
                            <ThumbsDown className="h-4 w-4 text-destructive" />
                          ) : (
                            <Minus className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium text-foreground">{item.title}</h4>
                            <Badge className={`text-[10px] border ${sentimentStyle[item.sentiment]}`}>{sentimentLabel[item.sentiment]}</Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="bg-secondary px-1.5 py-0.5 rounded text-foreground/70">{item.source}</span>
                            <span className="flex items-center gap-1">
                              <Flame className="h-3 w-3 text-warning" />
                              热度 {item.heatScore}
                            </span>
                            <span>{item.publishTime}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            <span className="text-[10px] text-muted-foreground">传播链:</span>
                            {item.sourceChain.map((s, i) => (
                              <span key={i} className="flex items-center gap-1">
                                <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-foreground/70">{s}</span>
                                {i < item.sourceChain.length - 1 && <span className="text-[10px] text-muted-foreground">&rarr;</span>}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Response Strategies */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-warning" />
                  标准应对策略库
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-2 gap-4 p-5">
                  {responseStrategies.map((strategy) => (
                    <div key={strategy.id} className="rounded-lg border border-border p-4 transition-colors hover:border-primary/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-md ${
                              strategy.urgency === 'high' ? 'bg-destructive/15' : 'bg-warning/15'
                            }`}
                          >
                            <Zap className={`h-3.5 w-3.5 ${strategy.urgency === 'high' ? 'text-destructive' : 'text-warning'}`} />
                          </div>
                          <span className="text-sm font-medium text-foreground">{strategy.scenario}</span>
                        </div>
                        <Badge
                          className={`text-[10px] border ${
                            strategy.urgency === 'high'
                              ? 'bg-destructive/15 text-destructive border-destructive/20'
                              : 'bg-warning/15 text-warning border-warning/20'
                          }`}
                        >
                          {strategy.urgency === 'high' ? '紧急' : '一般'}
                        </Badge>
                      </div>
                      <div className="relative rounded bg-secondary/50 p-2.5 mb-2">
                        <p className="text-[11px] text-foreground/80 leading-relaxed pr-5">{strategy.script}</p>
                        <button className="absolute top-1.5 right-1.5 text-muted-foreground hover:text-foreground transition-colors">
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-[10px] text-muted-foreground">推荐渠道: {strategy.channel}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Sentiment Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">情感分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie data={sentimentDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                        {sentimentDistribution.map((entry, i) => (
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
                  {sentimentDistribution.map((item) => (
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

            {/* Source Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">来源渠道分布</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sourceChartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                      <XAxis type="number" fontSize={11} />
                      <YAxis type="category" dataKey="name" fontSize={11} width={70} />
                      <Tooltip
                        contentStyle={{
                          background: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '4px',
                          fontSize: '12px',
                          color: 'hsl(var(--foreground))',
                        }}
                      />
                      <Bar dataKey="count" fill="hsl(215, 80%, 52%)" radius={[0, 4, 4, 0]} name="舆情数量" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Hot Topics */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-warning" />
                  热门话题
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[...sentimentItems]
                  .sort((a, b) => b.heatScore - a.heatScore)
                  .slice(0, 5)
                  .map((item, i) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold ${
                          i < 3 ? 'bg-destructive/15 text-destructive' : 'bg-secondary text-muted-foreground'
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className="text-xs text-foreground flex-1 truncate">{item.title}</span>
                      <span className="text-[10px] text-muted-foreground tabular-nums">{item.heatScore}</span>
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
            title="市场舆情 · AI 策略推荐"
            recommendations={sentimentRecommendations}
            onAdopt={(rec) => showToast(`策略「${rec.title}」已采纳，将在策略中心创建草稿`, 'success')}
          />
        </div>
      </div>

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  )
}
