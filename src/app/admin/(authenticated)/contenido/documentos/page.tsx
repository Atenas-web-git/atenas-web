import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ExternalLink, FolderCog, Plus, ImageIcon } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { DocumentosFilters } from "./DocumentosFilters";
import { MoverDocumentoBtns } from "./MoverDocumentoBtns";

export default async function DocumentosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ACADEMICO])) {
    redirect("/admin");
  }

  const params = await searchParams;
  const query = (params.q ?? "").trim().toLowerCase();
  const filtroCat = params.cat ?? "";

  const supabase = createAdminClient();

  const { data: categorias = [] } = await supabase
    .from("documentos_categorias")
    .select("id, slug, nombre, icono, color, orden")
    .order("orden", { ascending: true });

  const { data: documentos = [] } = await supabase
    .from("documentos")
    .select("id, titulo, descripcion, categoria_id, drive_url, orden, publicado, updated_at")
    .order("categoria_id", { ascending: true })
    .order("orden", { ascending: true });

  const cats = categorias ?? [];
  const docs = documentos ?? [];
  const filtroCatId = filtroCat ? Number(filtroCat) : null;

  // Calcular posición de cada documento dentro de su categoría
  // (para deshabilitar las flechas en los extremos).
  const posicionEnCategoria = new Map<number, { isFirst: boolean; isLast: boolean }>();
  const porCategoria = new Map<number, typeof docs>();
  for (const d of docs) {
    if (!porCategoria.has(d.categoria_id)) porCategoria.set(d.categoria_id, []);
    porCategoria.get(d.categoria_id)!.push(d);
  }
  for (const lista of porCategoria.values()) {
    lista.forEach((d, i) => {
      posicionEnCategoria.set(d.id, {
        isFirst: i === 0,
        isLast: i === lista.length - 1,
      });
    });
  }

  const docsFiltrados = docs.filter((d) => {
    if (filtroCatId && d.categoria_id !== filtroCatId) return false;
    if (query && !d.titulo.toLowerCase().includes(query)) return false;
    return true;
  });

  const totalPublicados = docs.filter((d) => d.publicado).length;

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href="/admin/contenido"
        className="flex items-center gap-1.5 w-fit transition-opacity hover:opacity-70"
        style={{ fontSize: 14, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver a Contenido
      </Link>

      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
            Documentos descargables
          </h1>
          <p style={{ fontSize: 14, color: "#6B6660", margin: "4px 0 0", maxWidth: 720 }}>
            Documentos institucionales hospedados en Google Drive (no se suben a Supabase).
            El archivo va a Google Drive como público y aquí pegas el link. Total:{" "}
            <strong style={{ color: "#1A2B4A" }}>{docs.length}</strong> documentos,{" "}
            <strong style={{ color: "#065F46" }}>{totalPublicados}</strong> publicados.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/admin/contenido/documentos/hero"
            className="flex items-center gap-1.5 px-3 rounded-md transition-opacity hover:opacity-70"
            style={{
              height: 36,
              background: "#F4F1EB",
              fontSize: 14,
              color: "#1A2B4A",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            <ImageIcon size={14} strokeWidth={2.5} />
            Cabecera (hero)
          </Link>
          <Link
            href="/admin/contenido/documentos/categorias"
            className="flex items-center gap-1.5 px-3 rounded-md transition-opacity hover:opacity-70"
            style={{
              height: 36,
              background: "#F4F1EB",
              fontSize: 14,
              color: "#1A2B4A",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            <FolderCog size={14} strokeWidth={2.5} />
            Categorías
          </Link>
          <Link
            href="/admin/contenido/documentos/nuevo"
            className="flex items-center gap-1.5 px-4 rounded-md transition-opacity hover:opacity-90"
            style={{
              height: 36,
              background: "#1A2B4A",
              fontSize: 14,
              color: "#FFFFFF",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <Plus size={14} strokeWidth={2.5} />
            Nuevo documento
          </Link>
        </div>
      </div>

      <DocumentosFilters
        categorias={cats.map((c) => ({ id: c.id, nombre: c.nombre }))}
        currentQ={query}
        currentCat={filtroCat}
      />

      {/* Aviso si no hay categorías */}
      {cats.length === 0 && (
        <div
          className="px-5 py-4 rounded-md"
          style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}
        >
          <p style={{ fontSize: 14, color: "#92400E", margin: 0 }}>
            Aún no hay categorías. Crea al menos una desde{" "}
            <Link href="/admin/contenido/documentos/categorias" style={{ color: "#92400E", fontWeight: 600 }}>
              gestionar categorías
            </Link>{" "}
            antes de subir documentos.
          </p>
        </div>
      )}

      {docsFiltrados.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 px-6"
          style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
        >
          <p style={{ fontSize: 14, color: "#6B6660", margin: 0, textAlign: "center" }}>
            {docs.length === 0
              ? "Aún no hay documentos. Crea el primero arriba."
              : "Ningún documento coincide con los filtros."}
          </p>
        </div>
      ) : (
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E4DD",
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E8E4DD", background: "#FAFAF8" }}>
                {["Documento", "Categoría", "Link", "Estado", "Orden", ""].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#6B6660",
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {docsFiltrados.map((doc) => {
                const cat = cats.find((c) => c.id === doc.categoria_id);
                const pos = posicionEnCategoria.get(doc.id) ?? { isFirst: true, isLast: true };
                return (
                  <tr key={doc.id} style={{ borderBottom: "1px solid #F4F1EB" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <Link
                        href={`/admin/contenido/documentos/${doc.id}`}
                        style={{ fontSize: 14, fontWeight: 600, color: "#1A2B4A", textDecoration: "none" }}
                      >
                        {doc.titulo}
                      </Link>
                      {doc.descripcion && (
                        <p
                          style={{
                            fontSize: 12,
                            color: "#6B6660",
                            margin: "2px 0 0",
                            maxWidth: 380,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {doc.descripcion}
                        </p>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px", fontSize: 13, color: "#6B6660" }}>
                      {cat?.nombre ?? "—"}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      {doc.drive_url ? (
                        <a
                          href={doc.drive_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 transition-opacity hover:opacity-70"
                          style={{ fontSize: 12, color: "#1A2B4A", textDecoration: "none" }}
                          title={doc.drive_url}
                        >
                          <ExternalLink size={11} strokeWidth={2.5} />
                          Abrir
                        </a>
                      ) : (
                        <span style={{ fontSize: 12, color: "#9CA3AF", fontStyle: "italic" }}>
                          (sin link)
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        className="inline-flex items-center px-2 rounded-full"
                        style={{
                          height: 20,
                          background: doc.publicado ? "#DCFCE7" : "#FEF3C7",
                          fontSize: 11,
                          fontWeight: 700,
                          color: doc.publicado ? "#065F46" : "#92400E",
                          letterSpacing: 0.3,
                        }}
                      >
                        {doc.publicado ? "PUBLICADO" : "BORRADOR"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <MoverDocumentoBtns
                        id={doc.id}
                        isFirstInCategoria={pos.isFirst}
                        isLastInCategoria={pos.isLast}
                      />
                    </td>
                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      <Link
                        href={`/admin/contenido/documentos/${doc.id}`}
                        className="inline-flex items-center px-3 rounded-md transition-opacity hover:opacity-70"
                        style={{
                          height: 28,
                          background: "#F4F1EB",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#1A2B4A",
                          textDecoration: "none",
                        }}
                      >
                        Editar
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
