import SlideLayout from '../components/SlideLayout'
import FeatureCard from '../components/FeatureCard'
import { industryData } from '../data/slideContent'

export default function Slide03Industry() {
  return (
    <SlideLayout title={industryData.title} pageNumber={3}>
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-3 gap-6 flex-1 pres-stagger">
          {industryData.cards.map((card, i) => (
            <FeatureCard
              key={i}
              num={card.num}
              title={card.title}
              desc={card.desc}
              details={card.details}
              delay={0.1 * (i + 1)}
            />
          ))}
        </div>
        <div className="mt-6 text-center pres-animate-in" style={{ animationDelay: '0.6s' }}>
          <p className="text-sm italic" style={{ color: 'var(--pres-accent)' }}>
            {industryData.quote}
          </p>
        </div>
      </div>
    </SlideLayout>
  )
}
