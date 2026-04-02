'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, useMotionValue, animate } from 'motion/react'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'

import type { Evento } from '@/payload-types'

import { EventoCard } from '@/components/cards/EventoCard'
import { ScrollReveal } from '@/lib/motion'

const CARD_GAP = 24

interface ProximosEventosProps {
  titulo?: string | null
  subtitulo?: string | null
  eventos: Evento[]
}

export function ProximosEventos({ titulo, subtitulo, eventos }: ProximosEventosProps) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [scrollWidth, setScrollWidth] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [cardWidth, setCardWidth] = useState(0)
  const x = useMotionValue(0)

  const measureCarousel = useCallback(() => {
    if (!carouselRef.current) return
    const container = carouselRef.current
    const firstCard = container.querySelector<HTMLElement>('[data-carousel-card]')
    if (!firstCard) return

    const cWidth = container.offsetWidth
    const sWidth = container.scrollWidth
    const fCardWidth = firstCard.offsetWidth

    setContainerWidth(cWidth)
    setScrollWidth(sWidth)
    setCardWidth(fCardWidth + CARD_GAP)
  }, [])

  useEffect(() => {
    measureCarousel()
    window.addEventListener('resize', measureCarousel)
    return () => window.removeEventListener('resize', measureCarousel)
  }, [measureCarousel, eventos])

  const maxDrag = scrollWidth - containerWidth
  const totalDots = cardWidth > 0 ? Math.ceil(maxDrag / cardWidth) + 1 : eventos.length

  const springConfig = { stiffness: 300, damping: 30 }

  const scrollTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, totalDots - 1))
      const target = Math.min(clamped * cardWidth, maxDrag)
      setCurrentIndex(clamped)
      animate(x, -target, { type: 'spring', ...springConfig })
    },
    [cardWidth, maxDrag, totalDots, x],
  )

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      const currentX = x.get()
      const projectedX = currentX + info.velocity.x * 0.2
      const targetIndex = Math.round(-projectedX / cardWidth)
      const clamped = Math.max(0, Math.min(targetIndex, totalDots - 1))

      setCurrentIndex(clamped)
      const target = Math.min(clamped * cardWidth, maxDrag)
      animate(x, -target, { type: 'spring', ...springConfig })
    },
    [cardWidth, maxDrag, totalDots, x],
  )

  const goNext = useCallback(() => scrollTo(currentIndex + 1), [currentIndex, scrollTo])
  const goPrev = useCallback(() => scrollTo(currentIndex - 1), [currentIndex, scrollTo])

  if (eventos.length === 0) return null

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal className="mb-16 text-center">
          {titulo && (
            <h2 className="font-display text-3xl font-normal text-gray-900 md:text-4xl lg:text-5xl">
              {titulo}
            </h2>
          )}
          {subtitulo && <p className="mx-auto mt-3 max-w-2xl text-gray-400">{subtitulo}</p>}
        </ScrollReveal>

        <div className="relative">
          <button
            type="button"
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="absolute -left-8 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-4.5 shadow-lg transition-colors hover:bg-gray-100 disabled:opacity-30 md:block"
            aria-label="Anterior"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>

          <button
            type="button"
            onClick={goNext}
            disabled={currentIndex >= totalDots - 1}
            className="absolute -right-8 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-4.5 shadow-lg transition-colors hover:bg-gray-100 disabled:opacity-30 md:block"
            aria-label="Siguiente"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>

          <div className="overflow-hidden" ref={carouselRef}>
            <motion.div
              className="flex cursor-grab gap-6 active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: -maxDrag, right: 0 }}
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
              style={{ x }}
            >
              {eventos.map((evento) => (
                <div key={evento.id} data-carousel-card className="w-80 shrink-0 md:w-96">
                  <EventoCard evento={evento} />
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {totalDots > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2" role="tablist">
            {Array.from({ length: totalDots }, (_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === currentIndex}
                aria-label={`Ir a grupo ${i + 1}`}
                onClick={() => scrollTo(i)}
                className={`h-2.5 rounded-full ${
                  i === currentIndex ? 'w-8 bg-pradera-600' : 'w-2.5 bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}

        <ScrollReveal delay={0.3} className="mt-12 text-center">
          <Link
            href="/actividades"
            className="inline-flex items-center gap-2 rounded-full bg-pradera-600 px-8 py-4.5 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-pradera-700"
          >
            Ver todas las actividades
            <ArrowRight className="h-4 w-4" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
