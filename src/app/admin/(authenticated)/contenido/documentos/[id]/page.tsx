import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { DocumentoForm } from "../DocumentoForm";
import { EliminarDocumentoClient } from "./EliminarDocumentoClient";

export default async function EditarDocumentoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const docId = Number(id);

  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ACADEMICO])) {
    redirect("/admin");
  }

  const supabase = createAdminClient();

  const [{ data: doc }, { data: categorias = [] }] = await Promise.all([
    supabase
      .from("documentos")
      .select("id, titulo, descripcion, categoria_id, drive_url, orden, publicado, updated_at")
      .eq("id", docId)
      .maybeSingle(),
    supabase
      .from("documentos_categorias")
      .select("id, nombre")
      .order("orden", { ascending: true }),
  ]);

  if (!doc) notFound();

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link
          href="/admin/contenido/documentos"
          className="flex items-center gap-1.5 transition-opacity hover:opacity-70"
          style={{ fontSize: 14, color: "#6B6660", textDecoration: "none" }}
        >
          <ArrowLeft size={14} strokeWidth={2.5} />
          Volver al listado
        </Link>
        {doc.publicado && doc.drive_url && (
          <a
            href={doc.drive_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 rounded-md transition-opacity hover:opacity-70"
            style={{
              height: 32,
              background: "#F4F1EB",
              fontSize: 13,
              color: "#1A2B4A",
              fontWeight: 500,
              textDecoration: "none",
            }}
          >
            <ExternalLink size={12} strokeWidth={2.5} />
            Abrir documento
          </a>
        )}
      </div>

      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          {doc.titulo}
        </h1>
        <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0" }}>
          Última edición: {new Date(doc.updated_at).toLocaleString("es-EC")}
        </p>
      </div>

      <DocumentoForm
        modo="editar"
        categorias={categorias ?? []}
        initial={{
          id: doc.id,
          titulo: doc.titulo,
          descripcion: doc.descripcion ?? "",
          categoria_id: doc.categoria_id,
          drive_url: doc.drive_url ?? "",
          orden: doc.orden,
          publicado: doc.publicado,
        }}
      />

      {/* Zona peligrosa */}
      <div
        className="flex flex-col gap-3 p-5"
        style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
      >
        <h2
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#6B6660",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            margin: 0,
          }}
        >
          Zona peligrosa
        </h2>
        <p style={{ fontSize: 13, color: "#6B6660", margin: 0, lineHeight: 1.5 }}>
          Eliminar el documento borra el registro de Supabase. El archivo en Google Drive no se toca
          (solo el link que aparecía en el sitio público).
        </p>
        <EliminarDocumentoClient id={doc.id} titulo={doc.titulo} />
      </div>
    </div>
  );
}
