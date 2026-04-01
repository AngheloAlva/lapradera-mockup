import type { GlobalConfig } from 'payload'

export const Nosotros: GlobalConfig = {
  slug: 'nosotros',
  label: 'Pagina Nosotros',
  admin: {
    group: 'Paginas',
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'historia',
      type: 'group',
      label: 'Historia',
      fields: [
        {
          name: 'titulo',
          type: 'text',
          defaultValue: 'Nuestra Historia',
          label: 'Titulo',
        },
        {
          name: 'contenido',
          type: 'richText',
          label: 'Contenido',
        },
        {
          name: 'imagenes',
          type: 'array',
          label: 'Imagenes',
          fields: [
            {
              name: 'imagen',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagen',
            },
          ],
        },
      ],
    },
    {
      name: 'mision',
      type: 'textarea',
      label: 'Mision',
    },
    {
      name: 'vision',
      type: 'textarea',
      label: 'Vision',
    },
    {
      name: 'valores',
      type: 'array',
      label: 'Valores',
      fields: [
        {
          name: 'titulo',
          type: 'text',
          required: true,
          label: 'Titulo',
        },
        {
          name: 'descripcion',
          type: 'textarea',
          label: 'Descripcion',
        },
      ],
    },
    {
      name: 'consejoDirectivo',
      type: 'array',
      label: 'Consejo Directivo',
      fields: [
        {
          name: 'nombre',
          type: 'text',
          required: true,
          label: 'Nombre',
        },
        {
          name: 'cargo',
          type: 'text',
          required: true,
          label: 'Cargo',
        },
        {
          name: 'foto',
          type: 'upload',
          relationTo: 'media',
          label: 'Foto',
        },
      ],
    },
  ],
}
