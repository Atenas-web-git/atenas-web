import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasRole } from "@/lib/auth/types";
import { mergeContacto, type Contacto } from "@/lib/cms/getConfiguracion";
import { ContactoForm } from "./ContactoForm";

export const dynamic = "force-dynamic";

export default async function ContactoConfigPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasRole(user, ROLES.SUPERADMIN)) redirect("/admin");

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("configuracion_global")
    .select("value")
    .eq("key", "contacto")
    .maybeSingle();

  const contacto: Contacto = mergeContacto((data?.value as Partial<Contacto> | null) ?? null);

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
          Contacto
        </h1>
        <p style={{ fontSize: 14, color: "#6B6660", margin: "4px 0 0", maxWidth: 720 }}>
          Teléfonos, emails, redes sociales y WhatsApp del FloatingBoot. Se usan en el
          footer, la página de contactos, el FloatingBoot y los datos del JSON-LD del SEO.
        </p>
      </div>

      <ContactoForm initialContacto={contacto} />
    </div>
  );
}
