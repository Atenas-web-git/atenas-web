import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { CrearDocumentoForm } from "./CrearDocumentoForm";
import { DocumentoRow } from "./DocumentoRow";

export default async function DocumentosAdmisionPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ADMISIONES])) redirect("/admin");

  const supabase = createAdminClient();

  const { data: documentos } = await supabase
    .from("documentos_admision_catalogo")
    .select("id, nombre, orden, activo")
    .order("orden", { ascending: true });

  const filas = documentos ?? [];

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href="/admin/configuracion"
        className="flex items-center gap-1.5 w-fit transition-opacity hover:opacity-70"
        style={{ fontSize: 14, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver a Configuración
      </Link>

      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Documentos físicos de admisión
        </h1>
        <p style={{ fontSize: 14, color: "#6B6660", margin: "4px 0 0" }}>
          Catálogo de documentos que el equipo de admisiones marca como recibidos
          en cada solicitud. Solo los documentos marcados como activos aparecen
          en la checklist del detalle.
        </p>
      </div>

      <CrearDocumentoForm />

      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8E4DD",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {filas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <p style={{ fontSize: 14, color: "#6B6660", margin: 0, textAlign: "center" }}>
              Aún no hay documentos en el catálogo. Agrega el primero arriba.
            </p>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #E8E4DD" }}>
                {["#", "Nombre del documento", "Estado", ""].map((h) => (
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
              {filas.map((doc) => (
                <DocumentoRow key={doc.id} doc={doc} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
