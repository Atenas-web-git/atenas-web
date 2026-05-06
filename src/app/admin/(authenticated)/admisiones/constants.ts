export type EstadoAdmision =
  | "pendiente"
  | "revisando"
  | "entrevista_agendada"
  | "lista_espera"
  | "aceptado"
  | "matriculado"
  | "rechazado";

export const NIVELES = [
  "Educación Inicial",
  "EGB Elemental y Media",
  "EGB Superior",
  "Bachillerato IB",
] as const;
