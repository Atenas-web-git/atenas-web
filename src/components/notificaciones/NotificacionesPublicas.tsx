"use client";

import { useEffect, useState } from "react";
import { BannerTop } from "./BannerTop";
import { PopupBienvenida } from "./PopupBienvenida";
import type { NotificacionPublica } from "@/lib/cms/getNotificaciones";

/**
 * Wrapper cliente que monta BannerTop + PopupBienvenida.
 *
 * Hace fetch al endpoint público `/api/notificaciones/visibles` (cuyo
 * response se cachea, así que no es duplicado con la campana del navbar)
 * y filtra por tipo. Si no hay notificaciones, no renderiza nada.
 */
export function NotificacionesPublicas() {
  const [items, setItems] = useState<NotificacionPublica[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/notificaciones/visibles")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: NotificacionPublica[]) => {
        if (cancelled) return;
        setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const banners = items.filter((n) => n.tipo === "banner_top");
  const popups = items.filter((n) => n.tipo === "popup");

  return (
    <>
      {banners.length > 0 && <BannerTop items={banners} />}
      {popups.length > 0 && <PopupBienvenida items={popups} />}
    </>
  );
}
