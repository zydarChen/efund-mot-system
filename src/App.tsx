import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { SidebarProvider } from '@/contexts/SidebarContext'
import AppLayout from '@/components/layout/AppLayout'
import Login from '@/pages/Login'
import MOTOverview from '@/pages/MOTOverview'
import CustomersPage from '@/pages/Customers'
import StrategyCenter from '@/pages/StrategyCenter'
import ChannelCenter from '@/pages/ChannelCenter'
import StrategyMining from '@/pages/StrategyMining'
import SystemSettings from '@/pages/SystemSettings'
import PresentationPage from '@/presentation/PresentationPage'

function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return null
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/presentation" element={<PresentationPage />} />
            <Route element={<RequireAuth />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<MOTOverview />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/strategy-center" element={<StrategyCenter />} />
                <Route path="/channel-center" element={<ChannelCenter />} />
                <Route path="/strategy-mining/*" element={<StrategyMining />} />
                <Route path="/settings" element={<SystemSettings />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </AuthProvider>
  )
}

export default App
