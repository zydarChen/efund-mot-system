import SlideLayout from '@/presentation/components/SlideLayout'
import { v2BackgroundData, V2_TOTAL_SLIDES } from '../data/v2SlideContent'

export default function V2Slide02Background() {
  const d = v2BackgroundData
  return (
    <SlideLayout title={d.title} pageNumber={2} totalSlides={V2_TOTAL_SLIDES}>
      <div className="grid grid-cols-2 gap-4 h-full pres-stagger">
        {/* 金科大中台定位 */}
        <div className="pres-card pres-animate-up">
          <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--pres-accent)' }}>{d.sections[0].label}</h3>
          <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--pres-text-secondary)' }}>{d.sections[0].desc}</p>
          <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(47,197,231,0.08)' }}>
            <p className="text-xs font-medium" style={{ color: 'var(--pres-accent)' }}>{d.sections[0].highlight}</p>
          </div>
        </div>

        {/* 公司战略要求 */}
        <div className="pres-card pres-animate-up">
          <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--pres-accent)' }}>{d.sections[1].label}</h3>
          <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--pres-text-secondary)' }}>{d.sections[1].desc}</p>
          <div className="flex gap-2">
            {d.sections[1].tags?.map((tag, i) => (
              <span key={i} className="rounded-full px-3 py-1 text-xs" style={{ background: 'rgba(47,197,231,0.12)', color: 'var(--pres-accent)' }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* 业务板块压力 */}
        <div className="pres-card pres-animate-up">
          <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--pres-accent)' }}>{d.sections[2].label}</h3>
          <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--pres-text-secondary)' }}>{d.sections[2].desc}</p>
          <div className="space-y-2">
            {d.sections[2].items?.map((item, i) => (
              <div key={i} className={`rounded-lg px-3 py-2 flex items-start gap-2 ${item.highlight ? 'border border-[var(--pres-accent)]' : ''}`}
                style={{ background: item.highlight ? 'rgba(47,197,231,0.08)' : 'rgba(255,255,255,0.03)' }}>
                <span className="text-xs font-bold shrink-0" style={{ color: item.highlight ? 'var(--pres-accent)' : 'var(--pres-text)' }}>{item.name}：</span>
                <span className="text-xs" style={{ color: 'var(--pres-text-secondary)' }}>{item.detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 产研团队发展 */}
        <div className="pres-card pres-animate-up">
          <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--pres-accent)' }}>{d.sections[3].label}</h3>
          <div className="flex items-center gap-4 mb-3">
            <div className="text-center">
              <p className="text-xs" style={{ color: 'var(--pres-text-dim)' }}>过去</p>
              <p className="text-lg font-bold" style={{ color: 'var(--pres-text-secondary)' }}>{d.sections[3].from?.split(' ')[1]}</p>
            </div>
            <span className="text-lg font-bold" style={{ color: 'var(--pres-accent)' }}>→</span>
            <div className="text-center">
              <p className="text-xs" style={{ color: 'var(--pres-text-dim)' }}>当前</p>
              <p className="text-lg font-bold" style={{ color: 'var(--pres-accent)' }}>{d.sections[3].to?.split(' ')[1]}</p>
            </div>
          </div>
          <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(239,68,68,0.1)' }}>
            <p className="text-xs" style={{ color: '#EF4444' }}>{d.sections[3].pressure}</p>
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
