import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasRole } from "@/lib/auth/types";
import {
  mergeContactosPagina,
  type ContactosPaginaConfig,
} from "@/lib/cms/contactosPagina";
import { ContactosPaginaForm } from "./ContactosPaginaForm";

export const dynamic = "force-dynamic";

export default async function ContactosPaginaPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasRole(user, ROLES.SUPERADMIN)) redirect("/admin");

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("configuracion_global")
    .select("value")
    .eq("key", "contactos_pagina")
    .maybeSingle();

  const config: ContactosPaginaConfig = mergeContactosPagina(
    (data?.value as Partial<ContactosPaginaConfig> | null) ?? null
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
          Página /contactos
        </h1>
        <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0", maxWidth: 720 }}>
          Hero, tarjeta flotante, sección &quot;Canales de atención&quot; (3 tarjetas con
          extensiones, dirección y email), formulario y embed de Google Maps. Los
          datos primarios de contacto (teléfono central, dirección, email) se leen de
          la sección Contacto.
        </p>
      </div>

      <ContactosPaginaForm initialConfig={config} />
    </div>
  );
}
