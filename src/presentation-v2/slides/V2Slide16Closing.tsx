import SlideLayout from '@/presentation/components/SlideLayout'
import { v2ClosingData, V2_TOTAL_SLIDES } from '../data/v2SlideContent'

export default function V2Slide16Closing() {
  const d = v2ClosingData
  return (
    <SlideLayout title="" pageNumber={16} totalSlides={V2_TOTAL_SLIDES}>
      <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
        {/* Big thanks */}
        <div className="pres-animate-up">
          <h1 className="text-5xl font-black tracking-wider" style={{ color: 'var(--pres-accent)' }}>
            {d.thanks}
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-lg font-bold pres-animate-up" style={{ color: 'var(--pres-text)', animationDelay: '0.15s' }}>
          {d.subtitle}
        </p>

        {/* Divider */}
        <div className="w-24 h-px pres-animate-up" style={{ background: 'var(--pres-accent)', opacity: 0.3, animationDelay: '0.25s' }} />

        {/* Tagline */}
        <p className="text-sm pres-animate-up" style={{ color: 'var(--pres-text-secondary)', animationDelay: '0.35s' }}>
          {d.tagline}
        </p>

        {/* Motto */}
        <p className="text-xs pres-animate-up" style={{ color: 'var(--pres-text-dim)', animationDelay: '0.45s' }}>
          {d.motto}
        </p>

        {/* Glow ring decoration */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, var(--pres-accent), transparent 70%)' }} />
      </div>
    </SlideLayout>
  )
}
