// 易方达 MOT 系统 - 系统设置
// V2: 三大功能 Tab：基础设置 | 合规风控 | 数据统计

import { useState, useEffect, lazy, Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Settings, Bell, Shield, Palette, Database, Mail, Clock, ChevronRight,
  Save, RefreshCw, AlertTriangle, CheckCircle2, XCircle, FileText,
  BarChart3, TrendingUp, Users, Zap, Activity, Filter, Eye,
  ToggleLeft, ToggleRight, Presentation,
  Workflow, Brain, Wrench, BookOpen, ArrowRight, Sparkles,
} from 'lucide-react'
import { useToast, ToastContainer } from '@/components/ui/toast'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, PieChart, Pie, Cell } from 'recharts'
import { complianceAlerts, regulatoryEvents, riskRules, complianceScore } from '@/data/complianceData'

const EmbeddedSlideViewer = lazy(() => import('@/presentation-v2/components/EmbeddedSlideViewer'))

type TabType = 'basic' | 'compliance' | 'statistics' | 'logic' | 'demo'

const tabs: { key: TabType; label: string; icon: React.ElementType }[] = [
  { key: 'basic', label: '基础设置', icon: Settings },
  { key: 'compliance', label: '合规风控', icon: Shield },
  { key: 'statistics', label: '数据统计', icon: BarChart3 },
  { key: 'logic', label: '业务逻辑', icon: Workflow },
  { key: 'demo', label: '演示说明', icon: Presentation },
]

const settingGroups = [
  {
    title: '通知设置',
    icon: Bell,
    description: '配置系统通知和提醒方式',
    settings: [
      { label: 'MOT触发通知', description: '当有新的MOT任务触发时推送通知', value: true },
      { label: '邮件通知', description: '通过邮件接收重要通知', value: true },
      { label: '舆情预警', description: '负面舆情或热度突增时自动预警', value: true },
      { label: '政策变动提醒', description: '新政策发布或即将生效时提醒', value: false },
    ],
  },
  {
    title: '显示设置',
    icon: Palette,
    description: '自定义界面外观和布局',
    settings: [
      { label: '深色模式', description: '切换深色/浅色界面主题', value: false },
      { label: '紧凑布局', description: '减少页面间距以显示更多内容', value: false },
      { label: '数据动效', description: '图表和数字变化时显示动画效果', value: true },
      { label: '实时行情刷新', description: '行情分析页面自动刷新指数数据', value: true },
    ],
  },
  {
    title: '数据设置',
    icon: Database,
    description: '数据源和同步配置',
    settings: [
      { label: '自动同步', description: '每15分钟自动同步客户数据', value: true },
      { label: '历史数据保留', description: '保留MOT任务执行历史记录', value: true },
      { label: 'AI模型更新', description: '允许AI服务大脑自动更新建议模型', value: true },
      { label: '数据脱敏', description: '在展示界面中对敏感信息进行脱敏', value: true },
    ],
  },
  {
    title: '安全设置',
    icon: Shield,
    description: '账户安全和权限管理',
    settings: [
      { label: '双因素认证', description: '登录时要求二次验证', value: false },
      { label: '操作日志', description: '记录所有关键操作的审计日志', value: true },
      { label: '会话超时', description: '30分钟无操作自动退出登录', value: true },
      { label: '敏感操作确认', description: '执行批量操作前需要二次确认', value: true },
    ],
  },
]

const systemInfo = [
  { label: '系统版本', value: 'VMOT v2.0.1' },
  { label: '最后更新', value: '2026-03-31' },
  { label: '数据库状态', value: '正常运行', status: 'success' },
  { label: 'AI模型版本', value: 'GPT-4o-20260301' },
  { label: '数据同步时间', value: '2026-03-31 15:30:00' },
  { label: '客户数据量', value: '128,456 条' },
]

// 数据统计 mock
const weeklyMOTData = [
  { day: '周一', triggered: 2840, delivered: 2310, converted: 680 },
  { day: '周二', triggered: 3120, delivered: 2580, converted: 820 },
  { day: '周三', triggered: 2960, delivered: 2420, converted: 750 },
  { day: '周四', triggered: 3380, delivered: 2810, converted: 910 },
  { day: '周五', triggered: 3680, delivered: 3050, converted: 1020 },
  { day: '周六', triggered: 1240, delivered: 980, converted: 320 },
  { day: '周日', triggered: 1100, delivered: 860, converted: 280 },
]

const channelDistribution = [
  { name: 'APP推送', value: 38, color: 'hsl(207 85% 42%)' },
  { name: '企微消息', value: 25, color: 'hsl(191 78% 50%)' },
  { name: '短信', value: 20, color: 'hsl(152 62% 42%)' },
  { name: '邮件', value: 10, color: 'hsl(38 88% 52%)' },
  { name: '其他', value: 7, color: 'hsl(260 60% 50%)' },
]

const monthlyTrend = [
  { month: '10月', score: 91.5, alerts: 28, resolved: 25 },
  { month: '11月', score: 92.0, alerts: 32, resolved: 30 },
  { month: '12月', score: 92.8, alerts: 25, resolved: 24 },
  { month: '1月', score: 93.1, alerts: 22, resolved: 21 },
  { month: '2月', score: 93.8, alerts: 18, resolved: 17 },
  { month: '3月', score: 94.2, alerts: 15, resolved: 14 },
]

export default function SystemSettings() {
  const [searchParams] = useSearchParams()
  const tabFromUrl = searchParams.get('tab') as TabType | null
  const validTabs: TabType[] = ['basic', 'compliance', 'statistics', 'logic', 'demo']
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    if (tabFromUrl && validTabs.includes(tabFromUrl)) return tabFromUrl
    return 'basic'
  })
  const { toasts, showToast, dismiss } = useToast()

  useEffect(() => {
    if (tabFromUrl && validTabs.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl)
    }
  }, [tabFromUrl])

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">系统设置</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {activeTab === 'basic' ? '通知、显示、数据、安全等基础配置' :
             activeTab === 'compliance' ? '合规告警与风控规则管理' :
             activeTab === 'logic' ? 'VMOT业务逻辑流程与AI服务大脑能力总览' :
             activeTab === 'demo' ? '系统功能演示与使用说明' :
             'MOT执行数据与系统运行统计'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => showToast('设置已保存成功')} className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/50 transition-colors">
            <Save className="h-3.5 w-3.5" />
            保存更改
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'basic' && <BasicSettingsTab showToast={showToast} />}
      {activeTab === 'compliance' && <ComplianceTab showToast={showToast} />}
      {activeTab === 'statistics' && <StatisticsTab />}
      {activeTab === 'logic' && <BusinessLogicTab />}
      {activeTab === 'demo' && (
        <Suspense fallback={<div className="flex items-center justify-center h-96 text-muted-foreground text-sm">加载演示组件...</div>}>
          <EmbeddedSlideViewer />
        </Suspense>
      )}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  )
}

// ===== Tab 1: 基础设置 =====
function BasicSettingsTab({ showToast }: { showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void }) {
  const [settings, setSettings] = useState(settingGroups)
  const [activeGroup, setActiveGroup] = useState(0)
  const [syncing, setSyncing] = useState(false)

  const toggleSetting = (groupIndex: number, settingIndex: number) => {
    setSettings(prev => {
      const next = [...prev]
      const group = { ...next[groupIndex] }
      const items = [...group.settings]
      items[settingIndex] = { ...items[settingIndex], value: !items[settingIndex].value }
      group.settings = items
      next[groupIndex] = group
      return next
    })
  }

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-4">
      {/* 左侧导航 */}
      <div className="space-y-1.5">
        {settings.map((group, index) => {
          const Icon = group.icon
          return (
            <button
              key={group.title}
              onClick={() => setActiveGroup(index)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs transition-all ${
                activeGroup === index
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="flex-1 text-left">{group.title}</span>
              <ChevronRight className={`h-3 w-3 transition-transform ${activeGroup === index ? 'rotate-90' : ''}`} />
            </button>
          )
        })}

        {/* 系统信息 */}
        <div className="mt-4 rounded-lg border border-border bg-card p-3">
          <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
            <Settings className="h-3.5 w-3.5 text-muted-foreground" />
            系统信息
          </h4>
          <div className="space-y-2">
            {systemInfo.map(info => (
              <div key={info.label} className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">{info.label}</span>
                <span className={`text-[10px] font-medium ${
                  'status' in info && info.status === 'success' ? 'text-success' : 'text-foreground'
                }`}>{info.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 右侧设置内容 */}
      <div className="col-span-3 space-y-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-3 mb-4">
            {(() => {
              const Icon = settings[activeGroup].icon
              return (
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              )
            })()}
            <div>
              <h3 className="text-sm font-semibold text-foreground">{settings[activeGroup].title}</h3>
              <p className="text-[10px] text-muted-foreground">{settings[activeGroup].description}</p>
            </div>
          </div>
          <div className="divide-y divide-border">
            {settings[activeGroup].settings.map((setting, settingIndex) => (
              <div key={setting.label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-xs font-medium text-foreground">{setting.label}</p>
                  <p className="text-[10px] text-muted-foreground">{setting.description}</p>
                </div>
                <button
                  onClick={() => toggleSetting(activeGroup, settingIndex)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    setting.value ? 'bg-primary' : 'bg-secondary'
                  }`}
                >
                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-sm ${
                    setting.value ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 快捷操作 */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: RefreshCw, label: '手动同步数据', sub: '立即同步所有客户数据', color: 'primary', act: 'sync' },
            { icon: Mail, label: '发送测试通知', sub: '验证通知配置是否正常', color: 'accent', act: 'test' },
            { icon: Clock, label: '查看操作日志', sub: '审计历史操作记录', color: 'destructive', act: 'log' },
          ].map(action => {
            const Icon = action.icon
            const isSyncing = action.act === 'sync' && syncing
            return (
              <button
                key={action.label}
                disabled={isSyncing}
                onClick={() => {
                  if (action.act === 'sync') {
                    setSyncing(true)
                    showToast('正在同步客户数据...', 'info')
                    setTimeout(() => { setSyncing(false); showToast('客户数据同步完成，共更新 128,456 条记录') }, 1500)
                  } else if (action.act === 'test') {
                    showToast('测试通知已发送至您的邮箱和APP')
                  } else {
                    showToast('操作日志已在新窗口打开', 'info')
                  }
                }}
                className={`rounded-lg border border-border bg-card p-3 text-left hover:border-primary/20 transition-all group ${isSyncing ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-md ${
                    action.color === 'primary' ? 'bg-primary/10' :
                    action.color === 'accent' ? 'bg-accent/10' :
                    'bg-destructive/10'
                  }`}>
                    <Icon className={`h-3.5 w-3.5 ${
                      action.color === 'primary' ? 'text-primary' :
                      action.color === 'accent' ? 'text-accent' :
                      'text-destructive'
                    } ${isSyncing ? 'animate-spin' : ''}`} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">{isSyncing ? '同步中...' : action.label}</p>
                    <p className="text-[9px] text-muted-foreground">{action.sub}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ===== Tab 2: 合规风控 =====
function ComplianceTab({ showToast }: { showToast: (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void }) {
  const riskLevelConfig: Record<string, { label: string; class: string }> = {
    high: { label: '高风险', class: 'bg-destructive/10 text-destructive' },
    medium: { label: '中风险', class: 'bg-warning/10 text-[hsl(var(--warning))]' },
    low: { label: '低风险', class: 'bg-success/10 text-success' },
  }

  const statusConfig: Record<string, { label: string; class: string; icon: React.ElementType }> = {
    pending: { label: '待处理', class: 'text-[hsl(var(--warning))]', icon: Clock },
    processing: { label: '处理中', class: 'text-primary', icon: Activity },
    resolved: { label: '已解决', class: 'text-success', icon: CheckCircle2 },
  }

  const pendingCount = complianceAlerts.filter(a => a.status === 'pending').length
  const processingCount = complianceAlerts.filter(a => a.status === 'processing').length
  const highRiskCount = complianceAlerts.filter(a => a.riskLevel === 'high').length

  return (
    <div className="space-y-4">
      {/* KPI */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: '合规评分', value: `${complianceScore.current}`, sub: '较上月 +0.4', color: 'primary', icon: Shield },
          { label: '待处理告警', value: pendingCount.toString(), sub: `${highRiskCount}个高风险`, color: 'destructive', icon: AlertTriangle },
          { label: '处理中', value: processingCount.toString(), sub: '正在跟进处理', color: 'accent', icon: Activity },
          { label: '风控规则', value: riskRules.filter(r => r.enabled).length.toString(), sub: `共${riskRules.length}条规则`, color: 'success', icon: Filter },
        ].map(kpi => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className={`h-3.5 w-3.5 ${
                  kpi.color === 'primary' ? 'text-primary' :
                  kpi.color === 'destructive' ? 'text-destructive' :
                  kpi.color === 'accent' ? 'text-accent' :
                  'text-success'
                }`} />
                <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
              </div>
              <p className={`text-xl font-bold ${
                kpi.color === 'primary' ? 'text-primary' :
                kpi.color === 'destructive' ? 'text-destructive' :
                kpi.color === 'accent' ? 'text-accent' :
                'text-success'
              }`}>{kpi.value}</p>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">{kpi.sub}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* 告警列表 */}
        <div className="col-span-2 space-y-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              合规告警事件
            </h3>
            <div className="space-y-2">
              {complianceAlerts.map(alert => {
                const risk = riskLevelConfig[alert.riskLevel]
                const status = statusConfig[alert.status]
                const StatusIcon = status.icon
                return (
                  <div key={alert.id} className="rounded-lg border border-border p-3 hover:border-primary/20 transition-all cursor-pointer" onClick={() => {
                    if (alert.status === 'pending') {
                      showToast(`已开始处理告警: ${alert.event}`, 'info')
                    } else if (alert.status === 'processing') {
                      showToast(`告警处理中: ${alert.event}`, 'warning')
                    } else {
                      showToast(`告警已解决: ${alert.event}`)
                    }
                  }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${risk.class}`}>{risk.label}</span>
                        <span className="text-xs font-medium text-foreground">{alert.event}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <StatusIcon className={`h-3 w-3 ${status.class}`} />
                        <span className={`text-[10px] font-medium ${status.class}`}>{status.label}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground mb-1">{alert.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-muted-foreground/60">影响范围: {alert.scope}</span>
                      <span className="text-[9px] text-muted-foreground/60">{alert.timestamp}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 右侧 */}
        <div className="space-y-3">
          {/* 合规评分趋势 */}
          <div className="rounded-lg border border-border bg-card p-3">
            <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              合规评分趋势
            </h4>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-bold text-primary">{complianceScore.current}</span>
              <span className="text-[10px] text-success">+0.4</span>
            </div>
            <ResponsiveContainer width="100%" height={100}>
              <LineChart data={monthlyTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis domain={[90, 96]} tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
                <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 监管日历 */}
          <div className="rounded-lg border border-border bg-card p-3">
            <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-accent" />
              监管事项日历
            </h4>
            <div className="space-y-2">
              {regulatoryEvents.map(event => (
                <div key={event.id} className="p-2 rounded bg-secondary/30 border border-border/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-medium text-foreground truncate flex-1 mr-2">{event.title}</span>
                    <span className={`text-[9px] px-1 py-0.5 rounded font-medium shrink-0 ${
                      event.urgency === 'critical' ? 'bg-destructive/10 text-destructive' :
                      event.urgency === 'warning' ? 'bg-warning/10 text-[hsl(var(--warning))]' :
                      'bg-primary/10 text-primary'
                    }`}>
                      {event.date}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          event.urgency === 'critical' ? 'bg-destructive' :
                          event.urgency === 'warning' ? 'bg-[hsl(var(--warning))]' :
                          'bg-primary'
                        }`}
                        style={{ width: `${event.progress}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-muted-foreground w-8 text-right">{event.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 风控规则概览 */}
          <div className="rounded-lg border border-border bg-card p-3">
            <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-success" />
              风控规则概览
            </h4>
            <div className="space-y-1.5">
              {riskRules.slice(0, 5).map(rule => (
                <div key={rule.id} className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${rule.enabled ? 'bg-success' : 'bg-muted-foreground/30'}`} />
                    <span className="text-foreground truncate">{rule.name}</span>
                  </div>
                  <span className="text-muted-foreground shrink-0 ml-2">拦截 {rule.interceptCount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== Tab 3: 数据统计 =====
function StatisticsTab() {
  return (
    <div className="space-y-4">
      {/* KPI 总览 */}
      <div className="grid grid-cols-3 xl:grid-cols-5 gap-3">
        {[
          { label: '本周MOT触发', value: '18,320', trend: '+12.3%', icon: Zap, color: 'primary' },
          { label: '成功送达', value: '15,010', trend: '+8.7%', icon: CheckCircle2, color: 'success' },
          { label: '客户转化', value: '4,780', trend: '+15.2%', icon: Users, color: 'accent' },
          { label: '活跃策略', value: '47', trend: '+3', icon: Filter, color: 'primary' },
          { label: '系统可用率', value: '99.97%', trend: '0.00%', icon: Activity, color: 'success' },
        ].map(kpi => {
          const Icon = kpi.icon
          return (
            <div key={kpi.label} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className={`h-3.5 w-3.5 ${
                  kpi.color === 'primary' ? 'text-primary' :
                  kpi.color === 'success' ? 'text-success' :
                  'text-accent'
                }`} />
                <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
              </div>
              <p className={`text-lg font-bold ${
                kpi.color === 'primary' ? 'text-primary' :
                kpi.color === 'success' ? 'text-success' :
                'text-accent'
              }`}>{kpi.value}</p>
              <p className="text-[9px] text-success mt-0.5">{kpi.trend}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* 本周MOT执行趋势 */}
        <div className="col-span-2 rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4 text-primary" />
            本周MOT执行趋势
          </h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyMOTData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ fontSize: 10, background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 6 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="triggered" name="触发数" fill="hsl(207 85% 42%)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="delivered" name="送达数" fill="hsl(191 78% 50%)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="converted" name="转化数" fill="hsl(152 62% 42%)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 渠道分布 */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-1.5">
            <Eye className="h-4 w-4 text-accent" />
            渠道触达分布
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={channelDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
              >
                {channelDistribution.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 10, background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 6 }} formatter={(value: number) => [`${value}%`, '占比']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {channelDistribution.map(ch => (
              <div key={ch.name} className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full shrink-0" style={{ background: ch.color }} />
                  <span className="text-foreground">{ch.name}</span>
                </div>
                <span className="font-medium text-foreground">{ch.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部统计 */}
      <div className="grid grid-cols-2 gap-4">
        {/* 合规处理趋势 */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-primary" />
            月度合规处理趋势
          </h3>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={monthlyTrend} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ fontSize: 10, background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 6 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="alerts" name="告警数" stroke="hsl(0 72% 51%)" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="resolved" name="已处理" stroke="hsl(152 62% 42%)" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 系统运行指标 */}
        <div className="rounded-lg border border-border bg-card p-4">
          <h3 className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-success" />
            系统运行指标
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'API平均响应', value: '42ms', status: 'success' },
              { label: '数据库连接数', value: '23/100', status: 'success' },
              { label: 'AI推理耗时', value: '1.2s', status: 'success' },
              { label: '消息队列积压', value: '0', status: 'success' },
              { label: '缓存命中率', value: '96.8%', status: 'success' },
              { label: '错误率(24h)', value: '0.03%', status: 'success' },
              { label: '活跃会话数', value: '156', status: 'normal' },
              { label: '存储使用率', value: '34.2%', status: 'normal' },
            ].map(metric => (
              <div key={metric.label} className="flex items-center justify-between p-2 rounded bg-secondary/30">
                <span className="text-[10px] text-muted-foreground">{metric.label}</span>
                <span className={`text-[10px] font-bold ${
                  metric.status === 'success' ? 'text-success' : 'text-foreground'
                }`}>{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ===== Tab 5: 业务逻辑 =====
const flowSteps = [
  { icon: Sparkles, label: 'AI策略挖掘', step: '01', color: 'primary' as const, desc: 'AI大脑整合域内外海量数据，自动识别客户关键服务时机（MOT），生成智能策略推荐' },
  { icon: CheckCircle2, label: '业务确认策略', step: '02', color: 'accent' as const, desc: '业务团队审核AI推荐策略，确认执行方案，调整目标客群与触达参数' },
  { icon: FileText, label: '策略生成', step: '03', color: 'primary' as const, desc: '系统自动生成完整执行策略，配置触达渠道、内容模板与执行规则' },
  { icon: Zap, label: '策略执行', step: '04', color: 'accent' as const, desc: '按预设规则自动执行策略，支持定时、事件驱动、实时三种触发模式' },
  { icon: Users, label: '客户触达', step: '05', color: 'success' as const, desc: '通过APP推送、企业微信、短信、邮件等渠道精准触达目标客户' },
]

const aiCategories = [
  {
    icon: Database, category: '数据', color: 'primary' as const,
    desc: '多维客户画像与市场数据', count: '5大维度',
    items: [
      { name: '客户基础数据', detail: '姓名、年龄、职业、风险等级、投资偏好等基础画像' },
      { name: '客户行为数据', detail: '登录频率、浏览偏好、咨询记录、操作习惯等行为轨迹' },
      { name: '客户交易数据', detail: '持仓明细、申赎记录、收益情况、资产配置变动' },
      { name: '市场行情数据', detail: '大盘指数、板块轮动、基金净值、估值水平等实时数据' },
      { name: '舆情与政策数据', detail: '市场舆论热点、负面事件监测、监管政策变动与解读' },
    ],
  },
  {
    icon: Wrench, category: '工具', color: 'accent' as const,
    desc: '智能化服务与分析工具', count: '4大类别',
    items: [
      { name: '投资财富工具', detail: '定投计算器、资产配置方案、基金筛选器、风险测评等13类工具' },
      { name: '营销内容工具', detail: '智能文案生成、营销海报制作、活动策划、客户邀请等创作工具' },
      { name: '客户分析工具', detail: '客群细分模型、流失预警、客户价值评估、生命周期管理' },
      { name: '合规审核工具', detail: '话术合规检查、敏感词过滤、信息披露规范、适当性匹配' },
    ],
  },
  {
    icon: BookOpen, category: '内容', color: 'success' as const,
    desc: '专业内容资源库', count: '4大资源',
    items: [
      { name: '营销材料', detail: '产品介绍、活动宣传、节日关怀、新客欢迎等各类营销素材' },
      { name: '投教知识', detail: '基金入门、投资策略、市场解读、风险教育等投资者教育内容' },
      { name: '客服知识', detail: '常见问题解答、业务流程指引、费率说明、操作引导话术' },
      { name: '市场研报', detail: '行业研究报告、市场展望、策略建议、热点事件深度分析' },
    ],
  },
]

const colorMap = {
  primary: { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/20', bgCard: 'bg-primary/[0.03]', dim: 'text-primary/40' },
  accent: { bg: 'bg-accent/10', text: 'text-accent', border: 'border-accent/20', bgCard: 'bg-accent/[0.03]', dim: 'text-accent/40' },
  success: { bg: 'bg-success/10', text: 'text-success', border: 'border-success/20', bgCard: 'bg-success/[0.03]', dim: 'text-success/40' },
}

function BusinessLogicTab() {
  const [activeStep, setActiveStep] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setActiveStep(prev => (prev + 1) % 7), 2500)
    return () => clearInterval(timer)
  }, [])

  const animStages = [
    { label: '数据采集', icon: Database, color: 'primary' as const, desc: '采集客户画像、行为数据、市场行情、舆情政策等多维数据' },
    { label: 'AI分析', icon: Brain, color: 'primary' as const, desc: 'AI大脑实时分析数据，识别客户关键服务时机（MOT）与潜在需求' },
    { label: '策略挖掘', icon: Sparkles, color: 'primary' as const, desc: '基于分析结果自动生成智能策略推荐，匹配最优服务方案' },
    { label: '业务确认', icon: CheckCircle2, color: 'accent' as const, desc: '业务团队审核AI推荐策略，确认执行方案与目标客群参数' },
    { label: '策略生成', icon: FileText, color: 'primary' as const, desc: '系统自动生成完整执行策略，配置触达渠道与内容模板' },
    { label: '策略执行', icon: Zap, color: 'accent' as const, desc: '按预设规则自动执行策略，支持定时、事件驱动等触发模式' },
    { label: '客户触达', icon: Users, color: 'success' as const, desc: '通过APP推送、企微、短信等渠道精准触达目标客户' },
  ]

  return (
    <div className="space-y-4">
      {/* Section 1: 主流程 */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-1">
          <Workflow className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">VMOT 业务主流程</h3>
        </div>
        <p className="text-[10px] text-muted-foreground mb-4">从AI智能挖掘到精准客户触达的全链路MOT服务流程</p>

        <div className="flex items-stretch">
          {flowSteps.map((step, i) => {
            const Icon = step.icon
            const c = colorMap[step.color]
            return (
              <div key={step.label} className="flex items-stretch flex-1 min-w-0">
                <div className={`flex-1 rounded-lg border p-3 ${c.border} ${c.bgCard}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.bg}`}>
                      <Icon className={`h-4 w-4 ${c.text}`} />
                    </div>
                    <span className={`text-[10px] font-bold ${c.dim}`}>{step.step}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-foreground mb-1">{step.label}</h4>
                  <p className="text-[9px] text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
                {i < flowSteps.length - 1 && (
                  <div className="flex items-center px-1.5 shrink-0">
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Section 2: AI 服务大脑 */}
      <div className="rounded-lg border-2 border-dashed border-primary/15 bg-gradient-to-b from-primary/[0.02] to-transparent p-4">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 mb-1.5">
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-xs font-bold text-primary">AI 服务大脑</span>
          </div>
          <p className="text-[10px] text-muted-foreground">智能分析引擎，融合数据 × 工具 × 内容三大能力，自动识别客户需求与最佳服务时机</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {aiCategories.map(cat => {
            const Icon = cat.icon
            const c = colorMap[cat.color]
            return (
              <div key={cat.category} className="rounded-lg border border-border bg-card p-3">
                <div className="flex items-center gap-2 mb-2.5">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${c.bg}`}>
                    <Icon className={`h-3.5 w-3.5 ${c.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-foreground">{cat.category}</h4>
                    <p className="text-[9px] text-muted-foreground">{cat.desc}</p>
                  </div>
                  <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full shrink-0 ${c.bg} ${c.text}`}>{cat.count}</span>
                </div>
                <div className="space-y-1.5">
                  {cat.items.map(item => (
                    <div key={item.name} className="rounded bg-secondary/30 p-2">
                      <p className="text-[10px] font-medium text-foreground">{item.name}</p>
                      <p className="text-[9px] text-muted-foreground mt-0.5 leading-relaxed">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Section 3: 底部统计 */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { value: '10', unit: '位', label: '客户画像', desc: '多维度客户模拟数据，覆盖不同年龄段、风险偏好、资产规模', icon: Users, color: 'primary' as const },
          { value: '13', unit: '大', label: '数据维度', desc: '从基本信息到投资能力，全方位刻画客户特征与行为模式', icon: Database, color: 'accent' as const },
          { value: '13', unit: '类', label: '投资工具', desc: '互动福利、模拟大赛、定投专区、基金选品等智能化服务工具', icon: Wrench, color: 'success' as const },
        ].map(stat => {
          const Icon = stat.icon
          const c = colorMap[stat.color]
          return (
            <div key={stat.label} className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center gap-2.5">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${c.bg}`}>
                  <Icon className={`h-4 w-4 ${c.text}`} />
                </div>
                <div>
                  <div className="flex items-baseline gap-0.5">
                    <span className={`text-xl font-bold ${c.text}`}>{stat.value}</span>
                    <span className="text-[10px] text-muted-foreground">{stat.unit}</span>
                    <span className="text-xs font-semibold text-foreground ml-0.5">{stat.label}</span>
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-0.5 leading-relaxed">{stat.desc}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Section 4: 业务流程动画 */}
      <div className="rounded-lg border border-border bg-gradient-to-br from-card to-primary/[0.02] p-5 overflow-hidden">
        <style>{`
          @keyframes flowGlow {
            0%, 100% { box-shadow: 0 0 0 0 hsl(var(--primary) / 0.3); }
            50% { box-shadow: 0 0 20px 4px hsl(var(--primary) / 0.15); }
          }
          @keyframes flowDot {
            0% { left: 0; opacity: 0; }
            15% { opacity: 1; }
            85% { opacity: 1; }
            100% { left: calc(100% - 6px); opacity: 0; }
          }
          @keyframes descFade {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        <div className="flex items-center gap-2 mb-1">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">业务流程动画</h3>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">运行中</span>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground mb-5">实时展示VMOT系统从数据采集到客户触达的全链路执行流程</p>

        {/* Progress bar */}
        <div className="h-1 rounded-full bg-secondary/50 mb-6 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-success transition-all duration-700 ease-out"
            style={{ width: `${((activeStep + 1) / 7) * 100}%` }}
          />
        </div>

        {/* Pipeline nodes */}
        <div className="flex items-start px-1">
          {animStages.map((stage, i) => {
            const Icon = stage.icon
            const c = colorMap[stage.color]
            const isActive = i === activeStep
            const isPast = i < activeStep

            return (
              <div key={stage.label} className="flex items-start flex-1 min-w-0">
                <div className="flex flex-col items-center shrink-0" style={{ width: 64 }}>
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border-2 transition-all duration-500 ${
                      isActive
                        ? `${c.bg} border-current ${c.text} scale-110`
                        : isPast
                          ? `${c.bg} border-transparent`
                          : 'bg-secondary/30 border-transparent'
                    }`}
                    style={isActive ? { animation: 'flowGlow 2s ease-in-out infinite' } : undefined}
                  >
                    <Icon className={`h-5 w-5 transition-colors duration-500 ${
                      isActive || isPast ? c.text : 'text-muted-foreground/30'
                    }`} />
                  </div>
                  <span className={`mt-2 text-[10px] text-center leading-tight transition-all duration-300 ${
                    isActive ? `font-bold ${c.text}` : isPast ? 'font-medium text-muted-foreground' : 'text-muted-foreground/40'
                  }`}>{stage.label}</span>
                </div>

                {i < animStages.length - 1 && (
                  <div className="flex-1 relative mt-[22px]" style={{ minWidth: 12 }}>
                    <div className={`h-[2px] w-full rounded-full transition-colors duration-500 ${
                      isPast ? 'bg-primary/30' : 'bg-border'
                    }`} />
                    {isActive && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 h-[6px] w-[6px] rounded-full bg-primary"
                        style={{
                          boxShadow: '0 0 8px 2px hsl(var(--primary) / 0.4)',
                          animation: 'flowDot 2s ease-in-out infinite',
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Current step description */}
        <div className="mt-6 flex justify-center" key={activeStep}>
          <div
            className="inline-flex items-center gap-2.5 rounded-full bg-primary/5 border border-primary/10 px-5 py-2 max-w-2xl"
            style={{ animation: 'descFade 0.4s ease-out' }}
          >
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shrink-0" />
            <span className="text-[11px] text-foreground/80">{animStages[activeStep].desc}</span>
          </div>
        </div>
      </div>
    </div>
  )
}