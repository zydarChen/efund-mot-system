import { useState, useEffect, useCallback } from 'react'
import { useSlideNavigation } from './hooks/useSlideNavigation'
import { slides } from './slides'
import { TOTAL_SLIDES, allSlides } from './data/slideContent'

export default function PresentationPage() {
  const { currentSlide, next, prev, goTo } = useSlideNavigation()
  const [animKey, setAnimKey] = useState(0)
  const [showNav, setShowNav] = useState(false)

  // Reset animation on slide change
  useEffect(() => {
    setAnimKey(k => k + 1)
  }, [currentSlide])

  // Hide nav after inactivity
  useEffect(() => {
    setShowNav(true)
    const timer = setTimeout(() => setShowNav(false), 3000)
    return () => clearTimeout(timer)
  }, [currentSlide])

  const handleMouseMove = useCallback(() => {
    setShowNav(true)
  }, [])

  const SlideComponent = slides[currentSlide]

  return (
    <div
      className="pres-mode fixed inset-0 overflow-hidden cursor-none select-none"
      onMouseMove={handleMouseMove}
      style={{ cursor: showNav ? 'default' : 'none' }}
    >
      {/* Current slide */}
      <div key={animKey} className="pres-slide-enter pres-slide-active w-full h-full">
        <SlideComponent />
      </div>

      {/* Progress bar */}
      <div
        className="pres-progress-bar"
        style={{ width: `${((currentSlide + 1) / TOTAL_SLIDES) * 100}%` }}
      />

      {/* Navigation overlay */}
      <div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-2 rounded-full transition-opacity duration-300"
        style={{
          background: 'rgba(13,27,42,0.9)',
          border: '1px solid rgba(47,197,231,0.15)',
          backdropFilter: 'blur(10px)',
          opacity: showNav ? 1 : 0,
          pointerEvents: showNav ? 'auto' : 'none',
        }}
      >
        <button
          onClick={prev}
          disabled={currentSlide === 0}
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors"
          style={{
            background: currentSlide === 0 ? 'transparent' : 'rgba(47,197,231,0.15)',
            color: currentSlide === 0 ? 'rgba(148,163,184,0.3)' : 'var(--pres-accent)',
          }}
        >
          &#x25C0;
        </button>

        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {allSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === currentSlide ? 20 : 6,
                height: 6,
                background: i === currentSlide ? 'var(--pres-accent)' : 'rgba(148,163,184,0.3)',
              }}
              title={allSlides[i].title}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={currentSlide === TOTAL_SLIDES - 1}
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors"
          style={{
            background: currentSlide === TOTAL_SLIDES - 1 ? 'transparent' : 'rgba(47,197,231,0.15)',
            color: currentSlide === TOTAL_SLIDES - 1 ? 'rgba(148,163,184,0.3)' : 'var(--pres-accent)',
          }}
        >
          &#x25B6;
        </button>

        <span className="text-[10px] ml-2" style={{ color: 'var(--pres-text-dim)' }}>
          {currentSlide + 1}/{TOTAL_SLIDES}
        </span>
      </div>

      {/* Keyboard hint */}
      {currentSlide === 0 && showNav && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 text-[10px] pres-animate-in" style={{ color: 'var(--pres-text-dim)', animationDelay: '1s' }}>
          使用 ← → 键或点击导航翻页
        </div>
      )}
    </div>
  )
}
