import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { SubcategoriaForm } from "../../../SubcategoriaForm";

type Props = { params: Promise<{ categoriaId: string }> };

export default async function NuevaSubcategoriaPage({ params }: Props) {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_COMM, ROLES.EDITOR_ACADEMICO])) {
    redirect("/admin");
  }

  const { categoriaId } = await params;
  const id = Number(categoriaId);
  if (!Number.isFinite(id)) notFound();

  const supabase = createAdminClient();
  const { data: cat } = await supabase
    .from("reconocimientos_categorias")
    .select("id, slug, nombre")
    .eq("id", id)
    .maybeSingle();
  if (!cat) notFound();

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href={`/admin/contenido/reconocimientos/${cat.id}`}
        className="flex items-center gap-1.5 w-fit transition-opacity hover:opacity-70"
        style={{ fontSize: 14, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver a {cat.nombre}
      </Link>

      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Nueva subcategoría en {cat.nombre}
        </h1>
        <p style={{ fontSize: 14, color: "#6B6660", margin: "4px 0 0", maxWidth: 720 }}>
          La subcategoría aparece como tarjeta en el showcase de la landing y tiene su propia
          página de detalle con logros y galería.
        </p>
      </div>

      <SubcategoriaForm
        inicial={{ categoriaId: cat.id, categoriaSlug: cat.slug }}
      />
    </div>
  );
}
