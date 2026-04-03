import SlideLayout from '../components/SlideLayout'
import { overviewData } from '../data/slideContent'

export default function Slide08Overview() {
  return (
    <SlideLayout title={overviewData.title} pageNumber={8}>
      <div className="flex flex-col h-full items-center justify-center gap-8">
        {/* Brain diagram */}
        <div className="relative pres-animate-scale" style={{ animationDelay: '0.2s' }}>
          {/* Outer ring */}
          <div className="w-[280px] h-[280px] pres-glow-ring flex items-center justify-center">
            {/* Inner content */}
            <div className="flex gap-3">
              {/* CSDP */}
              <div className="pres-card w-[110px] text-center py-4">
                <div className="text-lg font-bold pres-gradient-text">{overviewData.brain.left.name}</div>
                <div className="text-[10px] mt-1" style={{ color: 'var(--pres-text-secondary)' }}>{overviewData.brain.left.desc}</div>
                <div className="text-[10px] mt-1" style={{ color: 'var(--pres-text-dim)' }}>({overviewData.brain.left.role})</div>
              </div>
              {/* VMOT */}
              <div className="pres-card pres-card-highlight w-[110px] text-center py-4">
                <div className="text-lg font-bold pres-gradient-text">{overviewData.brain.right.name}</div>
                <div className="text-[10px] mt-1" style={{ color: 'var(--pres-text-secondary)' }}>{overviewData.brain.right.desc}</div>
                <div className="text-[10px] mt-1" style={{ color: 'var(--pres-text-dim)' }}>({overviewData.brain.right.role})</div>
              </div>
            </div>
          </div>
          {/* Label */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full" style={{ background: 'var(--pres-card)', border: '1px solid var(--pres-card-border)', color: 'var(--pres-accent)' }}>
            AI 大脑
          </div>
        </div>

        {/* Connector */}
        <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, var(--pres-accent), transparent)' }} />

        {/* Channels */}
        <div className="pres-animate-up flex items-center gap-3" style={{ animationDelay: '0.5s' }}>
          <span className="text-xs" style={{ color: 'var(--pres-text-dim)' }}>手脚（触点）</span>
          <div className="flex gap-2">
            {overviewData.channels.map((ch, i) => (
              <span key={i} className="text-xs px-3 py-1.5 rounded-full" style={{ background: 'var(--pres-card)', border: '1px solid var(--pres-card-border)', color: 'var(--pres-text-secondary)' }}>
                {ch}
              </span>
            ))}
          </div>
        </div>

        {/* Flow */}
        <div className="pres-animate-up flex items-center gap-2" style={{ animationDelay: '0.7s' }}>
          {overviewData.flow.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="text-center">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-sm font-bold" style={{ background: 'var(--pres-card)', border: '1px solid var(--pres-card-border)', color: 'var(--pres-accent)' }}>
                  {step}
                </div>
                <div className="text-[10px] mt-1 max-w-[80px]" style={{ color: 'var(--pres-text-dim)' }}>
                  {overviewData.flowDesc[i]}
                </div>
              </div>
              {i < overviewData.flow.length - 1 && (
                <span className="text-lg mb-6" style={{ color: 'var(--pres-accent)' }}>&#x2192;</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </SlideLayout>
  )
}
