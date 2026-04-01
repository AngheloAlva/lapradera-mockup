import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Newspaper } from 'lucide-react'
import { ScrollReveal, ScrollRevealStagger, ScrollRevealItem } from '@/lib/motion'
import { PageHero } from '@/components/sections/PageHero'

import type { Media } from '@/payload-types'
import { NoticiaCard } from '@/components/cards/NoticiaCard'

export const metadata: Metadata = {
  title: 'Noticias y Comunicados | La Pradera Country Club',
  description:
    'Mantente informado con las últimas noticias y comunicados de La Pradera Country Club.',
}

export default async function NoticiasPage() {
  const payload = await getPayload({ config })

  const { docs: noticias } = await payload.find({
    collection: 'noticias',
    where: { publicado: { equals: true } },
    sort: '-fechaPublicacion',
    limit: 50,
  })

  const heroImages = noticias
    .slice(0, 2)
    .map((n) => {
      if (!n.imagenPortada || typeof n.imagenPortada === 'number') return null
      const url = (n.imagenPortada as Media)?.url ?? null
      return url ? { url, alt: (n.imagenPortada as Media)?.alt ?? n.titulo } : null
    })
    .filter(Boolean) as Array<{ url: string; alt: string }>

  const featured = noticias[0] ?? null
  const rest = noticias.slice(1)

  return (
    <>
      {/* Page Header */}
      <PageHero
        badge="Noticias"
        title="Noticias y Comunicados"
        description="Entérate de las últimas novedades, comunicados y avisos importantes del club."
        images={heroImages}
      />

      {/* Content */}
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          {noticias.length > 0 ? (
            <div className="space-y-10">
              {/* Featured Noticia */}
              {featured && (
                <ScrollReveal>
                  <NoticiaCard noticia={featured} featured />
                </ScrollReveal>
              )}

              {/* Rest Grid */}
              {rest.length > 0 && (
                <ScrollRevealStagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((noticia) => (
                    <ScrollRevealItem key={noticia.id}>
                      <NoticiaCard noticia={noticia} />
                    </ScrollRevealItem>
                  ))}
                </ScrollRevealStagger>
              )}
            </div>
          ) : (
            <div className="py-16 text-center">
              <Newspaper className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h2 className="font-display text-xl font-medium text-gray-500">
                No hay noticias publicadas
              </h2>
              <p className="mt-2 text-gray-400">
                Pronto publicaremos novedades. Vuelve a visitarnos.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
