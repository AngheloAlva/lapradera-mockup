'use client'

import Link from 'next/link'
import { ArrowRight, MapPin, Shield, PartyPopper } from 'lucide-react'
import type { ReactNode } from 'react'

import { ScrollReveal, ScrollRevealStagger, ScrollRevealItem } from '@/lib/motion'

interface BenefitItem {
  icon: ReactNode
  title: string
  description: string
}

const BENEFITS: BenefitItem[] = [
  {
    icon: <MapPin className="h-5 w-5 text-white" />,
    title: 'Reservas Prioritarias',
    description: 'Acceso preferencial a todas las instalaciones y servicios del club.',
  },
  {
    icon: <Shield className="h-5 w-5 text-white" />,
    title: 'Lounge Exclusivo',
    description: 'Espacios privados diseñados para el confort y la exclusividad de nuestros socios.',
  },
  {
    icon: <PartyPopper className="h-5 w-5 text-white" />,
    title: 'Eventos Privados',
    description: 'Invitaciones a eventos sociales, culturales y deportivos exclusivos para miembros.',
  },
] as const

export function SociosCTA() {
  return (
    <section className="px-6 py-20 md:py-32">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-4xl bg-pradera-800 px-8 py-16 md:px-16 md:py-20">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <ScrollReveal>
            <span className="mb-4 inline-block rounded-full border border-pradera-500 bg-pradera-700 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-pradera-200">
              Acceso Prioritario
            </span>
            <h2 className="font-display text-3xl font-normal italic leading-snug text-white md:text-4xl lg:text-5xl">
              Beneficios Exclusivos para Socios
            </h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-pradera-200">
              Únete a nuestra comunidad y accede a privilegios diseñados para
              ofrecerte la mejor experiencia en cada visita.
            </p>
            <Link
              href="/membresia"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-white hover:text-pradera-800"
            >
              Hazte Socio
              <ArrowRight className="h-4 w-4" />
            </Link>
          </ScrollReveal>

          <ScrollRevealStagger className="flex flex-col gap-8">
            {BENEFITS.map((benefit) => (
              <ScrollRevealItem key={benefit.title}>
                <div className="flex gap-5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pradera-600">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-heading text-base font-bold text-white">
                      {benefit.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-pradera-200">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </ScrollRevealItem>
            ))}
          </ScrollRevealStagger>
        </div>
      </div>
    </section>
  )
}
