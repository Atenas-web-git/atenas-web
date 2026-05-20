"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  FileText,
  Calendar,
  Trophy,
  File,
  ChevronRight,
  Loader2,
} from "lucide-react";

const ease: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

type ResultType =
  | "pagina"
  | "documento"
  | "evento"
  | "reconocimiento_categoria"
  | "reconocimiento_subcategoria"
  | "reconocimiento_logro";

type SearchResult = {
  type: ResultType;
  id: string;
  title: string;
  description: string;
  url: string;
  rank: number;
};

const TYPE_META: Record<
  ResultType,
  { label: string; Icon: typeof Search; color: string }
> = {
  pagina: { label: "Página", Icon: File, color: "var(--color-navy)" },
  documento: { label: "Documento", Icon: FileText, color: "var(--color-red)" },
  evento: { label: "Evento", Icon: Calendar, color: "var(--color-gold)" },
  reconocimiento_categoria: { label: "Reconocimientos", Icon: Trophy, color: "var(--color-gold)" },
  reconocimiento_subcategoria: { label: "Disciplina", Icon: Trophy, color: "var(--color-gold)" },
  reconocimiento_logro: { label: "Logro", Icon: Trophy, color: "var(--color-gold)" },
};

export function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus al abrir
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      // Reset al cerrar
      setQuery("");
      setResults([]);
      setSelectedIdx(0);
    }
  }, [open]);

  // Search en vivo con debounce
  useEffect(() => {
    if (!open) return;
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const handle = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal }
        );
        if (!res.ok) {
          setResults([]);
          return;
        }
        const json = (await res.json()) as { results?: SearchResult[] };
        setResults(json.results ?? []);
        setSelectedIdx(0);
      } catch (err) {
        if ((err as { name?: string })?.name !== "AbortError") {
          console.error("[search]", err);
        }
      } finally {
        setLoading(false);
      }
    }, 180);
    return () => {
      clearTimeout(handle);
      controller.abort();
    };
  }, [query, open]);

  const goTo = useCallback(
    (result: SearchResult) => {
      onClose();
      router.push(result.url);
    },
    [onClose, router]
  );

  // Teclado: Esc, flechas, Enter
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (results.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const r = results[selectedIdx];
        if (r) goTo(r);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, selectedIdx, goTo, onClose]);

  // Scroll al item seleccionado
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector<HTMLButtonElement>(
      `[data-idx="${selectedIdx}"]`
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIdx]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="search-overlay"
          className="fixed inset-0 z-[60] flex items-start justify-center pt-[10vh] px-4"
          style={{ background: "rgba(13, 24, 37, 0.72)", backdropFilter: "blur(6px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-[680px] rounded-[16px] overflow-hidden"
            style={{
              background: "#FFFFFF",
              boxShadow: "0 24px 80px rgba(13,24,37,0.3)",
              fontFamily: "Poppins, sans-serif",
            }}
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.22, ease }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input bar */}
            <div
              className="flex items-center gap-3 px-5"
              style={{ height: 68, borderBottom: "1px solid #E8E4DD" }}
            >
              {loading ? (
                <Loader2 size={22} className="text-navy animate-spin shrink-0" strokeWidth={2} />
              ) : (
                <Search size={22} className="text-navy shrink-0" strokeWidth={2} />
              )}
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar en el sitio…"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: 18,
                  color: "#1A2B4A",
                  fontFamily: "inherit",
                }}
              />
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar"
                className="flex items-center justify-center text-navy/60 hover:text-navy transition-colors shrink-0"
                style={{ width: 34, height: 34, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer" }}
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              className="overflow-y-auto"
              style={{ maxHeight: "60vh", padding: 8 }}
            >
              {query.trim().length < 2 ? (
                <EmptyState
                  hint='Escribe al menos 2 letras para empezar. Prueba "matrículas", "IB" o "valores".'
                />
              ) : !loading && results.length === 0 ? (
                <EmptyState
                  hint={`Sin resultados para "${query.trim()}".`}
                  variant="not-found"
                />
              ) : (
                results.map((r, i) => {
                  const meta = TYPE_META[r.type] ?? TYPE_META.pagina;
                  const Icon = meta.Icon;
                  const selected = i === selectedIdx;
                  return (
                    <button
                      key={`${r.type}-${r.id}-${i}`}
                      data-idx={i}
                      type="button"
                      onClick={() => goTo(r)}
                      onMouseEnter={() => setSelectedIdx(i)}
                      className="flex items-center gap-3 w-full text-left transition-colors"
                      style={{
                        padding: "12px 14px",
                        background: selected ? "#F4F1EB" : "transparent",
                        border: "none",
                        borderRadius: 10,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      <span
                        className="flex items-center justify-center shrink-0"
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 8,
                          background: "rgba(26,43,74,0.06)",
                        }}
                      >
                        <Icon size={16} color={meta.color} strokeWidth={2} />
                      </span>
                      <span className="flex flex-col gap-0.5 min-w-0 flex-1">
                        <span
                          className="truncate"
                          style={{ fontSize: 14, fontWeight: 600, color: "#1A2B4A" }}
                        >
                          {r.title}
                        </span>
                        <span
                          className="truncate"
                          style={{
                            fontSize: 11,
                            color: "rgba(26,43,74,0.55)",
                            letterSpacing: 0.3,
                          }}
                        >
                          <span style={{ color: meta.color, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                            {meta.label}
                          </span>
                          {r.description && (
                            <>
                              <span style={{ margin: "0 6px" }}>·</span>
                              <span>{r.description.slice(0, 80)}</span>
                            </>
                          )}
                        </span>
                      </span>
                      <ChevronRight size={14} className="text-navy/40 shrink-0" strokeWidth={2.5} />
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer atajos */}
            <div
              className="flex items-center justify-between gap-4 px-5 py-2.5"
              style={{ borderTop: "1px solid #E8E4DD", background: "#FAFAF8" }}
            >
              <div className="flex items-center gap-3 text-[10px]" style={{ color: "rgba(26,43,74,0.45)" }}>
                <span className="flex items-center gap-1">
                  <Kbd>↑</Kbd><Kbd>↓</Kbd> Navegar
                </span>
                <span className="flex items-center gap-1">
                  <Kbd>↵</Kbd> Abrir
                </span>
                <span className="flex items-center gap-1">
                  <Kbd>esc</Kbd> Cerrar
                </span>
              </div>
              <span style={{ fontSize: 10, color: "rgba(26,43,74,0.35)" }}>
                {results.length > 0 ? `${results.length} resultado${results.length === 1 ? "" : "s"}` : ""}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function EmptyState({
  hint,
  variant = "default",
}: {
  hint: string;
  variant?: "default" | "not-found";
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 px-6 text-center">
      <Search
        size={28}
        className={variant === "not-found" ? "text-red/60" : "text-navy/30"}
        strokeWidth={1.5}
      />
      <p style={{ fontSize: 13, color: "rgba(26,43,74,0.55)", maxWidth: 320 }}>{hint}</p>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 18,
        height: 18,
        padding: "0 4px",
        background: "#FFFFFF",
        border: "1px solid #E8E4DD",
        borderRadius: 4,
        fontSize: 10,
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        color: "#1A2B4A",
      }}
    >
      {children}
    </kbd>
  );
}
