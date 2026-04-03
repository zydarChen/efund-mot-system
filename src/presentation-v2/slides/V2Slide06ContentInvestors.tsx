import SlideLayout from '@/presentation/components/SlideLayout'
import { v2ContentInvestorsData, V2_TOTAL_SLIDES } from '../data/v2SlideContent'

export default function V2Slide06ContentInvestors() {
  const d = v2ContentInvestorsData
  return (
    <SlideLayout title={d.title} pageNumber={6} totalSlides={V2_TOTAL_SLIDES}>
      <div className="grid grid-cols-2 gap-4 h-full">
        {/* Left: Content carriers */}
        <div className="flex flex-col gap-3">
          <div className="pres-card pres-animate-up flex-1">
            <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--pres-accent)' }}>{d.content.title}</h3>
            <p className="text-xs mb-3" style={{ color: 'var(--pres-text-secondary)' }}>{d.content.desc}</p>
            <div className="grid grid-cols-2 gap-2">
              {d.content.items.map((item, i) => (
                <div key={i} className="rounded-lg px-3 py-3 text-center" style={{ background: 'rgba(47,197,231,0.06)' }}>
                  <p className="text-sm font-bold mb-1" style={{ color: 'var(--pres-text)' }}>{item.name}</p>
                  <p className="text-xs" style={{ color: 'var(--pres-text-dim)' }}>{item.tag}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Drivers */}
          {d.drivers.map((driver, i) => (
            <div key={i} className="pres-card pres-animate-up" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
              <h4 className="text-xs font-bold mb-1" style={{ color: i === 0 ? '#EF4444' : 'var(--pres-gold, #D4A017)' }}>{driver.label}</h4>
              <p className="text-xs" style={{ color: 'var(--pres-text-secondary)' }}>{driver.desc}</p>
            </div>
          ))}
        </div>

        {/* Right: New generation investors */}
        <div className="pres-card pres-animate-up flex flex-col" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--pres-accent)' }}>{d.investors.title}</h3>
          <div className="space-y-3 flex-1">
            {d.investors.traits.map((trait, i) => (
              <div key={i} className="rounded-lg px-4 py-3" style={{ background: 'rgba(47,197,231,0.06)' }}>
                <p className="text-sm font-bold mb-1" style={{ color: 'var(--pres-text)' }}>{trait.label}</p>
                <p className="text-xs" style={{ color: 'var(--pres-text-secondary)' }}>{trait.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs italic mt-3 pt-3 text-center" style={{ color: 'var(--pres-text-dim)', borderTop: '1px solid rgba(47,197,231,0.12)' }}>
            Z世代投资者偏好数字化、社交化的服务体验
          </p>
        </div>
      </div>
    </SlideLayout>
  )
}
