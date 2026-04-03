import SlideLayout from '../components/SlideLayout'
import { prototypeData } from '../data/slideContent'

export default function Slide13Prototype() {
  return (
    <SlideLayout title={prototypeData.title} pageNumber={13}>
      <div className="flex flex-col h-full gap-6">
        {/* Screenshots grid */}
        <div className="grid grid-cols-2 gap-4 flex-1 pres-stagger">
          {prototypeData.screenshots.map((ss, i) => (
            <div key={i} className="pres-card pres-animate-scale overflow-hidden" style={{ animationDelay: `${0.15 * (i + 1)}s` }}>
              <div className="aspect-[16/9] rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(0,80,150,0.2), rgba(47,197,231,0.1))' }}>
                <div className="text-center">
                  <div className="text-sm font-semibold mb-1" style={{ color: 'var(--pres-accent)' }}>{ss.label}</div>
                  <div className="text-[10px]" style={{ color: 'var(--pres-text-dim)' }}>系统截图</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="pres-animate-up" style={{ animationDelay: '0.7s' }}>
          <div className="pres-card pres-card-highlight py-3">
            <div className="flex items-center justify-center gap-6 mb-2">
              <span className="text-sm font-semibold" style={{ color: '#10B981' }}>&#x2713; {prototypeData.status}</span>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {prototypeData.stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-sm font-bold" style={{ color: 'var(--pres-accent)' }}>{s.value}</div>
                  <div className="text-[10px]" style={{ color: 'var(--pres-text-dim)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
