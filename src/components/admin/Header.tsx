"use client";

import { usePathname } from "next/navigation";
import { Search, Bell } from "lucide-react";
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
    subtitle: "Identidad de marca, SEO global, integraciones",
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

      <div className="flex items-center gap-4">
        <button
          className="flex items-center justify-center transition-opacity"
          style={{
            width: 36,
            height: 36,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            opacity: 0.7,
          }}
          aria-label="Buscar"
        >
          <Search size={18} color="#6B6660" strokeWidth={2} />
        </button>
        <button
          className="flex items-center justify-center transition-opacity"
          style={{
            width: 36,
            height: 36,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            opacity: 0.7,
          }}
          aria-label="Notificaciones"
        >
          <Bell size={18} color="#6B6660" strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}
