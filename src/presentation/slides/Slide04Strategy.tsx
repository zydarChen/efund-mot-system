import SlideLayout from '../components/SlideLayout'
import { strategyData } from '../data/slideContent'

export default function Slide04Strategy() {
  return (
    <SlideLayout title={strategyData.title} pageNumber={4}>
      <div className="grid grid-cols-2 gap-8 h-full">
        {/* Left: Three directions */}
        <div className="flex flex-col justify-center pres-stagger">
          <div className="text-xs uppercase tracking-wider mb-4 pres-animate-up" style={{ color: 'var(--pres-text-dim)' }}>
            零售业务战略方向
          </div>
          <div className="space-y-4">
            {strategyData.directions.map((d, i) => (
              <div
                key={i}
                className={`pres-card pres-animate-right flex items-center gap-4 ${d.highlight ? 'pres-card-highlight' : ''}`}
                style={{ animationDelay: `${0.15 * (i + 1)}s` }}
              >
                <div
                  className="w-2 h-12 rounded-full flex-shrink-0"
                  style={{ background: d.highlight ? 'var(--pres-accent)' : 'rgba(148,163,184,0.3)' }}
                />
                <div>
                  <div className="font-semibold" style={{ color: d.highlight ? 'var(--pres-accent)' : 'var(--pres-text)' }}>
                    {d.title}
                    {d.highlight && <span className="text-xs ml-2 opacity-60">← 我们的主战场</span>}
                  </div>
                  <div className="text-sm mt-0.5" style={{ color: 'var(--pres-text-secondary)' }}>{d.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Mission */}
        <div className="flex flex-col justify-center pres-animate-up" style={{ animationDelay: '0.5s' }}>
          <div className="pres-card">
            <div className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--pres-accent)' }}>金科使命</div>
            <p className="text-sm mb-1" style={{ color: 'var(--pres-text-secondary)' }}>{strategyData.mission.role}</p>
            <p className="text-sm mb-6" style={{ color: 'var(--pres-text-secondary)' }}>{strategyData.mission.core}</p>
            <div className="space-y-3">
              {strategyData.keyPoints.map((p, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <span style={{ color: 'var(--pres-accent)' }}>&#x25B6;</span>
                  <span style={{ color: 'var(--pres-text)' }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
