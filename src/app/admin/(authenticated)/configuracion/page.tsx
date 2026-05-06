import Link from "next/link";
import { redirect } from "next/navigation";
import { Calendar, FileCheck2, ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole, hasRole } from "@/lib/auth/types";

const SECCIONES = [
  {
    href: "/admin/configuracion/anos-lectivos",
    title: "Años lectivos",
    description: "Crea, edita o elimina los años lectivos disponibles en cupos y formularios.",
    icon: Calendar,
    onlySuperadmin: true,
  },
  {
    href: "/admin/configuracion/documentos-admision",
    title: "Documentos de admisión",
    description: "Catálogo editable de documentos físicos que el equipo marca como recibidos en cada solicitud.",
    icon: FileCheck2,
    onlySuperadmin: false,
  },
];

export default async function ConfiguracionPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  // Permitir acceso a superadmin y editor_admisiones (este último solo verá la card de Documentos)
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ADMISIONES])) redirect("/admin");

  const isSuper = hasRole(user, ROLES.SUPERADMIN);
  const seccionesVisibles = SECCIONES.filter((s) => isSuper || !s.onlySuperadmin);

  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Configuración
        </h1>
        <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0" }}>
          Ajustes globales del sitio y del backoffice
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {seccionesVisibles.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.href}
              href={s.href}
              className="flex flex-col gap-3 p-5 transition-all hover:shadow-sm"
              style={{
                background: "#FFFFFF",
                border: "1px solid #E8E4DD",
                borderRadius: 12,
                textDecoration: "none",
              }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 36,
                    height: 36,
                    background: "#F4F1EB",
                    borderRadius: 8,
                  }}
                >
                  <Icon size={18} color="#1A2B4A" strokeWidth={2} />
                </div>
                <ArrowRight size={14} color="#6B6660" strokeWidth={2} />
              </div>
              <div>
                <h2
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#1A2B4A",
                    margin: 0,
                  }}
                >
                  {s.title}
                </h2>
                <p
                  style={{
                    fontSize: 12,
                    color: "#6B6660",
                    margin: "4px 0 0",
                    lineHeight: 1.5,
                  }}
                >
                  {s.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
