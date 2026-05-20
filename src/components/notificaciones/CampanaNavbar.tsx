"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, ArrowRight, X } from "lucide-react";
import type { NotificacionPublica } from "@/lib/cms/getNotificaciones";

const STORAGE_PREFIX = "atenas-notif-vista-";

/**
 * La campana se monta directamente desde Navbar (que es client component).
 * Para no cambiar la firma de Navbar ni pasarle props desde cada página
 * pública, este componente hace fetch al endpoint `/api/notificaciones/dropdown`
 * al montarse. La RLS de Supabase ya filtra por activa + rango de fechas.
 */

function isVista(id: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_PREFIX + id) === "1";
  } catch {
    return false;
  }
}

function marcarVista(id: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_PREFIX + id, "1");
  } catch {}
}

function formatRelative(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Ahora";
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `Hace ${diffHr} h`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `Hace ${diffDay} día${diffDay === 1 ? "" : "s"}`;
  return date.toLocaleDateString("es-EC", { day: "numeric", month: "short" });
}

export function CampanaNavbar() {
  const [items, setItems] = useState<NotificacionPublica[]>([]);
  const [open, setOpen] = useState(false);
  const [unseenCount, setUnseenCount] = useState(0);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  // Cargar notificaciones al montar (filtra por tipo dropdown)
  useEffect(() => {
    let cancelled = false;
    fetch("/api/notificaciones/visibles")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: NotificacionPublica[]) => {
        if (cancelled) return;
        const lista = Array.isArray(data)
          ? data.filter((n) => n.tipo === "dropdown")
          : [];
        setItems(lista);
        const seen = new Set<string>();
        let unseen = 0;
        for (const it of lista) {
          if (isVista(it.id)) {
            seen.add(it.id);
          } else {
            unseen++;
          }
        }
        setSeenIds(seen);
        setUnseenCount(unseen);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Cerrar al hacer click fuera
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Al abrir, marcar todas como vistas (después de un instante para que se vea el badge)
  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => {
      const newSeen = new Set(seenIds);
      for (const it of items) {
        if (!newSeen.has(it.id)) {
          marcarVista(it.id);
          newSeen.add(it.id);
        }
      }
      setSeenIds(newSeen);
      setUnseenCount(0);
    }, 600);
  };

  if (items.length === 0) {
    return null; // sin notificaciones, no mostrar campana
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => (open ? setOpen(false) : handleOpen())}
        aria-label="Notificaciones"
        className="flex items-center justify-center transition-opacity hover:opacity-70"
        style={{
          width: 36,
          height: 36,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          position: "relative",
        }}
      >
        <Bell size={18} color="var(--color-navy)" strokeWidth={2} />
        {unseenCount > 0 && (
          <span
            className="absolute"
            style={{
              top: 4,
              right: 4,
              minWidth: 16,
              height: 16,
              padding: "0 4px",
              background: "var(--color-gold)",
              color: "#FFFFFF",
              borderRadius: 8,
              fontSize: 9,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              letterSpacing: 0,
              fontFamily: "Poppins, sans-serif",
            }}
          >
            {unseenCount > 9 ? "9+" : unseenCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 z-[60] flex flex-col"
          style={{
            top: "100%",
            width: 360,
            maxWidth: "calc(100vw - 32px)",
            background: "#FFFFFF",
            border: "1px solid #E8E4DD",
            borderRadius: 12,
            boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
            overflow: "hidden",
            fontFamily: "Poppins, sans-serif",
          }}
        >
          <div
            className="flex items-center justify-between px-5 py-3"
            style={{
              borderBottom: "1px solid #E8E4DD",
              background: "#FAFAF8",
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-navy)" }}>
              Notificaciones
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              style={{
                width: 22,
                height: 22,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: "none",
                color: "#A0AABA",
                cursor: "pointer",
                borderRadius: 4,
              }}
            >
              <X size={14} strokeWidth={2.5} />
            </button>
          </div>

          <ul
            className="flex flex-col"
            style={{ maxHeight: 480, overflowY: "auto" }}
          >
            {items.map((n, i) => (
              <li
                key={n.id}
                className="flex flex-col gap-2 px-5 py-4"
                style={{
                  borderBottom: i === items.length - 1 ? "none" : "1px solid #E8E4DD",
                  background: n.prioridad > 0 ? "#FFFCF5" : "#FFFFFF",
                }}
              >
                <div className="flex items-start gap-2">
                  {n.prioridad > 0 && (
                    <span style={{ fontSize: 14 }} title="Anuncio importante">
                      ⚡
                    </span>
                  )}
                  <h4
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--color-navy)",
                      margin: 0,
                      lineHeight: 1.3,
                      flex: 1,
                    }}
                  >
                    {n.titulo}
                  </h4>
                </div>

                {n.contenido_html && (
                  <div
                    className="text-[#374151]"
                    style={{
                      fontSize: 12,
                      lineHeight: 1.55,
                    }}
                    dangerouslySetInnerHTML={{ __html: n.contenido_html }}
                  />
                )}

                <div className="flex items-center gap-2 justify-between">
                  <span style={{ fontSize: 10, color: "#A0AABA" }}>
                    {formatRelative(n.fecha_inicio)}
                  </span>
                  {n.cta_texto && n.cta_url && (
                    <a
                      href={n.cta_url}
                      className="flex items-center gap-1 transition-opacity hover:opacity-70"
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "var(--color-gold)",
                        textDecoration: "none",
                      }}
                    >
                      {n.cta_texto}
                      <ArrowRight size={11} strokeWidth={2.5} />
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
