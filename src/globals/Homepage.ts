import type { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Pagina de Inicio',
  admin: {
    group: 'Paginas',
  },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'heroSlider',
      type: 'array',
      label: 'Slider Principal',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'imagen',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Imagen',
        },
        {
          name: 'titulo',
          type: 'text',
          label: 'Titulo',
        },
        {
          name: 'subtitulo',
          type: 'text',
          label: 'Subtitulo',
        },
        {
          name: 'textoBoton',
          type: 'text',
          label: 'Texto del Boton',
        },
        {
          name: 'enlaceBoton',
          type: 'text',
          label: 'Enlace del Boton',
        },
      ],
    },
    {
      name: 'seccionBienvenida',
      type: 'group',
      label: 'Seccion de Bienvenida',
      fields: [
        {
          name: 'titulo',
          type: 'text',
          defaultValue: 'Bienvenidos a La Pradera',
          label: 'Titulo',
        },
        {
          name: 'descripcion',
          type: 'richText',
          label: 'Descripcion',
        },
        {
          name: 'imagen',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagen',
        },
      ],
    },
    {
      name: 'seccionInstalaciones',
      type: 'group',
      label: 'Seccion de Áreas/Servicios',
      fields: [
        {
          name: 'titulo',
          type: 'text',
          defaultValue: 'Nuestras Áreas/Servicios',
          label: 'Titulo',
        },
        {
          name: 'subtitulo',
          type: 'text',
          label: 'Subtitulo',
        },
      ],
    },
    {
      name: 'seccionEventos',
      type: 'group',
      label: 'Seccion de Eventos',
      fields: [
        {
          name: 'titulo',
          type: 'text',
          defaultValue: 'Proximos Eventos',
          label: 'Titulo',
        },
        {
          name: 'subtitulo',
          type: 'text',
          label: 'Subtitulo',
        },
      ],
    },
    {
      name: 'bannerCTA',
      type: 'group',
      label: 'Banner de Llamada a la Accion',
      fields: [
        {
          name: 'titulo',
          type: 'text',
          label: 'Titulo',
        },
        {
          name: 'descripcion',
          type: 'text',
          label: 'Descripcion',
        },
        {
          name: 'textoBoton',
          type: 'text',
          label: 'Texto del Boton',
        },
        {
          name: 'enlaceBoton',
          type: 'text',
          label: 'Enlace del Boton',
        },
        {
          name: 'imagenFondo',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagen de Fondo',
        },
      ],
    },
  ],
}
