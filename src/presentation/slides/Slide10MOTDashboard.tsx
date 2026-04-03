import SlideLayout from '../components/SlideLayout'
import { motDashboardData } from '../data/slideContent'

export default function Slide10MOTDashboard() {
  return (
    <SlideLayout title={motDashboardData.title} pageNumber={10}>
      <div className="flex flex-col h-full gap-5">
        {/* Features row */}
        <div className="grid grid-cols-3 gap-4 pres-stagger">
          {motDashboardData.features.map((f, i) => (
            <div key={i} className="pres-card pres-animate-up" style={{ animationDelay: `${0.15 * (i + 1)}s` }}>
              <h3 className="font-semibold text-sm mb-2" style={{ color: 'var(--pres-accent)' }}>{f.title}</h3>
              <p className="text-xs mb-2" style={{ color: 'var(--pres-text-secondary)' }}>{f.desc}</p>
              {'example' in f && f.example && (
                <div className="text-[11px] py-1.5 px-2 rounded" style={{ background: 'rgba(47,197,231,0.06)', color: 'var(--pres-text-dim)' }}>
                  {f.example}
                </div>
              )}
              {'columns' in f && f.columns && (
                <div className="grid grid-cols-3 gap-1.5 mt-2">
                  {f.columns.map((col, ci) => (
                    <div key={ci} className="text-center py-2 rounded" style={{ background: 'rgba(47,197,231,0.06)' }}>
                      <div className="text-[10px] font-semibold" style={{ color: 'var(--pres-accent)' }}>{col.name}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: 'var(--pres-text-dim)' }}>{col.detail}</div>
                    </div>
                  ))}
                </div>
              )}
              {'statuses' in f && f.statuses && (
                <div className="flex gap-1.5 mt-2">
                  {f.statuses.map((s, si) => (
                    <span key={si} className="text-[10px] px-2 py-0.5 rounded-full" style={{
                      background: si === 0 ? 'rgba(16,185,129,0.15)' : si === 1 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)',
                      color: si === 0 ? '#10B981' : si === 1 ? '#F59E0B' : '#EF4444',
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4 mt-auto pres-stagger">
          {motDashboardData.kpis.map((kpi, i) => (
            <div key={i} className="pres-card pres-animate-scale text-center py-3" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
              <div className="text-2xl font-bold pres-gradient-text">{kpi.value}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--pres-text-secondary)' }}>{kpi.label}</div>
              {'extra' in kpi && kpi.extra && (
                <div className="text-[10px] mt-0.5" style={{ color: 'var(--pres-text-dim)' }}>{kpi.extra}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </SlideLayout>
  )
}
