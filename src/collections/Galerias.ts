import type { CollectionConfig } from 'payload'
import { isPublished } from '../access'

export const Galerias: CollectionConfig = {
  slug: 'galerias',
  labels: {
    singular: 'Galería',
    plural: 'Galerías',
  },
  admin: {
    useAsTitle: 'titulo',
    group: 'Contenido',
  },
  access: {
    read: isPublished,
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      required: true,
      label: 'Título',
    },
    {
      name: 'descripcion',
      type: 'textarea',
      label: 'Descripción',
    },
    {
      name: 'fecha',
      type: 'date',
      label: 'Fecha',
    },
    {
      name: 'imagenes',
      type: 'array',
      minRows: 1,
      label: 'Imágenes',
      labels: {
        singular: 'Imagen',
        plural: 'Imágenes',
      },
      fields: [
        {
          name: 'imagen',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Imagen',
        },
        {
          name: 'descripcion',
          type: 'text',
          label: 'Descripción',
        },
      ],
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
  ],
}
