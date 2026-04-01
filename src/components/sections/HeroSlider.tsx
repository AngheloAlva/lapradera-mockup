'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'

import type { Media } from '@/payload-types'
import { useReducedMotion } from '@/lib/motion'

interface HeroSlide {
  imagen: number | Media
  titulo?: string | null
  subtitulo?: string | null
  textoBoton?: string | null
  enlaceBoton?: string | null
  id?: string | null
}

interface HeroSliderProps {
  slides?: HeroSlide[] | null
}

function getMediaUrl(media: number | Media): string | null {
  if (typeof media === 'number') return null
  return media?.url ?? (media?.filename ? `/api/media/file/${media.filename}` : null)
}

const SLIDE_DURATION = 5000

function DefaultHero() {
  return (
    <section className="relative flex h-[80vh] items-center justify-center bg-gray-900 md:h-[90vh]">
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="relative z-10 px-6 text-center">
        <h1 className="font-display text-5xl font-bold leading-[0.95] text-white md:text-7xl lg:text-8xl">
          La Pradera Country Club
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80 md:text-xl">
          Tu segundo hogar en medio de la naturaleza
        </p>
      </div>
    </section>
  )
}

export function HeroSlider({ slides }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  const validSlides = slides?.filter((s) => s.imagen) ?? []

  const next = useCallback(() => {
    if (validSlides.length === 0) return
    setCurrent((prev) => (prev + 1) % validSlides.length)
  }, [validSlides.length])

  useEffect(() => {
    if (validSlides.length <= 1) return

    const interval = setInterval(next, SLIDE_DURATION)
    return () => clearInterval(interval)
  }, [next, validSlides.length])

  if (validSlides.length === 0) {
    return <DefaultHero />
  }

  const slide = validSlides[current]
  const imageUrl = slide ? getMediaUrl(slide.imagen) : null
  const imageAlt =
    slide && typeof slide.imagen !== 'number' ? (slide.imagen?.alt ?? 'Hero') : 'Hero'

  const noMotion = prefersReducedMotion
  const dur = noMotion ? 0 : 0.5
  const ease = [0.4, 0, 0.2, 1] as const

  return (
    <div className="lg:px-20 md:px-14 px-4">
      <section className="relative h-[80vh] overflow-hidden md:h-[87vh] rounded-4xl">
        {/* Background images with crossfade */}
        <AnimatePresence mode="popLayout">
          {imageUrl && (
            <motion.div
              key={`img-${current}`}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: dur * 1.2, ease }}
            >
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

        {/* Content with staggered entrance */}
        <div className="absolute inset-0 flex items-end pb-14 lg:pb-24 px-4 md:px-14 lg:px-24">
          <div className="mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-${current}`}
                className="max-w-2xl"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: noMotion ? 0 : 0.12 },
                  },
                  exit: {
                    transition: { staggerChildren: 0.05, staggerDirection: -1 },
                  },
                }}
              >
                {slide?.titulo && (
                  <motion.h1
                    className="font-display text-5xl font-medium leading-[0.95] text-white drop-shadow-2xl md:text-6xl lg:text-7xl xl:text-8xl"
                    variants={{
                      hidden: {
                        opacity: 0,
                        x: noMotion ? 0 : -40,
                        filter: noMotion ? 'none' : 'blur(4px)',
                      },
                      visible: { opacity: 1, x: 0, filter: 'blur(0px)' },
                      exit: {
                        opacity: 0,
                        x: noMotion ? 0 : 30,
                        filter: noMotion ? 'none' : 'blur(4px)',
                      },
                    }}
                    transition={{ duration: dur, ease }}
                  >
                    {slide.titulo}
                  </motion.h1>
                )}

                {slide?.subtitulo && (
                  <motion.p
                    className="mt-4 text-lg text-white/70 drop-shadow md:text-xl"
                    variants={{
                      hidden: { opacity: 0, x: noMotion ? 0 : -30 },
                      visible: { opacity: 1, x: 0 },
                      exit: { opacity: 0, x: noMotion ? 0 : 20 },
                    }}
                    transition={{ duration: dur * 0.8, ease }}
                  >
                    {slide.subtitulo}
                  </motion.p>
                )}

                {slide?.textoBoton && slide?.enlaceBoton && (
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: noMotion ? 0 : -20 },
                      visible: { opacity: 1, x: 0 },
                      exit: { opacity: 0, x: noMotion ? 0 : 15 },
                    }}
                    transition={{ duration: dur * 0.7, ease }}
                  >
                    <Link
                      href={slide.enlaceBoton}
                      className="mt-6 inline-block rounded-full bg-white px-8 py-4 font-heading text-sm font-semibold uppercase tracking-wider text-gray-900 hover:bg-gray-100"
                    >
                      {slide.textoBoton}
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation dots */}
        {validSlides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {validSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                aria-label={`Ir a slide ${index + 1}`}
                className={`h-3 rounded-full transition-all ${
                  index === current ? 'w-10 bg-white' : 'w-3 bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
