import type { CollectionConfig } from 'payload'
import { generateSlug } from '../hooks/generateSlug'

export const Eventos: CollectionConfig = {
  slug: 'eventos',
  labels: {
    singular: 'Evento',
    plural: 'Eventos',
  },
  admin: {
    useAsTitle: 'titulo',
    group: 'Contenido',
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
      name: 'descripcion',
      type: 'richText',
      label: 'Descripción',
    },
    {
      name: 'resumen',
      type: 'textarea',
      maxLength: 300,
      label: 'Resumen',
    },
    {
      name: 'imagenPortada',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Imagen de Portada',
    },
    {
      name: 'fechaInicio',
      type: 'date',
      required: true,
      label: 'Fecha de Inicio',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'fechaFin',
      type: 'date',
      label: 'Fecha de Fin',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'ubicacion',
      type: 'text',
      label: 'Ubicación',
    },
    {
      name: 'tipo',
      type: 'select',
      label: 'Tipo',
      options: [
        { label: 'Social', value: 'social' },
        { label: 'Deportivo', value: 'deportivo' },
        { label: 'Cultural', value: 'cultural' },
        { label: 'Gastronómico', value: 'gastronomico' },
        { label: 'Institucional', value: 'institucional' },
      ],
    },
    {
      name: 'requiereInscripcion',
      type: 'checkbox',
      defaultValue: false,
      label: 'Requiere Inscripción',
    },
    {
      name: 'cupoMaximo',
      type: 'number',
      label: 'Cupo Máximo',
      admin: {
        condition: (data) => Boolean(data?.requiereInscripcion),
      },
    },
    {
      name: 'estado',
      type: 'select',
      defaultValue: 'proximo',
      label: 'Estado',
      admin: {
        position: 'sidebar',
      },
      options: [
        { label: 'Próximo', value: 'proximo' },
        { label: 'En Curso', value: 'en-curso' },
        { label: 'Finalizado', value: 'finalizado' },
        { label: 'Cancelado', value: 'cancelado' },
      ],
    },
  ],
}
