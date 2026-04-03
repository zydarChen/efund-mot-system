import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { marketIndices, marketEvents, customerRiskSentiment, macroIndicators } from '@/data/marketData'
import { analyticsData } from '@/data/mockData'
import { useToast, ToastContainer } from '@/components/ui/toast'
import MOTRecommendationPanel, { marketRecommendations } from '@/components/strategy/MOTRecommendation'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Activity,
  BarChart3,
  Globe,
  RefreshCw,
  Zap,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  Heart,
  Target,
} from 'lucide-react'
import {
  LineChart,
  Line,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'

const COLORS = ['hsl(215, 80%, 52%)', 'hsl(38, 92%, 55%)', 'hsl(168, 70%, 42%)', 'hsl(280, 60%, 55%)', 'hsl(0, 72%, 51%)']

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((v, i) => ({ idx: i, value: v }))
  return (
    <ResponsiveContainer width="100%" height={48}>
      <LineChart data={chartData}>
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={1.5} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

const radarData = [
  { dimension: '响应及时性', value: 88 },
  { dimension: '服务覆盖率', value: 95 },
  { dimension: '客户满意度', value: 87 },
  { dimension: '转化率', value: 43 },
  { dimension: '留存率', value: 96 },
  { dimension: '个性化程度', value: 82 },
]

export default function MarketAnalysis() {
  const [indices, setIndices] = useState(marketIndices)
  const [activeTab, setActiveTab] = useState<'market' | 'performance'>('market')
  const { toasts, showToast, dismiss } = useToast()
  const [isRefreshing, setIsRefreshing] = useState(false)

  // simulate real-time price ticks
  useEffect(() => {
    const timer = setInterval(() => {
      setIndices((prev) =>
        prev.map((idx) => {
          const delta = (Math.random() - 0.48) * idx.value * 0.001
          const newValue = +(idx.value + delta).toFixed(2)
          const newChange = +(idx.change + delta).toFixed(2)
          const newPercent = +((newChange / (newValue - newChange)) * 100).toFixed(2)
          return {
            ...idx,
            value: newValue,
            change: newChange,
            changePercent: newPercent,
            trend: [...idx.trend.slice(1), newValue],
          }
        }),
      )
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const data = analyticsData

  const statusStyle: Record<string, string> = {
    triggered: 'bg-destructive/15 text-destructive border-destructive/20',
    monitoring: 'bg-warning/15 text-warning border-warning/20',
    resolved: 'bg-success/15 text-success border-success/20',
  }
  const statusLabel: Record<string, string> = {
    triggered: '已触发',
    monitoring: '监控中',
    resolved: '已处理',
  }

  return (
    <div className="flex gap-6 animate-fade-in">
      {/* 左侧：主内容区 */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">行情分析</h1>
            <p className="mt-1 text-sm text-muted-foreground">实时行情监控 · 宏观经济 · 服务效果分析</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-md bg-success/10 px-2.5 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              <span className="text-xs text-success font-medium">实时行情已连接</span>
            </div>
            <Button variant="outline" size="sm" disabled={isRefreshing} onClick={() => {
              setIsRefreshing(true)
              setTimeout(() => { setIsRefreshing(false); showToast('行情数据已刷新') }, 800)
            }}>
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? '刷新中...' : '刷新'}
            </Button>
          </div>
        </div>

        {/* Market Index Cards */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-4 animate-stagger">
          {indices.map((idx) => {
            const isUp = idx.changePercent >= 0
            return (
              <Card key={idx.code} className="group transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{idx.name}</p>
                      <span className="text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">{idx.code}</span>
                    </div>
                    {isUp ? <ArrowUpRight className="h-4 w-4 text-destructive" /> : <ArrowDownRight className="h-4 w-4 text-success" />}
                  </div>
                  <p className={`text-2xl font-bold tabular-nums ${isUp ? 'text-destructive' : 'text-success'}`}>
                    {idx.value.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                  </p>
                  <p className={`text-xs font-medium tabular-nums ${isUp ? 'text-destructive' : 'text-success'}`}>
                    {isUp ? '+' : ''}
                    {idx.change.toFixed(2)} ({isUp ? '+' : ''}
                    {idx.changePercent.toFixed(2)}%)
                  </p>
                  <div className="mt-2 -mx-1">
                    <MiniSparkline data={idx.trend} color={isUp ? 'hsl(0 72% 51%)' : 'hsl(152 68% 45%)'} />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border pb-px">
          {[
            { key: 'market', label: '行情与事件', icon: Activity },
            { key: 'performance', label: '服务效果分析', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
                  activeTab === tab.key ? 'text-primary border-primary' : 'text-muted-foreground border-transparent hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab: Market & Events */}
        {activeTab === 'market' && (
          <div className="grid grid-cols-3 gap-6">
            {/* Event Monitoring */}
            <div className="col-span-2 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Zap className="h-4 w-4 text-warning" />
                    事件触发监控
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {marketEvents.map((event) => (
                      <div key={event.id} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-secondary/30">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                            event.status === 'triggered'
                              ? 'bg-destructive/15'
                              : event.status === 'monitoring'
                                ? 'bg-warning/15'
                                : 'bg-success/15'
                          }`}
                        >
                          {event.status === 'triggered' ? (
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          ) : event.status === 'monitoring' ? (
                            <Activity className="h-4 w-4 text-warning" />
                          ) : (
                            <Zap className="h-4 w-4 text-success" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{event.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{event.triggerCondition}</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>{event.affectedCustomers.toLocaleString()}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 max-w-[180px]">
                          {event.triggeredRules.slice(0, 2).map((rule) => (
                            <span
                              key={rule}
                              className="inline-block rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary truncate max-w-[85px]"
                            >
                              {rule}
                            </span>
                          ))}
                        </div>
                        <Badge className={`text-[10px] border ${statusStyle[event.status]}`}>{statusLabel[event.status]}</Badge>
                        <span className="text-[11px] text-muted-foreground whitespace-nowrap">{event.timestamp.split(' ')[1]}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Customer Risk Sentiment */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    客户群风险情绪
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {customerRiskSentiment.map((item) => (
                    <div key={item.group}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-foreground font-medium">{item.group}</span>
                        <span className="text-muted-foreground">{item.score}/100</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${item.score}%`,
                            background:
                              item.score > 60
                                ? 'hsl(var(--destructive))'
                                : item.score > 40
                                  ? 'hsl(var(--warning))'
                                  : 'hsl(var(--success))',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Macro Indicators */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Globe className="h-4 w-4 text-accent" />
                    宏观经济指标
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border">
                    {macroIndicators.map((item) => (
                      <div key={item.name} className="flex items-center justify-between px-5 py-2.5">
                        <div>
                          <p className="text-xs font-medium text-foreground">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground">{item.period}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-foreground tabular-nums">{item.value}</span>
                          {item.trend === 'up' ? (
                            <TrendingUp className="h-3 w-3 text-destructive" />
                          ) : item.trend === 'down' ? (
                            <TrendingDown className="h-3 w-3 text-success" />
                          ) : (
                            <Minus className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Tab: Performance Analysis */}
        {activeTab === 'performance' && (
          <div className="space-y-6">
            {/* Top Stats */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-4">
              {[
                { label: '服务响应率', value: '88.2%', change: '+5.9%', icon: TrendingUp, accent: 'bg-primary/15 text-primary' },
                { label: '客户满意度', value: '87.3%', change: '+2.2%', icon: Heart, accent: 'bg-success/15 text-success' },
                { label: '服务转化率', value: '42.8%', change: '+4.3%', icon: Target, accent: 'bg-gold/15 text-gold' },
                { label: '客户留存率', value: '96.2%', change: '+0.8%', icon: Users, accent: 'bg-accent/15 text-accent' },
              ].map((stat) => {
                const Icon = stat.icon
                return (
                  <Card key={stat.label}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                          <p className="mt-1 text-2xl font-bold text-foreground">{stat.value}</p>
                          <div className="mt-1 flex items-center gap-1 text-xs text-success">
                            <ArrowUpRight className="h-3 w-3" />
                            {stat.change} 较上月
                          </div>
                        </div>
                        <div className={`flex h-10 w-10 items-center justify-center rounded ${stat.accent}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-3 gap-4">
              {/* Service Effectiveness Trend */}
              <Card className="col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      服务效果趋势
                    </CardTitle>
                    <Badge variant="default">近6个月</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.serviceEffectiveness}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" fontSize={12} tickFormatter={(v) => v.split('-')[1] + '月'} />
                        <YAxis fontSize={12} domain={[30, 100]} />
                        <Tooltip
                          contentStyle={{
                            background: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '4px',
                            fontSize: '12px',
                            color: 'hsl(var(--foreground))',
                          }}
                        />
                        <Line type="monotone" dataKey="responseRate" stroke="hsl(215, 80%, 52%)" strokeWidth={2} dot={{ fill: 'hsl(215, 80%, 52%)', r: 4 }} name="响应率(%)" />
                        <Line type="monotone" dataKey="satisfactionRate" stroke="hsl(168, 70%, 42%)" strokeWidth={2} dot={{ fill: 'hsl(168, 70%, 42%)', r: 4 }} name="满意度(%)" />
                        <Line type="monotone" dataKey="conversionRate" stroke="hsl(38, 92%, 55%)" strokeWidth={2} dot={{ fill: 'hsl(38, 92%, 55%)', r: 4 }} name="转化率(%)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Service Radar */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-gold" />
                    服务能力雷达
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="dimension" fontSize={11} />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} fontSize={10} />
                        <Radar name="当前水平" dataKey="value" stroke="hsl(215, 80%, 52%)" fill="hsl(215, 80%, 52%)" fillOpacity={0.2} strokeWidth={2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Customer Segment Analysis */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    客户分群分析
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.customerSegmentAnalysis.map((segment, index) => (
                      <div key={segment.type} className="rounded-lg border border-border p-4 transition-colors hover:border-primary/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-3 w-3 rounded-full" style={{ background: COLORS[index] }} />
                            <span className="text-sm font-semibold text-foreground">{segment.type}</span>
                            <Badge variant="secondary">{segment.count.toLocaleString()}人</Badge>
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">人均资产</p>
                            <p className="text-sm font-bold text-foreground">&yen;{(segment.avgAssets / 10000).toFixed(1)}万</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">满意度</p>
                            <p className="text-sm font-bold text-foreground">{segment.avgSatisfaction}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">留存率</p>
                            <p className="text-sm font-bold text-success">{segment.retentionRate}%</p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="h-1.5 w-full rounded-full bg-secondary">
                            <div
                              className="h-1.5 rounded-full transition-all duration-700"
                              style={{ width: `${segment.retentionRate}%`, background: COLORS[index] }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top MOT Rules */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-gold" />
                    TOP5 MOT 规则效果
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.topMotRules} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis type="number" fontSize={12} />
                        <YAxis
                          type="category"
                          dataKey="name"
                          fontSize={11}
                          width={140}
                          tickFormatter={(v: string) => (v.length > 10 ? v.substring(0, 10) + '...' : v)}
                        />
                        <Tooltip
                          contentStyle={{
                            background: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '4px',
                            fontSize: '12px',
                            color: 'hsl(var(--foreground))',
                          }}
                        />
                        <Bar dataKey="triggers" name="触发次数" radius={[0, 4, 4, 0]}>
                          {data.topMotRules.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4 space-y-2">
                    {data.topMotRules.map((rule, index) => (
                      <div key={rule.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className="flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold"
                            style={{ background: COLORS[index] + '22', color: COLORS[index] }}
                          >
                            {index + 1}
                          </span>
                          <span className="text-muted-foreground truncate max-w-[200px]">{rule.name}</span>
                        </div>
                        <span className="text-success font-medium">{rule.successRate}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* 右侧：AI 策略推荐 */}
      <div className="w-[340px] shrink-0">
        <div className="sticky top-4">
          <MOTRecommendationPanel
            title="行情分析 · AI 策略推荐"
            recommendations={marketRecommendations}
            onAdopt={(rec) => showToast(`策略「${rec.title}」已采纳，将在策略中心创建草稿`, 'success')}
          />
        </div>
      </div>

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  )
}
