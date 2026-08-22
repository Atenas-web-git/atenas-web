import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasRole } from "@/lib/auth/types";
import {
  mergeAdmisionesTextos,
  type AdmisionesTextosConfig,
} from "@/lib/cms/admisionesTextos";
import { AdmisionesTextosForm } from "./AdmisionesTextosForm";
import { ContadorAdmisionForm } from "./ContadorAdmisionForm";

export const dynamic = "force-dynamic";

export default async function AdmisionesTextosPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasRole(user, ROLES.SUPERADMIN)) redirect("/admin");

  const supabase = createAdminClient();
  const anoCodigo = String(new Date().getFullYear() % 100).padStart(3, "0");

  const [{ data }, { data: contadorRow }] = await Promise.all([
    supabase
      .from("configuracion_global")
      .select("value")
      .eq("key", "admisiones_textos")
      .maybeSingle(),
    supabase
      .from("admisiones_contador")
      .select("proximo")
      .eq("ano", anoCodigo)
      .maybeSingle(),
  ]);

  const config: AdmisionesTextosConfig = mergeAdmisionesTextos(
    (data?.value as Partial<AdmisionesTextosConfig> | null) ?? null
  );

  // `proximo` guarda el ÚLTIMO entregado; el próximo en entregarse es +1.
  // Si la fila no existe aún (año no sembrado), la primera llamada
  // devolverá 1, así que mostramos 1 como próximo.
  const ultimoEntregado = (contadorRow?.proximo as number | undefined) ?? 0;
  const siguienteNumero = ultimoEntregado + 1;

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
          Textos chicos de /admisiones (formulario + seguimiento)
        </h1>
        <p style={{ fontSize: 14, color: "#6B6660", margin: "4px 0 0", maxWidth: 720 }}>
          Encabezados del wizard de postulación (<code>/admisiones/formulario</code>) y de
          la página de consulta de estado (<code>/admisiones/seguimiento</code>). La lógica
          del wizard y la búsqueda permanece en código.
        </p>
      </div>

      <ContadorAdmisionForm ano={anoCodigo} siguiente={siguienteNumero} />

      <AdmisionesTextosForm initialConfig={config} />
    </div>
  );
}
