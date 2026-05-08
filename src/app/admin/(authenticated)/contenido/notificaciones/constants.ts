/**
 * Constantes compartidas del módulo de Notificaciones.
 * Vive aparte de actions.ts para no romper el constraint de "use server".
 */

export type TipoNotificacion = "popup" | "dropdown" | "banner_top";

export const TIPOS_VALIDOS: TipoNotificacion[] = ["popup", "dropdown", "banner_top"];

export const TIPO_INFO: Record<
  TipoNotificacion,
  { label: string; descripcion: string; color: string; bg: string }
> = {
  popup: {
    label: "Popup de bienvenida",
    descripcion:
      "Aparece como modal central al primer ingreso del visitante. Solo se muestra una vez por dispositivo.",
    color: "#4C1D95",
    bg: "#EDE9FE",
  },
  dropdown: {
    label: "Lista (campana)",
    descripcion:
      "Aparece en el dropdown del icono de campana en el navbar. Pueden mostrarse varias a la vez.",
    color: "#1E40AF",
    bg: "#DBEAFE",
  },
  banner_top: {
    label: "Banner superior",
    descripcion:
      "Barra fija arriba del sitio. Útil para anuncios urgentes o avisos breves.",
    color: "#9A3412",
    bg: "#FED7AA",
  },
};

// ─── Modo visual del popup ─────────────────────────────────────

export type ModoVisualPopup =
  | "imagen_libre"
  | "plantilla_imagen_texto"
  | "plantilla_diagonal";

export const MODOS_VISUALES_VALIDOS: ModoVisualPopup[] = [
  "imagen_libre",
  "plantilla_imagen_texto",
  "plantilla_diagonal",
];

export const MODO_VISUAL_INFO: Record<
  ModoVisualPopup,
  { label: string; descripcion: string }
> = {
  imagen_libre: {
    label: "Imagen libre",
    descripcion:
      "Sube una imagen cuadrada completa diseñada por la diseñadora. Se muestra tal cual, sin texto del sistema. Si configuras CTA con URL, toda la imagen es clickeable.",
  },
  plantilla_imagen_texto: {
    label: "Plantilla — Imagen + texto",
    descripcion:
      "Imagen cuadrada arriba y bloque blanco abajo con título, texto y botón CTA rojo. Diseño limpio cuando hay foto/arte y mensaje breve.",
  },
  plantilla_diagonal: {
    label: "Plantilla — Diagonal",
    descripcion:
      "Fondo navy con franja diagonal roja, logo del colegio, título grande, acento dorado y CTA dorado. Diseño impactante para anuncios destacados.",
  },
};
