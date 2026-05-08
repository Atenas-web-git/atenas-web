import { createClient } from "@/lib/supabase/server";

export type ModoVisualPopup =
  | "imagen_libre"
  | "plantilla_imagen_texto"
  | "plantilla_diagonal";

export type NotificacionPublica = {
  id: string;
  titulo: string;
  contenido_html: string;
  tipo: "popup" | "dropdown" | "banner_top";
  imagen_url: string | null;
  cta_texto: string | null;
  cta_url: string | null;
  fecha_inicio: string;
  fecha_fin: string | null;
  prioridad: number;
  modo_visual: ModoVisualPopup;
};

export type NotificacionesPorTipo = {
  popup: NotificacionPublica[];
  dropdown: NotificacionPublica[];
  banner_top: NotificacionPublica[];
};

/**
 * Lee las notificaciones vigentes y activas, agrupadas por tipo.
 *
 * Las RLS de Supabase ya filtran por `activa AND fecha_inicio <= now() AND
 * (fecha_fin IS NULL OR fecha_fin >= now())`, así que es seguro llamar
 * desde server components públicos.
 *
 * Si Supabase falla devuelve un objeto vacío (no rompe el sitio).
 */
export async function getNotificacionesPorTipo(): Promise<NotificacionesPorTipo> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notificaciones")
      .select(
        "id, titulo, contenido_html, tipo, imagen_url, cta_texto, cta_url, fecha_inicio, fecha_fin, prioridad, modo_visual"
      )
      .order("prioridad", { ascending: false })
      .order("fecha_inicio", { ascending: false });

    if (error || !data) {
      return { popup: [], dropdown: [], banner_top: [] };
    }

    return {
      popup: data.filter((n) => n.tipo === "popup") as NotificacionPublica[],
      dropdown: data.filter((n) => n.tipo === "dropdown") as NotificacionPublica[],
      banner_top: data.filter((n) => n.tipo === "banner_top") as NotificacionPublica[],
    };
  } catch {
    return { popup: [], dropdown: [], banner_top: [] };
  }
}
