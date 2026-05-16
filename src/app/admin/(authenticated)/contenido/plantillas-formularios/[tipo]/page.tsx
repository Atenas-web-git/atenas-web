import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import {
  TIPOS_PLANTILLA_FORMULARIO,
  TIPOS_PLANTILLA_INFO,
  type TipoPlantillaFormulario,
} from "../constants";
import { EditorClient } from "./EditorClient";

export const dynamic = "force-dynamic";

export default async function EditarPlantillaFormularioPage({
  params,
}: {
  params: Promise<{ tipo: string }>;
}) {
  const { tipo: tipoRaw } = await params;

  if (!TIPOS_PLANTILLA_FORMULARIO.includes(tipoRaw as TipoPlantillaFormulario)) {
    notFound();
  }
  const tipo = tipoRaw as TipoPlantillaFormulario;
  const info = TIPOS_PLANTILLA_INFO[tipo];

  const user = await getCurrentUser();
  if (!user) return null;
  if (
    !hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ADMISIONES, ROLES.EDITOR_COMM])
  ) {
    redirect("/admin");
  }

  const supabase = createAdminClient();
  const { data: plantilla } = await supabase
    .from("plantillas_correo_formularios")
    .select("tipo, titulo, asunto, cuerpo_html, activo")
    .eq("tipo", tipo)
    .maybeSingle();

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href="/admin/contenido/plantillas-formularios"
        className="flex items-center gap-1.5 w-fit transition-opacity hover:opacity-70"
        style={{ fontSize: 13, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver a plantillas
      </Link>

      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Plantilla — {info.label}
        </h1>
        <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0" }}>
          {info.description}
        </p>
      </div>

      <EditorClient
        tipo={tipo}
        tipoLabel={info.label}
        initialTitulo={plantilla?.titulo ?? info.label}
        initialAsunto={plantilla?.asunto ?? ""}
        initialHtml={
          plantilla?.cuerpo_html ??
          "<p>Hola, gracias por contactarte con nosotros.</p>"
        }
        initialActivo={plantilla?.activo ?? true}
        variables={info.variables}
        sample={info.sample}
      />
    </div>
  );
}
