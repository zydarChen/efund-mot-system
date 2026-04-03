// AI MOT 策略推荐模块 - 策略挖掘页面共享组件
import { useState } from 'react'
import {
  Brain, ChevronDown, ChevronUp, CheckCircle2, Zap, Users,
  Send, TrendingUp, ArrowRight, Sparkles, X, Clock,
} from 'lucide-react'

export interface MOTRecommendation {
  id: string
  title: string
  description: string
  triggerCondition: string
  expectedEffect: string
  confidence: number
  targetSegment: string
  channels: string[]
  strategyType: 'automated' | 'manual' | 'hybrid'
  source: string
  priority: 'high' | 'medium' | 'low'
}

interface MOTRecommendationPanelProps {
  title?: string
  recommendations: MOTRecommendation[]
  onAdopt?: (rec: MOTRecommendation) => void
}

const typeLabels: Record<string, { label: string; class: string }> = {
  automated: { label: '全自动', class: 'bg-primary/12 text-primary' },
  manual: { label: '半自动', class: 'bg-warning/12 text-[hsl(var(--warning))]' },
  hybrid: { label: '混合式', class: 'bg-accent/12 text-accent' },
}

const priorityConfig: Record<string, { label: string; class: string }> = {
  high: { label: '高优先', class: 'bg-destructive/10 text-destructive' },
  medium: { label: '中优先', class: 'bg-warning/10 text-[hsl(var(--warning))]' },
  low: { label: '低优先', class: 'bg-success/10 text-success' },
}

export default function MOTRecommendationPanel({ title = 'AI 策略推荐', recommendations, onAdopt }: MOTRecommendationPanelProps) {
  const [expandedId, setExpandedId] = useState<string | null>(recommendations[0]?.id ?? null)
  const [adoptedIds, setAdoptedIds] = useState<Set<string>>(new Set())
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())

  const visibleRecs = recommendations.filter(r => !dismissedIds.has(r.id))

  const handleAdopt = (rec: MOTRecommendation) => {
    setAdoptedIds(prev => new Set(prev).add(rec.id))
    onAdopt?.(rec)
  }

  if (visibleRecs.length === 0) return null

  return (
    <div className="rounded-xl border border-primary/20 bg-gradient-to-b from-primary/[0.03] to-accent/[0.03] p-3 space-y-3">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary/12 flex items-center justify-center shrink-0">
            <Brain className="h-3.5 w-3.5 text-primary" />
          </div>
          <h3 className="text-xs font-bold text-foreground flex items-center gap-1">
            {title}
            <Sparkles className="h-3 w-3 text-primary shrink-0" />
          </h3>
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground">
            AI 挖掘 {visibleRecs.length} 条建议
          </p>
          <div className="flex items-center gap-1 rounded bg-primary/8 px-1.5 py-0.5">
            <Zap className="h-2.5 w-2.5 text-primary" />
            <span className="text-[9px] text-primary font-medium">AI v2.1</span>
          </div>
        </div>
      </div>

      {/* Recommendation Cards */}
      <div className="space-y-2">
        {visibleRecs.map(rec => {
          const isExpanded = expandedId === rec.id
          const isAdopted = adoptedIds.has(rec.id)
          const typeInfo = typeLabels[rec.strategyType]
          const prioInfo = priorityConfig[rec.priority]

          return (
            <div
              key={rec.id}
              className={`rounded-lg border bg-card transition-all duration-200 ${
                isAdopted ? 'border-success/30 bg-success/[0.03]' : 'border-border hover:border-primary/20 hover:shadow-sm'
              }`}
            >
              {/* Card Header - 适配侧边栏的纵向布局 */}
              <div
                className="px-3 py-2.5 cursor-pointer space-y-2"
                onClick={() => setExpandedId(isExpanded ? null : rec.id)}
              >
                {/* Row 1: 置信度 + 标题 + 展开箭头 */}
                <div className="flex items-center gap-2">
                  <div className="relative h-8 w-8 shrink-0">
                    <svg className="h-8 w-8 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                      <circle
                        cx="18" cy="18" r="14" fill="none"
                        stroke={rec.confidence >= 80 ? 'hsl(var(--success))' : rec.confidence >= 60 ? 'hsl(var(--primary))' : 'hsl(var(--warning))'}
                        strokeWidth="3"
                        strokeDasharray={`${rec.confidence * 0.88} 100`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-foreground">
                      {rec.confidence}%
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-foreground flex-1 min-w-0 line-clamp-2 leading-tight">{rec.title}</span>
                  {isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                </div>

                {/* Row 2: 标签 */}
                <div className="flex items-center gap-1 flex-wrap">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${typeInfo.class}`}>
                    {typeInfo.label}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${prioInfo.class}`}>
                    {prioInfo.label}
                  </span>
                  {isAdopted && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium bg-success/12 text-success flex items-center gap-0.5">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      已采纳
                    </span>
                  )}
                </div>

                {/* Row 3: 描述 */}
                <p className="text-[10px] text-muted-foreground leading-relaxed">{rec.description}</p>

                {/* Row 4: 操作按钮 */}
                {!isAdopted && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={e => { e.stopPropagation(); handleAdopt(rec) }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-primary text-primary-foreground text-[10px] font-medium hover:bg-primary/90 transition-colors"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      确认采纳
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); setDismissedIds(prev => new Set(prev).add(rec.id)) }}
                      className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Expanded Details - 适配侧边栏的单列布局 */}
              {isExpanded && (
                <div className="border-t border-border px-3 py-3 space-y-3 bg-secondary/10 animate-fade-in">
                  <div className="space-y-2.5">
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-1">触发条件</p>
                      <div className="flex items-start gap-1.5">
                        <Zap className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                        <p className="text-[11px] text-foreground leading-relaxed">{rec.triggerCondition}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <p className="text-[10px] text-muted-foreground mb-1">目标客群</p>
                        <div className="flex items-start gap-1.5">
                          <Users className="h-3 w-3 text-accent shrink-0 mt-0.5" />
                          <p className="text-[11px] text-foreground">{rec.targetSegment}</p>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] text-muted-foreground mb-1">数据来源</p>
                        <p className="text-[11px] text-foreground/70">{rec.source}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground mb-1">预期效果</p>
                      <div className="flex items-start gap-1.5">
                        <TrendingUp className="h-3 w-3 text-success shrink-0 mt-0.5" />
                        <p className="text-[11px] text-foreground leading-relaxed">{rec.expectedEffect}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] text-muted-foreground mb-1">推荐渠道</p>
                    <div className="flex flex-wrap gap-1">
                      {rec.channels.map(ch => (
                        <span key={ch} className="text-[9px] px-1.5 py-0.5 rounded bg-secondary text-foreground/70 flex items-center gap-0.5">
                          <Send className="h-2.5 w-2.5" />
                          {ch}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Flow preview - 自动换行 */}
                  <div className="flex flex-wrap items-center gap-1.5 p-2 rounded bg-secondary/30">
                    {['触发条件', '客户筛选', rec.strategyType === 'manual' ? '人工分配' : '渠道路由', '内容配置', '效果追踪'].map((step, i, arr) => (
                      <div key={step} className="flex items-center gap-1.5">
                        <div className="text-[9px] px-1.5 py-0.5 rounded bg-card border border-border text-foreground/70 font-medium whitespace-nowrap">
                          {step}
                        </div>
                        {i < arr.length - 1 && <ArrowRight className="h-2.5 w-2.5 text-muted-foreground/30 shrink-0" />}
                      </div>
                    ))}
                  </div>

                  {isAdopted && (
                    <div className="flex items-start gap-2 p-2 rounded bg-success/8 border border-success/20">
                      <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
                      <p className="text-[10px] text-success font-medium leading-relaxed">
                        策略已采纳，将在策略中心创建草稿
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ===== 各页面专用推荐数据 ===== */

export const voiceRecommendations: MOTRecommendation[] = [
  {
    id: 'vr1', title: '客诉情绪主动安抚策略', description: '基于客户之声情绪分析，识别高频投诉话题并主动触达安抚',
    triggerCondition: '客户在蚂蚁财富/天天基金等平台发布负面评论 ≥ 2条', expectedEffect: '预估降低投诉率18%，提升满意度12%',
    confidence: 87, targetSegment: '活跃型客户', channels: ['APP推送', '客服电话'], strategyType: 'hybrid', source: '客户之声情绪分析', priority: 'high',
  },
  {
    id: 'vr2', title: '产品体验优化触达策略', description: '针对"赎回流程复杂"等高频反馈，主动推送操作引导',
    triggerCondition: '同一主题客户反馈 ≥ 50条/周', expectedEffect: '预估减少同类咨询量35%',
    confidence: 78, targetSegment: '新手型客户', channels: ['APP推送', '公众号'], strategyType: 'automated', source: '客户反馈聚类分析', priority: 'medium',
  },
  {
    id: 'vr3', title: '竞品优势沟通策略', description: '针对客户提及竞品优势的反馈，主动沟通我方差异化价值',
    triggerCondition: '客户提及竞品对比类话题', expectedEffect: '预估提升客户留存率8%',
    confidence: 65, targetSegment: '价值型客户', channels: ['专属客服', '邮件'], strategyType: 'manual', source: '竞品话题分析', priority: 'low',
  },
]

export const sentimentRecommendations: MOTRecommendation[] = [
  {
    id: 'sr1', title: '舆情危机主动响应策略', description: '当负面舆情热度突增时，主动触达受影响客户进行安抚沟通',
    triggerCondition: '负面舆情热度 ≥ 80 且涉及我方产品/基金经理', expectedEffect: '预估降低恐慌性赎回量25%',
    confidence: 92, targetSegment: '全部持仓客户', channels: ['APP推送', '短信', '客服电话'], strategyType: 'hybrid', source: '市场舆情实时监控', priority: 'high',
  },
  {
    id: 'sr2', title: '基金经理变更安抚策略', description: '基金经理变更相关舆情出现时，主动向持仓客户发送说明与建议',
    triggerCondition: '基金经理变更类舆情出现且热度 ≥ 60', expectedEffect: '预估降低变更期赎回率40%',
    confidence: 85, targetSegment: '对应基金持仓客户', channels: ['APP推送', '邮件', '短信'], strategyType: 'automated', source: '舆情-持仓关联分析', priority: 'high',
  },
  {
    id: 'sr3', title: '正面舆情营销策略', description: '利用正面市场情绪，推送相关产品营销内容',
    triggerCondition: '正面舆情热度 ≥ 70 且涉及我方强势领域', expectedEffect: '预估提升新客转化率15%',
    confidence: 72, targetSegment: '潜在客户', channels: ['公众号', 'APP推送'], strategyType: 'automated', source: '正面舆情机会识别', priority: 'medium',
  },
]

export const policyRecommendations: MOTRecommendation[] = [
  {
    id: 'pr1', title: '个人养老金扩容营销策略', description: '个人养老金全国推广政策落地后，主动触达目标客户推广养老产品',
    triggerCondition: '个人养老金政策扩容生效', expectedEffect: '预估养老产品规模增长20%',
    confidence: 90, targetSegment: '30-55岁客户', channels: ['APP推送', '短信', '公众号', '易服务小程序'], strategyType: 'automated', source: '政策变化影响分析', priority: 'high',
  },
  {
    id: 'pr2', title: '费率改革客户沟通策略', description: '基金费率改革政策实施后，主动向客户说明费率变化及收益影响',
    triggerCondition: '费率改革政策正式生效', expectedEffect: '预估减少费率相关咨询量60%',
    confidence: 83, targetSegment: '全部持仓客户', channels: ['APP推送', '邮件'], strategyType: 'automated', source: '政策影响评估', priority: 'medium',
  },
  {
    id: 'pr3', title: '合规风险预警策略', description: '新监管要求下，对可能受影响的业务进行合规预警和客户通知',
    triggerCondition: '新销售适当性管理规定实施', expectedEffect: '预估合规风险降低85%',
    confidence: 95, targetSegment: '高风险偏好客户', channels: ['APP推送', '短信', '客服电话'], strategyType: 'hybrid', source: '监管合规分析', priority: 'high',
  },
]

export const marketRecommendations: MOTRecommendation[] = [
  {
    id: 'mr1', title: '市场急跌客户安抚策略', description: '大盘急跌时，智能触达持仓受损客户，发送个性化安抚与建议',
    triggerCondition: '上证综指单日跌幅 ≥ 2% 或创业板跌幅 ≥ 3%', expectedEffect: '预估降低恐慌性赎回率30%',
    confidence: 94, targetSegment: '权益类持仓客户', channels: ['APP推送', '短信', '专属客服'], strategyType: 'hybrid', source: '行情异动监测', priority: 'high',
  },
  {
    id: 'mr2', title: '板块轮动机会提醒策略', description: '识别板块轮动信号，向对应客户推送机会提醒和配置建议',
    triggerCondition: '板块连续3日涨幅 ≥ 5% 且资金净流入', expectedEffect: '预估提升客户交易转化率22%',
    confidence: 76, targetSegment: '积极交易型客户', channels: ['APP推送', '公众号'], strategyType: 'automated', source: '板块轮动分析', priority: 'medium',
  },
  {
    id: 'mr3', title: '定投加仓建议策略', description: '市场低估值区间，建议定投客户适当加仓',
    triggerCondition: '沪深300市盈率处于近5年20%分位以下', expectedEffect: '预估定投客户AUM增长12%',
    confidence: 81, targetSegment: '定投客户', channels: ['APP推送', '企微消息'], strategyType: 'automated', source: '估值分析模型', priority: 'medium',
  },
]

export const globalInsightRecommendations: MOTRecommendation[] = [
  {
    id: 'gi1', title: '市场下行+客户情绪共振安抚策略', description: '融合行情异动、社区情绪、客户持仓三维数据，识别"市场暴跌+情绪恐慌+持仓亏损"三重叠加的高危客户，分级触达安抚',
    triggerCondition: '大盘跌幅 ≥ 2% 且 社区负面情绪激增 ≥ 50% 且 客户持仓亏损 ≥ 5%', expectedEffect: '预估降低恐慌性赎回率35%，提升客户留存率15%',
    confidence: 91, targetSegment: '高波动持仓且情绪不稳客户', channels: ['APP推送', '客服电话', '专属客服', '短信'], strategyType: 'hybrid', source: '全域洞察 · 行情×舆情×客户360融合', priority: 'high',
  },
  {
    id: 'gi2', title: '政策利好+板块轮动联合营销策略', description: '融合政策变化、板块行情、客户画像三维数据，在利好政策发布且相关板块上涨时，精准识别匹配客户推送营销内容',
    triggerCondition: '利好政策发布 且 相关板块涨幅 ≥ 3% 且 客户画像匹配', expectedEffect: '预估提升产品销售转化率28%，客户AUM增长8%',
    confidence: 84, targetSegment: '画像匹配的存量客户', channels: ['APP推送', '短信', '公众号', '企微消息'], strategyType: 'automated', source: '全域洞察 · 政策×行情×客户画像融合', priority: 'medium',
  },
  {
    id: 'gi3', title: '多因子流失预警综合挽回策略', description: '融合行为沉默、市场行情、服务满意度、投诉记录四维数据，构建多因子流失风险模型，对高风险客户启动专属挽回流程',
    triggerCondition: 'APP沉默 ≥ 14天 且 市场持续下行 ≥ 5日 且 满意度 < 60 且 有投诉记录', expectedEffect: '预估挽回流失客户率45%，减少AUM流失12%',
    confidence: 88, targetSegment: '多因子流失高危客户', channels: ['客服电话', '专属客服', '邮件', 'APP推送'], strategyType: 'manual', source: '全域洞察 · 行为×行情×服务×客户360融合', priority: 'high',
  },
]

// 聚合所有模块推荐，按置信度降序，用于策略中心全域推荐面板
export const allRecommendations: MOTRecommendation[] = [
  ...globalInsightRecommendations,
  voiceRecommendations[0],
  sentimentRecommendations[0],
  policyRecommendations[0],
  marketRecommendations[0],
].sort((a, b) => b.confidence - a.confidence)
