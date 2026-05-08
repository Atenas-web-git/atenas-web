"use client";

import { useEffect, useState } from "react";
import { X, ArrowRight } from "lucide-react";
import type { NotificacionPublica } from "@/lib/cms/getNotificaciones";

const STORAGE_PREFIX = "atenas-banner-cerrado-";

function nextNotCerrado(items: NotificacionPublica[]): NotificacionPublica | null {
  if (typeof window === "undefined") return items[0] ?? null;
  for (const item of items) {
    try {
      if (window.localStorage.getItem(STORAGE_PREFIX + item.id) !== "1") {
        return item;
      }
    } catch {
      return item;
    }
  }
  return null;
}

/**
 * Setea la CSS variable --banner-height en :root con la altura medida del
 * banner. El navbar (fixed) y el body usan esta variable para empujarse
 * hacia abajo sin tapar el contenido.
 */
function setBannerHeightVar(px: number) {
  if (typeof document === "undefined") return;
  document.documentElement.style.setProperty("--banner-height", `${px}px`);
}

export function BannerTop({
  items,
}: {
  items: NotificacionPublica[];
}) {
  const [active, setActive] = useState<NotificacionPublica | null>(null);
  const [bannerEl, setBannerEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    setActive(nextNotCerrado(items));
  }, [items]);

  // Reflejar la altura del banner en la CSS variable. Cuando se cierra,
  // resetear a 0px para que el navbar y el body vuelvan a su lugar.
  useEffect(() => {
    if (!active || !bannerEl) {
      setBannerHeightVar(0);
      return;
    }
    const update = () => {
      const h = bannerEl.getBoundingClientRect().height;
      setBannerHeightVar(Math.round(h));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(bannerEl);
    return () => {
      ro.disconnect();
    };
  }, [active, bannerEl]);

  // Cleanup en unmount
  useEffect(() => {
    return () => setBannerHeightVar(0);
  }, []);

  const close = () => {
    if (active) {
      try {
        window.localStorage.setItem(STORAGE_PREFIX + active.id, "1");
      } catch {}
    }
    setActive(nextNotCerrado(items.filter((i) => i.id !== active?.id)));
  };

  if (!active) return null;

  return (
    <div
      ref={setBannerEl}
      className="flex items-center justify-center gap-3 px-4 py-2"
      style={{
        background: active.prioridad > 0 ? "#1A2B4A" : "#0D1825",
        color: "#FFFFFF",
        fontFamily: "Poppins, sans-serif",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 60,
      }}
    >
      {active.prioridad > 0 && (
        <span style={{ fontSize: 14 }}>⚡</span>
      )}
      <div className="flex items-center gap-2 flex-wrap justify-center text-center">
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#FFFFFF",
          }}
        >
          {active.titulo}
        </span>
        {active.cta_texto && active.cta_url && (
          <a
            href={active.cta_url}
            className="flex items-center gap-1 transition-opacity hover:opacity-100"
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#C9A84C",
              textDecoration: "underline",
              opacity: 0.9,
            }}
          >
            {active.cta_texto}
            <ArrowRight size={11} strokeWidth={2.5} />
          </a>
        )}
      </div>
      <button
        type="button"
        onClick={close}
        aria-label="Cerrar aviso"
        className="absolute transition-opacity hover:opacity-100"
        style={{
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          width: 24,
          height: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          color: "#FFFFFF",
          border: "none",
          borderRadius: 4,
          cursor: "pointer",
          opacity: 0.7,
        }}
      >
        <X size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}
