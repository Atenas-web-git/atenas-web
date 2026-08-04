"use client";

import { useActionState, useState } from "react";
import { Save } from "lucide-react";
import { guardarNotificacionAction, type NotifActionState } from "../actions";
import {
  TIPO_INFO,
  MODO_VISUAL_INFO,
  type TipoNotificacion,
  type ModoVisualPopup,
} from "../constants";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";

const TIPOS: TipoNotificacion[] = ["popup", "dropdown", "banner_top"];
const MODOS: ModoVisualPopup[] = [
  "imagen_libre",
  "plantilla_imagen_texto",
  "plantilla_diagonal",
];

/** Convierte un timestamptz ISO a formato `datetime-local` (YYYY-MM-DDTHH:mm). */
function toDatetimeLocal(iso: string | null): string {
  if (!iso) return "";
  const date = new Date(iso);
  // Ajustamos a la zona local del navegador para que no salte el offset
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
}

export function EditorNotificacion({
  id,
  initialTitulo,
  initialTipo,
  initialModoVisual,
  initialContenidoHtml,
  initialImagenUrl,
  initialCtaTexto,
  initialCtaUrl,
  initialFechaInicio,
  initialFechaFin,
  initialPrioridad,
  initialActiva,
}: {
  id: string;
  initialTitulo: string;
  initialTipo: string;
  initialModoVisual: string;
  initialContenidoHtml: string;
  initialImagenUrl: string;
  initialCtaTexto: string;
  initialCtaUrl: string;
  initialFechaInicio: string;
  initialFechaFin: string | null;
  initialPrioridad: number;
  initialActiva: boolean;
}) {
  const [state, action, isPending] = useActionState<NotifActionState, FormData>(
    guardarNotificacionAction,
    { error: null, ok: false }
  );

  const [titulo, setTitulo] = useState(initialTitulo);
  const [tipo, setTipo] = useState<TipoNotificacion>(initialTipo as TipoNotificacion);
  const [modoVisual, setModoVisual] = useState<ModoVisualPopup>(
    (initialModoVisual as ModoVisualPopup) || "plantilla_imagen_texto"
  );
  const [contenidoHtml, setContenidoHtml] = useState(initialContenidoHtml);
  const [imagenUrl, setImagenUrl] = useState(initialImagenUrl);
  const [ctaTexto, setCtaTexto] = useState(initialCtaTexto);
  const [ctaUrl, setCtaUrl] = useState(initialCtaUrl);
  const [fechaInicio, setFechaInicio] = useState(toDatetimeLocal(initialFechaInicio));
  const [fechaFin, setFechaFin] = useState(toDatetimeLocal(initialFechaFin));
  const [prioridad, setPrioridad] = useState(initialPrioridad);
  const [activa, setActiva] = useState(initialActiva);

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="contenido_html" value={contenidoHtml} />

      {/* Header sticky con guardar y toggle activa */}
      <div
        className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap sticky top-0 z-10"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8E4DD",
          borderRadius: 12,
        }}
      >
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="activa"
            checked={activa}
            onChange={(e) => setActiva(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: "#1A2B4A" }}
          />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>
            {activa ? "Notificación activa" : "Inactiva (no se muestra al público)"}
          </span>
        </label>
        <div className="flex items-center gap-2">
          {state.error && (
            <span style={{ fontSize: 12, color: "#991B1B" }}>{state.error}</span>
          )}
          {state.ok && (
            <span style={{ fontSize: 12, color: "#065F46" }}>Guardado ✓</span>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-4 rounded-md transition-opacity"
            style={{
              height: 36,
              background: "#1A2B4A",
              color: "#FFFFFF",
              border: "none",
              fontSize: 13,
              fontWeight: 600,
              cursor: isPending ? "wait" : "pointer",
              opacity: isPending ? 0.7 : 1,
            }}
          >
            <Save size={14} strokeWidth={2.5} />
            {isPending ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>

      {/* Datos básicos */}
      <Card title="Información general">
        <Field label="Título" required hint="Aparece en el dropdown del navbar y en la cabecera del popup.">
          <input
            type="text"
            name="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            style={inputStyle}
          />
        </Field>

        <div className="flex flex-col gap-2">
          <span style={fieldLabel}>Tipo de notificación</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {TIPOS.map((t) => {
              const info = TIPO_INFO[t];
              const selected = tipo === t;
              return (
                <label
                  key={t}
                  className="flex flex-col gap-1.5 p-3 transition-all cursor-pointer"
                  style={{
                    border: selected ? "2px solid #1A2B4A" : "1px solid #E8E4DD",
                    borderRadius: 8,
                    background: selected ? info.bg : "#FAFAF8",
                  }}
                >
                  <input
                    type="radio"
                    name="tipo"
                    value={t}
                    checked={selected}
                    onChange={() => setTipo(t)}
                    style={{
                      position: "absolute",
                      opacity: 0,
                      width: 1,
                      height: 1,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: selected ? info.color : "#1A2B4A",
                    }}
                  >
                    {info.label}
                  </span>
                  <span
                    style={{ fontSize: 10, color: "#6B6660", lineHeight: 1.4 }}
                  >
                    {info.descripcion}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <Field label="Prioridad" hint="0 = normal · 1 o más = alta (aparece marcada con un ícono ⚡).">
          <select
            value={prioridad}
            onChange={(e) => setPrioridad(parseInt(e.target.value, 10))}
            name="prioridad"
            style={inputStyle}
          >
            <option value={0}>Normal</option>
            <option value={1}>Alta — anuncio importante</option>
          </select>
        </Field>
      </Card>

      {/* Modo visual — solo aplica al tipo popup */}
      {tipo === "popup" && (
        <Card
          title="Modo visual del popup"
          subtitle="Define el diseño visual del popup. La diseñadora puede elegir entre subir un arte completo cuadrado (imagen libre) o usar una de las dos plantillas del sistema."
        >
          <input type="hidden" name="modo_visual" value={modoVisual} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {MODOS.map((m) => {
              const info = MODO_VISUAL_INFO[m];
              const selected = modoVisual === m;
              return (
                <label
                  key={m}
                  className="flex flex-col gap-2 p-4 transition-all cursor-pointer"
                  style={{
                    border: selected ? "2px solid #1A2B4A" : "1px solid #E8E4DD",
                    borderRadius: 10,
                    background: selected ? "#F4F1EB" : "#FAFAF8",
                  }}
                >
                  <input
                    type="radio"
                    checked={selected}
                    onChange={() => setModoVisual(m)}
                    style={{
                      position: "absolute",
                      opacity: 0,
                      width: 1,
                      height: 1,
                    }}
                  />
                  <ModoThumb modo={m} selected={selected} />
                  <div className="flex flex-col gap-1">
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#1A2B4A",
                      }}
                    >
                      {info.label}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color: "#6B6660",
                        lineHeight: 1.45,
                      }}
                    >
                      {info.descripcion}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
          {modoVisual === "imagen_libre" && (
            <p
              className="px-3 py-2 rounded-md"
              style={{
                background: "#FEF3C7",
                border: "1px solid #FDE68A",
                fontSize: 11,
                color: "#92400E",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              <strong>Nota:</strong> en este modo el sistema solo muestra la imagen
              cuadrada que subes (debajo en &quot;Imagen ilustrativa&quot;). El texto, badge y
              botón CTA quedan ocultos. Si configuras un CTA con URL, toda la
              imagen se vuelve clickeable.
            </p>
          )}
        </Card>
      )}

      {/* Contenido rico */}
      <Card
        title="Contenido del mensaje"
        subtitle={
          tipo === "popup" && modoVisual === "imagen_libre"
            ? "El texto NO se muestra en modo imagen libre, pero queda guardado como referencia interna."
            : "Texto que aparece en la notificación. Acepta formato (negrita, listas, enlaces)."
        }
      >
        <RichTextEditor
          value={contenidoHtml}
          onChange={setContenidoHtml}
          minHeight={180}
        />
      </Card>

      {/* Imagen + CTA */}
      <Card
        title="Imagen y llamada a la acción (opcionales)"
        subtitle="Si la notificación es un popup, la imagen se muestra arriba del mensaje. El CTA agrega un botón visible."
      >
        <ImageUploader
          label="Imagen ilustrativa"
          value={imagenUrl}
          onChange={setImagenUrl}
          prefix={`notificaciones/${id}`}
          previewAspect="16/9"
          hint="Ideal para popups y banners. Si la dejas vacía, no se muestra imagen."
        />
        <input type="hidden" name="imagen_url" value={imagenUrl} />

        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-3">
          <Field label="Texto del botón (CTA)" hint="ej. Ver más, Inscribirme, Ir al sitio.">
            <input
              type="text"
              name="cta_texto"
              value={ctaTexto}
              onChange={(e) => setCtaTexto(e.target.value)}
              placeholder="Ver más"
              style={inputStyle}
            />
          </Field>
          <Field label="URL del botón" hint="Puede ser interno (/admisiones) o externo (https://...).">
            <input
              type="text"
              name="cta_url"
              value={ctaUrl}
              onChange={(e) => setCtaUrl(e.target.value)}
              placeholder="/admisiones"
              style={inputStyle}
            />
          </Field>
        </div>
      </Card>

      {/* Programación */}
      <Card
        title="Programación"
        subtitle="Define cuándo se muestra la notificación. La fecha de inicio es obligatoria; la de fin es opcional (sin fin = se muestra indefinidamente mientras esté activa)."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Fecha y hora de inicio" required>
            <input
              type="datetime-local"
              name="fecha_inicio"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              required
              style={inputStyle}
            />
          </Field>
          <Field label="Fecha y hora de fin (opcional)">
            <input
              type="datetime-local"
              name="fecha_fin"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              style={inputStyle}
            />
          </Field>
        </div>
      </Card>
    </form>
  );
}

/**
 * Mini-thumb visual de cada modo. Diseño esquemático que evoca la
 * estructura del popup real para que el editor entienda qué eligió.
 */
function ModoThumb({
  modo,
  selected,
}: {
  modo: ModoVisualPopup;
  selected: boolean;
}) {
  const borderColor = selected ? "#1A2B4A" : "#E8E4DD";

  if (modo === "imagen_libre") {
    return (
      <div
        className="flex items-center justify-center"
        style={{
          aspectRatio: "1 / 1",
          width: "100%",
          background: "linear-gradient(135deg, #f4f1eb 0%, #e6e1d8 100%)",
          border: `1px dashed ${borderColor}`,
          borderRadius: 8,
          color: "#A0AABA",
          fontSize: 10,
          letterSpacing: 1,
        }}
      >
        ARTE LIBRE
      </div>
    );
  }

  if (modo === "plantilla_imagen_texto") {
    return (
      <div
        className="flex flex-col"
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          background: "#FFFFFF",
          border: `1px solid ${borderColor}`,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            flex: "1 1 60%",
            background: "linear-gradient(135deg, #1A2B4A 0%, #9e1915 100%)",
          }}
        />
        <div
          className="flex flex-col gap-1 px-2 py-2"
          style={{ flex: "0 0 auto" }}
        >
          <div style={{ width: "30%", height: 2, background: "#9e1915" }} />
          <div style={{ width: "85%", height: 4, background: "#1A2B4A", borderRadius: 1 }} />
          <div style={{ width: "60%", height: 4, background: "#1A2B4A", borderRadius: 1 }} />
          <div style={{ width: 28, height: 8, background: "#9e1915", borderRadius: 2, marginTop: 2 }} />
        </div>
      </div>
    );
  }

  // plantilla_diagonal
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: "100%",
        aspectRatio: "1 / 1",
        background: "#0D1825",
        border: `1px solid ${borderColor}`,
        borderRadius: 8,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -10,
          right: -30,
          width: 120,
          height: 60,
          background: "#9e1915",
          transform: "rotate(-18deg)",
          opacity: 0.92,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 18,
          right: -34,
          width: 110,
          height: 1.5,
          background: "#9e1915",
          transform: "rotate(-18deg)",
        }}
      />
      <div
        className="absolute flex flex-col gap-1"
        style={{ left: 8, bottom: 10, right: 8 }}
      >
        <div style={{ width: "70%", height: 4, background: "#FFFFFF", borderRadius: 1 }} />
        <div style={{ width: "55%", height: 4, background: "#FFFFFF", borderRadius: 1, opacity: 0.7 }} />
        <div style={{ width: 22, height: 7, background: "#9e1915", borderRadius: 2, marginTop: 2 }} />
      </div>
    </div>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col gap-4 p-5"
      style={{
        background: "#FFFFFF",
        border: "1px solid #E8E4DD",
        borderRadius: 12,
      }}
    >
      <div className="flex flex-col gap-1">
        <h2
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#1A2B4A",
            margin: 0,
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: 12, color: "#6B6660", margin: 0, lineHeight: 1.5 }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span style={fieldLabel}>
        {label} {required && <span style={{ color: "#991B1B" }}>*</span>}
      </span>
      {children}
      {hint && (
        <span style={{ fontSize: 10, color: "#A0AABA", lineHeight: 1.5 }}>{hint}</span>
      )}
    </div>
  );
}

const fieldLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#6B6660",
  textTransform: "uppercase",
  letterSpacing: 0.5,
};

const inputStyle: React.CSSProperties = {
  height: 38,
  border: "1px solid #E8E4DD",
  borderRadius: 6,
  paddingLeft: 12,
  paddingRight: 12,
  fontSize: 13,
  color: "#1A2B4A",
  background: "#FAFAF8",
  outline: "none",
  fontFamily: "inherit",
};
