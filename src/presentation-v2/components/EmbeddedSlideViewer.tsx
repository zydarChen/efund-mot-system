import { useRef, useCallback, type ReactNode } from 'react'
import { useEmbeddedNavigation } from '../hooks/useEmbeddedNavigation'
import { v2AllSlides, V2_TOTAL_SLIDES } from '../data/v2SlideContent'
import {
  V2Slide01Cover, V2Slide02Background, V2Slide03Contributions,
  V2Slide04Vision, V2Slide05Advantages, V2Slide06ContentInvestors,
  V2Slide07StrategicConclusion, V2Slide08AIBrain, V2Slide09CSDP,
  V2Slide10VMOT, V2Slide11Strategy, V2Slide12Channel,
  V2Slide13Prototype, V2Slide14Roadmap, V2Slide15WinWin, V2Slide16Closing,
} from '../slides'

const slideComponents: (() => ReactNode)[] = [
  () => <V2Slide01Cover />,
  () => <V2Slide02Background />,
  () => <V2Slide03Contributions />,
  () => <V2Slide04Vision />,
  () => <V2Slide05Advantages />,
  () => <V2Slide06ContentInvestors />,
  () => <V2Slide07StrategicConclusion />,
  () => <V2Slide08AIBrain />,
  () => <V2Slide09CSDP />,
  () => <V2Slide10VMOT />,
  () => <V2Slide11Strategy />,
  () => <V2Slide12Channel />,
  () => <V2Slide13Prototype />,
  () => <V2Slide14Roadmap />,
  () => <V2Slide15WinWin />,
  () => <V2Slide16Closing />,
]

export default function EmbeddedSlideViewer() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { currentSlide, next, prev, goTo, total } = useEmbeddedNavigation({
    totalSlides: V2_TOTAL_SLIDES,
    containerRef,
  })

  const toggleFullscreen = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      el.requestFullscreen()
    }
  }, [])

  return (
    <div className="flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-foreground">科学化客户服务体系 V3</h3>
          <span className="text-[10px] text-muted-foreground">
            {currentSlide + 1} / {total}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <a
            href="/presentation-v2.pptx"
            download
            className="flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium text-foreground hover:bg-secondary/50 transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
            </svg>
            下载 PPTX
          </a>
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium text-foreground hover:bg-secondary/50 transition-colors"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4h4M20 8V4h-4M4 16v4h4M20 16v4h-4" />
            </svg>
            全屏
          </button>
        </div>
      </div>

      {/* Main viewer */}
      <div
        ref={containerRef}
        tabIndex={0}
        className="pres-viewer-wrapper flex outline-none focus:ring-1 focus:ring-primary/30 rounded-lg fullscreen:flex-col fullscreen:bg-black"
        style={{ height: 'calc(100vh - 11rem)' }}
      >
        {/* Thumbnail sidebar */}
        <div className="w-44 shrink-0 overflow-y-auto border-r border-border bg-secondary/20 p-2 space-y-1.5 fullscreen:hidden"
          style={{ scrollbarWidth: 'thin' }}>
          {v2AllSlides.map((slide, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`pres-thumbnail-item w-full text-left rounded-md px-2 py-2 transition-all ${
                currentSlide === i ? 'pres-thumbnail-active' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold shrink-0 w-5 text-center"
                  style={{ color: currentSlide === i ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))' }}>
                  {slide.page}
                </span>
                <span className={`text-[11px] truncate ${
                  currentSlide === i ? 'font-semibold text-foreground' : 'text-muted-foreground'
                }`}>
                  {slide.title}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Slide viewport */}
        <div className="flex-1 relative overflow-hidden bg-[#0D1B2A] fullscreen:flex-1">
          {/* Embedded slide container — 16:9 aspect ratio */}
          <div className="pres-slide-embedded absolute inset-0">
            <div className="pres-mode pres-slide w-full h-full">
              {slideComponents[currentSlide]?.()}
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prev}
            disabled={currentSlide === 0}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white/70 hover:bg-black/50 hover:text-white transition-all disabled:opacity-20 disabled:cursor-default"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            disabled={currentSlide === total - 1}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white/70 hover:bg-black/50 hover:text-white transition-all disabled:opacity-20 disabled:cursor-default"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${((currentSlide + 1) / total) * 100}%`,
                background: 'linear-gradient(90deg, #2FC5E7, #1B6B93)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom controls */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => goTo(0)}
          disabled={currentSlide === 0}
          className="text-[10px] text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
        >
          首页
        </button>
        <button
          onClick={prev}
          disabled={currentSlide === 0}
          className="flex items-center gap-0.5 text-[11px] font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
        >
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          上一页
        </button>
        <span className="text-xs font-bold text-foreground tabular-nums">
          {currentSlide + 1} / {total}
        </span>
        <button
          onClick={next}
          disabled={currentSlide === total - 1}
          className="flex items-center gap-0.5 text-[11px] font-medium text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
        >
          下一页
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          onClick={() => goTo(total - 1)}
          disabled={currentSlide === total - 1}
          className="text-[10px] text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
        >
          末页
        </button>
      </div>
    </div>
  )
}
