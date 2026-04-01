import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, User as UserIcon } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { ScrollReveal } from '@/lib/motion'

import type { Noticia, Media, User } from '@/payload-types'

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
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateStr))
}

function getAutorName(autor: number | User | null | undefined): string | null {
  if (!autor || typeof autor === 'number') return null
  return `${autor.nombre} ${autor.apellido}`
}

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getNoticia(slug: string): Promise<Noticia | null> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'noticias',
    where: {
      slug: { equals: slug },
      publicado: { equals: true },
    },
    limit: 1,
    depth: 2,
  })
  return docs[0] ?? null
}

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'noticias',
    where: { publicado: { equals: true } },
    limit: 100,
    select: { slug: true },
  })
  return docs.map((noticia) => ({ slug: noticia.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const noticia = await getNoticia(slug)
  if (!noticia) return { title: 'Noticia no encontrada' }

  return {
    title: `${noticia.titulo} | Noticias | La Pradera Country Club`,
    description: noticia.resumen ?? `Noticia: ${noticia.titulo}`,
  }
}

export default async function NoticiaDetailPage({ params }: PageProps) {
  const { slug } = await params
  const noticia = await getNoticia(slug)

  if (!noticia) notFound()

  const imageUrl = getMediaUrl(noticia.imagenPortada)
  const imageAlt =
    typeof noticia.imagenPortada !== 'number' && noticia.imagenPortada
      ? noticia.imagenPortada?.alt
      : noticia.titulo
  const autorName = getAutorName(noticia.autor)

  return (
    <article className="py-20 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        {/* Back Link */}
        <Link
          href="/noticias"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-400 transition hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Noticias
        </Link>

        {/* Header */}
        <ScrollReveal>
          <header className="mb-8">
            {noticia.categoria && (
              <span className="mb-3 inline-block rounded-full bg-pradera-50 px-3 py-1 text-xs font-medium text-pradera-600">
                {CATEGORIA_LABEL[noticia.categoria]}
              </span>
            )}

            <h1 className="font-display text-3xl font-normal text-gray-900 md:text-4xl lg:text-5xl">
              {noticia.titulo}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 shrink-0" />
                <time dateTime={noticia.fechaPublicacion}>
                  {formatDate(noticia.fechaPublicacion)}
                </time>
              </div>

              {autorName && (
                <div className="flex items-center gap-2">
                  <UserIcon className="h-4 w-4 shrink-0" />
                  <span>{autorName}</span>
                </div>
              )}
            </div>
          </header>
        </ScrollReveal>

        {/* Cover Image */}
        {imageUrl && (
          <ScrollReveal>
            <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-3xl">
              <Image
                src={imageUrl}
                alt={imageAlt ?? noticia.titulo}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority
              />
            </div>
          </ScrollReveal>
        )}

        {/* Content */}
        <ScrollReveal>
          <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-gray-900 prose-a:text-pradera-600">
            <RichText data={noticia.contenido} />
          </div>
        </ScrollReveal>
      </div>
    </article>
  )
}
