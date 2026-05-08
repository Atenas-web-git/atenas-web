import { createClient } from "@/lib/supabase/server";

export type CronogramaColor = "gold" | "red" | "teal" | "navy" | "purple";

export type CronogramaPeriodoPublico = {
  id: number;
  slug: string;
  nombre: string;
  color: CronogramaColor;
  ano_lectivo_codigo: string | null;
  orden: number;
};

export type CronogramaTipoPublico = {
  id: number;
  slug: string;
  nombre: string;
  orden: number;
};

export type CronogramaEventoPublico = {
  id: number;
  titulo: string;
  descripcion: string | null;
  periodo_id: number;
  tipo_id: number;
  fecha_inicio: string;       // ISO date "2026-09-08"
  fecha_fin: string | null;
};

/**
 * Lee períodos, tipos y eventos publicados para la página pública
 * /cronograma-anual. Devuelve null si Supabase falla (la página puede
 * caer al FALLBACK hardcoded).
 *
 * Ordena eventos por fecha_inicio asc.
 */
export async function getCronogramaPublico(): Promise<{
  periodos: CronogramaPeriodoPublico[];
  tipos: CronogramaTipoPublico[];
  eventos: CronogramaEventoPublico[];
} | null> {
  try {
    const supabase = await createClient();

    const [periodosRes, tiposRes, eventosRes] = await Promise.all([
      supabase
        .from("cronograma_periodos")
        .select("id, slug, nombre, color, ano_lectivo_codigo, orden")
        .order("orden", { ascending: true }),
      supabase
        .from("cronograma_tipos")
        .select("id, slug, nombre, orden")
        .order("orden", { ascending: true }),
      supabase
        .from("cronograma_eventos")
        .select("id, titulo, descripcion, periodo_id, tipo_id, fecha_inicio, fecha_fin")
        .eq("publicado", true)
        .order("fecha_inicio", { ascending: true }),
    ]);

    if (periodosRes.error || tiposRes.error || eventosRes.error) return null;

    return {
      periodos: (periodosRes.data ?? []) as CronogramaPeriodoPublico[],
      tipos: (tiposRes.data ?? []) as CronogramaTipoPublico[],
      eventos: (eventosRes.data ?? []) as CronogramaEventoPublico[],
    };
  } catch {
    return null;
  }
}
