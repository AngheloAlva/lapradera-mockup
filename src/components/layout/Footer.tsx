import { getPayload } from 'payload'
import config from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { FacebookIcon, InstagramIcon, YoutubeIcon, TiktokIcon } from '@/components/ui/SocialIcons'

import type { Media, SiteConfig } from '@/payload-types'

interface NavLink {
  label: string
  href: string
}

const QUICK_LINKS: NavLink[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Áreas/Servicios', href: '/instalaciones' },
  { label: 'Actividades', href: '/actividades' },
  { label: 'Noticias', href: '/noticias' },
  { label: 'Galería', href: '/galeria' },
  { label: 'Contacto', href: '/contacto' },
]

async function getSiteConfig(): Promise<SiteConfig | null> {
  try {
    const payload = await getPayload({ config })
    return await payload.findGlobal({ slug: 'site-config' })
  } catch {
    return null
  }
}

export async function Footer() {
  const siteConfig = await getSiteConfig()

  const clubName = siteConfig?.nombreClub ?? 'La Pradera Country Club'
  const currentYear = new Date().getFullYear()

  const logo = siteConfig?.logo
  let logoUrl: string | null = null
  if (logo && typeof logo === 'object' && 'url' in logo) {
    logoUrl = (logo as Media).url ?? null
  }

  const socialLinks = siteConfig?.redesSociales

  return (
    <footer className="bg-pradera-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:gap-8 lg:grid-cols-[2fr_1fr_1.5fr]">
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <Image
                  width={128}
                  height={128}
                  src={logoUrl}
                  alt={clubName}
                  className="h-32 w-auto object-contain"
                />
              ) : null}
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-gray-300">
              Un espacio pensado para el disfrute de toda la familia, con instalaciones deportivas,
              áreas recreativas y naturaleza.
            </p>
            <div className="flex gap-2.5">
              {socialLinks?.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-gray-300 transition-colors hover:bg-pradera-600 hover:text-white"
                >
                  <FacebookIcon className="h-4 w-4" />
                </a>
              )}
              {socialLinks?.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-gray-300 transition-colors hover:bg-pradera-600 hover:text-white"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
              )}
              {socialLinks?.youtube && (
                <a
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-gray-300 transition-colors hover:bg-pradera-600 hover:text-white"
                >
                  <YoutubeIcon className="h-4 w-4" />
                </a>
              )}
              {socialLinks?.tiktok && (
                <a
                  href={socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-gray-300 transition-colors hover:bg-pradera-600 hover:text-white"
                >
                  <TiktokIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Contacto
            </h4>
            <ul className="space-y-3.5">
              {siteConfig?.direccion && (
                <li className="flex items-start gap-2.5 text-sm text-gray-300">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-pradera-500" />
                  <span>{siteConfig.direccion}</span>
                </li>
              )}
              {siteConfig?.telefono && (
                <li className="flex items-center gap-2.5 text-sm text-gray-300">
                  <Phone className="h-4 w-4 shrink-0 text-pradera-500" />
                  <a
                    href={`tel:${siteConfig.telefono}`}
                    className="transition-colors hover:text-white"
                  >
                    {siteConfig.telefono}
                  </a>
                </li>
              )}
              {siteConfig?.email && (
                <li className="flex items-center gap-2.5 text-sm text-gray-300">
                  <Mail className="h-4 w-4 shrink-0 text-pradera-500" />
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="transition-colors hover:text-white"
                  >
                    {siteConfig.email}
                  </a>
                </li>
              )}
              {siteConfig?.horarioAtencion && (
                <li className="flex items-center gap-2.5 text-sm text-gray-300">
                  <Clock className="h-4 w-4 shrink-0 text-pradera-500" />
                  <span>{siteConfig.horarioAtencion}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-gray-300">
            &copy; {currentYear} {clubName}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
