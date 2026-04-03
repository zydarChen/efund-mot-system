import SlideLayout from '@/presentation/components/SlideLayout'
import { v2PrototypeData, V2_TOTAL_SLIDES } from '../data/v2SlideContent'

export default function V2Slide13Prototype() {
  const d = v2PrototypeData
  return (
    <SlideLayout title={d.title} pageNumber={13} totalSlides={V2_TOTAL_SLIDES}>
      <div className="flex flex-col gap-4 h-full">
        {/* Status badge */}
        <div className="pres-animate-up flex items-center gap-2">
          <span className="rounded-full px-3 py-1 text-xs font-bold"
            style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>
            {d.status}
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 pres-animate-up" style={{ animationDelay: '0.15s' }}>
          {d.stats.map((s, i) => (
            <div key={i} className="pres-card text-center py-3">
              <p className="text-lg font-black" style={{ color: 'var(--pres-accent)' }}>{s.value}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--pres-text-secondary)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Screenshots */}
        <div className="grid grid-cols-4 gap-3 flex-1 pres-animate-up" style={{ animationDelay: '0.3s' }}>
          {d.screenshots.map((sc, i) => (
            <div key={i} className="pres-card flex flex-col items-center justify-center py-4 gap-2">
              <div className="h-12 w-12 rounded-lg flex items-center justify-center text-lg"
                style={{ background: 'rgba(47,197,231,0.08)', color: 'var(--pres-accent)' }}>
                {['📊', '🧠', '👤', '🎯'][i]}
              </div>
              <p className="text-xs font-bold" style={{ color: 'var(--pres-text)' }}>{sc.label}</p>
              <p className="text-[10px]" style={{ color: 'var(--pres-text-dim)' }}>{sc.key}</p>
            </div>
          ))}
        </div>
      </div>
    </SlideLayout>
  )
}
