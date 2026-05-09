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

  const { data: paginas } = await query;
  const filas = paginas ?? [];

  // Contadores para los tabs (siempre sobre el total, ignorando el filtro)
  const [{ count: totalCount }, { count: publicadasCount }, { count: borradorCount }] =
    await Promise.all([
      supabase.from("paginas").select("*", { count: "exact", head: true }),
      supabase.from("paginas").select("*", { count: "exact", head: true }).eq("publicada", true),
      supabase.from("paginas").select("*", { count: "exact", head: true }).eq("publicada", false),
    ]);

  const tabs = [
    {
      key: "todas",
      label: "Todas",
      count: totalCount ?? 0,
      isActive: filtro === "todas",
      href: "/admin/contenido/paginas",
    },
    {
      key: "publicadas",
      label: "Publicadas",
      count: publicadasCount ?? 0,
      isActive: filtro === "publicadas",
      href: "/admin/contenido/paginas?estado=publicadas",
    },
    {
      key: "borrador",
      label: "Borrador",
      count: borradorCount ?? 0,
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
            {totalCount ?? 0} página{totalCount === 1 ? "" : "s"} en el catálogo, agrupadas por ruta
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

      <PaginasListClient paginas={filas} tabs={tabs} />
    </div>
  );
}
