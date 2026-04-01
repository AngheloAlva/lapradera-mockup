import 'dotenv/config'
import { getPayload } from 'payload'
import config from './payload.config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface LexicalRoot {
  root: {
    type: 'root'
    children: LexicalParagraph[]
    direction: 'ltr'
    format: ''
    indent: 0
    version: 1
  }
}

interface LexicalParagraph {
  type: 'paragraph'
  children: LexicalText[]
  direction: 'ltr'
  format: ''
  indent: 0
  textFormat: 0
  textStyle: ''
  version: 1
}

interface LexicalText {
  type: 'text'
  text: string
  format: 0
  detail: 0
  mode: 'normal'
  style: ''
  version: 1
}

function richText(paragraphs: string[]): LexicalRoot {
  return {
    root: {
      type: 'root',
      children: paragraphs.map(
        (text): LexicalParagraph => ({
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text,
              format: 0,
              detail: 0,
              mode: 'normal',
              style: '',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          textFormat: 0,
          textStyle: '',
          version: 1,
        }),
      ),
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function downloadImage(
  url: string,
  filename: string,
): Promise<{ data: Buffer; mimeType: string; filename: string }> {
  const response = await fetch(url, { redirect: 'follow' })
  if (!response.ok) throw new Error(`Failed to download image: ${url}`)
  const arrayBuffer = await response.arrayBuffer()
  const data = Buffer.from(arrayBuffer)
  const contentType = response.headers.get('content-type') ?? 'image/jpeg'
  const mimeType = contentType.split(';')[0].trim()
  return { data, mimeType, filename }
}

// ---------------------------------------------------------------------------
// Main seed
// ---------------------------------------------------------------------------

async function seed() {
  console.log('🌱 Starting seed...')

  const payload = await getPayload({ config })

  // -----------------------------------------------------------------------
  // Idempotency check
  // -----------------------------------------------------------------------
  const existingInstalaciones = await payload.find({
    collection: 'instalaciones',
    limit: 1,
  })
  if (existingInstalaciones.totalDocs > 0) {
    console.log('⚠️  Database already has data. Skipping seed.')
    console.log('   To re-seed, delete the database file and run again.')
    process.exit(0)
  }

  // -----------------------------------------------------------------------
  // 1. Upload Media (placeholder images from picsum.photos)
  // -----------------------------------------------------------------------
  console.log('\n📸 Uploading media...')

  const tmpDir = path.resolve(dirname, '../.seed-tmp')
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true })
  }

  type MediaRecord = Awaited<ReturnType<typeof payload.create<'media'>>>

  async function uploadImage(
    alt: string,
    width: number,
    height: number,
    seed: number,
  ): Promise<MediaRecord> {
    const url = `https://picsum.photos/seed/${seed}/${width}/${height}`
    const fname = `seed-${seed}-${width}x${height}.jpg`
    const filePath = path.join(tmpDir, fname)

    try {
      const { data } = await downloadImage(url, fname)
      fs.writeFileSync(filePath, data)

      const doc = await payload.create({
        collection: 'media',
        data: { alt },
        filePath,
      })
      console.log(`   ✅ Media: ${alt}`)
      return doc
    } catch (err) {
      console.error(`   ❌ Failed to upload ${alt}:`, err)
      throw err
    }
  }

  // Hero slider images (3)
  const heroImages: MediaRecord[] = []
  const heroAlts = [
    'Vista panorámica del valle de Santa Eulalia desde La Pradera',
    'Bungalos rodeados de naturaleza en La Pradera Country Club',
    'Actividades deportivas y familiares en La Pradera',
  ]
  for (let i = 0; i < 3; i++) {
    heroImages.push(await uploadImage(heroAlts[i], 1920, 1080, 100 + i))
  }

  // Instalaciones images (8 main + some extras)
  const instalacionesImages: MediaRecord[] = []
  const instalacionesAlts = [
    'Bungalo Premium A1 con vista al jardín',
    'Bungalo Familiar B3 exterior',
    'Piscina Olímpica de La Pradera',
    'Piscina Recreativa Infantil con tobogán',
    'Cancha de Tenis iluminada',
    'Cancha de Fútbol reglamentaria',
    'Salón Principal del Club House',
    'Playa de arena blanca a orillas del río',
  ]
  for (let i = 0; i < 8; i++) {
    instalacionesImages.push(await uploadImage(instalacionesAlts[i], 1200, 800, 200 + i))
  }

  // Eventos images (4)
  const eventosImages: MediaRecord[] = []
  const eventosAlts = [
    'Torneo de Tenis de Verano en La Pradera',
    'Noche de Parrillada y Música en Vivo',
    'Día de la Familia en La Pradera',
    'Taller de Yoga al Aire Libre',
  ]
  for (let i = 0; i < 4; i++) {
    eventosImages.push(await uploadImage(eventosAlts[i], 1200, 800, 300 + i))
  }

  // Galería images (12 for 3 galleries)
  const galeriaImages: MediaRecord[] = []
  const galeriaAlts = [
    'Familias disfrutando de la piscina en verano',
    'Niños jugando en el área recreativa',
    'Atardecer desde la playa del club',
    'Bungalos iluminados al anochecer',
    'Parrillada junto a la piscina',
    'Gol en el torneo de fútbol intersocios',
    'Equipos posando antes del partido',
    'Premiación del torneo de fútbol',
    'Hinchada animando desde las tribunas',
    'Decoración del Club House para Año Nuevo',
    'Brindis de fin de año entre socios',
    'Fuegos artificiales sobre La Pradera',
  ]
  for (let i = 0; i < 12; i++) {
    galeriaImages.push(await uploadImage(galeriaAlts[i], 1200, 800, 400 + i))
  }

  // Welcome section + CTA + Nosotros images
  const welcomeImage = await uploadImage(
    'Área verde principal de La Pradera Country Club',
    1200,
    800,
    500,
  )
  const ctaImage = await uploadImage('Vista aérea de La Pradera Country Club', 1920, 1080, 501)
  const historiaImages: MediaRecord[] = []
  for (let i = 0; i < 2; i++) {
    historiaImages.push(
      await uploadImage(
        i === 0 ? 'La Pradera en sus primeros años' : 'Áreas/Servicios actuales de La Pradera',
        1200,
        800,
        510 + i,
      ),
    )
  }

  // -----------------------------------------------------------------------
  // 2. SiteConfig Global
  // -----------------------------------------------------------------------
  console.log('\n⚙️  Updating SiteConfig...')

  await payload.updateGlobal({
    slug: 'site-config',
    data: {
      nombreClub: 'La Pradera Country Club',
      telefono: '(01) 497-0000',
      email: 'informes@lapradera.com.pe',
      direccion: 'Km 38.5 Carretera Central, Valle de Santa Eulalia, Chosica, Lima, Perú',
      horarioAtencion: 'Lunes a Domingo, 8:00 AM - 6:00 PM',
      redesSociales: {
        facebook: 'https://facebook.com/lapraderaperu',
        instagram: 'https://instagram.com/lapraderaperu',
        tiktok: 'https://tiktok.com/@lapraderaperu',
        youtube: 'https://youtube.com/@lapraderaperu',
      },
      googleMapsEmbed:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.123456789!2d-76.123456!3d-11.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sLa+Pradera+Country+Club!5e0!3m2!1ses!2spe!4v1234567890',
    },
  })
  console.log('   ✅ SiteConfig updated')

  // -----------------------------------------------------------------------
  // 3. Instalaciones
  // -----------------------------------------------------------------------
  console.log('\n🏠 Creating Áreas/Servicios...')

  interface InstalacionSeed {
    nombre: string
    slug: string
    categoria: string
    capacidad: number
    esReservable: boolean
    destacado: boolean
    orden: number
    amenidades: Array<{ nombre: string }>
    tarifas?: Array<{ concepto: string; precio: number; moneda: 'PEN' | 'USD' }>
    descripcion: LexicalRoot
    imageIndex: number
  }

  const instalacionesData: InstalacionSeed[] = [
    {
      nombre: 'Bungal Premium A1',
      slug: 'bungalo-premium-a1',
      categoria: 'bungalo',
      capacidad: 8,
      esReservable: true,
      destacado: true,
      orden: 1,
      amenidades: [
        { nombre: 'Wi-Fi' },
        { nombre: 'Parrilla' },
        { nombre: 'Cocina equipada' },
        { nombre: 'Baño privado' },
        { nombre: 'Estacionamiento' },
        { nombre: 'TV Cable' },
      ],
      tarifas: [
        { concepto: 'Noche entre semana', precio: 350, moneda: 'PEN' },
        { concepto: 'Noche fin de semana', precio: 450, moneda: 'PEN' },
        { concepto: 'Feriado', precio: 550, moneda: 'PEN' },
      ],
      descripcion: richText([
        'Nuestro bungalo más amplio y cómodo, ideal para familias grandes o grupos de amigos.',
        'Cuenta con dos habitaciones, sala de estar, cocina totalmente equipada y terraza con parrilla propia. Rodeado de jardines y con vista al valle.',
      ]),
      imageIndex: 0,
    },
    {
      nombre: 'Bungalo Familiar B3',
      slug: 'bungalo-familiar-b3',
      categoria: 'bungalo',
      capacidad: 6,
      esReservable: true,
      destacado: true,
      orden: 2,
      amenidades: [
        { nombre: 'Wi-Fi' },
        { nombre: 'Parrilla' },
        { nombre: 'Baño privado' },
        { nombre: 'Estacionamiento' },
      ],
      tarifas: [
        { concepto: 'Noche entre semana', precio: 280, moneda: 'PEN' },
        { concepto: 'Noche fin de semana', precio: 380, moneda: 'PEN' },
      ],
      descripcion: richText([
        'Bungalo acogedor para familias, con una habitación principal y un altillo para los más pequeños.',
        'Incluye parrilla en el jardín y estacionamiento propio.',
      ]),
      imageIndex: 1,
    },
    {
      nombre: 'Piscina Olímpica',
      slug: 'piscina-olimpica',
      categoria: 'piscina',
      capacidad: 100,
      esReservable: false,
      destacado: true,
      orden: 3,
      amenidades: [
        { nombre: 'Vestidores' },
        { nombre: 'Duchas' },
        { nombre: 'Casilleros' },
        { nombre: 'Sillas de descanso' },
      ],
      descripcion: richText([
        'Piscina de dimensiones semi-olímpicas con agua tratada y temperatura agradable durante todo el año.',
        'Perfecta para nadar, hacer ejercicio o simplemente relajarse bajo el sol del valle.',
      ]),
      imageIndex: 2,
    },
    {
      nombre: 'Piscina Recreativa Infantil',
      slug: 'piscina-recreativa-infantil',
      categoria: 'piscina',
      capacidad: 40,
      esReservable: false,
      destacado: false,
      orden: 4,
      amenidades: [{ nombre: 'Tobogán' }, { nombre: 'Área techada' }, { nombre: 'Baños' }],
      descripcion: richText([
        'Diseñada especialmente para los más pequeños, con poca profundidad y tobogán acuático.',
        'Zona techada para protección solar y vigilancia permanente.',
      ]),
      imageIndex: 3,
    },
    {
      nombre: 'Cancha de Tenis 1',
      slug: 'cancha-de-tenis-1',
      categoria: 'cancha-tenis',
      capacidad: 4,
      esReservable: true,
      destacado: true,
      orden: 5,
      amenidades: [
        { nombre: 'Iluminación nocturna' },
        { nombre: 'Vestidores' },
        { nombre: 'Raquetas disponibles' },
      ],
      tarifas: [
        { concepto: 'Hora', precio: 60, moneda: 'PEN' },
        { concepto: 'Hora nocturna', precio: 80, moneda: 'PEN' },
      ],
      descripcion: richText([
        'Cancha de tenis con superficie de arcilla, mantenida en excelentes condiciones.',
        'Disponible para reservas individuales y torneos del club. Iluminación LED para partidos nocturnos.',
      ]),
      imageIndex: 4,
    },
    {
      nombre: 'Cancha de Fútbol',
      slug: 'cancha-de-futbol',
      categoria: 'cancha-futbol',
      capacidad: 22,
      esReservable: true,
      destacado: false,
      orden: 6,
      amenidades: [
        { nombre: 'Iluminación nocturna' },
        { nombre: 'Vestidores' },
        { nombre: 'Arcos reglamentarios' },
      ],
      tarifas: [
        { concepto: 'Hora', precio: 120, moneda: 'PEN' },
        { concepto: 'Hora nocturna', precio: 150, moneda: 'PEN' },
      ],
      descripcion: richText([
        'Cancha de fútbol de grass natural con medidas reglamentarias para fútbol 7 y 11.',
        'Arcos profesionales, iluminación nocturna y vestidores con duchas.',
      ]),
      imageIndex: 5,
    },
    {
      nombre: 'Club House — Salón Principal',
      slug: 'club-house-salon-principal',
      categoria: 'salon',
      capacidad: 120,
      esReservable: true,
      destacado: true,
      orden: 7,
      amenidades: [
        { nombre: 'Sonido' },
        { nombre: 'Proyector' },
        { nombre: 'Cocina' },
        { nombre: 'Bar' },
        { nombre: 'Aire acondicionado' },
        { nombre: 'Estacionamiento' },
      ],
      tarifas: [
        { concepto: 'Evento medio día', precio: 2500, moneda: 'PEN' },
        { concepto: 'Evento día completo', precio: 4000, moneda: 'PEN' },
      ],
      descripcion: richText([
        'El salón principal del Club House es el espacio ideal para eventos, celebraciones y reuniones corporativas.',
        'Equipado con sistema de sonido profesional, proyector HD, cocina industrial, bar y aire acondicionado central. Capacidad para 120 personas sentadas.',
      ]),
      imageIndex: 6,
    },
    {
      nombre: 'Playa La Pradera',
      slug: 'playa-la-pradera',
      categoria: 'playa',
      capacidad: 200,
      esReservable: false,
      destacado: true,
      orden: 8,
      amenidades: [
        { nombre: 'Arena blanca' },
        { nombre: 'Sombrillas' },
        { nombre: 'Sillas' },
        { nombre: 'Vestidores' },
        { nombre: 'Duchas' },
        { nombre: 'Kiosko' },
      ],
      descripcion: richText([
        'Nuestra emblemática playa privada de arena blanca a orillas del río Santa Eulalia.',
        'Un oasis único en Lima con sombrillas, sillas de playa, kiosko con snacks y bebidas, vestidores y duchas. El lugar favorito de nuestros socios en verano.',
      ]),
      imageIndex: 7,
    },
  ]

  const instalacionDocs: Array<{ id: number | string; nombre: string }> = []

  for (const inst of instalacionesData) {
    const doc = await payload.create({
      collection: 'instalaciones',
      data: {
        nombre: inst.nombre,
        slug: inst.slug,
        categoria: inst.categoria,
        capacidad: inst.capacidad,
        esReservable: inst.esReservable,
        destacado: inst.destacado,
        orden: inst.orden,
        estado: 'disponible',
        amenidades: inst.amenidades,
        tarifas: inst.tarifas ?? [],
        descripcion: inst.descripcion,
        imagenes: [
          {
            imagen: instalacionesImages[inst.imageIndex].id,
            alt: instalacionesImages[inst.imageIndex].alt,
          },
        ],
      },
    })
    instalacionDocs.push({ id: doc.id, nombre: doc.nombre })
    console.log(`   ✅ Instalación: ${inst.nombre}`)
  }

  // -----------------------------------------------------------------------
  // 4. Eventos
  // -----------------------------------------------------------------------
  console.log('\n🎉 Creating Eventos...')

  interface EventoSeed {
    titulo: string
    slug: string
    tipo: string
    estado: string
    fechaInicio: string
    fechaFin: string
    ubicacion: string
    resumen: string
    requiereInscripcion: boolean
    cupoMaximo?: number
    imageIndex: number
  }

  const eventosData: EventoSeed[] = [
    {
      titulo: 'Torneo de Tenis de Verano 2026',
      slug: 'torneo-de-tenis-de-verano-2026',
      tipo: 'deportivo',
      estado: 'proximo',
      fechaInicio: '2026-04-15T09:00:00.000Z',
      fechaFin: '2026-04-15T18:00:00.000Z',
      ubicacion: 'Cancha de Tenis 1',
      resumen: 'Torneo abierto para socios. Categorías singles y dobles.',
      requiereInscripcion: true,
      cupoMaximo: 32,
      imageIndex: 0,
    },
    {
      titulo: 'Noche de Parrillada y Música en Vivo',
      slug: 'noche-de-parrillada-y-musica-en-vivo',
      tipo: 'gastronomico',
      estado: 'proximo',
      fechaInicio: '2026-04-20T18:00:00.000Z',
      fechaFin: '2026-04-20T23:00:00.000Z',
      ubicacion: 'Club House',
      resumen: 'Una noche especial con parrilla al carbón, música criolla y folklore.',
      requiereInscripcion: true,
      cupoMaximo: 80,
      imageIndex: 1,
    },
    {
      titulo: 'Día de la Familia La Pradera',
      slug: 'dia-de-la-familia-la-pradera',
      tipo: 'social',
      estado: 'proximo',
      fechaInicio: '2026-05-10T10:00:00.000Z',
      fechaFin: '2026-05-10T17:00:00.000Z',
      ubicacion: 'Área de piscinas y explanada',
      resumen: 'Juegos, concursos, piscina y almuerzo para toda la familia.',
      requiereInscripcion: false,
      imageIndex: 2,
    },
    {
      titulo: 'Taller de Yoga al Aire Libre',
      slug: 'taller-de-yoga-al-aire-libre',
      tipo: 'cultural',
      estado: 'proximo',
      fechaInicio: '2026-04-12T07:00:00.000Z',
      fechaFin: '2026-04-12T09:00:00.000Z',
      ubicacion: 'Jardines principales',
      resumen: 'Sesión de yoga para todos los niveles rodeados de naturaleza.',
      requiereInscripcion: true,
      cupoMaximo: 25,
      imageIndex: 3,
    },
  ]

  for (const evento of eventosData) {
    const data: Record<string, unknown> = {
      titulo: evento.titulo,
      slug: evento.slug,
      tipo: evento.tipo,
      estado: evento.estado,
      fechaInicio: evento.fechaInicio,
      fechaFin: evento.fechaFin,
      ubicacion: evento.ubicacion,
      resumen: evento.resumen,
      requiereInscripcion: evento.requiereInscripcion,
      imagenPortada: eventosImages[evento.imageIndex].id,
    }
    if (evento.cupoMaximo !== undefined) {
      data.cupoMaximo = evento.cupoMaximo
    }
    await payload.create({
      collection: 'eventos',
      data: data as Parameters<typeof payload.create<'eventos'>>[0]['data'],
    })
    console.log(`   ✅ Evento: ${evento.titulo}`)
  }

  // -----------------------------------------------------------------------
  // 5. Galerías
  // -----------------------------------------------------------------------
  console.log('\n🖼️  Creating Galerías...')

  interface GaleriaSeed {
    titulo: string
    descripcion: string
    fecha: string
    publicado: boolean
    imageIndices: number[]
    imageDescriptions: string[]
  }

  const galeriasData: GaleriaSeed[] = [
    {
      titulo: 'Verano 2026 en La Pradera',
      descripcion: 'Los mejores momentos del verano en nuestro club.',
      fecha: '2026-02-15',
      publicado: true,
      imageIndices: [0, 1, 2, 3, 4],
      imageDescriptions: [
        'Familias disfrutando de la piscina en un día soleado',
        'Niños jugando en el área recreativa',
        'Atardecer desde la playa del club',
        'Bungalos iluminados al anochecer',
        'Parrillada junto a la piscina',
      ],
    },
    {
      titulo: 'Torneo de Fútbol Marzo 2026',
      descripcion: 'Torneo intersocios de fútbol 7.',
      fecha: '2026-03-20',
      publicado: true,
      imageIndices: [5, 6, 7, 8],
      imageDescriptions: [
        'Gol decisivo en la semifinal',
        'Los equipos posando antes del partido inaugural',
        'Premiación de los campeones',
        'La hinchada animando desde las tribunas',
      ],
    },
    {
      titulo: 'Fiesta de Año Nuevo 2026',
      descripcion: 'Celebración de fin de año en el Club House.',
      fecha: '2026-01-01',
      publicado: true,
      imageIndices: [9, 10, 11],
      imageDescriptions: [
        'Decoración elegante del Club House para la celebración',
        'Brindis de medianoche entre socios y amigos',
        'Fuegos artificiales iluminando el cielo de La Pradera',
      ],
    },
  ]

  for (const galeria of galeriasData) {
    await payload.create({
      collection: 'galerias',
      data: {
        titulo: galeria.titulo,
        descripcion: galeria.descripcion,
        fecha: galeria.fecha,
        publicado: galeria.publicado,
        imagenes: galeria.imageIndices.map((idx, i) => ({
          imagen: galeriaImages[idx].id,
          descripcion: galeria.imageDescriptions[i],
        })),
      },
    })
    console.log(`   ✅ Galería: ${galeria.titulo}`)
  }

  // -----------------------------------------------------------------------
  // 6. Homepage Global
  // -----------------------------------------------------------------------
  console.log('\n🏡 Updating Homepage...')

  await payload.updateGlobal({
    slug: 'homepage',
    data: {
      heroSlider: [
        {
          imagen: heroImages[0].id,
          titulo: 'Tu Refugio Natural en el Valle de Santa Eulalia',
          subtitulo: 'Más de 16 hectáreas de naturaleza, deporte y familia',
          textoBoton: 'Reservar Ahora',
          enlaceBoton: '/contacto',
        },
        {
          imagen: heroImages[1].id,
          titulo: '30 Bungalos Para Tu Descanso',
          subtitulo: 'Escápate del ruido de la ciudad y disfruta la tranquilidad',
          textoBoton: 'Ver Áreas/Servicios',
          enlaceBoton: '/instalaciones',
        },
        {
          imagen: heroImages[2].id,
          titulo: 'Eventos y Actividades Todo el Año',
          subtitulo: 'Deportes, gastronomía, cultura y más para toda la familia',
          textoBoton: 'Ver Actividades',
          enlaceBoton: '/actividades',
        },
      ],
      seccionBienvenida: {
        titulo: 'Bienvenidos a La Pradera',
        descripcion: richText([
          'Fundado en 1991, La Pradera Country Club es un oasis en el valle de Santa Eulalia. Con más de 16 hectáreas de áreas verdes, ofrecemos a nuestros socios y sus familias un espacio único para disfrutar de la naturaleza, el deporte y la convivencia.',
          'Nuestra playa privada de arena blanca a orillas del río Santa Eulalia es solo una de las muchas maravillas que nos hacen únicos.',
        ]),
        imagen: welcomeImage.id,
      },
      seccionInstalaciones: {
        titulo: 'Nuestras Áreas/Servicios',
        subtitulo: 'Espacios diseñados para tu comodidad y diversión',
      },
      seccionEventos: {
        titulo: 'Próximos Eventos',
        subtitulo: 'Entérate de las actividades que tenemos preparadas para ti',
      },
      bannerCTA: {
        titulo: '¿Listo Para Vivir la Experiencia La Pradera?',
        descripcion:
          'Reserva tu bungalo o instalación favorita y disfruta de un fin de semana inolvidable.',
        textoBoton: 'Hacer una Reserva',
        enlaceBoton: '/contacto',
        imagenFondo: ctaImage.id,
      },
    },
  })
  console.log('   ✅ Homepage updated')

  // -----------------------------------------------------------------------
  // 7. Nosotros Global
  // -----------------------------------------------------------------------
  console.log('\n📖 Updating Nosotros...')

  await payload.updateGlobal({
    slug: 'nosotros',
    data: {
      historia: {
        titulo: 'Nuestra Historia',
        contenido: richText([
          'La Pradera Country Club fue fundado en 1991 por un grupo de familias limeñas que soñaban con un espacio de recreación y descanso en el hermoso valle de Santa Eulalia. Lo que comenzó como un terreno de 5 hectáreas ha crecido hasta convertirse en uno de los clubes campestres más completos de Lima, con más de 16 hectáreas de instalaciones de primer nivel.',
          'A lo largo de más de 30 años, hemos construido 30 bungalos, 4 piscinas, canchas deportivas, un club house, una capilla y nuestra emblemática playa privada de arena blanca. Cada mejora ha sido pensada para brindar a nuestros socios y sus familias la mejor experiencia posible.',
        ]),
        imagenes: historiaImages.map((img) => ({
          imagen: img.id,
        })),
      },
      mision:
        'Ser el club campestre de referencia en Lima, brindando a nuestros socios espacios de recreación, deporte y descanso de la más alta calidad, fomentando la vida en familia y el contacto con la naturaleza.',
      vision:
        'Consolidarnos como el mejor club campestre del Perú, reconocido por la excelencia de nuestras instalaciones, la calidez de nuestro servicio y nuestro compromiso con el medio ambiente y la comunidad.',
      valores: [
        {
          titulo: 'Familia',
          descripcion:
            'Promovemos la unión familiar a través de espacios y actividades para todas las edades.',
        },
        {
          titulo: 'Naturaleza',
          descripcion:
            'Respetamos y cuidamos nuestro entorno natural, el río y las áreas verdes que nos rodean.',
        },
        {
          titulo: 'Excelencia',
          descripcion: 'Buscamos la mejora continua en nuestras instalaciones y servicios.',
        },
        {
          titulo: 'Comunidad',
          descripcion:
            'Fomentamos la convivencia sana y el espíritu deportivo entre nuestros socios.',
        },
        {
          titulo: 'Tradición',
          descripcion:
            'Honramos más de 30 años de historia y las familias que hicieron posible este club.',
        },
        {
          titulo: 'Servicio',
          descripcion: 'Atendemos a nuestros socios con calidez, profesionalismo y dedicación.',
        },
      ],
      consejoDirectivo: [
        { nombre: 'Carlos Mendoza Rivera', cargo: 'Presidente' },
        { nombre: 'María Elena Vargas', cargo: 'Vicepresidenta' },
        { nombre: 'Roberto Sánchez Torres', cargo: 'Secretario General' },
        { nombre: 'Ana Lucía Paredes', cargo: 'Tesorera' },
        { nombre: 'Jorge Delgado Ruiz', cargo: 'Vocal de Deportes' },
        { nombre: 'Patricia Flores Medina', cargo: 'Vocal de Eventos' },
      ],
    },
  })
  console.log('   ✅ Nosotros updated')

  // -----------------------------------------------------------------------
  // Cleanup temp files
  // -----------------------------------------------------------------------
  console.log('\n🧹 Cleaning up temp files...')
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true })
    console.log('   ✅ Temp directory removed')
  } catch {
    console.log('   ⚠️  Could not remove temp directory, clean up manually')
  }

  // -----------------------------------------------------------------------
  // Done
  // -----------------------------------------------------------------------
  console.log('\n✅ Seed completed successfully!')
  console.log(`   - ${instalacionDocs.length} instalaciones`)
  console.log(`   - ${eventosData.length} eventos`)
  console.log(`   - ${galeriasData.length} galerías`)
  console.log('   - SiteConfig, Homepage, Nosotros globals updated')
  console.log('')

  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
