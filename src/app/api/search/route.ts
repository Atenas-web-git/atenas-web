import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Endpoint público de búsqueda global del sitio.
 *
 * Llama a la función Postgres `search_global(q)` que devuelve hasta 20
 * resultados rankeados de páginas + documentos + eventos + reconocimientos.
 *
 * GET /api/search?q=...
 *
 * Responde:
 *   { results: [{ type, id, title, description, url, rank }] }
 *
 * Si `q` está vacío o es muy corto, devuelve `{ results: [] }` sin tocar BD.
 */

export const dynamic = "force-dynamic";

type SearchResult = {
  type: string;
  id: string;
  title: string;
  description: string;
  url: string;
  rank: number;
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();

  if (q.length < 2) {
    return NextResponse.json({ results: [] satisfies SearchResult[] });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("search_global", { q });

  if (error) {
    console.error("[/api/search]", error);
    return NextResponse.json(
      { results: [] satisfies SearchResult[], error: "search_failed" },
      { status: 500 }
    );
  }

  type RpcRow = {
    type: string | null;
    entity_id: string | null;
    title: string | null;
    description: string | null;
    url: string | null;
    rank: number | null;
  };
  const rows = (data ?? []) as RpcRow[];
  const results: SearchResult[] = rows.map((r) => ({
    type: String(r.type ?? ""),
    id: String(r.entity_id ?? ""),
    title: String(r.title ?? ""),
    description: String(r.description ?? ""),
    url: String(r.url ?? ""),
    rank: Number(r.rank ?? 0),
  }));

  return NextResponse.json({ results });
}
