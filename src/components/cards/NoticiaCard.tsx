import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Newspaper } from 'lucide-react'

import type { Noticia, Media } from '@/payload-types'

const CATEGORIA_LABEL = {
  comunicado: 'Comunicado',
  noticia: 'Noticia',
  aviso: 'Aviso',
  mantenimiento: 'Mantenimiento',
} as const

function getMediaUrl(media: number | Media | null | undefined): string | null {
  if (!media || typeof media === 'number') return null
  return media?.url ?? (media?.filename ? `/api/media/file/${media.filename}` : null)
}

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('es-PE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr))
}

interface NoticiaCardProps {
  noticia: Noticia
  featured?: boolean
}

export function NoticiaCard({ noticia, featured = false }: NoticiaCardProps) {
  const imageUrl = getMediaUrl(noticia.imagenPortada)
  const imageAlt =
    typeof noticia.imagenPortada !== 'number' && noticia.imagenPortada
      ? noticia.imagenPortada?.alt
      : noticia.titulo

  if (featured) {
    return (
      <Link
        href={`/noticias/${noticia.slug}`}
        className="group grid overflow-hidden rounded-3xl bg-white shadow-sm transition hover:shadow-md md:grid-cols-2"
      >
        <div className="relative aspect-[16/9] overflow-hidden md:aspect-auto md:min-h-[320px]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={imageAlt ?? noticia.titulo}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100">
              <Newspaper className="h-16 w-16 text-pradera-300" />
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center p-6 md:p-8">
          {noticia.categoria && (
            <span className="mb-3 inline-block w-fit rounded-full bg-pradera-50 px-3 py-1 text-xs font-medium text-pradera-600">
              {CATEGORIA_LABEL[noticia.categoria]}
            </span>
          )}

          <h3 className="mb-3 font-display text-xl font-medium text-gray-900 group-hover:text-pradera-600 md:text-2xl">
            {noticia.titulo}
          </h3>

          {noticia.resumen && (
            <p className="mb-4 line-clamp-3 text-gray-500">{noticia.resumen}</p>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>{formatDate(noticia.fechaPublicacion)}</span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/noticias/${noticia.slug}`}
      className="group overflow-hidden rounded-3xl bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt ?? noticia.titulo}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gray-100">
            <Newspaper className="h-12 w-12 text-pradera-300" />
          </div>
        )}
      </div>

      <div className="p-5">
        {noticia.categoria && (
          <span className="mb-2 inline-block rounded-full bg-pradera-50 px-3 py-1 text-xs font-medium text-pradera-600">
            {CATEGORIA_LABEL[noticia.categoria]}
          </span>
        )}

        <h3 className="mb-2 font-display text-lg font-medium text-gray-900 group-hover:text-pradera-600">
          {noticia.titulo}
        </h3>

        {noticia.resumen && (
          <p className="mb-3 line-clamp-2 text-sm text-gray-500">{noticia.resumen}</p>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4 shrink-0" />
          <span>{formatDate(noticia.fechaPublicacion)}</span>
        </div>
      </div>
    </Link>
  )
}
