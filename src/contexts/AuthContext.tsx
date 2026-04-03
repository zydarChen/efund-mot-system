import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { hashSHA256, computeHMAC, verifyHMAC } from '@/lib/crypto'

interface User {
  username: string
  role: string
  displayName: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const EXPECTED_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || ''
const EXPECTED_PWD_HASH = import.meta.env.VITE_ADMIN_PWD_HASH || ''
const SESSION_SECRET = import.meta.env.VITE_SESSION_SECRET || ''
const SESSION_KEY = 'mot_user'

async function writeSession(user: User): Promise<void> {
  const data = JSON.stringify(user)
  const sig = await computeHMAC(data, SESSION_SECRET)
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ data, sig }))
}

async function readSession(): Promise<User | null> {
  const raw = sessionStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    const { data, sig } = JSON.parse(raw)
    if (!data || !sig) return null
    const valid = await verifyHMAC(data, sig, SESSION_SECRET)
    if (!valid) {
      sessionStorage.removeItem(SESSION_KEY)
      return null
    }
    return JSON.parse(data) as User
  } catch {
    sessionStorage.removeItem(SESSION_KEY)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    readSession().then(u => {
      setUser(u)
      setIsLoading(false)
    })
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    if (!EXPECTED_USERNAME || !EXPECTED_PWD_HASH) {
      return { success: false, error: '系统认证未配置，请联系管理员' }
    }
    if (username !== EXPECTED_USERNAME) {
      return { success: false, error: '账号或密码错误' }
    }
    const inputHash = await hashSHA256(password)
    if (inputHash !== EXPECTED_PWD_HASH) {
      return { success: false, error: '账号或密码错误' }
    }
    const u: User = { username, role: 'administrator', displayName: '系统管理员' }
    setUser(u)
    await writeSession(u)
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    sessionStorage.removeItem(SESSION_KEY)
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
