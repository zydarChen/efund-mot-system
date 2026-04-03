import SlideLayout from '@/presentation/components/SlideLayout'
import { v2VMOTData, V2_TOTAL_SLIDES } from '../data/v2SlideContent'

export default function V2Slide10VMOT() {
  const d = v2VMOTData
  return (
    <SlideLayout title={d.title} subtitle={d.subtitle} pageNumber={10} totalSlides={V2_TOTAL_SLIDES}>
      <div className="flex flex-col gap-3 h-full">
        {/* Positioning + MOT quote */}
        <div className="grid grid-cols-2 gap-3 pres-animate-up">
          <div className="pres-card pres-card-highlight py-3">
            <p className="text-xs mb-2" style={{ color: 'var(--pres-text-secondary)' }}>{d.positioning}</p>
            <p className="text-xs font-bold" style={{ color: 'var(--pres-accent)' }}>{d.coreIdea}</p>
          </div>
          <div className="pres-card py-3">
            <p className="text-xs italic mb-2" style={{ color: 'var(--pres-text-secondary)' }}>"{d.motQuote.text}"</p>
            <p className="text-xs text-right" style={{ color: 'var(--pres-text-dim)' }}>{d.motQuote.author}</p>
          </div>
        </div>

        {/* MOT Peaks */}
        <div className="flex justify-center gap-6 pres-animate-up" style={{ animationDelay: '0.2s' }}>
          {d.motPeaks.map((peak, i) => (
            <div key={i} className="text-center">
              <div className="w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-1"
                style={{ background: i === 1 ? 'rgba(47,197,231,0.2)' : 'rgba(47,197,231,0.08)', border: i === 1 ? '2px solid var(--pres-accent)' : '1px solid rgba(47,197,231,0.2)' }}>
                <span className="text-xs font-bold" style={{ color: 'var(--pres-accent)' }}>{i + 1}</span>
              </div>
              <p className="text-xs" style={{ color: 'var(--pres-text-secondary)' }}>{peak}</p>
            </div>
          ))}
        </div>

        {/* Modules */}
        <div className="grid grid-cols-4 gap-2 pres-stagger">
          {d.modules.map((m, i) => (
            <div key={i} className="pres-card pres-animate-up py-3">
              <span className="text-lg font-bold pres-gradient-text">{m.num}</span>
              <h4 className="text-xs font-bold mt-1 mb-1" style={{ color: 'var(--pres-text)' }}>{m.name}</h4>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--pres-text-secondary)' }}>{m.desc}</p>
            </div>
          ))}
        </div>

        {/* Scenarios + System KPIs */}
        <div className="grid grid-cols-2 gap-3">
          <div className="pres-card pres-animate-up" style={{ animationDelay: '0.5s' }}>
            <h4 className="text-xs font-bold mb-2" style={{ color: 'var(--pres-text-dim)' }}>典型应用场景</h4>
            <div className="flex flex-wrap gap-2">
              {d.scenarios.map((s, i) => (
                <span key={i} className="rounded-full px-3 py-1 text-xs" style={{ background: 'rgba(47,197,231,0.1)', color: 'var(--pres-accent)' }}>{s}</span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {d.systemKpis.map((kpi, i) => (
              <div key={i} className="pres-card pres-animate-up text-center py-2" style={{ animationDelay: `${0.5 + i * 0.1}s` }}>
                <p className="text-base font-bold pres-gradient-text">{kpi.value}</p>
                <p className="text-xs" style={{ color: 'var(--pres-text-dim)' }}>{kpi.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
