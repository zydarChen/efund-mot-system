import { useState, useEffect, useCallback } from 'react'
import { TOTAL_SLIDES } from '../data/slideContent'

export function useSlideNavigation() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')

  const next = useCallback(() => {
    setDirection('next')
    setCurrentSlide(s => Math.min(s + 1, TOTAL_SLIDES - 1))
  }, [])

  const prev = useCallback(() => {
    setDirection('prev')
    setCurrentSlide(s => Math.max(s - 1, 0))
  }, [])

  const goTo = useCallback((n: number) => {
    setDirection(n > currentSlide ? 'next' : 'prev')
    setCurrentSlide(Math.max(0, Math.min(n, TOTAL_SLIDES - 1)))
  }, [currentSlide])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
          goTo(TOTAL_SLIDES - 1)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [next, prev, goTo])

  // Touch swipe support
  useEffect(() => {
    let startX = 0
    let startY = 0

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX
      const dy = e.changedTouches[0].clientY - startY
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
        if (dx < 0) next()
        else prev()
      }
    }

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchend', handleTouchEnd)
    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [next, prev])

  return { currentSlide, direction, next, prev, goTo, total: TOTAL_SLIDES }
}
