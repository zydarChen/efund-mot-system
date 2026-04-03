import SlideLayout from '@/presentation/components/SlideLayout'
import { v2WinWinData, V2_TOTAL_SLIDES } from '../data/v2SlideContent'

export default function V2Slide15WinWin() {
  const d = v2WinWinData
  return (
    <SlideLayout title={d.title} pageNumber={15} totalSlides={V2_TOTAL_SLIDES}>
      <div className="flex flex-col gap-4 h-full">
        {/* Dual value columns */}
        <div className="grid grid-cols-2 gap-4 pres-animate-up">
          {/* Customer value */}
          <div className="pres-card py-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(47,197,231,0.1)' }}>
                <span style={{ color: 'var(--pres-accent)', fontSize: 16 }}>&#x1F465;</span>
              </div>
              <h4 className="text-sm font-bold" style={{ color: 'var(--pres-accent)' }}>{d.customerValue.title}</h4>
            </div>
            <div className="space-y-2">
              {d.customerValue.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg py-2 px-3"
                  style={{ background: 'rgba(47,197,231,0.04)' }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--pres-accent)' }} />
                  <p className="text-xs" style={{ color: 'var(--pres-text)' }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Enterprise value */}
          <div className="pres-card py-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(245,158,11,0.1)' }}>
                <span style={{ color: '#F59E0B', fontSize: 16 }}>&#x1F3E2;</span>
              </div>
              <h4 className="text-sm font-bold" style={{ color: '#F59E0B' }}>{d.enterpriseValue.title}</h4>
            </div>
            <div className="space-y-2">
              {d.enterpriseValue.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg py-2 px-3"
                  style={{ background: 'rgba(245,158,11,0.04)' }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#F59E0B' }} />
                  <p className="text-xs" style={{ color: 'var(--pres-text)' }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Support needs */}
        <div className="pres-animate-up" style={{ animationDelay: '0.2s' }}>
          <h4 className="text-xs font-bold mb-3" style={{ color: 'var(--pres-accent)' }}>需要的支持</h4>
          <div className="grid grid-cols-4 gap-3">
            {d.support.map((s, i) => (
              <div key={i} className="pres-card py-3 text-center">
                <p className="text-sm font-bold mb-1" style={{ color: 'var(--pres-text)' }}>{s.title}</p>
                <p className="text-[10px]" style={{ color: 'var(--pres-text-dim)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
