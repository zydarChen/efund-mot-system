import SlideLayout from '@/presentation/components/SlideLayout'
import { v2ContributionsData, V2_TOTAL_SLIDES } from '../data/v2SlideContent'

export default function V2Slide03Contributions() {
  const d = v2ContributionsData
  return (
    <SlideLayout title={d.title} pageNumber={3} totalSlides={V2_TOTAL_SLIDES}>
      <div className="flex flex-col gap-4 h-full">
        {/* Achievement cards */}
        <div className="grid grid-cols-4 gap-3 pres-stagger">
          {d.achievements.map((a, i) => (
            <div key={i} className="pres-card pres-animate-up">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'var(--pres-accent)', color: 'var(--pres-bg-from, #0D1B2A)' }}>{a.num}</span>
                <h4 className="text-sm font-bold" style={{ color: 'var(--pres-text)' }}>{a.title}</h4>
              </div>
              <p className="text-xs" style={{ color: 'var(--pres-text-secondary)' }}>{a.desc}</p>
            </div>
          ))}
        </div>

        {/* Touchpoints */}
        <div className="pres-card pres-animate-up" style={{ animationDelay: '0.5s' }}>
          <h4 className="text-xs font-bold mb-3" style={{ color: 'var(--pres-text-dim)' }}>已建设服务触点</h4>
          <div className="flex gap-3">
            {d.touchpoints.map((t, i) => (
              <span key={i} className="rounded-full px-4 py-1.5 text-xs" style={{ background: 'rgba(47,197,231,0.1)', color: 'var(--pres-accent)' }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Vision + Quote */}
        <div className="flex-1 flex flex-col items-center justify-center text-center pres-animate-up" style={{ animationDelay: '0.6s' }}>
          <p className="text-base font-bold mb-2" style={{ color: 'var(--pres-gold, #D4A017)' }}>
            "{d.vision}"
          </p>
          <p className="text-xs italic" style={{ color: 'var(--pres-text-dim)' }}>
            {d.quote}
          </p>
        </div>
      </div>
    </SlideLayout>
  )
}
