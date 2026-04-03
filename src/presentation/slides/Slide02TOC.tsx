import SlideLayout from '../components/SlideLayout'
import { tocData } from '../data/slideContent'

export default function Slide02TOC() {
  return (
    <SlideLayout title="汇报大纲" pageNumber={2}>
      <div className="grid grid-cols-3 gap-8 h-full items-start pt-4 pres-stagger">
        {tocData.sections.map((section, si) => (
          <div key={si} className="pres-animate-up">
            <div className="text-sm font-semibold mb-4 pb-2 border-b" style={{ color: 'var(--pres-accent)', borderColor: 'var(--pres-card-border)' }}>
              {section.part}
            </div>
            <div className="space-y-4">
              {section.items.map((item, ii) => (
                <div key={ii} className="flex gap-3 items-start group">
                  <span className="text-2xl font-bold leading-none mt-0.5 pres-gradient-text">{item.num}</span>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--pres-text)' }}>{item.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--pres-text-dim)' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </SlideLayout>
  )
}
