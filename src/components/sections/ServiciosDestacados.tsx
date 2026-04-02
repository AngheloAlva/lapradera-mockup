'use client'

import Link from 'next/link'
import { ArrowRight, Utensils, CalendarCheck, Flower2 } from 'lucide-react'
import type { ReactNode } from 'react'

import { ScrollReveal, ScrollRevealStagger, ScrollRevealItem } from '@/lib/motion'

interface ServicioItem {
  icon: ReactNode
  title: string
  description: string
  cta: string
  href: string
}

const SERVICIOS: ServicioItem[] = [
  {
    icon: <Utensils className="h-6 w-6 text-pradera-600" />,
    title: 'Gastronomía',
    description:
      'Experiencias culinarias excepcionales con ingredientes frescos y de temporada en nuestros restaurantes exclusivos.',
    cta: 'Reservar Mesa',
    href: '/servicios/gastronomia',
  },
  {
    icon: <CalendarCheck className="h-6 w-6 text-pradera-600" />,
    title: 'Eventos Privados',
    description:
      'Espacios versátiles y elegantes para celebrar tus momentos más importantes con un servicio personalizado.',
    cta: 'Planificar Evento',
    href: '/servicios/eventos',
  },
  {
    icon: <Flower2 className="h-6 w-6 text-pradera-600" />,
    title: 'Bienestar',
    description:
      'Programas de wellness, spa y actividades al aire libre diseñados para renovar cuerpo y mente.',
    cta: 'Ver Programas',
    href: '/servicios/bienestar',
  },
] as const

export function ServiciosDestacados() {
  return (
    <section className="bg-crema py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <div className="mb-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl font-normal italic text-gray-900 md:text-4xl lg:text-5xl">
                Servicios Exclusivos para Socios
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-gray-500">
                Cada detalle está pensado para ofrecerte una experiencia excepcional. Descubre los
                servicios que hacen de La Pradera un lugar único.
              </p>
            </div>
            <Link
              href="/servicios"
              className="inline-flex h-fit items-center gap-2 rounded-full border border-pradera-600 px-6 py-3 text-sm font-semibold uppercase tracking-wider text-pradera-600 transition hover:bg-pradera-600 hover:text-white"
            >
              Ver Todos los Servicios
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </ScrollReveal>

        <ScrollRevealStagger className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {SERVICIOS.map((servicio) => (
            <ScrollRevealItem key={servicio.title}>
              <div className="flex h-full flex-col rounded-3xl bg-white p-8">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-pradera-100">
                  {servicio.icon}
                </div>
                <h3 className="font-heading text-lg font-bold text-gray-900">{servicio.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-500">
                  {servicio.description}
                </p>
                <Link
                  href={servicio.href}
                  className="mt-6 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-pradera-600 transition hover:gap-2"
                >
                  {servicio.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </ScrollRevealItem>
          ))}
        </ScrollRevealStagger>
      </div>
    </section>
  )
}
