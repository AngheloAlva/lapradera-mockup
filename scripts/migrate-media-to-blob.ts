import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const MEDIA_DIR = path.resolve(__dirname, '../media')

async function migrate() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('❌ BLOB_READ_WRITE_TOKEN is not set in .env')
    process.exit(1)
  }

  console.log('🚀 Starting media migration to Vercel Blob via Payload API...\n')

  const payload = await getPayload({ config })

  const { docs: allMedia } = await payload.find({
    collection: 'media',
    limit: 0,
    pagination: false,
  })

  console.log(`📦 Found ${allMedia.length} media records\n`)

  let success = 0
  let failed = 0

  for (const media of allMedia) {
    const filename = media.filename
    if (!filename) {
      console.warn(`[${media.id}] No filename, skipping`)
      failed++
      continue
    }

    // Find the original file in the local media directory
    const filePath = path.join(MEDIA_DIR, filename)
    if (!fs.existsSync(filePath)) {
      console.warn(`[${media.id}] File not found: ${filename}`)
      failed++
      continue
    }

    try {
      // Update the media record with the local file
      // Payload + Vercel Blob plugin will handle the upload and URL generation
      await payload.update({
        collection: 'media',
        id: media.id,
        data: {
          alt: media.alt,
        },
        filePath,
      })
      success++
      console.log(`  ✅ [${media.id}] ${filename}`)
    } catch (err) {
      failed++
      console.error(`  ❌ [${media.id}] ${filename}:`, err instanceof Error ? err.message : err)
    }
  }

  console.log(`\n✅ Migration complete!`)
  console.log(`   Success: ${success}`)
  console.log(`   Failed: ${failed}`)

  process.exit(0)
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})
