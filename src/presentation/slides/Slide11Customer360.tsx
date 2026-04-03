import SlideLayout from '../components/SlideLayout'
import { customer360Data } from '../data/slideContent'

export default function Slide11Customer360() {
  return (
    <SlideLayout title={customer360Data.title} pageNumber={11}>
      <div className="flex flex-col h-full gap-5">
        {/* 13 Dimensions grid */}
        <div className="pres-animate-up" style={{ animationDelay: '0.2s' }}>
          <div className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--pres-accent)' }}>
            13维度全景分析
          </div>
          <div className="space-y-2">
            {customer360Data.dimensions.map((row, ri) => (
              <div key={ri} className="grid grid-cols-4 gap-2">
                {row.map((dim, di) => (
                  <div key={di} className="text-xs text-center py-2 px-2 rounded" style={{ background: 'var(--pres-card)', border: '1px solid var(--pres-card-border)', color: 'var(--pres-text-secondary)' }}>
                    {dim}
                  </div>
                ))}
              </div>
            ))}
            <div className="text-xs text-center" style={{ color: 'var(--pres-text-dim)' }}>{customer360Data.extra}</div>
          </div>
        </div>

        {/* Segments */}
        <div className="pres-animate-up" style={{ animationDelay: '0.4s' }}>
          <div className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--pres-accent)' }}>3大客群</div>
          <div className="grid grid-cols-3 gap-3">
            {customer360Data.segments.map((seg, i) => (
              <div key={i} className="pres-card flex items-center gap-3 py-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: seg.color }} />
                <div>
                  <span className="text-sm font-semibold" style={{ color: 'var(--pres-text)' }}>{seg.name}</span>
                  <span className="text-lg font-bold ml-2" style={{ color: seg.color }}>{seg.pct}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mining */}
        <div className="pres-animate-up" style={{ animationDelay: '0.6s' }}>
          <div className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--pres-accent)' }}>策略挖掘 — 四维度外部感知</div>
          <div className="grid grid-cols-4 gap-3">
            {customer360Data.mining.map((m, i) => (
              <div key={i} className="pres-card text-center py-3">
                <div className="text-sm font-semibold mb-1" style={{ color: 'var(--pres-text)' }}>{m.title}</div>
                <div className="text-[10px]" style={{ color: 'var(--pres-text-dim)' }}>{m.sources}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-2 text-xs" style={{ color: 'var(--pres-accent)' }}>
            &#x2193; {customer360Data.miningResult}
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
