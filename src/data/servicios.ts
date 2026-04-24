import {
  Utensils,
  BookOpen,
  Bus,
  HeartPulse,
  Key,
  Award,
  ShieldCheck,
  MessageCircle,
  MapPin,
  AlarmClock,
  Users,
  Leaf,
  BookMarked,
  Phone,
  Star,
  Ambulance,
  type LucideIcon,
} from "lucide-react";

export interface ServicioStat {
  Icono: LucideIcon;
  label: string;
  valor: string;
}

export interface ServicioItem {
  slug: string;
  nombre: string;
  nombreCorto: string;
  descripcionCorta: string;
  descripcion: string[];
  Icono: LucideIcon;
  color: "gold" | "red";
  ghostText: string;
  heroSubtitle: string;
  stats: ServicioStat[];
  pasos: string[];
  fotos: [string, string, string];
}

export const SERVICIOS: ServicioItem[] = [
  {
    slug: "bar-cafeteria",
    nombre: "Bar Escolar",
    nombreCorto: "Bar",
    descripcionCorta:
      "Menú nutritivo y variado para estudiantes y docentes durante el horario escolar.",
    descripcion: [
      "El Bar Escolar de la Unidad Educativa Atenas ofrece un menú balanceado y nutritivo diseñado para cubrir las necesidades alimenticias de toda la comunidad educativa. Nuestras instalaciones cumplen con todas las normas de higiene y salubridad exigidas por el Ministerio de Educación.",
      "Contamos con opciones variadas que incluyen desayunos y refrigerios, elaborados con ingredientes frescos y de calidad. El personal está capacitado en manipulación de alimentos y atención al cliente.",
    ],
    Icono: Utensils,
    color: "gold",
    ghostText: "BAR",
    heroSubtitle:
      "Menú nutritivo y variado para toda la comunidad educativa de la Unidad Educativa Atenas.",
    stats: [
      { Icono: MapPin, label: "UBICACIÓN", valor: "Planta baja — Bloque A" },
      { Icono: AlarmClock, label: "HORARIO", valor: "7:00 AM · 13:30 PM" },
      { Icono: Leaf, label: "ALIMENTACIÓN", valor: "Saludable y balanceada" },
    ],
    pasos: [
      "Acércate al Bar Escolar ubicado en la planta baja del Bloque A durante el horario de atención.",
      "Revisa el menú del día publicado en el tablero exterior del local.",
      "Realiza tu pedido directamente en ventanilla y recibe tu orden.",
    ],
    fotos: [
      "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&q=80",
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80",
    ],
  },
  {
    slug: "biblioteca",
    nombre: "Biblioteca",
    nombreCorto: "Biblioteca",
    descripcionCorta:
      "Amplia colección bibliográfica física y digital disponible para toda la comunidad educativa.",
    descripcion: [
      "La Biblioteca de la Unidad Educativa Atenas cuenta con una amplia colección de libros, revistas y recursos digitales para apoyar el proceso de aprendizaje de todos los estudiantes. Es un espacio diseñado para la investigación, el estudio y el fomento de la lectura.",
      "Los estudiantes pueden acceder a libros de texto, literatura general, enciclopedias y bases de datos en línea. El personal bibliotecario está disponible para orientar en la búsqueda de información y gestión de recursos.",
    ],
    Icono: BookOpen,
    color: "gold",
    ghostText: "BIBLIO",
    heroSubtitle:
      "Espacio de investigación y lectura con recursos físicos y digitales para toda la comunidad.",
    stats: [
      { Icono: BookMarked, label: "COLECCIÓN", valor: "+3 000 títulos" },
      { Icono: AlarmClock, label: "HORARIO", valor: "7:30 AM · 15:30 PM" },
      { Icono: Users, label: "ACCESO", valor: "Toda la comunidad" },
    ],
    pasos: [
      "Preséntate en la Biblioteca con tu carné estudiantil o cédula de identidad.",
      "Solicita el libro o recurso que necesitas al personal bibliotecario.",
      "Regístra el préstamo y devuelve el material en el plazo acordado.",
    ],
    fotos: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80",
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&q=80",
      "https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=400&q=80",
    ],
  },
  {
    slug: "transporte",
    nombre: "Transporte",
    nombreCorto: "Transporte",
    descripcionCorta:
      "Rutas de transporte seguro y puntual desde y hacia el colegio para todos los estudiantes.",
    descripcion: [
      "El servicio de transporte escolar de la Unidad Educativa Atenas garantiza el traslado seguro y puntual de los estudiantes. Contamos con unidades modernas, conductores certificados y rutas fijas que cubren los principales sectores de Ambato.",
      "Todas las unidades disponen de rastreo GPS en tiempo real y los conductores mantienen comunicación permanente con la administración del colegio para garantizar la seguridad de cada estudiante durante todo el trayecto.",
    ],
    Icono: Bus,
    color: "gold",
    ghostText: "TRANSP",
    heroSubtitle:
      "Rutas de transporte escolar seguro y puntual para el traslado de nuestros estudiantes.",
    stats: [
      { Icono: MapPin, label: "COBERTURA", valor: "Ciudad de Ambato" },
      {
        Icono: AlarmClock,
        label: "HORARIO",
        valor: "6:30 AM · 13:30 PM",
      },
      { Icono: ShieldCheck, label: "SEGURIDAD", valor: "GPS en tiempo real" },
    ],
    pasos: [
      "Contacta a Secretaría (ext. 150) al inicio del año lectivo para solicitar el servicio de transporte.",
      "Indica la ruta de interés y verifica la disponibilidad de cupos para tu sector.",
      "Completa el formulario de autorización y realiza el pago correspondiente en Tesorería.",
    ],
    fotos: [
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
      "https://images.unsplash.com/photo-1588072432836-e10032774350?w=400&q=80",
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80",
    ],
  },
  {
    slug: "dispensario-medico",
    nombre: "Dispensario Médico",
    nombreCorto: "Médico",
    descripcionCorta:
      "Atención médica inmediata y primeros auxilios durante la jornada escolar.",
    descripcion: [
      "El Dispensario Médico de la Unidad Educativa Atenas brinda atención de primeros auxilios y seguimiento básico de salud a todos los estudiantes durante la jornada escolar. Contamos con personal médico calificado y equipamiento adecuado para emergencias menores.",
      "En caso de emergencias mayores, activamos el protocolo de derivación a centros de salud cercanos y contactamos de inmediato a los representantes legales del estudiante. La salud y bienestar de nuestra comunidad es nuestra prioridad.",
    ],
    Icono: HeartPulse,
    color: "gold",
    ghostText: "MEDICO",
    heroSubtitle:
      "Atención médica y primeros auxilios para el bienestar de nuestros estudiantes durante la jornada escolar.",
    stats: [
      { Icono: Ambulance, label: "ATENCIÓN", valor: "Primeros auxilios" },
      { Icono: AlarmClock, label: "HORARIO", valor: "7:30 AM · 15:30 PM" },
      { Icono: Phone, label: "EMERGENCIAS", valor: "Ext. 180" },
    ],
    pasos: [
      "Diríjete al Dispensario Médico ubicado en la planta baja del edificio principal.",
      "Presenta tu carné estudiantil y describe los síntomas o situación al personal de salud.",
      "Sigue las indicaciones del médico. En caso necesario, se contactará a tu representante.",
    ],
    fotos: [
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&q=80",
      "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&q=80",
    ],
  },
  {
    slug: "llave-aprendizaje",
    nombre: "Llave del Aprendizaje",
    nombreCorto: "Llaves",
    descripcionCorta:
      "Sistema de casilleros personales para guardar útiles y pertenencias de forma segura.",
    descripcion: [
      "El programa Llave del Aprendizaje ofrece a cada estudiante un casillero personal donde guardar sus materiales, útiles escolares y pertenencias de manera segura durante la jornada escolar. Este servicio promueve la organización y responsabilidad de los alumnos.",
      "Los casilleros están disponibles en diferentes bloques del colegio y se asignan al inicio del año lectivo. Cada estudiante recibe una llave personal y es responsable del cuidado del espacio asignado.",
    ],
    Icono: Key,
    color: "gold",
    ghostText: "LLAVES",
    heroSubtitle:
      "Casilleros personales para que nuestros estudiantes organicen y protejan sus materiales escolares.",
    stats: [
      { Icono: MapPin, label: "DISPONIBILIDAD", valor: "Todos los bloques" },
      { Icono: Key, label: "ASIGNACIÓN", valor: "Inicio del año lectivo" },
      { Icono: ShieldCheck, label: "SEGURIDAD", valor: "Llave personal" },
    ],
    pasos: [
      "Solicita tu casillero en Secretaría al inicio del año lectivo, presentando tu matrícula.",
      "Recibe tu llave personal y la asignación del bloque y número de casillero.",
      "Cuida el espacio asignado — reporta cualquier daño o pérdida inmediatamente.",
    ],
    fotos: [
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80",
      "https://images.unsplash.com/photo-1571260898936-4e3c6d30e9a9?w=400&q=80",
    ],
  },
  {
    slug: "becas",
    nombre: "Becas",
    nombreCorto: "Becas",
    descripcionCorta:
      "Programas de financiamiento para estudiantes con excelencia académica y necesidad.",
    descripcion: [
      "La Unidad Educativa Atenas cuenta con programas de becas y apoyo económico destinados a estudiantes con excelencia académica o necesidad económica comprobada. Nuestro compromiso es garantizar que ningún talento se quede sin la oportunidad de formarse en Atenas.",
      "Los beneficiarios son seleccionados por un comité académico que evalúa el desempeño, la conducta y la situación socioeconómica de cada candidato. Las becas pueden cubrir parcial o totalmente los valores de matrícula y pensión.",
    ],
    Icono: Award,
    color: "gold",
    ghostText: "BECAS",
    heroSubtitle:
      "Apoyo económico y becas para que el talento no tenga barreras en la Unidad Educativa Atenas.",
    stats: [
      { Icono: Star, label: "CRITERIO", valor: "Mérito y necesidad" },
      { Icono: AlarmClock, label: "CONVOCATORIA", valor: "Enero — Febrero" },
      { Icono: Phone, label: "INFORMES", valor: "Ext. 135 Admisiones" },
    ],
    pasos: [
      "Solicita el formulario de aplicación a becas en Secretaría durante el período de convocatoria.",
      "Adjunta la documentación requerida: historial académico, situación socioeconómica y carta de motivación.",
      "Espera la resolución del Comité de Becas — los resultados se notifican por correo electrónico.",
    ],
    fotos: [
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
      "https://images.unsplash.com/photo-1471970394675-613138e45da3?w=400&q=80",
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&q=80",
    ],
  },
  {
    slug: "seguro-estudiantil",
    nombre: "Seguro Estudiantil",
    nombreCorto: "Seguro",
    descripcionCorta:
      "Cobertura integral de accidentes y emergencias para todos los estudiantes.",
    descripcion: [
      "Todos los estudiantes matriculados en la Unidad Educativa Atenas cuentan con seguro estudiantil que cubre accidentes dentro y fuera de las instalaciones del colegio durante actividades académicas y extracurriculares oficiales.",
      "La cobertura incluye atención médica de emergencia, hospitalización por accidente y gastos de medicamentos derivados de incidentes escolares. El proceso de reclamación es ágil y se gestiona directamente a través de Secretaría.",
    ],
    Icono: ShieldCheck,
    color: "gold",
    ghostText: "SEGURO",
    heroSubtitle:
      "Cobertura de seguro estudiantil incluida para todos los alumnos matriculados en Atenas.",
    stats: [
      { Icono: ShieldCheck, label: "COBERTURA", valor: "Accidentes escolares" },
      { Icono: Users, label: "BENEFICIARIOS", valor: "Todos los estudiantes" },
      { Icono: Phone, label: "RECLAMACIONES", valor: "Ext. 190 Tesorería" },
    ],
    pasos: [
      "En caso de accidente, comunícate de inmediato con el Dispensario Médico o Secretaría.",
      "El colegio gestiona los trámites iniciales del seguro y contacta a los representantes.",
      "Para reclamaciones posteriores, presenta el informe médico en Tesorería (ext. 190).",
    ],
    fotos: [
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
      "https://images.unsplash.com/photo-1508921340878-ba53e1f016ec?w=400&q=80",
      "https://images.unsplash.com/photo-1588600878108-578307a3cc9d?w=400&q=80",
    ],
  },
  {
    slug: "quejas-sugerencias",
    nombre: "Quejas y Sugerencias",
    nombreCorto: "Quejas",
    descripcionCorta:
      "Canal oficial para compartir retroalimentación y ayudarnos a mejorar continuamente.",
    descripcion: [
      "La Unidad Educativa Atenas valora la retroalimentación de su comunidad. Este canal oficial permite a estudiantes, representantes legales y docentes presentar quejas, sugerencias o reconocimientos de forma clara y trazable.",
      "Todas las comunicaciones recibidas son revisadas por el equipo directivo y se garantiza una respuesta en un plazo máximo de 5 días hábiles. Tu opinión es fundamental para seguir mejorando.",
    ],
    Icono: MessageCircle,
    color: "red",
    ghostText: "QUEJAS",
    heroSubtitle:
      "Canal oficial para quejas, sugerencias y reconocimientos de toda la comunidad educativa.",
    stats: [
      {
        Icono: AlarmClock,
        label: "TIEMPO DE RESPUESTA",
        valor: "5 días hábiles",
      },
      { Icono: ShieldCheck, label: "CONFIDENCIALIDAD", valor: "Garantizada" },
      { Icono: Users, label: "DISPONIBLE PARA", valor: "Toda la comunidad" },
    ],
    pasos: [
      "Completa el formulario con tu nombre, correo de contacto y el tipo de comunicación.",
      "Describe con detalle la situación, sugerencia o reconocimiento que deseas comunicar.",
      "Envía el formulario — recibirás una confirmación por correo y respuesta en máximo 5 días hábiles.",
    ],
    fotos: [
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80",
    ],
  },
];

export function getServicio(slug: string): ServicioItem | undefined {
  return SERVICIOS.find((s) => s.slug === slug);
}
