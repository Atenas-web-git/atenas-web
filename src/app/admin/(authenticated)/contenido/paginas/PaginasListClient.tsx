"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  FileEdit,
  Globe,
  Search,
} from "lucide-react";
import { PLANTILLAS } from "../plantillas";

type PaginaRow = {
  id: string;
  slug: string;
  titulo: string;
  plantilla: string;
  publicada: boolean;
  updated_at: string | null;
};

type Tab = { key: string; label: string; count: number; isActive: boolean; href: string };

type Group = {
  /** Clave del grupo: primer segmento del slug (ej. "el-atenas", "matriculas"). */
  key: string;
  /** Etiqueta visible (capitalizada). */
  label: string;
  paginas: PaginaRow[];
};

function formatDate(iso: string | null): string {
  if (!iso) return "Nunca";
  return new Date(iso).toLocaleDateString("es-EC", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function capitalize(s: string): string {
  return s
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
    .join(" ");
}

/** Agrupa páginas por el primer segmento del slug. Mantiene orden alfabético del grupo. */
function groupBySlugRoot(paginas: PaginaRow[]): Group[] {
  const map = new Map<string, PaginaRow[]>();
  for (const p of paginas) {
    const root = p.slug.split("/")[0] || p.slug;
    if (!map.has(root)) map.set(root, []);
    map.get(root)!.push(p);
  }
  // Ordenar las páginas dentro de cada grupo por slug ascendente, así la
  // landing del grupo (slug sin "/") queda primero por simple orden alfabético
  // (ej. "matriculas" < "matriculas/proceso").
  for (const list of map.values()) {
    list.sort((a, b) => a.slug.localeCompare(b.slug));
  }
  return Array.from(map.entries())
    .map(([key, paginas]) => ({
      key,
      label: capitalize(key),
      paginas,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

export function PaginasListClient({
  paginas,
  tabs,
}: {
  paginas: PaginaRow[];
  tabs: Tab[];
}) {
  const [query, setQuery] = useState("");
  // Estado por grupo: por defecto todos cerrados (entry vacía → !expanded[key] = true).
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtradas = q
      ? paginas.filter(
          (p) =>
            p.titulo.toLowerCase().includes(q) ||
            p.slug.toLowerCase().includes(q)
        )
      : paginas;
    return groupBySlugRoot(filtradas);
  }, [paginas, query]);

  const toggle = (key: string) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const totalVisibles = groups.reduce((sum, g) => sum + g.paginas.length, 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs (izq.) + buscador (der.) en la misma fila */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div
          className="flex items-center gap-1"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E8E4DD",
            borderRadius: 10,
            padding: 4,
          }}
        >
          {tabs.map((t) => (
            <Link
              key={t.key}
              href={t.href}
              className="flex items-center gap-2 px-4 transition-all"
              style={{
                height: 32,
                background: t.isActive ? "#1A2B4A" : "transparent",
                color: t.isActive ? "#FFFFFF" : "#6B6660",
                borderRadius: 7,
                textDecoration: "none",
                fontSize: 12,
                fontWeight: t.isActive ? 600 : 500,
              }}
            >
              {t.label}
              <span
                className="inline-flex items-center justify-center rounded-full"
                style={{
                  height: 18,
                  minWidth: 22,
                  paddingLeft: 6,
                  paddingRight: 6,
                  background: t.isActive ? "rgba(255,255,255,0.15)" : "#F4F1EB",
                  fontSize: 11,
                  fontWeight: 600,
                  color: t.isActive ? "#FFFFFF" : "#6B6660",
                }}
              >
                {t.count}
              </span>
            </Link>
          ))}
        </div>

        {/* Buscador */}
        <div
          className="flex items-center gap-2 px-3 rounded-md"
          style={{
            height: 38,
            background: "#FFFFFF",
            border: "1px solid #E8E4DD",
            minWidth: 280,
            maxWidth: 360,
            flex: "1 1 280px",
          }}
        >
          <Search size={14} strokeWidth={2.5} color="#6B6660" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por título o ruta…"
            className="bg-transparent outline-none w-full"
            style={{ fontSize: 13, color: "#1A2B4A" }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              style={{
                background: "transparent",
                border: "none",
                color: "#6B6660",
                fontSize: 11,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Resumen del filtro activo */}
      {query && (
        <p style={{ fontSize: 12, color: "#6B6660", margin: 0 }}>
          {totalVisibles} resultado{totalVisibles === 1 ? "" : "s"} en {groups.length}{" "}
          grupo{groups.length === 1 ? "" : "s"}
        </p>
      )}

      {/* Grupos */}
      {groups.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center py-16 px-6"
          style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
        >
          <p style={{ fontSize: 14, color: "#6B6660", margin: 0, textAlign: "center" }}>
            {query
              ? `Ninguna página coincide con "${query}".`
              : "No hay páginas que coincidan con los filtros."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {groups.map((group) => {
            // Si hay búsqueda activa, expandir automáticamente para ver los resultados.
            const isCollapsed = query.trim() ? false : !expanded[group.key];
            return (
              <div
                key={group.key}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid #E8E4DD",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                {/* Header del grupo (clickeable) */}
                <button
                  type="button"
                  onClick={() => toggle(group.key)}
                  className="flex items-center gap-3 w-full px-5 py-3 transition-opacity hover:opacity-80"
                  style={{
                    background: "#FAFAF8",
                    border: "none",
                    borderBottom: isCollapsed ? "none" : "1px solid #E8E4DD",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    textAlign: "left",
                  }}
                  aria-expanded={!isCollapsed}
                >
                  {isCollapsed ? (
                    <ChevronRight size={16} color="#6B6660" strokeWidth={2.5} />
                  ) : (
                    <ChevronDown size={16} color="#6B6660" strokeWidth={2.5} />
                  )}
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#1A2B4A",
                    }}
                  >
                    {group.label}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#6B6660",
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    }}
                  >
                    /{group.key}
                  </span>
                  <span
                    className="inline-flex items-center px-2 rounded-full ml-auto"
                    style={{
                      height: 20,
                      background: "#F4F1EB",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#6B6660",
                      letterSpacing: 0.3,
                    }}
                  >
                    {group.paginas.length} pág
                    {group.paginas.length === 1 ? "" : "s"}.
                  </span>
                </button>

                {/* Filas de páginas */}
                {!isCollapsed && (
                  <ul className="flex flex-col">
                    {group.paginas.map((p, i) => {
                      const tpl =
                        PLANTILLAS[p.plantilla as keyof typeof PLANTILLAS];
                      return (
                        <li
                          key={p.id}
                          className="flex items-center gap-3 px-6 py-4"
                          style={{
                            borderBottom:
                              i === group.paginas.length - 1
                                ? "none"
                                : "1px solid #F4F1EB",
                          }}
                        >
                          <Link
                            href={`/admin/contenido/paginas/${p.id}`}
                            className="flex items-center gap-4 flex-1 min-w-0 transition-opacity hover:opacity-80"
                            style={{ textDecoration: "none" }}
                          >
                            <div
                              className="flex items-center justify-center flex-shrink-0"
                              style={{
                                width: 36,
                                height: 36,
                                background: "#F4F1EB",
                                borderRadius: 8,
                              }}
                            >
                              <FileEdit
                                size={16}
                                color="#1A2B4A"
                                strokeWidth={2}
                              />
                            </div>
                            <div className="flex-1 flex flex-col gap-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span
                                  style={{
                                    fontSize: 14,
                                    fontWeight: 700,
                                    color: "#1A2B4A",
                                  }}
                                >
                                  {p.titulo}
                                </span>
                                <span
                                  className="inline-flex items-center px-2 rounded-full"
                                  style={{
                                    height: 20,
                                    background: p.publicada
                                      ? "#D1FAE5"
                                      : "#F4F1EB",
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: p.publicada ? "#065F46" : "#6B6660",
                                    letterSpacing: 0.3,
                                  }}
                                >
                                  {p.publicada ? "Publicada" : "Borrador"}
                                </span>
                                <span
                                  className="inline-flex items-center px-2 rounded-full"
                                  style={{
                                    height: 20,
                                    background: "#EFF6FF",
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: "#1E40AF",
                                    letterSpacing: 0.3,
                                  }}
                                  title={tpl?.nombre ?? p.plantilla}
                                >
                                  Plantilla {tpl?.letra ?? "?"}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 flex-wrap">
                                <code
                                  style={{
                                    fontSize: 11,
                                    color: "#6B6660",
                                    fontFamily:
                                      "ui-monospace, SFMono-Regular, Menlo, monospace",
                                  }}
                                >
                                  /{p.slug}
                                </code>
                                <span style={{ fontSize: 11, color: "#A0AABA" }}>
                                  ·
                                </span>
                                <span
                                  style={{ fontSize: 11, color: "#A0AABA" }}
                                >
                                  Editado {formatDate(p.updated_at)}
                                </span>
                              </div>
                            </div>
                            <ChevronRight
                              size={16}
                              color="#A0AABA"
                              strokeWidth={2}
                            />
                          </Link>
                          {p.publicada && (
                            <a
                              href={`/${p.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 px-2 transition-opacity hover:opacity-70 flex-shrink-0"
                              style={{
                                height: 28,
                                fontSize: 11,
                                color: "#C9A84C",
                                fontWeight: 600,
                                textDecoration: "none",
                                borderRadius: 4,
                              }}
                              title="Ver página pública"
                            >
                              <Globe size={11} strokeWidth={2.5} />
                              Ver pública
                            </a>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
