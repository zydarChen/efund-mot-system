import SlideLayout from '@/presentation/components/SlideLayout'
import { v2ChannelData, V2_TOTAL_SLIDES } from '../data/v2SlideContent'

export default function V2Slide12Channel() {
  const d = v2ChannelData
  return (
    <SlideLayout title={d.title} pageNumber={12} totalSlides={V2_TOTAL_SLIDES}>
      <div className="flex flex-col gap-3 h-full">
        {/* Channel table */}
        <div className="pres-card pres-animate-up overflow-hidden py-3">
          <div className="grid grid-cols-6 gap-x-2 text-xs">
            {['渠道', '日均量', '送达率', '打开率', '转化率', '成本'].map((h, i) => (
              <p key={i} className="font-bold pb-2" style={{ color: 'var(--pres-accent)', borderBottom: '1px solid rgba(47,197,231,0.12)' }}>{h}</p>
            ))}
            {d.channels.map((ch, ri) => (
              [ch.name, ch.daily, ch.delivery, ch.open, ch.convert, ch.cost].map((cell, ci) => (
                <p key={`${ri}-${ci}`} className="py-1 text-xs" style={{ color: ci === 0 ? 'var(--pres-text)' : 'var(--pres-text-secondary)' }}>{cell}</p>
              ))
            ))}
          </div>
        </div>

        {/* Trace steps */}
        <div className="pres-animate-up" style={{ animationDelay: '0.2s' }}>
          <h4 className="text-xs font-bold mb-2" style={{ color: 'var(--pres-accent)' }}>全链路追踪（8步闭环）</h4>
          <div className="flex gap-1.5 items-center">
            {d.traceSteps.map((step, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="pres-card py-2 px-3 text-center" style={{ padding: '8px 12px' }}>
                  <p className="text-xs font-bold" style={{ color: 'var(--pres-accent)' }}>{step.label}</p>
                  <p className="text-[10px]" style={{ color: 'var(--pres-text-dim)' }}>{step.time}</p>
                </div>
                {i < d.traceSteps.length - 1 && (
                  <span className="text-xs" style={{ color: 'var(--pres-text-dim)' }}>→</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Compliance */}
        <div className="pres-animate-up flex items-center gap-2" style={{ animationDelay: '0.4s' }}>
          <span className="text-xs shrink-0" style={{ color: 'var(--pres-text-dim)' }}>合规管控:</span>
          <div className="flex gap-2">
            {d.compliance.map((c, i) => (
              <span key={i} className="rounded-full px-3 py-1 text-xs"
                style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>{c}</span>
            ))}
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
