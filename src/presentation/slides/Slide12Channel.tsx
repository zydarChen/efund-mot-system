import SlideLayout from '../components/SlideLayout'
import { channelData } from '../data/slideContent'

export default function Slide12Channel() {
  return (
    <SlideLayout title={channelData.title} pageNumber={12}>
      <div className="flex flex-col h-full gap-5">
        {/* Channel matrix table */}
        <div className="pres-animate-up" style={{ animationDelay: '0.2s' }}>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--pres-card-border)' }}>
                {['渠道', '日均量', '送达率', '打开率', '转化率', '成本'].map((h, i) => (
                  <th key={i} className="py-2 px-3 text-left font-semibold" style={{ color: 'var(--pres-accent)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {channelData.channels.map((ch, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(47,197,231,0.06)' }}>
                  <td className="py-2 px-3 font-medium" style={{ color: 'var(--pres-text)' }}>{ch.name}</td>
                  <td className="py-2 px-3" style={{ color: 'var(--pres-text-secondary)' }}>{ch.daily}</td>
                  <td className="py-2 px-3" style={{ color: 'var(--pres-text-secondary)' }}>{ch.delivery}</td>
                  <td className="py-2 px-3" style={{ color: 'var(--pres-text-secondary)' }}>{ch.open}</td>
                  <td className="py-2 px-3" style={{ color: 'var(--pres-text-secondary)' }}>{ch.convert}</td>
                  <td className="py-2 px-3" style={{ color: 'var(--pres-text-secondary)' }}>{ch.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-xs mt-2" style={{ color: 'var(--pres-text-dim)' }}>
            智能渠道路由：{channelData.routing}
          </div>
        </div>

        {/* 8-step trace */}
        <div className="pres-animate-up" style={{ animationDelay: '0.5s' }}>
          <div className="text-xs uppercase tracking-wider mb-3" style={{ color: 'var(--pres-accent)' }}>全链路追踪（8步闭环）</div>
          <div className="flex items-center justify-between">
            {channelData.traceSteps.map((step, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[10px] font-bold" style={{ background: 'var(--pres-card)', border: '1px solid var(--pres-card-border)', color: 'var(--pres-accent)' }}>
                    {step.label}
                  </div>
                  <div className="text-[10px] mt-1" style={{ color: 'var(--pres-text-dim)' }}>{step.time}</div>
                </div>
                {i < channelData.traceSteps.length - 1 && (
                  <div className="w-4 h-px mx-0.5" style={{ background: 'var(--pres-card-border)' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Compliance */}
        <div className="flex items-center gap-2 mt-auto pres-animate-in" style={{ animationDelay: '0.7s' }}>
          <span className="text-xs" style={{ color: 'var(--pres-text-dim)' }}>合规管控:</span>
          {channelData.compliance.map((c, i) => (
            <span key={i} className="text-[10px] px-2 py-1 rounded-full" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
              {c}
            </span>
          ))}
        </div>
      </div>
    </SlideLayout>
  )
}
