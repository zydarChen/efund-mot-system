// 策略画布编辑器 - 拖拽式策略配置
import { useState, useRef, useCallback, useEffect } from 'react'
import {
  X, Trash2, Zap, Users, Clock, Send, FileText,
  UserCheck, BarChart3, GitBranch, Save, GripVertical,
  Smartphone, MessageSquare, Mail, Phone, Hash, ChevronRight,
  Plus, Settings2, CheckCircle2,
} from 'lucide-react'

/* ===== Types ===== */
export interface FlowNode {
  id: string
  type: NodeType
  label: string
  x: number
  y: number
  config: Record<string, string | string[] | number | boolean>
}

export interface FlowEdge {
  id: string
  from: string
  to: string
}

export type NodeType = 'trigger' | 'filter' | 'condition' | 'timing' | 'channel' | 'content' | 'manual_assign' | 'tracking'
export type StrategyType = 'automated' | 'manual' | 'hybrid'

export interface StrategyDraft {
  id: string
  name: string
  type: StrategyType
  description: string
  status: 'active' | 'paused' | 'draft'
  nodes: FlowNode[]
  edges: FlowEdge[]
  channels: string[]
  targetSegment: string
  conversionRate: number
  executionCount: number
  createdAt: string
  source: 'ai' | 'manual'
  sourceModule?: '客户之声' | '市场舆情' | '政策变化' | '行情分析' | '全域洞察'
}

/* ===== Node Config ===== */
const NODE_W = 152
const NODE_H = 68

const nodeTypeConfig: Record<NodeType, { label: string; icon: typeof Zap; colorClass: string; bgClass: string; borderClass: string; desc: string }> = {
  trigger:       { label: '触发条件', icon: Zap,        colorClass: 'text-primary',               bgClass: 'bg-primary/10',     borderClass: 'border-primary/30',   desc: '定义 MOT 触发事件' },
  filter:        { label: '客户筛选', icon: Users,      colorClass: 'text-accent',                bgClass: 'bg-accent/10',      borderClass: 'border-accent/30',    desc: '筛选目标客户群' },
  condition:     { label: '条件判断', icon: GitBranch,   colorClass: 'text-[hsl(var(--warning))]', bgClass: 'bg-warning/10',     borderClass: 'border-warning/30',   desc: '根据条件分流执行' },
  timing:        { label: '时间控制', icon: Clock,      colorClass: 'text-success',               bgClass: 'bg-success/10',     borderClass: 'border-success/30',   desc: '设定触达时间窗口' },
  channel:       { label: '渠道路由', icon: Send,       colorClass: 'text-primary',               bgClass: 'bg-primary/10',     borderClass: 'border-primary/30',   desc: '选择触达渠道' },
  content:       { label: '内容配置', icon: FileText,   colorClass: 'text-accent',                bgClass: 'bg-accent/10',      borderClass: 'border-accent/30',    desc: '配置推送内容模板' },
  manual_assign: { label: '人工分配', icon: UserCheck,  colorClass: 'text-[hsl(var(--warning))]', bgClass: 'bg-warning/10',     borderClass: 'border-warning/30',   desc: '分配给专属客服/顾问' },
  tracking:      { label: '效果追踪', icon: BarChart3,  colorClass: 'text-success',               bgClass: 'bg-success/10',     borderClass: 'border-success/30',   desc: '追踪转化效果指标' },
}

/* ===== Templates ===== */
function makeId() { return 'n' + Math.random().toString(36).slice(2, 8) }

function automatedTemplate(): { nodes: FlowNode[]; edges: FlowEdge[] } {
  const ids = Array.from({ length: 6 }, makeId)
  return {
    nodes: [
      { id: ids[0], type: 'trigger',  label: '触发条件', x: 80,  y: 180, config: { event: '大额赎回预警', threshold: '5万' } },
      { id: ids[1], type: 'filter',   label: '客户筛选', x: 300, y: 180, config: { segment: '全部客户', minAssets: '1万' } },
      { id: ids[2], type: 'timing',   label: '时间控制', x: 520, y: 180, config: { window: '09:00-20:00', delay: 'T+0' } },
      { id: ids[3], type: 'channel',  label: '渠道路由', x: 740, y: 180, config: { channels: ['APP推送', '短信', '邮件'], fallback: '企微消息' } },
      { id: ids[4], type: 'content',  label: '内容配置', x: 960, y: 180, config: { template: '陪伴安抚话术', personalized: true } },
      { id: ids[5], type: 'tracking', label: '效果追踪', x: 1180, y: 180, config: { metrics: ['送达率', '打开率', '转化率'], period: '7天' } },
    ],
    edges: ids.slice(0, -1).map((from, i) => ({ id: `e${i}`, from, to: ids[i + 1] })),
  }
}

function manualTemplate(): { nodes: FlowNode[]; edges: FlowEdge[] } {
  const ids = Array.from({ length: 5 }, makeId)
  return {
    nodes: [
      { id: ids[0], type: 'trigger',       label: '触发条件', x: 80,  y: 180, config: { event: '客户流失预警', threshold: '30天无登录' } },
      { id: ids[1], type: 'filter',        label: '客户筛选', x: 300, y: 180, config: { segment: '价值型客户', minAssets: '50万' } },
      { id: ids[2], type: 'manual_assign', label: '人工分配', x: 520, y: 180, config: { rule: '按客群匹配', maxPerPerson: 20 } },
      { id: ids[3], type: 'content',       label: '服务方案', x: 740, y: 180, config: { template: '专属挽回方案', personalized: true } },
      { id: ids[4], type: 'tracking',      label: '效果追踪', x: 960, y: 180, config: { metrics: ['挽回率', '满意度'], period: '30天' } },
    ],
    edges: ids.slice(0, -1).map((from, i) => ({ id: `e${i}`, from, to: ids[i + 1] })),
  }
}

function hybridTemplate(): { nodes: FlowNode[]; edges: FlowEdge[] } {
  const ids = Array.from({ length: 7 }, makeId)
  return {
    nodes: [
      { id: ids[0], type: 'trigger',       label: '触发条件',   x: 80,  y: 220, config: { event: '市场大跌', threshold: '跌幅≥3%' } },
      { id: ids[1], type: 'filter',        label: '客户筛选',   x: 300, y: 220, config: { segment: '全部客户', minAssets: '1万' } },
      { id: ids[2], type: 'condition',     label: '客户分层',   x: 520, y: 220, config: { conditionType: '资产规模', threshold: '100万' } },
      { id: ids[3], type: 'channel',       label: '自动触达',   x: 760, y: 110, config: { channels: ['APP推送', '短信'], fallback: '邮件' } },
      { id: ids[4], type: 'manual_assign', label: '专属服务',   x: 760, y: 330, config: { rule: 'VIP专属顾问', maxPerPerson: 10 } },
      { id: ids[5], type: 'content',       label: '内容配置',   x: 1000, y: 110, config: { template: '安抚话术', personalized: true } },
      { id: ids[6], type: 'tracking',      label: '效果追踪',   x: 1000, y: 330, config: { metrics: ['留存率', '满意度'], period: '14天' } },
    ],
    edges: [
      { id: 'e0', from: ids[0], to: ids[1] },
      { id: 'e1', from: ids[1], to: ids[2] },
      { id: 'e2', from: ids[2], to: ids[3] },
      { id: 'e3', from: ids[2], to: ids[4] },
      { id: 'e4', from: ids[3], to: ids[5] },
      { id: 'e5', from: ids[4], to: ids[6] },
    ],
  }
}

export function getDefaultTemplate(type: StrategyType) {
  if (type === 'automated') return automatedTemplate()
  if (type === 'manual') return manualTemplate()
  return hybridTemplate()
}

/* ===== Node Properties Panel ===== */
function NodeProperties({ node, onChange }: { node: FlowNode; onChange: (config: FlowNode['config']) => void }) {
  const cfg = nodeTypeConfig[node.type]
  const Icon = cfg.icon

  const configFields: Record<NodeType, { key: string; label: string; type: 'text' | 'select' | 'tags' | 'toggle'; options?: string[] }[]> = {
    trigger: [
      { key: 'event', label: '触发事件', type: 'select', options: ['大额赎回预警', '基金净值回撤', '市场大跌', '客户流失预警', '新客首投', '定投日关怀', '生日关怀', '社区负面情绪'] },
      { key: 'threshold', label: '触发阈值', type: 'text' },
    ],
    filter: [
      { key: 'segment', label: '客户群', type: 'select', options: ['全部客户', '价值型客户', '活跃型客户', '新手型客户', '流失预警客户'] },
      { key: 'minAssets', label: '最低资产', type: 'text' },
    ],
    condition: [
      { key: 'conditionType', label: '判断维度', type: 'select', options: ['资产规模', '风险偏好', '客户生命周期', '持仓时长', '活跃度'] },
      { key: 'threshold', label: '分流阈值', type: 'text' },
    ],
    timing: [
      { key: 'window', label: '时间窗口', type: 'text' },
      { key: 'delay', label: '延迟', type: 'select', options: ['T+0 (即时)', 'T+1 (次日)', 'T+3 (三日)', 'T+7 (一周)'] },
    ],
    channel: [
      { key: 'channels', label: '触达渠道', type: 'tags', options: ['APP推送', '短信', '邮件', '企微消息', '公众号', '客服电话', '视频短信', '5G消息', '易服务小程序'] },
      { key: 'fallback', label: '降级渠道', type: 'select', options: ['短信', '邮件', '企微消息', 'APP推送'] },
    ],
    content: [
      { key: 'template', label: '内容模板', type: 'select', options: ['陪伴安抚话术', '新客欢迎引导', '季报解读推送', '定投鼓励话术', '生日祝福模板', '专属挽回方案', '风险提示模板'] },
      { key: 'personalized', label: '千人千面', type: 'toggle' },
    ],
    manual_assign: [
      { key: 'rule', label: '分配规则', type: 'select', options: ['按客群匹配', '按专长匹配', '按区域匹配', 'VIP专属顾问', '轮询分配'] },
      { key: 'maxPerPerson', label: '人均上限', type: 'text' },
    ],
    tracking: [
      { key: 'metrics', label: '追踪指标', type: 'tags', options: ['送达率', '打开率', '转化率', '留存率', '满意度', '挽回率', 'AUM变化'] },
      { key: 'period', label: '追踪周期', type: 'select', options: ['3天', '7天', '14天', '30天'] },
    ],
  }

  const fields = configFields[node.type] || []

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${cfg.bgClass}`}>
          <Icon className={`h-4 w-4 ${cfg.colorClass}`} />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{cfg.label}</p>
          <p className="text-[10px] text-muted-foreground">{cfg.desc}</p>
        </div>
      </div>

      {fields.map(field => (
        <div key={field.key}>
          <label className="text-[11px] font-medium text-muted-foreground mb-1 block">{field.label}</label>
          {field.type === 'text' && (
            <input
              type="text"
              value={String(node.config[field.key] || '')}
              onChange={e => onChange({ ...node.config, [field.key]: e.target.value })}
              className="h-8 w-full rounded border border-border bg-secondary/50 px-2.5 text-xs text-foreground focus:border-primary/50 focus:outline-none"
            />
          )}
          {field.type === 'select' && (
            <select
              value={String(node.config[field.key] || '')}
              onChange={e => onChange({ ...node.config, [field.key]: e.target.value })}
              className="h-8 w-full rounded border border-border bg-secondary/50 px-2 text-xs text-foreground focus:border-primary/50 focus:outline-none appearance-none cursor-pointer"
            >
              {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          )}
          {field.type === 'tags' && (
            <div className="flex flex-wrap gap-1">
              {field.options?.map(tag => {
                const active = Array.isArray(node.config[field.key]) && (node.config[field.key] as string[]).includes(tag)
                return (
                  <button
                    key={tag}
                    onClick={() => {
                      const curr = Array.isArray(node.config[field.key]) ? [...(node.config[field.key] as string[])] : []
                      const next = active ? curr.filter(t => t !== tag) : [...curr, tag]
                      onChange({ ...node.config, [field.key]: next })
                    }}
                    className={`text-[10px] px-1.5 py-0.5 rounded-full border transition-colors ${
                      active ? 'bg-primary/15 text-primary border-primary/30' : 'bg-secondary/50 text-muted-foreground border-border hover:text-foreground'
                    }`}
                  >{tag}</button>
                )
              })}
            </div>
          )}
          {field.type === 'toggle' && (
            <button
              onClick={() => onChange({ ...node.config, [field.key]: !node.config[field.key] })}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                node.config[field.key] ? 'bg-primary' : 'bg-secondary'
              }`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${
                node.config[field.key] ? 'translate-x-5' : 'translate-x-0.5'
              }`} />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

/* ===== Bezier Connection Path ===== */
function getPath(from: FlowNode, to: FlowNode): string {
  const sx = from.x + NODE_W
  const sy = from.y + NODE_H / 2
  const ex = to.x
  const ey = to.y + NODE_H / 2
  const dx = Math.abs(ex - sx) * 0.5
  return `M ${sx} ${sy} C ${sx + dx} ${sy}, ${ex - dx} ${ey}, ${ex} ${ey}`
}

/* ===== Main Canvas Modal ===== */
interface StrategyCanvasProps {
  draft: StrategyDraft
  onSave: (draft: StrategyDraft) => void
  onClose: () => void
}

export default function StrategyCanvas({ draft, onSave, onClose }: StrategyCanvasProps) {
  const [nodes, setNodes] = useState<FlowNode[]>(draft.nodes)
  const [edges, setEdges] = useState<FlowEdge[]>(draft.edges)
  const [name, setName] = useState(draft.name)
  const [stratType, setStratType] = useState<StrategyType>(draft.type)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [draggingNode, setDraggingNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  // When type changes, load template for new strategies
  const handleTypeChange = (t: StrategyType) => {
    setStratType(t)
    if (nodes.length <= 1) {
      const tpl = getDefaultTemplate(t)
      setNodes(tpl.nodes)
      setEdges(tpl.edges)
      setSelectedNode(null)
    }
  }

  // Drag from palette
  const handlePaletteDragStart = (e: React.DragEvent, type: NodeType) => {
    e.dataTransfer.setData('nodeType', type)
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const type = e.dataTransfer.getData('nodeType') as NodeType
    if (!type || !nodeTypeConfig[type]) return
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const scrollLeft = canvasRef.current?.scrollLeft || 0
    const scrollTop = canvasRef.current?.scrollTop || 0
    const x = e.clientX - rect.left + scrollLeft - NODE_W / 2
    const y = e.clientY - rect.top + scrollTop - NODE_H / 2
    const cfg = nodeTypeConfig[type]
    const newNode: FlowNode = {
      id: makeId(),
      type,
      label: cfg.label,
      x: Math.max(0, Math.round(x / 20) * 20),
      y: Math.max(0, Math.round(y / 20) * 20),
      config: {},
    }
    setNodes(prev => [...prev, newNode])
    setSelectedNode(newNode.id)
  }

  // Node drag on canvas
  const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation()
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const scrollLeft = canvasRef.current?.scrollLeft || 0
    const scrollTop = canvasRef.current?.scrollTop || 0
    setDraggingNode(nodeId)
    setDragOffset({
      x: e.clientX - rect.left + scrollLeft - node.x,
      y: e.clientY - rect.top + scrollTop - node.y,
    })
    setSelectedNode(nodeId)
  }, [nodes])

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (!draggingNode) return
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const scrollLeft = canvasRef.current?.scrollLeft || 0
    const scrollTop = canvasRef.current?.scrollTop || 0
    const x = Math.max(0, Math.round((e.clientX - rect.left + scrollLeft - dragOffset.x) / 20) * 20)
    const y = Math.max(0, Math.round((e.clientY - rect.top + scrollTop - dragOffset.y) / 20) * 20)
    setNodes(prev => prev.map(n => n.id === draggingNode ? { ...n, x, y } : n))
  }, [draggingNode, dragOffset])

  const handleCanvasMouseUp = useCallback(() => {
    setDraggingNode(null)
  }, [])

  // Delete node
  const deleteNode = (nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId))
    setEdges(prev => prev.filter(e => e.from !== nodeId && e.to !== nodeId))
    if (selectedNode === nodeId) setSelectedNode(null)
  }

  // Connection drawing
  const [connecting, setConnecting] = useState<string | null>(null)

  const handlePortClick = (nodeId: string, portType: 'out' | 'in') => {
    if (portType === 'out') {
      setConnecting(nodeId)
    } else if (connecting && connecting !== nodeId) {
      // Check no duplicate edge
      const exists = edges.some(e => e.from === connecting && e.to === nodeId)
      if (!exists) {
        setEdges(prev => [...prev, { id: makeId(), from: connecting, to: nodeId }])
      }
      setConnecting(null)
    }
  }

  // Update node config
  const updateNodeConfig = (nodeId: string, config: FlowNode['config']) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, config } : n))
  }

  // Save
  const handleSave = () => {
    onSave({
      ...draft,
      name,
      type: stratType,
      nodes,
      edges,
    })
  }

  const selectedNodeData = selectedNode ? nodes.find(n => n.id === selectedNode) : null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="absolute inset-3 bg-card rounded-xl border border-border shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="输入策略名称..."
              className="h-8 w-64 rounded border border-border bg-secondary/50 px-3 text-sm font-medium text-foreground focus:border-primary/50 focus:outline-none"
            />
            <div className="flex items-center gap-1 rounded-lg bg-secondary/50 p-0.5">
              {([
                { key: 'automated' as const, label: '全自动', icon: Zap },
                { key: 'manual' as const, label: '半自动', icon: UserCheck },
                { key: 'hybrid' as const, label: '混合式', icon: GitBranch },
              ]).map(t => (
                <button
                  key={t.key}
                  onClick={() => handleTypeChange(t.key)}
                  className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
                    stratType === t.key ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <t.icon className="h-3 w-3" />
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              取消
            </button>
            <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
              <Save className="h-3.5 w-3.5" />
              保存策略
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Node Palette */}
          <div className="w-44 border-r border-border bg-secondary/20 p-2 space-y-1 overflow-y-auto shrink-0">
            <p className="text-[10px] font-semibold text-muted-foreground px-2 py-1 uppercase tracking-wider">节点面板</p>
            <p className="text-[9px] text-muted-foreground/60 px-2 mb-2">拖拽节点到画布</p>
            {(Object.entries(nodeTypeConfig) as [NodeType, typeof nodeTypeConfig[NodeType]][]).map(([type, cfg]) => {
              const Icon = cfg.icon
              return (
                <div
                  key={type}
                  draggable
                  onDragStart={e => handlePaletteDragStart(e, type)}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card p-2 cursor-grab active:cursor-grabbing hover:border-primary/30 hover:shadow-sm transition-all group"
                >
                  <div className={`h-7 w-7 rounded flex items-center justify-center shrink-0 ${cfg.bgClass}`}>
                    <Icon className={`h-3.5 w-3.5 ${cfg.colorClass}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-foreground">{cfg.label}</p>
                    <p className="text-[9px] text-muted-foreground truncate">{cfg.desc}</p>
                  </div>
                  <GripVertical className="h-3 w-3 text-muted-foreground/30 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )
            })}
          </div>

          {/* Center: Canvas */}
          <div
            ref={canvasRef}
            className="flex-1 relative overflow-auto"
            style={{
              backgroundImage: 'radial-gradient(circle, hsl(var(--border) / 0.4) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
            onDragOver={e => e.preventDefault()}
            onDrop={handleCanvasDrop}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            onClick={() => { setSelectedNode(null); setConnecting(null) }}
          >
            {/* Canvas size placeholder */}
            <div style={{ width: 1600, height: 600, pointerEvents: 'none' }} />

            {/* SVG Connections */}
            <svg className="absolute inset-0 pointer-events-none" style={{ width: 1600, height: 600 }}>
              <defs>
                <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <path d="M 0 0 L 8 3 L 0 6 Z" fill="hsl(var(--primary) / 0.5)" />
                </marker>
              </defs>
              {edges.map(edge => {
                const from = nodes.find(n => n.id === edge.from)
                const to = nodes.find(n => n.id === edge.to)
                if (!from || !to) return null
                return (
                  <g key={edge.id}>
                    <path
                      d={getPath(from, to)}
                      fill="none"
                      stroke="hsl(var(--primary) / 0.3)"
                      strokeWidth={2}
                      strokeDasharray="6 3"
                      markerEnd="url(#arrowhead)"
                    />
                    {/* Delete edge on click */}
                    <path
                      d={getPath(from, to)}
                      fill="none"
                      stroke="transparent"
                      strokeWidth={16}
                      className="cursor-pointer pointer-events-auto"
                      onClick={e => { e.stopPropagation(); setEdges(prev => prev.filter(ee => ee.id !== edge.id)) }}
                    />
                  </g>
                )
              })}
            </svg>

            {/* Nodes */}
            {nodes.map(node => {
              const cfg = nodeTypeConfig[node.type]
              const Icon = cfg.icon
              const isSelected = selectedNode === node.id
              const isConnectingFrom = connecting === node.id
              return (
                <div
                  key={node.id}
                  className={`absolute rounded-lg border-2 bg-card shadow-sm cursor-move transition-shadow select-none ${
                    isSelected ? `${cfg.borderClass} shadow-md ring-2 ring-primary/10` : 'border-border hover:shadow-md'
                  }`}
                  style={{ left: node.x, top: node.y, width: NODE_W, height: NODE_H }}
                  onMouseDown={e => handleNodeMouseDown(e, node.id)}
                  onClick={e => { e.stopPropagation(); setSelectedNode(node.id) }}
                >
                  <div className="flex items-center gap-2 px-3 py-2 h-full">
                    <div className={`h-8 w-8 rounded flex items-center justify-center shrink-0 ${cfg.bgClass}`}>
                      <Icon className={`h-4 w-4 ${cfg.colorClass}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold text-foreground truncate">{node.label}</p>
                      <p className="text-[9px] text-muted-foreground truncate">
                        {node.config.event as string || node.config.segment as string || node.config.template as string || node.config.rule as string || cfg.desc}
                      </p>
                    </div>
                    {isSelected && (
                      <button
                        onClick={e => { e.stopPropagation(); deleteNode(node.id) }}
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-sm hover:bg-destructive/90 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  {/* Input port */}
                  <div
                    className={`absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 border-border bg-card cursor-pointer hover:border-primary hover:bg-primary/20 transition-colors ${
                      connecting ? 'border-primary bg-primary/20 animate-pulse' : ''
                    }`}
                    onClick={e => { e.stopPropagation(); handlePortClick(node.id, 'in') }}
                  />
                  {/* Output port */}
                  <div
                    className={`absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full border-2 bg-card cursor-pointer hover:border-primary hover:bg-primary/20 transition-colors ${
                      isConnectingFrom ? 'border-primary bg-primary animate-pulse' : 'border-border'
                    }`}
                    onClick={e => { e.stopPropagation(); handlePortClick(node.id, 'out') }}
                  />
                </div>
              )
            })}

            {/* Empty state */}
            {nodes.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <Settings2 className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground/40">从左侧面板拖拽节点到画布开始配置策略</p>
                </div>
              </div>
            )}

            {/* Connecting hint */}
            {connecting && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-primary/90 text-primary-foreground text-[11px] px-3 py-1 rounded-full shadow-lg">
                点击目标节点的左侧端口完成连线 · <button onClick={() => setConnecting(null)} className="underline">取消</button>
              </div>
            )}
          </div>

          {/* Right: Properties Panel */}
          <div className="w-64 border-l border-border bg-secondary/10 overflow-y-auto shrink-0">
            {selectedNodeData ? (
              <div className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-foreground">节点配置</p>
                  <button
                    onClick={() => deleteNode(selectedNodeData.id)}
                    className="text-[10px] text-destructive hover:text-destructive/80 flex items-center gap-0.5 transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                    删除
                  </button>
                </div>
                <NodeProperties
                  node={selectedNodeData}
                  onChange={config => updateNodeConfig(selectedNodeData.id, config)}
                />
              </div>
            ) : (
              <div className="p-4 flex flex-col items-center justify-center h-full text-center">
                <Settings2 className="h-8 w-8 text-muted-foreground/20 mb-2" />
                <p className="text-xs text-muted-foreground">点击画布上的节点</p>
                <p className="text-xs text-muted-foreground">查看和编辑配置</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="border-t border-border px-4 py-2 flex items-center justify-between text-[10px] text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>{nodes.length} 个节点</span>
            <span>{edges.length} 条连线</span>
            <span>类型: {stratType === 'automated' ? '全自动' : stratType === 'manual' ? '半自动' : '混合式'}</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-success" />
            <span>画布自动保存</span>
          </div>
        </div>
      </div>
    </div>
  )
}
