import SlideLayout from '../components/SlideLayout'
import { summaryData } from '../data/slideContent'

export default function Slide15Summary() {
  return (
    <SlideLayout pageNumber={15} title={summaryData.title}>
      <div className="flex flex-col h-full justify-center items-center text-center gap-8">
        {/* Core statement */}
        <div className="max-w-2xl pres-animate-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-base leading-relaxed" style={{ color: 'var(--pres-text-secondary)' }}>
            {summaryData.coreStatement}
          </p>
        </div>

        {/* Win-win */}
        <div className="grid grid-cols-2 gap-6 w-full max-w-xl pres-animate-up" style={{ animationDelay: '0.4s' }}>
          {/* Customer */}
          <div className="pres-card text-center">
            <div className="text-sm font-semibold mb-3" style={{ color: 'var(--pres-accent)' }}>
              {summaryData.winWin.customer.label}
            </div>
            <div className="space-y-1.5">
              {summaryData.winWin.customer.items.map((item, i) => (
                <div key={i} className="text-xs" style={{ color: 'var(--pres-text-secondary)' }}>{item}</div>
              ))}
            </div>
          </div>
          {/* Company */}
          <div className="pres-card text-center">
            <div className="text-sm font-semibold mb-3" style={{ color: 'var(--pres-gold)' }}>
              {summaryData.winWin.company.label}
            </div>
            <div className="space-y-1.5">
              {summaryData.winWin.company.items.map((item, i) => (
                <div key={i} className="text-xs" style={{ color: 'var(--pres-text-secondary)' }}>{item}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Support needed */}
        <div className="pres-animate-up w-full max-w-xl" style={{ animationDelay: '0.6s' }}>
          <div className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--pres-text-dim)' }}>需要的支持</div>
          <div className="grid grid-cols-4 gap-3">
            {summaryData.support.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-xs font-semibold" style={{ color: 'var(--pres-text)' }}>{s.title}</div>
                <div className="text-[10px] mt-0.5" style={{ color: 'var(--pres-text-dim)' }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing */}
        <div className="pres-animate-scale" style={{ animationDelay: '0.8s' }}>
          <h2 className="text-3xl font-bold pres-gradient-text">{summaryData.closing}</h2>
        </div>
      </div>
    </SlideLayout>
  )
}
