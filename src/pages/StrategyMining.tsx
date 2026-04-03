import { useLocation, useNavigate } from 'react-router-dom'
import { MessageSquareHeart, TrendingUp, Newspaper, BarChart3 } from 'lucide-react'
import VoiceOfCustomer from './VoiceOfCustomer'
import MarketSentiment from './MarketSentiment'
import PolicyChanges from './PolicyChanges'
import MarketAnalysis from './MarketAnalysis'

const tabs = [
  { key: 'voice', label: '客户之声', icon: MessageSquareHeart },
  { key: 'sentiment', label: '市场舆情', icon: TrendingUp },
  { key: 'policy', label: '政策变化', icon: Newspaper },
  { key: 'market', label: '行情分析', icon: BarChart3 },
] as const

type TabKey = (typeof tabs)[number]['key']

const validKeys = new Set<string>(tabs.map(t => t.key))

export default function StrategyMining() {
  const location = useLocation()
  const navigate = useNavigate()

  const segments = location.pathname.split('/')
  const raw = segments[2] || 'voice'
  const activeTab: TabKey = validKeys.has(raw) ? (raw as TabKey) : 'voice'

  return (
    <div className="space-y-0">
      {/* 顶部 Tab 导航 */}
      <div className="flex items-center gap-1 border-b border-border mb-5">
        {tabs.map(tab => {
          const Icon = tab.icon
          const active = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => navigate(`/strategy-mining/${tab.key}`)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                active
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* 子页面内容 */}
      {activeTab === 'voice' && <VoiceOfCustomer />}
      {activeTab === 'sentiment' && <MarketSentiment />}
      {activeTab === 'policy' && <PolicyChanges />}
      {activeTab === 'market' && <MarketAnalysis />}
    </div>
  )
}
