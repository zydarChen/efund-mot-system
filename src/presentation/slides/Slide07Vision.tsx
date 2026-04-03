import SlideLayout from '../components/SlideLayout'
import KPICard from '../components/KPICard'
import { visionData } from '../data/slideContent'

export default function Slide07Vision() {
  return (
    <SlideLayout title={visionData.title} pageNumber={7}>
      <div className="flex flex-col h-full gap-6">
        {/* Comparison */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-6 items-center pres-animate-up" style={{ animationDelay: '0.2s' }}>
          {/* Traditional */}
          <div className="pres-card" style={{ opacity: 0.6 }}>
            <div className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--pres-text-dim)' }}>
              {visionData.traditional.label}
            </div>
            <div className="space-y-2">
              {visionData.traditional.steps.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--pres-text-secondary)' }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0" style={{ background: 'rgba(148,163,184,0.2)' }}>{i + 1}</span>
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="pres-animate-scale flex flex-col items-center" style={{ animationDelay: '0.4s' }}>
            <div className="text-3xl pres-gradient-text font-bold">&#x2192;</div>
          </div>

          {/* VMOT */}
          <div className="pres-card pres-card-highlight">
            <div className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--pres-accent)' }}>
              {visionData.vmot.label}
            </div>
            <div className="space-y-2">
              {visionData.vmot.steps.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-sm" style={{ color: 'var(--pres-text)' }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0" style={{ background: 'var(--pres-accent)', color: '#0D1B2A' }}>{i + 1}</span>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Concept */}
        <div className="text-center pres-animate-in" style={{ animationDelay: '0.5s' }}>
          <span className="text-sm font-semibold pres-gradient-text">{visionData.concept}</span>
          <p className="text-xs mt-1" style={{ color: 'var(--pres-text-dim)' }}>{visionData.conceptDesc}</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4">
          {visionData.kpis.map((kpi, i) => (
            <KPICard key={i} value={kpi.value} label={kpi.label} from={kpi.from} to={kpi.to} delay={0.6 + i * 0.1} />
          ))}
        </div>
      </div>
    </SlideLayout>
  )
}
