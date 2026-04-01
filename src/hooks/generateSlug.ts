import type { CollectionBeforeChangeHook } from 'payload'

interface GenerateSlugOptions {
  sourceField?: string
}

export const generateSlug = (
  options: GenerateSlugOptions = {},
): CollectionBeforeChangeHook => {
  const { sourceField = 'titulo' } = options

  return ({ data, operation }) => {
    if (operation === 'create' || !data?.slug) {
      const source = data?.[sourceField]
      if (typeof source === 'string' && source.length > 0) {
        data!.slug = source
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      }
    }
    return data
  }
}
