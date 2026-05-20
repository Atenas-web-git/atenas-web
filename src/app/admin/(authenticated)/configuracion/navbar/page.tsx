import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import {
  getConfiguracion,
  mergeNavbar,
  type NavbarConfig,
} from "@/lib/cms/getConfiguracion";
import { NavbarConfigForm } from "./NavbarConfigForm";

export default async function NavbarConfigPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN])) redirect("/admin");

  const raw = await getConfiguracion<Partial<NavbarConfig>>("navbar");
  const config = mergeNavbar(raw);

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href="/admin/configuracion"
        className="flex items-center gap-1.5 transition-opacity hover:opacity-70"
        style={{ fontSize: 13, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver a Configuración
      </Link>

      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Barra de navegación
        </h1>
        <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0", maxWidth: 760, lineHeight: 1.5 }}>
          Elementos visibles en la barra superior fija que aparece en todo el sitio: badge
          conmemorativo, CTAs (Portal Familiar / Tour Virtual), búsqueda, campanita de
          notificaciones y label del botón menú. El logo principal del colegio se edita
          en <strong>Marca</strong> y las categorías del menú en <strong>Mega-menú</strong>.
        </p>
      </div>

      <NavbarConfigForm initial={config} />
    </div>
  );
}
