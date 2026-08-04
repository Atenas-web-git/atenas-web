import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, EyeOff, ExternalLink, Pencil, Plus, Star, Trophy } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { SubcategoriaForm } from "../../../SubcategoriaForm";
import { DeleteButton } from "../../../DeleteButton";
import { eliminarSubcategoriaAction, eliminarLogroAction } from "../../../actions";
import { GaleriaEditor } from "../../GaleriaEditor";

type Props = { params: Promise<{ categoriaId: string; subcategoriaId: string }> };

export default async function EditarSubcategoriaPage({ params }: Props) {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_COMM, ROLES.EDITOR_ACADEMICO])) {
    redirect("/admin");
  }

  const { categoriaId, subcategoriaId } = await params;
  const catId = Number(categoriaId);
  const subId = Number(subcategoriaId);
  if (!Number.isFinite(catId) || !Number.isFinite(subId)) notFound();

  const supabase = createAdminClient();
  const [{ data: cat }, { data: sub }, { data: galeria }, { data: logros }] =
    await Promise.all([
      supabase
        .from("reconocimientos_categorias")
        .select("id, slug, nombre")
        .eq("id", catId)
        .maybeSingle(),
      supabase
        .from("reconocimientos_subcategorias")
        .select("*")
        .eq("id", subId)
        .eq("categoria_id", catId)
        .maybeSingle(),
      supabase
        .from("reconocimientos_galeria_fotos")
        .select("id, src, alt, orden")
        .eq("scope", "subcategoria")
        .eq("scope_id", subId)
        .order("orden", { ascending: true }),
      supabase
        .from("reconocimientos_logros")
        .select("id, titulo, year, descripcion, icon, highlight, visible, orden")
        .eq("categoria_id", catId)
        .eq("subcategoria_id", subId)
        .order("orden", { ascending: true }),
    ]);

  if (!cat || !sub) notFound();

  const logrosList = logros ?? [];

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
            <span style={{ marginRight: 8, fontSize: 22 }}>{sub.icon}</span>
            {sub.nombre}
          </h1>
          <a
            href={`/reconocimientos/${cat.slug}/${sub.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-opacity hover:opacity-70"
            style={{
              fontSize: 12,
              color: "#6B6660",
              fontFamily: "ui-monospace, monospace",
              textDecoration: "none",
              width: "fit-content",
              margin: "4px 0 0",
            }}
          >
            /reconocimientos/{cat.slug}/{sub.slug}
            <ExternalLink size={11} strokeWidth={2.5} />
          </a>
        </div>
        <DeleteButton
          action={eliminarSubcategoriaAction}
          hiddenFields={{ id: sub.id, categoriaId: cat.id }}
          label="Eliminar subcategoría"
          confirmMessage={`¿Eliminar la subcategoría "${sub.nombre}"?\n\nSe borrarán los logros y fotos asociadas a esta subcategoría.`}
        />
      </div>

      <SubcategoriaForm
        inicial={{
          id: sub.id,
          categoriaId: cat.id,
          categoriaSlug: cat.slug,
          slug: sub.slug,
          nombre: sub.nombre,
          icon: sub.icon,
          countValue: sub.count_value,
          countLabel: sub.count_label,
          photoSrc: sub.photo_src,
          heroBadge: sub.hero_badge,
          heroTitle: sub.hero_title ?? "",
          heroSubtitle: sub.hero_subtitle,
          heroGhostText: sub.hero_ghost_text,
          heroBgImage: sub.hero_bg_image,
          heroFootnote: sub.hero_footnote,
          logrosHeading: sub.logros_heading,
          logrosSubheading: sub.logros_subheading,
          galeriaTitulo: sub.galeria_titulo,
          galeriaSubtitulo: sub.galeria_subtitulo,
          metaTitle: sub.meta_title,
          metaDescription: sub.meta_description,
          orden: sub.orden,
          visible: sub.visible,
        }}
      />

      {/* ────── Logros de esta subcategoría ────── */}
      <section
        className="flex flex-col gap-4 p-5"
        style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
      >
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
              <Trophy size={14} strokeWidth={2.5} className="inline-block mr-1.5 -mt-0.5" />
              Logros en {sub.nombre} ({logrosList.length})
            </h2>
            <p style={{ fontSize: 12, color: "#6B6660", margin: "2px 0 0", maxWidth: 660 }}>
              Logros que pertenecen a esta subcategoría. Aparecen en la sección
              &quot;Logros destacados&quot; del detalle público{" "}
              <code style={code}>/reconocimientos/{cat.slug}/{sub.slug}</code>. Si los marcas
              como <strong>destacados</strong>, también aparecen en la landing de la categoría
              padre y en la página de todos los logros.
            </p>
          </div>
          <Link
            href={`/admin/contenido/reconocimientos/${cat.id}/logros/nuevo?subcategoria=${sub.id}`}
            className="flex items-center gap-1.5 px-3 rounded-md transition-opacity hover:opacity-90"
            style={btnPrimarySm}
          >
            <Plus size={13} strokeWidth={2.5} />
            Nuevo logro
          </Link>
        </div>

        {logrosList.length === 0 ? (
          <p
            className="px-4 py-6 text-center"
            style={{
              fontSize: 13,
              color: "#6B6660",
              background: "#FAFAF8",
              border: "1px dashed #E8E4DD",
              borderRadius: 8,
              margin: 0,
            }}
          >
            Aún no hay logros en {sub.nombre}. Crea el primero arriba.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {logrosList.map((l) => (
              <div
                key={l.id}
                className="flex items-center gap-3 px-3 py-2"
                style={{ background: "#FAFAF8", border: "1px solid #E8E4DD", borderRadius: 8 }}
              >
                <span style={{ fontSize: 18 }}>{l.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/admin/contenido/reconocimientos/${cat.id}/logros/${l.id}`}
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#1A2B4A",
                        textDecoration: "none",
                      }}
                    >
                      {l.titulo}
                    </Link>
                    {l.highlight && (
                      <span
                        className="inline-flex items-center gap-0.5 px-1.5 rounded-full"
                        style={{
                          height: 18,
                          background: "rgba(158,25,21,0.20)",
                          fontSize: 9,
                          fontWeight: 700,
                          color: "#7A6224",
                        }}
                      >
                        <Star size={9} fill="currentColor" /> DESTACADO
                      </span>
                    )}
                    {!l.visible && (
                      <span
                        className="inline-flex items-center gap-1 px-2 rounded-full"
                        style={{
                          height: 18,
                          background: "#FEF3C7",
                          fontSize: 9,
                          fontWeight: 700,
                          color: "#92400E",
                        }}
                      >
                        <EyeOff size={9} /> OCULTO
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 11, color: "#6B6660", margin: "1px 0 0" }}>
                    {l.year && <span>{l.year}</span>}
                    {l.descripcion && (
                      <span>
                        {l.year ? " · " : ""}
                        {l.descripcion}
                      </span>
                    )}
                  </p>
                </div>
                <Link
                  href={`/admin/contenido/reconocimientos/${cat.id}/logros/${l.id}`}
                  className="flex items-center justify-center transition-opacity hover:opacity-70"
                  style={{
                    width: 28,
                    height: 28,
                    background: "#FFFFFF",
                    border: "1px solid #E8E4DD",
                    borderRadius: 6,
                    color: "#1A2B4A",
                    textDecoration: "none",
                  }}
                  aria-label="Editar"
                >
                  <Pencil size={13} strokeWidth={2.5} />
                </Link>
                <DeleteButton
                  action={eliminarLogroAction}
                  hiddenFields={{ id: l.id, categoriaId: cat.id }}
                  label="Eliminar"
                  variant="sm"
                  confirmMessage={`¿Eliminar el logro "${l.titulo}"?\n\nSe borrarán también sus fotos asociadas.`}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ────── Galería de la subcategoría ────── */}
      <section
        className="flex flex-col gap-4 p-5"
        style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
      >
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
            Galería de la subcategoría ({(galeria ?? []).length} fotos)
          </h2>
          <p style={{ fontSize: 12, color: "#6B6660", margin: "2px 0 0", maxWidth: 720 }}>
            Fotos del detalle <code style={code}>/reconocimientos/{cat.slug}/{sub.slug}</code> (las 5 primeras
            como teaser) y galería completa en{" "}
            <code style={code}>/reconocimientos/{cat.slug}/{sub.slug}/galeria</code> (todas con lightbox).
          </p>
        </div>
        <GaleriaEditor
          scope="subcategoria"
          scopeId={sub.id}
          categoriaId={cat.id}
          fotosIniciales={(galeria ?? []).map((f) => ({ src: f.src, alt: f.alt }))}
          prefix={`reconocimientos/${cat.slug}/${sub.slug}/galeria`}
        />
      </section>
    </div>
  );
}

const code: React.CSSProperties = {
  background: "#F4F1EB",
  padding: "1px 6px",
  borderRadius: 4,
  fontFamily: "ui-monospace, monospace",
  fontSize: 12,
};

const btnPrimarySm: React.CSSProperties = {
  height: 32,
  background: "#1A2B4A",
  fontSize: 12,
  color: "#FFFFFF",
  fontWeight: 600,
  textDecoration: "none",
};
