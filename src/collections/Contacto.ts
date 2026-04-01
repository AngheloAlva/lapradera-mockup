import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '../access'

export const Contacto: CollectionConfig = {
  slug: 'mensajes-contacto',
  labels: {
    singular: 'Mensaje de Contacto',
    plural: 'Mensajes de Contacto',
  },
  admin: {
    useAsTitle: 'asunto',
    group: 'Sistema',
    defaultColumns: ['nombre', 'email', 'asunto', 'createdAt', 'leido'],
  },
  access: {
    read: isAdminOrEditor,
    create: () => true,
  },
  fields: [
    {
      name: 'nombre',
      type: 'text',
      required: true,
      label: 'Nombre',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      label: 'Email',
    },
    {
      name: 'telefono',
      type: 'text',
      label: 'Teléfono',
    },
    {
      name: 'asunto',
      type: 'text',
      required: true,
      label: 'Asunto',
    },
    {
      name: 'mensaje',
      type: 'textarea',
      required: true,
      label: 'Mensaje',
    },
    {
      name: 'leido',
      type: 'checkbox',
      defaultValue: false,
      label: 'Leído',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
