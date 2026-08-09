/**
 * Tipos y constantes de vacantes.
 *
 * Archivo PURO a propósito: no importa nada de Supabase ni del servidor, para
 * que los componentes de cliente puedan usar estas constantes sin arrastrar
 * `createAdminClient` al navegador. Mezclarlo rompe el build de Turbopack, y
 * en el peor de los casos filtraría código de servidor al bundle.
 */

export const CATEGORIAS_VACANTE = ["concurso", "abierta", "banco"] as const;
export type CategoriaVacante = (typeof CATEGORIAS_VACANTE)[number];

/** Cómo se agrupan en la página pública. Mismos rótulos que usa el colegio. */
export const CATEGORIA_VACANTE_INFO: Record<
  CategoriaVacante,
  { label: string; tituloPublico: string; descripcion: string }
> = {
  concurso: {
    label: "En concurso",
    tituloPublico: "Cargos actuales en concurso",
    descripcion:
      "Procesos de selección abiertos ahora mismo, con perfil definido. Es el bloque destacado de la página.",
  },
  abierta: {
    label: "Vacante abierta",
    tituloPublico: "Otras vacantes abiertas",
    descripcion:
      "Vacantes permanentes o de convocatoria continua, sin un proceso con fecha.",
  },
  banco: {
    label: "Banco de aspirantes",
    tituloPublico: "Banco de aspirantes",
    descripcion:
      "Para quien no encaja en ninguna vacante concreta y quiere dejar sus datos para el futuro.",
  },
};

export type Vacante = {
  id: string;
  slug: string;
  titulo: string;
  resumen: string | null;
  categoria: CategoriaVacante;
  descripcion: string | null;
  formacion: string | null;
  experiencia: string | null;
  habilidades: string[];
  imagen_url: string | null;
  formulario_id: string | null;
  activa: boolean;
  orden: number;
  cierra_en: string | null;
};

/** Ya cerró por fecha aunque siga marcada como activa. Lo usa el panel para avisar. */
export function venciPorFecha(v: Vacante): boolean {
  if (!v.cierra_en) return false;
  return v.cierra_en < new Date().toISOString().slice(0, 10);
}
