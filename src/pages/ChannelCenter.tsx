// 易方达 MOT 系统 - 触达中心
// 来源：ICP-MOT消息推送平台 + 玄武ICC通信平台 + 广发博时数字化营销方案
// 三大功能：触点管理 | 内容工厂 | 消息管控

import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Send, Layers, ShieldCheck, GitBranch,
  Smartphone, MessageSquare, Zap, Mail, Phone, MessagesSquare, Video, Globe, Brain,
  ArrowRight, ChevronDown, ChevronUp, CheckCircle2, Clock, XCircle, AlertTriangle,
  FileText, Tag, Filter, ToggleLeft, ToggleRight, Eye, Copy, TrendingUp,
  ArrowDownRight, Shield, Search, BarChart3, ChevronRight,
  Activity, MousePointer, ShoppingCart,
  Sparkles, Wrench, Users, RefreshCw, Heart, PlayCircle, BookOpen, Pencil, MapPin,
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, Cell } from 'recharts'
import { deliveryChannels, routingRules, contentTemplates, messageControlRules, channelTrends, motInstances, conversionFunnelData } from '@/data/channelData'
import type { TraceNode } from '@/data/types'

const iconMap: Record<string, React.ElementType> = {
  Smartphone, MessageSquare, Zap, Mail, Phone, MessagesSquare, Video, Globe, Brain,
}

type TabType = 'channels' | 'content' | 'control' | 'tracking'

const tabs: { key: TabType; label: string; icon: React.ElementType }[] = [
  { key: 'channels', label: '触点管理', icon: Send },
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
            {activeTab === 'channels' ? '全渠道触点矩阵与触达位置管理' :
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

// ===== 触点位置数据 =====
const touchpointPositions: {
  channelId: string
  positions: { name: string; location: string; type: string; status: 'active' | 'testing' | 'inactive'; dailyExposure: number; clickRate: number; desc: string }[]
}[] = [
  {
    channelId: 'CH001',
    positions: [
      { name: '首页Banner位', location: 'APP > 首页 > 顶部Banner轮播', type: '图文展示', status: 'active', dailyExposure: 128000, clickRate: 4.2, desc: '首页顶部轮播Banner，最多5张，支持深度链接跳转至基金详情/活动页' },
      { name: '消息中心通知卡片', location: 'APP > 消息中心 > 通知列表', type: '通知消息', status: 'active', dailyExposure: 89000, clickRate: 12.5, desc: '消息中心内的通知卡片，支持富文本和操作按钮' },
      { name: '全屏弹窗推送', location: 'APP > 启动/切换 > 全屏弹窗', type: '弹窗', status: 'active', dailyExposure: 45000, clickRate: 8.3, desc: '用户启动APP或从后台切换时触发的全屏弹窗，每日最多1次' },
      { name: '基金详情页推荐位', location: 'APP > 基金详情 > 底部推荐区', type: '信息流', status: 'active', dailyExposure: 36000, clickRate: 6.8, desc: '基金详情页底部的相关产品推荐位，根据用户持仓智能推荐' },
      { name: '持仓页浮层提示', location: 'APP > 持仓 > 智能浮层气泡', type: '浮层提示', status: 'active', dailyExposure: 52000, clickRate: 15.2, desc: '持仓页面的智能浮层提示，如波动预警、定投提醒、收益里程碑' },
      { name: '首页信息流卡片', location: 'APP > 首页 > 信息流区域', type: '信息流', status: 'active', dailyExposure: 96000, clickRate: 3.5, desc: '首页下滑信息流中的推荐内容卡片，AI个性化排序' },
      { name: '理财频道顶部推荐', location: 'APP > 理财频道 > 顶部卡片', type: '卡片展示', status: 'active', dailyExposure: 68000, clickRate: 5.8, desc: '理财频道顶部的精选推荐卡片，展示热门产品和策略' },
    ],
  },
  {
    channelId: 'CH002',
    positions: [
      { name: '标准营销短信', location: '短信 > 营销通道 > 70字文本', type: '文本消息', status: 'active', dailyExposure: 24800, clickRate: 2.1, desc: '70字以内营销短信，含退订提示，走营销通道' },
      { name: '通知类短信', location: '短信 > 通知通道 > 服务提醒', type: '通知消息', status: 'active', dailyExposure: 15600, clickRate: 5.6, desc: '交易提醒、净值变动、分红到账等服务通知类短信' },
      { name: '带短链短信', location: '短信 > 营销通道 > 含短链', type: '文本+链接', status: 'active', dailyExposure: 8900, clickRate: 7.8, desc: '含短链接的短信，可跳转H5落地页或APP深度链接' },
    ],
  },
  {
    channelId: 'CH003',
    positions: [
      { name: '图文卡片消息', location: '5G消息 > 图文卡片 > 原生入口', type: '富媒体', status: 'active', dailyExposure: 5200, clickRate: 18.5, desc: '支持图片+文字+按钮的富媒体卡片，短信入口原生展示' },
      { name: '视频消息卡片', location: '5G消息 > 视频卡片 > 内嵌播放', type: '视频', status: 'active', dailyExposure: 2100, clickRate: 22.3, desc: '支持内嵌视频播放的消息卡片，适合行情解读和投教' },
      { name: '轮播图消息', location: '5G消息 > 轮播卡片 > 多图展示', type: '富媒体', status: 'testing', dailyExposure: 800, clickRate: 15.6, desc: '左右滑动的轮播图消息，适合多产品组合展示' },
      { name: '菜单交互消息', location: '5G消息 > 菜单卡片 > 快捷操作', type: '交互', status: 'active', dailyExposure: 1500, clickRate: 25.1, desc: '带操作菜单的交互式消息，支持一键跳转申购/赎回' },
    ],
  },
  {
    channelId: 'CH004',
    positions: [
      { name: '链接解析卡片', location: 'AIM > 链接增强 > 自动解析', type: '增强展示', status: 'active', dailyExposure: 8500, clickRate: 14.2, desc: '短信中链接自动解析为带图卡片，提升点击率3-5倍' },
      { name: '品牌LOGO展示', location: 'AIM > 品牌增强 > 头部LOGO', type: '品牌展示', status: 'active', dailyExposure: 12300, clickRate: 8.7, desc: '短信头部展示易方达品牌LOGO+公司名称，增强信任度' },
      { name: '底部快捷菜单', location: 'AIM > 底部菜单 > 快捷入口', type: '交互', status: 'active', dailyExposure: 6800, clickRate: 11.5, desc: '短信底部增加"查看详情/立即申购/联系客服"快捷菜单' },
    ],
  },
  {
    channelId: 'CH005',
    positions: [
      { name: 'HTML营销邮件', location: '邮件 > 营销模板 > 富文本排版', type: '富文本', status: 'active', dailyExposure: 6800, clickRate: 4.5, desc: 'HTML格式营销邮件，支持复杂排版、嵌入图表和CTA按钮' },
      { name: '研报附件邮件', location: '邮件 > 研报推送 > PDF附件', type: '附件', status: 'active', dailyExposure: 2100, clickRate: 28.6, desc: '含PDF研报附件的邮件，适合深度内容分发给专家型客户' },
      { name: '周报/月报摘要', location: '邮件 > 定期报告 > 自动生成', type: '定期推送', status: 'active', dailyExposure: 4500, clickRate: 18.3, desc: '定期发送的持仓报告、市场周报摘要邮件，含可视化图表' },
      { name: '纯文本通知邮件', location: '邮件 > 服务通知 > 纯文本', type: '纯文本', status: 'active', dailyExposure: 1800, clickRate: 6.2, desc: '简洁的纯文本格式服务通知邮件，如账户变动、密码修改' },
    ],
  },
  {
    channelId: 'CH006',
    positions: [
      { name: '1V1私聊消息', location: '企微 > 私聊 > 文本/图文消息', type: '即时消息', status: 'active', dailyExposure: 3200, clickRate: 45.8, desc: '专属客服1对1私聊消息，支持文本、图片、视频、小程序' },
      { name: '会话卡片消息', location: '企微 > 私聊 > 结构化卡片', type: '卡片消息', status: 'active', dailyExposure: 1800, clickRate: 38.2, desc: '企微会话中的结构化卡片消息，带标题摘要和操作按钮' },
      { name: '客户朋友圈', location: '企微 > 客户朋友圈 > 动态发布', type: '朋友圈', status: 'active', dailyExposure: 5600, clickRate: 8.5, desc: '客服人员发布的企微朋友圈内容，如市场观点、产品推荐' },
      { name: '客户群群发', location: '企微 > 客户群 > 群消息推送', type: '群消息', status: 'active', dailyExposure: 2800, clickRate: 12.3, desc: '投资者交流群内的群发消息，适合盘后复盘和热点解读' },
      { name: '易服务小程序卡片', location: '企微 > 私聊 > 小程序分享', type: '小程序', status: 'active', dailyExposure: 1500, clickRate: 32.6, desc: '分享易服务小程序页面给客户，一键进入定投/持仓/工具' },
      { name: '易服务小程序首页Banner', location: '易服务小程序 > 首页 > Banner位', type: '图文展示', status: 'active', dailyExposure: 35000, clickRate: 6.8, desc: '易服务小程序首页顶部Banner轮播，承载营销活动和产品推荐' },
      { name: '易服务小程序服务入口', location: '易服务小程序 > 服务页 > 功能入口', type: '常驻入口', status: 'active', dailyExposure: 28000, clickRate: 9.2, desc: '易服务小程序服务页的工具/计算器/诊断等功能入口位' },
      { name: '易服务小程序弹窗', location: '易服务小程序 > 访问时 > 弹窗提醒', type: '弹窗', status: 'active', dailyExposure: 12000, clickRate: 11.5, desc: '用户访问易服务小程序时的个性化弹窗推荐，千人千面' },
    ],
  },
  {
    channelId: 'CH007',
    positions: [
      { name: '15秒竖版短视频', location: '视频短信 > 竖版15s > 行情快讯', type: '短视频', status: 'active', dailyExposure: 1800, clickRate: 35.2, desc: '15秒竖版短视频消息，适合行情快讯和产品一句话介绍' },
      { name: '30秒横版视频', location: '视频短信 > 横版30s > 深度解读', type: '视频', status: 'active', dailyExposure: 900, clickRate: 28.6, desc: '30秒横版视频消息，适合基金经理观点和深度市场解读' },
      { name: '图文视频混排', location: '视频短信 > 混排消息 > 图文+视频', type: '混合媒体', status: 'testing', dailyExposure: 500, clickRate: 42.1, desc: '图片+视频+文字混合排版消息，信息密度最高' },
    ],
  },
  {
    channelId: 'CH008',
    positions: [
      { name: 'AI智能外呼', location: '电话 > IVR机器人 > 自动外呼', type: 'AI外呼', status: 'active', dailyExposure: 600, clickRate: 62.5, desc: 'AI语音机器人外呼，适合标准化场景如回访确认和满意度调查' },
      { name: '人工专属外呼', location: '电话 > 客服坐席 > 1V1外呼', type: '人工外呼', status: 'active', dailyExposure: 400, clickRate: 78.3, desc: '专属客服人工外呼，适合VIP客户和高价值场景如大额挽回' },
      { name: '预约回访电话', location: '电话 > 预约系统 > 定时回访', type: '预约外呼', status: 'active', dailyExposure: 200, clickRate: 85.6, desc: '客户预约时段的定时回访电话，接通率最高可达85%以上' },
    ],
  },
  {
    channelId: 'CH009',
    positions: [
      { name: '服务号模板消息', location: '公众号 > 模板消息 > 一对一推送', type: '模板消息', status: 'active', dailyExposure: 8500, clickRate: 12.8, desc: '微信服务号模板消息推送，到达率高，支持跳转小程序/H5' },
      { name: '图文推送(头条位)', location: '公众号 > 群发图文 > 头条', type: '图文', status: 'active', dailyExposure: 16500, clickRate: 8.5, desc: '公众号群发消息头条位，阅读量最高，适合重点内容推送' },
      { name: '图文推送(次条位)', location: '公众号 > 群发图文 > 次条', type: '图文', status: 'active', dailyExposure: 16500, clickRate: 3.2, desc: '公众号群发消息次条位，适合补充内容和常规投教' },
      { name: '菜单栏常驻入口', location: '公众号 > 底部菜单 > 固定入口', type: '常驻入口', status: 'active', dailyExposure: 25000, clickRate: 2.1, desc: '公众号底部菜单栏的固定入口，如"我的账户""在线客服"' },
      { name: '关注自动回复', location: '公众号 > 新关注 > 欢迎消息', type: '自动回复', status: 'active', dailyExposure: 1200, clickRate: 35.4, desc: '新关注用户自动回复消息，含新手引导和专属福利领取' },
    ],
  },
]

const _allPositions = touchpointPositions.flatMap(t => t.positions)
const _totalPositionCount = _allPositions.length
const _totalDailyExposure = _allPositions.reduce((s, p) => s + p.dailyExposure, 0)
const _avgPositionClickRate = (_allPositions.reduce((s, p) => s + p.clickRate, 0) / _totalPositionCount).toFixed(1)

// ===== Tab 1: 触点管理 =====
function ChannelManagementTab() {
  const [expandedChannel, setExpandedChannel] = useState<string | null>('CH001')
  const [selectedPosition, setSelectedPosition] = useState<{ channelId: string; posIdx: number } | null>(null)
  const [showRouting, setShowRouting] = useState(false)

  const selectedPos = selectedPosition
    ? touchpointPositions.find(t => t.channelId === selectedPosition.channelId)?.positions[selectedPosition.posIdx]
    : null
  const selectedChannelInfo = selectedPosition
    ? deliveryChannels.find(c => c.id === selectedPosition.channelId)
    : null

  return (
    <div className="space-y-4">
      {/* KPI */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: '触点渠道', value: deliveryChannels.length + '个', sub: '全部在线运行中', color: 'primary' },
          { label: '触达位置', value: _totalPositionCount + '个', sub: '覆盖全渠道具体位置', color: 'success' },
          { label: '日均总曝光', value: (_totalDailyExposure / 10000).toFixed(1) + '万', sub: '全触点合计', color: 'accent' },
          { label: '平均点击率', value: _avgPositionClickRate + '%', sub: '全触达位置均值', color: 'gold' },
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
        {/* 触点列表 */}
        <div className="col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-primary" />
              触点矩阵 · 触达位置
            </h3>
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

          {/* 触点可展开列表 */}
          <div className="space-y-2 max-h-[560px] overflow-y-auto">
            {deliveryChannels.map(ch => {
              const Icon = iconMap[ch.icon] || Smartphone
              const isExpanded = expandedChannel === ch.id
              const tpData = touchpointPositions.find(t => t.channelId === ch.id)
              const positions = tpData?.positions || []

              return (
                <div key={ch.id} className={`rounded-lg border transition-all duration-200 ${
                  isExpanded ? 'border-primary/30 bg-primary/[0.02]' : 'border-border bg-card'
                }`}>
                  <button
                    onClick={() => setExpandedChannel(isExpanded ? null : ch.id)}
                    className="w-full text-left p-3 flex items-center gap-3"
                  >
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isExpanded ? 'bg-primary/12' : 'bg-secondary'
                    }`}>
                      <Icon className={`h-4 w-4 ${isExpanded ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-foreground">{ch.name}</span>
                        <span className="text-[9px] text-muted-foreground">{ch.typeLabel}</span>
                        <span className={`h-1.5 w-1.5 rounded-full ${ch.status === 'online' ? 'bg-success' : 'bg-warning'}`} />
                      </div>
                      <div className="flex items-center gap-3 text-[9px] text-muted-foreground mt-0.5">
                        <span>送达{ch.deliveryRate}%</span>
                        <span>打开{ch.openRate}%</span>
                        <span>转化{ch.conversionRate}%</span>
                        <span>日均{(ch.dailyVolume / 1000).toFixed(1)}k</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-medium text-primary bg-primary/8 px-2 py-0.5 rounded-full">
                        {positions.length}个位置
                      </span>
                      {isExpanded
                        ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                        : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
                    </div>
                  </button>

                  {isExpanded && positions.length > 0 && (
                    <div className="px-3 pb-3 border-t border-border/50">
                      <div className="pt-2 space-y-1.5">
                        {positions.map((pos, idx) => {
                          const isSelected = selectedPosition?.channelId === ch.id && selectedPosition?.posIdx === idx
                          return (
                            <button
                              key={idx}
                              onClick={() => setSelectedPosition(isSelected ? null : { channelId: ch.id, posIdx: idx })}
                              className={`w-full text-left rounded-md p-2.5 transition-all ${
                                isSelected
                                  ? 'bg-primary/8 border border-primary/25 shadow-sm'
                                  : 'bg-card border border-border/50 hover:border-primary/20 hover:bg-primary/[0.02]'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <MapPin className={`h-3 w-3 shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                                  <span className="text-[11px] font-medium text-foreground">{pos.name}</span>
                                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                                    pos.status === 'active' ? 'bg-success/10 text-success' :
                                    pos.status === 'testing' ? 'bg-warning/10 text-[hsl(var(--warning))]' :
                                    'bg-muted text-muted-foreground'
                                  }`}>{pos.status === 'active' ? '已上线' : pos.status === 'testing' ? '测试中' : '未启用'}</span>
                                </div>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground shrink-0">{pos.type}</span>
                              </div>
                              <p className="text-[9px] text-muted-foreground/70 ml-5 mb-1">{pos.location}</p>
                              <div className="flex items-center gap-4 ml-5 text-[9px] text-muted-foreground/60">
                                <span>日均曝光 {pos.dailyExposure >= 10000 ? (pos.dailyExposure / 10000).toFixed(1) + '万' : (pos.dailyExposure / 1000).toFixed(1) + 'k'}</span>
                                <span>点击率 <span className={pos.clickRate > 20 ? 'text-success font-medium' : ''}>{pos.clickRate}%</span></span>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 右侧详情面板 */}
        <div className="space-y-3">
          {selectedPos && selectedChannelInfo ? (
            <div className="rounded-lg border border-border bg-card p-3 space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">{selectedPos.name}</h3>
              </div>
              <div className="flex items-center gap-1.5 text-[10px]">
                {(() => { const Icon = iconMap[selectedChannelInfo.icon] || Smartphone; return <Icon className="h-3 w-3 text-muted-foreground" /> })()}
                <span className="text-muted-foreground">{selectedChannelInfo.name}</span>
                <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
                <span className="text-primary font-medium">{selectedPos.name}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{selectedPos.desc}</p>

              <div className="space-y-2">
                {[
                  { l: '完整路径', v: selectedPos.location },
                  { l: '展示类型', v: selectedPos.type },
                  { l: '启用状态', v: selectedPos.status === 'active' ? '已上线' : selectedPos.status === 'testing' ? '测试中' : '未启用' },
                  { l: '日均曝光', v: selectedPos.dailyExposure.toLocaleString() + '次' },
                  { l: '平均点击率', v: selectedPos.clickRate + '%' },
                  { l: '渠道送达率', v: selectedChannelInfo.deliveryRate + '%' },
                  { l: '渠道转化率', v: selectedChannelInfo.conversionRate + '%' },
                  { l: '路由优先级', v: '#' + selectedChannelInfo.routingPriority },
                  { l: '单条成本', v: '¥' + selectedChannelInfo.costPerMessage },
                ].map(item => (
                  <div key={item.l} className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground">{item.l}</span>
                    <span className="text-foreground font-medium">{item.v}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 mt-2">
                {[
                  { label: '点击率', value: selectedPos.clickRate, color: 'bg-primary' },
                  { label: '渠道送达率', value: selectedChannelInfo.deliveryRate, color: 'bg-success' },
                  { label: '渠道转化率', value: selectedChannelInfo.conversionRate, color: 'bg-accent' },
                ].map(bar => (
                  <div key={bar.label}>
                    <div className="flex justify-between text-[10px] mb-0.5">
                      <span className="text-muted-foreground">{bar.label}</span>
                      <span className="font-medium text-foreground">{bar.value}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div className={`h-full rounded-full ${bar.color} transition-all duration-500`} style={{ width: `${Math.min(bar.value, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {selectedChannelInfo.fallbackChannelId && (
                <div className="flex items-center gap-1.5 p-1.5 rounded bg-primary/4 border border-primary/10">
                  <ArrowRight className="h-3 w-3 text-primary shrink-0" />
                  <span className="text-[10px] text-primary">
                    降级渠道：{deliveryChannels.find(c => c.id === selectedChannelInfo.fallbackChannelId)?.name}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-card/50 p-6 text-center">
              <MapPin className="h-6 w-6 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">点击左侧触达位置查看详情</p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">覆盖{deliveryChannels.length}大渠道 × {_totalPositionCount}个触达位置</p>
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

// 投资财富工具数据
const wealthTools = [
  { id: 'WT01', name: '蚂蚁福利社', category: '互动福利类', desc: '互动福利签到、抽奖、答题红包等趣味营销工具', usage: 12680, status: 'active' as const },
  { id: 'WT02', name: '蚂蚁答题翻红包', category: '互动福利类', desc: '基金知识问答+红包奖励，提升投教互动率', usage: 8940, status: 'active' as const },
  { id: 'WT03', name: '蚂蚁投资模拟大赛', category: '模拟/竞赛类', desc: '零风险模拟投资竞赛，培养客户投资兴趣与信心', usage: 3250, status: 'active' as const },
  { id: 'WT04', name: '养老税优计算器', category: '计算工具类', desc: '个人养老金税收优惠精准计算，支持不同收入档位试算', usage: 6780, status: 'active' as const },
  { id: 'WT05', name: '易方达养老计算器', category: '计算工具类', desc: '退休缺口分析+定投方案推荐，助力客户养老规划', usage: 5120, status: 'active' as const },
  { id: 'WT06', name: '蚂蚁定投专区', category: '定投专区类', desc: '智能定投策略推荐、回测工具、定投组合管理', usage: 15200, status: 'active' as const },
  { id: 'WT07', name: '亲子定投（宝贝计划）', category: '定投专区类', desc: '为子女教育金配置定投计划，可视化成长曲线', usage: 4560, status: 'active' as const },
  { id: 'WT08', name: '养老定投（未来投）', category: '定投专区类', desc: '养老场景专属定投方案，下滑加仓+目标止盈', usage: 3890, status: 'active' as const },
  { id: 'WT09', name: '蚂蚁闲钱规划', category: '资金规划类', desc: '闲置资金智能配置，短中长期资金分层管理', usage: 7650, status: 'active' as const },
  { id: 'WT10', name: 'AI智能选基助手', category: '选基/指数工具类', desc: '基于客户画像与市场趋势，AI自动推荐匹配基金', usage: 9870, status: 'active' as const },
  { id: 'WT11', name: '指数通（指数联盟）', category: '选基/指数工具类', desc: '指数温度计+行业链图谱，帮助客户理解指数投资', usage: 6340, status: 'active' as const },
  { id: 'WT12', name: '蚂蚁智能讨论室', category: '智能交流类', desc: 'AI驱动的在线讨论社区，实时解答投资疑问', usage: 4120, status: 'active' as const },
  { id: 'WT13', name: '易观察研究（宏观数据）', category: '研究资讯类', desc: '宏观经济数据实时追踪与可视化解读', usage: 5680, status: 'active' as const },
  { id: 'WT14', name: '每日财经早报', category: '研究资讯类', desc: '每日市场资讯精编：开盘要闻、盘中速递、收盘点评', usage: 18900, status: 'active' as const },
  { id: 'WT15', name: '易定投小程序', category: '小程序工具类', desc: '微信生态内的轻量定投工具，降低使用门槛', usage: 11200, status: 'active' as const },
  { id: 'WT16', name: '310易方达指数通车直播', category: '直播互动类', desc: '每日ETF盘后直播+基金经理问答，增强客户粘性', usage: 8760, status: 'active' as const },
  { id: 'WT17', name: '小e说FOF', category: '投教课程/栏目类', desc: 'FOF产品系列投教课程，通俗讲解组合投资理念', usage: 3450, status: 'active' as const },
  { id: 'WT18', name: '季报解读H5', category: 'H5/落地页类', desc: '基金季报可视化解读，数据图表+基金经理观点', usage: 7890, status: 'active' as const },
]

const toolCatIcons: Record<string, React.ElementType> = {
  '互动福利类': Heart, '模拟/竞赛类': BarChart3, '计算工具类': TrendingUp,
  '定投专区类': RefreshCw, '资金规划类': Shield, '选基/指数工具类': Search,
  '智能交流类': MessageSquare, '研究资讯类': Sparkles, '小程序工具类': Smartphone,
  '直播互动类': PlayCircle, '投教课程/栏目类': BookOpen, 'H5/落地页类': Globe,
  '产品/经理详情类': Users,
}

// 营销内容数据
const marketingContents = [
  { id: 'MC01', name: '季度报告摘要', category: '报告解读类', format: '研报', desc: '基金季报核心数据提炼与观点解读，适合专业客户', usage: 6540, status: 'active' as const },
  { id: 'MC02', name: '持仓客户长图', category: '长图物料类', format: '长图', desc: '个性化持仓分析长图，一图读懂组合表现', usage: 8920, status: 'active' as const },
  { id: 'MC03', name: '养老产品月度长图', category: '长图物料类', format: '长图', desc: '养老产品月度运作数据可视化长图', usage: 3210, status: 'active' as const },
  { id: 'MC04', name: '一页通产品概览', category: '一页通物料类', format: '一页通', desc: '单页纸精炼产品核心卖点、业绩、经理简介', usage: 7650, status: 'active' as const },
  { id: 'MC05', name: '310每日市场播报', category: '行情资讯栏目类', format: '视频', desc: '每日3分10秒市场速览，覆盖大盘、板块、热点', usage: 15600, status: 'active' as const },
  { id: 'MC06', name: '数字人基金季报', category: '数字人相关内容类', format: 'H5', desc: 'AI数字人播报基金季报，提升阅读体验与互动性', usage: 4580, status: 'active' as const },
  { id: 'MC07', name: '产品介绍短视频', category: '视频内容类', format: '视频', desc: '60秒产品亮点短视频，适合社交媒体分发', usage: 12300, status: 'active' as const },
  { id: 'MC08', name: 'IP形象节日海报', category: '对客海报类', format: '长图', desc: '节日关怀+品牌IP视觉海报，增强情感连接', usage: 9870, status: 'active' as const },
  { id: 'MC09', name: '爆款营销模板', category: '营销模板类', format: '一页通', desc: '热销基金营销文案模板，支持个性化参数替换', usage: 5430, status: 'active' as const },
  { id: 'MC10', name: '指数基础跟踪PPT', category: 'PPT资料类', format: '研报', desc: '指数产品跟踪周报/月报PPT，适合渠道经理使用', usage: 2340, status: 'active' as const },
  { id: 'MC11', name: '小易问答系列', category: '小易系列内容类', format: '视频', desc: '小易IP动画问答：平台余额、保险箱、权益等', usage: 6780, status: 'active' as const },
  { id: 'MC12', name: '稳健产品周报', category: '周报资料类', format: '研报', desc: '固收+产品每周运作数据与市场展望', usage: 4120, status: 'active' as const },
  { id: 'MC13', name: 'AI快讯速递', category: '专项资料类', format: '视频', desc: 'AI自动生成的市场快讯短视频，实时热点解读', usage: 11500, status: 'active' as const },
  { id: 'MC14', name: '数字大使工厂巡礼', category: '专项资料类', format: 'H5', desc: '虚拟数字人带领客户参观基金运作流程', usage: 1890, status: 'active' as const },
]

const contentCatIcons: Record<string, React.ElementType> = {
  '报告解读类': BarChart3, '长图物料类': Pencil, '一页通物料类': FileText,
  '行情资讯栏目类': TrendingUp, '数字人相关内容类': Sparkles, '视频内容类': PlayCircle,
  '对客海报类': Tag, '营销模板类': Mail, 'PPT资料类': FileText,
  '小易系列内容类': Heart, '周报资料类': Clock, '专项资料类': Shield,
}

const fmtColors: Record<string, string> = {
  '视频': 'bg-accent/15 text-accent border-accent/20',
  '研报': 'bg-primary/15 text-primary border-primary/20',
  '长图': 'bg-warning/15 text-[hsl(var(--warning))] border-warning/20',
  '一页通': 'bg-success/15 text-success border-success/20',
  'H5': 'bg-[hsl(var(--gold))/15] text-[hsl(var(--gold))] border-[hsl(var(--gold))/20]',
}

// AI千人千面示例数据
const aiPersonalizedExamples = [
  {
    customer: '张建国', type: '稳健价值型', trigger: '收入变动配置建议',
    items: [
      { kind: 'tool' as const, name: '智能定投金额优化器', cat: '定投专区类' },
      { kind: 'tool' as const, name: '收入变动资产再配置计算器', cat: '资金规划类' },
      { kind: 'content' as const, name: '加薪后的理财黄金法则（一图读懂）', cat: '长图物料类', format: '长图' },
      { kind: 'content' as const, name: '2026年稳健配置策略白皮书', cat: '报告解读类', format: '研报' },
      { kind: 'message' as const, name: '专属话术：恭喜您的事业进步，建议优化定投与债券配置比例' },
    ],
    reasoning: '客户刚获晋升，薪资上调15%。推荐定投优化器+配置计算器帮助即时行动，搭配长图和白皮书匹配其深度阅读偏好。',
  },
  {
    customer: '周婷', type: '积极交易型', trigger: '基金净值大幅回撤预警',
    items: [
      { kind: 'tool' as const, name: '定投智能回测工具', cat: '模拟/竞赛类' },
      { kind: 'tool' as const, name: '持仓亏损压力测试器', cat: '计算工具类' },
      { kind: 'content' as const, name: '3分钟看懂：基金亏损时最常犯的3个错误', cat: '视频内容类', format: '视频' },
      { kind: 'message' as const, name: '专属话术：注意到您近期投资波动，已整理个性化持仓诊断报告' },
    ],
    reasoning: '客户情绪稳定性极低，频繁追涨杀跌。推荐回测工具+压力测试器缓解焦虑，配合短视频引导理性决策。',
  },
  {
    customer: '刘洋', type: 'VIP高净值', trigger: '生日专属关怀',
    items: [
      { kind: 'tool' as const, name: 'VIP专属基金经理1对1直播预约', cat: '直播互动类' },
      { kind: 'tool' as const, name: '年度专属资产配置复盘报告', cat: '产品/经理详情类' },
      { kind: 'content' as const, name: 'AI数字人定制生日祝福视频', cat: '数字人相关内容类', format: 'H5' },
      { kind: 'content' as const, name: '2026全球AI算力产业链独家投资机会', cat: '专项资料类', format: '研报' },
    ],
    reasoning: 'VIP客户(185万资产)，采用"尊享体验+精准内容"策略：1对1直播+AI数字人视频+AI研报。未发话术——由专属客服口头传达更显诚意。',
  },
  {
    customer: '孙明远', type: '专家型投资者', trigger: '生日关怀',
    items: [
      { kind: 'tool' as const, name: 'AI智能选基助手', cat: '选基/指数工具类' },
      { kind: 'tool' as const, name: '家庭资产配置规划器', cat: '资金规划类' },
      { kind: 'content' as const, name: '2026Q1创新药赛道深度报告', cat: '报告解读类', format: '研报' },
      { kind: 'message' as const, name: '专属话术：生日快乐！专属生日权益：定投费率8折+100积分' },
    ],
    reasoning: '专家级投资者(知识水平92/100)，重度研报消费者。推送关注的创新药研报+智能选基工具匹配其组合优化习惯。',
  },
]

function ContentFactoryTab() {
  const [subTab, setSubTab] = useState<'templates' | 'tools' | 'contents' | 'ai'>('templates')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [toolSearch, setToolSearch] = useState('')
  const [toolCatFilter, setToolCatFilter] = useState('all')
  const [contentSearch, setContentSearch] = useState('')
  const [contentCatFilter, setContentCatFilter] = useState('all')

  // 消息模板相关
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
  const approvedCount = contentTemplates.filter(t => t.complianceStatus === 'approved').length
  const totalUsage = contentTemplates.reduce((s, t) => s + t.usageCount, 0)

  // 工具相关
  const toolCats = ['all', ...Array.from(new Set(wealthTools.map(t => t.category)))]
  const filteredTools = wealthTools.filter(t => {
    const matchCat = toolCatFilter === 'all' || t.category === toolCatFilter
    const matchSearch = !toolSearch || t.name.includes(toolSearch) || t.desc.includes(toolSearch)
    return matchCat && matchSearch
  })

  // 内容相关
  const contentCats = ['all', ...Array.from(new Set(marketingContents.map(c => c.category)))]
  const filteredContents = marketingContents.filter(c => {
    const matchCat = contentCatFilter === 'all' || c.category === contentCatFilter
    const matchSearch = !contentSearch || c.name.includes(contentSearch) || c.desc.includes(contentSearch)
    return matchCat && matchSearch
  })

  const subTabs = [
    { key: 'templates' as const, label: '消息模板', icon: MessageSquare, count: contentTemplates.length },
    { key: 'tools' as const, label: '投资财富工具', icon: Wrench, count: wealthTools.length },
    { key: 'contents' as const, label: '营销内容', icon: Layers, count: marketingContents.length },
    { key: 'ai' as const, label: 'AI千人千面', icon: Brain, count: aiPersonalizedExamples.length },
  ]

  return (
    <div className="space-y-4">
      {/* KPI 统计 */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: '消息模板', value: contentTemplates.length.toString(), sub: `${approvedCount}个已审核通过`, color: 'primary' },
          { label: '投资财富工具', value: wealthTools.length.toString(), sub: `覆盖${toolCats.length - 1}大类别`, color: 'accent' },
          { label: '营销内容', value: marketingContents.length.toString(), sub: `${Array.from(new Set(marketingContents.map(c => c.format))).length}种内容格式`, color: 'success' },
          { label: 'AI千人千面', value: '实时生成', sub: '基于客户画像×MOT规则', color: 'gold' },
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

      {/* 子 Tab 切换 */}
      <div className="flex items-center gap-1 border-b border-border pb-0">
        {subTabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setSubTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors -mb-px ${
                subTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
              <span className={`text-[9px] px-1.5 py-0 rounded-full ${
                subTab === tab.key ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'
              }`}>{tab.count}</span>
            </button>
          )
        })}
      </div>

      {/* ====== 消息模板 Tab ====== */}
      {subTab === 'templates' && (
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                <input type="text" placeholder="搜索模板名称或内容..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="h-7 w-full rounded border border-border bg-card pl-7 pr-3 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none" />
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {categories.map(cat => (
                <button key={cat.key} onClick={() => setSelectedCategory(cat.key)}
                  className={`text-[11px] px-2 py-1 rounded-full transition-colors ${
                    selectedCategory === cat.key ? 'bg-primary/10 text-primary font-medium' : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                  }`}>
                  {cat.label}<span className="ml-1 text-[9px] opacity-60">{cat.count}</span>
                </button>
              ))}
            </div>
            <div className="space-y-2 max-h-[520px] overflow-y-auto">
              {filteredTemplates.map(t => (
                <button key={t.id} onClick={() => setSelectedTemplate(selectedTemplate === t.id ? null : t.id)}
                  className={`w-full text-left rounded-lg border p-3 transition-all duration-200 ${
                    selectedTemplate === t.id ? 'border-primary bg-primary/4' : 'border-border bg-card hover:border-primary/20'
                  }`}>
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                        t.category === 'volatility_companion' ? 'bg-destructive/10 text-destructive' :
                        t.category === 'holding_companion' ? 'bg-primary/10 text-primary' :
                        t.category === 'marketing' ? 'bg-accent/10 text-accent' :
                        t.category === 'risk_alert' ? 'bg-warning/10 text-[hsl(var(--warning))]' :
                        t.category === 'compliance' ? 'bg-muted text-muted-foreground' :
                        'bg-success/10 text-success'
                      }`}>{t.categoryLabel}</span>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        t.timingType === 'T+0' ? 'bg-success/8 text-success' : t.timingType === 'T+3' ? 'bg-primary/8 text-primary' : 'bg-accent/8 text-accent'
                      }`}>{t.timingType}</span>
                      <h4 className="text-xs font-medium text-foreground">{t.name}</h4>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {t.complianceStatus === 'approved' ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> :
                       t.complianceStatus === 'pending_review' ? <Clock className="h-3.5 w-3.5 text-[hsl(var(--warning))]" /> :
                       <XCircle className="h-3.5 w-3.5 text-destructive" />}
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
                <div className={`rounded p-2.5 border transition-all ${showPreview ? 'bg-card border-primary/30 ring-1 ring-primary/10' : 'bg-secondary/50 border-border/50'}`}>
                  {showPreview && <p className="text-[9px] text-primary font-semibold mb-1.5">模板预览模式</p>}
                  <p className={`leading-relaxed whitespace-pre-wrap ${showPreview ? 'text-xs text-foreground' : 'text-[11px] text-foreground'}`}>
                    {showPreview
                      ? template.content.replace(/\{\{customerName\}\}/g, '张建国').replace(/\{\{fundName\}\}/g, '易方达蓝筹精选混合').replace(/\{\{(\w+)\}\}/g, (_, p) => `[示例${p}]`)
                      : template.content.replace(/\{\{(\w+)\}\}/g, (_, param) => `[${param}]`)}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] font-semibold text-muted-foreground mb-1.5">动态参数</h4>
                  <div className="flex flex-wrap gap-1">
                    {template.dynamicParams.map(p => (
                      <span key={p} className="text-[9px] px-1.5 py-0.5 rounded bg-primary/8 text-primary font-mono">{`{{${p}}}`}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  {[
                    { l: '分类', v: template.categoryLabel },
                    { l: '时序类型', v: template.timingType === 'T+0' ? '即时触达' : template.timingType === 'T+3' ? '3日跟进' : '7日复盘' },
                    { l: '适用渠道', v: template.channels.length + '个' },
                    { l: '关联规则', v: template.linkedMotRules.join(', ') },
                    { l: '合规检测点', v: template.complianceCheckPoints + '个' },
                    { l: '使用次数', v: template.usageCount.toLocaleString() },
                    { l: '创建时间', v: template.createdAt },
                  ].map(item => (
                    <div key={item.l} className="flex justify-between">
                      <span className="text-muted-foreground">{item.l}</span>
                      <span className="text-foreground">{item.v}</span>
                    </div>
                  ))}
                </div>
                <div className={`flex items-center gap-2 rounded p-2 ${
                  template.complianceStatus === 'approved' ? 'bg-success/8 border border-success/20' :
                  template.complianceStatus === 'pending_review' ? 'bg-warning/8 border border-warning/20' :
                  'bg-destructive/8 border border-destructive/20'
                }`}>
                  <Shield className={`h-3.5 w-3.5 ${
                    template.complianceStatus === 'approved' ? 'text-success' :
                    template.complianceStatus === 'pending_review' ? 'text-[hsl(var(--warning))]' : 'text-destructive'
                  }`} />
                  <span className="text-[10px] font-medium">
                    {template.complianceStatus === 'approved' ? 'AI合规审核通过' : template.complianceStatus === 'pending_review' ? '待人工审核' : '审核未通过'}
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
            <div className="rounded-lg border border-border bg-card p-3 mt-3">
              <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-primary" />陪伴服务模型
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
      )}

      {/* ====== 投资财富工具 Tab ====== */}
      {subTab === 'tools' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="搜索工具名称..." value={toolSearch} onChange={e => setToolSearch(e.target.value)}
                className="h-7 w-full rounded border border-border bg-card pl-7 pr-3 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none" />
            </div>
            <div className="flex flex-wrap gap-1">
              {toolCats.map(cat => (
                <button key={cat} onClick={() => setToolCatFilter(cat)}
                  className={`text-[11px] px-2 py-1 rounded-full transition-colors ${
                    toolCatFilter === cat ? 'bg-primary/10 text-primary font-medium' : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                  }`}>
                  {cat === 'all' ? '全部' : cat}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-2.5 max-h-[560px] overflow-y-auto">
            {filteredTools.map(tool => {
              const Icon = toolCatIcons[tool.category] || Wrench
              return (
                <div key={tool.id} className="rounded-lg border border-border bg-card p-3 hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-foreground truncate">{tool.name}</h4>
                      <span className="text-[9px] text-muted-foreground">{tool.category}</span>
                    </div>
                    <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                  </div>
                  <p className="text-[10px] text-muted-foreground line-clamp-2 mb-2">{tool.desc}</p>
                  <div className="flex items-center justify-between text-[9px] text-muted-foreground/60">
                    <span>累计使用 {tool.usage.toLocaleString()} 次</span>
                    <span className="text-success font-medium">已上线</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ====== 营销内容 Tab ====== */}
      {subTab === 'contents' && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
              <input type="text" placeholder="搜索内容名称..." value={contentSearch} onChange={e => setContentSearch(e.target.value)}
                className="h-7 w-full rounded border border-border bg-card pl-7 pr-3 text-xs text-foreground placeholder:text-muted-foreground/50 focus:border-primary/50 focus:outline-none" />
            </div>
            <div className="flex flex-wrap gap-1">
              {contentCats.map(cat => (
                <button key={cat} onClick={() => setContentCatFilter(cat)}
                  className={`text-[11px] px-2 py-1 rounded-full transition-colors ${
                    contentCatFilter === cat ? 'bg-accent/10 text-accent font-medium' : 'bg-secondary/50 text-muted-foreground hover:text-foreground'
                  }`}>
                  {cat === 'all' ? '全部' : cat}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-2.5 max-h-[560px] overflow-y-auto">
            {filteredContents.map(item => {
              const Icon = contentCatIcons[item.category] || Layers
              const badgeColor = fmtColors[item.format] || 'bg-secondary text-muted-foreground border-border'
              return (
                <div key={item.id} className="rounded-lg border border-border bg-card p-3 hover:border-accent/30 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10">
                      <Icon className="h-3.5 w-3.5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-foreground truncate">{item.name}</h4>
                      <span className="text-[9px] text-muted-foreground">{item.category}</span>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full border font-medium shrink-0 ${badgeColor}`}>{item.format}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground line-clamp-2 mb-2">{item.desc}</p>
                  <div className="flex items-center justify-between text-[9px] text-muted-foreground/60">
                    <span>累计使用 {item.usage.toLocaleString()} 次</span>
                    <span className="text-success font-medium">已上线</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ====== AI千人千面 Tab ====== */}
      {subTab === 'ai' && (
        <div className="space-y-4">
          <div className="rounded-lg border-2 border-dashed border-primary/15 bg-gradient-to-b from-primary/[0.02] to-transparent p-4">
            <div className="flex items-center gap-2 mb-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
                <Brain className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-bold text-primary">AI 千人千面引擎</span>
              </div>
              <div className="flex items-center gap-1.5 ml-auto">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">实时运行</span>
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mb-4">
              基于客户360画像 × MOT触发规则 × 内容库 × 工具库，AI自动为每位客户组装最优触达方案。以下为近期AI生成的个性化推荐示例：
            </p>

            <div className="space-y-3">
              {aiPersonalizedExamples.map((example, idx) => (
                <div key={idx} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/12 text-xs font-bold text-primary">{example.customer[0]}</div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-foreground">{example.customer}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-secondary text-muted-foreground">{example.type}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">触发规则：{example.trigger}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-primary" />
                      <span className="text-[10px] text-primary font-medium">AI生成</span>
                    </div>
                  </div>

                  {/* 推荐项目 */}
                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-2 mb-3">
                    {example.items.map((item, i) => {
                      if (item.kind === 'tool') {
                        const TIcon = toolCatIcons[item.cat!] || Wrench
                        return (
                          <div key={i} className="rounded bg-primary/[0.03] border border-primary/10 p-2">
                            <div className="flex items-center gap-1.5 mb-1">
                              <TIcon className="h-3 w-3 text-primary" />
                              <span className="text-[9px] text-primary font-medium">工具</span>
                            </div>
                            <p className="text-[10px] font-medium text-foreground leading-tight">{item.name}</p>
                            <p className="text-[9px] text-muted-foreground mt-0.5">{item.cat}</p>
                          </div>
                        )
                      }
                      if (item.kind === 'content') {
                        const CIcon = contentCatIcons[item.cat!] || Layers
                        const bColor = fmtColors[item.format || ''] || 'bg-secondary text-muted-foreground border-border'
                        return (
                          <div key={i} className="rounded bg-accent/[0.03] border border-accent/10 p-2">
                            <div className="flex items-center gap-1.5 mb-1">
                              <CIcon className="h-3 w-3 text-accent" />
                              <span className="text-[9px] text-accent font-medium">内容</span>
                              {item.format && <span className={`text-[8px] px-1 py-0 rounded-full border ${bColor}`}>{item.format}</span>}
                            </div>
                            <p className="text-[10px] font-medium text-foreground leading-tight">{item.name}</p>
                            <p className="text-[9px] text-muted-foreground mt-0.5">{item.cat}</p>
                          </div>
                        )
                      }
                      // message
                      return (
                        <div key={i} className="rounded bg-success/[0.03] border border-success/10 p-2">
                          <div className="flex items-center gap-1.5 mb-1">
                            <MessageSquare className="h-3 w-3 text-success" />
                            <span className="text-[9px] text-success font-medium">话术</span>
                          </div>
                          <p className="text-[10px] font-medium text-foreground leading-tight">{item.name}</p>
                        </div>
                      )
                    })}
                  </div>

                  {/* AI 推荐理由 */}
                  <div className="rounded bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 px-2.5 py-2">
                    <p className="text-[10px] text-primary font-bold flex items-center gap-1 mb-0.5">
                      <Sparkles className="h-3 w-3" /> AI推荐理由
                    </p>
                    <p className="text-[10px] text-foreground/70 leading-relaxed">{example.reasoning}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
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
