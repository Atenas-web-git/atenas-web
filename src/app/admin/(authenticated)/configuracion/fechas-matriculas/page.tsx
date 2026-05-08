import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { EditorFechas } from "./EditorFechas";

type FechasValue = {
  ano_lectivo?: string;
  etapas?: Array<{ etapa: string; rango: string }>;
  cta_texto?: string;
  cta_url?: string;
};

const DEFAULT_VALUE: Required<FechasValue> = {
  ano_lectivo: "Año lectivo 2026–2027",
  etapas: [
    { etapa: "Inscripciones", rango: "3 – 28 feb 2026" },
    { etapa: "Matrículas nuevas", rango: "3 – 14 mar 2026" },
    { etapa: "Reingreso", rango: "17 – 21 mar 2026" },
  ],
  cta_texto: "Iniciar proceso",
  cta_url: "/matriculas/proceso",
};

export default async function FechasMatriculasPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (
    !hasAnyRole(user, [
      ROLES.SUPERADMIN,
      ROLES.EDITOR_ADMISIONES,
      ROLES.EDITOR_COMM,
    ])
  ) {
    redirect("/admin");
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("configuracion_global")
    .select("value")
    .eq("key", "fechas_matriculas")
    .maybeSingle();

  const valor = (data?.value as FechasValue | null) ?? DEFAULT_VALUE;

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href="/admin/configuracion"
        className="flex items-center gap-1.5 w-fit transition-opacity hover:opacity-70"
        style={{ fontSize: 13, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver a Configuración
      </Link>

      <div>
        <div className="flex items-center gap-2">
          <Calendar size={20} color="#1A2B4A" strokeWidth={2} />
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
            Fechas de matrículas
          </h1>
        </div>
        <p style={{ fontSize: 13, color: "#6B6660", margin: "6px 0 0", lineHeight: 1.6 }}>
          Banner que aparece en todas las páginas de Matrículas (Proceso,
          Valores y Autorizaciones). Define el año lectivo, las etapas del
          proceso y el botón de llamada a la acción. Los cambios se reflejan
          automáticamente en el sitio público.
        </p>
      </div>

      <EditorFechas
        initialAnoLectivo={valor.ano_lectivo ?? DEFAULT_VALUE.ano_lectivo}
        initialEtapas={valor.etapas ?? DEFAULT_VALUE.etapas}
        initialCtaTexto={valor.cta_texto ?? ""}
        initialCtaUrl={valor.cta_url ?? ""}
      />
    </div>
  );
}
