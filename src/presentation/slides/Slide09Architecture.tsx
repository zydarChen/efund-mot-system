import SlideLayout from '../components/SlideLayout'
import { architectureData } from '../data/slideContent'
import { LayoutDashboard, Users, Target, Search, Send } from 'lucide-react'

const iconMap: Record<string, React.ElementType> = { LayoutDashboard, Users, Target, Search, Send }

export default function Slide09Architecture() {
  return (
    <SlideLayout title={architectureData.title} pageNumber={9}>
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-5 gap-4 flex-1 pres-stagger">
          {architectureData.modules.map((mod, i) => {
            const Icon = iconMap[mod.icon] || LayoutDashboard
            return (
              <div key={i} className="pres-card pres-animate-up flex flex-col items-center text-center" style={{ animationDelay: `${0.1 * (i + 1)}s` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(47,197,231,0.1)' }}>
                  <Icon size={24} style={{ color: 'var(--pres-accent)' }} />
                </div>
                <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--pres-text)' }}>{mod.name}</h3>
                <div className="space-y-1.5 w-full">
                  {mod.features.map((f, fi) => (
                    <div key={fi} className="text-xs py-1 px-2 rounded" style={{ background: 'rgba(47,197,231,0.06)', color: 'var(--pres-text-secondary)' }}>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 text-center text-xs pres-animate-in" style={{ color: 'var(--pres-text-dim)', animationDelay: '0.7s' }}>
          {architectureData.extra}
        </div>

        {/* Tech stack */}
        <div className="mt-4 flex items-center justify-center gap-2 pres-animate-in" style={{ animationDelay: '0.8s' }}>
          <span className="text-xs" style={{ color: 'var(--pres-text-dim)' }}>技术栈:</span>
          {architectureData.techStack.map((t, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--pres-card)', border: '1px solid var(--pres-card-border)', color: 'var(--pres-text-secondary)' }}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </SlideLayout>
  )
}
