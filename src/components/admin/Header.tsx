"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import type { AdminUser } from "@/lib/auth/types";
import { buscarEntrada, construirMigas } from "./mapaPantallas";

/**
 * Cabecera del backoffice: dice dónde estás y cómo volver.
 *
 * El mapa de todas las pantallas —título, subtítulo y cómo se resuelve una ruta
 * con :parámetros— vive en `mapaPantallas.ts`, sin "use client", porque desde
 * el 2026-09-27 también lo lee el asistente del panel desde el servidor para
 * saber en qué pantalla está quien pregunta.
 */
export function Header({ user }: { user: AdminUser }) {
  const pathname = usePathname();
  const entrada = buscarEntrada(pathname);
  const titulo = entrada?.titulo ?? "Backoffice";
  const subtitulo = entrada?.subtitulo ?? "";
  const migas = construirMigas(pathname);

  const firstName = user.fullName.split(/\s+/)[0] || user.email;
  const esDashboard = pathname === "/admin";

  return (
    <header
      className="flex items-center justify-between px-8 flex-shrink-0"
      style={{
        // Con migas la cabecera necesita algo más de aire; sin ellas se queda
        // como estaba para no mover el resto de pantallas.
        minHeight: 64,
        paddingTop: migas.length > 0 ? 10 : 0,
        paddingBottom: migas.length > 0 ? 10 : 0,
        background: "#FFFFFF",
        borderBottom: "1px solid #E8E4DD",
      }}
    >
      <div className="flex flex-col gap-0.5 min-w-0">
        {migas.length > 0 && (
          <nav
            aria-label="Ruta de navegación"
            className="flex items-center gap-1 flex-wrap"
            style={{ marginBottom: 2 }}
          >
            <Link
              href="/admin"
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "#6B6660",
                textDecoration: "none",
              }}
            >
              Inicio
            </Link>
            {migas.map((miga) => (
              <span key={miga.etiqueta} className="flex items-center gap-1">
                {/* Separador puramente decorativo: el orden ya lo dice el espaciado.
                    Va oculto a los lectores de pantalla y en un gris que se ve
                    (3.66:1), no en el gris claro de antes. */}
                <ChevronRight size={12} color="#8A857E" aria-hidden="true" />
                {miga.href ? (
                  <Link
                    href={miga.href}
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "#6B6660",
                      textDecoration: "none",
                    }}
                  >
                    {miga.etiqueta}
                  </Link>
                ) : (
                  /* Mismo color que las demás, a propósito. Lo que distingue a un
                     tramo sin página propia es que no responde al ratón, no que
                     esté más claro: #A0AABA sobre blanco da 2.35:1 y a 11px eso
                     no se lee. */
                  <span style={{ fontSize: 12, fontWeight: 500, color: "#6B6660" }}>
                    {miga.etiqueta}
                  </span>
                )}
              </span>
            ))}
          </nav>
        )}

        <h1
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#1A2B4A",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {titulo}
        </h1>
        <p
          style={{
            fontSize: 13,
            fontWeight: 400,
            color: "#6B6660",
            margin: 0,
          }}
        >
          {esDashboard ? `Hola ${firstName}, esto es lo que pasa hoy.` : subtitulo}
        </p>
      </div>
    </header>
  );
}
