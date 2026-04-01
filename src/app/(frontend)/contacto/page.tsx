import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { FacebookIcon, InstagramIcon, YoutubeIcon } from '@/components/ui/SocialIcons'
import { ScrollReveal } from '@/lib/motion'
import { PageHero } from '@/components/sections/PageHero'

import type { SiteConfig, Media } from '@/payload-types'
import { ContactForm } from '@/components/sections/ContactForm'

export const metadata: Metadata = {
  title: 'Contacto | La Pradera Country Club',
  description:
    'Comunicate con La Pradera Country Club. Envianos un mensaje, llamanos o visitanos.',
}

interface ContactInfoItemProps {
  icon: React.ReactNode
  label: string
  value: string
}

function ContactInfoItem({ icon, label, value }: ContactInfoItemProps) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pradera-100">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-0.5 whitespace-pre-line text-gray-500">{value}</p>
      </div>
    </div>
  )
}

interface SocialLinkProps {
  href: string
  icon: React.ReactNode
  label: string
}

function SocialLink({ href, icon, label }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200"
    >
      {icon}
    </a>
  )
}

export default async function ContactoPage() {
  const payload = await getPayload({ config })
  const [siteConfig, instalacionesResult] = await Promise.all([
    payload.findGlobal({ slug: 'site-config' }) as Promise<SiteConfig>,
    payload.find({ collection: 'instalaciones', limit: 1, sort: 'orden' }),
  ])

  const contactHeroImages = instalacionesResult.docs
    .map((inst) => {
      const firstImg = inst.imagenes?.[0]
      if (!firstImg?.imagen || typeof firstImg.imagen === 'number') return null
      const media = firstImg.imagen as Media
      const url = media?.url ?? null
      return url ? { url, alt: media?.alt ?? inst.nombre } : null
    })
    .filter(Boolean) as Array<{ url: string; alt: string }>

  const socialLinks = [
    {
      url: siteConfig.redesSociales?.facebook,
      icon: <FacebookIcon className="h-5 w-5" />,
      label: 'Facebook',
    },
    {
      url: siteConfig.redesSociales?.instagram,
      icon: <InstagramIcon className="h-5 w-5" />,
      label: 'Instagram',
    },
    {
      url: siteConfig.redesSociales?.youtube,
      icon: <YoutubeIcon className="h-5 w-5" />,
      label: 'YouTube',
    },
  ].filter((link) => link.url)

  return (
    <>
      {/* Page Header */}
      <PageHero
        badge="Contacto"
        title="Contacto"
        description="Estamos para ayudarte. Envianos un mensaje o contactanos por cualquiera de nuestros canales."
        images={contactHeroImages}
      />

      {/* Two Column: Form + Info */}
      <section className="bg-gray-50 py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <ScrollReveal>
              <div>
                <h2 className="font-display text-2xl font-medium text-gray-900">
                  Envianos un mensaje
                </h2>
                <p className="mb-8 mt-2 text-gray-400">
                  Completa el formulario y te responderemos a la brevedad.
                </p>
                <ContactForm />
              </div>
            </ScrollReveal>

            {/* Contact Info Panel */}
            <ScrollReveal delay={0.15}>
              <div>
                <h2 className="font-display text-2xl font-medium text-gray-900">
                  Informacion de contacto
                </h2>
                <p className="mb-8 mt-2 text-gray-400">
                  Tambien puedes contactarnos directamente.
                </p>

                <div className="space-y-4">
                  {/* Club Name & Address */}
                  {siteConfig.direccion && (
                    <div className="rounded-3xl bg-white p-6">
                      <div className="mb-3 font-display text-lg font-medium text-gray-900">
                        {siteConfig.nombreClub}
                      </div>
                      <ContactInfoItem
                        icon={<MapPin className="h-5 w-5 text-pradera-600" />}
                        label="Direccion"
                        value={siteConfig.direccion}
                      />
                    </div>
                  )}

                  {/* Phone & Email */}
                  <div className="rounded-3xl bg-white p-6">
                    <div className="space-y-4">
                      {siteConfig.telefono && (
                        <ContactInfoItem
                          icon={<Phone className="h-5 w-5 text-pradera-600" />}
                          label="Telefono"
                          value={siteConfig.telefono}
                        />
                      )}
                      {siteConfig.email && (
                        <ContactInfoItem
                          icon={<Mail className="h-5 w-5 text-pradera-600" />}
                          label="Correo electronico"
                          value={siteConfig.email}
                        />
                      )}
                    </div>
                  </div>

                  {/* Business Hours */}
                  {siteConfig.horarioAtencion && (
                    <div className="rounded-3xl bg-white p-6">
                      <ContactInfoItem
                        icon={<Clock className="h-5 w-5 text-pradera-600" />}
                        label="Horario de atencion"
                        value={siteConfig.horarioAtencion}
                      />
                    </div>
                  )}

                  {/* Social Media */}
                  {socialLinks.length > 0 && (
                    <div className="rounded-3xl bg-white p-6">
                      <p className="mb-3 text-sm font-medium text-gray-500">
                        Siguenos en redes sociales
                      </p>
                      <div className="flex gap-3">
                        {socialLinks.map((link) => (
                          <SocialLink
                            key={link.label}
                            href={link.url!}
                            icon={link.icon}
                            label={link.label}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      {siteConfig.googleMapsEmbed && (
        <section className="bg-white py-20 md:py-32">
          <ScrollReveal className="mx-auto max-w-7xl px-6">
            <h2 className="mb-8 font-display text-3xl md:text-4xl font-normal text-gray-900">
              Ubicacion
            </h2>
            <div className="overflow-hidden rounded-3xl shadow-sm">
              <iframe
                src={siteConfig.googleMapsEmbed}
                title="Ubicacion de La Pradera Country Club"
                className="h-64 w-full border-0 md:h-96"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </ScrollReveal>
        </section>
      )}
    </>
  )
}
