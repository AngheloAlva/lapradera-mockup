# La Pradera — Estructura de Páginas Frontend

Guía de implementación para las páginas del sitio web público usando Next.js 15 (App Router) + Payload CMS 3.x + Tailwind CSS.

Todas las páginas comparten el mismo Layout con Navbar y Footer. Diseño mobile-first, responsive. Paleta: verdes (#2D5016, #4A7C2E, #67A24A), dorado (#8B6914, #B89022), crema (#F5F0E8), blanco.

---

## Layout Global

### Navbar (`components/layout/Navbar.tsx`)

**Desktop (≥1024px):**
- Barra fija (sticky top) con fondo blanco + sombra sutil al hacer scroll
- Izquierda: Logo "LA PRADERA" (texto o imagen) + "Country Club" debajo en gris
- Centro: Links de navegación horizontales: Inicio, Nosotros, Instalaciones, Actividades, Noticias, Contacto
- Derecha: Botón "Portal Socios" (verde, redondeado)
- Altura: 80px, padding horizontal 120px (max-w-7xl mx-auto)

**Mobile (<1024px):**
- Logo a la izquierda, botón hamburguesa a la derecha
- Menú desplegable full-width con los links en vertical
- Botón "Portal Socios" al final del menú móvil
- Altura: 64px

### Footer (`components/layout/Footer.tsx`)

- Fondo oscuro (#1C1C1C)
- 4 columnas en desktop, 2 en tablet, 1 en mobile:
  - **Col 1 — Marca:** Logo, "Country Club", dirección completa, teléfono
  - **Col 2 — Enlaces:** Inicio, Nosotros, Instalaciones, Actividades, Noticias, Contacto
  - **Col 3 — Socios:** Portal de Socios, Reservar, Mi Cuenta, Reglamento
  - **Col 4 — Redes:** Iconos de Facebook, Instagram, TikTok (con links desde SiteConfig global)
- Línea divisoria gris
- Copyright centrado abajo: "© 2026 La Pradera Country Club"
- Padding: 60px top, 40px bottom, 120px horizontal

---

## Página 1: Homepage (`app/(frontend)/page.tsx`)

### Sección 1 — Hero Slider

- Full width, altura 85vh en desktop, 60vh en mobile
- Carrusel de imágenes con autoplay (3-5 slides)
- Cada slide: imagen de fondo con overlay oscuro semitransparente (gradient de abajo hacia arriba)
- Contenido centrado sobre la imagen:
  - Título principal: "Tu Refugio Natural en el Valle de Santa Eulalia" — texto blanco, 52px desktop / 32px mobile, font-bold
  - Subtítulo: "Más de 16 hectáreas de naturaleza, deporte y familia" — blanco, 18px / 16px, opacity 0.9
  - Dos botones:
    - "Reservar Ahora" → fondo dorado (#B89022), texto blanco
    - "Conocer Más" → borde blanco, texto blanco, sin fondo
- Indicadores de slide (dots) en la parte inferior
- **Datos:** Global `homepage` → campo `heroSlider`

### Sección 2 — Bienvenida

- Fondo blanco, padding vertical 80px
- Layout 2 columnas (60/40) en desktop, stack en mobile:
  - **Izquierda (texto):**
    - Label superior: "BIENVENIDOS" — dorado, 12px, tracking wide, uppercase
    - Título: "Un Club de Campo Para Toda la Familia" — verde oscuro, 38px / 28px, bold
    - Párrafo descriptivo: texto sobre la historia y misión del club — gris, 16px, line-height 1.7
    - Botón: "Conócenos" → fondo verde, texto blanco
  - **Derecha (imagen):**
    - Imagen del club house con border-radius 12px
    - Sombra suave
- **Datos:** Global `homepage` → campo `seccionBienvenida`

### Sección 3 — Instalaciones Destacadas

- Fondo crema (#F5F0E8), padding vertical 80px
- Header centrado:
  - Label: "NUESTRAS INSTALACIONES" — dorado, tracking wide
  - Título: "Espacios Diseñados Para Tu Comodidad" — verde oscuro, 36px / 26px
  - Subtítulo descriptivo — gris
- Grid de 3 cards en desktop, 2 en tablet, 1 en mobile (gap 24px)
- **Card de instalación:**
  - Imagen superior con aspect-ratio 16/10, border-radius top 12px
  - Contenido abajo con padding 20px:
    - Badge de categoría (fondo verde claro, texto verde) ej: "Alojamiento", "Deportes"
    - Nombre de la instalación — 18px, semibold, oscuro
    - Link "Ver detalles →" — verde, 13px
  - Borde sutil, border-radius 12px, sombra hover
- Botón centrado abajo: "Ver Todas las Instalaciones" → link a /instalaciones
- **Datos:** Collection `instalaciones` filtrado por `destacado: true`, limitado a 3-6

### Sección 4 — Próximos Eventos

- Fondo blanco, padding vertical 80px
- Header centrado:
  - Label: "ACTIVIDADES" — dorado
  - Título: "Próximos Eventos" — verde oscuro, 36px / 26px
- Grid de 3 cards en desktop, scroll horizontal en mobile
- **Card de evento:**
  - Imagen superior con aspect-ratio 16/9
  - Contenido abajo:
    - Línea de metadata: ícono calendario + fecha + separador "·" + tipo de evento (badge)
    - Título del evento — 18px, semibold
    - Resumen corto — 14px, gris, max 2 líneas con line-clamp
  - Hover: sombra más pronunciada
- Botón: "Ver Calendario Completo" → link a /actividades
- **Datos:** Collection `eventos` filtrado por `estado: proximo`, ordenados por `fechaInicio` ASC, limit 3

### Sección 5 — Números / Stats

- Fondo verde oscuro (#2D5016), padding vertical 60px
- 4 stats en fila horizontal centrada (2x2 en mobile):
  - "30+" / Bungalos
  - "4" / Piscinas
  - "16+" / Hectáreas
  - "30+" / Años de historia
- Números grandes en blanco (48px, bold), labels en blanco semi-transparente (14px)

### Sección 6 — CTA Banner

- Fondo con imagen del río/playa + overlay verde oscuro semitransparente
- Contenido centrado:
  - Título: "¿Listo Para Vivir la Experiencia La Pradera?" — blanco, 36px / 24px
  - Subtítulo — blanco, opacity 0.85
  - Botón: "Hacer una Reserva" → fondo dorado, texto blanco, grande
- **Datos:** Global `homepage` → campo `bannerCTA`

---

## Página 2: Nosotros (`app/(frontend)/nosotros/page.tsx`)

### Sección 1 — Hero Interno

- Altura reducida: 300px desktop, 200px mobile
- Imagen de fondo del club con overlay oscuro
- Título centrado: "Nosotros" — blanco, 42px, bold
- Breadcrumb debajo: Inicio > Nosotros — blanco, 14px, opacity 0.7

### Sección 2 — Historia

- Fondo blanco, padding 80px
- Layout 2 columnas (50/50) desktop, stack mobile:
  - **Izquierda:** Imagen histórica del club, border-radius 12px
  - **Derecha:**
    - Label: "NUESTRA HISTORIA" — dorado, tracking
    - Título: contenido rich text del campo `historia.titulo`
    - Contenido: rich text del campo `historia.contenido`
- **Datos:** Global `nosotros` → campo `historia`

### Sección 3 — Misión, Visión, Valores

- Fondo crema, padding 80px
- 3 cards en fila (stack mobile):
  - **Misión:** Ícono + título "Misión" + texto
  - **Visión:** Ícono + título "Visión" + texto
  - **Valores:** Ícono + título "Valores" + lista de valores
- Cards con fondo blanco, padding 32px, border-radius 12px, sombra sutil
- **Datos:** Global `nosotros` → campos `mision`, `vision`, `valores`

### Sección 4 — Consejo Directivo

- Fondo blanco, padding 80px
- Header centrado: "Consejo Directivo"
- Grid de cards de miembros (4 columnas desktop, 2 tablet, 1 mobile):
  - Foto circular (o cuadrada con border-radius) arriba
  - Nombre — semibold, 16px
  - Cargo — gris, 14px
- **Datos:** Global `nosotros` → campo `consejoDirectivo`

---

## Página 3: Instalaciones (`app/(frontend)/instalaciones/page.tsx`)

### Sección 1 — Hero Interno

- Mismo patrón que Nosotros
- Título: "Nuestras Instalaciones"
- Breadcrumb: Inicio > Instalaciones

### Sección 2 — Filtros + Grid

- Fondo blanco, padding 80px
- **Barra de filtros** (sticky debajo del navbar en desktop):
  - Tabs o botones horizontales para filtrar por categoría: Todos, Alojamiento, Piscinas, Deportes, Áreas Comunes, etc.
  - Scroll horizontal en mobile
  - Tab activo: fondo verde, texto blanco. Inactivo: borde gris, texto gris
- **Grid de instalaciones:**
  - 3 columnas desktop, 2 tablet, 1 mobile
  - Gap 24px
  - Misma card que en homepage pero con más info:
    - Imagen (aspect-ratio 16/10)
    - Badge categoría
    - Nombre — 20px, semibold
    - Descripción corta (line-clamp 2) — 14px, gris
    - Fila de amenidades (íconos pequeños): Wi-Fi, Parrilla, Baño, etc. (max 4 visibles)
    - Badge de disponibilidad: "Disponible" (verde) / "En mantenimiento" (amarillo) / "No disponible" (rojo)
    - Botón: "Ver Detalles" → link a /instalaciones/[slug]
  - Animación: fade-in al hacer scroll
- **Datos:** Collection `instalaciones`, filtradas según tab activo

---

## Página 4: Detalle de Instalación (`app/(frontend)/instalaciones/[slug]/page.tsx`)

### Sección 1 — Galería de Imágenes

- Full width, altura 500px desktop, 300px mobile
- Si hay múltiples imágenes: galería con thumbnail strip abajo o slider
- Si hay 1 imagen: imagen hero simple con overlay sutil

### Sección 2 — Info Principal

- Fondo blanco, padding 80px
- Layout 2 columnas (65/35) desktop, stack mobile:
  - **Columna principal (izquierda):**
    - Breadcrumb: Inicio > Instalaciones > [Nombre]
    - Badge categoría
    - Título: nombre de la instalación — 36px / 28px, bold, verde oscuro
    - Capacidad: ícono personas + "Hasta X personas"
    - Descripción rich text completa
    - **Amenidades** en grid de 2-3 columnas:
      - Cada amenidad: ícono + nombre (ej: ✓ Wi-Fi, ✓ Parrilla, ✓ Cocina equipada)
  - **Sidebar (derecha):**
    - Card con fondo crema, border-radius 12px, padding 24px, sticky:
      - Título: "Tarifas"
      - Lista de tarifas: concepto + precio (ej: "Noche entre semana — S/ 250")
      - Separador
      - Badge de disponibilidad
      - Botón grande: "Reservar Esta Instalación" → fondo dorado, full width
      - Nota pequeña: "Exclusivo para socios"
- **Datos:** Collection `instalaciones` por slug

### Sección 3 — Instalaciones Relacionadas

- Fondo crema, padding 60px
- Título: "También Te Puede Interesar"
- 3 cards de otras instalaciones de la misma categoría (o aleatorias)
- **Datos:** Collection `instalaciones` filtrado por misma `categoria`, excluyendo la actual, limit 3

---

## Página 5: Actividades/Eventos (`app/(frontend)/actividades/page.tsx`)

### Sección 1 — Hero Interno

- Título: "Actividades y Eventos"
- Breadcrumb: Inicio > Actividades

### Sección 2 — Filtros + Lista

- Tabs de filtro por tipo: Todos, Social, Deportivo, Cultural, Gastronómico
- Tabs de estado: Próximos, En Curso, Pasados
- **Lista de eventos:**
  - Card horizontal en desktop (imagen izquierda 300px, contenido derecha)
  - Card vertical en mobile (imagen arriba, contenido abajo)
  - Por cada evento:
    - Imagen (aspect-ratio 16/9 o 4/3)
    - Fecha formateada con ícono
    - Tipo (badge)
    - Título — 22px, semibold
    - Resumen — 14px, gris
    - Ubicación dentro del club
    - Botón: "Ver Detalles" si hay más info, o "Inscribirse" si requiere inscripción
- Paginación o infinite scroll
- **Datos:** Collection `eventos` ordenados por fecha

---

## Página 6: Noticias (`app/(frontend)/noticias/page.tsx`)

### Sección 1 — Hero Interno

- Título: "Noticias y Comunicados"

### Sección 2 — Lista de Noticias

- Filtro por categoría: Todos, Comunicado, Noticia, Aviso, Mantenimiento
- Layout:
  - Primera noticia destacada: card grande, imagen a la izquierda (50%), contenido a la derecha
  - Resto: grid de 3 columnas desktop, 2 tablet, 1 mobile
- **Card de noticia:**
  - Imagen portada (aspect-ratio 16/10)
  - Categoría badge
  - Fecha de publicación
  - Título — 18px, semibold
  - Resumen — 14px, gris, line-clamp 3
  - "Leer más →"
- **Datos:** Collection `noticias` filtrado por `publicado: true`, ordenado por `fechaPublicacion` DESC

---

## Página 7: Contacto (`app/(frontend)/contacto/page.tsx`)

### Sección 1 — Hero Interno

- Título: "Contacto"

### Sección 2 — Info + Formulario

- Fondo blanco, padding 80px
- Layout 2 columnas (45/55) desktop, stack mobile:
  - **Izquierda — Información:**
    - Título: "¿Cómo Llegar?"
    - Dirección completa con ícono de ubicación
    - Teléfono con ícono
    - Email con ícono
    - Horario de atención con ícono
    - Redes sociales (íconos con links)
    - Todo sacado de Global `site-config`
  - **Derecha — Formulario:**
    - Card con fondo gris muy claro (#F8F8F8), padding 32px, border-radius 12px
    - Campos:
      - Nombre (text, required)
      - Email (email, required)
      - Teléfono (text, optional)
      - Asunto (text, required)
      - Mensaje (textarea, required, 5 rows)
    - Botón submit: "Enviar Mensaje" → fondo verde, full width
    - Estado de éxito: mensaje verde "Mensaje enviado correctamente"
    - Usa Server Action para crear documento en collection `mensajes-contacto`

### Sección 3 — Mapa

- Google Maps embed full width, altura 400px desktop, 300px mobile
- Border-radius top 0 (pegado a la sección anterior)
- **Datos:** Global `site-config` → campo `googleMapsEmbed`

---

## Página 8: Portal de Socios — Login (`app/(frontend)/mi-cuenta/page.tsx`)

### Si no autenticado: Formulario de Login

- Centrado en la página, max-width 440px
- Card con fondo blanco, sombra, border-radius 12px, padding 40px
- Logo del club arriba
- Título: "Portal de Socios"
- Campos: Email + Contraseña
- Botón: "Iniciar Sesión" → verde, full width
- Link: "¿Olvidaste tu contraseña?"
- Usa Payload Auth de la collection `socios`

### Si autenticado: Dashboard del Socio

- Layout con sidebar izquierda (en desktop) o tabs horizontales (mobile):
  - Mi Perfil
  - Mis Reservas
  - Nueva Reserva
  - Cerrar Sesión
- **Mi Perfil:** Datos del socio (nombre, código, membresía, familiares) en formato de ficha
- **Mis Reservas:** Tabla/lista de reservas con estado (badge de colores), fecha, instalación
- **Nueva Reserva:** Formulario paso a paso:
  1. Seleccionar instalación (dropdown con imágenes)
  2. Seleccionar fechas (date picker con disponibilidad)
  3. Cantidad de personas
  4. Confirmar y enviar

---

## Componentes Reutilizables

| Componente | Uso |
|---|---|
| `SectionHeader` | Label dorado + Título verde + Subtítulo gris, centrado |
| `InternalHero` | Hero reducido para páginas internas (imagen + overlay + título + breadcrumb) |
| `InstallCard` | Card de instalación (imagen + badge + nombre + link) |
| `EventCard` | Card de evento (imagen + fecha + tipo + título) |
| `NewsCard` | Card de noticia (imagen + categoría + fecha + título + resumen) |
| `Button` | Variantes: primary (verde), secondary (dorado), outline (borde), ghost |
| `Badge` | Variantes por color para categorías, estados, tipos |
| `StatCounter` | Número animado + label para la sección de stats |
| `FilterTabs` | Tabs horizontales con scroll en mobile para filtros |
| `Breadcrumb` | Navegación jerárquica (Inicio > Sección > Página) |
| `ContactInfo` | Bloque de info de contacto con íconos |
| `ImageGallery` | Galería de imágenes con lightbox |
| `ReservationForm` | Formulario multi-step de reserva |

---

## Notas de Implementación

- Usar `getPayload()` en Server Components para traer datos de Payload.
- Las imágenes se optimizan con `next/image` usando los `imageSizes` definidos en la collection Media.
- Animaciones sutiles con CSS transitions o framer-motion (fade-in al scroll, hover en cards).
- Los formularios (contacto, reserva, login) usan Server Actions de Next.js.
- SEO: cada página genera su propio `metadata` con título, descripción y OG image.
- Textos de UI todos en español.
- Usar Lucide React para todos los íconos.
