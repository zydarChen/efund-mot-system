import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { analyticsData } from '@/data/mockData'
import { useToast, ToastContainer } from '@/components/ui/toast'
import MOTRecommendationPanel, { voiceRecommendations } from '@/components/strategy/MOTRecommendation'
import {
  MessageSquareHeart,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  MessageCircle,
  BarChart3,
  Users,
  Eye,
  Send,
  Globe,
  Smartphone,
  Hash,
  Flame,
  ChevronRight,
  ExternalLink,
  FileText,
  Phone,
  Mail,
  Monitor,
  Target,
  Shield,
  AlertTriangle,
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
  LineChart,
  Line,
  Legend,
} from 'recharts'

/* ========== Mock 数据 ========== */

// 全量洞察
const overviewMetrics = {
  totalComments: 16162,
  totalCommentsChange: -21,
  serviceVolume: 5000,
  serviceVolumeChange: -12,
  internetPlatformChange: -14,
  easyServiceUV: 10396,
  easyServiceUVChange: 12.2,
  easyServicePV: 185113,
  easyServicePVChange: 38.8,
  wechat1v1Messages: 589,
  wechat1v1Change: -29,
  wechat1v1Customers: 95,
  wechat1v1CustChange: -15,
  wechatGroupMessages: 1642,
  wechatGroupChange: 1,
  wechatGroupCustomers: 114,
  wechatGroupCustChange: -7,
  contentClicks: 951,
  contentClicksChange: -12,
  contentCustomers: 349,
  contentCustomersChange: -14,
}

const platformBreakdown = [
  { platform: '蚂蚁财富', comments: 4280, change: -18, sentiment: { positive: 58, neutral: 28, negative: 14 } },
  { platform: '天天基金', comments: 3520, change: -15, sentiment: { positive: 52, neutral: 30, negative: 18 } },
  { platform: '东方财富', comments: 2680, change: -22, sentiment: { positive: 48, neutral: 32, negative: 20 } },
  { platform: '雪球', comments: 1280, change: -8, sentiment: { positive: 42, neutral: 35, negative: 23 } },
  { platform: '同花顺', comments: 865, change: -12, sentiment: { positive: 55, neutral: 30, negative: 15 } },
]

const weeklyTrend = [
  { week: '第10周', comments: 18520, replies: 2680, satisfaction: 82 },
  { week: '第11周', comments: 20450, replies: 2950, satisfaction: 84 },
  { week: '第12周', comments: 19800, replies: 2480, satisfaction: 81 },
  { week: '第13周', comments: 16162, replies: 2218, satisfaction: 85 },
]

// 回应详情
const responseMetrics = {
  totalReplies: 2218,
  totalRepliesChange: -10,
  positiveReplyRate: 43,
  negativeReplyRate: 27,
  businessQuestionReplies: 563,
  businessQuestionRate: 100,
  totalPosts: 5,
  advisor1v1Messages: 3594,
  advisor1v1Change: -12,
  advisorGroupMessages: 76,
  advisorGroupChange: -8,
  broadcast1v1: 19,
  broadcastGroup: 0,
  broadcastCommunity: 10,
}

const postList = [
  { title: '境外市场周报', type: '定期发布', date: '2026-03-24', views: 2840 },
  { title: '黄金原油情报室', type: '定期发布', date: '2026-03-25', views: 1960 },
  { title: '红利"三剑客"周速递', type: '定期发布', date: '2026-03-26', views: 1520 },
  { title: '新发基金：上证科创板综合ETF联接', type: '主动发帖', date: '2026-03-27', views: 3280 },
  { title: '中概互联网联接交易规则解读', type: '主动发帖', date: '2026-03-28', views: 2150 },
]

const sentimentReplyData = [
  { type: '正面/中性评论', replies: 1655, rate: 43, total: 3850 },
  { type: '负面情绪评论', replies: 350, rate: 27, total: 1296 },
  { type: '业务疑问', replies: 563, rate: 100, total: 563 },
]

// 热点聚焦
const hotTopics = [
  {
    id: 1,
    title: '中证人工智能主题ETF联接',
    source: '讨论区',
    sourceColor: 'bg-primary/15 text-primary',
    heat: 95,
    context: 'AI行情持续火热，板块近期震荡加剧，引发投资者广泛讨论。基金净值受AI板块波动影响较大，部分投资者出现恐慌情绪。',
    concerns: [
      '基金收益与大盘/板块/持仓标的走势一致性分析',
      '板块趋势判断与入场时机讨论',
      '基金交易时机选择（止盈止损策略）',
      '与同类AI主题基金对比分析',
    ],
    stats: { views: 12800, comments: 3560, negative: 18 },
  },
  {
    id: 2,
    title: '黄金ETF及其联接基金、黄金主题LOF',
    source: '讨论区',
    sourceColor: 'bg-gold/15 text-gold',
    heat: 88,
    context: '4月初金价再创历史新高，投资者对黄金资产配置关注度显著提升。讨论内容涉及申赎规则、交易费率、收益计算等基础问题。',
    concerns: [
      '申购赎回与二级市场交易规则说明',
      '交易费率标准与计算方式',
      '持有收益率计算方法',
      '基金暂停申购原因及预计恢复时间',
    ],
    stats: { views: 9600, comments: 2840, negative: 8 },
  },
  {
    id: 3,
    title: '上证科创板综合ETF联接（新基金发行）',
    source: '客服',
    sourceColor: 'bg-accent/15 text-accent',
    heat: 72,
    context: '新基金发行期3月17日至4月3日，客户集中咨询认购规则、封闭期安排等问题。客服渠道咨询量显著上升。',
    concerns: [
      '认购规则与起购金额',
      '认购撤单操作流程',
      '封闭期时长及开放时间',
      '科创板投资门槛与风险提示',
    ],
    stats: { views: 5200, comments: 1680, negative: 5 },
  },
]

// 分平台解析
const platformAnalysis = {
  internet: [
    { name: '蚂蚁财富', comments: 4280, change: -18, replies: 680, replyRate: 42, topIssue: '基金收益查询', icon: '蚂' },
    { name: '天天基金', comments: 3520, change: -15, replies: 520, replyRate: 45, topIssue: 'ETF交易规则', icon: '天' },
    { name: '东方财富', comments: 2680, change: -22, replies: 380, replyRate: 38, topIssue: '持仓分析', icon: '东' },
    { name: '雪球', comments: 1280, change: -8, replies: 180, replyRate: 35, topIssue: '市场观点讨论', icon: '雪' },
    { name: '腾安基金', comments: 920, change: -5, replies: 145, replyRate: 48, topIssue: '账户问题', icon: '腾' },
    { name: '同花顺', comments: 865, change: -12, replies: 120, replyRate: 40, topIssue: '行情分析', icon: '同' },
    { name: '自选股', comments: 650, change: 3, replies: 95, replyRate: 42, topIssue: '自选管理', icon: '自' },
    { name: '招商银行', comments: 520, change: -6, replies: 88, replyRate: 52, topIssue: '代销产品', icon: '招' },
    { name: '大智慧', comments: 380, change: -10, replies: 52, replyRate: 36, topIssue: '行情工具', icon: '大' },
    { name: '京东金融', comments: 267, change: 2, replies: 45, replyRate: 44, topIssue: '理财产品', icon: '京' },
  ],
  newMedia: [
    { name: '抖音', comments: 3850, change: 15, replies: 280, replyRate: 22, topIssue: '投教短视频', icon: '抖' },
    { name: '小红书', comments: 2400, change: 28, replies: 180, replyRate: 18, topIssue: '基金科普', icon: '红' },
    { name: '微博', comments: 1860, change: -5, replies: 220, replyRate: 32, topIssue: '市场热点', icon: '微' },
    { name: 'B站', comments: 1200, change: 8, replies: 95, replyRate: 25, topIssue: '投资教程', icon: 'B' },
  ],
  service: [
    { name: '电话客服', volume: 2850, change: -8, connectionRate: 98.5, avgWait: '28秒', satisfaction: 4.6, icon: '电' },
    { name: '在线客服', volume: 1650, change: -15, connectionRate: 99.2, avgWait: '12秒', satisfaction: 4.4, icon: '线' },
    { name: '易服务', volume: 10396, change: 12.2, connectionRate: null, avgWait: null, satisfaction: null, icon: '易', pv: 185113, pvChange: 38.8 },
    { name: '企业微信', volume: 209, change: -22, connectionRate: 100, avgWait: '即时', satisfaction: 4.8, icon: '企' },
  ],
}

const sentimentColors = ['hsl(168, 70%, 42%)', 'hsl(38, 92%, 55%)', 'hsl(0, 72%, 51%)']

/* ========== 辅助组件 ========== */

function ChangeIndicator({ value, threshold = 20 }: { value: number; threshold?: number }) {
  const isNeg = value < 0
  const isAlert = Math.abs(value) >= threshold
  return (
    <span className={`inline-flex items-center gap-0.5 text-xs font-medium ${
      isNeg ? 'text-destructive' : 'text-success'
    }`}>
      {isNeg ? <ArrowDownRight className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
      {isNeg ? '' : '+'}{value}%
      {isAlert && <AlertTriangle className="h-3 w-3 ml-0.5 text-warning" />}
    </span>
  )
}

/* ========== 主页面 ========== */

export default function VoiceOfCustomer() {
  const [activeTab, setActiveTab] = useState<'overview' | 'response' | 'topics' | 'platforms'>('overview')
  const { toasts, showToast, dismiss } = useToast()

  return (
    <div className="flex gap-6 animate-fade-in">
      {/* 左侧：主内容区 */}
      <div className="flex-1 min-w-0 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">客户之声</h1>
            <p className="mt-1 text-sm text-muted-foreground">多渠道客户反馈智能分析 · 投资者之家 × 客服中心</p>
          </div>
          <Badge variant="secondary" className="text-xs px-3 py-1">
            2026年第13期 · 3.22-3.28
          </Badge>
        </div>

        {/* Tab 切换 */}
        <div className="flex items-center gap-1 border-b border-border">
          {[
            { key: 'overview', label: '全量洞察', icon: BarChart3 },
            { key: 'response', label: '回应详情', icon: Send },
            { key: 'topics', label: '热点聚焦', icon: Flame },
            { key: 'platforms', label: '分平台解析', icon: Globe },
          ].map((tab, i) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className={`flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold ${
                activeTab === tab.key ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
              }`}>{i + 1}</span>
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'response' && <ResponseTab />}
        {activeTab === 'topics' && <TopicsTab showToast={showToast} />}
        {activeTab === 'platforms' && <PlatformsTab />}
      </div>

      {/* 右侧：AI 策略推荐 */}
      <div className="w-[340px] shrink-0">
        <div className="sticky top-4">
          <MOTRecommendationPanel
            title="客户之声 · AI 策略推荐"
            recommendations={voiceRecommendations}
            onAdopt={(rec) => showToast(`策略「${rec.title}」已采纳，将在策略中心创建草稿`, 'success')}
          />
        </div>
      </div>

      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  )
}

/* ========== Tab 1: 全量洞察 ========== */

function OverviewTab() {
  const m = overviewMetrics

  return (
    <div className="space-y-5">
      {/* 核心 KPI */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-4">
        {[
          { label: '上周评论总数', value: m.totalComments.toLocaleString(), unit: '条', change: m.totalCommentsChange, icon: MessageCircle, bg: 'bg-primary/15 text-primary' },
          { label: '本周服务总量', value: `~${(m.serviceVolume / 10000).toFixed(1)}万`, unit: '人次', change: m.serviceVolumeChange, icon: Users, bg: 'bg-accent/15 text-accent' },
          { label: '互联网平台评论', value: '12,345', unit: '条', change: m.internetPlatformChange, icon: Globe, bg: 'bg-gold/15 text-gold' },
          { label: '易服务PV', value: m.easyServicePV.toLocaleString(), unit: '', change: m.easyServicePVChange, icon: Eye, bg: 'bg-success/15 text-success' },
        ].map(s => (
          <Card key={s.label} className="group overflow-hidden hover:border-primary/30 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground">
                    {s.value}
                    {s.unit && <span className="text-sm font-normal text-muted-foreground ml-0.5">{s.unit}</span>}
                  </p>
                  <div className="flex items-center gap-1">
                    <ChangeIndicator value={s.change} />
                    <span className="text-[10px] text-muted-foreground">环比</span>
                  </div>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-md ${s.bg} transition-transform duration-200 group-hover:scale-105`}>
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* 左侧: 渠道数据明细 + 趋势图 */}
        <div className="col-span-2 space-y-5">
          {/* 渠道数据面板 */}
          <div className="grid grid-cols-2 gap-4">
            {/* 易服务 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-primary" />
                  易服务
                  <Badge variant="success" className="text-[9px]">PV显著上升</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded border border-border p-2.5">
                    <p className="text-[10px] text-muted-foreground">周度UV</p>
                    <p className="text-lg font-bold text-foreground">{m.easyServiceUV.toLocaleString()}</p>
                    <ChangeIndicator value={m.easyServiceUVChange} />
                  </div>
                  <div className="rounded border border-border p-2.5">
                    <p className="text-[10px] text-muted-foreground">周度PV</p>
                    <p className="text-lg font-bold text-foreground">{m.easyServicePV.toLocaleString()}</p>
                    <ChangeIndicator value={m.easyServicePVChange} />
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground">注: UV=去重独立客户数，PV=页面访问/点击次数</p>
              </CardContent>
            </Card>

            {/* 企业微信 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-success" />
                  企业微信
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded border border-border p-2.5">
                    <div>
                      <p className="text-[10px] text-muted-foreground">1V1聊天消息</p>
                      <p className="text-base font-bold text-foreground">{m.wechat1v1Messages}条</p>
                    </div>
                    <div className="text-right">
                      <ChangeIndicator value={m.wechat1v1Change} />
                      <p className="text-[10px] text-muted-foreground mt-0.5">互动客户 {m.wechat1v1Customers}人</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded border border-border p-2.5">
                    <div>
                      <p className="text-[10px] text-muted-foreground">群聊消息</p>
                      <p className="text-base font-bold text-foreground">{m.wechatGroupMessages.toLocaleString()}条</p>
                    </div>
                    <div className="text-right">
                      <ChangeIndicator value={m.wechatGroupChange} />
                      <p className="text-[10px] text-muted-foreground mt-0.5">互动客户 {m.wechatGroupCustomers}人</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 内容触达 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="h-4 w-4 text-accent" />
                  内容触达
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded border border-border p-2.5">
                    <p className="text-[10px] text-muted-foreground">点击次数</p>
                    <p className="text-lg font-bold text-foreground">{m.contentClicks}</p>
                    <ChangeIndicator value={m.contentClicksChange} />
                  </div>
                  <div className="rounded border border-border p-2.5">
                    <p className="text-[10px] text-muted-foreground">点击客户数</p>
                    <p className="text-lg font-bold text-foreground">{m.contentCustomers}</p>
                    <ChangeIndicator value={m.contentCustomersChange} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 电话/在线客服 */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Phone className="h-4 w-4 text-warning" />
                  电话/在线客服
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded border border-border p-2.5">
                    <p className="text-[10px] text-muted-foreground">电话接通率</p>
                    <p className="text-lg font-bold text-success">98.5%</p>
                    <p className="text-[10px] text-muted-foreground">平均等待 28秒</p>
                  </div>
                  <div className="rounded border border-border p-2.5">
                    <p className="text-[10px] text-muted-foreground">在线接通率</p>
                    <p className="text-lg font-bold text-success">99.2%</p>
                    <p className="text-[10px] text-muted-foreground">平均等待 12秒</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 周度趋势 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                近4周评论与回复趋势
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '4px', fontSize: '12px', color: 'hsl(var(--foreground))' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line type="monotone" dataKey="comments" name="评论数" stroke="hsl(215, 80%, 52%)" strokeWidth={2} dot={{ fill: 'hsl(215, 80%, 52%)', r: 3 }} />
                    <Line type="monotone" dataKey="replies" name="回复数" stroke="hsl(168, 70%, 42%)" strokeWidth={2} dot={{ fill: 'hsl(168, 70%, 42%)', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧: 平台评论分布 + 情感分布 */}
        <div className="space-y-4">
          {/* 各平台评论量 TOP5 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">互联网平台评论 TOP5</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {platformBreakdown.map((p, i) => (
                <div key={p.platform} className="rounded border border-border p-2.5 hover:border-primary/20 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`flex h-5 w-5 items-center justify-center rounded text-[9px] font-bold ${
                        i === 0 ? 'bg-gold/15 text-gold' : 'bg-secondary text-muted-foreground'
                      }`}>{i + 1}</span>
                      <span className="text-xs font-medium text-foreground">{p.platform}</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">{p.comments.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <ChangeIndicator value={p.change} />
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className="text-success">正{p.sentiment.positive}%</span>
                      <span className="text-muted-foreground">中{p.sentiment.neutral}%</span>
                      <span className="text-destructive">负{p.sentiment.negative}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 总体情感分布 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageSquareHeart className="h-4 w-4 text-gold" />
                总体情感分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{ name: '正面', value: 55 }, { name: '中性', value: 32 }, { name: '负面', value: 13 }]}
                      cx="50%" cy="50%" innerRadius={38} outerRadius={60} paddingAngle={3} dataKey="value" nameKey="name">
                      {[0, 1, 2].map(i => <Cell key={i} fill={sentimentColors[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '4px', fontSize: '12px', color: 'hsl(var(--foreground))' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-1 space-y-1.5">
                {[{ name: '正面', value: 55 }, { name: '中性', value: 32 }, { name: '负面', value: 13 }].map((item, i) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ background: sentimentColors[i] }} />
                      <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <span className="font-medium text-foreground">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <p className="text-[10px] text-muted-foreground px-1">注：仅标记较上周变化幅度超20%的情况</p>
        </div>
      </div>
    </div>
  )
}

/* ========== Tab 2: 回应详情 ========== */

function ResponseTab() {
  const r = responseMetrics
  return (
    <div className="space-y-5">
      {/* KPI */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-4">
        {[
          { label: '上周回复总数', value: r.totalReplies.toLocaleString(), unit: '条', change: r.totalRepliesChange, icon: Send, bg: 'bg-primary/15 text-primary' },
          { label: '中好评回复率', value: `${r.positiveReplyRate}%`, unit: '', change: null, icon: ThumbsUp, bg: 'bg-success/15 text-success' },
          { label: '负面情绪回复率', value: `${r.negativeReplyRate}%`, unit: '', change: null, icon: ThumbsDown, bg: 'bg-destructive/15 text-destructive' },
          { label: '业务疑问回复', value: r.businessQuestionReplies.toString(), unit: '条', change: null, icon: Target, bg: 'bg-accent/15 text-accent', extra: '回复率100%' },
        ].map(s => (
          <Card key={s.label} className="group overflow-hidden hover:border-primary/30 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold text-foreground">
                    {s.value}
                    {s.unit && <span className="text-sm font-normal text-muted-foreground ml-0.5">{s.unit}</span>}
                  </p>
                  {s.change !== null ? (
                    <ChangeIndicator value={s.change} />
                  ) : s.extra ? (
                    <Badge variant="success" className="text-[9px]">{s.extra}</Badge>
                  ) : null}
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-md ${s.bg}`}>
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* 左侧: 回复分类 + 发帖详情 */}
        <div className="col-span-2 space-y-5">
          {/* 按情感分类回复率 */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                按情感分类回复情况
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sentimentReplyData.map(item => (
                  <div key={item.type} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{item.type}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">已回复 {item.replies}条 / 共{item.total}条</span>
                        <span className="text-sm font-bold text-primary">{item.rate}%</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          item.rate === 100 ? 'bg-success' : item.rate >= 40 ? 'bg-primary' : 'bg-warning'
                        }`}
                        style={{ width: `${item.rate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 本周发帖详情 */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-accent" />
                  上周发帖详情
                </CardTitle>
                <Badge variant="secondary" className="text-[10px]">{r.totalPosts}篇</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {postList.map(post => (
                  <div key={post.title} className="flex items-center gap-3 rounded border border-border p-3 hover:border-primary/20 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{post.title}</span>
                        <Badge variant="secondary" className={`text-[9px] ${
                          post.type === '定期发布' ? 'bg-primary/12 text-primary' : 'bg-accent/12 text-accent'
                        }`}>{post.type}</Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{post.date}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                      <Eye className="h-3 w-3" />
                      {post.views.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧: 顾问消息统计 + 群发统计 */}
        <div className="space-y-4">
          {/* 顾问消息 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Send className="h-4 w-4 text-primary" />
                顾问发送消息
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded border border-border p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">1V1聊天</span>
                  <Badge variant="success" className="text-[9px]">接通率100%</Badge>
                </div>
                <p className="text-xl font-bold text-foreground">{r.advisor1v1Messages.toLocaleString()}<span className="text-sm font-normal text-muted-foreground ml-0.5">条</span></p>
                <ChangeIndicator value={r.advisor1v1Change} />
              </div>
              <div className="rounded border border-border p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">群聊</span>
                  <Badge variant="success" className="text-[9px]">接通率100%</Badge>
                </div>
                <p className="text-xl font-bold text-foreground">{r.advisorGroupMessages}<span className="text-sm font-normal text-muted-foreground ml-0.5">条</span></p>
                <ChangeIndicator value={r.advisorGroupChange} />
              </div>
            </CardContent>
          </Card>

          {/* 群发统计 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">群发统计</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: '1V1群发', value: r.broadcast1v1, unit: '次' },
                { label: '群发', value: r.broadcastGroup, unit: '次' },
                { label: '社群群发', value: r.broadcastCommunity, unit: '次' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between rounded border border-border p-2.5">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-bold text-foreground">{item.value}{item.unit}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 满意度分群 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                分客群满意度
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {analyticsData.customerSegmentAnalysis.map(seg => (
                <div key={seg.type} className="rounded border border-border p-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-foreground">{seg.type}</span>
                    <span className="text-xs text-muted-foreground">{seg.count.toLocaleString()}人</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-secondary">
                      <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${seg.avgSatisfaction}%` }} />
                    </div>
                    <span className="text-xs font-bold text-foreground">{seg.avgSatisfaction}分</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

/* ========== Tab 3: 热点聚焦 ========== */

function TopicsTab({ showToast }: { showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void }) {
  const [expandedTopic, setExpandedTopic] = useState<number | null>(1)

  return (
    <div className="space-y-5">
      {/* 热度概览 */}
      <div className="grid grid-cols-3 gap-4">
        {hotTopics.map((topic, i) => (
          <Card key={topic.id} className="group overflow-hidden hover:border-primary/30 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`flex h-6 w-6 items-center justify-center rounded text-[10px] font-bold ${
                    i === 0 ? 'bg-destructive/15 text-destructive' : i === 1 ? 'bg-gold/15 text-gold' : 'bg-primary/15 text-primary'
                  }`}>{i + 1}</span>
                  <Badge className={`text-[9px] ${topic.sourceColor}`}>{topic.source}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className={`h-3.5 w-3.5 ${topic.heat > 90 ? 'text-destructive' : topic.heat > 80 ? 'text-warning' : 'text-muted-foreground'}`} />
                  <span className="text-xs font-bold text-foreground">{topic.heat}</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-foreground mb-2 line-clamp-2">{topic.title}</p>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" />{(topic.stats.views / 1000).toFixed(1)}k</span>
                <span className="flex items-center gap-0.5"><MessageCircle className="h-3 w-3" />{topic.stats.comments.toLocaleString()}</span>
                <span className="text-destructive">负面{topic.stats.negative}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 详细讨论 */}
      <div className="space-y-4">
        {hotTopics.map(topic => {
          const isExpanded = expandedTopic === topic.id
          return (
            <Card key={topic.id} className="overflow-hidden transition-all duration-200">
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-secondary/20 transition-colors"
                onClick={() => setExpandedTopic(isExpanded ? null : topic.id)}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  topic.heat > 90 ? 'bg-destructive/15' : topic.heat > 80 ? 'bg-gold/15' : 'bg-primary/15'
                }`}>
                  <Flame className={`h-5 w-5 ${
                    topic.heat > 90 ? 'text-destructive' : topic.heat > 80 ? 'text-gold' : 'text-primary'
                  }`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-foreground">{topic.title}</span>
                    <Badge className={`text-[9px] ${topic.sourceColor}`}>{topic.source}</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{topic.context}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0 text-xs text-muted-foreground">
                  <span><Eye className="h-3 w-3 inline mr-0.5" />{topic.stats.views.toLocaleString()}</span>
                  <span><MessageCircle className="h-3 w-3 inline mr-0.5" />{topic.stats.comments.toLocaleString()}</span>
                </div>
                <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
              </div>

              {isExpanded && (
                <div className="border-t border-border px-5 py-4 bg-secondary/10 animate-fade-in">
                  <div className="grid grid-cols-3 gap-5">
                    {/* 背景描述 */}
                    <div className="col-span-2">
                      <p className="text-[10px] font-semibold text-muted-foreground mb-2">背景概述</p>
                      <p className="text-xs text-foreground/70 leading-relaxed mb-4">{topic.context}</p>
                      <p className="text-[10px] font-semibold text-muted-foreground mb-2">客户主要关注点</p>
                      <div className="space-y-1.5">
                        {topic.concerns.map((concern, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-foreground/70">
                            <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary mt-0.5">{i + 1}</span>
                            {concern}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* 数据统计 */}
                    <div className="space-y-3">
                      <div className="rounded border border-border p-3 text-center">
                        <p className="text-2xl font-bold text-primary">{(topic.stats.views / 1000).toFixed(1)}k</p>
                        <p className="text-[10px] text-muted-foreground">浏览量</p>
                      </div>
                      <div className="rounded border border-border p-3 text-center">
                        <p className="text-2xl font-bold text-foreground">{topic.stats.comments.toLocaleString()}</p>
                        <p className="text-[10px] text-muted-foreground">评论数</p>
                      </div>
                      <div className="rounded border border-border p-3 text-center">
                        <p className={`text-2xl font-bold ${topic.stats.negative > 15 ? 'text-destructive' : 'text-warning'}`}>{topic.stats.negative}%</p>
                        <p className="text-[10px] text-muted-foreground">负面情绪占比</p>
                      </div>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => showToast(`已打开「${topic.title}」完整讨论`, 'info')}>
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                        查看完整讨论
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </div>
  )
}

/* ========== Tab 4: 分平台解析 ========== */

function PlatformsTab() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null)

  return (
    <div className="space-y-5">
      <p className="text-xs text-muted-foreground">点击各平台卡片，一键查看要点信息</p>

      {/* 互联网平台 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Globe className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">互联网平台</h3>
          <Badge variant="secondary" className="text-[9px]">{platformAnalysis.internet.length}个平台</Badge>
        </div>
        <div className="grid grid-cols-3 xl:grid-cols-5 gap-3">
          {platformAnalysis.internet.map(p => (
            <Card
              key={p.name}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedPlatform === p.name ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/30'
              }`}
              onClick={() => setSelectedPlatform(selectedPlatform === p.name ? null : p.name)}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-xs font-bold text-primary">{p.icon}</span>
                  <span className="text-xs font-medium text-foreground">{p.name}</span>
                </div>
                <p className="text-lg font-bold text-foreground">{p.comments.toLocaleString()}</p>
                <div className="flex items-center justify-between mt-1">
                  <ChangeIndicator value={p.change} />
                  <span className="text-[10px] text-muted-foreground">回复率{p.replyRate}%</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 选中平台详情 */}
        {selectedPlatform && platformAnalysis.internet.find(p => p.name === selectedPlatform) && (() => {
          const p = platformAnalysis.internet.find(p => p.name === selectedPlatform)!
          return (
            <Card className="mt-3 animate-fade-in">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-sm font-bold text-primary">{p.icon}</span>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">{p.name} 平台详情</h4>
                    <p className="text-[10px] text-muted-foreground">本周关注焦点：{p.topIssue}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                  <div className="rounded border border-border p-3 text-center">
                    <p className="text-lg font-bold text-foreground">{p.comments.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">评论总数</p>
                    <ChangeIndicator value={p.change} />
                  </div>
                  <div className="rounded border border-border p-3 text-center">
                    <p className="text-lg font-bold text-primary">{p.replies}</p>
                    <p className="text-[10px] text-muted-foreground">回复数</p>
                  </div>
                  <div className="rounded border border-border p-3 text-center">
                    <p className="text-lg font-bold text-success">{p.replyRate}%</p>
                    <p className="text-[10px] text-muted-foreground">回复率</p>
                  </div>
                  <div className="rounded border border-border p-3 text-center">
                    <p className="text-sm font-bold text-foreground">{p.topIssue}</p>
                    <p className="text-[10px] text-muted-foreground">热门话题</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })()}
      </div>

      {/* 新媒体平台 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Hash className="h-4 w-4 text-accent" />
          <h3 className="text-sm font-semibold text-foreground">新媒体平台</h3>
          <Badge variant="secondary" className="text-[9px]">{platformAnalysis.newMedia.length}个平台</Badge>
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {platformAnalysis.newMedia.map(p => (
            <Card key={p.name} className="hover:border-primary/30 transition-all duration-200 hover:shadow-md">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent/10 text-xs font-bold text-accent">{p.icon}</span>
                  <span className="text-xs font-medium text-foreground">{p.name}</span>
                </div>
                <p className="text-lg font-bold text-foreground">{p.comments.toLocaleString()}</p>
                <div className="flex items-center justify-between mt-1">
                  <ChangeIndicator value={p.change} />
                  <span className="text-[10px] text-muted-foreground">回复率{p.replyRate}%</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1.5 truncate">热门：{p.topIssue}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 服务渠道 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Phone className="h-4 w-4 text-warning" />
          <h3 className="text-sm font-semibold text-foreground">服务渠道</h3>
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {platformAnalysis.service.map(s => (
            <Card key={s.name} className="hover:border-primary/30 transition-all duration-200 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-warning/10 text-xs font-bold text-warning">{s.icon}</span>
                  <span className="text-sm font-medium text-foreground">{s.name}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">{s.pv ? 'UV' : '服务量'}</span>
                    <span className="text-sm font-bold text-foreground">{s.volume.toLocaleString()}{s.pv ? '' : '人次'}</span>
                  </div>
                  <ChangeIndicator value={s.change} />
                  {s.connectionRate !== null && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">接通率</span>
                      <span className="text-xs font-bold text-success">{s.connectionRate}%</span>
                    </div>
                  )}
                  {s.avgWait !== null && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">平均等待</span>
                      <span className="text-xs text-foreground">{s.avgWait}</span>
                    </div>
                  )}
                  {s.satisfaction !== null && (
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < Math.round(s.satisfaction!) ? 'fill-warning text-warning' : 'text-secondary'}`} />
                      ))}
                      <span className="text-[10px] text-muted-foreground ml-1">{s.satisfaction}</span>
                    </div>
                  )}
                  {s.pv && (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">PV</span>
                      <div className="text-right">
                        <span className="text-xs font-bold text-foreground">{s.pv.toLocaleString()}</span>
                        <span className="text-[10px] text-success ml-1">+{s.pvChange}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
