import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { CategoriaForm } from "../../CategoriaForm";
import { eliminarCategoriaAction } from "../../actions";
import { DeleteButton } from "../../DeleteButton";

type Props = { params: Promise<{ categoriaId: string }> };

export default async function EditarCategoriaPage({ params }: Props) {
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
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!cat) notFound();

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href={`/admin/contenido/reconocimientos/${id}`}
        className="flex items-center gap-1.5 w-fit transition-opacity hover:opacity-70"
        style={{ fontSize: 13, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver a la categoría
      </Link>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
            Editar categoría: {cat.nombre}
          </h1>
          <p
            style={{
              fontSize: 12,
              color: "#6B6660",
              margin: "4px 0 0",
              fontFamily: "ui-monospace, monospace",
            }}
          >
            /reconocimientos/{cat.slug}
          </p>
        </div>
        {hasAnyRole(user, [ROLES.SUPERADMIN]) && (
          <DeleteButton
            action={eliminarCategoriaAction}
            hiddenFields={{ id: cat.id }}
            label="Eliminar categoría"
            confirmMessage={`¿Eliminar la categoría "${cat.nombre}"?\n\nEsto borrará todas las subcategorías, logros y fotos asociadas. La acción NO se puede deshacer.`}
          />
        )}
      </div>

      <CategoriaForm
        inicial={{
          id: cat.id,
          slug: cat.slug,
          nombre: cat.nombre,
          heroBadge: cat.hero_badge,
          heroTitle: cat.hero_title,
          heroSubtitle: cat.hero_subtitle,
          heroGhostText: cat.hero_ghost_text,
          heroBgImage: cat.hero_bg_image,
          heroFootnote: cat.hero_footnote,
          showcaseHeading: cat.showcase_heading,
          showcaseCtaText: cat.showcase_cta_text,
          logrosHeading: cat.logros_heading,
          logrosSubheading: cat.logros_subheading,
          logrosHeroBadge: cat.logros_hero_badge,
          logrosHeroTitle: cat.logros_hero_title,
          logrosHeroSubtitle: cat.logros_hero_subtitle,
          logrosHeroGhostText: cat.logros_hero_ghost_text,
          logrosHeroBgImage: cat.logros_hero_bg_image,
          galeriaTitulo: cat.galeria_titulo,
          galeriaSubtitulo: cat.galeria_subtitulo,
          metaTitle: cat.meta_title,
          metaDescription: cat.meta_description,
          orden: cat.orden,
          visible: cat.visible,
        }}
      />
    </div>
  );
}

