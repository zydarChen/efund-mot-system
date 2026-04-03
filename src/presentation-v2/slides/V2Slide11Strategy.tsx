import SlideLayout from '@/presentation/components/SlideLayout'
import { v2StrategyData, V2_TOTAL_SLIDES } from '../data/v2SlideContent'

export default function V2Slide11Strategy() {
  const d = v2StrategyData
  return (
    <SlideLayout title={d.title} pageNumber={11} totalSlides={V2_TOTAL_SLIDES}>
      <div className="grid grid-cols-2 gap-4 h-full">
        {/* Strategy Center */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold pres-animate-up" style={{ color: 'var(--pres-accent)' }}>
            策略中心 · {d.strategyCenter.subtitle}
          </h3>
          <div className="space-y-2 pres-stagger flex-1">
            {d.strategyCenter.features.map((f, i) => (
              <div key={i} className="pres-card pres-animate-up py-3">
                <h4 className="text-xs font-bold mb-1" style={{ color: 'var(--pres-text)' }}>{f.title}</h4>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--pres-text-secondary)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="pres-card pres-animate-up py-2" style={{ animationDelay: '0.4s' }}>
            <div className="grid grid-cols-3 gap-2">
              {d.strategyCenter.modules.map((m, i) => (
                <div key={i} className="text-center">
                  <p className="text-xs font-bold" style={{ color: 'var(--pres-text)' }}>{m.name}</p>
                  <div className="flex flex-wrap justify-center gap-1 mt-1">
                    {m.features.slice(0, 2).map((f, fi) => (
                      <span key={fi} className="rounded px-1.5 py-0.5 text-[10px]"
                        style={{ background: 'rgba(47,197,231,0.06)', color: 'var(--pres-text-dim)' }}>{f}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strategy Mining */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold pres-animate-up" style={{ color: 'var(--pres-accent)', animationDelay: '0.1s' }}>
            策略挖掘 · {d.mining.subtitle}
          </h3>
          <div className="grid grid-cols-2 gap-2 flex-1 pres-stagger">
            {d.mining.dimensions.map((dim, i) => (
              <div key={i} className="pres-card pres-animate-up flex flex-col items-center justify-center text-center py-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                  style={{ background: 'rgba(47,197,231,0.1)' }}>
                  <span className="text-lg font-bold pres-gradient-text">{i + 1}</span>
                </div>
                <p className="text-sm font-bold" style={{ color: 'var(--pres-text)' }}>{dim}</p>
              </div>
            ))}
          </div>
          <div className="pres-card pres-card-highlight pres-animate-up text-center py-3" style={{ animationDelay: '0.5s' }}>
            <p className="text-xs" style={{ color: 'var(--pres-accent)' }}>↓ {d.mining.note}</p>
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
