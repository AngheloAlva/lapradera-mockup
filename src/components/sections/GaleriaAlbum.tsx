'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react'

import type { Media } from '@/payload-types'

interface GaleriaImage {
  imagen: number | Media
  descripcion?: string | null
  id?: string | null
}

interface GaleriaAlbumProps {
  titulo: string
  descripcion?: string | null
  fecha?: string | null
  imagenes: GaleriaImage[]
}

function getMediaUrl(media: number | Media): string | null {
  if (typeof media === 'number') return null
  return media?.url ?? (media?.filename ? `/api/media/file/${media.filename}` : null)
}

function getMediaAlt(media: number | Media): string {
  if (typeof media === 'number') return ''
  return media?.alt ?? ''
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr))
}

export function GaleriaAlbum({ titulo, descripcion, fecha, imagenes }: GaleriaAlbumProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const coverUrl = imagenes.length > 0 ? getMediaUrl(imagenes[0].imagen) : null
  const coverAlt = imagenes.length > 0 ? getMediaAlt(imagenes[0].imagen) : titulo

  function openLightbox(index: number) {
    setLightboxIndex(index)
    document.body.style.overflow = 'hidden'
  }

  function closeLightbox() {
    setLightboxIndex(null)
    document.body.style.overflow = ''
  }

  function goNext() {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex + 1) % imagenes.length)
  }

  function goPrev() {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex - 1 + imagenes.length) % imagenes.length)
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:shadow-md">
      {/* Album Cover Card */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left"
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={coverAlt}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100">
              <Images className="h-12 w-12 text-gray-300" />
            </div>
          )}
          <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
            {imagenes.length} fotos
          </div>
        </div>

        <div className="p-5">
          <h3 className="mb-1 font-display text-lg font-medium text-gray-900">{titulo}</h3>
          {fecha && (
            <p className="mb-2 text-sm text-gray-500">{formatDate(fecha)}</p>
          )}
          {descripcion && (
            <p className="line-clamp-2 text-sm text-gray-500">{descripcion}</p>
          )}
          <span className="mt-3 inline-block text-sm font-medium text-pradera-600">
            {isExpanded ? 'Ocultar fotos' : 'Ver fotos'}
          </span>
        </div>
      </button>

      {/* Expanded Image Grid */}
      {isExpanded && (
        <div className="border-t border-gray-100 p-4">
          <div className="columns-2 gap-3 sm:columns-3">
            {imagenes.map((img, index) => {
              const url = getMediaUrl(img.imagen)
              const alt = getMediaAlt(img.imagen)
              if (!url) return null
              return (
                <button
                  key={img.id ?? index}
                  type="button"
                  onClick={() => openLightbox(index)}
                  className="mb-3 block w-full overflow-hidden rounded-lg"
                >
                  <Image
                    src={url}
                    alt={alt || img.descripcion || `Foto ${index + 1}`}
                    width={400}
                    height={300}
                    className="h-auto w-full object-cover transition-transform duration-200 hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (() => {
        const currentImage = imagenes[lightboxIndex]
        const currentUrl = getMediaUrl(currentImage.imagen)
        const currentAlt = getMediaAlt(currentImage.imagen)
        if (!currentUrl) return null

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={closeLightbox}
            onKeyDown={(e) => {
              if (e.key === 'Escape') closeLightbox()
              if (e.key === 'ArrowRight') goNext()
              if (e.key === 'ArrowLeft') goPrev()
            }}
            role="dialog"
            aria-modal="true"
            aria-label={`Imagen ${lightboxIndex + 1} de ${imagenes.length}`}
            tabIndex={0}
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 rounded-full bg-white/20 p-2 text-white transition hover:bg-white/40"
              aria-label="Cerrar"
            >
              <X className="h-6 w-6" />
            </button>

            {imagenes.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); goPrev() }}
                  className="absolute left-4 z-10 rounded-full bg-white/20 p-2 text-white transition hover:bg-white/40"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); goNext() }}
                  className="absolute right-4 z-10 rounded-full bg-white/20 p-2 text-white transition hover:bg-white/40"
                  aria-label="Foto siguiente"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            <div
              className="relative max-h-[85vh] max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={currentUrl}
                alt={currentAlt || currentImage.descripcion || `Foto ${lightboxIndex + 1}`}
                width={1200}
                height={800}
                className="max-h-[85vh] w-auto rounded-lg object-contain"
                sizes="90vw"
              />
              {currentImage.descripcion && (
                <p className="mt-3 text-center text-sm text-white/80">
                  {currentImage.descripcion}
                </p>
              )}
              <p className="mt-1 text-center text-xs text-white/50">
                {lightboxIndex + 1} / {imagenes.length}
              </p>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
