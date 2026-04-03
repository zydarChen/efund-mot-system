import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { serviceTasks, customers, dashboardStats } from '@/data/mockData'
import type { ServiceTask, TaskGroup } from '@/data/types'
import { useToast, ToastContainer } from '@/components/ui/toast'
import {
  Zap,
  Users,
  Clock,
  Brain,
  ArrowUpRight,
  Search,
  CheckCircle2,
  Loader2,
  MessageSquare,
  Smartphone,
  Phone,
  Mail,
  User,
  RefreshCw,
  Send,
  X,
  Copy,
  Shield,
  Heart,
  AlertTriangle,
  ChevronRight,
  LayoutGrid,
  List,
  ChevronDown,
  PlayCircle,
  Filter,
  TrendingUp,
  BarChart3,
  Sparkles,
  Pencil,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  Legend,
} from 'recharts'

/* ========== 常量配置 ========== */

const COLORS = [
  'hsl(215, 80%, 52%)',
  'hsl(168, 70%, 42%)',
  'hsl(38, 92%, 55%)',
  'hsl(280, 60%, 55%)',
  'hsl(0, 72%, 51%)',
]

const channelIcons: Record<string, React.ElementType> = {
  'APP推送': Smartphone,
  '短信': MessageSquare,
  '客服电话': Phone,
  '邮件': Mail,
  '专属客服': User,
}

const priorityConfig: Record<string, { label: string; class: string; tag: string }> = {
  high: { label: 'P0', class: 'border-l-destructive', tag: 'bg-destructive/15 text-destructive border-destructive/20' },
  medium: { label: 'P1', class: 'border-l-warning', tag: 'bg-warning/15 text-warning border-warning/20' },
  low: { label: 'P2', class: 'border-l-sky-500', tag: 'bg-sky-500/15 text-sky-400 border-sky-500/20' },
  info: { label: 'P3', class: 'border-l-muted-foreground', tag: 'bg-muted text-muted-foreground border-muted-foreground/20' },
}

const profileConfig: Record<string, { label: string; icon: React.ElementType; bg: string; color: string }> = {
  value: { label: '稳健价值型', icon: Shield, bg: 'bg-primary/12', color: 'text-primary' },
  active: { label: '积极交易型', icon: Zap, bg: 'bg-warning/12', color: 'text-warning' },
  beginner: { label: '新手小白型', icon: Heart, bg: 'bg-success/12', color: 'text-success' },
}

const columnConfig = [
  { key: 'pending', label: '待处理', icon: Clock, color: 'text-muted-foreground', bgColor: 'bg-secondary' },
  { key: 'executing', label: '处理中', icon: Loader2, color: 'text-warning', bgColor: 'bg-warning/15' },
  { key: 'completed', label: '已完成', icon: CheckCircle2, color: 'text-success', bgColor: 'bg-success/15' },
] as const

// 触发来源配置 (新增 - 借鉴参考系统)
const triggerSourceConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  market: { label: '行情触发', icon: TrendingUp, color: 'text-destructive' },
  policy: { label: '政策触发', icon: Shield, color: 'text-primary' },
  behavior: { label: '行为触发', icon: User, color: 'text-warning' },
  system: { label: '系统触发', icon: BarChart3, color: 'text-muted-foreground' },
  lifecycle: { label: '生命周期', icon: Heart, color: 'text-accent' },
}

// 从 MOT 规则名称推断触发来源
function inferTriggerSource(motRule: string): string {
  if (motRule.includes('亏损') || motRule.includes('回撤') || motRule.includes('涨') || motRule.includes('跌') || motRule.includes('指数') || motRule.includes('板块'))
    return 'market'
  if (motRule.includes('政策') || motRule.includes('法规') || motRule.includes('监管') || motRule.includes('LPR'))
    return 'policy'
  if (motRule.includes('赎回') || motRule.includes('定投') || motRule.includes('浏览') || motRule.includes('登录') || motRule.includes('交易'))
    return 'behavior'
  if (motRule.includes('生日') || motRule.includes('周年') || motRule.includes('升职') || motRule.includes('新手'))
    return 'lifecycle'
  return 'system'
}

// 策略来源映射：从 MOT 规则名推断策略是 AI 挖掘还是人工创建
const strategySourceMap: Record<string, { source: 'ai' | 'manual'; module?: string }> = {
  '基金净值大幅回撤预警': { source: 'ai', module: '行情分析' },
  '市场重大行情提醒': { source: 'ai', module: '行情分析' },
  '社区负面情绪预警': { source: 'ai', module: '市场舆情' },
  '投诉升级预警': { source: 'ai', module: '客户之声' },
  '高频交易风险提醒': { source: 'ai', module: '客户之声' },
  '投资知识进阶引导': { source: 'ai', module: '客户之声' },
  '收入变动配置建议': { source: 'ai', module: '客户之声' },
  '客户流失预警': { source: 'ai', module: '客户之声' },
  '情绪安抚服务': { source: 'ai', module: '客户之声' },
  'APP沉默用户唤醒': { source: 'ai', module: '客户之声' },
  // 全域洞察 - 跨域融合
  '市场+情绪共振预警': { source: 'ai', module: '全域洞察' },
  '政策+行情联动机会': { source: 'ai', module: '全域洞察' },
  '流失风险多因子预警': { source: 'ai', module: '全域洞察' },
  '客户定投日自动关怀': { source: 'manual' },
  '季报/年报解读推送': { source: 'manual' },
  '生日专属关怀': { source: 'manual' },
  '分红再投资引导': { source: 'manual' },
  '基金经理变更通知': { source: 'manual' },
  '客户持有到期提醒': { source: 'manual' },
  '新客户首投关怀': { source: 'manual' },
  '转介绍激励触发': { source: 'manual' },
}

function getStrategySource(motRule: string) {
  return strategySourceMap[motRule] || { source: 'manual' as const }
}

// AI suggestions map
const aiSuggestions: Record<string, {
  emotion: string; emoji: string; confidence: number
  script: string
  compliance: { status: 'pass' | 'warning' | 'block'; issues: string[] }
  channel: string; timing: string
  retentionRate: number
}> = {
  T003: {
    emotion: '焦虑不安', emoji: '😰', confidence: 87,
    script: '周婷女士您好，我是您的专属客服。注意到您近期投资遇到了一些波动，这是很正常的市场现象。我们整理了一份个性化的持仓诊断报告，方便和您电话沟通10分钟吗？',
    compliance: { status: 'pass', issues: [] },
    channel: '客服电话', timing: '14:00-16:00（客户活跃时段）',
    retentionRate: 78,
  },
  T004: {
    emotion: '愤怒不满', emoji: '😤', confidence: 92,
    script: '周婷女士，非常抱歉给您带来不好的体验。作为主管，我将全程跟进您反馈的问题。我们已为您准备了专属补偿方案，包括VIP服务升级和手续费减免。',
    compliance: { status: 'warning', issues: ['补偿方案需合规审批'] },
    channel: '专属客服', timing: '立即处理（紧急）',
    retentionRate: 65,
  },
  T005: {
    emotion: '平静期待', emoji: '😊', confidence: 78,
    script: '孙明远先生，生日快乐！感谢您一直以来对易方达的信任。我们为您准备了专属生日权益：定投费率限时8折+100积分礼品。祝您投资顺利！',
    compliance: { status: 'pass', issues: [] },
    channel: 'APP推送', timing: '生日当天 08:00',
    retentionRate: 92,
  },
  T006: {
    emotion: '满意理性', emoji: '😌', confidence: 85,
    script: '张建国先生，恭喜您近期的事业进步！考虑到您收入的增长，我们建议将月定投金额从1万提升至1.5万，并优化组合中的债券比例。附上详细配置建议供参考。',
    compliance: { status: 'pass', issues: [] },
    channel: '邮件', timing: '20:00-22:00（最佳阅读时段）',
    retentionRate: 95,
  },
  T009: {
    emotion: '平静尊贵', emoji: '😎', confidence: 82,
    script: '刘洋先生，提前祝您生日快乐！作为VIP客户，我们为您安排了专属生日权益：线下品鉴会邀请函+年度资产配置复盘面谈。您方便哪天参加呢？',
    compliance: { status: 'pass', issues: [] },
    channel: '专属客服', timing: '提前7天联系',
    retentionRate: 88,
  },
}

// 月度触发与完成数据
const monthlyData = dashboardStats.monthlyTrends.map(m => ({
  month: m.month.split('-')[1] + '月',
  触发总数: m.triggers,
  完成总数: Math.round(m.triggers * (m.coverage / 100)),
}))

// 客户类型分布
const customerTypeData = [
  { name: '稳健价值型', value: 45123, percentage: 35 },
  { name: '积极交易型', value: 38456, percentage: 30 },
  { name: '新手小白型', value: 44877, percentage: 35 },
]

/* ========== 聚合逻辑 ========== */

function buildTaskGroups(tasks: ServiceTask[]): TaskGroup[] {
  const customerMap = new Map(customers.map(c => [c.id, c]))
  const groupMap = new Map<string, TaskGroup>()

  for (const task of tasks) {
    const customer = customerMap.get(task.customerId)
    const typeKey = customer?.customerType || 'beginner'
    const typeLabel = customer?.typeLabel || '未知类型'
    const groupKey = `${task.motRule}__${typeKey}`

    if (!groupMap.has(groupKey)) {
      groupMap.set(groupKey, {
        groupKey,
        motRule: task.motRule,
        customerTypeKey: typeKey,
        customerTypeLabel: typeLabel,
        priority: task.priority,
        tasks: [],
        groupStatus: task.status === 'failed' ? 'completed' : task.status,
        isIndividual: false,
      })
    }

    const group = groupMap.get(groupKey)!
    group.tasks.push(task)

    const priOrder: Record<string, number> = { high: 0, medium: 1, low: 2, info: 3 }
    if (priOrder[task.priority] < priOrder[group.priority]) {
      group.priority = task.priority
    }

    const statuses = group.tasks.map(t => t.status === 'failed' ? 'completed' : t.status)
    const unique = [...new Set(statuses)]
    if (unique.length === 1) {
      group.groupStatus = unique[0] as TaskGroup['groupStatus']
    } else if (unique.includes('pending') || unique.includes('executing')) {
      group.groupStatus = 'mixed'
    } else {
      group.groupStatus = 'completed'
    }
  }

  for (const group of groupMap.values()) {
    if (group.tasks.length === 1) {
      group.isIndividual = true
    }
  }

  const result = [...groupMap.values()]
  // 全域洞察任务优先排列
  const globalInsightRules = new Set(['市场+情绪共振预警', '政策+行情联动机会', '流失风险多因子预警'])
  result.sort((a, b) => {
    const aGlobal = globalInsightRules.has(a.motRule) ? 0 : 1
    const bGlobal = globalInsightRules.has(b.motRule) ? 0 : 1
    return aGlobal - bGlobal
  })
  return result
}

function getGroupColumnKey(group: TaskGroup): string {
  if (group.groupStatus === 'completed') return 'completed'
  if (group.groupStatus === 'executing') return 'executing'
  if (group.groupStatus === 'mixed') {
    const hasPending = group.tasks.some(t => t.status === 'pending')
    if (hasPending) return 'pending'
    return 'executing'
  }
  return 'pending'
}

/* ========== 主页面 ========== */

export default function MOTOverview() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<TaskGroup | null>(null)
  const [selectedTask, setSelectedTask] = useState<ServiceTask | null>(null)
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { toasts, showToast, dismiss } = useToast()

  const allGroups = useMemo(() => {
    let filtered = serviceTasks.filter(
      t => t.customerName.includes(searchTerm) || t.motRule.includes(searchTerm) || t.content.includes(searchTerm)
    )
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(t => t.priority === priorityFilter)
    }
    if (typeFilter !== 'all') {
      const customer = customers.find(c => c.customerType === typeFilter)
      if (customer) {
        filtered = filtered.filter(t => {
          const c = customers.find(cc => cc.id === t.customerId)
          return c?.customerType === typeFilter
        })
      }
    }
    return buildTaskGroups(filtered)
  }, [searchTerm, priorityFilter, typeFilter])

  const getColumnGroups = (colKey: string) =>
    allGroups.filter(g => getGroupColumnKey(g) === colKey)

  const totalTasks = serviceTasks.length
  const pendingCount = serviceTasks.filter(t => t.status === 'pending').length
  const executingCount = serviceTasks.filter(t => t.status === 'executing').length
  const completedCount = serviceTasks.filter(t => t.status === 'completed' || t.status === 'failed').length
  const aiTaskCount = serviceTasks.filter(t => aiSuggestions[t.id]).length
  const reachedCustomers = new Set(serviceTasks.filter(t => t.status !== 'pending').map(t => t.customerId)).size

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">MOT总览</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          科学化客户服务，每一个关键时刻，让服务触达客户内心
        </p>
      </div>

      {/* KPI Cards - 按文档要求的4个核心指标 */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-4 animate-stagger">
        {[
          { title: '今日MOT触发总数', value: dashboardStats.motTriggersToday.toLocaleString(), change: `+${dashboardStats.monthlyGrowth.triggers}%`, icon: Zap, accent: 'bg-gold/15 text-gold' },
          { title: '今日触达客户总数', value: reachedCustomers.toLocaleString(), change: '+8.3%', icon: Users, accent: 'bg-primary/15 text-primary' },
          { title: '今日待处理任务数', value: pendingCount.toString(), change: pendingCount > 0 ? `${pendingCount}项待处理` : '已清零', icon: Clock, accent: 'bg-warning/15 text-warning' },
          { title: 'AI建议任务数', value: aiTaskCount.toString(), change: `置信度>78%`, icon: Brain, accent: 'bg-accent/15 text-accent' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="group overflow-hidden hover:border-primary/30 transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <div className="flex items-center gap-1 text-xs">
                      <ArrowUpRight className="h-3.5 w-3.5 text-success" />
                      <span className="text-success">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-md ${stat.accent} transition-transform duration-200 group-hover:scale-105`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Row - 柱状图 + 饼图 */}
      <div className="grid grid-cols-3 gap-4">
        {/* 月度MOT触发与完成柱状图 */}
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-4 w-4 text-primary" />
                历史MOT触发与完成趋势
              </CardTitle>
              <Badge variant="default">近6个月</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="触发总数" fill="hsl(215, 80%, 52%)" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="完成总数" fill="hsl(168, 70%, 42%)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 客户类型分布饼图 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gold" />
              客户类型分布
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={customerTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  >
                    {customerTypeData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
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
                    formatter={(value: number) => [value.toLocaleString() + '人', '']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-1 space-y-1.5">
              {customerTypeData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[index] }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium text-foreground">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 看板区域标题 + 控件 */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-foreground">任务看板</h2>
          <span className="text-xs text-muted-foreground">共 {totalTasks} 项 · {allGroups.length} 组聚合</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* 筛选按钮组 */}
          <div className="flex items-center gap-1">
            <Filter className="h-3.5 w-3.5 text-muted-foreground mr-1" />
            {[
              { key: 'all', label: '全部' },
              { key: 'high', label: 'P0' },
              { key: 'medium', label: 'P1' },
              { key: 'low', label: 'P2' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setPriorityFilter(f.key)}
                className={`rounded px-2 py-1 text-[11px] font-medium transition-colors ${
                  priorityFilter === f.key
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="h-4 w-px bg-border" />
          {/* 客群筛选 */}
          <div className="flex items-center gap-1">
            {[
              { key: 'all', label: '全部客群' },
              { key: 'value', label: '价值型' },
              { key: 'active', label: '活跃型' },
              { key: 'beginner', label: '新手型' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setTypeFilter(f.key)}
                className={`rounded px-2 py-1 text-[11px] font-medium transition-colors ${
                  typeFilter === f.key
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="h-4 w-px bg-border" />
          {/* 视图切换 */}
          <div className="flex items-center rounded border border-border p-0.5">
            <button
              onClick={() => setViewMode('kanban')}
              className={`rounded p-1.5 transition-colors ${viewMode === 'kanban' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded p-1.5 transition-colors ${viewMode === 'list' ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <Button variant="outline" size="sm" onClick={() => {
            setIsRefreshing(true)
            setTimeout(() => { setIsRefreshing(false); showToast('任务数据已刷新') }, 800)
          }}>
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            刷新
          </Button>
          <div className="h-4 w-px bg-border hidden xl:block" />
          {/* 批量操作 */}
          <Button variant="outline" size="sm" className="text-primary border-primary/30 hover:bg-primary/5" onClick={() => showToast(`已批量执行 ${pendingCount} 个待处理任务`, 'info')}>
            <PlayCircle className="mr-1.5 h-3.5 w-3.5" />
            批量执行
          </Button>
          <Button variant="outline" size="sm" className="text-success border-success/30 hover:bg-success/5" onClick={() => showToast(`已批量标记 ${executingCount} 个任务为完成`)}>
            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
            批量完成
          </Button>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="搜索客户、规则、内容..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="h-9 w-full rounded border border-border bg-secondary pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Kanban Board */}
      <style>{`
        @keyframes kanbanScrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
      `}</style>
      <div className="grid grid-cols-3 gap-5">
        {columnConfig.map((col) => {
          const groups = getColumnGroups(col.key)
          const taskCount = groups.reduce((sum, g) => sum + g.tasks.length, 0)
          const Icon = col.icon
          const shouldScroll = groups.length > 3

          return (
            <div key={col.key} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`flex h-6 w-6 items-center justify-center rounded ${col.bgColor}`}>
                    <Icon className={`h-3.5 w-3.5 ${col.color}`} />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{col.label}</span>
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1.5 text-[10px] font-bold text-muted-foreground">
                    {groups.length}组 · {taskCount}项
                  </span>
                </div>
              </div>
              <div className="h-1 w-full rounded-full bg-secondary overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    col.key === 'pending' ? 'bg-muted-foreground/40' : col.key === 'executing' ? 'bg-warning' : 'bg-success'
                  }`}
                  style={{ width: `${totalTasks > 0 ? (taskCount / totalTasks) * 100 : 0}%` }}
                />
              </div>
              <div
                className="relative overflow-hidden"
                style={shouldScroll ? { height: 520 } : undefined}
              >
                <div
                  className={`space-y-2.5 ${!shouldScroll ? 'min-h-[200px]' : ''}`}
                  style={shouldScroll ? {
                    animation: `kanbanScrollUp ${groups.length * 3}s linear infinite`,
                    willChange: 'transform',
                  } : undefined}
                  onMouseEnter={(e) => {
                    if (shouldScroll) e.currentTarget.style.animationPlayState = 'paused'
                  }}
                  onMouseLeave={(e) => {
                    if (shouldScroll) e.currentTarget.style.animationPlayState = 'running'
                  }}
                >
                  {groups.map((group) => (
                    <GroupCard
                      key={group.groupKey}
                      group={group}
                      onClick={() => {
                        if (group.isIndividual) {
                          setSelectedTask(group.tasks[0])
                        } else {
                          setSelectedGroup(group)
                        }
                      }}
                    />
                  ))}
                  {shouldScroll && groups.map((group) => (
                    <GroupCard
                      key={`dup-${group.groupKey}`}
                      group={group}
                      onClick={() => {
                        if (group.isIndividual) {
                          setSelectedTask(group.tasks[0])
                        } else {
                          setSelectedGroup(group)
                        }
                      }}
                    />
                  ))}
                </div>
                {shouldScroll && (
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modals */}
      {selectedGroup && (
        <GroupDetailModal group={selectedGroup} onClose={() => setSelectedGroup(null)} onSelectTask={setSelectedTask} showToast={showToast} />
      )}
      {selectedTask && (
        <AIServiceBrainModal task={selectedTask} onClose={() => setSelectedTask(null)} showToast={showToast} />
      )}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  )
}

/* ========== 聚合任务卡片 ========== */

function GroupCard({ group, onClick }: { group: TaskGroup; onClick: () => void }) {
  const prio = priorityConfig[group.priority]
  const profile = profileConfig[group.customerTypeKey]
  const ProfileIcon = profile.icon
  const customerCount = group.tasks.length
  const triggerSource = inferTriggerSource(group.motRule)
  const triggerConfig = triggerSourceConfig[triggerSource]
  const TriggerIcon = triggerConfig.icon

  if (group.isIndividual) {
    const task = group.tasks[0]
    const ChannelIcon = channelIcons[task.channel] || MessageSquare
    const hasAI = !!aiSuggestions[task.id]
    const ai = aiSuggestions[task.id]
    const stSource = getStrategySource(group.motRule)
    return (
      <Card
        className={`cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md border-l-2 ${prio.class} ${
          task.priority === 'high' && task.status === 'pending' ? 'animate-pulse-slow' : ''
        }`}
        onClick={onClick}
      >
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-foreground">{task.customerName}</span>
              <Badge className={`text-[9px] border px-1.5 py-0 ${prio.tag}`}>{prio.label}</Badge>
            </div>
            <div className="flex items-center gap-1.5">
              {/* 触发来源标识：当AI模块已包含相同信息时不重复显示 */}
              {!(stSource.source === 'ai' && stSource.module === '行情分析' && triggerSource === 'market') && (
                <div className={`flex items-center gap-0.5 text-[9px] ${triggerConfig.color}`}>
                  <TriggerIcon className="h-2.5 w-2.5" />
                  <span>{triggerConfig.label}</span>
                </div>
              )}
              {hasAI && (
                <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/15">
                  <Brain className="h-3 w-3 text-primary" />
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-foreground/70 mb-1 line-clamp-1">{task.motRule}</p>
          {/* 策略来源标识 */}
          <div className="mb-1.5">
            {stSource.source === 'ai' ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary/15 to-accent/15 px-2.5 py-0.5 text-[10px] font-bold text-primary border border-primary/25 shadow-sm shadow-primary/10">
                <Sparkles className="h-3 w-3" />
                AI挖掘 · {stSource.module}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2 py-0.5 text-[9px] font-medium text-muted-foreground">
                <Pencil className="h-2.5 w-2.5" />
                人工创建
              </span>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground line-clamp-2 mb-1.5">{task.content}</p>
          {/* AI建议摘要 */}
          {ai && (
            <div className="mb-1.5 rounded bg-primary/5 border border-primary/10 px-2 py-1 space-y-0.5">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">AI置信度</span>
                <span className="text-primary font-medium">{ai.confidence}%</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">预估留存率</span>
                <span className="text-success font-medium">{ai.retentionRate}%</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-muted-foreground">推荐渠道</span>
                <span className="text-foreground/70">{ai.channel}</span>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-[10px] text-foreground/60">
              <ChannelIcon className="h-2.5 w-2.5" />
              {task.channel}
            </div>
            <span className="text-[10px] text-muted-foreground">{task.createdAt.split(' ')[1]}</span>
          </div>
          {task.result && (
            <p className="mt-2 rounded bg-success/10 px-2 py-1 text-[10px] text-success">{task.result}</p>
          )}
        </CardContent>
      </Card>
    )
  }

  // 多客户聚合卡片
  const pendingInGroup = group.tasks.filter(t => t.status === 'pending').length
  const completedInGroup = group.tasks.filter(t => t.status === 'completed' || t.status === 'failed').length
  const executingInGroup = group.tasks.filter(t => t.status === 'executing').length
  const aiCount = group.tasks.filter(t => aiSuggestions[t.id]).length
  const stSourceAgg = getStrategySource(group.motRule)

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md border-l-2 ${prio.class}`}
      onClick={onClick}
    >
      <CardContent className="p-3">
        {/* 顶部：客群标识 + 优先级 */}
        <div className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 ${profile.bg} mb-2`}>
          <div className={`flex h-7 w-7 items-center justify-center rounded-md ${profile.bg} border border-current/20`}>
            <ProfileIcon className={`h-4 w-4 ${profile.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-bold ${profile.color} leading-tight`}>{profile.label}</p>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Users className="h-2.5 w-2.5" />
              <span className="font-semibold text-foreground">{customerCount}</span>
              <span>位客户</span>
            </div>
          </div>
          <Badge className={`text-[9px] border px-1.5 py-0 ${prio.tag}`}>{prio.label}</Badge>
        </div>
        
        {/* MOT规则名称 */}
        <p className="text-sm font-semibold text-foreground mb-1 line-clamp-1">{group.motRule}</p>

        {/* 策略来源 + 触发来源 */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          {stSourceAgg.source === 'ai' ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary/15 to-accent/15 px-2.5 py-0.5 text-[10px] font-bold text-primary border border-primary/25 shadow-sm shadow-primary/10">
              <Sparkles className="h-3 w-3" />
              AI挖掘 · {stSourceAgg.module}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2 py-0.5 text-[9px] font-medium text-muted-foreground">
              <Pencil className="h-2.5 w-2.5" />
              人工创建
            </span>
          )}
          {/* 当AI模块已包含触发来源信息时（如"行情分析"对应"行情触发"），不重复显示 */}
          {!(stSourceAgg.source === 'ai' && stSourceAgg.module === '行情分析' && triggerSource === 'market') && (
            <div className={`flex items-center gap-0.5 text-[9px] ${triggerConfig.color}`}>
              <TriggerIcon className="h-2.5 w-2.5" />
              <span>{triggerConfig.label}</span>
            </div>
          )}
          {aiCount > 0 && (
            <div className="flex items-center gap-0.5 text-[9px] text-primary">
              <Brain className="h-2.5 w-2.5" />
              <span>{aiCount}项AI建议</span>
            </div>
          )}
        </div>
        
        {/* 客户头像列表 + 状态统计 */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-0.5">
            {group.tasks.slice(0, 6).map((task) => (
              <div
                key={task.id}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-[10px] font-medium text-foreground border border-border/50"
                title={task.customerName}
              >
                {task.customerName[0]}
              </div>
            ))}
            {customerCount > 6 && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
                +{customerCount - 6}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[10px]">
            {pendingInGroup > 0 && <span className="text-muted-foreground">{pendingInGroup}待处理</span>}
            {completedInGroup > 0 && <span className="text-success">{completedInGroup}已完成</span>}
          </div>
        </div>
        
        {pendingInGroup > 0 && (
          <div className="mt-1.5 pt-1.5 border-t border-border/40 flex items-center justify-between">
            <span className="text-[10px] text-primary font-medium">点击展开 · 批量发送</span>
            <ChevronDown className="h-3 w-3 text-primary" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

/* ========== 任务组详情 Modal ========== */

function GroupDetailModal({
  group,
  onClose,
  onSelectTask,
  showToast,
}: {
  group: TaskGroup
  onClose: () => void
  onSelectTask: (task: ServiceTask) => void
  showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void
}) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() =>
    new Set(group.tasks.filter(t => t.status === 'pending').map(t => t.id))
  )
  const profile = profileConfig[group.customerTypeKey]
  const ProfileIcon = profile.icon
  const prio = priorityConfig[group.priority]

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const selectAll = () => {
    setSelectedIds(new Set(group.tasks.filter(t => t.status === 'pending').map(t => t.id)))
  }
  const deselectAll = () => setSelectedIds(new Set())
  const selectedCount = selectedIds.size

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="w-[720px] max-w-[94vw] max-h-[85vh] overflow-y-auto rounded border border-border bg-card shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-9 w-9 items-center justify-center rounded ${profile.bg}`}>
              <ProfileIcon className={`h-5 w-5 ${profile.color}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">{group.motRule}</h2>
                <Badge className={`text-[9px] border px-1.5 py-0 ${prio.tag}`}>{prio.label}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{group.customerTypeLabel} · {group.tasks.length}位客户 · 聚合任务</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        {/* 聚合逻辑说明 */}
        <div className="px-6 py-2 bg-primary/5 border-b border-border">
          <div className="flex items-center gap-2">
            <Brain className="h-3.5 w-3.5 text-primary" />
            <span className="text-[11px] text-primary font-medium">AI聚合逻辑：</span>
            <span className="text-[11px] text-muted-foreground">同一触发条件「{group.motRule}」下的{group.customerTypeLabel}客户自动聚合，支持批量触达以提升服务效率</span>
          </div>
        </div>
        <div className="flex items-center justify-between border-b border-border px-6 py-3 bg-secondary/30">
          <div className="flex items-center gap-3">
            <button onClick={selectedCount > 0 ? deselectAll : selectAll} className="text-xs text-primary hover:underline">
              {selectedCount > 0 ? '取消全选' : '全选待处理'}
            </button>
            <span className="text-xs text-muted-foreground">
              已选 <span className="text-foreground font-medium">{selectedCount}</span> / {group.tasks.filter(t => t.status === 'pending').length} 项待处理
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" disabled={selectedCount === 0} onClick={() => showToast(`已批量标记 ${selectedCount} 个任务为完成`)}>
              <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
              批量标记完成
            </Button>
            <Button size="sm" disabled={selectedCount === 0} onClick={() => showToast(`已批量发送 ${selectedCount} 个服务触达`, 'info')}>
              <Send className="mr-1.5 h-3.5 w-3.5" />
              批量发送 ({selectedCount})
            </Button>
          </div>
        </div>
        <div className="divide-y divide-border">
          {group.tasks.map((task) => {
            const customer = customers.find(c => c.id === task.customerId)
            const ChannelIcon = channelIcons[task.channel] || MessageSquare
            const isSelected = selectedIds.has(task.id)
            const isPending = task.status === 'pending'
            const hasAI = !!aiSuggestions[task.id]
            return (
              <div key={task.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-secondary/20 transition-colors">
                <button
                  onClick={() => isPending && toggleSelect(task.id)}
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                    isPending
                      ? isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-border hover:border-primary'
                      : 'border-border/50 bg-secondary/50 cursor-not-allowed'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="h-3 w-3" />}
                </button>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/12 text-xs font-medium text-primary">
                  {customer?.avatar || task.customerName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{task.customerName}</span>
                    {customer && <span className="text-[10px] text-muted-foreground">¥{(customer.totalAssets / 10000).toFixed(0)}万</span>}
                    {hasAI && (
                      <div className="flex h-4 w-4 items-center justify-center rounded bg-primary/15">
                        <Brain className="h-2.5 w-2.5 text-primary" />
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{task.content}</p>
                </div>
                <div className="flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-[10px] text-foreground/60 shrink-0">
                  <ChannelIcon className="h-2.5 w-2.5" />
                  {task.channel}
                </div>
                <div className="shrink-0">
                  {task.status === 'pending' && <span className="text-[10px] text-muted-foreground">待处理</span>}
                  {task.status === 'executing' && <span className="text-[10px] text-warning">处理中</span>}
                  {(task.status === 'completed' || task.status === 'failed') && <span className="text-[10px] text-success">已完成</span>}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onSelectTask(task) }}
                  className="flex h-7 items-center rounded px-2 text-[11px] text-primary hover:bg-primary/10 transition-colors shrink-0"
                >
                  AI建议 <ChevronRight className="h-3 w-3 ml-0.5" />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ========== AI 服务大脑 Modal ========== */

function AIServiceBrainModal({ task, onClose, showToast }: { task: ServiceTask; onClose: () => void; showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void }) {
  const [copied, setCopied] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState(task.channel)
  const customer = customers.find((c) => c.id === task.customerId)
  const ai = aiSuggestions[task.id]

  const radarData = customer
    ? [
        { dim: '知识水平', value: customer.investmentAbility.knowledgeScore },
        { dim: '决策质量', value: customer.investmentAbility.decisionQualityScore },
        { dim: '择时能力', value: customer.investmentAbility.timingAbilityIndex },
        { dim: '配置合理', value: customer.investmentAbility.allocationRationalityScore },
        { dim: '情绪稳定', value: customer.investmentAbility.emotionalStabilityIndex },
      ]
    : []

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="w-[960px] max-w-[94vw] max-h-[85vh] overflow-y-auto rounded border border-border bg-card shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-4 xl:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-primary/15">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">AI 服务大脑</h2>
              <p className="text-xs text-muted-foreground">{task.motRule} · {task.customerName}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 divide-y xl:divide-y-0 xl:divide-x divide-border">
          {/* Left: Customer 360 Card */}
          <div className="p-5 space-y-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">客户360卡片</h3>
            {customer && (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/15 text-primary text-sm font-bold">
                    {customer.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{customer.name}</p>
                    <p className="text-[11px] text-muted-foreground">{customer.typeLabel} · {customer.stageLabel}</p>
                  </div>
                </div>
                {/* AI行为画像 */}
                <div className="rounded border border-primary/20 bg-primary/5 p-3 space-y-2">
                  <p className="text-[11px] font-semibold text-primary flex items-center gap-1">
                    <Brain className="h-3 w-3" /> AI行为画像
                  </p>
                  {[
                    { label: '投资风格', value: customer.typeLabel },
                    { label: '风险偏好', value: customer.riskLevel === 'aggressive' ? '进取型' : customer.riskLevel === 'balanced' ? '稳健型' : '保守型' },
                    { label: '活跃时段', value: customer.appBehavior.preferredTimeSlot },
                    { label: '流失风险', value: customer.satisfaction > 85 ? '低' : customer.satisfaction > 70 ? '中' : '高' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="text-foreground font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
                {/* 基本信息 */}
                <div className="space-y-2">
                  {[
                    { label: '年龄', value: `${customer.age}岁` },
                    { label: '职业', value: customer.occupation },
                    { label: '收入', value: customer.monthlyIncome },
                    { label: '学历', value: customer.education },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="text-foreground font-medium text-right max-w-[120px] truncate">{item.value}</span>
                    </div>
                  ))}
                </div>
                {/* 投资能力雷达 */}
                <div>
                  <p className="text-[11px] text-muted-foreground mb-2">持仓偏好</p>
                  <ResponsiveContainer width="100%" height={140}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="dim" tick={{ fontSize: 9 }} />
                      <Radar dataKey="value" stroke="hsl(215, 80%, 52%)" fill="hsl(215, 80%, 52%)" fillOpacity={0.2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                {/* 近期服务历史 */}
                <div>
                  <p className="text-[11px] text-muted-foreground mb-1.5">近期服务历史</p>
                  <div className="space-y-1">
                    {customer.serviceInteraction.recentInteractions.slice(0, 2).map((r, i) => (
                      <div key={i} className="rounded bg-secondary/50 px-2 py-1.5 text-[10px]">
                        <p className="text-foreground truncate">{r.summary}</p>
                        <p className="text-muted-foreground">{r.date} · {r.type}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
          {/* Middle: AI Suggestions */}
          <div className="p-5 space-y-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">AI 智能建议</h3>
            {ai ? (
              <>
                <div className="rounded border border-border p-3">
                  <p className="text-[11px] text-muted-foreground mb-1.5">情绪分析</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{ai.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{ai.emotion}</p>
                      <p className="text-[10px] text-muted-foreground">置信度 {ai.confidence}%</p>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${ai.confidence}%` }} />
                  </div>
                </div>
                <div className="rounded border border-border p-3">
                  <p className="text-[11px] text-muted-foreground mb-1">预估留存率</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-success">{ai.retentionRate}%</span>
                    <span className="text-[10px] text-muted-foreground">执行本策略后</span>
                  </div>
                </div>
                <div className="rounded border border-border p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[11px] text-muted-foreground">推荐触达内容</p>
                    <button className="text-muted-foreground hover:text-primary transition-colors" title="复制内容" onClick={() => { navigator.clipboard.writeText(ai.script); setCopied(true); setTimeout(() => setCopied(false), 1500) }}>
                      {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed">{ai.script}</p>
                </div>
                <div className={`rounded border p-3 ${
                  ai.compliance.status === 'pass' ? 'border-success/30 bg-success/5'
                    : ai.compliance.status === 'warning' ? 'border-warning/30 bg-warning/5'
                    : 'border-destructive/30 bg-destructive/5'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className={`h-4 w-4 ${
                      ai.compliance.status === 'pass' ? 'text-success' : ai.compliance.status === 'warning' ? 'text-warning' : 'text-destructive'
                    }`} />
                    <p className="text-[11px] font-bold text-foreground">
                      合规前置审核
                    </p>
                    <Badge className={`text-[9px] ml-auto ${
                      ai.compliance.status === 'pass' ? 'bg-success/15 text-success border-success/20' 
                        : ai.compliance.status === 'warning' ? 'bg-warning/15 text-warning border-warning/20' 
                        : 'bg-destructive/15 text-destructive border-destructive/20'
                    }`}>
                      {ai.compliance.status === 'pass' ? '审核通过' : ai.compliance.status === 'warning' ? '需人工审核' : '合规拦截'}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-foreground/60 mb-1.5">
                    {ai.compliance.status === 'pass' 
                      ? '该服务内容已通过合规自动审核，可直接触达客户。' 
                      : ai.compliance.status === 'warning'
                        ? '检测到以下合规风险点，建议人工审核后再触达客户。'
                        : '该服务内容因合规要求被拦截，需修改后重新提交审核。'}
                  </p>
                  {ai.compliance.issues.length > 0 && (
                    <ul className="space-y-1 mt-1.5 rounded bg-warning/5 border border-warning/10 p-2">
                      {ai.compliance.issues.map((issue, i) => (
                        <li key={i} className="text-[10px] text-warning flex items-center gap-1.5">
                          <AlertTriangle className="h-3 w-3 shrink-0" />
                          <span className="font-medium">{issue}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {ai.compliance.status === 'pass' && (
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <CheckCircle2 className="h-3 w-3 text-success" />
                      <span className="text-[10px] text-success">敏感词检查通过 · 适当性匹配 · 推送时间合规</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded bg-secondary/50 px-3 py-2">
                    <span className="text-[11px] text-muted-foreground">推荐渠道</span>
                    <span className="text-xs font-medium text-foreground">{ai.channel}</span>
                  </div>
                  <div className="flex items-center justify-between rounded bg-secondary/50 px-3 py-2">
                    <span className="text-[11px] text-muted-foreground">最佳时段</span>
                    <span className="text-xs font-medium text-foreground">{ai.timing}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <Brain className="h-8 w-8 mb-2 opacity-30" />
                <p className="text-xs">AI 建议生成中...</p>
              </div>
            )}
          </div>
          {/* Right: Action Panel */}
          <div className="p-5 space-y-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">操作执行</h3>
            <div className="space-y-2">
              <p className="text-[11px] text-muted-foreground">任务状态</p>
              <div className="flex items-center gap-2">
                {['pending', 'executing', 'completed'].map((s, i) => {
                  const active = task.status === s || (task.status === 'failed' && s === 'completed')
                  const labels: Record<string, string> = { pending: '待处理', executing: '处理中', completed: '已完成' }
                  return (
                    <div key={s} className="flex items-center gap-2">
                      <div className={`flex h-7 items-center rounded px-3 text-[11px] font-medium transition-all ${
                        active ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                      }`}>{labels[s]}</div>
                      {i < 2 && <ChevronRight className="h-3 w-3 text-muted-foreground/40" />}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[11px] text-muted-foreground">执行渠道</p>
              <div className="grid grid-cols-2 gap-1.5">
                {['APP推送', '短信', '客服电话', '邮件', '专属客服'].map((ch) => {
                  const ChIcon = channelIcons[ch] || MessageSquare
                  const isSelected = ch === selectedChannel
                  return (
                    <button key={ch} onClick={() => setSelectedChannel(ch)} className={`flex items-center gap-1.5 rounded px-2.5 py-2 text-[11px] font-medium transition-all ${
                      isSelected ? 'bg-primary/15 text-primary border border-primary/30' : 'bg-secondary text-muted-foreground border border-transparent hover:text-foreground'
                    }`}>
                      <ChIcon className="h-3 w-3" />{ch}
                    </button>
                  )
                })}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[11px] text-muted-foreground">处理备注</p>
              <textarea className="w-full rounded border border-border bg-secondary/50 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary resize-none" rows={3} placeholder="输入处理备注..." />
            </div>
            <div className="space-y-2 pt-2">
              {task.status === 'pending' && (
                <>
                  <Button className="w-full" size="sm" onClick={() => { showToast('已接单，任务开始执行', 'info'); onClose() }}><Send className="mr-1.5 h-3.5 w-3.5" />接单并执行</Button>
                  <Button variant="outline" className="w-full" size="sm" onClick={() => { showToast('已转派至其他客服', 'info'); onClose() }}>转派其他客服</Button>
                </>
              )}
              {task.status === 'executing' && (
                <>
                  <Button className="w-full bg-success hover:bg-success/90" size="sm" onClick={() => { showToast('任务已标记为完成'); onClose() }}><CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />标记完成</Button>
                  <Button variant="outline" className="w-full text-destructive border-destructive/30 hover:bg-destructive/10" size="sm" onClick={() => { showToast('任务已标记为处理失败', 'error'); onClose() }}>处理失败</Button>
                </>
              )}
              {(task.status === 'completed' || task.status === 'failed') && (
                <div className="rounded bg-success/10 p-3 text-center">
                  <CheckCircle2 className="h-5 w-5 text-success mx-auto mb-1" />
                  <p className="text-xs text-success font-medium">任务已完成</p>
                  {task.result && <p className="text-[10px] text-success/70 mt-1">{task.result}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
