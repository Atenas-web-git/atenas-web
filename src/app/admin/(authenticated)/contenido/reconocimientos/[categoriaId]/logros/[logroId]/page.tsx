import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { LogroForm } from "../../../LogroForm";
import { DeleteButton } from "../../../DeleteButton";
import { eliminarLogroAction } from "../../../actions";

type Props = { params: Promise<{ categoriaId: string; logroId: string }> };

export default async function EditarLogroPage({ params }: Props) {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_COMM, ROLES.EDITOR_ACADEMICO])) {
    redirect("/admin");
  }

  const { categoriaId, logroId } = await params;
  const catId = Number(categoriaId);
  const lId = Number(logroId);
  if (!Number.isFinite(catId) || !Number.isFinite(lId)) notFound();

  const supabase = createAdminClient();
  const [{ data: cat }, { data: logro }, { data: subs = [] }, { data: fotos = [] }] =
    await Promise.all([
      supabase
        .from("reconocimientos_categorias")
        .select("id, slug, nombre")
        .eq("id", catId)
        .maybeSingle(),
      supabase
        .from("reconocimientos_logros")
        .select("*")
        .eq("id", lId)
        .eq("categoria_id", catId)
        .maybeSingle(),
      supabase
        .from("reconocimientos_subcategorias")
        .select("id, nombre")
        .eq("categoria_id", catId)
        .order("orden", { ascending: true }),
      supabase
        .from("reconocimientos_logro_fotos")
        .select("src, alt, orden")
        .eq("logro_id", lId)
        .order("orden", { ascending: true }),
    ]);

  if (!cat || !logro) notFound();

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href={`/admin/contenido/reconocimientos/${cat.id}`}
        className="flex items-center gap-1.5 w-fit transition-opacity hover:opacity-70"
        style={{ fontSize: 13, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver a {cat.nombre}
      </Link>

      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
            <span style={{ marginRight: 8, fontSize: 22 }}>{logro.icon}</span>
            {logro.titulo}
          </h1>
          {logro.year && (
            <p style={{ fontSize: 12, color: "#6B6660", margin: "4px 0 0" }}>{logro.year}</p>
          )}
        </div>
        <DeleteButton
          action={eliminarLogroAction}
          hiddenFields={{ id: logro.id, categoriaId: cat.id }}
          label="Eliminar logro"
          confirmMessage={`¿Eliminar el logro "${logro.titulo}"?\n\nSe borrarán también las fotos asociadas.`}
        />
      </div>

      <LogroForm
        inicial={{
          id: logro.id,
          categoriaId: cat.id,
          categoriaSlug: cat.slug,
          subcategoriaId: logro.subcategoria_id,
          icon: logro.icon,
          titulo: logro.titulo,
          year: logro.year,
          descripcion: logro.descripcion,
          highlight: logro.highlight,
          visible: logro.visible,
          orden: logro.orden,
          fotos: (fotos ?? []).map((f) => ({ src: f.src, alt: f.alt })),
        }}
        subcategorias={subs ?? []}
      />
    </div>
  );
}
