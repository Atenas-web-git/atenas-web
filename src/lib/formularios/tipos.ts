/**
 * Catálogo de tipos de campo del motor de formularios.
 *
 * Es la ÚNICA definición: la usa el constructor del panel, el componente que
 * dibuja el formulario en el sitio y la validación del servidor. Hoy cada uno
 * de los cinco formularios escritos a mano repite su propia validación, y por
 * eso ninguna coincide del todo con las demás.
 *
 * Los valores de `TipoCampo` se guardan en base dentro de `formularios.campos`:
 * cambiarlos rompe los formularios ya creados. Añadir tipos nuevos es seguro;
 * renombrar los existentes exige una migración de datos.
 */

export type TipoCampo =
  | "texto"
  | "texto_largo"
  | "correo"
  | "telefono"
  | "numero"
  | "fecha"
  | "seleccion_unica"
  | "seleccion_multiple"
  | "aceptacion"
  | "archivo";

export type CampoFormulario = {
  /**
   * Identificador estable del campo. Es la clave con la que se guarda la
   * respuesta, así que NO se renombra una vez que el formulario recibió
   * envíos: las respuestas viejas quedarían huérfanas de esa columna.
   */
  key: string;
  tipo: TipoCampo;
  etiqueta: string;
  /** Texto de ayuda bajo el campo. */
  ayuda?: string;
  /** Texto gris dentro del campo vacío. */
  placeholder?: string;
  obligatorio: boolean;
  /** Solo para seleccion_unica y seleccion_multiple. */
  opciones?: string[];
  /** Solo para texto y texto_largo. */
  maxLength?: number;
  /** Solo para numero. */
  min?: number;
  max?: number;
  /** Solo para archivo: extensiones admitidas, en minúscula y con punto. */
  acepta?: string[];
  /** Solo para archivo: límite propio del campo. Nunca por encima de MAX_MB_ARCHIVO. */
  maxMb?: number;
  /** Ancho en la rejilla de dos columnas del escritorio. En móvil todo ocupa el ancho completo. */
  ancho?: "completo" | "medio";
};

/** Valor de una respuesta, ya normalizado. Los archivos no viajan aquí. */
export type ValorCampo = string | string[] | number | boolean | null;

export type DatosRespuesta = Record<string, ValorCampo>;

/** Metadata de un archivo ya subido, tal como se guarda en `archivos`. */
export type ArchivoRespuesta = {
  key: string;
  filename: string;
  storage_path: string;
  size_bytes: number;
  mime_type: string;
};

export type Formulario = {
  id: string;
  slug: string;
  nombre: string;
  descripcion_interna: string | null;
  titulo: string | null;
  subtitulo: string | null;
  texto_boton: string;
  titulo_exito: string;
  texto_exito: string;
  aviso_legal: string | null;
  campos: CampoFormulario[];
  notificar_a: string[];
  asunto: string | null;
  /** Preset de Configuración › Correos del que sale el envío. */
  preset_correo: string;
  /**
   * Plantilla de correo de confirmación asociada, de las que se editan en
   * Contenido › Plantillas de correo para formularios. Sirve para que desde
   * el formulario se pueda saltar a su plantilla y al revés: hasta ahora esa
   * relación vivía solo en un mapa del código.
   */
  plantilla_correo: string | null;
  campo_correo: string | null;
  confirmacion_activa: boolean;
  confirmacion_asunto: string | null;
  confirmacion_cuerpo: string | null;
  activo: boolean;
  /**
   * Quién es dueño del formulario y de su bandeja: comunicaciones,
   * admisiones o talento. Decide qué rol lo ve en el panel — la lógica está
   * en `lib/auth/areas.ts`, no aquí. Migración 079.
   */
  area: string;
};

export const ESTADOS_RESPUESTA = [
  "nueva",
  "en_proceso",
  "atendida",
  "descartada",
] as const;

export type EstadoRespuesta = (typeof ESTADOS_RESPUESTA)[number];

/**
 * El estado que llega por la URL, o `null` si no es uno de los cuatro.
 *
 * Lo comparten la bandeja de respuestas y su exportación. Iba suelto en la
 * pantalla, y por eso el archivo se llevaba **todas** las respuestas aunque
 * estuvieras viendo solo las nuevas: talento humano descargaba «las cuatro
 * postulaciones nuevas» y el archivo traía sesenta, cerradas incluidas.
 * Es el mismo fallo que tenía la exportación de admisiones con el buscador.
 */
export function estadoRespuestaValido(valor: string | null | undefined) {
  return valor && ESTADOS_RESPUESTA.includes(valor as EstadoRespuesta)
    ? (valor as EstadoRespuesta)
    : null;
}

export const ESTADO_LABELS: Record<EstadoRespuesta, string> = {
  nueva: "Nueva",
  en_proceso: "En proceso",
  atendida: "Atendida",
  descartada: "Descartada",
};

/**
 * Metadata de cada tipo para el constructor del panel. Las descripciones las
 * lee el personal del colegio, que no es técnico: hablan de lo que el
 * visitante ve, no del tipo de dato.
 */
export const TIPOS_CAMPO: {
  tipo: TipoCampo;
  label: string;
  descripcion: string;
  tieneOpciones: boolean;
}[] = [
  {
    tipo: "texto",
    label: "Texto corto",
    descripcion: "Una línea. Para nombres, cédula, cargo.",
    tieneOpciones: false,
  },
  {
    tipo: "texto_largo",
    label: "Texto largo",
    descripcion: "Varias líneas. Para mensajes, comentarios o descripciones.",
    tieneOpciones: false,
  },
  {
    tipo: "correo",
    label: "Correo electrónico",
    descripcion: "Comprueba que tenga forma de correo antes de enviar.",
    tieneOpciones: false,
  },
  {
    tipo: "telefono",
    label: "Teléfono",
    descripcion: "Admite números de casa y celular, con o sin código de país.",
    tieneOpciones: false,
  },
  {
    tipo: "numero",
    label: "Número",
    descripcion: "Solo cifras. Para edad, años de experiencia o valores.",
    tieneOpciones: false,
  },
  {
    tipo: "fecha",
    label: "Fecha",
    descripcion: "Calendario. Para fecha de nacimiento o disponibilidad.",
    tieneOpciones: false,
  },
  {
    tipo: "seleccion_unica",
    label: "Lista desplegable",
    descripcion: "El visitante elige una sola opción de las que definas.",
    tieneOpciones: true,
  },
  {
    tipo: "seleccion_multiple",
    label: "Casillas de selección",
    descripcion: "El visitante puede marcar varias opciones a la vez.",
    tieneOpciones: true,
  },
  {
    tipo: "aceptacion",
    label: "Casilla de aceptación",
    descripcion:
      "Una sola casilla que hay que marcar para poder enviar. Para el consentimiento de datos personales.",
    tieneOpciones: false,
  },
  {
    tipo: "archivo",
    label: "Subir archivo",
    descripcion:
      "El visitante adjunta un archivo (hoja de vida, certificado, audio). Se guarda en privado y solo se ve desde el panel.",
    tieneOpciones: false,
  },
];

export function tipoTieneOpciones(tipo: TipoCampo): boolean {
  return tipo === "seleccion_unica" || tipo === "seleccion_multiple";
}

/** Extensiones admitidas por defecto cuando el campo de archivo no las acota. */
export const EXTENSIONES_ARCHIVO_DEFAULT = [
  ".pdf",
  ".doc",
  ".docx",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".mp3",
  ".m4a",
  ".ogg",
  ".wav",
];

/**
 * Tipos MIME admitidos. Se comprueban en el servidor además de la extensión:
 * la extensión la controla quien sube el archivo y se cambia renombrando.
 */
export const MIME_ARCHIVO_PERMITIDOS = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/webp",
  "audio/mpeg",
  "audio/mp4",
  "audio/x-m4a",
  "audio/ogg",
  "audio/wav",
  "audio/webm",
];

/**
 * Techo absoluto por archivo.
 *
 * Antes eran 4 MB, y no por el bucket: Vercel corta el cuerpo de una petición
 * en 4,5 MB, así que un archivo mayor no llegaba ni al código.
 *
 * Ya no aplica. Los archivos suben DIRECTO del navegador a Storage con un
 * permiso firmado (`/api/formularios/[slug]/subida`) y por nuestra petición
 * solo viaja la ruta, que son unos pocos bytes. El límite real vuelve a ser el
 * del bucket: 100 MB, el mismo que el colegio usa en su Google Forms para el
 * audio de presentación.
 *
 * Cada campo puede bajar de aquí con su propio `maxMb`; ninguno puede subir.
 */
export const MAX_MB_ARCHIVO = 100;

/** Convierte una etiqueta en una key estable: "Fecha de Nacimiento" → "fecha_de_nacimiento". */
export function keyDesdeEtiqueta(etiqueta: string): string {
  return etiqueta
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 50);
}

/** Deja una key libre dentro del formulario añadiendo sufijo numérico. */
export function keyUnica(base: string, existentes: string[]): string {
  const limpia = base || "campo";
  if (!existentes.includes(limpia)) return limpia;
  let n = 2;
  while (existentes.includes(`${limpia}_${n}`)) n++;
  return `${limpia}_${n}`;
}
