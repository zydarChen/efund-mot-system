import SlideLayout from '@/presentation/components/SlideLayout'
import { v2CSPDData, V2_TOTAL_SLIDES } from '../data/v2SlideContent'

export default function V2Slide09CSDP() {
  const d = v2CSPDData
  return (
    <SlideLayout title={d.title} subtitle={d.subtitle} pageNumber={9} totalSlides={V2_TOTAL_SLIDES}>
      <div className="flex flex-col gap-3 h-full">
        {/* Positioning */}
        <div className="pres-card pres-card-highlight pres-animate-up text-center py-3">
          <p className="text-xs" style={{ color: 'var(--pres-text-secondary)' }}>{d.positioning}</p>
          <p className="text-xs font-bold mt-1" style={{ color: 'var(--pres-accent)' }}>{d.coreValue}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 flex-1">
          {/* Left: Modules */}
          <div className="space-y-2 pres-stagger">
            {d.modules.map((m, i) => (
              <div key={i} className="pres-card pres-animate-up py-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: 'rgba(0,80,150,0.2)', color: 'var(--pres-primary, #005096)' }}>{m.num}</span>
                  <div>
                    <h4 className="text-sm font-bold" style={{ color: 'var(--pres-text)' }}>{m.name}</h4>
                    <p className="text-xs" style={{ color: 'var(--pres-text-secondary)' }}>{m.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: 13 dimensions + segments */}
          <div className="flex flex-col gap-2">
            <div className="pres-card pres-animate-up flex-1" style={{ animationDelay: '0.2s' }}>
              <h4 className="text-xs font-bold mb-2" style={{ color: 'var(--pres-accent)' }}>360度客户画像 · 13维度</h4>
              <div className="flex flex-wrap gap-1.5">
                {d.dimensions.flat().map((dim, i) => (
                  <span key={i} className="rounded px-2 py-1 text-xs"
                    style={{ background: 'rgba(47,197,231,0.06)', color: 'var(--pres-text-secondary)' }}>{dim}</span>
                ))}
              </div>
            </div>

            <div className="pres-card pres-animate-up" style={{ animationDelay: '0.3s' }}>
              <h4 className="text-xs font-bold mb-2" style={{ color: 'var(--pres-accent)' }}>3大客群</h4>
              <div className="space-y-1.5">
                {d.segments.map((seg, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ background: seg.color }} />
                    <span className="text-xs flex-1" style={{ color: 'var(--pres-text-secondary)' }}>{seg.name}</span>
                    <span className="text-sm font-bold" style={{ color: seg.color }}>{seg.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-2">
              {d.kpis.map((kpi, i) => (
                <div key={i} className="pres-card pres-animate-up text-center py-2" style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
                  <p className="text-base font-bold pres-gradient-text">{kpi.value}</p>
                  <p className="text-xs" style={{ color: 'var(--pres-text-dim)' }}>{kpi.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
