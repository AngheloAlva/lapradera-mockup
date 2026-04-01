import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Calendar } from 'lucide-react'

import type { Evento, Media } from '@/payload-types'

const ESTADO_BADGE = {
  proximo: 'bg-pradera-50 text-pradera-600',
  'en-curso': 'bg-blue-100 text-blue-800',
  finalizado: 'bg-gray-100 text-gray-800',
  cancelado: 'bg-red-100 text-red-800',
} as const

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
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr))
}

interface EventoCardProps {
  evento: Evento
}

export function EventoCard({ evento }: EventoCardProps) {
  const imageUrl = getMediaUrl(evento.imagenPortada)
  const imageAlt =
    typeof evento.imagenPortada !== 'number' ? evento.imagenPortada?.alt : evento.titulo

  return (
    <Link
      href={`/actividades/${evento.slug}`}
      className="group overflow-hidden flex flex-col rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-video overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt ?? evento.titulo}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100">
            <Calendar className="h-12 w-12 text-gray-300" />
          </div>
        )}
        {evento.estado && (
          <span
            className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-medium ${ESTADO_BADGE[evento.estado]}`}
          >
            {ESTADO_LABEL[evento.estado]}
          </span>
        )}
      </div>

      <div className="p-5">
        {evento.tipo && (
          <span className="mb-2 inline-block rounded-full bg-pradera-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-pradera-600">
            {TIPO_LABEL[evento.tipo]}
          </span>
        )}

        <h3 className="mb-2 font-display text-xl font-normal text-gray-900 group-hover:text-pradera-600">
          {evento.titulo}
        </h3>

        <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4 shrink-0" />
          <span>{formatDate(evento.fechaInicio)}</span>
        </div>

        {evento.ubicacion && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin className="h-4 w-4 shrink-0" />
            <span>{evento.ubicacion}</span>
          </div>
        )}

        {evento.resumen && (
          <p className="mt-3 line-clamp-2 text-sm text-gray-500">{evento.resumen}</p>
        )}
      </div>
    </Link>
  )
}
