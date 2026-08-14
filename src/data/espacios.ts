/**
 * Catálogo de los 7 espacios de desarrollo.
 *
 * Es la fuente de truth + fallback que se usa cuando la página equivalente
 * en el CMS (`paginas` con plantilla L) está en borrador o no existe. Las
 * URLs públicas son `/espacios/[slug]`.
 */

export interface FichaItem {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface Actividad {
  icon: string;
  title: string;
  desc: string;
  highlight?: boolean;
}

export interface EspacioItem {
  slug: string;
  /** Lo que muestra el hero (ej. "VASE", "Cultura"). */
  nombre: string;
  ghostText: string;
  heroSubtitle: string;
  metaTitle: string;
  metaDescription: string;

  detalle: {
    badge: string;
    heading: string;
    paragraphs: string[];
    tags: string[];
    nota: string;
    ficha: FichaItem[];
    photoSrc: string;
    photoAlt: string;
  };

  actividades: {
    title: string;
    photoSrc: string;
    photoCaption: string;
    items: Actividad[];
  };
}

export const ESPACIOS: EspacioItem[] = [
  {
    slug: "vase",
    nombre: "VASE",
    ghostText: "VASE",
    heroSubtitle:
      "Valores, Actitudes, Servicio y Espiritualidad — formando el carácter que el mundo necesita.",
    metaTitle: "VASE — Valores, Actitudes, Servicio y Espiritualidad | Atenas",
    metaDescription:
      "El programa VASE de la Unidad Educativa Atenas forma el carácter de sus estudiantes a través de valores, servicio comunitario y liderazgo ético.",
    detalle: {
      badge: "VASE — Valores, Actitudes, Servicio y Espiritualidad",
      heading: "Un espacio para construir carácter",
      paragraphs: [
        "VASE es el espacio donde los estudiantes desarrollan su dimensión ética, espiritual y de servicio. A través de proyectos comunitarios, reflexión personal y actividades de liderazgo, cada alumno construye el carácter que el mundo necesita.",
        "Este programa transversal se integra en todas las etapas educativas, reforzando los valores institucionales y el compromiso social como pilares de la formación integral.",
      ],
      tags: ["Liderazgo", "Servicio", "Valores", "Espiritualidad", "Comunidad"],
      nota:
        "VASE no es una asignatura más — es una forma de ser y estar en el mundo que cada estudiante de Atenas desarrolla a lo largo de toda su trayectoria escolar.",
      ficha: [
        { label: "Niveles", value: "Todos los niveles" },
        { label: "Modalidad", value: "Presencial" },
        { label: "Frecuencia", value: "Semanal", highlight: true },
        { label: "Coordinación", value: "Dirección Pastoral" },
      ],
      photoSrc:
        "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=700&q=80",
      photoAlt: "Estudiantes en proyecto comunitario",
    },
    actividades: {
      title: "Lo que hacemos en VASE",
      photoSrc:
        "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=900&q=80",
      photoCaption: "Proyecto comunitario — Ambato",
      items: [
        { icon: "🕊", title: "Retiros espirituales", desc: "Jornadas de reflexión para fortalecer la dimensión interior del estudiante." },
        { icon: "🌱", title: "Proyectos comunitarios", desc: "Iniciativas de servicio que conectan al estudiante con la comunidad local." },
        { icon: "⭐", title: "Liderazgo estudiantil", desc: "Formación de líderes con valores éticos y visión de transformación social.", highlight: true },
        { icon: "🤝", title: "Voluntariado social", desc: "Acción directa en la comunidad a través de campañas y programas de apoyo." },
        { icon: "🙏", title: "Celebraciones litúrgicas", desc: "Momentos de encuentro espiritual que integran la fe con la vida escolar." },
      ],
    },
  },
  {
    slug: "cas",
    nombre: "CAS",
    ghostText: "CAS",
    heroSubtitle:
      "Creativity, Activity, Service — el corazón del Bachillerato Internacional que transforma ideas en acción.",
    metaTitle: "CAS — Creativity, Activity, Service | Atenas",
    metaDescription:
      "El programa CAS del Bachillerato Internacional en Atenas forma estudiantes activos, creativos y comprometidos con el servicio a su comunidad.",
    detalle: {
      badge: "CAS — Creativity, Activity, Service",
      heading: "Aprender haciendo, crecer sirviendo",
      paragraphs: [
        "CAS es uno de los componentes centrales del Bachillerato Internacional y exige que cada estudiante viva su formación más allá del aula. A través de proyectos creativos, actividad física y servicio genuino, los alumnos desarrollan autonomía, empatía y responsabilidad social.",
        "Cada estudiante diseña su propio portafolio CAS, documenta su proceso de aprendizaje y reflexiona sobre su crecimiento personal. Es un viaje de dos años que deja una huella real en la comunidad.",
      ],
      tags: ["IB", "Creatividad", "Actividad", "Servicio", "Portafolio"],
      nota:
        "CAS no es opcional en el IB — es el espacio donde los aprendizajes académicos cobran sentido al aplicarse al mundo real. En Atenas, este programa está acompañado de cerca por coordinadores dedicados.",
      ficha: [
        { label: "Niveles", value: "1.º y 2.º Bachillerato" },
        { label: "Modalidad", value: "Presencial y campo" },
        { label: "Duración", value: "2 años IB", highlight: true },
        { label: "Coordinación", value: "Coordinación IB" },
      ],
      photoSrc:
        "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=700&q=80",
      photoAlt: "Estudiantes en proyecto CAS",
    },
    actividades: {
      title: "Lo que hacemos en CAS",
      photoSrc:
        "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=900&q=80",
      photoCaption: "Proyecto CAS — Ambato",
      items: [
        { icon: "🎨", title: "Proyectos creativos", desc: "Arte, música, diseño y producción audiovisual como expresión del talento individual." },
        { icon: "🏃", title: "Actividad física", desc: "Deportes, expediciones y retos físicos que fortalecen el cuerpo y la resiliencia." },
        { icon: "🤝", title: "Servicio comunitario", desc: "Iniciativas reales de impacto local, diseñadas y lideradas por los propios estudiantes.", highlight: true },
        { icon: "📓", title: "Portafolio reflexivo", desc: "Documentación y reflexión continua del proceso de aprendizaje en plataforma IB." },
        { icon: "🌍", title: "Proyectos colaborativos", desc: "Trabajo en equipo interdisciplinario para abordar desafíos de la comunidad." },
      ],
    },
  },
  {
    slug: "idioma",
    nombre: "Idioma",
    ghostText: "IDIOMA",
    heroSubtitle:
      "Un entorno bilingüe que abre puertas al mundo desde los primeros años de formación.",
    metaTitle: "Programa de Idiomas | Atenas",
    metaDescription:
      "El programa de idiomas de la Unidad Educativa Atenas ofrece inglés intensivo, certificaciones Cambridge y un entorno de inmersión bilingüe desde los primeros años.",
    detalle: {
      badge: "Programa de Idiomas",
      heading: "Inglés con propósito y profundidad",
      paragraphs: [
        "El programa de idiomas de Atenas va más allá del inglés como asignatura: es un entorno de inmersión que acompaña al estudiante desde Inicial hasta Bachillerato. La metodología combina comunicación real, pensamiento crítico y preparación para exámenes internacionales.",
        "Nuestros estudiantes acceden a certificaciones Cambridge (KET, PET, FCE, CAE) que son reconocidas por universidades y empleadores en todo el mundo, con acompañamiento personalizado durante cada etapa.",
      ],
      tags: ["Inglés", "Cambridge", "Bilingüismo", "Certificaciones", "Comunicación"],
      nota:
        "El nivel de inglés al graduarse de Atenas es equivalente a B2-C1 del Marco Europeo, lo que permite a nuestros egresados acceder directamente a programas universitarios internacionales sin examen de suficiencia adicional.",
      ficha: [
        { label: "Niveles", value: "Inicial a Bachillerato" },
        { label: "Modalidad", value: "Presencial" },
        { label: "Certificación", value: "Cambridge", highlight: true },
        { label: "Coordinación", value: "Dpto. de Idiomas" },
      ],
      photoSrc:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=700&q=80",
      photoAlt: "Estudiantes en clase de inglés",
    },
    actividades: {
      title: "Lo que hacemos en Idioma",
      photoSrc:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=900&q=80",
      photoCaption: "Clase de inglés — Ambato",
      items: [
        { icon: "🗣️", title: "Conversación intensiva", desc: "Clases enfocadas en fluidez oral, escucha activa y confianza al comunicarse." },
        { icon: "📝", title: "Preparación Cambridge", desc: "Entrenamiento estructurado para los exámenes KET, PET, FCE y CAE.", highlight: true },
        { icon: "🎭", title: "Teatro en inglés", desc: "Obras y performances donde el idioma cobra vida en contextos reales y creativos." },
        { icon: "📰", title: "Debate y oratoria", desc: "Argumentación y presentaciones en inglés que desarrollan pensamiento crítico." },
        { icon: "🌐", title: "Clubes de conversación", desc: "Espacios extracurriculares para practicar con pares en un ambiente distendido." },
      ],
    },
  },
  {
    slug: "cultura",
    nombre: "Cultura",
    ghostText: "CULTURA",
    heroSubtitle:
      "Arte, música, teatro y danza — la expresión creativa como lenguaje universal de formación.",
    metaTitle: "Expresión Cultural | Atenas",
    metaDescription:
      "El espacio de Cultura en la Unidad Educativa Atenas fomenta la creatividad artística a través de música, artes plásticas, teatro y danza.",
    detalle: {
      badge: "Expresión Cultural",
      heading: "La creatividad como forma de conocer el mundo",
      paragraphs: [
        "El espacio cultural de Atenas reconoce que el arte no es complemento sino centro de una formación integral. Música, teatro, danza y artes plásticas son disciplinas que desarrollan sensibilidad, disciplina y pensamiento creativo en cada estudiante.",
        "Desde los festivales internos hasta las presentaciones abiertas a la comunidad, los estudiantes tienen escenarios reales donde mostrar su talento y construir confianza en sí mismos.",
      ],
      tags: ["Arte", "Música", "Teatro", "Danza", "Creatividad"],
      nota:
        "En Atenas creemos que un niño que aprende a tocar un instrumento, actuar o pintar desarrolla habilidades cognitivas y emocionales que complementan y potencian su desempeño en todas las áreas académicas.",
      ficha: [
        { label: "Niveles", value: "Todos los niveles" },
        { label: "Modalidad", value: "Presencial" },
        { label: "Presentación", value: "Festival anual", highlight: true },
        { label: "Coordinación", value: "Dpto. de Cultura" },
      ],
      photoSrc:
        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=700&q=80",
      photoAlt: "Estudiantes en presentación cultural",
    },
    actividades: {
      title: "Lo que hacemos en Cultura",
      photoSrc:
        "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=900&q=80",
      photoCaption: "Festival Cultural — Atenas",
      items: [
        { icon: "🎵", title: "Banda y orquesta", desc: "Formación instrumental y agrupaciones musicales que participan en eventos locales." },
        { icon: "🎭", title: "Teatro escolar", desc: "Montajes y obras que desarrollan expresión, memoria y trabajo en equipo.", highlight: true },
        { icon: "💃", title: "Danza y folclore", desc: "Expresión corporal y danzas tradicionales que conectan con la identidad cultural." },
        { icon: "🎨", title: "Artes plásticas", desc: "Pintura, escultura y diseño como medios de comunicación visual y creación." },
        { icon: "🎤", title: "Coro institucional", desc: "Agrupación vocal que representa a Atenas en eventos y competencias regionales." },
      ],
    },
  },
  {
    slug: "educacion-fisica",
    nombre: "Ed. Física",
    ghostText: "DEPORTE",
    heroSubtitle:
      "Deporte, bienestar y disciplina — formando cuerpos y mentes que rinden al máximo nivel.",
    metaTitle: "Educación Física y Deporte | Atenas",
    metaDescription:
      "El programa deportivo de la Unidad Educativa Atenas promueve el bienestar físico, el trabajo en equipo y la formación de hábitos saludables desde la infancia.",
    detalle: {
      badge: "Educación Física y Deporte",
      heading: "Más que ejercicio: una cultura de bienestar",
      paragraphs: [
        "La educación física en Atenas es un espacio de formación integral donde el movimiento es un medio para desarrollar disciplina, liderazgo y trabajo en equipo. Nuestros programas abarcan desde las clases regulares hasta equipos de competencia a nivel provincial y nacional.",
        "El deporte enseña a ganar y a perder con dignidad, a perseverar ante la dificultad y a confiar en los compañeros. Estas son habilidades para la vida que el estudiante lleva consigo mucho más allá de la cancha.",
      ],
      tags: ["Deporte", "Bienestar", "Equipo", "Salud", "Competencia"],
      nota:
        "Atenas cuenta con instalaciones deportivas completas: canchas de básquet, fútbol y vóley, además de espacios para atletismo. Nuestros equipos han representado a la institución en campeonatos provinciales con resultados destacados.",
      ficha: [
        { label: "Niveles", value: "Todos los niveles" },
        { label: "Modalidad", value: "Presencial" },
        { label: "Competencia", value: "Provincial y nacional", highlight: true },
        { label: "Coordinación", value: "Dpto. de Ed. Física" },
      ],
      photoSrc:
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=700&q=80",
      photoAlt: "Estudiantes en actividad deportiva",
    },
    actividades: {
      title: "Lo que hacemos en Ed. Física",
      photoSrc:
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=900&q=80",
      photoCaption: "Competencia deportiva — Ambato",
      items: [
        { icon: "⚽", title: "Fútbol y básquetbol", desc: "Disciplinas principales con equipos de competencia en ligas provinciales." },
        { icon: "🏆", title: "Torneos intercolegiales", desc: "Participación en competencias regionales y nacionales que forman el carácter.", highlight: true },
        { icon: "🤸", title: "Atletismo y gimnasia", desc: "Desarrollo de capacidades físicas básicas: velocidad, fuerza, equilibrio y agilidad." },
        { icon: "🏊", title: "Natación", desc: "Programa de natación con piscina propia que enseña técnica y seguridad acuática." },
        { icon: "🧘", title: "Bienestar y salud", desc: "Educación en hábitos saludables, nutrición y manejo del estrés para el rendimiento." },
      ],
    },
  },
  {
    slug: "intercambio",
    nombre: "Intercambio",
    ghostText: "GLOBAL",
    heroSubtitle:
      "Experiencias internacionales que amplían horizontes y forman ciudadanos del mundo.",
    metaTitle: "Programa de Intercambio Internacional | Atenas",
    metaDescription:
      "El programa de intercambio de la Unidad Educativa Atenas conecta a sus estudiantes con instituciones del mundo, ampliando perspectivas y formando ciudadanos globales.",
    detalle: {
      badge: "Programa de Intercambio Internacional",
      heading: "El mundo como aula de aprendizaje",
      paragraphs: [
        "El programa de intercambio de Atenas abre la puerta para que nuestros estudiantes vivan experiencias educativas en el extranjero, conviviendo con familias locales, aprendiendo nuevos idiomas y descubriendo otras culturas. A su vez, recibimos estudiantes internacionales que enriquecen nuestra comunidad.",
        "Estos programas están diseñados para ampliar perspectivas, desarrollar independencia y construir redes de amistad global que acompañan a los jóvenes durante toda su vida.",
      ],
      tags: ["Internacional", "Intercambio", "Culturas", "Viajes", "Globalización"],
      nota:
        "Los programas de intercambio están disponibles para estudiantes de EGB Superior y Bachillerato que cumplan con los requisitos académicos y de idioma. Las plazas son limitadas y se asignan por mérito y motivación.",
      ficha: [
        { label: "Niveles", value: "EGB Superior y Bachillerato" },
        { label: "Modalidad", value: "Presencial internacional" },
        { label: "Duración", value: "2 a 12 semanas", highlight: true },
        { label: "Coordinación", value: "Relaciones Internacionales" },
      ],
      photoSrc:
        "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=700&q=80",
      photoAlt: "Estudiantes en programa internacional",
    },
    actividades: {
      title: "Lo que hacemos en Intercambio",
      photoSrc:
        "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=900&q=80",
      photoCaption: "Programa internacional — Atenas",
      items: [
        { icon: "✈️", title: "Intercambios al exterior", desc: "Estancias en colegios asociados de Europa, América del Norte y América Latina." },
        { icon: "🏠", title: "Familias anfitrionas", desc: "Convivencia con familias locales que garantizan inmersión cultural completa.", highlight: true },
        { icon: "🌏", title: "Estudiantes internacionales", desc: "Recepción de estudiantes extranjeros que comparten sus culturas con nuestra comunidad." },
        { icon: "🎓", title: "Cursos de verano", desc: "Programas intensivos de idiomas y cultura en instituciones del extranjero." },
        { icon: "🤝", title: "Red de alumni global", desc: "Conexión permanente con ex-estudiantes de intercambio alrededor del mundo." },
      ],
    },
  },
  {
    // Séptimo espacio, pedido por el colegio en la reunión del 2026-07-27:
    // «página para extracurriculares como escuelas permanentes, fútbol y
    // básket».
    //
    // OJO CON EL CONTENIDO. A diferencia de los otros seis, aquí NO se
    // inventó nada: lo único que dijo el colegio es que existen escuelas
    // permanentes de fútbol y de básquet. No hay horarios, edades, costos,
    // cupos, entrenadores ni instalaciones porque nadie los ha dado, y este
    // proyecto ya publicó datos de relleno una vez.
    //
    // Por eso `ficha` y `nota` van vacías: las secciones se saltan solas
    // cuando no hay contenido.
    //
    // La fila editable de esta página la crea la migración 081, no el panel:
    // `tpl_l_ficha_espacio` está en `PLANTILLAS_BLOQUEADAS_NUEVAS`, así que el
    // formulario de «página nueva» la rechaza. Las seis hermanas existen
    // porque las sembró la 026. Una vez sembrada sí se edita desde el panel,
    // y entonces lo guardado gana sobre lo de aquí.
    slug: "extracurriculares",
    // «Extracurriculares» de una pieza no cabe en el hero a 375px: el clamp del
    // título tiene 38px de mínimo y la palabra se pasa por doce píxeles, así que
    // se recorta. Se abrevia como ya hace «Ed. Física» con «Educación Física».
    // La palabra que pidió el colegio sigue estando: en la URL, en el badge de
    // la sección y en el meta title.
    nombre: "Escuelas permanentes",
    ghostText: "ESCUELAS",
    heroSubtitle:
      "Escuelas permanentes que funcionan durante todo el año lectivo, fuera del horario de clases.",
    metaTitle: "Extracurriculares — Escuelas permanentes | Atenas",
    metaDescription:
      "Las escuelas permanentes de la Unidad Educativa Atenas ofrecen formación deportiva continua, fuera del horario regular de clases.",
    detalle: {
      badge: "Extracurriculares",
      heading: "Formación que sigue después de la última hora de clase",
      paragraphs: [
        "Las escuelas permanentes son programas que funcionan a lo largo de todo el año lectivo, fuera del horario regular, y están abiertas a los estudiantes que quieran profundizar en una disciplina más allá de la clase.",
        "Hoy el colegio sostiene escuelas de fútbol y de básquet.",
      ],
      tags: ["Fútbol", "Básquet"],
      // Vacías a propósito — ver la nota de arriba.
      nota: "",
      ficha: [],
      // Foto de archivo, la misma que Ed. Física porque es una URL que ya se
      // sabe que responde. Se reemplaza desde el panel con una del colegio.
      photoSrc:
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=700&q=80",
      photoAlt: "Estudiantes en entrenamiento deportivo",
    },
    actividades: {
      title: "Escuelas abiertas",
      photoSrc:
        "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=900&q=80",
      photoCaption: "Escuelas permanentes — Atenas",
      items: [
        { icon: "⚽", title: "Escuela de fútbol", desc: "Entrenamiento continuo durante el año lectivo." },
        { icon: "🏀", title: "Escuela de básquet", desc: "Entrenamiento continuo durante el año lectivo." },
      ],
    },
  },
];

export function getEspacio(slug: string): EspacioItem | undefined {
  return ESPACIOS.find((e) => e.slug === slug);
}
