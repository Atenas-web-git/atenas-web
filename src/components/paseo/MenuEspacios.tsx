"use client";

import { useEffect, useRef } from "react";
import { Check, LayoutGrid, X } from "lucide-react";
import type { EscenaPaseo } from "@/lib/paseo/getPaseo";

/**
 * El menú de espacios del campus.
 *
 * El tour de 2016 tenía una barra con las siete zonas, y sin ella el visitante
 * solo puede avanzar de un espacio a otro por los accesos: para ir del bar a la
 * biblioteca había que atravesar medio colegio. Esto es lo mismo, pero legible
 * en un celular.
 *
 * Sustituye a la galería que trae el visor: mostraba miniaturas sin nombre, sin
 * agrupar y con los textos en inglés. Dos formas de hacer lo mismo confunden,
 * así que hay una.
 */
export function MenuEspacios({
  escenas,
  actual,
  abierto,
  onAbrir,
  onIr,
}: {
  escenas: EscenaPaseo[];
  actual: string | null;
  abierto: boolean;
  onAbrir: (v: boolean) => void;
  onIr: (slug: string) => void;
}) {
  const panel = useRef<HTMLDivElement>(null);

  // Escape cierra, como cualquier capa que tape contenido.
  useEffect(() => {
    if (!abierto) return;
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === "Escape") onAbrir(false);
    };
    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  }, [abierto, onAbrir]);

  // Al abrirlo, el foco entra en el panel: quien navega con teclado no tiene
  // que recorrer toda la página para llegar hasta aquí.
  useEffect(() => {
    if (abierto) panel.current?.focus();
  }, [abierto]);

  const zonas: { nombre: string; espacios: EscenaPaseo[] }[] = [];
  for (const e of escenas) {
    const ultima = zonas[zonas.length - 1];
    if (ultima && ultima.nombre === e.grupo) ultima.espacios.push(e);
    else zonas.push({ nombre: e.grupo, espacios: [e] });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => onAbrir(!abierto)}
        aria-expanded={abierto}
        className="inline-flex items-center gap-2"
        style={{
          position: "absolute",
          top: 12,
          left: 12,
          zIndex: 94,
          minHeight: 44,
          padding: "0 1rem",
          borderRadius: 999,
          border: "1px solid rgba(248,245,240,.35)",
          background: "rgba(13,24,37,.82)",
          color: "#F8F5F0",
          fontSize: "1rem",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        <LayoutGrid size={18} strokeWidth={2.5} />
        Espacios
      </button>

      {abierto && (
        <div
          ref={panel}
          tabIndex={-1}
          role="dialog"
          aria-label="Espacios del campus"
          style={{
            position: "absolute",
            zIndex: 96,
            top: 0,
            bottom: 0,
            left: 0,
            width: "min(22rem, 86vw)",
            overflowY: "auto",
            padding: "1rem 1rem 2rem",
            background: "rgba(13,24,37,.94)",
            color: "#F8F5F0",
            boxShadow: "0 0 40px rgba(0,0,0,.35)",
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: ".75rem" }}>
            <h3 style={{ margin: 0, fontSize: "1.0625rem", fontWeight: 700 }}>Espacios del campus</h3>
            <button
              type="button"
              onClick={() => onAbrir(false)}
              aria-label="Cerrar la lista de espacios"
              style={{
                minWidth: 44,
                minHeight: 44,
                display: "grid",
                placeItems: "center",
                background: "transparent",
                border: 0,
                color: "#F8F5F0",
                cursor: "pointer",
              }}
            >
              <X size={20} strokeWidth={2.5} />
            </button>
          </div>

          {zonas.map((zona) => (
            <section key={zona.nombre} style={{ marginBottom: "1.25rem" }}>
              <h4
                style={{
                  margin: "0 0 .375rem",
                  fontSize: ".8125rem",
                  fontWeight: 700,
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                  opacity: 0.75,
                }}
              >
                {zona.nombre}
              </h4>

              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {zona.espacios.map((e) => {
                  const aqui = e.slug === actual;
                  return (
                    <li key={e.slug}>
                      <button
                        type="button"
                        onClick={() => onIr(e.slug)}
                        aria-current={aqui ? "true" : undefined}
                        className="flex items-center gap-3 w-full text-left"
                        style={{
                          minHeight: 48,
                          padding: ".375rem .5rem",
                          borderRadius: 8,
                          border: 0,
                          background: aqui ? "rgba(248,245,240,.14)" : "transparent",
                          color: "#F8F5F0",
                          fontSize: "1rem",
                          fontWeight: aqui ? 600 : 400,
                          cursor: "pointer",
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`${e.imagenes}/thumbnail.webp`}
                          alt=""
                          width={56}
                          height={28}
                          loading="lazy"
                          style={{ borderRadius: 4, objectFit: "cover", flexShrink: 0, background: "#1A2B4A" }}
                        />
                        <span style={{ flex: 1 }}>{e.titulo}</span>
                        {aqui && <Check size={16} strokeWidth={3} aria-label="Estás aquí" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
