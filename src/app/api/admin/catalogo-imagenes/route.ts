import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/catalogo-imagenes?q=...&limit=...
 *
 * Devuelve la lista de imágenes del catálogo (tabla `imagenes`) ordenadas
 * por fecha de subida descendente. Usado por el picker reutilizable que
 * aparece dentro del ImageUploader.
 *
 * Query params:
 *   - q: filtro opcional por alt_text, storage_path o mime_type (case-insensitive)
 *   - limit: máximo de resultados (default 200, tope 500)
 */
export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (
    !user ||
    !hasAnyRole(user, [
      ROLES.SUPERADMIN,
      ROLES.EDITOR_COMM,
      ROLES.EDITOR_ACADEMICO,
    ])
  ) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  const limitRaw = Number(searchParams.get("limit") ?? "200");
  const limit = Math.min(Math.max(1, Number.isFinite(limitRaw) ? limitRaw : 200), 500);

  const supabase = createAdminClient();
  let query = supabase
    .from("imagenes")
    .select("id, url, storage_path, alt_text, tamano_bytes, mime_type, uploaded_at")
    .order("uploaded_at", { ascending: false })
    .limit(limit);

  if (q) {
    const safe = q.replace(/[%_]/g, "\\$&");
    query = query.or(
      `alt_text.ilike.%${safe}%,storage_path.ilike.%${safe}%,mime_type.ilike.%${safe}%`
    );
  }

  const { data, error } = await query;
  if (error) {
    console.error("[catalogo-imagenes]", error);
    return NextResponse.json({ error: "Error al consultar el catálogo." }, { status: 500 });
  }

  return NextResponse.json({ items: data ?? [] });
}
