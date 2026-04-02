'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import type { Instalacione, Media } from '@/payload-types'
import { ScrollReveal, ScrollRevealStagger, ScrollRevealItem } from '@/lib/motion'

interface InstalacionesDestacadasProps {
  titulo?: string | null
  subtitulo?: string | null
  instalaciones: Instalacione[]
}

function getImageUrl(media: number | Media): string | null {
  if (typeof media === 'number') return null
  return media?.url ?? (media?.filename ? `/api/media/file/${media.filename}` : null)
}

function getInstalacionImage(instalacion: Instalacione): string | null {
  const firstImage = instalacion.imagenes?.[0]
  const imageMedia = firstImage?.imagen
  return imageMedia ? getImageUrl(imageMedia) : null
}

export function InstalacionesDestacadas({ instalaciones }: InstalacionesDestacadasProps) {
  if (instalaciones.length === 0) return null

  const mainItem = instalaciones[0]
  const secondItem = instalaciones[1]
  const thirdItem = instalaciones[2]
  const fourthItem = instalaciones[3]

  const mainImage = getInstalacionImage(mainItem)
  const secondImage = secondItem ? getInstalacionImage(secondItem) : null
  const thirdImage = thirdItem ? getInstalacionImage(thirdItem) : null
  const fourthImage = fourthItem ? getInstalacionImage(fourthItem) : null

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="mb-16 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-widest text-pradera-600">
                Instalaciones de Clase Mundial
              </span>
              <h2 className="font-display text-3xl font-normal italic leading-snug text-gray-900 md:text-4xl lg:text-5xl">
                Vida Activa, Naturalmente Definida.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-relaxed text-gray-500">
              Descubre nuestras instalaciones diseñadas para brindarte la mejor experiencia
              deportiva y recreativa en un entorno natural privilegiado.
            </p>
          </div>
        </ScrollReveal>

        <ScrollRevealStagger className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left Column - Tall Card */}
          <ScrollRevealItem className="row-span-2">
            <Link
              href={`/instalaciones/${mainItem.slug}`}
              className="group relative block h-full min-h-[500px] overflow-hidden rounded-3xl lg:min-h-full"
            >
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={mainItem.nombre}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 bg-pradera-200" />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <span className="mb-3 inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                  Acuáticas
                </span>
                <h3 className="font-display text-2xl font-normal text-white md:text-3xl">
                  {mainItem.nombre}
                </h3>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/80">
                  Disfruta de nuestras piscinas de nivel olímpico en un entorno rodeado de
                  naturaleza.
                </p>
                <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-tierra-400 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-pradera-900 transition hover:bg-tierra-300">
                  Explorar
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </ScrollRevealItem>

          {/* Right Column Top - Wide Card */}
          <ScrollRevealItem>
            <Link
              href={secondItem ? `/instalaciones/${secondItem.slug}` : '/instalaciones'}
              className="group relative block h-60 overflow-hidden rounded-3xl md:h-72"
            >
              {secondImage ? (
                <Image
                  src={secondImage}
                  alt={secondItem?.nombre ?? 'Instalación'}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 bg-pradera-100" />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-xl font-normal text-white md:text-2xl">
                  {secondItem?.nombre ?? 'Canchas de Tenis'}
                </h3>
                <p className="mt-1 text-sm text-white/80">
                  Canchas profesionales para disfrutar del deporte al aire libre.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-tierra-400 transition group-hover:gap-2">
                  Ver Horarios
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          </ScrollRevealItem>

          {/* Right Column Bottom - Two Small Cards */}
          <ScrollRevealItem>
            <div className="grid grid-cols-2 gap-6">
              <Link
                href={thirdItem ? `/instalaciones/${thirdItem.slug}` : '/instalaciones'}
                className="group relative block h-60 overflow-hidden rounded-3xl md:h-72"
              >
                {thirdImage ? (
                  <Image
                    src={thirdImage}
                    alt={thirdItem?.nombre ?? 'Instalación'}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-pradera-100" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-display text-lg font-normal text-white">
                    {thirdItem?.nombre ?? 'Mini-Golf'}
                  </h3>
                  <p className="mt-1 text-xs text-white/70">Diversión para toda la familia.</p>
                </div>
              </Link>

              <Link
                href={fourthItem ? `/instalaciones/${fourthItem.slug}` : '/instalaciones'}
                className="group relative block h-60 overflow-hidden rounded-3xl md:h-72"
              >
                {fourthImage ? (
                  <Image
                    src={fourthImage}
                    alt={fourthItem?.nombre ?? 'Instalación'}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-pradera-200" />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-display text-lg font-normal text-white">
                    {fourthItem?.nombre ?? 'Jardines Zen'}
                  </h3>
                  <p className="mt-1 text-xs text-white/70">Espacios de relajación y meditación.</p>
                </div>
              </Link>
            </div>
          </ScrollRevealItem>
        </ScrollRevealStagger>

        <ScrollReveal className="mt-12 text-center">
          <Link
            href="/instalaciones"
            className="inline-flex items-center gap-2 rounded-full bg-pradera-600 px-8 py-4.5 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-pradera-700"
          >
            Ver todas las instalaciones
            <ArrowRight className="h-4 w-4" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
