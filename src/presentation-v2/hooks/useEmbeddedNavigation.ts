import { useState, useEffect, useCallback, type RefObject } from 'react'

interface UseEmbeddedNavigationOptions {
  totalSlides: number
  enabled?: boolean
  containerRef?: RefObject<HTMLElement | null>
}

export function useEmbeddedNavigation({ totalSlides, enabled = true, containerRef }: UseEmbeddedNavigationOptions) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')

  const next = useCallback(() => {
    setDirection('next')
    setCurrentSlide(s => Math.min(s + 1, totalSlides - 1))
  }, [totalSlides])

  const prev = useCallback(() => {
    setDirection('prev')
    setCurrentSlide(s => Math.max(s - 1, 0))
  }, [])

  const goTo = useCallback((n: number) => {
    setCurrentSlide(prev => {
      setDirection(n > prev ? 'next' : 'prev')
      return Math.max(0, Math.min(n, totalSlides - 1))
    })
  }, [totalSlides])

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only respond if container has focus or is fullscreen
      const container = containerRef?.current
      if (container && !document.fullscreenElement) {
        if (!container.contains(document.activeElement) && document.activeElement !== container) {
          return
        }
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault()
          next()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault()
          prev()
          break
        case 'Home':
          e.preventDefault()
          goTo(0)
          break
        case 'End':
          e.preventDefault()
          goTo(totalSlides - 1)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enabled, next, prev, goTo, totalSlides, containerRef])

  return { currentSlide, direction, next, prev, goTo, total: totalSlides }
}
