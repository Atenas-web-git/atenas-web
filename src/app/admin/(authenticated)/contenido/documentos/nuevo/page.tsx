import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { DocumentoForm } from "../DocumentoForm";

export default async function NuevoDocumentoPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ACADEMICO])) {
    redirect("/admin");
  }

  const supabase = createAdminClient();
  const { data: categorias = [] } = await supabase
    .from("documentos_categorias")
    .select("id, nombre")
    .order("orden", { ascending: true });

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href="/admin/contenido/documentos"
        className="flex items-center gap-1.5 w-fit transition-opacity hover:opacity-70"
        style={{ fontSize: 14, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver al listado
      </Link>

      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Nuevo documento
        </h1>
        <p style={{ fontSize: 14, color: "#6B6660", margin: "4px 0 0" }}>
          Pega el link de Google Drive del documento. Empieza como borrador y publica cuando esté listo.
        </p>
      </div>

      <DocumentoForm modo="crear" categorias={categorias ?? []} />
    </div>
  );
}
