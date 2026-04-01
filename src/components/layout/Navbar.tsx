import { getPayload } from 'payload'
import config from '@payload-config'

import type { Media } from '@/payload-types'

import { NavbarClient } from './NavbarClient'

export async function Navbar() {
  let clubName = 'La Pradera Country Club'
  let logoUrl: string | null = null
  let logoAlt = 'La Pradera Country Club'

  try {
    const payload = await getPayload({ config })
    const siteConfig = await payload.findGlobal({ slug: 'site-config' })

    clubName = siteConfig?.nombreClub ?? clubName
    logoAlt = clubName

    const logo = siteConfig?.logo
    if (logo && typeof logo === 'object' && 'url' in logo) {
      logoUrl = (logo as Media).url ?? null
    }
  } catch {
    // Gracefully handle missing SiteConfig — use defaults
  }

  return <NavbarClient clubName={clubName} logoUrl={logoUrl} logoAlt={logoAlt} />
}
