import { ReactNode } from 'react'
import { TOTAL_SLIDES } from '../data/slideContent'

interface SlideLayoutProps {
  title?: string
  subtitle?: string
  pageNumber: number
  children: ReactNode
  noPadding?: boolean
  totalSlides?: number
}

export default function SlideLayout({ title, subtitle, pageNumber, children, noPadding, totalSlides }: SlideLayoutProps) {
  const total = totalSlides ?? TOTAL_SLIDES
  return (
    <div className="pres-slide">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20vh] -right-[10vw] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(47,197,231,0.04)_0%,transparent_70%)]" />
        <div className="absolute -bottom-[15vh] -left-[8vw] w-[35vw] h-[35vw] rounded-full bg-[radial-gradient(circle,rgba(0,80,150,0.05)_0%,transparent_70%)]" />
      </div>

      {/* Content */}
      <div className={`relative z-10 flex flex-col flex-1 ${noPadding ? '' : 'gap-6'}`}>
        {title && (
          <div className="pres-animate-up flex-shrink-0">
            <div className="pres-accent-line mb-4" />
            <h1 className="text-[28px] font-bold tracking-tight leading-tight" style={{ color: 'var(--pres-text)' }}>
              {title}
            </h1>
            {subtitle && (
              <p className="text-base mt-2" style={{ color: 'var(--pres-text-secondary)' }}>{subtitle}</p>
            )}
          </div>
        )}
        <div className="flex-1 min-h-0">
          {children}
        </div>
      </div>

      {/* Page number */}
      <div className="absolute bottom-5 right-[7vw] text-xs z-20" style={{ color: 'var(--pres-text-dim)' }}>
        {String(pageNumber).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>
    </div>
  )
}
