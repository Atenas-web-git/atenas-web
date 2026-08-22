import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasRole } from "@/lib/auth/types";
import { mergeMarca, type Marca } from "@/lib/cms/getConfiguracion";
import { MarcaForm } from "./MarcaForm";

export const dynamic = "force-dynamic";

export default async function MarcaPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasRole(user, ROLES.SUPERADMIN)) redirect("/admin");

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("configuracion_global")
    .select("value")
    .eq("key", "marca")
    .maybeSingle();

  const marca: Marca = mergeMarca((data?.value as Partial<Marca> | null) ?? null);

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
          Marca / Identidad visual
        </h1>
        <p style={{ fontSize: 14, color: "#6B6660", margin: "4px 0 0", maxWidth: 720 }}>
          Logos, paleta de colores, tipografía e información institucional global. Los
          colores se inyectan como CSS variables al sitio público y los nuevos
          componentes los usarán automáticamente. Los datos de institución alimentan el
          JSON-LD del SEO.
        </p>
      </div>

      <MarcaForm initialMarca={marca} />
    </div>
  );
}
