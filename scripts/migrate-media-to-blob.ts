import { put } from '@vercel/blob'
import { createClient } from '@libsql/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import 'dotenv/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const MEDIA_DIR = path.resolve(__dirname, '../media')

const token = process.env.BLOB_READ_WRITE_TOKEN
if (!token) {
  console.error('❌ BLOB_READ_WRITE_TOKEN is not set in .env')
  process.exit(1)
}

const dbUrl = process.env.DATABASE_URL
const dbToken = process.env.DATABASE_TOKEN
if (!dbUrl || !dbToken) {
  console.error('❌ DATABASE_URL and DATABASE_TOKEN must be set in .env')
  process.exit(1)
}

const db = createClient({ url: dbUrl, authToken: dbToken })

interface MediaRow {
  id: number
  filename: string | null
  sizes_thumbnail_filename: string | null
  sizes_card_filename: string | null
  sizes_hero_filename: string | null
}

async function uploadFile(filename: string): Promise<string | null> {
  const filePath = path.join(MEDIA_DIR, filename)
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠ File not found: ${filename}`)
    return null
  }

  const fileBuffer = fs.readFileSync(filePath)
  const blob = await put(`media/${filename}`, fileBuffer, {
    access: 'public',
    token,
    addRandomSuffix: false,
  })

  return blob.url
}

async function migrate() {
  console.log('🚀 Starting media migration to Vercel Blob...\n')

  const result = await db.execute(
    'SELECT id, filename, sizes_thumbnail_filename, sizes_card_filename, sizes_hero_filename FROM media',
  )

  const rows = result.rows as unknown as MediaRow[]
  console.log(`📦 Found ${rows.length} media records\n`)

  let uploaded = 0
  let failed = 0

  for (const row of rows) {
    console.log(`[${row.id}] ${row.filename}`)

    const updates: { column: string; url: string }[] = []

    // Upload main file
    if (row.filename) {
      const url = await uploadFile(row.filename)
      if (url) {
        updates.push({ column: 'url', url })
        uploaded++
      } else {
        failed++
      }
    }

    // Upload thumbnail
    if (row.sizes_thumbnail_filename) {
      const url = await uploadFile(row.sizes_thumbnail_filename)
      if (url) {
        updates.push({ column: 'sizes_thumbnail_url', url })
        uploaded++
      } else {
        failed++
      }
    }

    // Upload card size
    if (row.sizes_card_filename) {
      const url = await uploadFile(row.sizes_card_filename)
      if (url) {
        updates.push({ column: 'sizes_card_url', url })
        uploaded++
      } else {
        failed++
      }
    }

    // Upload hero size
    if (row.sizes_hero_filename) {
      const url = await uploadFile(row.sizes_hero_filename)
      if (url) {
        updates.push({ column: 'sizes_hero_url', url })
        uploaded++
      } else {
        failed++
      }
    }

    // Update URLs in Turso DB
    if (updates.length > 0) {
      const setClauses = updates.map((u) => `${u.column} = '${u.url}'`).join(', ')
      await db.execute(`UPDATE media SET ${setClauses} WHERE id = ${row.id}`)
      console.log(`  ✅ ${updates.length} files uploaded & DB updated`)
    }
  }

  console.log(`\n✅ Migration complete!`)
  console.log(`   Uploaded: ${uploaded}`)
  console.log(`   Failed: ${failed}`)
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
