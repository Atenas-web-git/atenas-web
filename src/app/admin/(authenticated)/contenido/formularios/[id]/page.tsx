import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Inbox } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { getFormularioPorId } from "@/lib/formularios/getFormulario";
import { createAdminClient } from "@/lib/supabase/admin";
import { EditorFormulario } from "./EditorFormulario";

export const dynamic = "force-dynamic";

export default async function EditarFormularioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_COMM])) {
    redirect("/admin");
  }

  const formulario = await getFormularioPorId(id);
  if (!formulario) notFound();

  const supabase = createAdminClient();

  // En qué páginas está puesto. Sin esto no hay forma de saber dónde se ve un
  // formulario, y el colegio acabaría creando duplicados.
  const { data: paginas } = await supabase
    .from("paginas")
    .select("slug, titulo, publicada")
    .eq("formulario_id", id);

  const { count: respuestas } = await supabase
    .from("formulario_respuestas")
    .select("id", { count: "exact", head: true })
    .eq("formulario_id", id);

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/contenido/formularios"
            className="inline-flex items-center gap-1"
            style={{ fontSize: 12, color: "#6B6660" }}
          >
            <ArrowLeft size={13} /> Formularios
          </Link>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: "8px 0 0" }}>
            {formulario.nombre}
          </h1>
        </div>

        <Link
          href={`/admin/contenido/formularios/${id}/respuestas`}
          className="inline-flex shrink-0 items-center gap-1.5 px-3 py-2"
          style={{
            border: "1px solid #E8E4DD",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            color: "#1A2B4A",
          }}
        >
          <Inbox size={14} /> Respuestas ({respuestas ?? 0})
        </Link>
      </div>

      <EditorFormulario
        formulario={formulario}
        paginas={(paginas ?? []) as { slug: string; titulo: string; publicada: boolean }[]}
        tieneRespuestas={(respuestas ?? 0) > 0}
      />
    </div>
  );
}
