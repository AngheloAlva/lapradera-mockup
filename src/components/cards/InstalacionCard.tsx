import Image from 'next/image'
import Link from 'next/link'
import { Users, CalendarCheck } from 'lucide-react'

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

interface InstalacionCardProps {
  instalacion: Instalacione
}

function getImageUrl(media: number | Media): string | null {
  if (typeof media === 'number') return null
  return media?.url ?? (media?.filename ? `/api/media/file/${media.filename}` : null)
}

export function InstalacionCard({ instalacion }: InstalacionCardProps) {
  const firstImage = instalacion.imagenes?.[0]
  const imageMedia = firstImage?.imagen
  const imageUrl = imageMedia ? getImageUrl(imageMedia) : null
  const imageAlt = firstImage?.alt ?? instalacion.nombre

  const isMantenimiento = instalacion.estado === 'mantenimiento'

  return (
    <Link
      href={`/instalaciones/${instalacion.slug}`}
      className="group relative block aspect-10/11 overflow-hidden rounded-3xl"
    >
      {/* Image — covers entire card */}
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      ) : (
        <div className="absolute inset-0 bg-pradera-100 flex items-center justify-center text-pradera-300">
          <span className="text-sm">Sin imagen</span>
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent" />

      {/* Category badge — top right */}
      <span className="absolute top-3 right-3 font-semibold backdrop-blur-xs bg-black/10 rounded-full border border-white px-4 py-2 text-xs uppercase tracking-wide text-white">
        {CATEGORIA_LABELS[instalacion.categoria]}
      </span>

      {/* Estado badge — top left */}
      {isMantenimiento && (
        <span className="absolute top-3 left-3 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
          En Mantenimiento
        </span>
      )}

      {/* Content — bottom left */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-display text-xl font-medium text-white drop-shadow-lg">
          {instalacion.nombre}
        </h3>

        <div className="mt-2 flex items-center gap-4 text-sm text-white/80">
          {instalacion.capacidad != null && (
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {instalacion.capacidad} personas
            </span>
          )}

          {instalacion.esReservable && (
            <span className="flex items-center gap-1">
              <CalendarCheck className="h-4 w-4" />
              Reservable
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
