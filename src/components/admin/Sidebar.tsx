"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserPlus,
  FileText,
  Users,
  Settings,
  BookOpen,
  LogOut,
} from "lucide-react";
import { logoutAction } from "@/app/admin/login/actions";
import { LogoSVG } from "@/components/shared/LogoSVG";
import { ROLES, type AdminUser, hasRole, hasAnyRole } from "@/lib/auth/types";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  visible: (u: AdminUser) => boolean;
  badge?: (u: AdminUser) => string | null;
};

const navItems: NavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    visible: () => true,
  },
  {
    href: "/admin/admisiones",
    label: "Admisiones",
    icon: UserPlus,
    visible: (u) => hasAnyRole(u, [ROLES.SUPERADMIN, ROLES.EDITOR_ADMISIONES]),
  },
  {
    href: "/admin/contenido",
    label: "Contenido",
    icon: FileText,
    visible: (u) =>
      hasAnyRole(u, [
        ROLES.SUPERADMIN,
        ROLES.EDITOR_COMM,
        ROLES.EDITOR_ACADEMICO,
        // Talento Humano entra por aquí: Vacantes, su formulario y su página
        // viven bajo Contenido. Lo que ve dentro está recortado por área.
        ROLES.EDITOR_TALENTO,
      ]),
  },
  {
    href: "/admin/usuarios",
    label: "Usuarios",
    icon: Users,
    visible: (u) => hasRole(u, ROLES.SUPERADMIN),
  },
  {
    href: "/admin/configuracion",
    label: "Configuración",
    icon: Settings,
    visible: (u) => hasAnyRole(u, [ROLES.SUPERADMIN, ROLES.EDITOR_ADMISIONES]),
  },
  {
    // Manual de uso del panel. Visible para todos los roles: cada quien
    // encuentra ahí lo que sí puede hacer con sus permisos.
    href: "/admin/documentacion",
    label: "Documentación",
    icon: BookOpen,
    visible: () => true,
  },
];

function getInitials(fullName: string, email: string): string {
  const source = fullName.trim() || email;
  const parts = source.split(/[\s.@]+/).filter(Boolean);
  if (parts.length === 0) return "·";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getRoleBadge(user: AdminUser): string {
  if (hasRole(user, ROLES.SUPERADMIN)) return "Superadmin";
  if (hasRole(user, ROLES.EDITOR_COMM)) return "Editor Comunicaciones";
  if (hasRole(user, ROLES.EDITOR_ADMISIONES)) return "Editor Admisiones";
  if (hasRole(user, ROLES.EDITOR_ACADEMICO)) return "Editor Académico";
  if (hasRole(user, ROLES.EDITOR_TALENTO)) return "Talento Humano";
  return "Sin rol";
}

export function Sidebar({ user }: { user: AdminUser }) {
  const pathname = usePathname();
  const initials = getInitials(user.fullName, user.email);
  const roleLabel = getRoleBadge(user);

  return (
    <aside
      // `ds-admin-sidebar`: aquí el anillo de foco tiene que ser BLANCO, porque
      // el navy del anillo general sería invisible sobre este mismo navy.
      className="ds-admin-sidebar flex flex-col flex-shrink-0 overflow-y-auto"
      // `height` y no `minHeight`: desde que el armazón es `h-screen` con
      // `overflow-hidden`, un `minHeight: 100vh` podía empujar el menú por
      // debajo del borde de la ventana y dejar el bloque del usuario —con el
      // botón de cerrar sesión— cortado y sin forma de alcanzarlo. Con altura
      // exacta y scroll propio, en una pantalla baja el menú se desplaza solo.
      style={{ background: "#1A2B4A", width: 260, height: "100vh" }}
    >
      <div
        className="flex flex-col items-start gap-1 px-6 py-5"
        style={{ borderBottom: "1px solid #2D3F6B" }}
      >
        <LogoSVG variant="white" className="h-[36px] w-auto" />
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#A0AABA",
            letterSpacing: 2,
            textTransform: "uppercase",
            paddingLeft: 2,
          }}
        >
          Backoffice
        </span>
      </div>

      <nav className="flex-1 flex flex-col gap-0.5 p-3">
        {navItems
          .filter((item) => item.visible(user))
          .map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href || pathname.startsWith(item.href + "/");
            const badge = item.badge?.(user);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 h-10 px-4 rounded-md transition-colors"
                style={{
                  background: isActive ? "#2D3F6B" : "transparent",
                  textDecoration: "none",
                }}
              >
                <Icon
                  size={18}
                  color={isActive ? "#9e1915" : "#A0AABA"}
                  strokeWidth={2}
                />
                <span
                  className="flex-1"
                  style={{
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#FFFFFF" : "#E5E9F0",
                  }}
                >
                  {item.label}
                </span>
                {badge && (
                  <span
                    className="flex items-center justify-center px-2 rounded-full"
                    style={{
                      height: 20,
                      background: "#9e1915",
                      fontSize: 12,
                      fontWeight: 700,
                      color:"#FFFFFF",
                    }}
                  >
                    {badge}
                  </span>
                )}
              </Link>
            );
          })}
      </nav>

      <div
        className="flex items-center gap-2.5 px-6 py-4"
        style={{ borderTop: "1px solid #2D3F6B" }}
      >
        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{
            width: 36,
            height: 36,
            background: "#9e1915",
            borderRadius: "50%",
          }}
        >
          <span
            style={{ fontSize: 14, fontWeight: 700, color:"#FFFFFF" }}
          >
            {initials}
          </span>
        </div>
        <div className="flex flex-col flex-1 min-w-0">
          <span
            className="truncate"
            style={{ fontSize: 14, fontWeight: 600, color: "#FFFFFF" }}
            title={user.fullName}
          >
            {user.fullName}
          </span>
          <span
            className="truncate"
            style={{ fontSize: 12, fontWeight: 500, color: "#A0AABA" }}
          >
            {roleLabel}
          </span>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center justify-center transition-opacity hover:opacity-100"
            style={{
              width: 32,
              height: 32,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              opacity: 0.7,
            }}
            aria-label="Cerrar sesión"
            title="Cerrar sesión"
          >
            <LogOut size={18} color="#A0AABA" strokeWidth={2} />
          </button>
        </form>
      </div>
    </aside>
  );
}
