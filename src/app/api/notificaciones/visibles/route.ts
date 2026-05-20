import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/notificaciones/visibles
 *
 * Devuelve las notificaciones vigentes (activas y dentro del rango de
 * fechas) sin filtrar por tipo.
 *
 * Filtra EXPLÍCITAMENTE por `activa` + rango de fechas además de la RLS.
 * Esto es defensa en profundidad: la RLS pública ya filtra, pero un
 * usuario admin autenticado también activa la política `_select_admin`
 * (lectura total) — sin estos filtros vería notificaciones inactivas o
 * vencidas en el sitio público.
 *
 * Los componentes cliente (CampanaNavbar, BannerTop, PopupBienvenida) se
 * suscriben a este endpoint y filtran por `tipo` localmente. El response
 * se cachea en navegador y CDN para que solo sea 1 request por visita.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const ahora = new Date().toISOString();
    const { data, error } = await supabase
      .from("notificaciones")
      .select(
        "id, titulo, contenido_html, tipo, imagen_url, cta_texto, cta_url, fecha_inicio, fecha_fin, prioridad, modo_visual"
      )
      .eq("activa", true)
      .lte("fecha_inicio", ahora)
      .or(`fecha_fin.is.null,fecha_fin.gte.${ahora}`)
      .order("prioridad", { ascending: false })
      .order("fecha_inicio", { ascending: false });

    if (error) {
      console.error("[notificaciones/visibles]", error);
      return NextResponse.json([]);
    }

    return NextResponse.json(data ?? [], {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err) {
    console.error("[notificaciones/visibles]", err);
    return NextResponse.json([]);
  }
}
