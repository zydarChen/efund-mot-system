import SlideLayout from '@/presentation/components/SlideLayout'
import { v2RoadmapData, V2_TOTAL_SLIDES } from '../data/v2SlideContent'

export default function V2Slide14Roadmap() {
  const d = v2RoadmapData
  return (
    <SlideLayout title={d.title} pageNumber={14} totalSlides={V2_TOTAL_SLIDES}>
      <div className="flex flex-col gap-4 h-full">
        {/* Demo items */}
        <div className="pres-animate-up">
          <h4 className="text-xs font-bold mb-2" style={{ color: 'var(--pres-accent)' }}>方案演示环节</h4>
          <div className="flex gap-3">
            {d.demos.map((dm, i) => (
              <div key={i} className="pres-card flex-1 py-3 text-center">
                <p className="text-xs font-bold" style={{ color: 'var(--pres-text)' }}>{dm}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Phases timeline */}
        <div className="pres-animate-up flex-1" style={{ animationDelay: '0.15s' }}>
          <h4 className="text-xs font-bold mb-3" style={{ color: 'var(--pres-accent)' }}>实施阶段规划</h4>
          <div className="flex gap-3">
            {d.phases.map((phase, i) => (
              <div key={i} className="pres-card flex-1 py-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1"
                  style={{ background: i === 0 ? 'var(--pres-accent)' : 'rgba(47,197,231,0.2)' }} />
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded"
                    style={{ background: 'rgba(47,197,231,0.1)', color: 'var(--pres-accent)' }}>
                    {phase.name}
                  </span>
                  <span className="text-[10px]" style={{ color: 'var(--pres-text-dim)' }}>{phase.time}</span>
                </div>
                <p className="text-sm font-bold mb-2" style={{ color: 'var(--pres-text)' }}>{phase.title}</p>
                <p className="text-[10px] leading-relaxed" style={{ color: 'var(--pres-text-secondary)' }}>{phase.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: principles + risks */}
        <div className="grid grid-cols-2 gap-3 pres-animate-up" style={{ animationDelay: '0.3s' }}>
          <div className="pres-card py-3">
            <h5 className="text-xs font-bold mb-2" style={{ color: 'var(--pres-accent)' }}>实施原则</h5>
            <div className="space-y-1">
              {d.principles.map((p, i) => (
                <p key={i} className="text-[10px]" style={{ color: 'var(--pres-text-secondary)' }}>{p}</p>
              ))}
            </div>
          </div>
          <div className="pres-card py-3">
            <h5 className="text-xs font-bold mb-2" style={{ color: '#F59E0B' }}>风险管控</h5>
            <div className="space-y-1">
              {d.risks.map((r, i) => (
                <p key={i} className="text-[10px]" style={{ color: 'var(--pres-text-secondary)' }}>{r}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
