'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import { useReducedMotion } from '@/lib/motion'

interface GalleryImage {
  url: string
  alt: string
}

interface ImageGalleryProps {
  images: GalleryImage[]
  backHref: string
  backLabel?: string
}

const ROTATE_INTERVAL = 4000

export function ImageGallery({ images, backHref, backLabel = 'Volver' }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const prefersReducedMotion = useReducedMotion()
  const hasMultiple = images.length > 1

  const next = useCallback(() => {
    if (!hasMultiple) return
    setActiveIndex((prev) => (prev + 1) % images.length)
  }, [hasMultiple, images.length])

  useEffect(() => {
    if (!hasMultiple) return
    const interval = setInterval(next, ROTATE_INTERVAL)
    return () => clearInterval(interval)
  }, [next, hasMultiple, activeIndex])

  if (images.length === 0) {
    return (
      <div className="relative mb-4 aspect-video overflow-hidden rounded-3xl bg-gray-100">
        <Link
          href={backHref}
          className="absolute top-6 left-6 z-10 inline-flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm hover:bg-black/60"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>
      </div>
    )
  }

  const dur = prefersReducedMotion ? 0 : 0.5

  return (
    <div className="mb-8">
      {/* Main image */}
      <div className="relative aspect-video overflow-hidden rounded-3xl bg-gray-100">
        <Link
          href={backHref}
          className="absolute top-6 left-6 z-10 inline-flex border border-white tracking-wide items-center gap-2 rounded-full bg-black/20 px-5 py-3 text-sm font-medium text-white backdrop-blur-sm hover:bg-black/60"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Link>

        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeIndex}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: dur }}
          >
            <Image
              src={images[activeIndex].url}
              alt={images[activeIndex].alt}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority={activeIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Image counter */}
        {hasMultiple && (
          <div className="absolute bottom-4 right-4 z-10 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultiple && (
        <div className="mt-3 grid grid-cols-4 gap-3 sm:grid-cols-5 lg:grid-cols-6">
          {images.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-[3/2] overflow-hidden rounded-2xl bg-gray-100 ring-2 ring-offset-2 transition-all ${
                index === activeIndex
                  ? 'ring-pradera-600'
                  : 'ring-transparent hover:ring-gray-300'
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 25vw, (max-width: 1024px) 20vw, 16vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
