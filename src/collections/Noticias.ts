import type { CollectionConfig } from 'payload'
import { isPublished } from '../access'
import { generateSlug } from '../hooks/generateSlug'

export const Noticias: CollectionConfig = {
  slug: 'noticias',
  labels: {
    singular: 'Noticia',
    plural: 'Noticias',
  },
  admin: {
    useAsTitle: 'titulo',
    group: 'Contenido',
  },
  access: {
    read: isPublished,
  },
  hooks: {
    beforeChange: [generateSlug()],
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      required: true,
      label: 'Título',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'resumen',
      type: 'textarea',
      maxLength: 300,
      label: 'Resumen',
    },
    {
      name: 'contenido',
      type: 'richText',
      required: true,
      label: 'Contenido',
    },
    {
      name: 'imagenPortada',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen de Portada',
    },
    {
      name: 'categoria',
      type: 'select',
      label: 'Categoría',
      options: [
        { label: 'Comunicado', value: 'comunicado' },
        { label: 'Noticia', value: 'noticia' },
        { label: 'Aviso', value: 'aviso' },
        { label: 'Mantenimiento', value: 'mantenimiento' },
      ],
    },
    {
      name: 'fechaPublicacion',
      type: 'date',
      required: true,
      label: 'Fecha de Publicación',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publicado',
      type: 'checkbox',
      defaultValue: false,
      label: 'Publicado',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'autor',
      type: 'relationship',
      relationTo: 'users',
      label: 'Autor',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
