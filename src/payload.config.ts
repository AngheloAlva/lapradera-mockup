import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Instalaciones } from './collections/Instalaciones'
import { Eventos } from './collections/Eventos'
import { Noticias } from './collections/Noticias'
import { Galerias } from './collections/Galerias'
import { Contacto } from './collections/Contacto'
import { SiteConfig } from './globals/SiteConfig'
import { Homepage } from './globals/Homepage'
import { Nosotros } from './globals/Nosotros'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Instalaciones, Eventos, Noticias, Galerias, Contacto],
  globals: [SiteConfig, Homepage, Nosotros],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./database.db',
    },
  }),
  sharp,
  plugins: [],
})
