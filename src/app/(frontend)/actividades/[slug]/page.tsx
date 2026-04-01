import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, MapPin, Calendar, Users } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { ScrollReveal } from '@/lib/motion'

import type { Evento, Media } from '@/payload-types'

const ESTADO_LABEL = {
  proximo: 'Pr\u00f3ximo',
  'en-curso': 'En Curso',
  finalizado: 'Finalizado',
  cancelado: 'Cancelado',
} as const

const TIPO_LABEL = {
  social: 'Social',
  deportivo: 'Deportivo',
  cultural: 'Cultural',
  gastronomico: 'Gastron\u00f3mico',
  institucional: 'Institucional',
} as const

function getMediaUrl(media: number | Media): string | null {
  if (typeof media === 'number') return null
  return media?.url ?? (media?.filename ? `/api/media/file/${media.filename}` : null)
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr))
}

function formatDateTime(dateStr: string): string {
  return new Intl.DateTimeFormat('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getEvento(slug: string): Promise<Evento | null> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'eventos',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return docs[0] ?? null
}

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'eventos',
    limit: 100,
    select: { slug: true },
  })
  return docs.map((evento) => ({ slug: evento.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const evento = await getEvento(slug)
  if (!evento) return { title: 'Evento no encontrado' }

  return {
    title: `${evento.titulo} | Actividades | La Pradera Country Club`,
    description: evento.resumen ?? `Evento: ${evento.titulo} en La Pradera Country Club.`,
  }
}

export default async function EventoDetailPage({ params }: PageProps) {
  const { slug } = await params
  const evento = await getEvento(slug)

  if (!evento) notFound()

  const imageUrl = getMediaUrl(evento.imagenPortada)
  const imageAlt =
    typeof evento.imagenPortada !== 'number' ? evento.imagenPortada?.alt : evento.titulo

  return (
    <>
      {/* Hero */}
      {imageUrl ? (
        <section className="px-4 max-w-7xl mx-auto pt-6 md:px-14 lg:px-20">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="relative h-[350px] md:h-[500px] lg:h-[560px]">
              <Image
                src={imageUrl}
                alt={imageAlt ?? evento.titulo}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            </div>

            {/* Back button */}
            <Link
              href="/actividades"
              className="absolute top-6 left-6 z-10 inline-flex items-center gap-2 rounded-full bg-black/40 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm hover:bg-black/60"
            >
              <ArrowLeft className="h-4 w-4" />
              Actividades
            </Link>

            {/* Title + Badges */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {evento.tipo && (
                  <span className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                    {TIPO_LABEL[evento.tipo]}
                  </span>
                )}
                {evento.estado && (
                  <span className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                    {ESTADO_LABEL[evento.estado]}
                  </span>
                )}
              </div>
              <h1 className="font-display text-3xl font-normal text-white md:text-4xl lg:text-5xl">
                {evento.titulo}
              </h1>
            </div>
          </div>
        </section>
      ) : (
        <section className="px-4 max-w-7xl mx-auto1 pt-6 md:px-14 lg:px-20">
          <div className="relative rounded-3xl bg-gray-100 p-10 md:p-16">
            {/* Back button */}
            <Link
              href="/actividades"
              className="absolute top-6 left-6 z-10 inline-flex items-center gap-2 rounded-full bg-black/10 px-4 py-2 text-sm font-medium text-gray-900 backdrop-blur-sm hover:bg-black/20"
            >
              <ArrowLeft className="h-4 w-4" />
              Actividades
            </Link>

            <div className="mt-10 flex flex-wrap items-center gap-2 mb-4">
              {evento.tipo && (
                <span className="rounded-full bg-black/10 px-4 py-1.5 text-xs font-medium text-gray-900">
                  {TIPO_LABEL[evento.tipo]}
                </span>
              )}
              {evento.estado && (
                <span className="rounded-full bg-black/10 px-4 py-1.5 text-xs font-medium text-gray-900">
                  {ESTADO_LABEL[evento.estado]}
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl font-normal text-gray-900 md:text-4xl lg:text-5xl">
              {evento.titulo}
            </h1>
          </div>
        </section>
      )}

      {/* Event Details */}
      <ScrollReveal as="section" className="px-4 max-w-7xl mx-auto pt-10 md:px-14 lg:px-20">
        <div className="rounded-3xl bg-gray-50 p-6 md:p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Fecha */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-gray-500">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Fecha</p>
                <p className="mt-1 text-sm text-gray-900">{formatDateTime(evento.fechaInicio)}</p>
                {evento.fechaFin && (
                  <p className="mt-0.5 text-sm text-gray-500">
                    hasta {formatDate(evento.fechaFin)}
                  </p>
                )}
              </div>
            </div>

            {/* Ubicacion */}
            {evento.ubicacion && (
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-gray-500">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Lugar
                  </p>
                  <p className="mt-1 text-sm text-gray-900">{evento.ubicacion}</p>
                </div>
              </div>
            )}

            {/* Cupo */}
            {evento.requiereInscripcion && (
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-gray-500">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Inscripci&oacute;n
                  </p>
                  <p className="mt-1 text-sm text-gray-900">
                    Requiere inscripci&oacute;n
                    {evento.cupoMaximo
                      ? ` \u2014 cupo m\u00e1ximo: ${evento.cupoMaximo} personas`
                      : ''}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* Description */}
      {evento.descripcion && (
        <ScrollReveal as="section" className="py-20 max-w-7xl mx-auto md:py-32">
          <div className="mx-auto max-w-3xl px-4 md:px-14 lg:px-20">
            <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-gray-900 prose-p:text-gray-500 prose-a:text-gray-900">
              <RichText data={evento.descripcion} />
            </div>
          </div>
        </ScrollReveal>
      )}
    </>
  )
}
