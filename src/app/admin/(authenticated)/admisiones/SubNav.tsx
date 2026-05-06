"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Layers, Mail } from "lucide-react";

const ITEMS = [
  { href: "/admin/admisiones", label: "Solicitudes", icon: FileText, exact: true },
  { href: "/admin/admisiones/cupos", label: "Cupos", icon: Layers, exact: false },
  { href: "/admin/admisiones/correos", label: "Correos", icon: Mail, exact: false },
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
        const isActive = item.exact
          ? pathname === item.href
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
              fontSize: 13,
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
