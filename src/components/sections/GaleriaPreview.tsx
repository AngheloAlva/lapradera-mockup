import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

import type { Media } from '@/payload-types'

import { ScrollReveal, ScrollRevealStagger, ScrollRevealItem } from '@/lib/motion'

interface GaleriaPreviewProps {
  galerias: Array<{
    titulo: string
    fecha?: string | null
    imagenes?:
      | Array<{
          imagen: number | Media
          descripcion?: string | null
          id?: string | null
        }>
      | null
  }>
}

function getMediaUrl(media: number | Media): string | null {
  if (typeof media === 'number') return null
  return media?.url ?? null
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('es-PE', {
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr))
}

export function GaleriaPreview({ galerias }: GaleriaPreviewProps) {
  if (galerias.length === 0) return null

  return (
    <section className="bg-gray-50 py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <ScrollReveal className="mb-16 text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-normal text-gray-900">
            Galería de Fotos
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-400">
            Los mejores momentos de nuestro club
          </p>
        </ScrollReveal>

        {/* Grid */}
        <ScrollRevealStagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galerias.map((galeria, index) => {
            const coverImage = galeria.imagenes?.[0]?.imagen
            const coverUrl = coverImage ? getMediaUrl(coverImage) : null
            const coverAlt =
              coverImage && typeof coverImage !== 'number'
                ? (coverImage.alt ?? galeria.titulo)
                : galeria.titulo
            const photoCount = galeria.imagenes?.length ?? 0

            return (
              <ScrollRevealItem key={index}>
                <div className="overflow-hidden rounded-3xl bg-white shadow-sm transition hover:shadow-md">
                  {/* Cover Image */}
                  <div className="relative aspect-4/3 overflow-hidden">
                    {coverUrl ? (
                      <Image
                        src={coverUrl}
                        alt={coverAlt}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-200">
                        <span className="text-sm text-gray-400">Sin imagen</span>
                      </div>
                    )}
                    {/* Photo count badge */}
                    {photoCount > 0 && (
                      <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
                        {photoCount} {photoCount === 1 ? 'foto' : 'fotos'}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="font-display text-lg font-medium text-gray-900">
                      {galeria.titulo}
                    </h3>
                    {galeria.fecha && (
                      <p className="mt-1 text-sm text-gray-400">{formatDate(galeria.fecha)}</p>
                    )}
                  </div>
                </div>
              </ScrollRevealItem>
            )
          })}
        </ScrollRevealStagger>

        {/* CTA */}
        <ScrollReveal delay={0.3} className="mt-12 text-center">
          <Link
            href="/galeria"
            className="inline-flex items-center gap-2 rounded-full bg-pradera-600 px-8 py-4.5 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-pradera-700"
          >
            Ver toda la galería
            <ArrowRight className="h-4 w-4" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
