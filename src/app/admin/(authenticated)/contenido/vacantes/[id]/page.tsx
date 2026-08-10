import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ExternalLink, Inbox } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { puedeVerVacantes } from "@/lib/auth/areas";
import { getVacantePorId } from "@/lib/vacantes/getVacantes";
import { listarFormularios } from "@/lib/formularios/getFormulario";
import { EditorVacante } from "./EditorVacante";

export const dynamic = "force-dynamic";

export default async function EditarVacantePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) return null;
  if (!puedeVerVacantes(user)) {
    redirect("/admin");
  }

  const [vacante, formularios] = await Promise.all([
    getVacantePorId(id),
    listarFormularios(user),
  ]);
  if (!vacante) notFound();

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/contenido/vacantes"
            className="inline-flex items-center gap-1"
            style={{ fontSize: 12, color: "#6B6660" }}
          >
            <ArrowLeft size={13} /> Vacantes
          </Link>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: "8px 0 0" }}>
            {vacante.titulo}
          </h1>
          <p style={{ fontSize: 12, color: "#6B6660", margin: "4px 0 0" }}>
            /trabaja-con-nosotros/{vacante.slug}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {vacante.activa && (
            <a
              href={`/trabaja-con-nosotros/${vacante.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2"
              style={{
                border: "1px solid #E8E4DD",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                color: "#1A2B4A",
              }}
            >
              <ExternalLink size={13} /> Ver pública
            </a>
          )}
          {vacante.formulario_id && (
            <Link
              href={`/admin/contenido/formularios/${vacante.formulario_id}/respuestas`}
              className="inline-flex items-center gap-1.5 px-3 py-2"
              style={{
                border: "1px solid #E8E4DD",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                color: "#1A2B4A",
              }}
            >
              <Inbox size={13} /> Postulaciones
            </Link>
          )}
        </div>
      </div>

      <EditorVacante vacante={vacante} formularios={formularios} />
    </div>
  );
}
