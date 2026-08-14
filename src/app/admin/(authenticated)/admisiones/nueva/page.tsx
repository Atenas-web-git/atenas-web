import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole, hasRole } from "@/lib/auth/types";
import {
  getConfiguracion,
  mergeAdmisionesTextos,
  type AdmisionesTextosConfig,
} from "@/lib/cms/getConfiguracion";
import { AdmisionesSubNav } from "../SubNav";
import { CrearSolicitudForm } from "./CrearSolicitudForm";

export default async function NuevaSolicitudPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ADMISIONES])) redirect("/admin");

  const supabase = createAdminClient();

  // Las mismas listas que usan el formulario público y el editor de la ficha,
  // para no tener una tercera versión de la verdad.
  const [textosRaw, { data: anosLectivos }] = await Promise.all([
    getConfiguracion<Partial<AdmisionesTextosConfig>>("admisiones_textos"),
    supabase
      .from("anos_lectivos")
      .select("codigo")
      .eq("activo", true)
      .order("codigo", { ascending: true }),
  ]);

  const opcionesFormulario = mergeAdmisionesTextos(textosRaw).formulario.opciones;
  const aniosLectivos = (anosLectivos ?? []).map((a) => a.codigo as string);

  // Sin años lectivos activos no se puede registrar nada: el año es
  // obligatorio aquí. Se dice, en vez de ofrecer un desplegable vacío que no
  // deja enviar y no explica por qué.
  if (aniosLectivos.length === 0) {
    return (
      <div className="flex flex-col gap-6 p-8">
        <AdmisionesSubNav />
        <div
          className="flex flex-col items-center justify-center gap-4 py-16 px-6"
          style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
        >
          <p style={{ fontSize: 14, color: "#6B6660", margin: 0, textAlign: "center" }}>
            No hay años lectivos configurados, y el año lectivo es obligatorio para registrar una
            solicitud a mano.
          </p>
          {hasRole(user, ROLES.SUPERADMIN) && (
            <Link
              href="/admin/configuracion/anos-lectivos"
              className="px-4 rounded-md transition-opacity hover:opacity-80"
              style={{
                height: 38,
                display: "inline-flex",
                alignItems: "center",
                background: "#1A2B4A",
                color: "#FFFFFF",
                textDecoration: "none",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Configurar años lectivos →
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <AdmisionesSubNav />

      <div className="flex flex-col gap-1">
        <Link
          href="/admin/admisiones"
          className="flex items-center gap-1 transition-opacity hover:opacity-70"
          style={{ fontSize: 12, color: "#6B6660", textDecoration: "none", width: "fit-content" }}
        >
          <ChevronLeft size={14} strokeWidth={2} />
          Volver a solicitudes
        </Link>
        <h1 style={{ fontSize: 22, fontWeight: 600, color: "#1A2B4A", margin: "4px 0 0" }}>
          Registrar una solicitud a mano
        </h1>
        <p style={{ fontSize: 13, color: "#6B6660", margin: 0 }}>
          Para quien llegó por teléfono, por WhatsApp o en persona
        </p>
      </div>

      <CrearSolicitudForm
        opciones={{
          niveles: opcionesFormulario.niveles,
          relaciones: opcionesFormulario.relaciones,
          comoEnterado: opcionesFormulario.comoEnterado,
          aniosLectivos,
        }}
      />
    </div>
  );
}
