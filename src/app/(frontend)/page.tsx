import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@payload-config'

import type { Homepage, Media } from '@/payload-types'

import { HeroSlider } from '@/components/sections/HeroSlider'
import { InstalacionesDestacadas } from '@/components/sections/InstalacionesDestacadas'
import { ServiciosDestacados } from '@/components/sections/ServiciosDestacados'
import { SociosCTA } from '@/components/sections/SociosCTA'
import { ProximosEventos } from '@/components/sections/ProximosEventos'
import { CTABanner } from '@/components/sections/CTABanner'
import { GaleriaPreview } from '@/components/sections/GaleriaPreview'
import { ScrollReveal } from '@/lib/motion'

function getMediaUrl(media: number | Media | null | undefined): string | null {
  if (!media || typeof media === 'number') return null
  return media?.url ?? (media?.filename ? `/api/media/file/${media.filename}` : null)
}

export default async function HomePage() {
  const payload = await getPayload({ config })

  // Fetch all data in parallel
  const [homepage, instalacionesResult, eventosResult, galeriasResult] = await Promise.all([
    payload.findGlobal({ slug: 'homepage' }) as Promise<Homepage>,
    payload.find({
      collection: 'instalaciones',
      where: { destacado: { equals: true } },
      sort: 'orden',
      limit: 6,
    }),
    payload.find({
      collection: 'eventos',
      where: { estado: { equals: 'proximo' } },
      sort: 'fechaInicio',
      limit: 4,
    }),
    payload.find({
      collection: 'galerias',
      where: { publicado: { equals: true } },
      sort: '-fecha',
      limit: 3,
      depth: 2,
    }),
  ])

  const bienvenida = homepage?.seccionBienvenida
  const bienvenidaImageUrl = getMediaUrl(bienvenida?.imagen)
  const bienvenidaImageAlt =
    bienvenida?.imagen && typeof bienvenida.imagen !== 'number'
      ? (bienvenida.imagen.alt ?? 'La Pradera Country Club')
      : 'La Pradera Country Club'

  return (
    <>
      {/* Hero Slider */}
      <HeroSlider slides={homepage?.heroSlider} />

      {/* Welcome Section */}
      {bienvenida?.titulo && (
        <section className="bg-white py-20 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              {/* Text */}
              <ScrollReveal>
                <span className="inline-block rounded-full border border-pradera-400 px-5 bg-pradera-50 py-2 text-xs font-medium text-pradera-600 uppercase tracking-widest mb-6">
                  Nosotros
                </span>
                <h2 className="font-display text-3xl md:text-4xl lg:text-[2.75rem] italic font-normal leading-snug text-gray-900">
                  {bienvenida.titulo}
                </h2>
                {bienvenida.descripcion && (
                  <div className="mt-6 text-sm leading-relaxed text-gray-500 max-w-lg">
                    {/* Placeholder: Lexical rich text rendering will be added later */}
                    <p>{extractPlainText(bienvenida.descripcion)}</p>
                  </div>
                )}
              </ScrollReveal>

              {/* Image */}
              {bienvenidaImageUrl && (
                <ScrollReveal delay={0.2} className="relative">
                  <div className="absolute -bottom-4 -right-4 h-full w-full rounded-3xl bg-pradera-200" />
                  <div className="relative aspect-4/3 overflow-hidden rounded-3xl shadow-lg">
                    <Image
                      src={bienvenidaImageUrl}
                      alt={bienvenidaImageAlt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Featured Installations - Bento Grid */}
      <InstalacionesDestacadas
        titulo={homepage?.seccionInstalaciones?.titulo}
        subtitulo={homepage?.seccionInstalaciones?.subtitulo}
        instalaciones={instalacionesResult.docs}
      />

      {/* Guest Services */}
      <ServiciosDestacados />

      {/* Upcoming Events - Carousel */}
      <ProximosEventos
        titulo={homepage?.seccionEventos?.titulo}
        subtitulo={homepage?.seccionEventos?.subtitulo}
        eventos={eventosResult.docs}
      />

      {/* Member Benefits CTA */}
      <SociosCTA />

      {/* CTA Banner */}
      {homepage?.bannerCTA?.titulo && (
        <CTABanner
          titulo={homepage.bannerCTA.titulo}
          descripcion={homepage.bannerCTA.descripcion}
          textoBoton={homepage.bannerCTA.textoBoton}
          enlaceBoton={homepage.bannerCTA.enlaceBoton}
          imagenFondo={homepage.bannerCTA.imagenFondo}
        />
      )}

      {/* Gallery Preview */}
      <GaleriaPreview galerias={galeriasResult.docs} />
    </>
  )
}

/**
 * Extracts plain text from a Lexical rich text root node.
 * Temporary solution until proper Lexical rendering is implemented.
 */
function extractPlainText(
  richText: NonNullable<Homepage['seccionBienvenida']>['descripcion'],
): string {
  if (!richText?.root?.children) return ''

  function extractFromNode(node: Record<string, unknown>): string {
    if (typeof node.text === 'string') return node.text
    if (Array.isArray(node.children)) {
      return node.children.map((child: Record<string, unknown>) => extractFromNode(child)).join('')
    }
    return ''
  }

  return richText.root.children
    .map((child) => extractFromNode(child as Record<string, unknown>))
    .join('\n')
}
