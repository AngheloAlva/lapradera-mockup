import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import type { Evento } from '@/payload-types'

import { EventoCard } from '@/components/cards/EventoCard'
import { ScrollReveal, ScrollRevealStagger, ScrollRevealItem } from '@/lib/motion'

interface ProximosEventosProps {
  titulo?: string | null
  subtitulo?: string | null
  eventos: Evento[]
}

export function ProximosEventos({ titulo, subtitulo, eventos }: ProximosEventosProps) {
  if (eventos.length === 0) return null

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <ScrollReveal className="mb-16 text-center">
          {titulo && (
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-normal text-gray-900">
              {titulo}
            </h2>
          )}
          {subtitulo && <p className="mx-auto mt-3 max-w-2xl text-gray-400">{subtitulo}</p>}
        </ScrollReveal>

        {/* Grid */}
        <ScrollRevealStagger className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {eventos.map((evento) => (
            <ScrollRevealItem key={evento.id}>
              <EventoCard evento={evento} />
            </ScrollRevealItem>
          ))}
        </ScrollRevealStagger>

        {/* CTA */}
        <ScrollReveal delay={0.3} className="mt-12 text-center">
          <Link
            href="/actividades"
            className="inline-flex items-center gap-2 rounded-full bg-pradera-600 px-8 py-4.5 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-pradera-700"
          >
            Ver todas las actividades
            <ArrowRight className="h-4 w-4" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
