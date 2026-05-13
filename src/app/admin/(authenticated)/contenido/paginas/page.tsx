import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Plus } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { PaginasListClient } from "./PaginasListClient";

export default async function PaginasListPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const sp = await searchParams;
  const filtro = sp.estado ?? "todas";

  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_COMM, ROLES.EDITOR_ACADEMICO])) {
    redirect("/admin");
  }

  const supabase = createAdminClient();

  let query = supabase
    .from("paginas")
    .select("id, slug, titulo, plantilla, publicada, updated_at")
    .order("slug", { ascending: true });

  if (filtro === "publicadas") query = query.eq("publicada", true);
  if (filtro === "borrador") query = query.eq("publicada", false);

  const [
    { data: paginas },
    { data: recCategorias },
    { data: recSubcategorias },
    { count: totalCount },
    { count: publicadasCount },
    { count: borradorCount },
  ] = await Promise.all([
    query,
    supabase
      .from("reconocimientos_categorias")
      .select("id, slug, nombre, visible, updated_at")
      .order("orden", { ascending: true }),
    supabase
      .from("reconocimientos_subcategorias")
      .select("id, categoria_id, slug, nombre, visible, updated_at")
      .order("orden", { ascending: true }),
    supabase.from("paginas").select("*", { count: "exact", head: true }),
    supabase.from("paginas").select("*", { count: "exact", head: true }).eq("publicada", true),
    supabase.from("paginas").select("*", { count: "exact", head: true }).eq("publicada", false),
  ]);

  const filas = paginas ?? [];

  // Construir filas sintéticas del módulo Reconocimientos para mostrarlas
  // junto a las páginas regulares. Estas filas NO llevan al editor genérico
  // (su modelo es distinto) — el "Editar" abre el backoffice dedicado.
  const cats = recCategorias ?? [];
  const subs = recSubcategorias ?? [];
  const subsByCat = new Map<number, typeof subs>();
  for (const s of subs) {
    const arr = subsByCat.get(s.categoria_id) ?? [];
    arr.push(s);
    subsByCat.set(s.categoria_id, arr);
  }

  type ModuloRow = {
    moduleKey: "reconocimientos";
    id: string;
    slug: string;
    titulo: string;
    visible: boolean;
    updated_at: string | null;
    editHref: string;
    publicHref: string;
    badge: string;
  };

  const moduloRecRows: ModuloRow[] = [];
  for (const c of cats) {
    moduloRecRows.push({
      moduleKey: "reconocimientos",
      id: `rec-cat-${c.id}`,
      slug: `reconocimientos/${c.slug}`,
      titulo: c.nombre,
      visible: c.visible,
      updated_at: c.updated_at,
      editHref: `/admin/contenido/reconocimientos/${c.id}`,
      publicHref: `/reconocimientos/${c.slug}`,
      badge: "Categoría",
    });
    for (const s of subsByCat.get(c.id) ?? []) {
      moduloRecRows.push({
        moduleKey: "reconocimientos",
        id: `rec-sub-${s.id}`,
        slug: `reconocimientos/${c.slug}/${s.slug}`,
        titulo: s.nombre,
        visible: s.visible && c.visible,
        updated_at: s.updated_at,
        editHref: `/admin/contenido/reconocimientos/${c.id}/subcategorias/${s.id}`,
        publicHref: `/reconocimientos/${c.slug}/${s.slug}`,
        badge: "Subcategoría",
      });
    }
  }

  // Aplicar el mismo filtro de publicadas/borrador a las filas del módulo
  // (mapeando "visible" a "publicada").
  const moduloFiltradas =
    filtro === "publicadas"
      ? moduloRecRows.filter((r) => r.visible)
      : filtro === "borrador"
        ? moduloRecRows.filter((r) => !r.visible)
        : moduloRecRows;

  // Los contadores ahora incluyen también las filas del módulo
  const moduloTotalCount = moduloRecRows.length;
  const moduloPublicadasCount = moduloRecRows.filter((r) => r.visible).length;
  const moduloBorradorCount = moduloRecRows.filter((r) => !r.visible).length;

  const tabs = [
    {
      key: "todas",
      label: "Todas",
      count: (totalCount ?? 0) + moduloTotalCount,
      isActive: filtro === "todas",
      href: "/admin/contenido/paginas",
    },
    {
      key: "publicadas",
      label: "Publicadas",
      count: (publicadasCount ?? 0) + moduloPublicadasCount,
      isActive: filtro === "publicadas",
      href: "/admin/contenido/paginas?estado=publicadas",
    },
    {
      key: "borrador",
      label: "Borrador",
      count: (borradorCount ?? 0) + moduloBorradorCount,
      isActive: filtro === "borrador",
      href: "/admin/contenido/paginas?estado=borrador",
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href="/admin/contenido"
        className="flex items-center gap-1.5 w-fit transition-opacity hover:opacity-70"
        style={{ fontSize: 13, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver a Contenido
      </Link>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
            Páginas
          </h1>
          <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0" }}>
            {(totalCount ?? 0) + moduloTotalCount} página
            {(totalCount ?? 0) + moduloTotalCount === 1 ? "" : "s"} en el sitio, agrupadas por ruta.
            Las filas marcadas como <strong>Reconocimientos</strong> se gestionan desde su módulo dedicado.
          </p>
        </div>
        <Link
          href="/admin/contenido/paginas/nueva"
          className="flex items-center gap-2 px-4 rounded-md transition-opacity hover:opacity-80"
          style={{
            height: 38,
            background: "#1A2B4A",
            color: "#FFFFFF",
            textDecoration: "none",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <Plus size={14} strokeWidth={2.5} />
          Crear nueva página
        </Link>
      </div>

      <PaginasListClient paginas={filas} moduloRows={moduloFiltradas} tabs={tabs} />
    </div>
  );
}
