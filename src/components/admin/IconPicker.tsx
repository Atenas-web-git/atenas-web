"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { DynamicIcon } from "lucide-react/dynamic";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import { Search, X, Check } from "lucide-react";

const ALL_ICON_NAMES: string[] = Object.keys(dynamicIconImports).sort();
const MAX_RESULTS = 120; // Limita el grid para perf. Si el query es vacío muestra los primeros N.

type Props = {
  value: string;
  onChange: (name: string) => void;
  label?: string;
  hint?: string;
};

/**
 * Selector de iconos Lucide con buscador libre. Usa DynamicIcon para
 * cargar cada icono solo al renderizarlo (no se importa todo el set).
 */
export function IconPicker({ value, onChange, label, hint }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_ICON_NAMES.slice(0, MAX_RESULTS);
    return ALL_ICON_NAMES.filter((name) => name.includes(q)).slice(0, MAX_RESULTS);
  }, [query]);

  const totalMatches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_ICON_NAMES.length;
    return ALL_ICON_NAMES.filter((name) => name.includes(q)).length;
  }, [query]);

  const selectIcon = (name: string) => {
    onChange(name);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      {label && (
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#6B6660",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {label}
        </span>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-3 w-full px-3 transition-opacity hover:opacity-80"
          style={{
            height: 44,
            background: "#FAFAF8",
            border: "1px solid #E8E4DD",
            borderRadius: 6,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          <span
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 32,
              height: 32,
              background: "rgba(158,25,21,0.12)",
              borderRadius: 8,
            }}
          >
            {value ? (
              <DynamicIcon name={value as never} size={18} color="#9e1915" strokeWidth={2} />
            ) : (
              <Search size={14} color="#A0AABA" strokeWidth={2} />
            )}
          </span>
          <span
            className="flex-1 text-left truncate"
            style={{
              fontSize: 14,
              color: value ? "#1A2B4A" : "#A0AABA",
              fontFamily: value ? "ui-monospace, SFMono-Regular, Menlo, monospace" : "inherit",
              fontWeight: value ? 500 : 400,
            }}
          >
            {value || "Selecciona un icono…"}
          </span>
          {value && (
            <span
              role="button"
              aria-label="Quitar icono"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  onChange("");
                }
              }}
              className="flex items-center justify-center transition-opacity hover:opacity-70 cursor-pointer"
              style={{
                width: 22,
                height: 22,
                background: "transparent",
                color: "#A0AABA",
                borderRadius: 4,
              }}
            >
              <X size={14} strokeWidth={2.5} />
            </span>
          )}
        </button>

        {open && (
          <div
            className="absolute z-20 left-0 right-0 top-full mt-1 flex flex-col"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8E4DD",
              borderRadius: 8,
              boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
              maxHeight: 380,
              overflow: "hidden",
            }}
          >
            <div
              className="flex items-center gap-2 px-3 py-2"
              style={{ borderBottom: "1px solid #E8E4DD" }}
            >
              <Search size={14} color="#A0AABA" strokeWidth={2} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar icono… (ej. shield, heart, star, scale)"
                autoFocus
                style={{
                  flex: 1,
                  height: 28,
                  border: "none",
                  outline: "none",
                  fontSize: 14,
                  color: "#1A2B4A",
                  background: "transparent",
                  fontFamily: "inherit",
                }}
              />
              <span style={{ fontSize: 11, color: "#A0AABA" }}>
                {totalMatches > MAX_RESULTS
                  ? `${MAX_RESULTS}+ resultados`
                  : `${totalMatches} ${totalMatches === 1 ? "icono" : "iconos"}`}
              </span>
            </div>

            <div
              className="grid p-3 gap-1.5 overflow-y-auto"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(48px, 1fr))",
                maxHeight: 320,
              }}
            >
              {filtered.length === 0 ? (
                <p
                  style={{
                    gridColumn: "1 / -1",
                    fontSize: 13,
                    color: "#6B6660",
                    margin: "12px 0",
                    textAlign: "center",
                  }}
                >
                  No hay iconos que coincidan con &ldquo;{query}&rdquo;.
                </p>
              ) : (
                filtered.map((name) => {
                  const isSelected = name === value;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => selectIcon(name)}
                      title={name}
                      className="flex items-center justify-center transition-colors"
                      style={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        background: isSelected ? "rgba(158,25,21,0.18)" : "transparent",
                        border: isSelected
                          ? "1.5px solid #9e1915"
                          : "1px solid #E8E4DD",
                        borderRadius: 6,
                        cursor: "pointer",
                        position: "relative",
                        fontFamily: "inherit",
                      }}
                    >
                      <DynamicIcon
                        name={name as never}
                        size={18}
                        color={isSelected ? "#9e1915" : "#1A2B4A"}
                        strokeWidth={2}
                      />
                      {isSelected && (
                        <span
                          className="absolute"
                          style={{
                            top: 2,
                            right: 2,
                            width: 12,
                            height: 12,
                            background: "#9e1915",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Check size={8} color="#FFFFFF" strokeWidth={3} />
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {hint && (
        <span style={{ fontSize: 11, color: "#A0AABA", lineHeight: 1.5 }}>
          {hint}
        </span>
      )}
    </div>
  );
}
