import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

interface SidebarContextType {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  toggle: () => void
}

const SidebarContext = createContext<SidebarContextType>({
  collapsed: false,
  setCollapsed: () => {},
  toggle: () => {},
})

export function SidebarProvider({ children }: { children: ReactNode }) {
  // 14寸笔记本（<=1440px）默认折叠侧边栏
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('mot-sidebar-collapsed')
    if (saved !== null) return saved === 'true'
    return window.innerWidth <= 1440
  })

  const toggle = useCallback(() => {
    setCollapsed(prev => {
      const next = !prev
      localStorage.setItem('mot-sidebar-collapsed', String(next))
      return next
    })
  }, [])

  const handleSetCollapsed = useCallback((v: boolean) => {
    setCollapsed(v)
    localStorage.setItem('mot-sidebar-collapsed', String(v))
  }, [])

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1366 && !collapsed) {
        handleSetCollapsed(true)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [collapsed, handleSetCollapsed])

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed: handleSetCollapsed, toggle }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  return useContext(SidebarContext)
}
