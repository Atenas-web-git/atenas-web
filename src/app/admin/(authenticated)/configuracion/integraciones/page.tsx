import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasRole } from "@/lib/auth/types";
import { mergeIntegraciones, type Integraciones } from "@/lib/cms/getConfiguracion";
import { IntegracionesForm } from "./IntegracionesForm";

export const dynamic = "force-dynamic";

export default async function IntegracionesConfigPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasRole(user, ROLES.SUPERADMIN)) redirect("/admin");

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("configuracion_global")
    .select("value")
    .eq("key", "integraciones")
    .maybeSingle();

  const integraciones: Integraciones = mergeIntegraciones(
    (data?.value as Partial<Integraciones> | null) ?? null
  );

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
          Integraciones de terceros
        </h1>
        <p style={{ fontSize: 14, color: "#6B6660", margin: "4px 0 0", maxWidth: 720 }}>
          IDs de tracking (Google Tag Manager, Google Analytics 4, Facebook Pixel, TikTok
          Pixel) y otras claves API. Los scripts solo se inyectan en el sitio público
          cuando el ID está configurado — campos vacíos desactivan la integración.
        </p>
      </div>

      <IntegracionesForm initialIntegraciones={integraciones} />
    </div>
  );
}
