export type TipoPlantillaFormulario =
  | "contactos"
  | "quejas"
  | "trabaja"
  | "admisiones-confirmacion"
  | "admisiones-consulta";

export const TIPOS_PLANTILLA_FORMULARIO: TipoPlantillaFormulario[] = [
  "contactos",
  "quejas",
  "trabaja",
  "admisiones-confirmacion",
  "admisiones-consulta",
];

type TipoInfo = {
  label: string;
  description: string;
  color: string;
  // variables disponibles en esta plantilla
  variables: { code: string; label: string }[];
  // valores de ejemplo usados para preview
  sample: Record<string, string>;
};

export const TIPOS_PLANTILLA_INFO: Record<TipoPlantillaFormulario, TipoInfo> = {
  contactos: {
    label: "Contactos",
    description: "Confirmación al usuario que llena el formulario /contactos.",
    color: "#1E40AF",
    variables: [
      { code: "{{nombre}}", label: "Nombre del remitente" },
      { code: "{{correo}}", label: "Correo del remitente" },
      { code: "{{asunto}}", label: "Asunto del mensaje" },
    ],
    sample: {
      nombre: "María Pérez",
      correo: "maria@ejemplo.com",
      asunto: "Solicitud de información",
    },
  },
  quejas: {
    label: "Quejas y sugerencias",
    description:
      "Confirmación al usuario que envía una queja o sugerencia desde /servicios/quejas.",
    color: "#9A3412",
    variables: [
      { code: "{{nombre}}", label: "Nombre del remitente" },
      { code: "{{correo}}", label: "Correo del remitente" },
      { code: "{{tipo}}", label: "Tipo (queja / sugerencia)" },
    ],
    sample: {
      nombre: "Carlos Salazar",
      correo: "carlos@ejemplo.com",
      tipo: "sugerencia",
    },
  },
  trabaja: {
    label: "Trabaja con nosotros",
    description:
      "Confirmación al postulante que envía su hoja de vida desde /trabaja.",
    color: "#065F46",
    variables: [
      { code: "{{nombre}}", label: "Nombres del postulante" },
      { code: "{{correo}}", label: "Correo del postulante" },
      { code: "{{cargo}}", label: "Cargo de interés" },
    ],
    sample: {
      nombre: "Ana Torres",
      correo: "ana@ejemplo.com",
      cargo: "Docente de Matemáticas",
    },
  },
  "admisiones-confirmacion": {
    label: "Admisiones — confirmación de solicitud",
    description:
      "Confirmación al representante cuando envía la solicitud FORMAL de admisión (el formulario largo, antes de pasar al pipeline).",
    color: "#1A2B4A",
    variables: [
      { code: "{{rep_nombres}}", label: "Nombres del representante" },
      { code: "{{est_nombres}}", label: "Nombres del estudiante" },
      { code: "{{est_apellidos}}", label: "Apellidos del estudiante" },
      { code: "{{est_nivel}}", label: "Nivel solicitado" },
      { code: "{{numero}}", label: "N° de seguimiento" },
      { code: "{{url_seguimiento}}", label: "URL de seguimiento" },
    ],
    sample: {
      rep_nombres: "Carlos",
      est_nombres: "María",
      est_apellidos: "Pérez",
      est_nivel: "Bachillerato IB",
      numero: "ADM026-278",
      url_seguimiento:
        "https://atenas.edu.ec/admisiones/seguimiento?numero=ADM026-278",
    },
  },
  "admisiones-consulta": {
    label: "Admisiones — consulta por nivel",
    description:
      "Confirmación al usuario que pide más información desde el formulario de una página de admisión por nivel (/admisiones/inicial, /egb-superior, etc.).",
    color: "#1A2B4A",
    variables: [
      { code: "{{representante}}", label: "Nombre del representante" },
      { code: "{{estudiante}}", label: "Nombre del estudiante" },
      { code: "{{nivel}}", label: "Nivel de interés" },
    ],
    sample: {
      representante: "Carlos Salazar",
      estudiante: "María Salazar",
      nivel: "Bachillerato IB",
    },
  },
};
