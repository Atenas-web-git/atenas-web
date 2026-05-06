"use client";

import { usePathname } from "next/navigation";
import type { AdminUser } from "@/lib/auth/types";

const TITLES: Record<string, { title: string; subtitle: string }> = {
  "/admin": {
    title: "Dashboard",
    subtitle: "Resumen general del backoffice",
  },
  "/admin/admisiones": {
    title: "Solicitudes de admisión",
    subtitle:
      "Pipeline completo: pendientes, entrevistas, lista de espera, aceptadas y matriculadas",
  },
  "/admin/admisiones/cupos": {
    title: "Cupos por nivel",
    subtitle: "Configura cuántos estudiantes admite cada nivel",
  },
  "/admin/contenido": {
    title: "Contenido",
    subtitle: "Edita las páginas, noticias y recursos del sitio",
  },
  "/admin/usuarios": {
    title: "Usuarios",
    subtitle: "Gestiona quién accede al backoffice y con qué rol",
  },
  "/admin/usuarios/nuevo": {
    title: "Crear nuevo usuario",
    subtitle: "Solo el superadministrador puede crear cuentas",
  },
  "/admin/configuracion": {
    title: "Configuración",
    subtitle: "Ajustes globales del sitio y del backoffice",
  },
  "/admin/configuracion/anos-lectivos": {
    title: "Años lectivos",
    subtitle: "Catálogo editable de años lectivos del colegio",
  },
  "/admin/configuracion/documentos-admision": {
    title: "Documentos de admisión",
    subtitle: "Catálogo de documentos físicos a marcar en cada solicitud",
  },
};

function resolveTitle(pathname: string) {
  if (TITLES[pathname]) return TITLES[pathname];

  // Buscar el match más específico
  const matched = Object.keys(TITLES)
    .filter((p) => pathname === p || pathname.startsWith(p + "/"))
    .sort((a, b) => b.length - a.length)[0];

  if (matched) return TITLES[matched];

  return { title: "Backoffice", subtitle: "" };
}

export function Header({ user }: { user: AdminUser }) {
  const pathname = usePathname();
  const { title, subtitle } = resolveTitle(pathname);
  const firstName = user.fullName.split(/\s+/)[0] || user.email;

  const isDashboard = pathname === "/admin";
  const showGreeting = isDashboard;

  return (
    <header
      className="flex items-center justify-between px-8 flex-shrink-0"
      style={{
        height: 64,
        background: "#FFFFFF",
        borderBottom: "1px solid #E8E4DD",
      }}
    >
      <div className="flex flex-col gap-0.5">
        <h1
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#1A2B4A",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 12,
            fontWeight: 400,
            color: "#6B6660",
            margin: 0,
          }}
        >
          {showGreeting ? `Hola ${firstName}, esto es lo que pasa hoy.` : subtitle}
        </p>
      </div>
    </header>
  );
}
