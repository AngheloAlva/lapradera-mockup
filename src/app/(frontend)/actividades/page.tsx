import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Calendar } from 'lucide-react'
import { ScrollReveal, ScrollRevealStagger, ScrollRevealItem } from '@/lib/motion'
import { PageHero } from '@/components/sections/PageHero'

import type { Media } from '@/payload-types'
import { EventoCard } from '@/components/cards/EventoCard'

export const metadata: Metadata = {
  title: 'Actividades y Eventos | La Pradera Country Club',
  description:
    'Descubre las actividades y eventos que La Pradera Country Club tiene preparados para ti y tu familia.',
}

export default async function ActividadesPage() {
  const payload = await getPayload({ config })

  const { docs: eventos } = await payload.find({
    collection: 'eventos',
    sort: '-fechaInicio',
    limit: 50,
  })

  const heroImages = eventos
    .slice(0, 1)
    .map((ev) => {
      if (!ev.imagenPortada || typeof ev.imagenPortada === 'number') return null
      const url = ev.imagenPortada?.url ?? null
      return url ? { url, alt: (ev.imagenPortada as Media)?.alt ?? ev.titulo } : null
    })
    .filter(Boolean) as Array<{ url: string; alt: string }>

  return (
    <>
      {/* Page Header */}
      <PageHero
        badge="Actividades"
        title="Actividades y Eventos"
        description="Participa en nuestras actividades sociales, deportivas y culturales organizadas para todos los socios y sus familias."
        images={heroImages}
      />

      {/* Events Grid */}
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          {eventos.length > 0 ? (
            <ScrollRevealStagger className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {eventos.map((evento) => (
                <ScrollRevealItem key={evento.id}>
                  <EventoCard evento={evento} />
                </ScrollRevealItem>
              ))}
            </ScrollRevealStagger>
          ) : (
            <div className="py-16 text-center">
              <Calendar className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h2 className="font-display text-xl font-medium text-gray-500">
                No hay eventos programados
              </h2>
              <p className="mt-2 text-gray-400">
                Pronto publicaremos nuevas actividades. Vuelve a visitarnos.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
