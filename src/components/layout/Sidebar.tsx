import { useState, useEffect } from 'react'
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useSidebar } from '@/contexts/SidebarContext'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Zap,
  Target,
  BarChart3,
  ChevronLeft,
  ChevronDown,
  Bell,
  Search,
  Settings,
  X,
  Sun,
  Moon,
  Send,
  Layers,
  Compass,
  Play,
  Radio,
  FileEdit,
  Shield,
  Activity,
  Sliders,
  Presentation,
  Workflow,
} from 'lucide-react'

// 导航组
interface NavItem {
  path: string
  label: string
  icon: React.ElementType
  tab?: string          // 附加 ?tab= 参数
  children?: NavItem[]
}

const navItems: NavItem[] = [
  { path: '/', label: 'MOT总览', icon: LayoutDashboard },
  { path: '/customers', label: '客户360', icon: Users },
  {
    path: '/strategy-center',
    label: '策略中心',
    icon: Target,
    children: [
      { path: '/strategy-mining', label: '策略挖掘', icon: Compass },
      { path: '/strategy-center', label: '策略管理', icon: Layers, tab: 'management' },
      { path: '/strategy-center', label: '策略模拟', icon: Play, tab: 'simulation' },
    ],
  },
  {
    path: '/channel-center',
    label: '触达中心',
    icon: Send,
    children: [
      { path: '/channel-center', label: '渠道管理', icon: Radio, tab: 'channels' },
      { path: '/channel-center', label: '内容工厂', icon: FileEdit, tab: 'content' },
      { path: '/channel-center', label: '消息管控', icon: Shield, tab: 'control' },
      { path: '/channel-center', label: '链路追踪', icon: Activity, tab: 'tracking' },
    ],
  },
  {
    path: '/settings',
    label: '系统设置',
    icon: Settings,
    children: [
      { path: '/settings', label: '基础设置', icon: Sliders, tab: 'basic' },
      { path: '/settings', label: '合规风控', icon: Shield, tab: 'compliance' },
      { path: '/settings', label: '数据统计', icon: BarChart3, tab: 'statistics' },
      { path: '/settings', label: '业务逻辑', icon: Workflow, tab: 'logic' },
      { path: '/settings', label: '演示说明', icon: Presentation, tab: 'demo' },
    ],
  },
]

// 扁平化所有路径用于搜索
const flatItems = navItems.flatMap(item =>
  item.children ? [item, ...item.children] : [item]
)

export default function Sidebar() {
  const { collapsed, toggle } = useSidebar()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedGroup, setExpandedGroup] = useState<string | null>('/strategy-center')
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const currentTab = searchParams.get('tab')

  // 自动展开包含当前路由的组
  useEffect(() => {
    for (const item of navItems) {
      if (item.children?.some(c => location.pathname === c.path || location.pathname.startsWith(c.path + '/'))) {
        setExpandedGroup(item.path)
        break
      }
    }
  }, [location.pathname])

  const isChildActive = (child: NavItem) => {
    if (child.tab) {
      if (location.pathname !== child.path) return false
      if (currentTab) return currentTab === child.tab
      const parent = navItems.find(p => p.children?.includes(child))
      return parent?.children?.[0] === child
    }
    return location.pathname === child.path || location.pathname.startsWith(child.path + '/')
  }
  const isActive = (path: string) => location.pathname === path
  const isGroupActive = (item: NavItem) =>
    item.children?.some(c => isChildActive(c)) ?? (location.pathname === item.path)

  // 搜索过滤
  const filteredItems = searchQuery.trim()
    ? navItems
        .map(item => {
          if (item.children) {
            const filtered = item.children.filter(c =>
              c.label.toLowerCase().includes(searchQuery.toLowerCase())
            )
            if (filtered.length > 0) return { ...item, children: filtered }
            if (item.label.toLowerCase().includes(searchQuery.toLowerCase())) return item
            return null
          }
          return item.label.toLowerCase().includes(searchQuery.toLowerCase()) ? item : null
        })
        .filter(Boolean) as NavItem[]
    : navItems

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border transition-all duration-200',
        collapsed ? 'w-[56px]' : 'w-[200px]'
      )}
      style={{ background: 'var(--gradient-sidebar)' }}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-2.5 border-b border-sidebar-border',
        collapsed ? 'h-10 justify-center px-2' : 'h-12 px-3'
      )}>
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/90">
          <Zap className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="animate-fade-in overflow-hidden">
            <h1 className="text-[13px] font-bold gradient-text-logo whitespace-nowrap leading-tight">易方达 VMOT</h1>
            <p className="text-[8px] text-sidebar-foreground/50 whitespace-nowrap leading-tight">每一个关键时刻，让服务触达客户内心</p>
          </div>
        )}
      </div>

      {/* 菜单搜索 */}
      {!collapsed && (
        <div className="px-2 py-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="搜索菜单..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-7 w-full rounded border border-sidebar-border bg-sidebar pl-7 pr-6 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-1">
        <div className="space-y-0.5">
          {filteredItems.map((item) => {
            const Icon = item.icon

            // 有子菜单的组
            if (item.children) {
              const groupActive = isGroupActive(item)
              const isExpanded = expandedGroup === item.path || searchQuery.trim() !== ''
              return (
                <div key={item.path} className="mb-1">
                  {/* Group header */}
                  <button
                    onClick={() => {
                      if (collapsed) return
                      setExpandedGroup(isExpanded ? null : item.path)
                    }}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      'group flex w-full items-center gap-2.5 rounded px-2 py-1.5 text-[13px] font-medium transition-colors duration-150',
                      groupActive
                        ? 'bg-primary/12 text-primary'
                        : 'text-sidebar-foreground hover:bg-secondary/60 hover:text-foreground'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4 shrink-0 transition-colors',
                        groupActive ? 'text-primary' : 'text-sidebar-foreground group-hover:text-foreground'
                      )}
                    />
                    {!collapsed && (
                      <>
                        <span className="flex-1 whitespace-nowrap text-left">{item.label}</span>
                        <ChevronDown className={cn(
                          'h-3 w-3 text-muted-foreground/50 transition-transform duration-200',
                          isExpanded && 'rotate-180'
                        )} />
                      </>
                    )}
                  </button>

                  {/* Sub items */}
                  {!collapsed && isExpanded && (
                    <div className="mt-0.5 ml-4 space-y-0.5 animate-fade-in">
                      {item.children.map((child, ci) => {
                        const ChildIcon = child.icon
                        const childActive = isChildActive(child)
                        const childKey = child.tab ? `${child.path}?tab=${child.tab}` : child.path
                        return (
                          <button
                            key={childKey}
                            onClick={() => navigate(child.tab ? `${child.path}?tab=${child.tab}` : child.path)}
                            className={cn(
                              'group flex w-full items-center gap-2 rounded px-2 py-1.5 text-[12px] font-medium transition-colors duration-150',
                              childActive
                                ? 'bg-primary/12 text-primary'
                                : 'text-sidebar-foreground hover:bg-secondary/60 hover:text-foreground'
                            )}
                          >
                            <ChildIcon
                              className={cn(
                                'h-3.5 w-3.5 shrink-0 transition-colors',
                                childActive ? 'text-primary' : 'text-sidebar-foreground group-hover:text-foreground'
                              )}
                            />
                            <span className="whitespace-nowrap">{child.label}</span>
                            {childActive && (
                              <div className="ml-auto h-1 w-1 rounded-full bg-primary" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            // 普通菜单项
            const active = isActive(item.path)
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                title={collapsed ? item.label : undefined}
                className={cn(
                  'group flex w-full items-center gap-2.5 rounded px-2 py-1.5 text-[13px] font-medium transition-colors duration-150',
                  active
                    ? 'bg-primary/12 text-primary'
                    : 'text-sidebar-foreground hover:bg-secondary/60 hover:text-foreground'
                )}
              >
                <Icon
                  className={cn(
                    'h-4 w-4 shrink-0 transition-colors',
                    active ? 'text-primary' : 'text-sidebar-foreground group-hover:text-foreground'
                  )}
                />
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                {active && !collapsed && (
                  <div className="ml-auto h-1 w-1 rounded-full bg-primary" />
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-sidebar-border p-2">
        {!collapsed && (
          <div className="mb-1.5 flex items-center gap-1.5 rounded bg-success/8 px-2 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-[11px] text-success/80">系统运行正常</span>
          </div>
        )}
        <button
          onClick={() => toggle()}
          className="flex w-full items-center justify-center rounded py-1.5 text-sidebar-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
        >
          <ChevronLeft className={cn('h-3.5 w-3.5 transition-transform duration-200', collapsed && 'rotate-180')} />
        </button>
      </div>
    </aside>
  )
}

/* ========== 顶栏 ========== */
export function TopBar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  )
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, title: '新MOT任务触发', desc: '客户李娜大额赎回预警', time: '5分钟前', read: false },
    { id: 2, title: '策略执行完成', desc: '"市场大跌安抚"策略已批量执行', time: '15分钟前', read: false },
    { id: 3, title: '合规告警', desc: '检测到承诺收益话术，需人工审核', time: '1小时前', read: false },
    { id: 4, title: '系统更新', desc: 'AI模型已更新至最新版本', time: '2小时前', read: true },
  ])

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('mot-theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('mot-theme', 'light')
    }
  }, [isDark])

  // 点击外部关闭下拉
  useEffect(() => {
    const handler = () => { setShowNotifications(false); setShowUserMenu(false); setShowSearchResults(false) }
    if (showNotifications || showUserMenu || showSearchResults) {
      setTimeout(() => document.addEventListener('click', handler), 0)
      return () => document.removeEventListener('click', handler)
    }
  }, [showNotifications, showUserMenu, showSearchResults])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = (e: React.MouseEvent) => {
    e.stopPropagation()
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const searchResults = searchQuery.trim() ? [
    { label: '客户: 张建国', path: '/customers' },
    { label: '规则: 大额赎回预警', path: '/' },
    { label: '策略: 市场大跌安抚策略', path: '/strategy-center' },
  ].filter(r => r.label.includes(searchQuery)) : []

  return (
    <header className="sticky top-0 z-30 flex h-10 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索客户、规则、策略..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setShowSearchResults(true) }}
            onFocus={() => searchQuery && setShowSearchResults(true)}
            className="h-7 w-56 rounded border border-border bg-secondary/50 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary/50 focus:outline-none transition-colors"
          />
          {showSearchResults && searchQuery.trim() && (
            <div className="absolute top-8 left-0 w-72 rounded-lg border border-border bg-card shadow-lg z-50" onClick={e => e.stopPropagation()}>
              {searchResults.length > 0 ? searchResults.map(r => (
                <button key={r.label} onClick={() => { navigate(r.path); setSearchQuery(''); setShowSearchResults(false) }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-secondary/50 transition-colors first:rounded-t-lg last:rounded-b-lg">
                  <Search className="h-3 w-3 text-muted-foreground" />
                  {r.label}
                </button>
              )) : (
                <div className="px-3 py-4 text-center text-xs text-muted-foreground">未找到 "{searchQuery}" 相关结果</div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-1 rounded bg-success/8 px-2 py-0.5 mr-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] text-success/80 font-medium">实时连接</span>
        </div>
        <button
          onClick={() => setIsDark(prev => !prev)}
          className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          title={isDark ? '切换到浅色模式' : '切换到深色模式'}
        >
          {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
        </button>
        {/* 通知 */}
        <div className="relative">
          <button
            onClick={e => { e.stopPropagation(); setShowNotifications(prev => !prev); setShowUserMenu(false) }}
            className="relative flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Bell className="h-3.5 w-3.5" />
            {unreadCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[8px] font-bold text-destructive-foreground">{unreadCount}</span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 top-8 w-80 rounded-lg border border-border bg-card shadow-lg z-50" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                <span className="text-xs font-semibold text-foreground">通知中心</span>
                <button onClick={markAllRead} className="text-[10px] text-primary hover:text-primary/80 transition-colors">全部已读</button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.map(n => (
                  <button key={n.id} onClick={() => setNotifications(prev => prev.map(nn => nn.id === n.id ? { ...nn, read: true } : nn))}
                    className={`flex w-full items-start gap-2.5 px-3 py-2.5 text-left transition-colors hover:bg-secondary/50 ${!n.read ? 'bg-primary/4' : ''}`}>
                    <div className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${!n.read ? 'bg-primary' : 'bg-transparent'}`} />
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs ${!n.read ? 'font-semibold text-foreground' : 'text-foreground/80'}`}>{n.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{n.desc}</p>
                      <p className="text-[9px] text-muted-foreground/60 mt-0.5">{n.time}</p>
                    </div>
                  </button>
                ))}
              </div>
              <div className="border-t border-border px-3 py-2">
                <button onClick={() => { setShowNotifications(false); navigate('/settings') }}
                  className="w-full text-center text-[10px] text-primary hover:text-primary/80 transition-colors">
                  查看全部通知
                </button>
              </div>
            </div>
          )}
        </div>
        {/* 设置 */}
        <button
          onClick={() => navigate('/settings')}
          className="flex h-7 w-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          title="系统设置"
        >
          <Settings className="h-3.5 w-3.5" />
        </button>
        {/* 用户菜单 */}
        <div className="relative">
          <button
            onClick={e => { e.stopPropagation(); setShowUserMenu(prev => !prev); setShowNotifications(false) }}
            className="ml-1 flex h-6 w-6 items-center justify-center rounded bg-primary/90 text-[10px] font-medium text-primary-foreground hover:bg-primary transition-colors cursor-pointer"
          >
            管
          </button>
          {showUserMenu && (
            <div className="absolute right-0 top-8 w-48 rounded-lg border border-border bg-card shadow-lg z-50" onClick={e => e.stopPropagation()}>
              <div className="px-3 py-2.5 border-b border-border">
                <p className="text-xs font-semibold text-foreground">{user?.displayName || '管理员'}</p>
                <p className="text-[10px] text-muted-foreground">{user?.username || 'admin'}@efunds.com</p>
              </div>
              <div className="py-1">
                <button onClick={() => { setShowUserMenu(false); navigate('/settings') }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-foreground hover:bg-secondary/50 transition-colors">
                  <Settings className="h-3 w-3 text-muted-foreground" />
                  系统设置
                </button>
                <button onClick={() => { setShowUserMenu(false) }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-foreground hover:bg-secondary/50 transition-colors">
                  <Bell className="h-3 w-3 text-muted-foreground" />
                  通知偏好
                </button>
                <div className="my-1 border-t border-border" />
                <button onClick={() => { setShowUserMenu(false); logout(); navigate('/login') }}
                  className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/5 transition-colors">
                  <X className="h-3 w-3" />
                  退出登录
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
