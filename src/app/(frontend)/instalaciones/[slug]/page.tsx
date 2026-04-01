import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { CalendarCheck, Users } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { ScrollReveal } from '@/lib/motion'
import { ImageGallery } from '@/components/sections/ImageGallery'
import type { Instalacione, Media } from '@/payload-types'

const CATEGORIA_LABELS: Record<Instalacione['categoria'], string> = {
  bungalo: 'Bungalo',
  piscina: 'Piscina',
  'cancha-tenis': 'Cancha de Tenis',
  'cancha-futbol': 'Cancha de Fútbol',
  'cancha-multiuso': 'Cancha Multiuso',
  fronton: 'Frontón',
  camping: 'Camping',
  camper: 'Camper',
  salon: 'Salón',
  playa: 'Playa',
  sauna: 'Sauna',
  'club-house': 'Club House',
  capilla: 'Capilla',
  otro: 'Otro',
} as const

const ESTADO_CONFIG = {
  disponible: { label: 'Disponible', className: 'bg-green-50 text-green-700' },
  mantenimiento: { label: 'En Mantenimiento', className: 'bg-amber-50 text-amber-700' },
  'no-disponible': { label: 'No Disponible', className: 'bg-red-50 text-red-700' },
} as const

function getImageUrl(media: number | Media): string | null {
  if (typeof media === 'number') return null
  return media?.url ?? (media?.filename ? `/api/media/file/${media.filename}` : null)
}

async function getInstalacion(slug: string): Promise<Instalacione | null> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'instalaciones',
    where: {
      slug: { equals: slug },
    },
    limit: 1,
  })
  return result.docs[0] ?? null
}

export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'instalaciones',
    limit: 100,
  })
  return result.docs.map((doc) => ({ slug: doc.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const instalacion = await getInstalacion(slug)

  if (!instalacion) {
    return { title: 'Instalación no encontrada | La Pradera Country Club' }
  }

  return {
    title: `${instalacion.nombre} | Áreas/Servicios | La Pradera Country Club`,
    description: `${CATEGORIA_LABELS[instalacion.categoria]} — ${instalacion.nombre} en La Pradera Country Club.${instalacion.capacidad ? ` Capacidad: ${instalacion.capacidad} personas.` : ''}`,
  }
}

export default async function InstalacionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const instalacion = await getInstalacion(slug)

  if (!instalacion) {
    notFound()
  }

  const galleryImages = (instalacion.imagenes ?? [])
    .map((img) => {
      const url = img.imagen ? getImageUrl(img.imagen) : null
      if (!url) return null
      return { url, alt: img.alt ?? instalacion.nombre }
    })
    .filter(Boolean) as Array<{ url: string; alt: string }>

  const estado = instalacion.estado ?? 'disponible'
  const estadoConfig = ESTADO_CONFIG[estado]

  return (
    <div className="px-6 pb-20 md:pb-32">
      <div className="mx-auto max-w-7xl">
        {/* Image Gallery */}
        <ImageGallery images={galleryImages} backHref="/instalaciones" backLabel="Volver" />

        {/* Content */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Title */}
            <ScrollReveal>
              <h1 className="mb-6 font-display text-3xl font-normal text-gray-900 md:text-4xl">
                {instalacion.nombre}
              </h1>
            </ScrollReveal>

            {/* Description */}
            {instalacion.descripcion && (
              <ScrollReveal>
                <div className="prose mb-10 max-w-none prose-headings:font-display prose-headings:text-gray-900">
                  <RichText data={instalacion.descripcion} />
                </div>
              </ScrollReveal>
            )}

            {/* Tarifas Table */}
            {instalacion.esReservable && instalacion.tarifas && instalacion.tarifas.length > 0 && (
              <ScrollReveal>
                <div className="mb-10">
                  <h2 className="font-display text-xl font-medium text-gray-900">Tarifas</h2>
                  <div className="mt-4 overflow-hidden rounded-3xl bg-white shadow-sm">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          <th className="px-6 py-3 text-sm font-semibold text-gray-900">
                            Concepto
                          </th>
                          <th className="px-6 py-3 text-sm font-semibold text-gray-900">Precio</th>
                          <th className="px-6 py-3 text-sm font-semibold text-gray-900">Moneda</th>
                        </tr>
                      </thead>
                      <tbody>
                        {instalacion.tarifas.map((tarifa, index) => (
                          <tr
                            key={tarifa.id ?? index}
                            className="border-b border-gray-50 even:bg-gray-50/50"
                          >
                            <td className="px-6 py-3 text-sm text-gray-500">{tarifa.concepto}</td>
                            <td className="px-6 py-3 text-sm font-medium text-gray-900">
                              {tarifa.precio.toFixed(2)}
                            </td>
                            <td className="px-6 py-3 text-sm text-gray-500">
                              {tarifa.moneda ?? 'PEN'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Badges */}
            <ScrollReveal>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-pradera-50 px-3 py-1.5 text-sm font-medium text-pradera-600">
                  {CATEGORIA_LABELS[instalacion.categoria]}
                </span>
                <span
                  className={`rounded-full px-3 py-1.5 text-sm font-medium ${estadoConfig.className}`}
                >
                  {estadoConfig.label}
                </span>
              </div>
            </ScrollReveal>

            {/* Info */}
            <ScrollReveal>
              <dl className="space-y-4">
                {instalacion.capacidad != null && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Capacidad
                      </dt>
                      <dd className="text-sm font-semibold text-gray-900">
                        {instalacion.capacidad} personas
                      </dd>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
                    <CalendarCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Reservable
                    </dt>
                    <dd className="text-sm font-semibold text-gray-900">
                      {instalacion.esReservable ? 'Sí' : 'No'}
                    </dd>
                  </div>
                </div>
              </dl>
            </ScrollReveal>

            {/* Amenidades */}
            {instalacion.amenidades && instalacion.amenidades.length > 0 && (
              <ScrollReveal>
                <h2 className="font-display text-sm font-medium uppercase tracking-widest text-gray-400">
                  Amenidades
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {instalacion.amenidades.map((amenidad) => (
                    <span
                      key={amenidad.id ?? amenidad.nombre}
                      className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                    >
                      {amenidad.nombre}
                    </span>
                  ))}
                </div>
              </ScrollReveal>
            )}

            {/* CTA Consultar */}
            {instalacion.esReservable && estado === 'disponible' && (
              <ScrollReveal>
                <Link
                  href="/contacto"
                  className="block w-full rounded-full bg-pradera-600 px-6 py-3.5 text-center text-lg font-semibold text-white transition-colors hover:bg-pradera-700"
                >
                  Consultar Disponibilidad
                </Link>
              </ScrollReveal>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}
