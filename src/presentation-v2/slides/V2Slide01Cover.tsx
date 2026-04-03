import { v2CoverData } from '../data/v2SlideContent'

export default function V2Slide01Cover() {
  return (
    <div className="pres-slide" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
      {/* Decorative rings */}
      <div className="absolute top-[10%] right-[8%] w-[35%] aspect-square pres-glow-ring opacity-20" />
      <div className="absolute bottom-[15%] left-[5%] w-[20%] aspect-square pres-glow-ring opacity-10" />

      {/* Top label */}
      <div className="pres-animate-up" style={{ animationDelay: '0.1s' }}>
        <p className="text-xs tracking-[0.4em] uppercase mb-6" style={{ color: 'var(--pres-text-dim)' }}>
          {v2CoverData.topLabel}
        </p>
      </div>

      {/* Accent line */}
      <div className="pres-animate-up flex justify-center mb-6" style={{ animationDelay: '0.2s' }}>
        <div className="w-16 h-[3px] rounded-full" style={{ background: 'linear-gradient(90deg, var(--pres-accent), var(--pres-primary))' }} />
      </div>

      {/* Headline */}
      <div className="pres-animate-up" style={{ animationDelay: '0.3s' }}>
        <h1 className="text-[42px] font-bold tracking-wider leading-tight mb-2" style={{ color: 'var(--pres-text)' }}>
          {v2CoverData.headline}
        </h1>
      </div>

      {/* Title */}
      <div className="pres-animate-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="pres-gradient-text text-[32px] font-bold mb-6">
          {v2CoverData.title}
        </h2>
      </div>

      {/* Subtitle */}
      <div className="pres-animate-up" style={{ animationDelay: '0.5s' }}>
        <p className="text-sm italic mb-10" style={{ color: 'var(--pres-text-dim)' }}>
          {v2CoverData.subtitle}
        </p>
      </div>

      {/* Info bar */}
      <div className="pres-animate-up" style={{ animationDelay: '0.6s' }}>
        <div className="flex items-center justify-center gap-3 text-xs" style={{ color: 'var(--pres-text-dim)' }}>
          <span>{v2CoverData.presenter}</span>
          <span className="w-px h-3 bg-current opacity-30" />
          <span>{v2CoverData.org}</span>
          <span className="w-px h-3 bg-current opacity-30" />
          <span>{v2CoverData.date}</span>
        </div>
      </div>
    </div>
  )
}
