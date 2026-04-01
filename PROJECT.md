# La Pradera Country Club — Plataforma Digital

## Contexto del Proyecto

La Pradera Country Club es un club campestre exclusivo para socios, ubicado en el valle de Santa Eulalia, Lima, Perú. Fundado en 1991, cuenta con más de 16 hectáreas que incluyen 30 bungalos, 4 piscinas, canchas de tenis, fútbol, frontón, cancha multiuso LAYKOLD, zona de camping y campers, club house, capilla, karaoke, sauna, tópico médico, y una playa privada de arena blanca a orillas del río Santa Eulalia.

El club necesita una plataforma digital **100% autoadministrable** que reemplace su sitio web actual (HTML estático sin CMS) y le permita gestionar contenido, socios, reservas e instalaciones sin depender de terceros.

## Objetivo de esta Maqueta

Construir un prototipo funcional usando **Payload CMS 3.x + Next.js 15** que demuestre cómo el club puede administrar todo desde un solo panel. Esta maqueta servirá como base para la propuesta al cliente y como punto de partida del desarrollo final.

---

## Stack Tecnológico

| Componente | Tecnología |
|---|---|
| Framework | Next.js 15 (App Router) |
| CMS / Backend / Admin | Payload CMS 3.x (integrado en Next.js) |
| Lenguaje | TypeScript (estricto) |
| Base de datos | PostgreSQL con `@payloadcms/db-postgres` |
| ORM | Drizzle (incluido en Payload 3) |
| Estilos | Tailwind CSS 4 |
| Rich Text | Lexical (editor por defecto de Payload 3) |
| Almacenamiento de archivos | Local en desarrollo, Cloudflare R2 o Supabase Storage en producción |
| Autenticación | Payload Auth (JWT integrado) |
| Hosting objetivo | Vercel (frontend + API) + Neon/Supabase (PostgreSQL) |

---

## Estructura del Proyecto

```
lapradera/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── (frontend)/             # Grupo de rutas públicas del sitio web
│   │   │   ├── layout.tsx          # Layout público (navbar, footer)
│   │   │   ├── page.tsx            # Homepage
│   │   │   ├── nosotros/
│   │   │   │   └── page.tsx        # Historia, misión, visión, directiva
│   │   │   ├── instalaciones/
│   │   │   │   ├── page.tsx        # Grid de todas las instalaciones
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx    # Detalle de instalación
│   │   │   ├── actividades/
│   │   │   │   ├── page.tsx        # Calendario y lista de eventos
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx    # Detalle de evento
│   │   │   ├── noticias/
│   │   │   │   ├── page.tsx        # Lista de noticias/comunicados
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx    # Detalle de noticia
│   │   │   ├── reservas/
│   │   │   │   └── page.tsx        # Sistema de reservas (requiere auth)
│   │   │   ├── mi-cuenta/
│   │   │   │   ├── page.tsx        # Dashboard del socio
│   │   │   │   ├── reservas/
│   │   │   │   │   └── page.tsx    # Mis reservas
│   │   │   │   └── perfil/
│   │   │   │       └── page.tsx    # Editar perfil
│   │   │   ├── contacto/
│   │   │   │   └── page.tsx        # Formulario de contacto + mapa
│   │   │   └── galeria/
│   │   │       └── page.tsx        # Galería de fotos
│   │   └── (payload)/              # Rutas del admin panel de Payload
│   │       └── admin/
│   │           └── [[...segments]]/
│   │               └── page.tsx    # Panel admin de Payload CMS
│   ├── collections/                # Definiciones de colecciones Payload
│   │   ├── Users.ts
│   │   ├── Socios.ts
│   │   ├── Instalaciones.ts
│   │   ├── Reservas.ts
│   │   ├── Eventos.ts
│   │   ├── Noticias.ts
│   │   ├── Galerias.ts
│   │   ├── Media.ts
│   │   └── Contacto.ts
│   ├── globals/                    # Globals de Payload (contenido singleton)
│   │   ├── SiteConfig.ts           # Configuración general del sitio
│   │   ├── Homepage.ts             # Contenido de la página de inicio
│   │   └── Nosotros.ts             # Contenido de la página nosotros
│   ├── components/                 # Componentes React reutilizables
│   │   ├── ui/                     # Componentes UI genéricos
│   │   ├── layout/                 # Navbar, Footer, Sidebar
│   │   └── sections/              # Secciones de página (Hero, Features, etc.)
│   ├── lib/                        # Utilidades
│   │   ├── payload.ts              # Cliente de Payload para server components
│   │   └── utils.ts                # Funciones helper
│   └── payload.config.ts           # Configuración principal de Payload
├── public/                         # Assets estáticos
├── .env                            # Variables de entorno
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Colecciones de Payload (Collections)

### 1. Users (Administradores)

Usuarios del panel de administración del club.

```typescript
// src/collections/Users.ts
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  fields: [
    {
      name: 'nombre',
      type: 'text',
      required: true,
    },
    {
      name: 'apellido',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Administrador', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Recepción', value: 'recepcion' },
      ],
    },
  ],
}
```

### 2. Socios

Padrón de socios del club. Colección con autenticación para el portal de socios.

```typescript
// src/collections/Socios.ts
import type { CollectionConfig } from 'payload'

export const Socios: CollectionConfig = {
  slug: 'socios',
  auth: true, // Login para portal de socios
  admin: {
    useAsTitle: 'nombreCompleto',
    group: 'Gestión de Socios',
  },
  fields: [
    {
      name: 'codigoSocio',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Código único del socio (ej: LP-0001)' },
    },
    {
      name: 'nombreCompleto',
      type: 'text',
      required: true,
      admin: { description: 'Nombre completo del socio titular' },
    },
    {
      name: 'dni',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'telefono',
      type: 'text',
    },
    {
      name: 'direccion',
      type: 'textarea',
    },
    {
      name: 'tipoMembresia',
      type: 'select',
      required: true,
      options: [
        { label: 'Titular', value: 'titular' },
        { label: 'Familiar', value: 'familiar' },
        { label: 'Corporativo', value: 'corporativo' },
        { label: 'Honorario', value: 'honorario' },
      ],
    },
    {
      name: 'estado',
      type: 'select',
      required: true,
      defaultValue: 'activo',
      options: [
        { label: 'Activo', value: 'activo' },
        { label: 'Suspendido', value: 'suspendido' },
        { label: 'Inactivo', value: 'inactivo' },
      ],
    },
    {
      name: 'fechaIngreso',
      type: 'date',
      required: true,
    },
    {
      name: 'familiares',
      type: 'array',
      admin: { description: 'Familiares registrados bajo esta membresía' },
      fields: [
        { name: 'nombre', type: 'text', required: true },
        { name: 'parentesco', type: 'select', options: [
          { label: 'Cónyuge', value: 'conyuge' },
          { label: 'Hijo/a', value: 'hijo' },
          { label: 'Padre/Madre', value: 'padre' },
        ]},
        { name: 'dni', type: 'text' },
        { name: 'fechaNacimiento', type: 'date' },
      ],
    },
    {
      name: 'foto',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'notas',
      type: 'textarea',
      admin: { description: 'Notas internas sobre el socio' },
    },
  ],
}
```

### 3. Instalaciones

Espacios y áreas del club que pueden ser reservados o mostrados en el sitio.

```typescript
// src/collections/Instalaciones.ts
import type { CollectionConfig } from 'payload'

export const Instalaciones: CollectionConfig = {
  slug: 'instalaciones',
  admin: {
    useAsTitle: 'nombre',
    group: 'Club',
  },
  fields: [
    {
      name: 'nombre',
      type: 'text',
      required: true,
      // Ej: "Bungalo Premium A1", "Piscina Olímpica", "Cancha de Tenis 1"
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'categoria',
      type: 'select',
      required: true,
      options: [
        { label: 'Bungalo', value: 'bungalo' },
        { label: 'Piscina', value: 'piscina' },
        { label: 'Cancha de Tenis', value: 'cancha-tenis' },
        { label: 'Cancha de Fútbol', value: 'cancha-futbol' },
        { label: 'Cancha Multiuso', value: 'cancha-multiuso' },
        { label: 'Frontón', value: 'fronton' },
        { label: 'Zona de Camping', value: 'camping' },
        { label: 'Camper', value: 'camper' },
        { label: 'Salón de Eventos', value: 'salon' },
        { label: 'Playa', value: 'playa' },
        { label: 'Sauna', value: 'sauna' },
        { label: 'Club House', value: 'club-house' },
        { label: 'Capilla', value: 'capilla' },
        { label: 'Otro', value: 'otro' },
      ],
    },
    {
      name: 'descripcion',
      type: 'richText', // Lexical editor
    },
    {
      name: 'capacidad',
      type: 'number',
      admin: { description: 'Capacidad máxima de personas' },
    },
    {
      name: 'amenidades',
      type: 'array',
      fields: [
        { name: 'nombre', type: 'text', required: true },
        // Ej: "Wi-Fi", "Parrilla", "Cocina", "Baño privado", "Estacionamiento"
      ],
    },
    {
      name: 'imagenes',
      type: 'array',
      fields: [
        { name: 'imagen', type: 'upload', relationTo: 'media', required: true },
        { name: 'alt', type: 'text' },
      ],
    },
    {
      name: 'esReservable',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: '¿Se puede reservar esta instalación?' },
    },
    {
      name: 'tarifas',
      type: 'array',
      admin: {
        description: 'Tarifas por período',
        condition: (data) => data.esReservable,
      },
      fields: [
        { name: 'concepto', type: 'text', required: true },
        // Ej: "Noche entre semana", "Noche fin de semana", "Hora"
        { name: 'precio', type: 'number', required: true },
        { name: 'moneda', type: 'select', defaultValue: 'PEN', options: [
          { label: 'Soles (S/)', value: 'PEN' },
          { label: 'Dólares ($)', value: 'USD' },
        ]},
      ],
    },
    {
      name: 'estado',
      type: 'select',
      defaultValue: 'disponible',
      options: [
        { label: 'Disponible', value: 'disponible' },
        { label: 'En mantenimiento', value: 'mantenimiento' },
        { label: 'No disponible', value: 'no-disponible' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'orden',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Orden de aparición en el listado' },
    },
    {
      name: 'destacado',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Mostrar en la página de inicio' },
    },
  ],
}
```

### 4. Reservas

Sistema de reservas de instalaciones por parte de los socios.

```typescript
// src/collections/Reservas.ts
import type { CollectionConfig } from 'payload'

export const Reservas: CollectionConfig = {
  slug: 'reservas',
  admin: {
    useAsTitle: 'codigoReserva',
    group: 'Gestión de Socios',
    defaultColumns: ['codigoReserva', 'socio', 'instalacion', 'fechaInicio', 'estado'],
  },
  fields: [
    {
      name: 'codigoReserva',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'Código autogenerado (ej: RES-20260401-001)' },
      // Hook beforeChange para autogenerar
    },
    {
      name: 'socio',
      type: 'relationship',
      relationTo: 'socios',
      required: true,
    },
    {
      name: 'instalacion',
      type: 'relationship',
      relationTo: 'instalaciones',
      required: true,
    },
    {
      name: 'fechaInicio',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'fechaFin',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'cantidadPersonas',
      type: 'number',
      required: true,
      min: 1,
    },
    {
      name: 'estado',
      type: 'select',
      required: true,
      defaultValue: 'pendiente',
      options: [
        { label: 'Pendiente', value: 'pendiente' },
        { label: 'Confirmada', value: 'confirmada' },
        { label: 'Cancelada', value: 'cancelada' },
        { label: 'Completada', value: 'completada' },
        { label: 'No show', value: 'no-show' },
      ],
    },
    {
      name: 'montoTotal',
      type: 'number',
      admin: { description: 'Monto total en soles' },
    },
    {
      name: 'observaciones',
      type: 'textarea',
    },
    {
      name: 'aprobadoPor',
      type: 'relationship',
      relationTo: 'users',
      admin: { description: 'Admin que aprobó la reserva' },
    },
  ],
  hooks: {
    // beforeChange: generar codigoReserva automáticamente
    // afterChange: enviar email de confirmación al socio
  },
}
```

### 5. Eventos

Actividades sociales y eventos del club.

```typescript
// src/collections/Eventos.ts
import type { CollectionConfig } from 'payload'

export const Eventos: CollectionConfig = {
  slug: 'eventos',
  admin: {
    useAsTitle: 'titulo',
    group: 'Contenido',
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'descripcion',
      type: 'richText',
    },
    {
      name: 'resumen',
      type: 'textarea',
      maxLength: 300,
      admin: { description: 'Resumen corto para tarjetas y previews' },
    },
    {
      name: 'imagenPortada',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'fechaInicio',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'fechaFin',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'ubicacion',
      type: 'text',
      admin: { description: 'Lugar dentro del club (ej: Club House, Piscina Principal)' },
    },
    {
      name: 'tipo',
      type: 'select',
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
    },
    {
      name: 'cupoMaximo',
      type: 'number',
      admin: { condition: (data) => data.requiereInscripcion },
    },
    {
      name: 'estado',
      type: 'select',
      defaultValue: 'proximo',
      options: [
        { label: 'Próximo', value: 'proximo' },
        { label: 'En curso', value: 'en-curso' },
        { label: 'Finalizado', value: 'finalizado' },
        { label: 'Cancelado', value: 'cancelado' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
```

### 6. Noticias

Comunicados y noticias del club.

```typescript
// src/collections/Noticias.ts
import type { CollectionConfig } from 'payload'

export const Noticias: CollectionConfig = {
  slug: 'noticias',
  admin: {
    useAsTitle: 'titulo',
    group: 'Contenido',
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'resumen',
      type: 'textarea',
      maxLength: 300,
    },
    {
      name: 'contenido',
      type: 'richText',
      required: true,
    },
    {
      name: 'imagenPortada',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'categoria',
      type: 'select',
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
      admin: { position: 'sidebar' },
    },
    {
      name: 'publicado',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'autor',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar' },
    },
  ],
}
```

### 7. Galerías

Álbumes de fotos del club.

```typescript
// src/collections/Galerias.ts
import type { CollectionConfig } from 'payload'

export const Galerias: CollectionConfig = {
  slug: 'galerias',
  admin: {
    useAsTitle: 'titulo',
    group: 'Contenido',
  },
  fields: [
    {
      name: 'titulo',
      type: 'text',
      required: true,
      // Ej: "Fiesta de Año Nuevo 2026", "Torneo de Tenis Marzo 2026"
    },
    {
      name: 'descripcion',
      type: 'textarea',
    },
    {
      name: 'fecha',
      type: 'date',
    },
    {
      name: 'imagenes',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'imagen', type: 'upload', relationTo: 'media', required: true },
        { name: 'descripcion', type: 'text' },
      ],
    },
    {
      name: 'publicado',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
```

### 8. Media

Colección de archivos multimedia (imágenes, documentos).

```typescript
// src/collections/Media.ts
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml', 'application/pdf'],
    imageSizes: [
      { name: 'thumbnail', width: 300, height: 300, position: 'centre' },
      { name: 'card', width: 600, height: 400, position: 'centre' },
      { name: 'hero', width: 1920, height: 1080, position: 'centre' },
    ],
  },
  admin: {
    group: 'Sistema',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Texto alternativo para accesibilidad y SEO' },
    },
  ],
}
```

### 9. Contacto (Mensajes)

Mensajes recibidos del formulario de contacto.

```typescript
// src/collections/Contacto.ts
import type { CollectionConfig } from 'payload'

export const Contacto: CollectionConfig = {
  slug: 'mensajes-contacto',
  admin: {
    useAsTitle: 'asunto',
    group: 'Sistema',
    defaultColumns: ['nombre', 'email', 'asunto', 'createdAt', 'leido'],
  },
  fields: [
    { name: 'nombre', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'telefono', type: 'text' },
    { name: 'asunto', type: 'text', required: true },
    { name: 'mensaje', type: 'textarea', required: true },
    {
      name: 'leido',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
```

---

## Globals de Payload

### SiteConfig

Configuración general del sitio administrable desde el panel.

```typescript
// src/globals/SiteConfig.ts
import type { GlobalConfig } from 'payload'

export const SiteConfig: GlobalConfig = {
  slug: 'site-config',
  label: 'Configuración del Sitio',
  admin: {
    group: 'Configuración',
  },
  fields: [
    {
      name: 'nombreClub',
      type: 'text',
      required: true,
      defaultValue: 'La Pradera Country Club',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'telefono',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'direccion',
      type: 'textarea',
    },
    {
      name: 'horarioAtencion',
      type: 'text',
      admin: { description: 'Ej: Lunes a Domingo, 8:00am - 6:00pm' },
    },
    {
      name: 'redesSociales',
      type: 'group',
      fields: [
        { name: 'facebook', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'tiktok', type: 'text' },
        { name: 'youtube', type: 'text' },
      ],
    },
    {
      name: 'googleMapsEmbed',
      type: 'textarea',
      admin: { description: 'URL del iframe de Google Maps' },
    },
  ],
}
```

### Homepage

Contenido editable de la página de inicio.

```typescript
// src/globals/Homepage.ts
import type { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Página de Inicio',
  admin: {
    group: 'Páginas',
  },
  fields: [
    {
      name: 'heroSlider',
      type: 'array',
      label: 'Slider Principal',
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'imagen', type: 'upload', relationTo: 'media', required: true },
        { name: 'titulo', type: 'text' },
        { name: 'subtitulo', type: 'text' },
        { name: 'textoBoton', type: 'text' },
        { name: 'enlaceBoton', type: 'text' },
      ],
    },
    {
      name: 'seccionBienvenida',
      type: 'group',
      fields: [
        { name: 'titulo', type: 'text', defaultValue: 'Bienvenidos a La Pradera' },
        { name: 'descripcion', type: 'richText' },
        { name: 'imagen', type: 'upload', relationTo: 'media' },
      ],
    },
    {
      name: 'seccionInstalaciones',
      type: 'group',
      fields: [
        { name: 'titulo', type: 'text', defaultValue: 'Nuestras Instalaciones' },
        { name: 'subtitulo', type: 'text' },
        // Las instalaciones destacadas se traen automáticamente con el campo "destacado: true"
      ],
    },
    {
      name: 'seccionEventos',
      type: 'group',
      fields: [
        { name: 'titulo', type: 'text', defaultValue: 'Próximos Eventos' },
        { name: 'subtitulo', type: 'text' },
        // Los próximos eventos se traen automáticamente por fecha
      ],
    },
    {
      name: 'bannerCTA',
      type: 'group',
      label: 'Banner de Llamada a la Acción',
      fields: [
        { name: 'titulo', type: 'text' },
        { name: 'descripcion', type: 'text' },
        { name: 'textoBoton', type: 'text' },
        { name: 'enlaceBoton', type: 'text' },
        { name: 'imagenFondo', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
```

### Nosotros

Contenido de la página institucional.

```typescript
// src/globals/Nosotros.ts
import type { GlobalConfig } from 'payload'

export const Nosotros: GlobalConfig = {
  slug: 'nosotros',
  label: 'Página Nosotros',
  admin: {
    group: 'Páginas',
  },
  fields: [
    {
      name: 'historia',
      type: 'group',
      fields: [
        { name: 'titulo', type: 'text', defaultValue: 'Nuestra Historia' },
        { name: 'contenido', type: 'richText' },
        { name: 'imagenes', type: 'array', fields: [
          { name: 'imagen', type: 'upload', relationTo: 'media' },
        ]},
      ],
    },
    {
      name: 'mision',
      type: 'textarea',
    },
    {
      name: 'vision',
      type: 'textarea',
    },
    {
      name: 'valores',
      type: 'array',
      fields: [
        { name: 'titulo', type: 'text', required: true },
        { name: 'descripcion', type: 'textarea' },
      ],
    },
    {
      name: 'consejoDirectivo',
      type: 'array',
      label: 'Consejo Directivo',
      fields: [
        { name: 'nombre', type: 'text', required: true },
        { name: 'cargo', type: 'text', required: true },
        { name: 'foto', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
```

---

## Configuración Principal de Payload

```typescript
// src/payload.config.ts
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'

// Collections
import { Users } from './collections/Users'
import { Socios } from './collections/Socios'
import { Instalaciones } from './collections/Instalaciones'
import { Reservas } from './collections/Reservas'
import { Eventos } from './collections/Eventos'
import { Noticias } from './collections/Noticias'
import { Galerias } from './collections/Galerias'
import { Media } from './collections/Media'
import { Contacto } from './collections/Contacto'

// Globals
import { SiteConfig } from './globals/SiteConfig'
import { Homepage } from './globals/Homepage'
import { Nosotros } from './globals/Nosotros'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '| La Pradera Admin',
    },
  },
  editor: lexicalEditor(),
  collections: [
    Users,
    Socios,
    Instalaciones,
    Reservas,
    Eventos,
    Noticias,
    Galerias,
    Media,
    Contacto,
  ],
  globals: [
    SiteConfig,
    Homepage,
    Nosotros,
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
```

---

## Variables de Entorno

```env
# .env
DATABASE_URL=postgresql://user:password@host:5432/lapradera
PAYLOAD_SECRET=un-secreto-seguro-de-al-menos-32-caracteres
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Roles y Control de Acceso

### Roles definidos

| Rol | Acceso |
|---|---|
| `admin` | Acceso total al panel, puede gestionar usuarios, socios, configuración del sitio |
| `editor` | Puede gestionar contenido (noticias, eventos, galerías), reservas e instalaciones |
| `recepcion` | Solo puede ver/gestionar reservas y consultar padrón de socios |
| `socio` (auth en colección Socios) | Portal web: ver su perfil, hacer reservas, ver estado de cuenta |

### Lógica de Access Control

Implementar funciones de acceso reutilizables:

```typescript
// src/access/index.ts

// Solo admins
export const isAdmin = ({ req: { user } }) => user?.role === 'admin'

// Admins y editores
export const isAdminOrEditor = ({ req: { user } }) =>
  user?.role === 'admin' || user?.role === 'editor'

// El socio solo ve sus propios datos
export const isSelfOrAdmin = ({ req: { user } }) => {
  if (user?.role === 'admin') return true
  if (user?.collection === 'socios') return { id: { equals: user.id } }
  return false
}

// Socios solo ven sus propias reservas
export const isOwnReservaOrStaff = ({ req: { user } }) => {
  if (['admin', 'editor', 'recepcion'].includes(user?.role)) return true
  if (user?.collection === 'socios') return { socio: { equals: user.id } }
  return false
}
```

---

## Páginas del Frontend

### Diseño General

- **Paleta de colores**: Verdes naturales + tierra (alineado con la identidad campestre del club). Colores sugeridos: verde oscuro `#2D5016`, verde claro `#4A7C2E`, tierra `#8B6914`, crema `#F5F0E8`, blanco `#FFFFFF`.
- **Tipografía**: Inter o Montserrat para encabezados, sistema sans-serif para cuerpo.
- **Estilo**: Moderno, limpio, con mucha fotografía del club. Sensación de naturaleza y exclusividad.

### Componentes Principales

- **Navbar**: Logo + links principales + botón "Portal Socios" + menú hamburguesa en móvil.
- **Footer**: Datos de contacto, redes sociales, mapa, links rápidos.
- **Hero Slider**: Carrusel full-width con imágenes del club.
- **Card de Instalación**: Imagen + nombre + categoría + badge de disponibilidad.
- **Card de Evento**: Imagen + título + fecha + tipo + badge de estado.
- **Card de Noticia**: Imagen + título + resumen + fecha.
- **Calendario de Reservas**: Vista de calendario con disponibilidad de instalaciones.
- **Formulario de Reserva**: Selección de instalación, fechas, personas, confirmación.

### Páginas

| Ruta | Descripción | Datos |
|---|---|---|
| `/` | Homepage | Global `homepage` + Instalaciones destacadas + Próximos eventos |
| `/nosotros` | Institucional | Global `nosotros` |
| `/instalaciones` | Grid de instalaciones | Collection `instalaciones` (todas) |
| `/instalaciones/[slug]` | Detalle instalación | Collection `instalaciones` (una) + tarifas |
| `/actividades` | Calendario y lista | Collection `eventos` (filtrado por fecha) |
| `/actividades/[slug]` | Detalle evento | Collection `eventos` (uno) |
| `/noticias` | Lista de noticias | Collection `noticias` (publicadas) |
| `/noticias/[slug]` | Detalle noticia | Collection `noticias` (una) |
| `/galeria` | Álbumes de fotos | Collection `galerias` (publicadas) |
| `/reservas` | Sistema de reservas | Auth requerida (socios), instalaciones reservables |
| `/mi-cuenta` | Dashboard del socio | Auth requerida, datos del socio |
| `/mi-cuenta/reservas` | Mis reservas | Reservas del socio autenticado |
| `/mi-cuenta/perfil` | Editar perfil | Datos del socio autenticado |
| `/contacto` | Formulario + mapa | Global `site-config` (datos contacto) |

---

## Hooks y Lógica de Negocio

### Hooks a implementar

```typescript
// Autogenerar código de reserva
// En Reservas beforeChange:
const generateReservaCode = ({ data, operation }) => {
  if (operation === 'create') {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    data.codigoReserva = `RES-${date}-${random}`
  }
  return data
}

// Autogenerar slug desde título
// En Eventos, Noticias, Instalaciones beforeChange:
const generateSlug = ({ data, operation }) => {
  if ((operation === 'create' || !data.slug) && data.titulo) {
    data.slug = data.titulo
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }
  return data
}

// Validar que no haya reservas superpuestas
// En Reservas beforeValidate:
const validateNoOverlap = async ({ data, req }) => {
  // Consultar reservas existentes para la misma instalación
  // en el rango de fechas solicitado
  // Si hay conflicto, lanzar ValidationError
}
```

---

## Seed Data (Datos Iniciales)

Para la maqueta, crear un script de seed con:

- 1 usuario admin (admin@lapradera.com.pe / admin123)
- 5-8 instalaciones de ejemplo (2 bungalos, 1 piscina, 2 canchas, 1 zona camping, 1 club house, 1 playa)
- 3-4 eventos de ejemplo
- 2-3 noticias de ejemplo
- 3-5 socios de ejemplo
- 2-3 reservas de ejemplo
- Imágenes placeholder (usar picsum.photos o unsplash para imágenes de naturaleza/resort)

---

## Comandos de Desarrollo

```bash
# Crear proyecto
npx create-payload-app@latest lapradera

# Seleccionar:
# - Template: blank
# - Database: postgres
# - Package manager: pnpm (o npm)

# Instalar dependencias adicionales
pnpm add tailwindcss @tailwindcss/postcss postcss
pnpm add lucide-react          # Iconos
pnpm add date-fns              # Manejo de fechas
pnpm add zod                   # Validación de formularios

# Desarrollo
pnpm dev                       # Inicia Next.js + Payload en localhost:3000

# El admin panel estará en localhost:3000/admin
# El sitio web público en localhost:3000
```

---

## Notas para Claude Code

- Usar siempre TypeScript estricto, nunca `any`.
- Los componentes del frontend deben ser Server Components por defecto, usar `'use client'` solo cuando sea necesario (formularios, interactividad).
- Usar `getPayload()` de `payload` para consultar datos en Server Components.
- Todos los textos de UI en español.
- Diseño mobile-first con Tailwind CSS.
- Usar `next/image` para optimización de imágenes.
- Usar `next/link` para navegación interna.
- Los formularios del portal de socios y reservas deben usar Server Actions de Next.js.
- El admin panel de Payload no necesita customización visual, solo configurar bien las colecciones.
