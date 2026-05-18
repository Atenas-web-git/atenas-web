"use client";

import { useActionState, useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import type {
  ContactosPaginaConfig,
  ExtensionContacto,
} from "@/lib/cms/contactosPagina";
import {
  guardarContactosPaginaAction,
  type ContactosPaginaActionState,
} from "./actions";

export function ContactosPaginaForm({
  initialConfig,
}: {
  initialConfig: ContactosPaginaConfig;
}) {
  const [state, action, isPending] = useActionState<
    ContactosPaginaActionState,
    FormData
  >(guardarContactosPaginaAction, { error: null, ok: false });

  const [extensiones, setExtensiones] = useState<ExtensionContacto[]>(
    initialConfig.canales.tarjetaTelefono.extensiones
  );

  const updateExt = (i: number, patch: Partial<ExtensionContacto>) =>
    setExtensiones((arr) =>
      arr.map((e, idx) => (idx === i ? { ...e, ...patch } : e))
    );
  const addExt = () =>
    setExtensiones((arr) => [...arr, { ext: "", dept: "", primary: false }]);
  const removeExt = (i: number) =>
    setExtensiones((arr) => arr.filter((_, idx) => idx !== i));

  return (
    <form action={action} className="flex flex-col gap-5">
      <Sticky state={state} isPending={isPending} />

      <input type="hidden" name="extensiones" value={JSON.stringify(extensiones)} />

      <Card
        title="Hero — contenido principal"
        subtitle="Bloque grande superior con foto de fondo, eyebrow, título a 2 líneas (segunda línea en dorado) y descripción."
      >
        <div className="flex flex-col gap-3">
          <Field label="Eyebrow (texto pequeño dorado)">
            <input
              type="text"
              name="hero_eyebrow"
              defaultValue={initialConfig.hero.eyebrow}
              placeholder="Unidad Educativa Atenas"
              style={inputStyle}
            />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Título — línea 1" hint="Color blanco.">
              <input
                type="text"
                name="hero_titleLine1"
                defaultValue={initialConfig.hero.titleLine1}
                placeholder="Estamos"
                required
                style={inputStyle}
              />
            </Field>
            <Field label="Título — línea 2" hint="Color dorado.">
              <input
                type="text"
                name="hero_titleLine2"
                defaultValue={initialConfig.hero.titleLine2}
                placeholder="aquí para ti."
                required
                style={inputStyle}
              />
            </Field>
          </div>
          <Field label="Descripción" hint="Usa Enter para saltos de línea.">
            <textarea
              name="hero_description"
              defaultValue={initialConfig.hero.description}
              rows={3}
              style={{ ...inputStyle, height: "auto", paddingTop: 10, paddingBottom: 10 }}
            />
          </Field>
          <Field label="Caption (línea pequeña inferior)">
            <input
              type="text"
              name="hero_caption"
              defaultValue={initialConfig.hero.caption}
              placeholder="Calle Gabriel Román s/n · Izamba, Ambato"
              style={inputStyle}
            />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field
              label="Ghost text decorativo"
              hint='Texto enorme tras el contenido. Default: "CONTACTOS".'
            >
              <input
                type="text"
                name="hero_ghostText"
                defaultValue={initialConfig.hero.ghostText}
                placeholder="CONTACTOS"
                style={inputStyle}
              />
            </Field>
            <Field label="Imagen de fondo (URL)">
              <input
                type="url"
                name="hero_bgImage"
                defaultValue={initialConfig.hero.bgImage}
                placeholder="https://…"
                style={inputStyle}
              />
            </Field>
          </div>
        </div>
      </Card>

      <Card
        title="Tarjeta flotante del hero (derecha)"
        subtitle="Card oscura con el teléfono, dirección y horario. Solo se editan acá su título y subtítulo — los datos (teléfono/dirección/horario) vienen de la sección Contacto."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Título de la tarjeta">
            <input
              type="text"
              name="hero_tarjeta_titulo"
              defaultValue={initialConfig.hero.tarjeta.titulo}
              placeholder="Contáctanos"
              style={inputStyle}
            />
          </Field>
          <Field label="Subtítulo de la tarjeta">
            <input
              type="text"
              name="hero_tarjeta_subtitulo"
              defaultValue={initialConfig.hero.tarjeta.subtitulo}
              placeholder="Respuesta rápida garantizada"
              style={inputStyle}
            />
          </Field>
        </div>
      </Card>

      <Card
        title="Sección — Canales de atención"
        subtitle="Banner con foto + 3 tarjetas (Teléfono, Dirección y Horario, Correo)."
      >
        <div className="flex flex-col gap-3">
          <Field label="Eyebrow de la sección">
            <input
              type="text"
              name="canales_eyebrow"
              defaultValue={initialConfig.canales.eyebrow}
              placeholder="Información de contacto"
              style={inputStyle}
            />
          </Field>
          <Field label="Heading">
            <input
              type="text"
              name="canales_heading"
              defaultValue={initialConfig.canales.heading}
              placeholder="Canales de atención"
              style={inputStyle}
            />
          </Field>
          <Field label="Imagen del banner (URL)">
            <input
              type="url"
              name="canales_bannerImagen"
              defaultValue={initialConfig.canales.bannerImagen}
              placeholder="https://…"
              style={inputStyle}
            />
          </Field>
        </div>
      </Card>

      <Card
        title="Tarjeta 1 — Teléfono Central"
        subtitle="Título + lista de extensiones del PBX."
      >
        <Field label="Título de la tarjeta">
          <input
            type="text"
            name="canales_tarjetaTelefono_titulo"
            defaultValue={initialConfig.canales.tarjetaTelefono.titulo}
            placeholder="Teléfono Central"
            style={inputStyle}
          />
        </Field>
        <div className="flex flex-col gap-3 mt-3">
          {extensiones.map((e, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-[140px_1fr_auto_auto] gap-2 items-end p-3"
              style={panelStyle}
            >
              <Field label="Extensión">
                <input
                  type="text"
                  value={e.ext}
                  onChange={(ev) => updateExt(i, { ext: ev.target.value })}
                  placeholder="100"
                  style={inputStyle}
                />
              </Field>
              <Field label="Departamento">
                <input
                  type="text"
                  value={e.dept}
                  onChange={(ev) => updateExt(i, { dept: ev.target.value })}
                  placeholder="Recepción / Asistente General"
                  style={inputStyle}
                />
              </Field>
              <label
                className="flex items-center gap-2 mb-[10px]"
                style={{ fontSize: 12, color: "#1A2B4A" }}
              >
                <input
                  type="checkbox"
                  checked={e.primary}
                  onChange={(ev) => updateExt(i, { primary: ev.target.checked })}
                  style={{ width: 16, height: 16, accentColor: "#1A2B4A" }}
                />
                Destacar
              </label>
              <button
                type="button"
                onClick={() => removeExt(i)}
                aria-label="Eliminar"
                style={{ ...iconButton, color: "#991B1B", borderColor: "#FECACA" }}
                className="mb-[10px]"
              >
                <Trash2 size={12} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addExt}
          style={addButton}
          className="flex items-center justify-center gap-1.5 self-start px-4"
        >
          <Plus size={14} strokeWidth={2.5} />
          Agregar extensión
        </button>
      </Card>

      <Card
        title="Tarjeta 2 — Dirección y Horario"
        subtitle="La dirección viene de la sección Contacto. Aquí editas el título y las líneas de horario."
      >
        <div className="flex flex-col gap-3">
          <Field label="Título de la tarjeta">
            <input
              type="text"
              name="canales_tarjetaDireccion_titulo"
              defaultValue={initialConfig.canales.tarjetaDireccion.titulo}
              placeholder="Dirección y Horario"
              style={inputStyle}
            />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Horario laboral (lun–vie)">
              <input
                type="text"
                name="canales_tarjetaDireccion_horarioLaboral"
                defaultValue={initialConfig.canales.tarjetaDireccion.horarioLaboral}
                placeholder="Lunes a Viernes  ·  7:30 – 15:30"
                style={inputStyle}
              />
            </Field>
            <Field label="Horario fin de semana">
              <input
                type="text"
                name="canales_tarjetaDireccion_horarioFinde"
                defaultValue={initialConfig.canales.tarjetaDireccion.horarioFinde}
                placeholder="Sábado y Domingo  ·  Cerrado"
                style={inputStyle}
              />
            </Field>
          </div>
        </div>
      </Card>

      <Card
        title="Tarjeta 3 — Correo Electrónico"
        subtitle="Tarjeta navy con el email institucional. El email viene de la sección Contacto."
      >
        <div className="flex flex-col gap-3">
          <Field label="Título de la tarjeta">
            <input
              type="text"
              name="canales_tarjetaEmail_titulo"
              defaultValue={initialConfig.canales.tarjetaEmail.titulo}
              placeholder="Correo Electrónico"
              style={inputStyle}
            />
          </Field>
          <Field label="Descripción">
            <textarea
              name="canales_tarjetaEmail_descripcion"
              defaultValue={initialConfig.canales.tarjetaEmail.descripcion}
              rows={2}
              style={{ ...inputStyle, height: "auto", paddingTop: 10, paddingBottom: 10 }}
            />
          </Field>
          <Field label="Texto del botón CTA">
            <input
              type="text"
              name="canales_tarjetaEmail_ctaLabel"
              defaultValue={initialConfig.canales.tarjetaEmail.ctaLabel}
              placeholder="Enviar correo"
              style={inputStyle}
            />
          </Field>
          <Field
            label="Acción del botón (URL o mailto)"
            hint='Si lo dejas vacío, el botón abre el cliente de correo del visitante apuntando al email principal (mailto: automático). Si llenas algo, se respeta literal: úsalo para apuntar a un formulario externo (https://forms.google…), a un mailto custom con asunto precargado (mailto:info@…?subject=…), etc.'
          >
            <input
              type="text"
              name="canales_tarjetaEmail_ctaHref"
              defaultValue={initialConfig.canales.tarjetaEmail.ctaHref}
              placeholder="(vacío → mailto: automático)"
              style={inputStyle}
            />
          </Field>
        </div>
      </Card>

      <Card
        title="Formulario de contacto"
        subtitle="Encabezado del formulario y mensajes del estado de éxito."
      >
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Eyebrow">
              <input
                type="text"
                name="form_eyebrow"
                defaultValue={initialConfig.formulario.eyebrow}
                placeholder="Escríbenos"
                style={inputStyle}
              />
            </Field>
            <Field label="Heading">
              <input
                type="text"
                name="form_heading"
                defaultValue={initialConfig.formulario.heading}
                placeholder="Envíanos un mensaje"
                style={inputStyle}
              />
            </Field>
          </div>
          <Field label="Subtítulo">
            <input
              type="text"
              name="form_subtitle"
              defaultValue={initialConfig.formulario.subtitle}
              placeholder="Te responderemos en máximo 48 horas hábiles."
              style={inputStyle}
            />
          </Field>
          <Field label="Texto del botón Enviar">
            <input
              type="text"
              name="form_submitLabel"
              defaultValue={initialConfig.formulario.submitLabel}
              placeholder="Enviar mensaje"
              style={inputStyle}
            />
          </Field>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Título del estado de éxito">
              <input
                type="text"
                name="form_successTitle"
                defaultValue={initialConfig.formulario.successTitle}
                placeholder="¡Mensaje enviado!"
                style={inputStyle}
              />
            </Field>
            <Field label="Texto del estado de éxito">
              <input
                type="text"
                name="form_successText"
                defaultValue={initialConfig.formulario.successText}
                placeholder="Gracias por contactarnos…"
                style={inputStyle}
              />
            </Field>
          </div>
        </div>
      </Card>

      <Card
        title="Mapa (Google Maps)"
        subtitle="URL del iframe Embed + texto del badge sobre el mapa (a la derecha, para no chocar con la card nativa de Google)."
      >
        <div className="flex flex-col gap-3">
          <Field
            label="URL del Embed de Google Maps"
            hint='Pega la URL que empieza con "https://www.google.com/maps/embed?pb=…".'
          >
            <input
              type="url"
              name="mapa_embedUrl"
              defaultValue={initialConfig.mapa.embedUrl}
              placeholder="https://www.google.com/maps/embed?pb=…"
              style={inputStyle}
            />
          </Field>
          <Field label="Texto del badge">
            <input
              type="text"
              name="mapa_badgeText"
              defaultValue={initialConfig.mapa.badgeText}
              placeholder="Izamba · Ambato, Ecuador"
              style={inputStyle}
            />
          </Field>
        </div>
      </Card>
    </form>
  );
}

/* ─── Helpers UI (idénticos al patrón del FooterForm) ─── */

function Sticky({
  state,
  isPending,
}: {
  state: ContactosPaginaActionState;
  isPending: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap sticky top-0 z-10"
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
    >
      <span style={{ fontSize: 13, color: "#6B6660" }}>
        Los cambios aplican a la página /contactos al guardar.
      </span>
      <div className="flex items-center gap-3">
        {state.error && <span style={{ fontSize: 12, color: "#991B1B" }}>{state.error}</span>}
        {state.ok && <span style={{ fontSize: 12, color: "#065F46" }}>Guardado ✓</span>}
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
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
    >
      <div className="flex flex-col gap-1">
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>{title}</h2>
        {subtitle && (
          <p style={{ fontSize: 12, color: "#6B6660", margin: 0, lineHeight: 1.5 }}>{subtitle}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#6B6660",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label}
      </span>
      {children}
      {hint && (
        <span style={{ fontSize: 10, color: "#A0AABA", lineHeight: 1.5 }}>{hint}</span>
      )}
    </div>
  );
}

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
  width: "100%",
};
const panelStyle: React.CSSProperties = {
  background: "#FAFAF8",
  border: "1px solid #E8E4DD",
  borderRadius: 10,
};
const iconButton: React.CSSProperties = {
  width: 32,
  height: 32,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "transparent",
  color: "#1A2B4A",
  border: "1px solid #E8E4DD",
  borderRadius: 6,
  cursor: "pointer",
  fontFamily: "inherit",
};
const addButton: React.CSSProperties = {
  height: 36,
  background: "transparent",
  color: "#1A2B4A",
  border: "1px dashed #C9C4BB",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: "inherit",
};
