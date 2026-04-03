import SlideLayout from '../components/SlideLayout'
import { roadmapData } from '../data/slideContent'

export default function Slide14Roadmap() {
  return (
    <SlideLayout title={roadmapData.title} pageNumber={14}>
      <div className="flex flex-col h-full justify-center">
        {/* Timeline */}
        <div className="relative pres-animate-up" style={{ animationDelay: '0.2s' }}>
          {/* Timeline line */}
          <div className="absolute top-6 left-0 right-0 h-0.5" style={{ background: 'var(--pres-card-border)' }} />

          <div className="grid grid-cols-5 gap-4 relative">
            {roadmapData.phases.map((phase, i) => {
              const isCompleted = phase.status === 'completed'
              return (
                <div key={i} className="flex flex-col items-center pres-animate-up" style={{ animationDelay: `${0.2 + i * 0.12}s` }}>
                  {/* Node */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold z-10 relative"
                    style={{
                      background: isCompleted ? 'var(--pres-accent)' : 'var(--pres-card)',
                      border: `2px solid ${isCompleted ? 'var(--pres-accent)' : 'var(--pres-card-border)'}`,
                      color: isCompleted ? '#0D1B2A' : 'var(--pres-text-secondary)',
                      boxShadow: isCompleted ? '0 0 20px rgba(47,197,231,0.3)' : 'none',
                    }}
                  >
                    {isCompleted ? '✓' : phase.name.replace('Phase ', 'P')}
                  </div>

                  {/* Content card */}
                  <div className={`mt-4 pres-card w-full text-center ${isCompleted ? 'pres-card-highlight' : ''}`}>
                    <div className="text-sm font-semibold mb-1" style={{ color: isCompleted ? 'var(--pres-accent)' : 'var(--pres-text)' }}>
                      {phase.title}
                    </div>
                    <div className="text-[10px] mb-2" style={{ color: 'var(--pres-text-dim)' }}>
                      {phase.time} | {phase.duration}
                    </div>
                    <div className="space-y-1">
                      {phase.items.map((item, ii) => (
                        <div key={ii} className="text-[10px]" style={{ color: 'var(--pres-text-secondary)' }}>
                          {item}
                        </div>
                      ))}
                    </div>
                    {isCompleted && (
                      <div className="mt-2 text-[10px] font-semibold" style={{ color: '#10B981' }}>已完成 &#x2713;</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
