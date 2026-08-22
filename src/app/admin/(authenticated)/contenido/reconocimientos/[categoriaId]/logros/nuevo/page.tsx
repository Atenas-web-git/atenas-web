import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { LogroForm } from "../../../LogroForm";

type Props = {
  params: Promise<{ categoriaId: string }>;
  searchParams: Promise<{ subcategoria?: string }>;
};

export default async function NuevoLogroPage({ params, searchParams }: Props) {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_COMM, ROLES.EDITOR_ACADEMICO])) {
    redirect("/admin");
  }

  const { categoriaId } = await params;
  const sp = await searchParams;
  const id = Number(categoriaId);
  if (!Number.isFinite(id)) notFound();

  const supabase = createAdminClient();
  const [{ data: cat }, { data: subs = [] }] = await Promise.all([
    supabase
      .from("reconocimientos_categorias")
      .select("id, slug, nombre")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("reconocimientos_subcategorias")
      .select("id, nombre")
      .eq("categoria_id", id)
      .order("orden", { ascending: true }),
  ]);
  if (!cat) notFound();

  // Pre-seleccionar la subcategoría si viene en ?subcategoria=ID
  // (cuando el usuario llega desde el detalle de una subcategoría).
  const subcatIdRaw = sp.subcategoria;
  const subcategoriaId =
    subcatIdRaw && (subs ?? []).some((s) => String(s.id) === subcatIdRaw)
      ? Number(subcatIdRaw)
      : null;
  const subcontext = subcategoriaId
    ? (subs ?? []).find((s) => s.id === subcategoriaId)
    : null;

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href={
          subcontext
            ? `/admin/contenido/reconocimientos/${cat.id}/subcategorias/${subcontext.id}`
            : `/admin/contenido/reconocimientos/${cat.id}`
        }
        className="flex items-center gap-1.5 w-fit transition-opacity hover:opacity-70"
        style={{ fontSize: 14, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver a {subcontext ? subcontext.nombre : cat.nombre}
      </Link>

      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Nuevo logro {subcontext ? `en ${subcontext.nombre}` : `en ${cat.nombre}`}
        </h1>
        <p style={{ fontSize: 14, color: "#6B6660", margin: "4px 0 0", maxWidth: 720 }}>
          {subcontext ? (
            <>
              Subcategoría pre-seleccionada: <strong>{subcontext.nombre}</strong>. Puedes
              cambiarla en el formulario o dejarla directa en la categoría.
            </>
          ) : (
            <>
              Asocia el logro a una subcategoría o déjalo directo en la categoría. Si lo
              marcas como destacado, aparecerá en la landing y en la página de logros
              completos.
            </>
          )}
        </p>
      </div>

      <LogroForm
        inicial={{
          categoriaId: cat.id,
          categoriaSlug: cat.slug,
          subcategoriaId,
        }}
        subcategorias={subs ?? []}
      />
    </div>
  );
}
