import SlideLayout from '@/presentation/components/SlideLayout'
import { v2StrategicConclusionData, V2_TOTAL_SLIDES } from '../data/v2SlideContent'

export default function V2Slide07StrategicConclusion() {
  const d = v2StrategicConclusionData
  return (
    <SlideLayout title={d.title} pageNumber={7} totalSlides={V2_TOTAL_SLIDES}>
      <div className="flex flex-col gap-4 h-full">
        {/* Core conclusion */}
        <div className="pres-card pres-card-highlight pres-animate-up text-center py-6">
          {d.conclusion.map((line, i) => (
            <p key={i} className="text-base leading-loose" style={{ color: 'var(--pres-text)' }}>{line}</p>
          ))}
        </div>

        {/* Value cards */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-stretch flex-1">
          <div className="pres-card pres-animate-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-sm font-bold mb-3 text-center" style={{ color: 'var(--pres-accent)' }}>{d.customerValue.title}</h3>
            <div className="space-y-2">
              {d.customerValue.items.map((item, i) => (
                <div key={i} className="rounded-lg px-3 py-2 text-center" style={{ background: 'rgba(47,197,231,0.06)' }}>
                  <p className="text-xs" style={{ color: 'var(--pres-text-secondary)' }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <div className="text-center">
              <p className="text-2xl font-bold pres-gradient-text">+</p>
              <p className="text-xs mt-1" style={{ color: 'var(--pres-text-dim)' }}>双赢</p>
            </div>
          </div>

          <div className="pres-card pres-animate-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-sm font-bold mb-3 text-center" style={{ color: 'var(--pres-gold, #D4A017)' }}>{d.enterpriseValue.title}</h3>
            <div className="space-y-2">
              {d.enterpriseValue.items.map((item, i) => (
                <div key={i} className="rounded-lg px-3 py-2 text-center" style={{ background: 'rgba(212,160,23,0.06)' }}>
                  <p className="text-xs" style={{ color: 'var(--pres-text-secondary)' }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strategic drivers */}
        <div className="flex justify-center gap-3 pres-animate-up" style={{ animationDelay: '0.5s' }}>
          <span className="text-xs" style={{ color: 'var(--pres-text-dim)' }}>战略驱动力:</span>
          {d.drivers.map((driver, i) => (
            <span key={i} className="rounded-full px-3 py-1 text-xs" style={{ background: 'rgba(47,197,231,0.08)', color: 'var(--pres-text-secondary)' }}>{driver}</span>
          ))}
        </div>
      </div>
    </SlideLayout>
  )
}
