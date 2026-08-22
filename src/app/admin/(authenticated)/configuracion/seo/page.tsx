import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasRole } from "@/lib/auth/types";
import { mergeSeo, type Seo } from "@/lib/cms/getConfiguracion";
import { SeoForm } from "./SeoForm";

export const dynamic = "force-dynamic";

export default async function SeoConfigPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasRole(user, ROLES.SUPERADMIN)) redirect("/admin");

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("configuracion_global")
    .select("value")
    .eq("key", "seo")
    .maybeSingle();

  const seo: Seo = mergeSeo((data?.value as Partial<Seo> | null) ?? null);

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
          SEO defaults globales
        </h1>
        <p style={{ fontSize: 14, color: "#6B6660", margin: "4px 0 0", maxWidth: 760 }}>
          Metadatos por defecto del sitio. Cada página individual puede sobrescribir
          su title y description desde el editor de la página (campos meta_title y
          meta_description). Estos defaults se usan cuando la página no los define.
        </p>
      </div>

      <SeoForm initialSeo={seo} />
    </div>
  );
}
