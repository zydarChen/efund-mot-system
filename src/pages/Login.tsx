import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import loginBg from '@/assets/login-bg.png'
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Shield,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

export default function Login() {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { if (isAuthenticated) navigate('/', { replace: true }) }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('请输入账号和密码')
      return
    }

    setIsLoading(true)

    // 模拟网络请求延迟
    await new Promise(r => setTimeout(r, 800))

    const result = await login(username, password)
    if (!result.success) {
      setError(result.error || '登录失败')
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 背景 */}
      <div className="absolute inset-0">
        <img
          src={loginBg}
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(207,85%,15%)/0.85] via-[hsl(222,44%,7%)/0.75] to-[hsl(191,78%,20%)/0.70]" />
      </div>

      {/* 装饰光效 */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/8 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

      {/* 登录卡片 */}
      <div className={`relative z-10 w-full max-w-[420px] mx-4 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        {/* Logo 区域 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20 mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            易方达 VMOT
          </h1>
          <p className="text-sm text-white/50 mt-1.5">
            客户高价值服务管理系统
          </p>
          <p className="text-xs text-white/30 mt-2 tracking-widest">
            科学化客户服务，每一个关键时刻，让服务触达客户内心
          </p>
        </div>

        {/* 表单卡片 */}
        <div className="backdrop-blur-xl bg-white/[0.07] border border-white/[0.12] rounded-2xl p-8 shadow-2xl shadow-black/20">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">登录系统</h2>
            <p className="text-xs text-white/40 mt-1">请输入管理员账号和密码</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 账号 */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-white/60 uppercase tracking-wider">
                账号
              </label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError('') }}
                  placeholder="请输入账号"
                  autoComplete="username"
                  className="w-full h-11 rounded-lg border border-white/[0.12] bg-white/[0.06] pl-10 pr-4 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-primary/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>
            </div>

            {/* 密码 */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-white/60 uppercase tracking-wider">
                密码
              </label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 group-focus-within:text-primary transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  placeholder="请输入密码"
                  autoComplete="current-password"
                  className="w-full h-11 rounded-lg border border-white/[0.12] bg-white/[0.06] pl-10 pr-11 text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-primary/50 focus:bg-white/[0.08] focus:ring-1 focus:ring-primary/30 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-destructive/15 border border-destructive/20 animate-fade-in">
                <div className="h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
                <p className="text-xs text-destructive font-medium">{error}</p>
              </div>
            )}

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full h-11 rounded-lg bg-gradient-to-r from-primary to-[hsl(207,85%,48%)] text-white font-medium text-sm shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none disabled:shadow-none overflow-hidden"
            >
              {/* 光效 */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

              <span className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                      <path d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" fill="currentColor" className="opacity-75" />
                    </svg>
                    登录中...
                  </>
                ) : (
                  <>
                    登录
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* 分隔线 */}
          <div className="mt-6 pt-5 border-t border-white/[0.08]">
            <div className="flex items-center justify-between text-[10px] text-white/25">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" />
                <span>AI 驱动的客户服务管理平台</span>
              </div>
              <span>v2.0</span>
            </div>
          </div>
        </div>

        {/* 底部信息 */}
        <p className="text-center text-[10px] text-white/20 mt-6">
          易方达基金管理有限公司 &copy; 2026
        </p>
      </div>
    </div>
  )
}
