/**
 * Catálogo central del módulo de admisiones.
 *
 * 8 estados oficiales del colegio (no mover ni renombrar slugs — son la
 * fuente de verdad para BD, plantillas de correo, UI del backoffice y
 * página pública de seguimiento):
 *
 *   1. interesado          — estado inicial al enviar el formulario web.
 *                            El correo de confirmación lo manda el propio
 *                            formulario; este estado NO tiene plantilla
 *                            de pipeline asociada.
 *   2. postulante          — recibió los requisitos, está reuniendo docs.
 *   3. postulacion_completa— entregó toda la documentación.
 *   4. en_evaluacion       — entrevista familiar + evaluación del estudiante.
 *   5. en_revision_comite  — expediente en el Comité de Admisiones.
 *   6. admitido            — aceptado por el Comité.
 *   7. no_admitido         — rechazado por el Comité (por protocolo del
 *                            colegio, esta comunicación es por LLAMADA;
 *                            la plantilla de correo queda apagada por
 *                            defecto).
 *   8. matriculado         — completó la matrícula.
 */

export type EstadoAdmision =
  | "interesado"
  | "postulante"
  | "postulacion_completa"
  | "en_evaluacion"
  | "en_revision_comite"
  | "admitido"
  | "no_admitido"
  | "matriculado";

export const ESTADOS: EstadoAdmision[] = [
  "interesado",
  "postulante",
  "postulacion_completa",
  "en_evaluacion",
  "en_revision_comite",
  "admitido",
  "no_admitido",
  "matriculado",
];

/** Estado inicial al crear una solicitud nueva desde el formulario. */
export const ESTADO_INICIAL: EstadoAdmision = "interesado";

/** Estados finales (no se cambian a otro automáticamente). */
export const ESTADOS_TERMINALES: Set<EstadoAdmision> = new Set([
  "matriculado",
  "no_admitido",
]);

type EstadoInfo = {
  /** Etiqueta corta para mostrar en UI. */
  label: string;
  /** Etiqueta de tarjeta/listado (un poco más rica). */
  labelLargo: string;
  /** Descripción mostrada al admin para entender qué es. */
  descripcion: string;
  /** Color de fondo del badge. */
  colorBg: string;
  /** Color del texto del badge. */
  colorFg: string;
  /** Acento default para la plantilla de correo del estado. */
  acentoCorreo: "navy" | "red" | "gold";
  /**
   * Si tiene plantilla de correo en `plantillas_correo_admision`.
   * `interesado` no la tiene — la confirmación al postulante la cubre
   * el propio formulario (sendFormConfirmation tipo admisiones-confirmacion).
   */
  tieneCorreoPipeline: boolean;
};

export const ESTADO_INFO: Record<EstadoAdmision, EstadoInfo> = {
  interesado: {
    label: "Interesado",
    labelLargo: "Interesado",
    descripcion:
      "Solicita información y se registra por la web. Es el estado inicial — la confirmación al usuario la envía el propio formulario, no requiere plantilla de pipeline.",
    colorBg: "#FEF3C7",
    colorFg: "#92400E",
    acentoCorreo: "navy",
    tieneCorreoPipeline: false,
  },
  postulante: {
    label: "Postulante",
    labelLargo: "Postulante",
    descripcion: "Recibió los requisitos y está reuniendo la documentación.",
    colorBg: "#DBEAFE",
    colorFg: "#1E40AF",
    acentoCorreo: "navy",
    tieneCorreoPipeline: true,
  },
  postulacion_completa: {
    label: "Postulación completa",
    labelLargo: "Postulación completa",
    descripcion:
      "Entregó toda la documentación; habilitado para continuar con el proceso.",
    colorBg: "#E0E7FF",
    colorFg: "#3730A3",
    acentoCorreo: "navy",
    tieneCorreoPipeline: true,
  },
  en_evaluacion: {
    label: "En evaluación",
    labelLargo: "En evaluación",
    descripcion:
      "Pendiente o realizando la entrevista familiar y la evaluación del estudiante.",
    colorBg: "#FCE7F3",
    colorFg: "#9D174D",
    acentoCorreo: "red",
    tieneCorreoPipeline: true,
  },
  en_revision_comite: {
    label: "En revisión por Comité",
    labelLargo: "En revisión por Comité",
    descripcion:
      "Expediente presentado al Comité de Admisiones para análisis y resolución.",
    colorBg: "#FED7AA",
    colorFg: "#9A3412",
    acentoCorreo: "navy",
    tieneCorreoPipeline: true,
  },
  admitido: {
    label: "Admitido",
    labelLargo: "Admitido",
    descripcion: "Aceptado por el Comité; recibe la notificación oficial.",
    colorBg: "#D1FAE5",
    colorFg: "#065F46",
    acentoCorreo: "gold",
    tieneCorreoPipeline: true,
  },
  no_admitido: {
    label: "No admitido",
    labelLargo: "No admitido",
    descripcion:
      "No cumple los criterios del Comité. Por protocolo, la comunicación se hace por LLAMADA TELEFÓNICA, por eso la plantilla de correo está APAGADA por defecto.",
    colorBg: "#FEE2E2",
    colorFg: "#991B1B",
    acentoCorreo: "navy",
    tieneCorreoPipeline: true,
  },
  matriculado: {
    label: "Matriculado",
    labelLargo: "Matriculado",
    descripcion: "Completó la matrícula y formalizó su ingreso a la institución.",
    colorBg: "#1A2B4A",
    colorFg: "#D4AF37",
    acentoCorreo: "gold",
    tieneCorreoPipeline: true,
  },
};

/**
 * Camino feliz del pipeline (visual stepper). `no_admitido` queda como
 * ramal aparte; se inserta al final cuando el estado actual lo es.
 */
export const PIPELINE_HAPPY_PATH: EstadoAdmision[] = [
  "interesado",
  "postulante",
  "postulacion_completa",
  "en_evaluacion",
  "en_revision_comite",
  "admitido",
  "matriculado",
];

/**
 * Transiciones permitidas (desde cada estado, a qué estados puede pasar).
 * Siempre se permite ir a `no_admitido` como salida temprana del proceso.
 */
export const TRANSITIONS: Record<EstadoAdmision, EstadoAdmision[]> = {
  interesado: ["postulante", "no_admitido"],
  postulante: ["postulacion_completa", "no_admitido"],
  postulacion_completa: ["en_evaluacion", "no_admitido"],
  en_evaluacion: ["en_revision_comite", "no_admitido"],
  en_revision_comite: ["admitido", "no_admitido"],
  admitido: ["matriculado", "no_admitido"],
  no_admitido: [],
  matriculado: [],
};

/** Estados que SÍ tienen plantilla de correo en el pipeline (7 de 8). */
export const ESTADOS_CON_CORREO_PIPELINE: EstadoAdmision[] = ESTADOS.filter(
  (e) => ESTADO_INFO[e].tieneCorreoPipeline
);

export const NIVELES = [
  "Educación Inicial",
  "EGB Elemental y Media",
  "EGB Superior",
  "Bachillerato IB",
] as const;
