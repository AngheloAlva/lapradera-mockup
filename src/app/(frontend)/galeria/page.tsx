import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Images } from 'lucide-react'
import { ScrollReveal, ScrollRevealStagger, ScrollRevealItem } from '@/lib/motion'
import { PageHero } from '@/components/sections/PageHero'

import type { Media } from '@/payload-types'
import { GaleriaAlbum } from '@/components/sections/GaleriaAlbum'

export const metadata: Metadata = {
  title: 'Galería de Fotos | La Pradera Country Club',
  description:
    'Explora la galería de fotos de La Pradera Country Club: eventos, instalaciones y momentos especiales.',
}

export default async function GaleriaPage() {
  const payload = await getPayload({ config })

  const { docs: galerias } = await payload.find({
    collection: 'galerias',
    where: { publicado: { equals: true } },
    sort: '-fecha',
    limit: 50,
    depth: 2,
  })

  const heroImages = galerias
    .slice(0, 3)
    .map((g) => {
      const firstImg = g.imagenes?.[0]
      if (!firstImg?.imagen || typeof firstImg.imagen === 'number') return null
      const url = (firstImg.imagen as Media)?.url ?? null
      return url ? { url, alt: (firstImg.imagen as Media)?.alt ?? g.titulo } : null
    })
    .filter(Boolean) as Array<{ url: string; alt: string }>

  return (
    <>
      {/* Page Header */}
      <PageHero
        badge="Galeria"
        title="Galeria de Fotos"
        description="Revive los mejores momentos del club a traves de nuestra galeria fotografica."
        images={heroImages}
      />

      {/* Gallery Grid */}
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          {galerias.length > 0 ? (
            <ScrollRevealStagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {galerias.map((galeria) => (
                <ScrollRevealItem key={galeria.id}>
                  <GaleriaAlbum
                    titulo={galeria.titulo}
                    descripcion={galeria.descripcion}
                    fecha={galeria.fecha}
                    imagenes={galeria.imagenes ?? []}
                  />
                </ScrollRevealItem>
              ))}
            </ScrollRevealStagger>
          ) : (
            <div className="py-16 text-center">
              <Images className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h2 className="font-display text-xl font-medium text-gray-500">
                No hay galerías publicadas
              </h2>
              <p className="mt-2 text-gray-400">
                Pronto compartiremos fotos de nuestras actividades.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
