import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasRole } from "@/lib/auth/types";
import { buildAdminTree, type MenuItemRow } from "@/lib/cms/getMegaMenu";
import { MegaMenuEditor } from "./MegaMenuEditor";

export const dynamic = "force-dynamic";

export default async function MegaMenuPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasRole(user, ROLES.SUPERADMIN)) redirect("/admin");

  // Admin lee todos los items, incluso ocultos
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("menu_items")
    .select("id, parent_id, label, href, external, badge, visible, orden")
    .order("orden", { ascending: true });

  const tree = buildAdminTree((data ?? []) as MenuItemRow[]);

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
          Mega-menú
        </h1>
        <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0", maxWidth: 760 }}>
          Estructura jerárquica del menú principal del sitio. Cada categoría agrupa sub-items que enlazan a páginas internas o externas. Los cambios se reflejan en el sitio público inmediatamente al guardar.
        </p>
      </div>

      <MegaMenuEditor tree={tree} />
    </div>
  );
}
