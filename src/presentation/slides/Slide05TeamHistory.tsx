import SlideLayout from '../components/SlideLayout'
import { teamData } from '../data/slideContent'
import { Phone, Bot, MessageCircle, Smartphone, Heart, Image } from 'lucide-react'

const iconMap: Record<string, React.ElementType> = { Phone, Bot, MessageCircle, Smartphone, Heart, Image }

export default function Slide05TeamHistory() {
  return (
    <SlideLayout title={teamData.title} subtitle={teamData.growth} pageNumber={5}>
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-3 gap-5 flex-1 pres-stagger">
          {teamData.achievements.map((a, i) => {
            const Icon = iconMap[a.icon] || Phone
            return (
              <div key={i} className="pres-card pres-animate-up" style={{ animationDelay: `${0.1 * (i + 1)}s` }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(47,197,231,0.1)' }}>
                    <Icon size={18} style={{ color: 'var(--pres-accent)' }} />
                  </div>
                  <h3 className="font-semibold text-sm" style={{ color: 'var(--pres-text)' }}>{a.title}</h3>
                </div>
                <p className="text-xs" style={{ color: 'var(--pres-text-secondary)' }}>{a.desc}</p>
                {a.stats && (
                  <div className="mt-2 text-xs font-medium" style={{ color: 'var(--pres-accent)' }}>{a.stats}</div>
                )}
              </div>
            )
          })}
        </div>
        <div className="mt-5 text-center pres-animate-in" style={{ animationDelay: '0.8s' }}>
          <p className="text-sm italic" style={{ color: 'var(--pres-gold)' }}>
            "{teamData.quote}"
          </p>
        </div>
      </div>
    </SlideLayout>
  )
}
