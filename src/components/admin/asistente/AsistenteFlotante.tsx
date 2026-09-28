"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LifeBuoy, X, Send, RotateCcw, BookOpen } from "lucide-react";
import { buscarEntrada } from "@/components/admin/mapaPantallas";
import { esRutaDeAdmisiones } from "@/lib/asistente/pantalla";
import { Inline } from "@/app/admin/(authenticated)/documentacion/Bloques";
import { leerPantalla } from "./leerPantalla";

/**
 * El botón «Ayuda» y su ventana. Vive en el layout del panel, así que se
 * mantiene abierto mientras el usuario navega de una pantalla a otra —que es
 * justo lo que hace quien sigue una guía paso a paso—.
 *
 * NO es modal a propósito: el usuario tiene que poder tocar la pantalla
 * mientras lee los pasos. Y no toca nada por él: solo pregunta a
 * `/api/asistente` y pinta lo que vuelve.
 *
 * El hilo se guarda en `sessionStorage` para sobrevivir a una recarga; se
 * borra al cerrar la pestaña. Nunca sale del navegador más que hacia la API.
 */

type Cita = { clave: string; titulo: string; seccion: string; href: string };

type Mensaje = {
  role: "user" | "assistant";
  content: string;
  citas?: Cita[];
};

/**
 * La clave lleva el id del usuario: en una computadora compartida —las hay en
 * secretaría— quien entre después no debe ver la conversación de quien salió,
 * ni enviarla como historial a su nombre. Lo cazó el auditor de cierre.
 */
const claveHilo = (usuarioId: string) => `asistente-panel:hilo:v1:${usuarioId}`;
const MAX_MENSAJES_GUARDADOS = 40;

function leerHilo(usuarioId: string): Mensaje[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(claveHilo(usuarioId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Mensaje[]).slice(-MAX_MENSAJES_GUARDADOS) : [];
  } catch {
    return [];
  }
}

function guardarHilo(usuarioId: string, mensajes: Mensaje[]) {
  try {
    const clave = claveHilo(usuarioId);
    if (mensajes.length === 0) window.sessionStorage.removeItem(clave);
    else window.sessionStorage.setItem(clave, JSON.stringify(mensajes.slice(-MAX_MENSAJES_GUARDADOS)));
  } catch {
    // Sin almacenamiento (modo privado, cuota): el hilo vive solo en memoria.
  }
}

export function AsistenteFlotante({ nombre, usuarioId }: { nombre: string; usuarioId: string }) {
  const pathname = usePathname();
  const entrada = buscarEntrada(pathname);
  const enAdmisiones = esRutaDeAdmisiones(pathname);

  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>(() => leerHilo(usuarioId));
  const [borrador, setBorrador] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [incluirPantalla, setIncluirPantalla] = useState(true);

  const areaRef = useRef<HTMLTextAreaElement>(null);
  const finRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    guardarHilo(usuarioId, mensajes);
  }, [usuarioId, mensajes]);

  // Solo en desarrollo: desde la consola del navegador,
  // `__asistenteLeerPantalla()` devuelve exactamente lo que se le mandaría
  // al asistente de esta pantalla. Es la forma de comprobar que no se cuela
  // ningún dato. En producción esta rama no existe.
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;
    (window as unknown as { __asistenteLeerPantalla?: () => unknown }).__asistenteLeerPantalla =
      () => leerPantalla(pathname);
  }, [pathname]);

  useEffect(() => {
    if (abierto) {
      areaRef.current?.focus();
      finRef.current?.scrollIntoView({ block: "end" });
    }
  }, [abierto]);

  useEffect(() => {
    finRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [mensajes, cargando]);

  const enviar = async (historial: Mensaje[]) => {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch("/api/asistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mensajes: historial.map(({ role, content }) => ({ role, content })),
          ruta: pathname,
          pantalla: incluirPantalla ? leerPantalla(pathname) : null,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        texto?: string;
        citas?: Cita[];
        error?: string;
      };
      if (!res.ok || !json.texto) {
        setError(json.error ?? "No hubo respuesta. Inténtalo de nuevo.");
        return;
      }
      setMensajes((prev) => [
        ...prev,
        { role: "assistant", content: json.texto ?? "", citas: json.citas ?? [] },
      ]);
    } catch {
      setError("No se pudo conectar con el asistente. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const preguntar = () => {
    const texto = borrador.trim();
    if (!texto || cargando) return;
    const siguiente: Mensaje[] = [...mensajes, { role: "user", content: texto }];
    setMensajes(siguiente);
    setBorrador("");
    void enviar(siguiente);
  };

  const reintentar = () => {
    if (cargando || mensajes.length === 0) return;
    if (mensajes[mensajes.length - 1].role !== "user") return;
    void enviar(mensajes);
  };

  const nuevaConversacion = () => {
    setMensajes([]);
    setError(null);
    setBorrador("");
    areaRef.current?.focus();
  };

  if (!abierto) {
    return (
      <button
        type="button"
        onClick={() => setAbierto(true)}
        data-asistente-panel
        aria-label="Abrir la ayuda del panel"
        data-ds-alto
        className="flex items-center gap-2 transition-opacity hover:opacity-90"
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          zIndex: 40,
          height: 44,
          padding: "0 18px 0 14px",
          background: "var(--ds-fondo-tarjeta)",
          color: "var(--ds-texto)",
          border: "1px solid var(--ds-borde-control)",
          borderRadius: "var(--ds-radio-full)",
          boxShadow: "var(--ds-sombra-flotante)",
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        <LifeBuoy size={18} strokeWidth={2} aria-hidden="true" />
        Ayuda
      </button>
    );
  }

  return (
    <section
      data-asistente-panel
      role="dialog"
      aria-modal="false"
      aria-label="Ayuda del panel"
      onKeyDown={(e) => {
        if (e.key === "Escape") setAbierto(false);
      }}
      className="flex flex-col"
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        zIndex: 40,
        width: 400,
        height: "min(640px, calc(100vh - 48px))",
        background: "var(--ds-fondo-tarjeta)",
        border: "1px solid var(--ds-borde)",
        borderRadius: "var(--ds-radio-lg)",
        boxShadow: "var(--ds-sombra-flotante)",
        overflow: "hidden",
      }}
    >
      {/* Cabecera */}
      <div
        className="flex items-start justify-between gap-2 px-4 py-3 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--ds-borde)" }}
      >
        <div className="min-w-0">
          <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--ds-texto)", margin: 0 }}>
            Ayuda del panel
          </h2>
          <p
            className="truncate"
            style={{ fontSize: 12, color: "var(--ds-texto-suave)", margin: "2px 0 0" }}
            title={entrada?.titulo}
          >
            Estás en: {entrada?.titulo ?? "una pantalla sin nombre"}
          </p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {mensajes.length > 0 && (
            <button
              type="button"
              onClick={nuevaConversacion}
              aria-label="Empezar una conversación nueva"
              title="Conversación nueva"
              style={botonIcono}
            >
              <RotateCcw size={16} strokeWidth={2} />
            </button>
          )}
          <button
            type="button"
            onClick={() => setAbierto(false)}
            aria-label="Cerrar la ayuda"
            title="Cerrar"
            style={botonIcono}
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Hilo */}
      <div
        className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3"
        style={{ background: "var(--ds-fondo-sutil)" }}
      >
        {mensajes.length === 0 && (
          <Burbuja role="assistant">
            <p style={parrafo}>
              Hola{nombre ? `, ${nombre}` : ""}. Pregúntame cómo hacer algo en el panel: te
              respondo con el manual y te digo dónde está cada cosa. No cambio nada por ti.
            </p>
          </Burbuja>
        )}

        {mensajes.map((m, i) => (
          <Burbuja key={i} role={m.role}>
            {m.role === "user" ? (
              <p style={{ ...parrafo, color: "var(--ds-texto-invertido)" }}>{m.content}</p>
            ) : (
              <>
                <Respuesta texto={m.content} />
                {m.citas && m.citas.length > 0 && (
                  <div className="flex flex-col gap-1" style={{ marginTop: 8 }}>
                    {m.citas.map((c) => (
                      <Link
                        key={c.clave}
                        href={c.href}
                        title={`Abrir en el manual: ${c.seccion} › ${c.titulo}`}
                        className="flex items-center gap-1.5"
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--ds-texto)",
                          textDecoration: "none",
                          background: "var(--ds-fondo-app)",
                          border: "1px solid var(--ds-borde)",
                          borderRadius: "var(--ds-radio-sm)",
                          padding: "4px 8px",
                          width: "fit-content",
                          maxWidth: "100%",
                        }}
                      >
                        <BookOpen size={12} strokeWidth={2.2} aria-hidden="true" />
                        <span className="truncate">
                          Manual › {c.seccion} › {c.titulo}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </Burbuja>
        ))}

        {cargando && (
          <Burbuja role="assistant">
            <p style={{ ...parrafo, color: "var(--ds-texto-suave)" }} aria-live="polite">
              Buscando en el manual…
            </p>
          </Burbuja>
        )}

        {error && (
          <div
            role="alert"
            className="flex flex-col gap-2 px-3 py-2"
            style={{
              background: "var(--ds-error-fondo)",
              border: "1px solid var(--ds-error-linea)",
              borderRadius: "var(--ds-radio-md)",
            }}
          >
            <p style={{ ...parrafo, fontSize: 13, color: "var(--ds-error-texto)" }}>{error}</p>
            {mensajes.length > 0 && mensajes[mensajes.length - 1].role === "user" && (
              <button
                type="button"
                onClick={reintentar}
                style={{
                  alignSelf: "flex-start",
                  height: 28,
                  padding: "0 10px",
                  background: "var(--ds-fondo-tarjeta)",
                  color: "var(--ds-texto)",
                  border: "1px solid var(--ds-borde-control)",
                  borderRadius: "var(--ds-radio-sm)",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Reintentar
              </button>
            )}
          </div>
        )}
        <div ref={finRef} />
      </div>

      {/* Entrada */}
      <div
        className="flex flex-col gap-2 px-4 py-3 flex-shrink-0"
        style={{ borderTop: "1px solid var(--ds-borde)" }}
      >
        <div className="flex items-end gap-2">
          <label className="flex-1 flex flex-col gap-1">
            <span className="ds-solo-lectores">Tu pregunta</span>
            <textarea
              ref={areaRef}
              value={borrador}
              onChange={(e) => setBorrador(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  preguntar();
                }
              }}
              rows={2}
              placeholder="¿Cómo hago para…?"
              disabled={cargando}
              style={{
                width: "100%",
                border: "1px solid var(--ds-borde)",
                borderRadius: "var(--ds-radio-sm)",
                padding: "8px 10px",
                fontSize: 14,
                lineHeight: 1.45,
                color: "var(--ds-texto)",
                background: "var(--ds-fondo-tarjeta)",
                outline: "none",
                resize: "none",
                fontFamily: "inherit",
              }}
            />
          </label>
          <button
            type="button"
            onClick={preguntar}
            disabled={cargando || borrador.trim() === ""}
            aria-label="Enviar la pregunta"
            title="Enviar (Intro)"
            data-ds-alto
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 38,
              height: 38,
              background: "var(--ds-accion)",
              color: "var(--ds-texto-invertido)",
              border: "none",
              borderRadius: "var(--ds-radio-sm)",
            }}
          >
            <Send size={16} strokeWidth={2.2} />
          </button>
        </div>
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <label className="flex items-center gap-2" style={{ fontSize: 12, color: "var(--ds-texto-suave)" }}>
            <input
              type="checkbox"
              checked={incluirPantalla}
              onChange={(e) => setIncluirPantalla(e.target.checked)}
              style={{ width: 14, height: 14 }}
            />
            Que vea los botones y campos de esta pantalla
          </label>
          {enAdmisiones && (
            <span style={{ fontSize: 12, color: "var(--ds-texto-suave)" }}>
              En Admisiones solo se envían botones y campos: ni títulos, ni avisos, ni datos.
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

/* ─── Piezas ────────────────────────────────────────────────────── */

function Burbuja({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) {
  const esUsuario = role === "user";
  return (
    <div
      className="flex"
      style={{ justifyContent: esUsuario ? "flex-end" : "flex-start" }}
    >
      <div
        style={{
          maxWidth: "88%",
          padding: "8px 12px",
          borderRadius: "var(--ds-radio-md)",
          background: esUsuario ? "var(--ds-accion)" : "var(--ds-fondo-tarjeta)",
          border: esUsuario ? "none" : "1px solid var(--ds-borde)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

const parrafo: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.55,
  color: "var(--ds-texto)",
  margin: 0,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

const botonIcono: React.CSSProperties = {
  width: 30,
  height: 30,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "transparent",
  border: "none",
  color: "var(--ds-texto-suave)",
  borderRadius: "var(--ds-radio-sm)",
};

/**
 * Pinta la respuesta del modelo: párrafos, listas numeradas y con viñetas, y
 * **negrita**, `código` y enlaces en línea (el mismo `Inline` del manual).
 * No es un intérprete de markdown completo, a propósito: el asistente escribe
 * corto y sin encabezados.
 */
function Respuesta({ texto }: { texto: string }) {
  const bloques = texto.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="flex flex-col gap-2">
      {bloques.map((bloque, i) => {
        const lineas = bloque.split("\n").map((l) => l.trim()).filter(Boolean);
        const numerada = lineas.every((l) => /^\d+[.)]\s+/.test(l));
        const vinetas = lineas.every((l) => /^[-•*]\s+/.test(l));

        if (numerada && lineas.length > 0) {
          return (
            // `listStyle` explícito: el preflight de Tailwind 4 pone
            // `list-style: none` a todas las listas y los pasos salían sin número.
            <ol key={i} className="flex flex-col gap-1.5" style={{ margin: 0, paddingLeft: 22, listStyle: "decimal" }}>
              {lineas.map((l, j) => (
                <li key={j} style={{ ...parrafo, whiteSpace: "normal" }}>
                  <Inline texto={l.replace(/^\d+[.)]\s+/, "")} soloEnlacesInternos />
                </li>
              ))}
            </ol>
          );
        }
        if (vinetas && lineas.length > 0) {
          return (
            <ul key={i} className="flex flex-col gap-1" style={{ margin: 0, paddingLeft: 18, listStyle: "disc" }}>
              {lineas.map((l, j) => (
                <li key={j} style={{ ...parrafo, whiteSpace: "normal" }}>
                  <Inline texto={l.replace(/^[-•*]\s+/, "")} soloEnlacesInternos />
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} style={{ ...parrafo, whiteSpace: "normal" }}>
            {lineas.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                <Inline texto={l} soloEnlacesInternos />
              </Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
