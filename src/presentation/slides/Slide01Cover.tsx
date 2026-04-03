import { coverData } from '../data/slideContent'

export default function Slide01Cover() {
  return (
    <div className="pres-slide flex items-center justify-center relative">
      {/* Decorative glow rings */}
      <div className="absolute top-[10%] right-[8%] w-[28vw] h-[28vw] pres-glow-ring opacity-20" />
      <div className="absolute bottom-[5%] right-[15%] w-[15vw] h-[15vw] pres-glow-ring opacity-10" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[30%] left-[5%] w-[8vw] h-[8vw] pres-glow-ring opacity-10" style={{ animationDelay: '1s' }} />

      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(47,197,231,0.06)_0%,transparent_50%)]" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl text-center px-8">
        {/* Accent line */}
        <div className="mx-auto mb-8 pres-animate-in" style={{ animationDelay: '0.2s' }}>
          <div className="w-16 h-1 mx-auto rounded-full" style={{ background: 'linear-gradient(90deg, var(--pres-accent), var(--pres-primary))' }} />
        </div>

        {/* Main title */}
        <h1 className="text-[64px] font-bold tracking-tight leading-none mb-4 pres-animate-up pres-gradient-text" style={{ animationDelay: '0.3s' }}>
          {coverData.mainTitle}
        </h1>

        {/* Subtitle */}
        <h2 className="text-[28px] font-semibold mb-2 pres-animate-up" style={{ color: 'var(--pres-text)', animationDelay: '0.4s' }}>
          {coverData.subtitle}
        </h2>
        <p className="text-xl mb-10 pres-animate-up" style={{ color: 'var(--pres-accent)', animationDelay: '0.5s' }}>
          {coverData.tagline}
        </p>

        {/* Motto */}
        <p className="text-sm italic mb-12 pres-animate-in" style={{ color: 'var(--pres-text-dim)', animationDelay: '0.6s' }}>
          "{coverData.motto}"
        </p>

        {/* Info bar */}
        <div className="flex items-center justify-center gap-8 text-xs pres-animate-in" style={{ color: 'var(--pres-text-dim)', animationDelay: '0.7s' }}>
          <span>{coverData.presenter}</span>
          <span className="w-px h-3" style={{ background: 'var(--pres-text-dim)' }} />
          <span>{coverData.department}</span>
          <span className="w-px h-3" style={{ background: 'var(--pres-text-dim)' }} />
          <span>{coverData.date}</span>
        </div>
        <div className="text-xs mt-4 pres-animate-in" style={{ color: 'var(--pres-text-dim)', animationDelay: '0.8s' }}>
          {coverData.company}
        </div>
      </div>
    </div>
  )
}
