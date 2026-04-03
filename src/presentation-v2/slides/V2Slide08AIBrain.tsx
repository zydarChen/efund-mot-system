import SlideLayout from '@/presentation/components/SlideLayout'
import { v2AIBrainData, V2_TOTAL_SLIDES } from '../data/v2SlideContent'

const colorMap = {
  primary: { bg: 'rgba(0,80,150,0.15)', text: 'var(--pres-primary, #005096)', border: '#005096' },
  accent: { bg: 'rgba(47,197,231,0.12)', text: 'var(--pres-accent)', border: '#2FC5E7' },
  gold: { bg: 'rgba(212,160,23,0.12)', text: 'var(--pres-gold, #D4A017)', border: '#D4A017' },
}

export default function V2Slide08AIBrain() {
  const d = v2AIBrainData
  return (
    <SlideLayout title={d.title} pageNumber={8} totalSlides={V2_TOTAL_SLIDES}>
      <div className="flex flex-col items-center justify-center h-full gap-6">
        {/* Brain diagram */}
        <div className="relative w-[50%] aspect-square max-w-[320px] pres-animate-scale">
          {/* Outer ring */}
          <div className="absolute inset-0 pres-glow-ring" />
          {/* Middle ring */}
          <div className="absolute inset-[15%] rounded-full border-2 border-dashed" style={{ borderColor: 'rgba(47,197,231,0.2)' }} />
          {/* Inner circle */}
          <div className="absolute inset-[30%] rounded-full flex items-center justify-center" style={{ background: 'rgba(47,197,231,0.08)' }}>
            <span className="pres-gradient-text text-2xl font-bold">AI 大脑</span>
          </div>
        </div>

        {/* Organ cards */}
        <div className="grid grid-cols-3 gap-4 w-full pres-stagger">
          {d.organs.map((organ, i) => {
            const c = colorMap[organ.color]
            return (
              <div key={i} className="pres-card pres-animate-up" style={{ borderColor: c.border, borderWidth: '1px' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: c.bg, color: c.text }}>
                    {organ.system.charAt(0)}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold" style={{ color: c.text }}>{organ.name}</h4>
                    <p className="text-xs" style={{ color: 'var(--pres-text-dim)' }}>{organ.system}</p>
                  </div>
                </div>
                <p className="text-xs mb-2" style={{ color: 'var(--pres-text-secondary)' }}>{organ.role}</p>
                <p className="text-xs italic" style={{ color: c.text }}>→ {organ.meaning}</p>
              </div>
            )
          })}
        </div>
      </div>
    </SlideLayout>
  )
}
