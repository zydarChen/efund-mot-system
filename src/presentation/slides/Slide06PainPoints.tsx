import SlideLayout from '../components/SlideLayout'
import { painPointsData } from '../data/slideContent'

const severityColors = ['#EF4444', '#F97316', '#F59E0B', '#EAB308', '#A3A3A3', '#737373']

export default function Slide06PainPoints() {
  return (
    <SlideLayout title={painPointsData.title} pageNumber={6}>
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-3 gap-4 flex-1 pres-stagger">
          {painPointsData.points.map((p, i) => (
            <div key={i} className="pres-card pres-animate-up" style={{ animationDelay: `${0.1 * (i + 1)}s` }}>
              <div className="flex items-center gap-3 mb-3">
                <span
                  className="text-xl font-bold"
                  style={{ color: severityColors[i] }}
                >
                  {p.num}
                </span>
                <h3 className="font-semibold" style={{ color: 'var(--pres-text)' }}>{p.title}</h3>
              </div>
              <p className="text-sm mb-2" style={{ color: 'var(--pres-text-secondary)' }}>{p.desc}</p>
              <div className="text-xs flex items-center gap-1.5" style={{ color: severityColors[i] }}>
                <span>&#x2192;</span> {p.impact}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 pres-card pres-card-highlight text-center py-3 pres-animate-in" style={{ animationDelay: '0.8s' }}>
          <p className="text-sm font-medium" style={{ color: 'var(--pres-accent)' }}>
            {painPointsData.summary}
          </p>
        </div>
      </div>
    </SlideLayout>
  )
}
