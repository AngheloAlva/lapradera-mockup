'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import Lenis from 'lenis'

interface ScrollState {
  scrollY: number
}

const ScrollContext = createContext<ScrollState>({ scrollY: 0 })

export function useScrollY(): number {
  return useContext(ScrollContext).scrollY
}

export function SmoothScroll({ children }: { children: ReactNode }): ReactNode {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)

  const handleScroll = useCallback((y: number) => {
    setScrollY(y)
  }, [])

  useEffect(() => {
    if (!wrapperRef.current || !contentRef.current) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      const wrapper = wrapperRef.current
      function onNativeScroll() {
        handleScroll(wrapper.scrollTop)
      }
      wrapper.addEventListener('scroll', onNativeScroll, { passive: true })
      return () => wrapper.removeEventListener('scroll', onNativeScroll)
    }

    const lenis = new Lenis({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      duration: 1.6,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical' as const,
      gestureOrientation: 'vertical' as const,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    lenis.on('scroll', (e: { scroll: number }) => {
      handleScroll(e.scroll)
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    function handleAnchorClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      const anchor = target.closest('a[href^="#"]')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href || href === '#') return

      const element = document.querySelector(href)
      if (!element) return

      e.preventDefault()
      lenis.scrollTo(element as HTMLElement, { offset: -100 })
    }

    document.addEventListener('click', handleAnchorClick)

    return () => {
      document.removeEventListener('click', handleAnchorClick)
      lenis.destroy()
    }
  }, [handleScroll])

  return (
    <ScrollContext value={{ scrollY }}>
      <div ref={wrapperRef} className="h-screen overflow-x-hidden overflow-y-auto">
        <div ref={contentRef}>{children}</div>
      </div>
    </ScrollContext>
  )
}
