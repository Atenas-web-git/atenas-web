"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Layers, Mail, FolderArchive, BarChart3 } from "lucide-react";

const ITEMS = [
  { href: "/admin/admisiones", label: "Solicitudes", icon: FileText, exact: true },
  { href: "/admin/admisiones/metricas", label: "Métricas", icon: BarChart3, exact: false },
  { href: "/admin/admisiones/cupos", label: "Cupos", icon: Layers, exact: false },
  { href: "/admin/admisiones/correos", label: "Correos", icon: Mail, exact: false },
  { href: "/admin/admisiones/archivos-banco", label: "Banco de archivos", icon: FolderArchive, exact: false },
];

export function AdmisionesSubNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex items-center gap-1"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E4DD",
        borderRadius: 10,
        padding: 4,
        width: "fit-content",
      }}
    >
      {ITEMS.map((item) => {
        const Icon = item.icon;
        // «Solicitudes» es `exact` porque su href es prefijo del de todas las
        // demás: sin eso quedaría activa en Métricas, en Cupos y en el resto.
        // Pero eso dejaba `/admin/admisiones/nueva` sin ninguna pestaña
        // encendida, y es la única pantalla del módulo con la barra apagada.
        // Las rutas hijas que sí pertenecen a Solicitudes se nombran aquí.
        const HIJAS_DE_SOLICITUDES = ["/admin/admisiones/nueva"];
        const isActive = item.exact
          ? pathname === item.href ||
            (item.href === "/admin/admisiones" && HIJAS_DE_SOLICITUDES.includes(pathname))
          : pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 px-4 transition-all"
            style={{
              height: 34,
              background: isActive ? "#1A2B4A" : "transparent",
              color: isActive ? "#FFFFFF" : "#6B6660",
              borderRadius: 7,
              textDecoration: "none",
              fontSize: 14,
              fontWeight: isActive ? 600 : 500,
            }}
          >
            <Icon size={14} strokeWidth={2} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
