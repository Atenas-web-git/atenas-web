import { createClient } from "@/lib/supabase/server";

/**
 * Lee una entrada de la tabla `configuracion_global` por su key.
 * Devuelve `null` si la key no existe o si Supabase falla (para que el
 * componente caller pueda usar contenido fallback hardcoded).
 */
export async function getConfiguracion<T = unknown>(
  key: string
): Promise<T | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("configuracion_global")
      .select("value")
      .eq("key", key)
      .maybeSingle();

    if (error || !data) return null;
    return data.value as T;
  } catch {
    return null;
  }
}

// ─── Tipos específicos por key ────────────────────────────────

export type FechasMatriculas = {
  ano_lectivo: string;
  etapas: Array<{ etapa: string; rango: string }>;
  cta_texto?: string;
  cta_url?: string;
};
