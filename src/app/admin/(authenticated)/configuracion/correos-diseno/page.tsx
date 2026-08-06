import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import {
  getConfiguracion,
  mergeCorreosDiseno,
  type CorreosDiseno,
} from "@/lib/cms/getConfiguracion";
import { CorreosDisenoForm } from "./CorreosDisenoForm";

export default async function CorreosDisenoPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN])) redirect("/admin");

  const raw = await getConfiguracion<Partial<CorreosDiseno>>("correos_diseno");
  const config = mergeCorreosDiseno(raw);

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
          Diseño de correos
        </h1>
        <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0", maxWidth: 760, lineHeight: 1.5 }}>
          Identidad común a los 10 correos transaccionales del sitio. El logo, la
          paleta y los datos institucionales se leen automáticamente de{" "}
          <strong>Marca</strong> y <strong>Contacto</strong>. Aquí editas solo lo
          que varía entre todos: la <strong>variante del logo</strong> en el header
          y el <strong>texto legal</strong> del footer. El color de acento, eyebrow,
          imagen hero y botón CTA se configuran por separado en cada plantilla
          (Admisiones › Correos y Contenido › Plantillas de correo para formularios).
        </p>
      </div>

      <CorreosDisenoForm initial={config} />
    </div>
  );
}
