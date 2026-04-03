import SlideLayout from '@/presentation/components/SlideLayout'
import { v2AdvantagesData, V2_TOTAL_SLIDES } from '../data/v2SlideContent'

export default function V2Slide05Advantages() {
  const d = v2AdvantagesData
  return (
    <SlideLayout title={d.title} pageNumber={5} totalSlides={V2_TOTAL_SLIDES}>
      <div className="grid grid-cols-2 gap-4 h-full">
        {/* Touchpoint coverage */}
        <div className="pres-card pres-animate-up flex flex-col">
          <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--pres-accent)' }}>{d.touchpoints.title}</h3>
          <p className="text-xs mb-3" style={{ color: 'var(--pres-text-secondary)' }}>{d.touchpoints.desc}</p>

          <div className="space-y-3 flex-1">
            <div>
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--pres-text-dim)' }}>自建域内</p>
              <div className="flex flex-wrap gap-2">
                {d.touchpoints.internal.map((t, i) => (
                  <span key={i} className="rounded-full px-3 py-1 text-xs" style={{ background: 'rgba(47,197,231,0.12)', color: 'var(--pres-accent)' }}>{t}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--pres-text-dim)' }}>外部域外</p>
              <div className="flex flex-wrap gap-2">
                {d.touchpoints.external.map((t, i) => (
                  <span key={i} className="rounded-full px-3 py-1 text-xs" style={{ background: 'rgba(0,80,150,0.15)', color: 'var(--pres-primary, #005096)' }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2 mt-3 pt-3" style={{ borderTop: '1px solid rgba(47,197,231,0.12)' }}>
            {d.touchpoints.values.map((v, i) => (
              <span key={i} className="text-xs" style={{ color: 'var(--pres-text-dim)' }}>{v}</span>
            ))}
          </div>
        </div>

        {/* Data advantage */}
        <div className="flex flex-col gap-4">
          <div className="pres-card pres-animate-up flex-1" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--pres-accent)' }}>{d.data.title}</h3>
            <p className="text-xs mb-4" style={{ color: 'var(--pres-text-secondary)' }}>{d.data.desc}</p>
            <div className="grid grid-cols-2 gap-2">
              {d.data.items.map((item, i) => (
                <div key={i} className="rounded-lg px-3 py-3 text-center" style={{ background: 'rgba(47,197,231,0.06)' }}>
                  <p className="text-xs font-medium" style={{ color: 'var(--pres-text)' }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pres-card pres-card-highlight pres-animate-up" style={{ animationDelay: '0.4s' }}>
            <p className="text-xs font-medium leading-relaxed" style={{ color: 'var(--pres-accent)' }}>
              {d.conclusion}
            </p>
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
