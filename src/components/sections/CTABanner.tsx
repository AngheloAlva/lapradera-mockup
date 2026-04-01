import Image from 'next/image'
import Link from 'next/link'

import type { Media } from '@/payload-types'

import { ScrollReveal, fadeIn } from '@/lib/motion'

interface CTABannerProps {
  titulo?: string | null
  descripcion?: string | null
  textoBoton?: string | null
  enlaceBoton?: string | null
  imagenFondo?: (number | null) | Media
}

function getMediaUrl(media: number | Media | null | undefined): string | null {
  if (!media || typeof media === 'number') return null
  return media?.url ?? (media?.filename ? `/api/media/file/${media.filename}` : null)
}

export function CTABanner({
  titulo,
  descripcion,
  textoBoton,
  enlaceBoton,
  imagenFondo,
}: CTABannerProps) {
  if (!titulo) return null

  const bgUrl = getMediaUrl(imagenFondo)

  return (
    <div className="lg:px-20 md:px-14 px-4">
      <section className="relative overflow-hidden h-[70dvh] flex items-center justify-center rounded-4xl">
        {/* Background image */}
        {bgUrl ? (
          <Image src={bgUrl} alt="" fill className="object-cover" sizes="100vw" />
        ) : (
          <div className="absolute inset-0 bg-pradera-800" />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <ScrollReveal
          variants={fadeIn}
          className="relative z-10 mx-auto max-w-3xl px-6 text-center"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-normal text-white">
            {titulo}
          </h2>
          {descripcion && (
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85">{descripcion}</p>
          )}
          {textoBoton && enlaceBoton && (
            <Link
              href={enlaceBoton}
              className="mt-8 inline-block rounded-full bg-tierra-400 px-8 py-4.5 font-heading text-sm font-semibold uppercase tracking-wider text-gray-900 transition hover:bg-tierra-300"
            >
              {textoBoton}
            </Link>
          )}
        </ScrollReveal>
      </section>
    </div>
  )
}
