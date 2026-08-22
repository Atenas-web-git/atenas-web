"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, CornerDownRight } from "lucide-react";
import type { EntradaIndice } from "./contenido";

/** Quita tildes para que «admision» encuentre «admisión». */
function sinTildes(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Buscador de la documentación. Filtra el índice plano de artículos por
 * todas las palabras escritas (AND), no por la frase completa: así
 * "subir foto" encuentra el artículo aunque diga "subir una foto".
 */
export function BuscadorClient({ indice }: { indice: EntradaIndice[] }) {
  const [query, setQuery] = useState("");

  const terminos = useMemo(
    () => sinTildes(query.toLowerCase()).split(/\s+/).filter((t) => t.length > 1),
    [query]
  );

  const resultados = useMemo(() => {
    if (terminos.length === 0) return [];
    return indice
      .filter((e) => {
        const texto = sinTildes(e.texto);
        return terminos.every((t) => texto.includes(t));
      })
      .slice(0, 12);
  }, [indice, terminos]);

  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex items-center gap-2.5 px-4"
        style={{
          height: 46,
          background: "#FFFFFF",
          border: "1px solid #E8E4DD",
          borderRadius: 10,
        }}
      >
        <Search size={16} strokeWidth={2.5} color="#6B6660" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca aquí: «subir una foto», «cambiar el estado», «cupos», «correo no llega»…"
          className="bg-transparent outline-none w-full"
          style={{ fontSize: 14, color: "#1A2B4A", fontFamily: "inherit" }}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            style={{
              background: "transparent",
              border: "none",
              color: "#6B6660",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
              whiteSpace: "nowrap",
            }}
          >
            Limpiar
          </button>
        )}
      </div>

      {terminos.length > 0 && (
        <div
          className="flex flex-col"
          style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 10, overflow: "hidden" }}
        >
          {resultados.length === 0 ? (
            <p style={{ fontSize: 14, color: "#6B6660", margin: 0, padding: "16px 18px" }}>
              Nada coincide con «{query}». Prueba con menos palabras o revisa el índice de secciones.
            </p>
          ) : (
            resultados.map((r, i) => (
              <Link
                key={`${r.seccionSlug}-${r.articuloId}`}
                href={`/admin/documentacion/${r.seccionSlug}#${r.articuloId}`}
                className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-[#FAFAF8]"
                style={{
                  textDecoration: "none",
                  borderTop: i === 0 ? "none" : "1px solid #F1EEE8",
                }}
              >
                <CornerDownRight
                  size={14}
                  color="#9e1915"
                  strokeWidth={2.5}
                  style={{ flexShrink: 0, marginTop: 3 }}
                />
                <span className="flex flex-col gap-0.5 min-w-0">
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#1A2B4A" }}>
                    {r.titulo}
                  </span>
                  <span style={{ fontSize: 13, color: "#6B6660", lineHeight: 1.5 }}>
                    {r.resumen}
                  </span>
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: "#A0AABA",
                      textTransform: "uppercase",
                      letterSpacing: 0.6,
                      marginTop: 2,
                    }}
                  >
                    {r.seccionTitulo}
                  </span>
                </span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
