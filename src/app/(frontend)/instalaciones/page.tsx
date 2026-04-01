import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ScrollReveal, ScrollRevealStagger, ScrollRevealItem } from '@/lib/motion'
import { PageHero } from '@/components/sections/PageHero'

import type { Instalacione, Media } from '@/payload-types'
import { InstalacionCard } from '@/components/cards/InstalacionCard'

export const metadata: Metadata = {
  title: 'Nuestras Áreas/Servicios | La Pradera Country Club',
  description:
    'Descubre todas las instalaciones del club: piscinas, canchas deportivas, bungalos, salones y más. Espacios para toda la familia.',
}

async function getInstalaciones(): Promise<Instalacione[]> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'instalaciones',
    sort: 'orden',
    limit: 100,
    where: {
      estado: {
        not_equals: 'no-disponible',
      },
    },
  })
  return result.docs
}

export default async function InstalacionesPage() {
  const instalaciones = await getInstalaciones()

  const heroImages = instalaciones
    .slice(0, 3)
    .map((inst) => {
      const firstImg = inst.imagenes?.[0]
      const media = firstImg?.imagen
      if (!media || typeof media === 'number') return null
      const url = media?.url ?? null
      return url ? { url, alt: firstImg?.alt ?? inst.nombre } : null
    })
    .filter(Boolean) as Array<{ url: string; alt: string }>

  return (
    <>
      {/* Page Header */}
      <PageHero
        badge="Áreas/Servicios"
        title="Nuestras Áreas/Servicios"
        description="Conoce los espacios que tenemos para ti y tu familia. Áreas/Servicios deportivas, áreas recreativas y mucho más."
        images={heroImages}
      />

      {/* Grid */}
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          {instalaciones.length > 0 ? (
            <ScrollRevealStagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {instalaciones.map((instalacion) => (
                <ScrollRevealItem key={instalacion.id}>
                  <InstalacionCard instalacion={instalacion} />
                </ScrollRevealItem>
              ))}
            </ScrollRevealStagger>
          ) : (
            <div className="py-16 text-center">
              <p className="font-display text-xl font-medium text-gray-500">
                No hay instalaciones disponibles en este momento.
              </p>
              <p className="mt-2 text-gray-400">Pronto actualizaremos la información.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
