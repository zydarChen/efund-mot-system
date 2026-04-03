import SlideLayout from '@/presentation/components/SlideLayout'
import { v2VisionData, V2_TOTAL_SLIDES } from '../data/v2SlideContent'

export default function V2Slide04Vision() {
  const d = v2VisionData
  return (
    <SlideLayout title={d.title} subtitle={d.subtitle} pageNumber={4} totalSlides={V2_TOTAL_SLIDES}>
      <div className="flex flex-col gap-4 h-full">
        {/* Before → After */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center pres-animate-up">
          {/* Traditional */}
          <div className="pres-card text-center">
            <p className="text-xs mb-1" style={{ color: 'var(--pres-text-dim)' }}>{d.traditional.label}</p>
            <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--pres-text-secondary)' }}>{d.traditional.title}</h3>
            <p className="text-xs" style={{ color: 'var(--pres-text-dim)' }}>{d.traditional.desc}</p>
          </div>

          {/* Arrow */}
          <div className="text-center">
            <span className="pres-gradient-text text-3xl font-bold">→</span>
          </div>

          {/* Target */}
          <div className="pres-card pres-card-highlight text-center">
            <p className="text-xs mb-1" style={{ color: 'var(--pres-accent)' }}>{d.target.label}</p>
            <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--pres-accent)' }}>{d.target.title}</h3>
            <p className="text-xs" style={{ color: 'var(--pres-text-secondary)' }}>{d.target.desc}</p>
          </div>
        </div>

        {/* Four pillars */}
        <div className="grid grid-cols-4 gap-3 flex-1 pres-stagger">
          {d.pillars.map((p, i) => (
            <div key={i} className="pres-card pres-animate-up flex flex-col">
              <span className="text-xs rounded-full px-2 py-0.5 self-start mb-2"
                style={{ background: 'rgba(47,197,231,0.12)', color: 'var(--pres-accent)' }}>{p.tag}</span>
              <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--pres-text)' }}>{p.title}</h4>
              <p className="text-xs leading-relaxed flex-1" style={{ color: 'var(--pres-text-secondary)' }}>{p.desc}</p>
              <p className="text-xs font-medium mt-2 pt-2" style={{ color: 'var(--pres-accent)', borderTop: '1px solid rgba(47,197,231,0.12)' }}>{p.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </SlideLayout>
  )
}
