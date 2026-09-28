"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LifeBuoy,
  X,
  Send,
  RotateCcw,
  BookOpen,
  Mic,
  ImagePlus,
  Paperclip,
  MousePointerClick,
} from "lucide-react";
import { buscarEntrada } from "@/components/admin/mapaPantallas";
import { esRutaDeAdmisiones } from "@/lib/asistente/pantalla";
import { capturasBloqueadas, AVISO_SIN_CAPTURAS } from "@/lib/asistente/captura";
import { SENAL_MARCA, nombreDeSenal } from "@/lib/asistente/senales";
import { Inline } from "@/app/admin/(authenticated)/documentacion/Bloques";
import { leerPantalla } from "./leerPantalla";
import { buscarControl, iluminar } from "./senalar";
import { useDictado } from "./dictado";
import { prepararCaptura, imagenDelPortapapeles } from "./prepararCaptura";

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
 *
 * Etapa 2 (2026-09-28): se puede pegar, soltar o elegir una captura de
 * pantalla —nunca donde haya datos de personas: `capturasBloqueadas()`—,
 * dictar la pregunta con el micrófono del navegador, y las respuestas señalan
 * en la pantalla el control del que hablan. Las capturas viven solo en
 * memoria: no van al `sessionStorage`.
 */

type Cita = { clave: string; titulo: string; seccion: string; href: string };

type Mensaje = {
  role: "user" | "assistant";
  content: string;
  citas?: Cita[];
  /** Data URL de la captura. Solo en memoria: al recargar queda `conCaptura`. */
  captura?: string;
  conCaptura?: boolean;
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
    if (mensajes.length === 0) {
      window.sessionStorage.removeItem(clave);
      return;
    }
    // Sin la imagen: pesa cientos de KB y la cuota del almacenamiento es de
    // unos 5 MB. Queda el hecho de que la hubo, para pintarlo.
    const ligeros = mensajes.slice(-MAX_MENSAJES_GUARDADOS).map(({ captura, ...m }) => ({
      ...m,
      ...(captura || m.conCaptura ? { conCaptura: true } : {}),
    }));
    window.sessionStorage.setItem(clave, JSON.stringify(ligeros));
  } catch {
    // Sin almacenamiento (modo privado, cuota): el hilo vive solo en memoria.
  }
}

function juntar(base: string, dictado: string): string {
  const b = base.trimEnd();
  const d = dictado.trim();
  if (!d) return b;
  return b ? `${b} ${d}` : d;
}

export function AsistenteFlotante({ nombre, usuarioId }: { nombre: string; usuarioId: string }) {
  const pathname = usePathname();
  const entrada = buscarEntrada(pathname);
  const enAdmisiones = esRutaDeAdmisiones(pathname);
  // Más amplio que Admisiones: también el Inicio (últimas solicitudes con
  // nombre) y las respuestas de formularios. Una captura son píxeles.
  const sinCapturas = capturasBloqueadas(pathname);

  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>(() => leerHilo(usuarioId));
  const [borrador, setBorrador] = useState("");
  const [captura, setCaptura] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [incluirPantalla, setIncluirPantalla] = useState(true);

  const areaRef = useRef<HTMLTextAreaElement>(null);
  const archivoRef = useRef<HTMLInputElement>(null);
  const finRef = useRef<HTMLDivElement>(null);

  // Lo que había escrito al pulsar el micrófono: el dictado se añade detrás.
  const baseDictado = useRef("");
  const dictado = useDictado((final, provisional) => {
    setBorrador(juntar(baseDictado.current, final + provisional));
  });

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

  // Una captura adjuntada en otra pantalla no puede entrar a una bloqueada.
  useEffect(() => {
    if (sinCapturas && captura) {
      setCaptura(null);
      setAviso("Al cambiar de pantalla se quitó la captura: aquí no se envían.");
    }
  }, [sinCapturas, captura]);

  // El micrófono no sigue abierto de una pantalla a otra: quien dicta, se va a
  // una ficha de admisión y atiende una llamada, no tiene por qué encontrarse
  // esa conversación transcrita en el borrador. Lo cazó el auditor de
  // seguridad. `parar` es estable (useCallback), así que solo dispara con la ruta.
  const pararDictado = dictado.parar;
  const limpiarErrorDictado = dictado.limpiarError;
  useEffect(() => {
    pararDictado();
    // Y el aviso del micrófono no acompaña al usuario de pantalla en pantalla:
    // el hook vive en el layout y sin esto se quedaba fijo para siempre.
    limpiarErrorDictado();
  }, [pathname, pararDictado, limpiarErrorDictado]);

  const adjuntar = async (archivo: Blob) => {
    if (sinCapturas) {
      setAviso(AVISO_SIN_CAPTURAS);
      return;
    }
    try {
      setCaptura(await prepararCaptura(archivo));
      setAviso(null);
      areaRef.current?.focus();
    } catch (e) {
      setAviso(e instanceof Error ? e.message : "No se pudo leer la imagen.");
    }
  };

  const enviar = async (historial: Mensaje[]) => {
    setCargando(true);
    setError(null);
    try {
      const ultimo = historial[historial.length - 1];
      const res = await fetch("/api/asistente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mensajes: historial.map(({ role, content }) => ({ role, content })),
          ruta: pathname,
          pantalla: incluirPantalla ? leerPantalla(pathname) : null,
          // Solo la del último mensaje: las anteriores ya se cobraron una vez.
          captura: ultimo.role === "user" && !sinCapturas ? (ultimo.captura ?? null) : null,
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
    const texto = borrador.trim() || (captura ? "Te adjunto una captura de lo que veo." : "");
    if (!texto || cargando) return;
    dictado.parar();
    dictado.limpiarError();
    const siguiente: Mensaje[] = [
      ...mensajes,
      { role: "user", content: texto, ...(captura ? { captura } : {}) },
    ];
    setMensajes(siguiente);
    setBorrador("");
    setCaptura(null);
    setAviso(null);
    void enviar(siguiente);
  };

  const reintentar = () => {
    if (cargando || mensajes.length === 0) return;
    if (mensajes[mensajes.length - 1].role !== "user") return;
    void enviar(mensajes);
  };

  const nuevaConversacion = () => {
    dictado.parar();
    dictado.limpiarError();
    setMensajes([]);
    setError(null);
    setAviso(null);
    setBorrador("");
    setCaptura(null);
    areaRef.current?.focus();
  };

  const cerrar = () => {
    dictado.parar();
    dictado.limpiarError();
    setAviso(null);
    setAbierto(false);
  };

  const alternarDictado = () => {
    if (!dictado.escuchando) baseDictado.current = borrador;
    setAviso(null);
    dictado.alternar();
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

  const avisoVisible = aviso ?? dictado.error;
  const puedeEnviar = !cargando && (borrador.trim() !== "" || captura !== null);

  return (
    <section
      data-asistente-panel
      role="dialog"
      aria-modal="false"
      aria-label="Ayuda del panel"
      onKeyDown={(e) => {
        if (e.key === "Escape") cerrar();
      }}
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes("Files")) e.preventDefault();
      }}
      onDrop={(e) => {
        const archivo = e.dataTransfer.files?.[0];
        if (!archivo) return;
        e.preventDefault();
        void adjuntar(archivo);
      }}
      className="flex flex-col"
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        zIndex: 40,
        // Nunca más ancho que la pantalla: con 400 px fijos, en un teléfono de
        // 375 px el botón de captura quedaba fuera del borde (auditor de UX,
        // 2026-09-28). Mismo margen a los dos lados que el `right`.
        width: "min(400px, calc(100vw - 48px))",
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
            onClick={cerrar}
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
              {sinCapturas ? "" : " Si algo te sale raro, pégame una captura."}
              {dictado.disponible ? " También puedes dictar con el micrófono." : ""}
            </p>
          </Burbuja>
        )}

        {mensajes.map((m, i) => (
          <Burbuja key={i} role={m.role}>
            {m.role === "user" ? (
              <>
                {m.captura ? (
                  // eslint-disable-next-line @next/next/no-img-element -- data URL en memoria, no una imagen del sitio
                  <img
                    src={m.captura}
                    alt="Captura adjunta a la pregunta"
                    style={{
                      display: "block",
                      maxWidth: "100%",
                      maxHeight: 160,
                      borderRadius: 6,
                      marginBottom: 6,
                      background: "var(--ds-blanco)",
                    }}
                  />
                ) : m.conCaptura ? (
                  <span
                    className="flex items-center gap-1"
                    style={{
                      fontSize: 12,
                      color: "var(--ds-texto-invertido)",
                      opacity: 0.85,
                      marginBottom: 4,
                    }}
                  >
                    <Paperclip size={12} aria-hidden="true" />
                    Captura adjunta (no se conserva al recargar)
                  </span>
                ) : null}
                <p style={{ ...parrafo, color: "var(--ds-texto-invertido)" }}>{m.content}</p>
              </>
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
        {captura && (
          <div
            className="flex items-center gap-2"
            style={{
              padding: 6,
              background: "var(--ds-fondo-sutil)",
              border: "1px solid var(--ds-borde)",
              borderRadius: "var(--ds-radio-sm)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- data URL en memoria */}
            <img
              src={captura}
              alt=""
              style={{
                width: 64,
                height: 44,
                objectFit: "cover",
                borderRadius: 4,
                border: "1px solid var(--ds-borde)",
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 12, color: "var(--ds-texto-suave)", flex: 1, lineHeight: 1.4 }}>
              Captura lista para enviar. Mira que no muestre datos de una familia.
            </span>
            <button
              type="button"
              onClick={() => setCaptura(null)}
              aria-label="Quitar la captura"
              title="Quitar la captura"
              style={botonIcono}
            >
              <X size={14} strokeWidth={2} />
            </button>
          </div>
        )}

        <div className="flex items-end gap-1.5">
          {!sinCapturas && (
            <>
              <input
                ref={archivoRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const archivo = e.target.files?.[0];
                  e.target.value = "";
                  if (archivo) void adjuntar(archivo);
                }}
              />
              <button
                type="button"
                onClick={() => archivoRef.current?.click()}
                disabled={cargando}
                aria-label="Adjuntar una captura de pantalla"
                title="Adjuntar una captura (o pégala con Ctrl + V)"
                style={botonEntrada}
              >
                <ImagePlus size={17} strokeWidth={2} />
              </button>
            </>
          )}
          {dictado.disponible && (
            <button
              type="button"
              onClick={alternarDictado}
              disabled={cargando}
              aria-pressed={dictado.escuchando}
              aria-label={dictado.escuchando ? "Parar el dictado" : "Dictar la pregunta"}
              title={dictado.escuchando ? "Parar el dictado" : "Dictar la pregunta con el micrófono"}
              style={
                dictado.escuchando
                  ? {
                      ...botonEntrada,
                      background: "var(--ds-error-fondo)",
                      color: "var(--ds-rojo)",
                      // `border` entero y no `borderColor`: React avisa si se
                      // mezcla la forma corta con una larga en el mismo estilo.
                      border: "1px solid var(--ds-error-linea)",
                    }
                  : botonEntrada
              }
            >
              <Mic size={17} strokeWidth={2} />
            </button>
          )}
          <label className="flex-1 flex flex-col gap-1 min-w-0">
            <span className="ds-solo-lectores">Tu pregunta</span>
            <textarea
              ref={areaRef}
              value={borrador}
              onChange={(e) => {
                setBorrador(e.target.value);
                if (aviso) setAviso(null);
              }}
              onPaste={(e) => {
                const archivo = imagenDelPortapapeles(e.nativeEvent);
                if (!archivo) return;
                e.preventDefault();
                void adjuntar(archivo);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  preguntar();
                }
              }}
              rows={2}
              placeholder={
                dictado.escuchando
                  ? "Escuchando… vuelve a pulsar el micrófono para parar."
                  : "¿Cómo hago para…?"
              }
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
            disabled={!puedeEnviar}
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

        {avisoVisible && (
          <p role="status" style={{ fontSize: 12, color: "var(--ds-aviso-texto)", margin: 0, lineHeight: 1.45 }}>
            {avisoVisible}
          </p>
        )}

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
          {enAdmisiones ? (
            <span style={{ fontSize: 12, color: "var(--ds-texto-suave)" }}>
              En Admisiones solo se envían botones y campos: ni títulos, ni avisos, ni datos, ni
              capturas.
            </span>
          ) : sinCapturas ? (
            <span style={{ fontSize: 12, color: "var(--ds-texto-suave)" }}>
              En esta pantalla no se envían capturas: muestra datos de personas.
            </span>
          ) : null}
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

/** Los botones de captura y micrófono, a la altura del de enviar. */
const botonEntrada: React.CSSProperties = {
  width: 38,
  height: 38,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  background: "var(--ds-fondo-tarjeta)",
  color: "var(--ds-texto-suave)",
  border: "1px solid var(--ds-borde-control)",
  borderRadius: "var(--ds-radio-sm)",
};

/**
 * Un control que la respuesta señala: se pinta como etiqueta con cursor y, al
 * hacer clic, `senalar.ts` lo ilumina en la pantalla. El servidor solo deja
 * pasar señales a controles que estaban en la estructura enviada; aun así el
 * usuario puede haber cambiado de pantalla, y entonces se le dice.
 */
function Senal({ nombre }: { nombre: string }) {
  const [noEsta, setNoEsta] = useState(false);
  const senalar = () => {
    const el = buscarControl(nombre);
    if (el) {
      iluminar(el);
      setNoEsta(false);
    } else {
      setNoEsta(true);
      setTimeout(() => setNoEsta(false), 3000);
    }
  };
  return (
    <button
      type="button"
      onClick={senalar}
      aria-label={`Señalar «${nombre}» en la pantalla`}
      title={noEsta ? "Ahora no está en esta pantalla" : "Mostrar dónde está en la pantalla"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        verticalAlign: "baseline",
        padding: "0 7px",
        margin: "0 1px",
        height: 22,
        background: "var(--ds-fondo-app)",
        color: "var(--ds-accion)",
        border: "1px solid var(--ds-accion)",
        borderRadius: "var(--ds-radio-full)",
        fontFamily: "inherit",
        fontSize: 13,
        fontWeight: 700,
        lineHeight: 1,
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      <MousePointerClick size={12} strokeWidth={2.2} aria-hidden="true" />
      {nombre}
      {noEsta && <span style={{ fontWeight: 400 }}>· ahora no está aquí</span>}
    </button>
  );
}

/** Una línea de la respuesta: texto en línea con las señales intercaladas. */
function Linea({ texto }: { texto: string }) {
  const partes = texto.split(SENAL_MARCA).filter((p) => p !== "");
  return (
    <>
      {partes.map((parte, i) =>
        parte.startsWith("[[señalar:") ? (
          <Senal key={i} nombre={nombreDeSenal(parte)} />
        ) : (
          <Inline key={i} texto={parte} soloEnlacesInternos />
        )
      )}
    </>
  );
}

/**
 * Pinta la respuesta del modelo: párrafos, listas numeradas y con viñetas, y
 * **negrita**, `código` y enlaces en línea (el mismo `Inline` del manual),
 * más las señales `[[señalar:…]]`. No es un intérprete de markdown completo,
 * a propósito: el asistente escribe corto y sin encabezados.
 */
type Tramo = { tipo: "numerada" | "vinetas" | "parrafo"; lineas: string[] };

const NUMERO = /^\d+[.)]\s+/;
const VINETA = /^[-•*]\s+/;

/**
 * Agrupa las líneas de un bloque por su clase: un párrafo de entrada seguido
 * de pasos numerados sin línea en blanco entre medias («Pasos para actuar:
 * 1. Busca…») pintaba todo como párrafo, con los números en el texto. Medido
 * el 2026-09-28 con una respuesta a una captura.
 */
function partirEnTramos(lineas: string[]): Tramo[] {
  const tramos: Tramo[] = [];
  for (const l of lineas) {
    const tipo: Tramo["tipo"] = NUMERO.test(l) ? "numerada" : VINETA.test(l) ? "vinetas" : "parrafo";
    const ultimo = tramos[tramos.length - 1];
    if (ultimo && ultimo.tipo === tipo) ultimo.lineas.push(l);
    else tramos.push({ tipo, lineas: [l] });
  }
  return tramos;
}

function Respuesta({ texto }: { texto: string }) {
  const bloques = texto.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="flex flex-col gap-2">
      {bloques.flatMap((bloque, i) => {
        const lineas = bloque.split("\n").map((l) => l.trim()).filter(Boolean);
        return partirEnTramos(lineas).map((tramo, k) => {
          const key = `${i}-${k}`;
          if (tramo.tipo === "numerada") {
            // `start`: si entre el paso 2 y el 3 hay viñetas, el 3 va en otra
            // lista y sin esto se pintaría como «1».
            const inicio = Number.parseInt(tramo.lineas[0], 10);
            return (
              // `listStyle` explícito: el preflight de Tailwind 4 pone
              // `list-style: none` a todas las listas y los pasos salían sin número.
              <ol
                key={key}
                start={Number.isFinite(inicio) ? inicio : 1}
                className="flex flex-col gap-1.5"
                style={{ margin: 0, paddingLeft: 22, listStyle: "decimal" }}
              >
                {tramo.lineas.map((l, j) => (
                  <li key={j} style={{ ...parrafo, whiteSpace: "normal" }}>
                    <Linea texto={l.replace(NUMERO, "")} />
                  </li>
                ))}
              </ol>
            );
          }
          if (tramo.tipo === "vinetas") {
            return (
              <ul key={key} className="flex flex-col gap-1" style={{ margin: 0, paddingLeft: 18, listStyle: "disc" }}>
                {tramo.lineas.map((l, j) => (
                  <li key={j} style={{ ...parrafo, whiteSpace: "normal" }}>
                    <Linea texto={l.replace(VINETA, "")} />
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p key={key} style={{ ...parrafo, whiteSpace: "normal" }}>
              {tramo.lineas.map((l, j) => (
                <Fragment key={j}>
                  {j > 0 && <br />}
                  <Linea texto={l} />
                </Fragment>
              ))}
            </p>
          );
        });
      })}
    </div>
  );
}
