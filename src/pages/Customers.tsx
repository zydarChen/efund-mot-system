import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { customers } from '@/data/mockData'
import type { Customer } from '@/data/mockData'
import { useToast, ToastContainer } from '@/components/ui/toast'
import MOTRecommendationPanel, { allRecommendations } from '@/components/strategy/MOTRecommendation'
import {
  Users,
  Search,
  Filter,
  ChevronRight,
  Wallet,
  Calendar,
  MapPin,
  Briefcase,
  GraduationCap,
  Phone,
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  MessageSquare,
  Smartphone,
  BookOpen,
  Headphones,
  Share2,
  Heart,
  Brain,
  Star,
  Globe,
  Activity,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  Award,
  Zap,
  BarChart3,
  Clock,
  Eye,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'

const HOLDING_COLORS = [
  'hsl(215, 80%, 52%)',
  'hsl(168, 70%, 42%)',
  'hsl(38, 92%, 55%)',
  'hsl(280, 60%, 55%)',
  'hsl(0, 72%, 51%)',
  'hsl(200, 85%, 58%)',
  'hsl(320, 65%, 50%)',
  'hsl(45, 85%, 50%)',
  'hsl(120, 60%, 45%)',
  'hsl(260, 70%, 60%)',
]

const typeColorMap: Record<string, string> = {
  value: 'default',
  active: 'warning',
  beginner: 'success',
}

const stageColorMap: Record<string, string> = {
  acquisition: 'success',
  growth: 'default',
  mature: 'gold',
  retention: 'warning',
  churn: 'destructive',
}

const chartTooltipStyle = {
  background: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '4px',
  fontSize: '12px',
  color: 'hsl(var(--foreground))',
}

const sentimentColorMap = {
  positive: 'text-success',
  neutral: 'text-gold',
  negative: 'text-destructive',
}

const sentimentLabelMap = {
  positive: '积极',
  neutral: '中性',
  negative: '消极',
}

// ===== Tab 定义 =====
type TabKey = 'overview' | 'behavior' | 'community' | 'investment' | 'service'
const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'overview', label: '资产概览', icon: Wallet },
  { key: 'behavior', label: '行为分析', icon: Activity },
  { key: 'community', label: '社区画像', icon: MessageSquare },
  { key: 'investment', label: '投资能力', icon: Brain },
  { key: 'service', label: '服务记录', icon: Headphones },
]

// ===== 小型指标卡片 =====
function MiniStat({ icon: Icon, label, value, color = 'text-primary' }: { icon: React.ElementType; label: string; value: string | number; color?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-foreground">{value}</p>
        <p className="text-[10px] text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

// ===== 进度条 =====
function ProgressBar({ value, max = 100, color = 'bg-primary' }: { value: number; max?: number; color?: string }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
      <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

// ===== 客户列表 =====
function CustomerList({ customers: custs, onSelect }: { customers: Customer[]; onSelect: (c: Customer) => void }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const { toasts, showToast, dismiss } = useToast()

  const filtered = custs.filter((c) => {
    const matchSearch = c.name.includes(searchTerm) || c.city.includes(searchTerm)
    const matchType = filterType === 'all' || c.customerType === filterType
    return matchSearch && matchType
  })

  return (
    <div className="flex gap-6">
      {/* 左侧：主内容区 */}
      <div className="flex-1 min-w-0 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">客户画像</h1>
          <p className="mt-1 text-sm text-muted-foreground">基于13大维度的客户360°全景视图 · {custs.length}位客户</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索客户姓名、城市..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-64 rounded-lg border border-border bg-secondary pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {[
          { key: 'all', label: '全部客户' },
          { key: 'value', label: '稳健价值型' },
          { key: 'active', label: '积极交易型' },
          { key: 'beginner', label: '新手小白型' },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setFilterType(item.key)}
            className={`rounded px-3 py-1.5 text-xs font-medium transition-all ${
              filterType === item.key
                ? 'bg-primary/15 text-primary border border-primary/30'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent'
            }`}
          >
            {item.label}
          </button>
        ))}
        <span className="ml-2 text-xs text-muted-foreground">共 {filtered.length} 位客户</span>
      </div>

      {/* Customer Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filtered.map((customer) => (
          <Card
            key={customer.id}
            className="cursor-pointer transition-all duration-200 hover:border-primary/30 hover:shadow-md"
            onClick={() => onSelect(customer)}
          >
            <CardContent className="p-5">
              <div className="flex items-center gap-5">
                {/* Avatar */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-xl font-bold text-primary">
                  {customer.avatar}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-foreground">{customer.name}</h3>
                    <Badge variant={typeColorMap[customer.customerType] as 'default'}>{customer.typeLabel}</Badge>
                    <Badge variant={stageColorMap[customer.lifecycleStage] as 'default'}>{customer.stageLabel}</Badge>
                  </div>
                  <div className="mt-1.5 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{customer.city}</span>
                    <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{customer.occupation}</span>
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{customer.phone}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    {customer.tags.map((tag) => (
                      <span key={tag} className="rounded-md bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 xl:gap-8 shrink-0">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">总资产</p>
                    <p className="text-lg font-bold text-foreground">¥{(customer.totalAssets / 10000).toFixed(1)}万</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">满意度</p>
                    <p className="text-lg font-bold text-foreground">{customer.satisfaction}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">持有天数</p>
                    <p className="text-lg font-bold text-foreground">{customer.holdingDays}天</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      </div>

      {/* 右侧：AI 策略推荐 */}
      <div className="w-[340px] shrink-0">
        <div className="sticky top-4">
          <MOTRecommendationPanel
            title="客户360 · AI策略推荐"
            recommendations={allRecommendations}
            onAdopt={(rec) => showToast(`策略「${rec.title}」已采纳，将在策略中心创建草稿`, 'success')}
          />
        </div>
      </div>

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  )
}

// ===== Tab: 资产概览 =====
function OverviewTab({ customer }: { customer: Customer }) {
  const holdingData = customer.holdings.map((h) => ({
    name: h.fundName.replace('易方达', ''),
    value: h.percentage,
    amount: h.amount,
  }))

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-3 gap-4">
        {/* Asset Allocation */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>资产配置</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={holdingData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={2} dataKey="value" nameKey="name">
                    {holdingData.map((_, index) => (
                      <Cell key={index} fill={HOLDING_COLORS[index % HOLDING_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(value: number) => [`${value}%`, '占比']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-1">
              {holdingData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-2 w-2 shrink-0 rounded-full" style={{ background: HOLDING_COLORS[index] }} />
                    <span className="text-muted-foreground truncate">{item.name}</span>
                  </div>
                  <span className="font-medium text-foreground shrink-0">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Holdings Detail */}
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>持仓明细</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {customer.holdings.map((holding, index) => (
                <div key={holding.fundName} className="flex items-center gap-4 rounded-lg bg-secondary/50 p-3 transition-colors hover:bg-secondary">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: HOLDING_COLORS[index] + '22', color: HOLDING_COLORS[index] }}>
                    {holding.fundType.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{holding.fundName}</p>
                    <p className="text-xs text-muted-foreground">{holding.fundType} · 持有{holding.holdingDays}天</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-foreground">¥{holding.amount.toLocaleString()}</p>
                    <div className="flex items-center justify-end gap-1">
                      {holding.returnRate >= 0 ? <TrendingUp className="h-3 w-3 text-success" /> : <TrendingDown className="h-3 w-3 text-destructive" />}
                      <span className={`text-xs font-medium ${holding.returnRate >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {holding.returnRate > 0 ? '+' : ''}{holding.returnRate}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>近期交易记录</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {customer.transactions.map((tx, index) => (
              <div key={index} className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-secondary/50">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  tx.action === 'buy' ? 'bg-success/15 text-success' : tx.action === 'sell' ? 'bg-destructive/15 text-destructive' : 'bg-gold/15 text-gold'
                }`}>
                  {tx.action === 'buy' ? '买' : tx.action === 'sell' ? '卖' : '分'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{tx.fund}</p>
                  <p className="text-xs text-muted-foreground">{tx.description}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${tx.action === 'buy' ? 'text-success' : tx.action === 'sell' ? 'text-destructive' : 'text-gold'}`}>
                    {tx.action === 'buy' ? '+' : tx.action === 'sell' ? '-' : '+'}¥{tx.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Basic Info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>基本信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 text-sm">
            <div><span className="text-muted-foreground">性别：</span><span className="text-foreground">{customer.gender}</span></div>
            <div><span className="text-muted-foreground">年龄：</span><span className="text-foreground">{customer.age}岁</span></div>
            <div><span className="text-muted-foreground">学历：</span><span className="text-foreground">{customer.education}</span></div>
            <div><span className="text-muted-foreground">收入：</span><span className="text-foreground">{customer.monthlyIncome}</span></div>
            <div><span className="text-muted-foreground">电话：</span><span className="text-foreground">{customer.phone}</span></div>
            <div><span className="text-muted-foreground">城市：</span><span className="text-foreground">{customer.city}</span></div>
            <div><span className="text-muted-foreground">最后活跃：</span><span className="text-foreground">{customer.lastActivity}</span></div>
            <div><span className="text-muted-foreground">客户ID：</span><span className="text-foreground">{customer.id}</span></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ===== Tab: 行为分析 =====
function BehaviorTab({ customer }: { customer: Customer }) {
  const app = customer.appBehavior
  const content = customer.contentConsumption
  const channel = customer.channelPreference

  const featureData = app.topFeatures.map((f) => ({ name: f.feature, value: f.usagePercent }))

  return (
    <div className="space-y-4 animate-fade-in">
      {/* APP行为概览 */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-primary" />
              APP行为分析
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <MiniStat icon={Activity} label="月登录频次" value={`${app.loginFrequency}次`} color="text-primary" />
              <MiniStat icon={Clock} label="平均时长" value={`${app.avgSessionMinutes}分钟`} color="text-gold" />
              <MiniStat icon={Eye} label="月浏览页面" value={`${app.monthlyPageViews}页`} color="text-success" />
              <MiniStat icon={Zap} label="推送打开率" value={`${app.notificationOpenRate}%`} color="text-accent" />
            </div>
            <div className="mt-4 space-y-1.5">
              <p className="text-xs text-muted-foreground">最后登录：{app.lastLoginTime}</p>
              <p className="text-xs text-muted-foreground">设备：{app.deviceType} · 活跃时段：{app.preferredTimeSlot}</p>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-muted-foreground mb-2">近期搜索</p>
              <div className="flex flex-wrap gap-1.5">
                {app.recentSearches.map((s) => (
                  <span key={s} className="rounded-md bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">{s}</span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-gold" />
              功能使用分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={featureData} layout="vertical" margin={{ left: 0, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" className="[&_line]:!stroke-chart-grid" horizontal={false} />
                  <XAxis type="number" className="[&_line]:!stroke-transparent [&_text]:!fill-chart-axis" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" className="[&_line]:!stroke-transparent [&_text]:!fill-chart-axis" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={70} />
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`${v}%`, '使用占比']} />
                  <Bar dataKey="value" fill="hsl(215, 80%, 52%)" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2">
              <p className="text-xs text-muted-foreground">推送点击率：<span className="font-medium text-foreground">{app.notificationClickRate}%</span></p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 内容消费 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-success" />
            内容消费分析
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 xl:grid-cols-5 gap-3">
            <MiniStat icon={BookOpen} label="阅读文章" value={content.articlesRead} color="text-primary" />
            <MiniStat icon={GraduationCap} label="研报阅读" value={content.researchReportsRead} color="text-gold" />
            <MiniStat icon={Eye} label="直播时长" value={`${content.liveStreamHours}h`} color="text-success" />
            <MiniStat icon={Award} label="已完成课程" value={content.coursesCompleted} color="text-accent" />
            <MiniStat icon={Star} label="收藏内容" value={content.favoritedContent} color="text-primary" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">偏好内容类型</p>
              <Badge variant="default">{content.preferredContentType}</Badge>
              <span className="ml-2 text-xs text-muted-foreground">视频完播率 {content.videoCompletionRate}%</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">最近阅读</p>
              {content.recentReads.map((r, i) => (
                <div key={i} className="flex items-center gap-2 text-xs mt-1">
                  <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">{r.type}</span>
                  <span className="text-foreground truncate">{r.title}</span>
                  <span className="text-muted-foreground shrink-0">{r.date}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 渠道偏好 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-accent" />
            渠道偏好分析
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="col-span-3">
              <div className="space-y-3">
                {channel.channels.map((ch) => (
                  <div key={ch.channel} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-foreground font-medium">{ch.channel}</span>
                      <span className="text-muted-foreground">响应率 {ch.responseRate}% · 转化率 {ch.conversionRate}%</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <ProgressBar value={ch.responseRate} color="bg-primary" />
                      </div>
                      <div className="flex-1">
                        <ProgressBar value={ch.conversionRate} color="bg-success" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-4 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> 响应率</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-success" /> 转化率</span>
              </div>
            </div>
            <div className="space-y-3">
              <MiniStat icon={Globe} label="首选渠道" value={channel.preferredChannel} color="text-primary" />
              <MiniStat icon={Clock} label="最佳触达" value={channel.bestReachTime} color="text-gold" />
              <div className="rounded-lg bg-secondary/50 p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{channel.crossChannelScore}</p>
                <p className="text-[10px] text-muted-foreground">跨渠道活跃度</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ===== Tab: 社区画像 =====
function CommunityTab({ customer }: { customer: Customer }) {
  const com = customer.community
  const social = customer.socialRelation

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 社区互动 */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              社区互动数据
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <MiniStat icon={MessageSquare} label="发帖数" value={com.postCount} color="text-primary" />
              <MiniStat icon={MessageSquare} label="回帖数" value={com.replyCount} color="text-gold" />
              <MiniStat icon={ThumbsUp} label="获赞数" value={com.likeReceived} color="text-success" />
              <MiniStat icon={Star} label="收藏数" value={com.favoriteCount} color="text-accent" />
              <MiniStat icon={Share2} label="分享数" value={com.shareCount} color="text-primary" />
              <MiniStat icon={Activity} label="活跃分" value={`${com.activityScore}/100`} color="text-gold" />
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-xs text-muted-foreground">情绪倾向：</span>
              <Badge variant={com.sentimentTrend === 'positive' ? 'success' : com.sentimentTrend === 'negative' ? 'destructive' : 'warning'}>
                {sentimentLabelMap[com.sentimentTrend]}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-destructive" />
              关注偏好
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {com.followedManagers.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-1.5">关注基金经理</p>
                  <div className="flex flex-wrap gap-1.5">
                    {com.followedManagers.map((m) => (
                      <span key={m} className="rounded bg-primary/10 px-2.5 py-0.5 text-xs text-primary">{m}</span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1.5">关注话题</p>
                <div className="flex flex-wrap gap-1.5">
                  {com.followedTopics.map((t) => (
                    <span key={t} className="rounded-md bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 近期发帖 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>近期发帖</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {com.recentPosts.map((post, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg p-3 hover:bg-secondary/50 transition-colors">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  post.sentiment === 'positive' ? 'bg-success/15' : post.sentiment === 'negative' ? 'bg-destructive/15' : 'bg-gold/15'
                }`}>
                  {post.sentiment === 'positive' ? <ThumbsUp className={`h-4 w-4 ${sentimentColorMap[post.sentiment]}`} /> :
                   post.sentiment === 'negative' ? <ThumbsDown className={`h-4 w-4 ${sentimentColorMap[post.sentiment]}`} /> :
                   <MessageSquare className={`h-4 w-4 ${sentimentColorMap[post.sentiment]}`} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{post.title}</p>
                  <p className="text-xs text-muted-foreground">{post.date}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0 text-xs text-muted-foreground">
                  <ThumbsUp className="h-3 w-3" /> {post.likes}
                </div>
              </div>
            ))}
            {com.recentPosts.length === 0 && (
              <p className="text-center text-xs text-muted-foreground py-4">暂无发帖记录</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 社交关系 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-4 w-4 text-accent" />
            社交关系
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 xl:grid-cols-5 gap-3">
            <MiniStat icon={Users} label="推荐客户数" value={social.referralCount} color="text-primary" />
            <MiniStat icon={Wallet} label="推荐资产(万)" value={`¥${(social.referralAssets / 10000).toFixed(1)}`} color="text-gold" />
            <MiniStat icon={Share2} label="分享次数" value={social.shareCount} color="text-success" />
            <MiniStat icon={Users} label="家庭账户" value={social.familyAccounts} color="text-accent" />
            <MiniStat icon={Award} label="KOL影响力" value={`${social.kolScore}/100`} color="text-primary" />
          </div>
          {social.referralHistory.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">推荐记录</p>
              <div className="space-y-1.5">
                {social.referralHistory.map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-xs rounded-lg bg-secondary/50 p-2.5">
                    <span className="text-foreground">{r.referredName}</span>
                    <span className="text-muted-foreground">{r.date}</span>
                    <Badge variant={r.status === '活跃' ? 'success' : 'destructive'} className="text-[10px]">{r.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ===== Tab: 投资能力 =====
function InvestmentTab({ customer }: { customer: Customer }) {
  const inv = customer.investmentAbility

  const radarData = [
    { dimension: '知识水平', value: inv.knowledgeScore },
    { dimension: '决策质量', value: inv.decisionQualityScore },
    { dimension: '择时能力', value: inv.timingAbilityIndex },
    { dimension: '配置合理', value: inv.allocationRationalityScore },
    { dimension: '情绪稳定', value: inv.emotionalStabilityIndex },
  ]

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-2 gap-4">
        {/* 雷达图 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              投资能力雷达图
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%">
                  <PolarGrid className="[&_line]:!stroke-chart-grid [&_circle]:!stroke-chart-grid [&_polygon]:!stroke-chart-grid" />
                  <PolarAngleAxis dataKey="dimension" className="[&_text]:!fill-chart-axis" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} className="[&_text]:!fill-chart-axis" tick={{ fontSize: 9 }} />
                  <Radar name="能力值" dataKey="value" stroke="hsl(215, 80%, 52%)" fill="hsl(215, 80%, 52%)" fillOpacity={0.25} strokeWidth={2} />
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`${v}/100`, '得分']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 能力详情 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-4 w-4 text-gold" />
              能力详情
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg bg-primary/10 p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded bg-primary/20 text-lg font-bold text-primary">
                {inv.knowledgeLevelLabel.charAt(0)}
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">{inv.knowledgeLevelLabel}</p>
                <p className="text-xs text-muted-foreground">投资知识等级 · 综合评分 {inv.knowledgeScore}/100</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { label: '决策质量', value: inv.decisionQualityScore, color: 'bg-primary' },
                { label: '择时能力', value: inv.timingAbilityIndex, color: 'bg-gold' },
                { label: '配置合理性', value: inv.allocationRationalityScore, color: 'bg-success' },
                { label: '情绪稳定性', value: inv.emotionalStabilityIndex, color: 'bg-accent' },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium text-foreground">{item.value}/100</span>
                  </div>
                  <ProgressBar value={item.value} color={item.color} />
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-secondary/50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">情绪画像</span>
                <Badge variant={inv.emotionalStabilityIndex >= 70 ? 'success' : inv.emotionalStabilityIndex >= 40 ? 'warning' : 'destructive'}>
                  {inv.emotionLabel}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 学习测评记录 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>知识测评记录</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {inv.quizHistory.map((q, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
                    <GraduationCap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{q.topic}</p>
                    <p className="text-xs text-muted-foreground">{q.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${q.score >= 80 ? 'text-success' : q.score >= 60 ? 'text-gold' : 'text-destructive'}`}>{q.score}</p>
                  <p className="text-[10px] text-muted-foreground">得分</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ===== Tab: 服务记录 =====
function ServiceTab({ customer }: { customer: Customer }) {
  const svc = customer.serviceInteraction
  const life = customer.lifeEvent

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 客服互动 */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-4 w-4 text-primary" />
              客服互动概览
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <MiniStat icon={MessageSquare} label="累计咨询" value={`${svc.totalInquiries}次`} color="text-primary" />
              <MiniStat icon={Activity} label="月均咨询" value={`${svc.monthlyInquiries}次`} color="text-gold" />
              <MiniStat icon={AlertTriangle} label="投诉次数" value={svc.complaintCount} color={svc.complaintCount > 0 ? 'text-destructive' : 'text-success'} />
              <MiniStat icon={Star} label="服务评分" value={`${svc.avgServiceRating}/5`} color="text-gold" />
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">首选服务渠道：</span>
              <Badge variant="default">{svc.preferredServiceChannel}</Badge>
              {svc.pendingComplaints > 0 && (
                <Badge variant="destructive">{svc.pendingComplaints}个未解决投诉</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-gold" />
              咨询类别分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {svc.issueCategories.map((cat) => {
                const maxCount = Math.max(...svc.issueCategories.map((c) => c.count))
                return (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{cat.category}</span>
                      <span className="font-medium text-foreground">{cat.count}次</span>
                    </div>
                    <ProgressBar value={cat.count} max={maxCount} color="bg-primary" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 近期服务记录 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>近期服务记录</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {svc.recentInteractions.map((inter, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg p-3 hover:bg-secondary/50 transition-colors">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  inter.type === '投诉' ? 'bg-destructive/15 text-destructive' : 'bg-primary/15 text-primary'
                }`}>
                  {inter.type === '投诉' ? <AlertTriangle className="h-4 w-4" /> : <Headphones className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{inter.summary}</p>
                  <p className="text-xs text-muted-foreground">{inter.date} · {inter.type}</p>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`h-3 w-3 ${s <= inter.rating ? 'text-gold fill-gold' : 'text-secondary'}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 生活事件 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-success" />
            生活事件与里程碑
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-muted-foreground">生日</span>
                <span className="text-sm text-foreground">{life.birthday}</span>
                {life.upcomingBirthday && <Badge variant="gold">即将到来</Badge>}
              </div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">人生里程碑</p>
              <div className="space-y-2">
                {life.lifeMilestones.map((m, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-success" />
                    <div>
                      <p className="text-xs text-foreground">{m.event}</p>
                      <p className="text-[10px] text-muted-foreground">{m.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">收入变动</p>
              <div className="space-y-2">
                {life.salaryChangeHistory.map((s, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${s.direction === 'up' ? 'bg-success' : s.direction === 'down' ? 'bg-destructive' : 'bg-gold'}`} />
                    <div>
                      <p className="text-xs text-foreground">{s.description}</p>
                      <p className="text-[10px] text-muted-foreground">{s.date}</p>
                    </div>
                  </div>
                ))}
              </div>
              {life.careerChanges.length > 0 && (
                <>
                  <p className="text-xs font-semibold text-muted-foreground mt-4 mb-2">职业变动</p>
                  <div className="space-y-2">
                    {life.careerChanges.map((c, i) => (
                      <div key={i} className="rounded-lg bg-secondary/50 p-2.5 text-xs">
                        <span className="text-muted-foreground">{c.from}</span>
                        <span className="mx-1.5 text-primary">→</span>
                        <span className="text-foreground font-medium">{c.to}</span>
                        <span className="ml-2 text-muted-foreground">({c.date})</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ===== Tab: 私域画像 =====
function PrivateProfileTab({ customer }: { customer: Customer }) {
  const svc = customer.serviceInteraction
  const life = customer.lifeEvent
  const holdingData = customer.holdings.map(h => ({
    name: h.fundName.length > 6 ? h.fundName.slice(0, 6) + '...' : h.fundName,
    value: Math.round((h.amount / customer.totalAssets) * 100),
  }))

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 资产概览 + 基本信息 */}
      <div className="grid grid-cols-3 gap-4">
        {/* 持仓分布 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-gold" />
              持仓分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={holdingData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                    {holdingData.map((_, index) => (
                      <Cell key={index} fill={HOLDING_COLORS[index % HOLDING_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(value: number) => [`${value}%`, '占比']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-1">
              {holdingData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-2 w-2 shrink-0 rounded-full" style={{ background: HOLDING_COLORS[index] }} />
                    <span className="text-muted-foreground truncate">{item.name}</span>
                  </div>
                  <span className="font-medium text-foreground shrink-0">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 持仓明细 */}
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>持仓明细</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {customer.holdings.map((holding, index) => (
                <div key={holding.fundName} className="flex items-center gap-4 rounded-lg bg-secondary/50 p-3 transition-colors hover:bg-secondary">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: HOLDING_COLORS[index] + '22', color: HOLDING_COLORS[index] }}>
                    {holding.fundType.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{holding.fundName}</p>
                    <p className="text-xs text-muted-foreground">{holding.fundType} · 持有{holding.holdingDays}天</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-foreground">¥{holding.amount.toLocaleString()}</p>
                    <div className="flex items-center justify-end gap-1">
                      {holding.returnRate >= 0 ? <TrendingUp className="h-3 w-3 text-success" /> : <TrendingDown className="h-3 w-3 text-destructive" />}
                      <span className={`text-xs font-medium ${holding.returnRate >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {holding.returnRate > 0 ? '+' : ''}{holding.returnRate}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 近期交易 + 服务记录 */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>近期交易记录</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {customer.transactions.map((tx, index) => (
                <div key={index} className="flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-secondary/50">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                    tx.action === 'buy' ? 'bg-success/15 text-success' : tx.action === 'sell' ? 'bg-destructive/15 text-destructive' : 'bg-gold/15 text-gold'
                  }`}>
                    {tx.action === 'buy' ? '买' : tx.action === 'sell' ? '卖' : '分'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{tx.fund}</p>
                    <p className="text-xs text-muted-foreground">{tx.description}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${tx.action === 'buy' ? 'text-success' : tx.action === 'sell' ? 'text-destructive' : 'text-gold'}`}>
                      {tx.action === 'buy' ? '+' : tx.action === 'sell' ? '-' : '+'}¥{tx.amount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-4 w-4 text-primary" />
              服务互动概览
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <MiniStat icon={MessageSquare} label="累计咨询" value={`${svc.totalInquiries}次`} color="text-primary" />
              <MiniStat icon={Star} label="服务评分" value={`${svc.avgServiceRating}/5`} color="text-gold" />
              <MiniStat icon={AlertTriangle} label="投诉次数" value={svc.complaintCount} color={svc.complaintCount > 0 ? 'text-destructive' : 'text-success'} />
              <MiniStat icon={Activity} label="月均咨询" value={`${svc.monthlyInquiries}次`} color="text-accent" />
            </div>
            <div className="space-y-2">
              {svc.recentInteractions.slice(0, 3).map((inter, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg p-2 hover:bg-secondary/50 transition-colors">
                  <div className={`h-6 w-6 rounded flex items-center justify-center text-xs ${
                    inter.type === '投诉' ? 'bg-destructive/15 text-destructive' : 'bg-primary/15 text-primary'
                  }`}>
                    {inter.type === '投诉' ? <AlertTriangle className="h-3 w-3" /> : <Headphones className="h-3 w-3" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground truncate">{inter.summary}</p>
                    <p className="text-[10px] text-muted-foreground">{inter.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 基本信息 + 生活事件 */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-muted-foreground">性别：</span><span className="text-foreground">{customer.gender}</span></div>
              <div><span className="text-muted-foreground">年龄：</span><span className="text-foreground">{customer.age}岁</span></div>
              <div><span className="text-muted-foreground">学历：</span><span className="text-foreground">{customer.education}</span></div>
              <div><span className="text-muted-foreground">收入：</span><span className="text-foreground">{customer.monthlyIncome}</span></div>
              <div><span className="text-muted-foreground">电话：</span><span className="text-foreground">{customer.phone}</span></div>
              <div><span className="text-muted-foreground">城市：</span><span className="text-foreground">{customer.city}</span></div>
              <div><span className="text-muted-foreground">最后活跃：</span><span className="text-foreground">{customer.lastActivity}</span></div>
              <div><span className="text-muted-foreground">客户ID：</span><span className="text-foreground">{customer.id}</span></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-success" />
              生活事件
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-semibold text-muted-foreground">生日</span>
              <span className="text-sm text-foreground">{life.birthday}</span>
              {life.upcomingBirthday && <Badge variant="gold">即将到来</Badge>}
            </div>
            <div className="space-y-2">
              {life.lifeMilestones.map((m, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-success" />
                  <div>
                    <p className="text-xs text-foreground">{m.event}</p>
                    <p className="text-[10px] text-muted-foreground">{m.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// ===== Tab: RFM评分 =====
function RFMTab({ customer }: { customer: Customer }) {
  const daysSinceActive = Math.max(1, Math.floor((Date.now() - new Date(customer.lastActivity).getTime()) / (1000 * 60 * 60 * 24)))
  const recencyScore = daysSinceActive <= 3 ? 5 : daysSinceActive <= 7 ? 4 : daysSinceActive <= 14 ? 3 : daysSinceActive <= 30 ? 2 : 1
  const frequencyScore = customer.appBehavior.loginFrequency >= 20 ? 5 : customer.appBehavior.loginFrequency >= 15 ? 4 : customer.appBehavior.loginFrequency >= 10 ? 3 : customer.appBehavior.loginFrequency >= 5 ? 2 : 1
  const monetaryScore = customer.totalAssets >= 1000000 ? 5 : customer.totalAssets >= 500000 ? 4 : customer.totalAssets >= 200000 ? 3 : customer.totalAssets >= 50000 ? 2 : 1
  const totalScore = recencyScore + frequencyScore + monetaryScore

  const rfmSegment = totalScore >= 13 ? '重要价值客户' :
    totalScore >= 10 ? '重要发展客户' :
    totalScore >= 7 ? '一般价值客户' :
    totalScore >= 4 ? '一般发展客户' : '流失风险客户'

  const segmentColor = totalScore >= 13 ? 'text-gold' :
    totalScore >= 10 ? 'text-primary' :
    totalScore >= 7 ? 'text-success' :
    totalScore >= 4 ? 'text-accent' : 'text-destructive'

  const radarData = [
    { dimension: 'R-最近消费', value: recencyScore * 20 },
    { dimension: 'F-消费频率', value: frequencyScore * 20 },
    { dimension: 'M-消费金额', value: monetaryScore * 20 },
  ]

  const rfmDetails = [
    {
      dimension: 'Recency (最近活跃)',
      score: recencyScore,
      detail: `最后活跃: ${customer.lastActivity}`,
      description: daysSinceActive <= 3 ? '近3天内活跃，客户粘性极高' :
        daysSinceActive <= 7 ? '近一周内活跃，保持良好互动' :
        daysSinceActive <= 14 ? '近两周内活跃，需适度唤醒' :
        daysSinceActive <= 30 ? '超过两周未活跃，建议主动触达' : '超过一月未活跃，高流失风险',
      color: recencyScore >= 4 ? 'text-success' : recencyScore >= 3 ? 'text-gold' : 'text-destructive',
    },
    {
      dimension: 'Frequency (互动频率)',
      score: frequencyScore,
      detail: `月登录: ${customer.appBehavior.loginFrequency}次`,
      description: frequencyScore >= 4 ? '高频互动用户，适合深度运营' :
        frequencyScore >= 3 ? '中频互动，有提升空间' : '低频互动，需加强触达策略',
      color: frequencyScore >= 4 ? 'text-success' : frequencyScore >= 3 ? 'text-gold' : 'text-destructive',
    },
    {
      dimension: 'Monetary (资产规模)',
      score: monetaryScore,
      detail: `总资产: ¥${(customer.totalAssets / 10000).toFixed(1)}万`,
      description: monetaryScore >= 4 ? '高净值客户，提供专属高端服务' :
        monetaryScore >= 3 ? '中等资产，引导资产配置优化' : '资产规模较小，培育投资习惯',
      color: monetaryScore >= 4 ? 'text-success' : monetaryScore >= 3 ? 'text-gold' : 'text-destructive',
    },
  ]

  return (
    <div className="space-y-4 animate-fade-in">
      {/* RFM 总览 */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-4">
        <Card className="col-span-1">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground mb-2">RFM综合评分</p>
            <p className={`text-4xl font-bold ${segmentColor}`}>{totalScore}</p>
            <p className="text-[10px] text-muted-foreground mt-1">满分 15</p>
            <div className={`mt-3 rounded-lg py-1.5 px-3 text-xs font-semibold ${
              totalScore >= 13 ? 'bg-gold/15 text-gold' :
              totalScore >= 10 ? 'bg-primary/15 text-primary' :
              totalScore >= 7 ? 'bg-success/15 text-success' :
              totalScore >= 4 ? 'bg-accent/15 text-accent' :
              'bg-destructive/15 text-destructive'
            }`}>
              {rfmSegment}
            </div>
          </CardContent>
        </Card>

        {rfmDetails.map(item => (
          <Card key={item.dimension}>
            <CardContent className="p-4">
              <p className="text-[10px] text-muted-foreground">{item.dimension}</p>
              <div className="flex items-center gap-2 mt-1 mb-2">
                <p className={`text-2xl font-bold ${item.color}`}>{item.score}</p>
                <span className="text-[10px] text-muted-foreground">/5</span>
              </div>
              <p className="text-xs text-foreground font-medium">{item.detail}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{item.description}</p>
              <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className={`h-full rounded-full transition-all ${
                  item.score >= 4 ? 'bg-success' : item.score >= 3 ? 'bg-[hsl(var(--gold))]' : 'bg-destructive'
                }`} style={{ width: `${item.score * 20}%` }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* RFM 雷达图 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              RFM能力模型
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%">
                  <PolarGrid className="[&_line]:!stroke-chart-grid [&_circle]:!stroke-chart-grid [&_polygon]:!stroke-chart-grid" />
                  <PolarAngleAxis dataKey="dimension" className="[&_text]:!fill-chart-axis" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} className="[&_text]:!fill-chart-axis" tick={{ fontSize: 9 }} />
                  <Radar name="RFM" dataKey="value" stroke="hsl(215, 80%, 52%)" fill="hsl(215, 80%, 52%)" fillOpacity={0.25} strokeWidth={2} />
                  <Tooltip contentStyle={chartTooltipStyle} formatter={(v: number) => [`${v}/100`, '得分']} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 运营建议 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-gold" />
              基于RFM的运营建议
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                label: '触达策略',
                content: totalScore >= 13 ? '保持高频个性化触达，专属客服1对1服务' :
                  totalScore >= 10 ? '增加定期关怀频次，推送专属投资报告' :
                  totalScore >= 7 ? '定期推送市场资讯，引导参与社区互动' :
                  '加强唤醒触达，新手引导和入门内容推送',
                icon: Zap,
                color: 'text-primary',
              },
              {
                label: '产品推荐',
                content: monetaryScore >= 4 ? '推荐专属定制组合、FOF产品、私募代销' :
                  monetaryScore >= 3 ? '推荐智能定投组合、ETF联接基金' :
                  '推荐低门槛货币基金、新手专享产品',
                icon: TrendingUp,
                color: 'text-success',
              },
              {
                label: '服务等级',
                content: totalScore >= 13 ? 'VIP白金服务：专属客户经理 + 线下沙龙邀请' :
                  totalScore >= 10 ? '金牌服务：优先客服通道 + 季度资产复盘' :
                  totalScore >= 7 ? '银牌服务：智能客服 + 月度投资简报' :
                  '基础服务：标准客服 + 新手引导教程',
                icon: Award,
                color: 'text-gold',
              },
              {
                label: '风险提示',
                content: recencyScore <= 2 ? '客户活跃度偏低，存在流失风险，建议优先唤醒' :
                  frequencyScore <= 2 ? '互动频率不足，建议丰富触达渠道和内容多样性' :
                  monetaryScore <= 2 ? '资产规模较小，关注是否存在资金外流至竞品' :
                  '客户状态良好，持续维护当前服务质量',
                icon: AlertTriangle,
                color: totalScore <= 6 ? 'text-destructive' : 'text-muted-foreground',
              },
            ].map(item => {
              const Icon = item.icon
              return (
                <div key={item.label} className="rounded-lg bg-secondary/50 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={`h-3.5 w-3.5 ${item.color}`} />
                    <span className="text-xs font-semibold text-foreground">{item.label}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">{item.content}</p>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* RFM 分群参考 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>RFM客户分群矩阵</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 xl:grid-cols-5 gap-2">
            {[
              { segment: '重要价值客户', range: '13-15分', desc: 'R高F高M高，核心VIP', color: 'bg-gold/15 text-gold border-gold/20', highlight: totalScore >= 13 },
              { segment: '重要发展客户', range: '10-12分', desc: 'R高F中M高，有提升空间', color: 'bg-primary/15 text-primary border-primary/20', highlight: totalScore >= 10 && totalScore < 13 },
              { segment: '一般价值客户', range: '7-9分', desc: 'R中F中M中，需持续培育', color: 'bg-success/15 text-success border-success/20', highlight: totalScore >= 7 && totalScore < 10 },
              { segment: '一般发展客户', range: '4-6分', desc: 'R低F低M低，加强触达', color: 'bg-accent/15 text-accent border-accent/20', highlight: totalScore >= 4 && totalScore < 7 },
              { segment: '流失风险客户', range: '3分以下', desc: 'R低F低M低，紧急唤醒', color: 'bg-destructive/15 text-destructive border-destructive/20', highlight: totalScore < 4 },
            ].map(item => (
              <div key={item.segment} className={`rounded-lg border p-3 text-center transition-all ${item.color} ${item.highlight ? 'ring-2 ring-primary scale-105' : 'opacity-60'}`}>
                <p className="text-xs font-bold">{item.segment}</p>
                <p className="text-[10px] mt-0.5">{item.range}</p>
                <p className="text-[9px] mt-1 opacity-80">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// ===== 客户详情页 =====
function CustomerDetail({ customer, onBack }: { customer: Customer; onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<TabKey>('behavior')

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-primary/15 text-lg font-bold text-primary">
              {customer.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">{customer.name}</h1>
                <Badge variant={typeColorMap[customer.customerType] as 'default'}>{customer.typeLabel}</Badge>
                <Badge variant={stageColorMap[customer.lifecycleStage] as 'default'}>{customer.stageLabel}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{customer.occupation} · {customer.city}</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 xl:grid-cols-5 gap-3 xl:gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Wallet className="mx-auto h-5 w-5 text-gold" />
            <p className="mt-2 text-lg font-bold text-foreground">¥{(customer.totalAssets / 10000).toFixed(1)}万</p>
            <p className="text-xs text-muted-foreground">总资产</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="mx-auto h-5 w-5 text-primary" />
            <p className="mt-2 text-lg font-bold text-foreground">{customer.holdingDays}天</p>
            <p className="text-xs text-muted-foreground">持有天数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="mx-auto h-5 w-5 text-success" />
            <p className="mt-2 text-lg font-bold text-foreground">{customer.satisfaction}%</p>
            <p className="text-xs text-muted-foreground">满意度</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <GraduationCap className="mx-auto h-5 w-5 text-accent" />
            <p className="mt-2 text-lg font-bold text-foreground">{customer.riskLevel === 'conservative' ? 'R2' : customer.riskLevel === 'balanced' ? 'R3' : 'R4'}</p>
            <p className="text-xs text-muted-foreground">风险等级</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Brain className="mx-auto h-5 w-5 text-primary" />
            <p className="mt-2 text-lg font-bold text-foreground">{customer.investmentAbility.knowledgeLevelLabel}</p>
            <p className="text-xs text-muted-foreground">投资水平</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 border-b border-border pb-0">
        {TABS.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-[1px] ${
                activeTab === tab.key
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab customer={customer} />}
      {activeTab === 'behavior' && <BehaviorTab customer={customer} />}
      {activeTab === 'community' && <CommunityTab customer={customer} />}
      {activeTab === 'investment' && <InvestmentTab customer={customer} />}
      {activeTab === 'service' && <ServiceTab customer={customer} />}
    </div>
  )
}

export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  if (selectedCustomer) {
    return <CustomerDetail customer={selectedCustomer} onBack={() => setSelectedCustomer(null)} />
  }

  return (
    <div className="animate-fade-in">
      <CustomerList customers={customers} onSelect={setSelectedCustomer} />
    </div>
  )
}
