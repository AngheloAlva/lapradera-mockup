import type { GlobalConfig } from 'payload'

export const SiteConfig: GlobalConfig = {
  slug: 'site-config',
  label: 'Configuracion del Sitio',
  admin: {
    group: 'Configuracion',
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'nombreClub',
      type: 'text',
      required: true,
      defaultValue: 'La Pradera Country Club',
      label: 'Nombre del Club',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
    },
    {
      name: 'telefono',
      type: 'text',
      label: 'Telefono',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Correo Electronico',
    },
    {
      name: 'direccion',
      type: 'textarea',
      label: 'Direccion',
    },
    {
      name: 'horarioAtencion',
      type: 'text',
      label: 'Horario de Atencion',
      admin: {
        description: 'Ej: Lunes a Domingo, 8:00am - 6:00pm',
      },
    },
    {
      name: 'redesSociales',
      type: 'group',
      label: 'Redes Sociales',
      fields: [
        {
          name: 'facebook',
          type: 'text',
          label: 'Facebook',
        },
        {
          name: 'instagram',
          type: 'text',
          label: 'Instagram',
        },
        {
          name: 'tiktok',
          type: 'text',
          label: 'TikTok',
        },
        {
          name: 'youtube',
          type: 'text',
          label: 'YouTube',
        },
      ],
    },
    {
      name: 'googleMapsEmbed',
      type: 'textarea',
      label: 'Google Maps Embed',
      admin: {
        description: 'URL del iframe de Google Maps',
      },
    },
  ],
}
