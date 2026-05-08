import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/notificaciones/visibles
 *
 * Devuelve TODAS las notificaciones vigentes (activas y dentro del rango
 * de fechas) sin filtrar por tipo. Las RLS ya filtran automáticamente.
 *
 * Los componentes cliente (CampanaNavbar, BannerTop, PopupBienvenida) se
 * suscriben a este endpoint y filtran por `tipo` localmente. El response
 * se cachea en navegador y CDN para que solo sea 1 request por visita.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("notificaciones")
      .select(
        "id, titulo, contenido_html, tipo, imagen_url, cta_texto, cta_url, fecha_inicio, fecha_fin, prioridad, modo_visual"
      )
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
