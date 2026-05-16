import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasRole } from "@/lib/auth/types";
import {
  mergeCorreos,
  type CorreosConfig,
} from "@/lib/cms/getConfiguracion";
import { CorreosForm } from "./CorreosForm";

export const dynamic = "force-dynamic";

export default async function CorreosConfigPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasRole(user, ROLES.SUPERADMIN)) redirect("/admin");

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("configuracion_global")
    .select("value")
    .eq("key", "correos")
    .maybeSingle();

  const config: CorreosConfig = mergeCorreos(
    (data?.value as Partial<CorreosConfig> | null) ?? null
  );

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
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Correos
        </h1>
        <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0", maxWidth: 720 }}>
          Elige el proveedor de envío (Resend o SMTP), configura sus credenciales y define
          remitente y destinatario por cada tipo de correo del sitio.
        </p>
      </div>

      <CorreosForm initialConfig={config} />
    </div>
  );
}
