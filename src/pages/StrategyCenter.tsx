import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { serviceStrategies } from '@/data/mockData'
import { useToast, ToastContainer } from '@/components/ui/toast'
import StrategyCanvas, { getDefaultTemplate, type StrategyDraft, type StrategyType } from '@/components/strategy/StrategyCanvas'
import MOTRecommendationPanel, { allRecommendations, type MOTRecommendation } from '@/components/strategy/MOTRecommendation'
import {
  Zap,
  Search,
  Plus,
  Settings2,
  ChevronDown,
  Layers,
  Users,
  TrendingUp,
  CheckCircle2,
  FileEdit,
  Clock,
  Target,
  X,
  MessageSquare,
  Activity,
  Heart,
  Bot,
  User,
  Play,
  Smartphone,
  Phone,
  Mail,
  Hash,
  ArrowRight,
  Shield,
  AlertTriangle,
  BarChart3,
  FileText,
  Eye,
  Terminal,
  Loader2,
  Link2,
  Trash2,
  Copy,
  Pause,
  GitBranch,
  UserCheck,
  Send,
  MoreHorizontal,
  Sparkles,
  Pencil,
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

/* ========== 常量 ========== */

const typeConfig: Record<StrategyType, { label: string; bg: string; text: string; icon: React.ElementType; desc: string }> = {
  automated: { label: '全自动', bg: 'bg-primary/12', text: 'text-primary', icon: Bot, desc: '短信/邮件/企微/易服务小程序/微信公众号' },
  manual: { label: '半自动', bg: 'bg-warning/12', text: 'text-[hsl(var(--warning))]', icon: UserCheck, desc: '专属客服/专属顾问' },
  hybrid: { label: '混合式', bg: 'bg-accent/12', text: 'text-accent', icon: GitBranch, desc: '结合全自动与半自动' },
}

const stratChannelIcons: Record<string, React.ElementType> = {
  'APP推送': Smartphone, '短信': MessageSquare, '公众号': Hash,
  '客服电话': Phone, '邮件': Mail, '专属客服': User,
  '直播': Play, '线下活动': Target, '小红书': Hash,
  '企微消息': Send, '企微': Send, '易服务小程序': Smartphone,
  '微信公众号': Hash, '视频短信': Smartphone, '5G消息': Smartphone,
  '专属顾问': UserCheck,
}

const statusConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'secondary' }> = {
  active: { label: '运行中', variant: 'success' },
  paused: { label: '已暂停', variant: 'warning' },
  draft: { label: '草稿', variant: 'secondary' },
}

/* ========== Mock 数据 ========== */

const strategyEffectivenessData = [
  { month: '10月', effectiveness: 72, conversion: 28 },
  { month: '11月', effectiveness: 75, conversion: 30 },
  { month: '12月', effectiveness: 78, conversion: 32 },
  { month: '1月', effectiveness: 76, conversion: 31 },
  { month: '2月', effectiveness: 80, conversion: 34 },
  { month: '3月', effectiveness: 82, conversion: 35 },
]

/* ========== 辅助函数：将 serviceStrategies 转为 StrategyDraft[] ========== */

function buildInitialStrategies(): StrategyDraft[] {
  return serviceStrategies.map(s => {
    const tpl = getDefaultTemplate(s.type as StrategyType)
    return {
      id: s.id,
      name: s.name,
      type: s.type as StrategyType,
      description: s.description,
      status: s.status as 'active' | 'paused' | 'draft',
      nodes: tpl.nodes,
      edges: tpl.edges,
      channels: s.channels,
      targetSegment: s.targetSegment,
      conversionRate: s.conversionRate,
      executionCount: s.executionCount,
      createdAt: '2026-01-15',
      source: s.source,
      sourceModule: s.sourceModule,
    }
  })
}

/* ========== 主页面 ========== */

export default function StrategyCenter() {
  const [searchParams] = useSearchParams()
  const tabFromUrl = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState<'management' | 'simulation'>('management')
  const { toasts, showToast, dismiss } = useToast()

  useEffect(() => {
    if (tabFromUrl === 'simulation' || tabFromUrl === 'management') {
      setActiveTab(tabFromUrl)
    }
  }, [tabFromUrl])

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">策略中心</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {activeTab === 'management' ? '策略配置与管理' : '策略模拟测试'}
        </p>
      </div>

      {activeTab === 'management' ? <StrategyManagementTab showToast={showToast} /> : <SimulationTab showToast={showToast} />}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </div>
  )
}

type ShowToastFn = (msg: string, type?: 'success' | 'error' | 'info' | 'warning') => void

/* ========== 策略管理 Tab (CRUD + 画布拖拽式配置) ========== */

function StrategyManagementTab({ showToast }: { showToast: ShowToastFn }) {
  const [strategies, setStrategies] = useState<StrategyDraft[]>(buildInitialStrategies)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<StrategyType | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showCreateMenu, setShowCreateMenu] = useState(false)
  const [editingDraft, setEditingDraft] = useState<StrategyDraft | null>(null)
  const [actionMenuId, setActionMenuId] = useState<string | null>(null)
  const createMenuRef = useRef<HTMLDivElement>(null)

  // Close menus on outside click
  useEffect(() => {
    const handleClick = () => {
      setShowCreateMenu(false)
      setActionMenuId(null)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  // Filter
  const filtered = strategies.filter(s => {
    const matchSearch = s.name.includes(search) || s.description.includes(search)
    const matchType = typeFilter === 'all' || s.type === typeFilter
    const matchStatus = statusFilter === 'all' || s.status === statusFilter
    return matchSearch && matchType && matchStatus
  })

  const selected = selectedId ? strategies.find(s => s.id === selectedId) : null

  // CRUD
  const handleCreate = (type: StrategyType) => {
    const tpl = getDefaultTemplate(type)
    const newStrategy: StrategyDraft = {
      id: 'SS' + String(Date.now()).slice(-6),
      name: `新${typeConfig[type].label}策略`,
      type,
      description: `新建的${typeConfig[type].label}策略`,
      status: 'draft',
      nodes: tpl.nodes,
      edges: tpl.edges,
      channels: type === 'automated' ? ['APP推送', '短信', '邮件'] : type === 'manual' ? ['专属客服', '专属顾问'] : ['APP推送', '短信', '专属客服'],
      targetSegment: '全部客户',
      conversionRate: 0,
      executionCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      source: 'manual',
    }
    setStrategies(prev => [newStrategy, ...prev])
    setEditingDraft(newStrategy)
    setShowCreateMenu(false)
    showToast(`已创建${typeConfig[type].label}策略，请在画布中配置`, 'success')
  }

  const handleDuplicate = (s: StrategyDraft) => {
    const dup: StrategyDraft = {
      ...s,
      id: 'SS' + String(Date.now()).slice(-6),
      name: s.name + ' (副本)',
      status: 'draft',
      executionCount: 0,
      conversionRate: 0,
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setStrategies(prev => [dup, ...prev])
    showToast(`已复制策略: ${s.name}`, 'success')
  }

  const handleDelete = (id: string) => {
    setStrategies(prev => prev.filter(s => s.id !== id))
    if (selectedId === id) setSelectedId(null)
    showToast('策略已删除', 'info')
  }

  const handleToggleStatus = (id: string) => {
    setStrategies(prev => prev.map(s => {
      if (s.id !== id) return s
      const next = s.status === 'active' ? 'paused' : 'active'
      return { ...s, status: next }
    }))
    const s = strategies.find(s => s.id === id)
    showToast(s?.status === 'active' ? '策略已暂停' : '策略已启用', 'info')
  }

  const handleSaveCanvas = (draft: StrategyDraft) => {
    setStrategies(prev => prev.map(s => s.id === draft.id ? draft : s))
    setEditingDraft(null)
    showToast(`策略「${draft.name}」已保存`, 'success')
  }

  const handleAdoptRecommendation = (rec: MOTRecommendation) => {
    const tpl = getDefaultTemplate(rec.strategyType)
    const sourceModule = rec.source.startsWith('全域洞察') ? '全域洞察' as const
      : rec.source.includes('客户') ? '客户之声' as const
      : rec.source.includes('舆情') ? '市场舆情' as const
      : rec.source.includes('政策') ? '政策变化' as const
      : rec.source.includes('行情') || rec.source.includes('估值') || rec.source.includes('板块') ? '行情分析' as const
      : '全域洞察' as const
    const newStrategy: StrategyDraft = {
      id: 'SS' + String(Date.now()).slice(-6),
      name: rec.title,
      type: rec.strategyType,
      description: rec.description,
      status: 'draft',
      nodes: tpl.nodes,
      edges: tpl.edges,
      channels: rec.channels,
      targetSegment: rec.targetSegment,
      conversionRate: 0,
      executionCount: 0,
      createdAt: new Date().toISOString().slice(0, 10),
      source: 'ai',
      sourceModule,
    }
    setStrategies(prev => [newStrategy, ...prev])
    // 重置筛选确保新策略可见，并自动选中展示详情
    setTypeFilter('all')
    setStatusFilter('all')
    setSearch('')
    setSelectedId(newStrategy.id)
    showToast(`已采纳策略「${rec.title}」，已添加到策略列表`, 'success')
  }

  // Stats
  const activeCount = strategies.filter(s => s.status === 'active').length
  const totalExecution = strategies.reduce((sum, s) => sum + s.executionCount, 0)
  const avgConv = strategies.length > 0 ? (strategies.reduce((sum, s) => sum + s.conversionRate, 0) / strategies.length).toFixed(1) : '0'
  const autoCount = strategies.filter(s => s.type === 'automated').length
  const manualCount = strategies.filter(s => s.type === 'manual').length
  const hybridCount = strategies.filter(s => s.type === 'hybrid').length

  return (
    <div className="flex gap-6">
      {/* 左侧：主内容区 */}
      <div className="flex-1 min-w-0 space-y-5">
      {/* KPI */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 xl:gap-4">
        {[
          { label: '策略总数', value: strategies.length.toString(), sub: `全自动 ${autoCount} / 半自动 ${manualCount} / 混合 ${hybridCount}`, icon: Layers, bg: 'bg-primary/15 text-primary' },
          { label: '运行中策略', value: activeCount.toString(), sub: `${strategies.length - activeCount} 个暂停/草稿`, icon: CheckCircle2, bg: 'bg-success/15 text-success' },
          { label: '累计执行', value: totalExecution.toLocaleString(), sub: '+12.5% 较上月', icon: Zap, bg: 'bg-gold/15 text-gold' },
          { label: '平均转化率', value: `${avgConv}%`, sub: '+3.2% 较上月', icon: TrendingUp, bg: 'bg-accent/15 text-accent' },
        ].map(s => (
          <Card key={s.label} className="group transition-all duration-200 hover:shadow-md">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-md ${s.bg}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
                <p className="text-[10px] text-success">{s.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 搜索栏 + 筛选 + 新建 */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="搜索策略名称或描述..." value={search} onChange={e => setSearch(e.target.value)}
            className="h-9 w-full rounded border border-border bg-secondary pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
        </div>

        {/* 类型筛选 */}
        <div className="flex items-center gap-1 rounded-lg bg-secondary/50 p-0.5">
          {([
            { key: 'all' as const, label: '全部' },
            { key: 'automated' as const, label: '全自动' },
            { key: 'manual' as const, label: '半自动' },
            { key: 'hybrid' as const, label: '混合式' },
          ]).map(f => (
            <button key={f.key} onClick={() => setTypeFilter(f.key)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                typeFilter === f.key ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}>{f.label}</button>
          ))}
        </div>

        {/* 状态筛选 */}
        <div className="flex items-center gap-1 rounded-lg bg-secondary/50 p-0.5">
          {[
            { key: 'all', label: '全部' },
            { key: 'active', label: '运行中' },
            { key: 'paused', label: '已暂停' },
            { key: 'draft', label: '草稿' },
          ].map(f => (
            <button key={f.key} onClick={() => setStatusFilter(f.key)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === f.key ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}>{f.label}</button>
          ))}
        </div>

        {/* 新建按钮 */}
        <div className="relative" ref={createMenuRef}>
          <Button onClick={e => { e.stopPropagation(); setShowCreateMenu(!showCreateMenu) }} className="gap-1.5">
            <Plus className="h-4 w-4" />
            新建策略
            <ChevronDown className="h-3 w-3" />
          </Button>
          {showCreateMenu && (
            <div className="absolute right-0 top-full mt-1 w-64 rounded-lg border border-border bg-card shadow-xl z-20 overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
              {(['automated', 'manual', 'hybrid'] as StrategyType[]).map(type => {
                const cfg = typeConfig[type]
                const Icon = cfg.icon
                return (
                  <button key={type} onClick={() => handleCreate(type)}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-left hover:bg-secondary/50 transition-colors">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${cfg.bg}`}>
                      <Icon className={`h-4 w-4 ${cfg.text}`} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">{cfg.label}策略</p>
                      <p className="text-[10px] text-muted-foreground">{cfg.desc}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* 策略卡片列表 */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Layers className="h-10 w-10 text-muted-foreground/20 mb-3" />
              <p className="text-sm text-muted-foreground">没有找到匹配的策略</p>
              <p className="text-[11px] text-muted-foreground/60 mt-1">尝试调整筛选条件或创建新策略</p>
            </CardContent>
          </Card>
        )}
        {filtered.map(strat => {
          const cfg = typeConfig[strat.type]
          const TypeIcon = cfg.icon
          const stCfg = statusConfig[strat.status]

          return (
            <Card key={strat.id}
              className="transition-all duration-200 hover:shadow-md cursor-pointer"
              onClick={() => setSelectedId(strat.id)}>
              <CardContent className="p-0">
                <div className="flex items-center gap-3 px-4 py-3">
                  {/* Type icon */}
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 ${cfg.bg}`}>
                    <TypeIcon className={`h-4.5 w-4.5 ${cfg.text}`} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-foreground truncate">{strat.name}</span>
                      <Badge variant="secondary" className={`text-[9px] shrink-0 ${cfg.bg} ${cfg.text}`}>
                        {cfg.label}
                      </Badge>
                      {strat.source === 'ai' ? (
                        <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-gradient-to-r from-primary/15 to-accent/15 px-2 py-0.5 text-[9px] font-semibold text-primary border border-primary/20">
                          <Sparkles className="h-2.5 w-2.5" />
                          AI挖掘 · {strat.sourceModule}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 shrink-0 rounded-full bg-secondary/80 px-2 py-0.5 text-[9px] font-medium text-muted-foreground">
                          <Pencil className="h-2.5 w-2.5" />
                          人工创建
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{strat.description}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      {strat.channels.slice(0, 4).map(ch => {
                        const ChIcon = stratChannelIcons[ch] || Send
                        return (
                          <span key={ch} className="inline-flex items-center gap-0.5 rounded bg-secondary/60 px-1.5 py-0.5 text-[9px] text-foreground/60">
                            <ChIcon className="h-2.5 w-2.5" />{ch}
                          </span>
                        )
                      })}
                      {strat.channels.length > 4 && (
                        <span className="text-[9px] text-muted-foreground">+{strat.channels.length - 4}</span>
                      )}
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="text-right shrink-0 mr-2">
                    <p className="text-sm font-bold text-foreground">{strat.executionCount.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">执行次数</p>
                    <p className="text-[10px] text-success">{strat.conversionRate}% 转化</p>
                  </div>

                  {/* Status */}
                  <Badge variant={stCfg.variant} className="text-[10px] shrink-0">
                    {stCfg.label}
                  </Badge>

                  {/* Action menu */}
                  <div className="relative shrink-0">
                    <button
                      onClick={e => { e.stopPropagation(); setActionMenuId(actionMenuId === strat.id ? null : strat.id) }}
                      className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {actionMenuId === strat.id && (
                      <div className="absolute right-0 top-full mt-1 w-40 rounded-lg border border-border bg-card shadow-xl z-20 overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
                        <button onClick={() => { setEditingDraft(strat); setActionMenuId(null) }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-foreground hover:bg-secondary/50 transition-colors">
                          <FileEdit className="h-3.5 w-3.5" />编辑配置
                        </button>
                        <button onClick={() => { handleDuplicate(strat); setActionMenuId(null) }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-foreground hover:bg-secondary/50 transition-colors">
                          <Copy className="h-3.5 w-3.5" />复制策略
                        </button>
                        <button onClick={() => { handleToggleStatus(strat.id); setActionMenuId(null) }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-foreground hover:bg-secondary/50 transition-colors">
                          {strat.status === 'active' ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                          {strat.status === 'active' ? '暂停策略' : '启用策略'}
                        </button>
                        <div className="border-t border-border" />
                        <button onClick={() => { handleDelete(strat.id); setActionMenuId(null) }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-destructive hover:bg-destructive/5 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />删除策略
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 策略效果趋势图 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            策略效果趋势
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={strategyEffectivenessData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} domain={[20, 100]} />
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
                <Line type="monotone" dataKey="effectiveness" name="策略效果(%)" stroke="hsl(215, 80%, 52%)" strokeWidth={2} dot={{ fill: 'hsl(215, 80%, 52%)', r: 3 }} />
                <Line type="monotone" dataKey="conversion" name="转化率(%)" stroke="hsl(168, 70%, 42%)" strokeWidth={2} dot={{ fill: 'hsl(168, 70%, 42%)', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      </div>

      {/* 右侧：AI 策略推荐 */}
      <div className="w-[340px] shrink-0">
        <div className="sticky top-4">
          <MOTRecommendationPanel
            title="全域洞察 · AI策略推荐"
            recommendations={allRecommendations}
            onAdopt={handleAdoptRecommendation}
          />
        </div>
      </div>

      {/* 策略详情弹窗 */}
      {selected && (
        <StrategyDetailModal
          strategy={selected}
          onClose={() => setSelectedId(null)}
          onEdit={() => setEditingDraft(selected)}
          onDuplicate={() => handleDuplicate(selected)}
          onToggleStatus={() => handleToggleStatus(selected.id)}
        />
      )}

      {/* Canvas Editor Modal */}
      {editingDraft && (
        <StrategyCanvas
          draft={editingDraft}
          onSave={handleSaveCanvas}
          onClose={() => setEditingDraft(null)}
        />
      )}
    </div>
  )
}

/* ========== 策略详情弹窗 ========== */

function StrategyDetailModal({
  strategy,
  onClose,
  onEdit,
  onDuplicate,
  onToggleStatus,
}: {
  strategy: StrategyDraft
  onClose: () => void
  onEdit: () => void
  onDuplicate: () => void
  onToggleStatus: () => void
}) {
  const cfg = typeConfig[strategy.type]
  const TypeIcon = cfg.icon
  const stCfg = statusConfig[strategy.status]

  // 模拟效果数据
  const effectData = [
    { month: '1月', reach: 320, convert: 98 },
    { month: '2月', reach: 410, convert: 135 },
    { month: '3月', reach: 380, convert: 118 },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in" onClick={onClose}>
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      {/* 弹窗卡片 */}
      <Card className="relative w-full max-w-2xl mx-4 shadow-2xl border-border/60 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* 头部 */}
        <div className={`px-6 pt-5 pb-4 border-b border-border/60 ${cfg.bg} rounded-t-lg`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${cfg.bg} border-2 border-current/15`}>
                <TypeIcon className={`h-5 w-5 ${cfg.text}`} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold text-foreground">{strategy.name}</h2>
                  <Badge variant={stCfg.variant} className="text-[10px]">{stCfg.label}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{strategy.description}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge variant="secondary" className={`text-[9px] ${cfg.bg} ${cfg.text}`}>{cfg.label}</Badge>
                  {strategy.source === 'ai' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary/15 to-accent/15 px-2 py-0.5 text-[9px] font-semibold text-primary border border-primary/20">
                      <Sparkles className="h-2.5 w-2.5" />
                      AI挖掘 · {strategy.sourceModule}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary/80 px-2 py-0.5 text-[9px] font-medium text-muted-foreground">
                      <Pencil className="h-2.5 w-2.5" />
                      人工创建
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground">创建于 {strategy.createdAt}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <CardContent className="p-6 space-y-5">
          {/* 核心指标 */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: '执行次数', value: strategy.executionCount.toLocaleString(), color: 'text-primary', bg: 'bg-primary/10', icon: Zap },
              { label: '转化率', value: `${strategy.conversionRate}%`, color: 'text-success', bg: 'bg-success/10', icon: TrendingUp },
              { label: '目标客群', value: strategy.targetSegment, color: 'text-foreground', bg: 'bg-secondary', icon: Users },
              { label: '触达渠道', value: `${strategy.channels.length} 个`, color: 'text-accent', bg: 'bg-accent/10', icon: Send },
            ].map(item => (
              <div key={item.label} className="rounded-lg border border-border p-3 text-center">
                <div className={`inline-flex h-8 w-8 items-center justify-center rounded-md ${item.bg} mb-1.5`}>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
                <p className="text-[10px] text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>

          {/* 触达渠道 + 执行流程 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">触达渠道</p>
              <div className="flex flex-wrap gap-1.5">
                {strategy.channels.map(ch => {
                  const ChIcon = stratChannelIcons[ch] || Send
                  return (
                    <span key={ch} className="inline-flex items-center gap-1 rounded-md bg-secondary/60 px-2 py-1 text-[10px] text-foreground/70 border border-border/40">
                      <ChIcon className="h-3 w-3" />{ch}
                    </span>
                  )
                })}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">执行流程预览</p>
              <div className="flex items-center gap-1.5 p-2.5 rounded-lg bg-secondary/30 border border-border/40 overflow-x-auto">
                {strategy.nodes.slice(0, 5).map((node, i, arr) => (
                  <div key={node.id} className="flex items-center gap-1.5 shrink-0">
                    <div className="text-[9px] px-2 py-1 rounded-md bg-card border border-border text-foreground/70 font-medium whitespace-nowrap">
                      {node.label}
                    </div>
                    {i < arr.length - 1 && <ArrowRight className="h-2.5 w-2.5 text-muted-foreground/40 shrink-0" />}
                  </div>
                ))}
                {strategy.nodes.length > 5 && (
                  <span className="text-[9px] text-muted-foreground shrink-0">+{strategy.nodes.length - 5}</span>
                )}
              </div>
            </div>
          </div>

          {/* 近期效果趋势 */}
          <div>
            <p className="text-xs font-semibold text-foreground mb-2">近期执行效果</p>
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={effectData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                      fontSize: '11px',
                      color: 'hsl(var(--foreground))',
                    }}
                  />
                  <Bar dataKey="reach" name="触达人数" fill="hsl(215, 80%, 52%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="convert" name="转化人数" fill="hsl(168, 70%, 42%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-2 pt-2 border-t border-border/60">
            <Button className="flex-1 gap-1.5" onClick={() => { onEdit(); onClose() }}>
              <FileEdit className="h-3.5 w-3.5" />
              编辑配置
            </Button>
            <Button variant="outline" className="gap-1.5" onClick={() => { onDuplicate(); onClose() }}>
              <Copy className="h-3.5 w-3.5" />
              复制策略
            </Button>
            <Button variant="outline" className="gap-1.5" onClick={() => { onToggleStatus(); onClose() }}>
              {strategy.status === 'active' ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              {strategy.status === 'active' ? '暂停' : '启用'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

/* ========== 模拟测试 Tab (PRD 4.3.3) ========== */

function SimulationTab({ showToast: _showToast }: { showToast: ShowToastFn }) {
  const [selectedStrategy, setSelectedStrategy] = useState('')
  const [selectedScenario, setSelectedScenario] = useState('')
  const [selectedScope, setSelectedScope] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [logs, setLogs] = useState<{ prefix: string; message: string }[]>([])
  const [showResults, setShowResults] = useState(false)
  const [progress, setProgress] = useState(0)
  const terminalRef = useRef<HTMLDivElement>(null)

  const marketScenarios = [
    { value: 'crash', label: '大盘单日跌幅 >= 3%' },
    { value: 'surge', label: '大盘单日涨幅 >= 3%' },
    { value: 'sector', label: '板块异动 >= 5%' },
    { value: 'policy', label: '重大政策发布' },
    { value: 'normal', label: '市场正常波动' },
  ]

  const customerScopes = [
    { value: 'all', label: '全部客户 (10人)' },
    { value: 'value', label: '价值型客户 (4人)' },
    { value: 'active', label: '活跃型客户 (3人)' },
    { value: 'beginner', label: '新手型客户 (3人)' },
    { value: 'high-risk', label: '高风险偏好客户 (2人)' },
  ]

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [logs])

  const prefixColors: Record<string, string> = {
    System: 'text-primary',
    Config: 'text-accent',
    Engine: 'text-[hsl(var(--warning))]',
    Filter: 'text-primary/80',
    Action: 'text-success',
    Result: 'text-success',
  }

  const runSimulation = () => {
    if (!selectedStrategy || !selectedScenario || !selectedScope) return

    setIsRunning(true)
    setLogs([])
    setShowResults(false)
    setProgress(0)

    const strategy = serviceStrategies.find(s => s.id === selectedStrategy)
    const scenario = marketScenarios.find(s => s.value === selectedScenario)
    const scope = customerScopes.find(s => s.value === selectedScope)

    const logEntries = [
      { prefix: 'System', message: '策略模拟引擎 v2.1 启动...' },
      { prefix: 'System', message: '加载运行环境配置...' },
      { prefix: 'Config', message: `目标策略: ${strategy?.name || '未知'}` },
      { prefix: 'Config', message: `市场场景: ${scenario?.label || '未知'}` },
      { prefix: 'Config', message: `客户范围: ${scope?.label || '未知'}` },
      { prefix: 'Engine', message: '初始化规则引擎...' },
      { prefix: 'Engine', message: '加载关联MOT规则...' },
      { prefix: 'Engine', message: '规则参数验证通过' },
      { prefix: 'Filter', message: '执行客户画像匹配...' },
      { prefix: 'Filter', message: '  目标客群筛选: 8/10 匹配' },
      { prefix: 'Filter', message: '  风险等级过滤: 6/8 通过' },
      { prefix: 'Filter', message: '  行为特征匹配: 6/6 命中' },
      { prefix: 'Filter', message: '  合规预检: 6/6 全部通过' },
      { prefix: 'Action', message: '生成个性化服务内容...' },
      { prefix: 'Action', message: '  APP推送文案 x 4 条 已生成' },
      { prefix: 'Action', message: '  邮件模板 x 1 封 已生成' },
      { prefix: 'Action', message: '  专属客服话术 x 1 套 已生成' },
      { prefix: 'Result', message: '========== 模拟完成 ==========' },
      { prefix: 'Result', message: '预估触发: 6 客户 | 覆盖率: 60%' },
      { prefix: 'Result', message: '预估响应率: 72% | 转化率: 35.2%' },
      { prefix: 'Result', message: 'AUM增量预估: 128.5万元' },
      { prefix: 'Result', message: '合规风险: 低 (6/6 规则通过)' },
    ]

    const delays = [400, 300, 500, 300, 300, 600, 400, 200, 800, 300, 300, 300, 200, 700, 300, 250, 250, 500, 200, 200, 200, 200]

    let totalDelay = 0
    logEntries.forEach((entry, i) => {
      totalDelay += delays[i] || 300
      const currentDelay = totalDelay
      setTimeout(() => {
        setLogs(prev => [...prev, entry])
        setProgress(Math.round(((i + 1) / logEntries.length) * 100))
        if (i === logEntries.length - 1) {
          setTimeout(() => {
            setIsRunning(false)
            setShowResults(true)
          }, 600)
        }
      }, currentDelay)
    })
  }

  return (
    <div className="space-y-5">
      {/* 场景构建器 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-primary" />
            场景构建器
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block">目标策略</label>
              <select
                value={selectedStrategy}
                onChange={e => setSelectedStrategy(e.target.value)}
                className="h-9 w-full rounded border border-border bg-secondary px-3 text-sm text-foreground focus:border-primary focus:outline-none appearance-none cursor-pointer"
              >
                <option value="">选择策略...</option>
                {serviceStrategies.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block">市场场景</label>
              <select
                value={selectedScenario}
                onChange={e => setSelectedScenario(e.target.value)}
                className="h-9 w-full rounded border border-border bg-secondary px-3 text-sm text-foreground focus:border-primary focus:outline-none appearance-none cursor-pointer"
              >
                <option value="">选择场景...</option>
                {marketScenarios.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-[11px] font-medium text-muted-foreground mb-1.5 block">客户范围</label>
              <select
                value={selectedScope}
                onChange={e => setSelectedScope(e.target.value)}
                className="h-9 w-full rounded border border-border bg-secondary px-3 text-sm text-foreground focus:border-primary focus:outline-none appearance-none cursor-pointer"
              >
                <option value="">选择范围...</option>
                {customerScopes.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            <Button
              onClick={runSimulation}
              disabled={isRunning || !selectedStrategy || !selectedScenario || !selectedScope}
              className="shrink-0 gap-2"
            >
              {isRunning ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isRunning ? '模拟中...' : '运行模拟'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 模拟终端 - PRD: 不要用黑底，更偏商务风格 */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2 border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" />
              模拟终端
            </CardTitle>
            <div className="flex items-center gap-2">
              {isRunning && (
                <div className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
                  <span className="text-[10px] font-medium text-destructive">LIVE</span>
                </div>
              )}
              {(isRunning || logs.length > 0) && (
                <span className="text-[10px] text-muted-foreground">{progress}%</span>
              )}
            </div>
          </div>
          {(isRunning || logs.length > 0) && (
            <div className="h-1 rounded-full bg-secondary overflow-hidden mt-2">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <div
            ref={terminalRef}
            className="bg-secondary/30 min-h-[280px] max-h-[400px] overflow-y-auto p-4 text-[13px] leading-relaxed"
          >
            {logs.length === 0 && !isRunning ? (
              <div className="flex items-center justify-center h-[280px] text-muted-foreground/40">
                <div className="text-center">
                  <Terminal className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">选择场景参数后点击「运行模拟」开始</p>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-muted-foreground/50 mb-2 text-xs font-medium">易方达 VMOT 策略模拟引擎</p>
                {logs.map((log, i) => (
                  <div key={i} className="flex animate-fade-in">
                    <span className={`shrink-0 text-xs font-mono font-medium ${prefixColors[log.prefix] || 'text-muted-foreground'}`}>
                      [{log.prefix.padEnd(6)}]
                    </span>
                    <span className="text-foreground/80 ml-2 text-xs">{log.message}</span>
                  </div>
                ))}
                {isRunning && (
                  <span className="inline-block w-2 h-4 bg-primary/60 animate-pulse ml-1 rounded-sm" />
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 结果摘要 */}
      {showResults && (
        <div className="animate-fade-in">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-success" />
            模拟结果摘要
          </h3>
          <div className="grid grid-cols-3 xl:grid-cols-5 gap-3 xl:gap-4">
            {[
              { label: '预估触发', value: '6', unit: '客户', color: 'text-primary', bg: 'bg-primary/15', icon: Users },
              { label: '预估响应率', value: '72', unit: '%', color: 'text-accent', bg: 'bg-accent/15', icon: Target },
              { label: '预估转化率', value: '35.2', unit: '%', color: 'text-success', bg: 'bg-success/15', icon: TrendingUp },
              { label: 'AUM增量', value: '128.5', unit: '万元', color: 'text-gold', bg: 'bg-gold/15', icon: BarChart3 },
              { label: '合规风险', value: '低', unit: '通过', color: 'text-success', bg: 'bg-success/15', icon: Shield },
            ].map(item => (
              <Card key={item.label} className="transition-all duration-200 hover:shadow-md">
                <CardContent className="p-4 text-center">
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${item.bg} mb-2`}>
                    <item.icon className={`h-5 w-5 ${item.color}`} />
                  </div>
                  <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{item.unit}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
