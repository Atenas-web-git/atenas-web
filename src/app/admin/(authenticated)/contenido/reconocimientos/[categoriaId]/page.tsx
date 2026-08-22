import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  ArrowDown,
  ArrowUp,
  ExternalLink,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Settings,
  Star,
  Trophy,
  ImageIcon,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import {
  reordenarSubcategoriaAction,
  eliminarSubcategoriaAction,
  eliminarLogroAction,
} from "../actions";
import { DeleteButton } from "../DeleteButton";
import { GaleriaEditor } from "./GaleriaEditor";

type Props = { params: Promise<{ categoriaId: string }> };

export default async function DetalleCategoriaPage({ params }: Props) {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_COMM, ROLES.EDITOR_ACADEMICO])) {
    redirect("/admin");
  }

  const { categoriaId } = await params;
  const id = Number(categoriaId);
  if (!Number.isFinite(id)) notFound();

  const supabase = createAdminClient();
  const [{ data: cat }, { data: subcats }, { data: logros }, { data: galeria }] =
    await Promise.all([
      supabase.from("reconocimientos_categorias").select("*").eq("id", id).maybeSingle(),
      supabase
        .from("reconocimientos_subcategorias")
        .select("id, slug, nombre, icon, orden, visible, count_value, count_label")
        .eq("categoria_id", id)
        .order("orden", { ascending: true }),
      supabase
        .from("reconocimientos_logros")
        .select("id, titulo, year, descripcion, icon, highlight, visible, orden, subcategoria_id")
        .eq("categoria_id", id)
        .order("orden", { ascending: true }),
      supabase
        .from("reconocimientos_galeria_fotos")
        .select("id, src, alt, orden")
        .eq("scope", "categoria")
        .eq("scope_id", id)
        .order("orden", { ascending: true }),
    ]);

  if (!cat) notFound();

  const subs = subcats ?? [];
  const subById = new Map(subs.map((s) => [s.id, s]));
  const logrosList = logros ?? [];
  const galeriaList = galeria ?? [];

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href="/admin/contenido/reconocimientos"
        className="flex items-center gap-1.5 w-fit transition-opacity hover:opacity-70"
        style={{ fontSize: 14, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver a Reconocimientos
      </Link>

      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
              {cat.nombre}
            </h1>
            <span
              className="inline-flex items-center gap-1 px-2 rounded-full"
              style={{
                height: 22,
                background: cat.visible ? "#DCFCE7" : "#FEF3C7",
                fontSize: 11,
                fontWeight: 700,
                color: cat.visible ? "#065F46" : "#92400E",
                letterSpacing: 0.3,
              }}
            >
              {cat.visible ? <Eye size={11} /> : <EyeOff size={11} />}
              {cat.visible ? "VISIBLE" : "OCULTO"}
            </span>
          </div>
          <a
            href={`/reconocimientos/${cat.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-opacity hover:opacity-70"
            style={{
              fontSize: 13,
              color: "#6B6660",
              fontFamily: "ui-monospace, monospace",
              textDecoration: "none",
              width: "fit-content",
            }}
          >
            /reconocimientos/{cat.slug}
            <ExternalLink size={11} strokeWidth={2.5} />
          </a>
        </div>
        <Link
          href={`/admin/contenido/reconocimientos/${cat.id}/editar`}
          className="flex items-center gap-1.5 px-4 rounded-md transition-opacity hover:opacity-70"
          style={btnSecondary}
        >
          <Settings size={13} strokeWidth={2.5} />
          Editar categoría
        </Link>
      </header>

      {/* ────── Subcategorías ────── */}
      <section
        className="flex flex-col gap-4 p-5"
        style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
      >
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
              Subcategorías ({subs.length})
            </h2>
            <p style={{ fontSize: 13, color: "#6B6660", margin: "2px 0 0", maxWidth: 600 }}>
              Cada subcategoría aparece como tarjeta en el showcase de la landing y tiene su
              propia página de detalle. Si tu categoría no necesita divisiones (ej. una
              categoría &quot;Profesionales&quot; con logros directos), puedes dejarla sin subcategorías
              y los logros se mostrarán en la landing.
            </p>
          </div>
          <Link
            href={`/admin/contenido/reconocimientos/${cat.id}/subcategorias/nueva`}
            className="flex items-center gap-1.5 px-3 rounded-md transition-opacity hover:opacity-90"
            style={btnPrimarySm}
          >
            <Plus size={13} strokeWidth={2.5} />
            Nueva subcategoría
          </Link>
        </div>

        {subs.length === 0 ? (
          <p
            className="px-4 py-6 text-center"
            style={{
              fontSize: 14,
              color: "#6B6660",
              background: "#FAFAF8",
              border: "1px dashed #E8E4DD",
              borderRadius: 8,
              margin: 0,
            }}
          >
            Sin subcategorías. Puedes crear una arriba o dejar la categoría sin subdividir.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {subs.map((s, i) => (
              <div
                key={s.id}
                className="flex items-center gap-3 px-3 py-2"
                style={{ background: "#FAFAF8", border: "1px solid #E8E4DD", borderRadius: 8 }}
              >
                <div className="flex items-center gap-1">
                  <form action={reordenarSubcategoriaAction}>
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="direccion" value="up" />
                    <button
                      type="submit"
                      disabled={i === 0}
                      className="flex items-center justify-center transition-opacity hover:opacity-70 disabled:opacity-30"
                      style={iconBtn}
                      aria-label="Mover arriba"
                    >
                      <ArrowUp size={12} strokeWidth={2.5} />
                    </button>
                  </form>
                  <form action={reordenarSubcategoriaAction}>
                    <input type="hidden" name="id" value={s.id} />
                    <input type="hidden" name="direccion" value="down" />
                    <button
                      type="submit"
                      disabled={i === subs.length - 1}
                      className="flex items-center justify-center transition-opacity hover:opacity-70 disabled:opacity-30"
                      style={iconBtn}
                      aria-label="Mover abajo"
                    >
                      <ArrowDown size={12} strokeWidth={2.5} />
                    </button>
                  </form>
                </div>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/admin/contenido/reconocimientos/${cat.id}/subcategorias/${s.id}`}
                    style={{ fontSize: 14, fontWeight: 600, color: "#1A2B4A", textDecoration: "none" }}
                  >
                    {s.nombre}
                  </Link>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#6B6660",
                      margin: "1px 0 0",
                      fontFamily: "ui-monospace, monospace",
                    }}
                  >
                    {s.slug} · {s.count_value} {s.count_label}
                  </p>
                </div>
                {!s.visible && (
                  <span
                    className="inline-flex items-center gap-1 px-2 rounded-full"
                    style={{
                      height: 18,
                      background: "#FEF3C7",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#92400E",
                    }}
                  >
                    <EyeOff size={9} /> OCULTO
                  </span>
                )}
                <Link
                  href={`/admin/contenido/reconocimientos/${cat.id}/subcategorias/${s.id}`}
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
                  action={eliminarSubcategoriaAction}
                  hiddenFields={{ id: s.id, categoriaId: cat.id }}
                  label="Eliminar"
                  variant="sm"
                  confirmMessage={`¿Eliminar la subcategoría "${s.nombre}"?\n\nEsto borrará los logros y fotos asociados a esta subcategoría.`}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ────── Logros ────── */}
      <section
        className="flex flex-col gap-4 p-5"
        style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
      >
        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
              <Trophy size={14} strokeWidth={2.5} className="inline-block mr-1.5 -mt-0.5" />
              Logros ({logrosList.length})
            </h2>
            <p style={{ fontSize: 13, color: "#6B6660", margin: "2px 0 0", maxWidth: 600 }}>
              Cada logro puede pertenecer a una subcategoría o quedar directo en la categoría.
              Marca como <strong>Destacado</strong> los logros que quieres mostrar en la landing
              y en la sección &quot;Logros destacados&quot; de las páginas /logros.
            </p>
          </div>
          <Link
            href={`/admin/contenido/reconocimientos/${cat.id}/logros/nuevo`}
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
              fontSize: 14,
              color: "#6B6660",
              background: "#FAFAF8",
              border: "1px dashed #E8E4DD",
              borderRadius: 8,
              margin: 0,
            }}
          >
            Aún no hay logros registrados.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {logrosList.map((l) => {
              const sub = l.subcategoria_id ? subById.get(l.subcategoria_id) : null;
              return (
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
                          fontSize: 14,
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
                            fontSize: 11,
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
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#92400E",
                          }}
                        >
                          <EyeOff size={9} /> OCULTO
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 12, color: "#6B6660", margin: "1px 0 0" }}>
                      {l.year && <span>{l.year} · </span>}
                      {sub ? `Subcategoría: ${sub.nombre}` : "Sin subcategoría"}
                      {l.descripcion && <span> · {l.descripcion}</span>}
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
              );
            })}
          </div>
        )}
      </section>

      {/* ────── Galería ────── */}
      <section
        className="flex flex-col gap-4 p-5"
        style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
      >
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
            <ImageIcon size={14} strokeWidth={2.5} className="inline-block mr-1.5 -mt-0.5" />
            Galería de la categoría ({galeriaList.length} fotos)
          </h2>
          <p style={{ fontSize: 13, color: "#6B6660", margin: "2px 0 0", maxWidth: 720 }}>
            Estas fotos se muestran como mosaico en la landing <code style={code}>/reconocimientos/{cat.slug}</code> (las 5
            primeras) y en la galería completa <code style={code}>/reconocimientos/{cat.slug}/galeria</code>
            (todas). En la galería pública, hacer clic en cualquier foto abre un lightbox.
          </p>
        </div>
        <GaleriaEditor
          scope="categoria"
          scopeId={cat.id}
          categoriaId={cat.id}
          fotosIniciales={galeriaList.map((f) => ({ src: f.src, alt: f.alt }))}
          prefix={`reconocimientos/${cat.slug}/galeria`}
        />
      </section>
    </div>
  );
}

const btnSecondary: React.CSSProperties = {
  height: 36,
  background: "#F4F1EB",
  fontSize: 14,
  color: "#1A2B4A",
  fontWeight: 500,
  textDecoration: "none",
};

const btnPrimarySm: React.CSSProperties = {
  height: 32,
  background: "#1A2B4A",
  fontSize: 13,
  color: "#FFFFFF",
  fontWeight: 600,
  textDecoration: "none",
};

const iconBtn: React.CSSProperties = {
  width: 22,
  height: 22,
  background: "#FFFFFF",
  color: "#1A2B4A",
  border: "1px solid #E8E4DD",
  borderRadius: 4,
  cursor: "pointer",
};

const code: React.CSSProperties = {
  background: "#F4F1EB",
  padding: "1px 6px",
  borderRadius: 4,
  fontFamily: "ui-monospace, monospace",
  fontSize: 13,
};
