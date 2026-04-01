import type { CollectionConfig } from 'payload'
import { generateSlug } from '../hooks/generateSlug'

export const Instalaciones: CollectionConfig = {
  slug: 'instalaciones',
  labels: {
    singular: 'Área/Servicio',
    plural: 'Áreas/Servicios',
  },
  admin: {
    useAsTitle: 'nombre',
    group: 'Club',
  },
  hooks: {
    beforeChange: [generateSlug({ sourceField: 'nombre' })],
  },
  fields: [
    {
      name: 'nombre',
      type: 'text',
      required: true,
      label: 'Nombre',
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
      name: 'categoria',
      type: 'select',
      required: true,
      label: 'Categoría',
      options: [
        { label: 'Bungalo', value: 'bungalo' },
        { label: 'Piscina', value: 'piscina' },
        { label: 'Cancha de Tenis', value: 'cancha-tenis' },
        { label: 'Cancha de Fútbol', value: 'cancha-futbol' },
        { label: 'Cancha Multiuso', value: 'cancha-multiuso' },
        { label: 'Frontón', value: 'fronton' },
        { label: 'Camping', value: 'camping' },
        { label: 'Camper', value: 'camper' },
        { label: 'Salón', value: 'salon' },
        { label: 'Playa', value: 'playa' },
        { label: 'Sauna', value: 'sauna' },
        { label: 'Club House', value: 'club-house' },
        { label: 'Capilla', value: 'capilla' },
        { label: 'Otro', value: 'otro' },
      ],
    },
    {
      name: 'descripcion',
      type: 'richText',
      label: 'Descripción',
    },
    {
      name: 'capacidad',
      type: 'number',
      label: 'Capacidad',
    },
    {
      name: 'amenidades',
      type: 'array',
      label: 'Amenidades',
      labels: {
        singular: 'Amenidad',
        plural: 'Amenidades',
      },
      fields: [
        {
          name: 'nombre',
          type: 'text',
          required: true,
          label: 'Nombre',
        },
      ],
    },
    {
      name: 'imagenes',
      type: 'array',
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
          name: 'alt',
          type: 'text',
          label: 'Texto alternativo',
        },
      ],
    },
    {
      name: 'esReservable',
      type: 'checkbox',
      defaultValue: true,
      label: 'Es Reservable',
    },
    {
      name: 'tarifas',
      type: 'array',
      label: 'Tarifas',
      labels: {
        singular: 'Tarifa',
        plural: 'Tarifas',
      },
      admin: {
        condition: (data) => Boolean(data?.esReservable),
      },
      fields: [
        {
          name: 'concepto',
          type: 'text',
          required: true,
          label: 'Concepto',
        },
        {
          name: 'precio',
          type: 'number',
          required: true,
          label: 'Precio',
        },
        {
          name: 'moneda',
          type: 'select',
          defaultValue: 'PEN',
          label: 'Moneda',
          options: [
            { label: 'PEN', value: 'PEN' },
            { label: 'USD', value: 'USD' },
          ],
        },
      ],
    },
    {
      name: 'estado',
      type: 'select',
      defaultValue: 'disponible',
      label: 'Estado',
      admin: {
        position: 'sidebar',
      },
      options: [
        { label: 'Disponible', value: 'disponible' },
        { label: 'En Mantenimiento', value: 'mantenimiento' },
        { label: 'No Disponible', value: 'no-disponible' },
      ],
    },
    {
      name: 'orden',
      type: 'number',
      defaultValue: 0,
      label: 'Orden',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'destacado',
      type: 'checkbox',
      defaultValue: false,
      label: 'Destacado',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
