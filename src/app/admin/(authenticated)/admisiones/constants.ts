export type EstadoAdmision =
  | "pendiente"
  | "revisando"
  | "entrevista_agendada"
  | "lista_espera"
  | "aceptado"
  | "matriculado"
  | "rechazado";

export const DOCUMENTOS_LISTA = [
  "Partida de nacimiento",
  "Cédula de identidad del estudiante",
  "Cédula del representante",
  "Foto tamaño carnet",
  "Historial académico anterior",
  "Certificado de no adeudo",
] as const;

export const NIVELES = [
  "Educación Inicial",
  "EGB Elemental y Media",
  "EGB Superior",
  "Bachillerato IB",
] as const;
