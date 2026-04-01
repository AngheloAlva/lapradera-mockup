import type { Metadata } from 'next'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Target, Eye, User as UserIcon } from 'lucide-react'
import { ScrollReveal, ScrollRevealStagger, ScrollRevealItem } from '@/lib/motion'
import { PageHero } from '@/components/sections/PageHero'

import type { Media, Nosotro } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Nosotros | La Pradera Country Club',
  description:
    'Conoce nuestra historia, misión, visión, valores y al consejo directivo de La Pradera Country Club.',
}

async function getNosotros(): Promise<Nosotro> {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'nosotros' })
}

function getMediaUrl(media: number | Media | null | undefined): string | null {
  if (!media || typeof media === 'number') return null
  return media.url ?? null
}

function getMediaAlt(media: number | Media | null | undefined): string {
  if (!media || typeof media === 'number') return ''
  return media.alt ?? ''
}

export default async function NosotrosPage() {
  const nosotros = await getNosotros()

  const historiaImgs = (nosotros.historia?.imagenes ?? [])
    .map((item) => {
      const url = getMediaUrl(item.imagen)
      const alt = getMediaAlt(item.imagen)
      return url ? { url, alt } : null
    })
    .filter(Boolean) as Array<{ url: string; alt: string }>

  return (
    <>
      {/* Page Header */}
      <PageHero
        badge="Nosotros"
        title="Nuestra Historia y Equipo"
        description="Conoce nuestra historia, misión, visión, valores y al consejo directivo."
        images={historiaImgs.slice(0, 2)}
      />

      {/* Historia */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <ScrollReveal>
            {nosotros.historia?.titulo && (
              <h2 className="font-display text-3xl md:text-4xl font-normal text-gray-900">
                {nosotros.historia.titulo}
              </h2>
            )}

            {nosotros.historia?.contenido && (
              <div className="prose prose-lg mt-6 max-w-none text-gray-500">
                <RichText data={nosotros.historia.contenido} />
              </div>
            )}
          </ScrollReveal>

          {nosotros.historia?.imagenes && nosotros.historia.imagenes.length > 0 && (
            <ScrollRevealStagger className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {nosotros.historia.imagenes.map((item) => {
                const url = getMediaUrl(item.imagen)
                if (!url) return null
                return (
                  <ScrollRevealItem key={item.id}>
                    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                      <Image
                        src={url}
                        alt={getMediaAlt(item.imagen)}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  </ScrollRevealItem>
                )
              })}
            </ScrollRevealStagger>
          )}
        </div>
      </section>

      {/* Mision y Vision */}
      {nosotros.vision && nosotros.mision && (
        <section className="bg-gray-50 py-20 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <ScrollReveal>
              <h2 className="font-display text-3xl md:text-4xl font-normal text-gray-900">
                Mision y Vision
              </h2>
            </ScrollReveal>
            <ScrollRevealStagger className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Mision */}
              <ScrollRevealItem>
                <div className="rounded-3xl bg-white p-8 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-pradera-50">
                    <Target className="h-6 w-6 text-pradera-600" />
                  </div>
                  <h3 className="font-display text-xl font-medium text-gray-900">Mision</h3>
                  {nosotros.mision && (
                    <p className="mt-3 leading-relaxed text-gray-500">{nosotros.mision}</p>
                  )}
                </div>
              </ScrollRevealItem>

              {/* Vision */}
              <ScrollRevealItem>
                <div className="rounded-3xl bg-white p-8 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-pradera-50">
                    <Eye className="h-6 w-6 text-pradera-600" />
                  </div>
                  <h3 className="font-display text-xl font-medium text-gray-900">Vision</h3>
                  {nosotros.vision && (
                    <p className="mt-3 leading-relaxed text-gray-500">{nosotros.vision}</p>
                  )}
                </div>
              </ScrollRevealItem>
            </ScrollRevealStagger>
          </div>
        </section>
      )}

      {/* Valores */}
      {nosotros.valores && nosotros.valores.length > 0 && (
        <section className="bg-white py-20 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <ScrollReveal>
              <h2 className="font-display text-3xl md:text-4xl font-normal text-gray-900">
                Nuestros Valores
              </h2>
            </ScrollReveal>
            <ScrollRevealStagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {nosotros.valores.map((valor) => (
                <ScrollRevealItem key={valor.id}>
                  <div className="rounded-3xl border border-gray-100 p-6">
                    <h3 className="font-display text-lg font-medium text-gray-900">
                      {valor.titulo}
                    </h3>
                    {valor.descripcion && (
                      <p className="mt-2 leading-relaxed text-gray-500">{valor.descripcion}</p>
                    )}
                  </div>
                </ScrollRevealItem>
              ))}
            </ScrollRevealStagger>
          </div>
        </section>
      )}

      {/* Consejo Directivo */}
      {nosotros.consejoDirectivo && nosotros.consejoDirectivo.length > 0 && (
        <section className="bg-gray-50 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <ScrollReveal>
              <h2 className="font-display text-3xl md:text-4xl font-normal text-gray-900">
                Consejo Directivo
              </h2>
            </ScrollReveal>
            <ScrollRevealStagger className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {nosotros.consejoDirectivo.map((miembro) => {
                const fotoUrl = getMediaUrl(miembro.foto)
                return (
                  <ScrollRevealItem key={miembro.id}>
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-52 w-40 items-center justify-center overflow-hidden rounded-3xl bg-pradera-100">
                        {fotoUrl ? (
                          <Image
                            src={fotoUrl}
                            alt={miembro.nombre}
                            width={160}
                            height={208}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <UserIcon className="h-10 w-10 text-pradera-400" />
                        )}
                      </div>
                      <h3 className="font-display text-base font-medium text-gray-900">
                        {miembro.nombre}
                      </h3>
                      <p className="mt-1 text-sm text-gray-400">{miembro.cargo}</p>
                    </div>
                  </ScrollRevealItem>
                )
              })}
            </ScrollRevealStagger>
          </div>
        </section>
      )}
    </>
  )
}
