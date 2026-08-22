"use client";

import { useActionState, useState } from "react";
import { Save, Plus, Trash2, MessageCircle } from "lucide-react";
import type {
  Contacto,
  TelefonoContacto,
  EmailContacto,
} from "@/lib/cms/getConfiguracion";
import { guardarContactoAction, type ContactoActionState } from "./actions";

export function ContactoForm({ initialContacto }: { initialContacto: Contacto }) {
  const [state, action, isPending] = useActionState<ContactoActionState, FormData>(
    guardarContactoAction,
    { error: null, ok: false }
  );

  const [telefonos, setTelefonos] = useState<TelefonoContacto[]>(initialContacto.telefonos);
  const [emails, setEmails] = useState<EmailContacto[]>(initialContacto.emails);

  const updateTel = (i: number, patch: Partial<TelefonoContacto>) =>
    setTelefonos((arr) => arr.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
  const addTel = () =>
    setTelefonos((arr) => [...arr, { label: "", numero: "", extension: "", esWhatsApp: false }]);
  const removeTel = (i: number) => setTelefonos((arr) => arr.filter((_, idx) => idx !== i));

  const updateEmail = (i: number, patch: Partial<EmailContacto>) =>
    setEmails((arr) => arr.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
  const addEmail = () => setEmails((arr) => [...arr, { label: "", email: "" }]);
  const removeEmail = (i: number) => setEmails((arr) => arr.filter((_, idx) => idx !== i));

  return (
    <form action={action} className="flex flex-col gap-5">
      {/* Sticky de guardado */}
      <Sticky state={state} isPending={isPending} />

      {/* Hidden inputs con JSON serializado */}
      <input type="hidden" name="telefonos" value={JSON.stringify(telefonos)} />
      <input type="hidden" name="emails" value={JSON.stringify(emails)} />

      {/* Teléfonos */}
      <Card title="Teléfonos" subtitle="Números de contacto del colegio con etiquetas y extensiones opcionales.">
        <div className="flex flex-col gap-3">
          {telefonos.map((t, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_180px_120px_auto_auto] gap-2 items-end p-3" style={panelStyle}>
              <Field label="Etiqueta">
                <input
                  type="text"
                  value={t.label}
                  onChange={(e) => updateTel(i, { label: e.target.value })}
                  placeholder="ej. Admisiones"
                  style={inputStyle}
                />
              </Field>
              <Field label="Número">
                <input
                  type="text"
                  value={t.numero}
                  onChange={(e) => updateTel(i, { numero: e.target.value })}
                  placeholder="+593 99 762 2994"
                  style={inputStyle}
                />
              </Field>
              <Field label="Extensión">
                <input
                  type="text"
                  value={t.extension}
                  onChange={(e) => updateTel(i, { extension: e.target.value })}
                  placeholder="100"
                  style={inputStyle}
                />
              </Field>
              <label className="flex items-center gap-2 mb-[10px]" style={{ fontSize: 13, color: "#1A2B4A" }}>
                <input
                  type="checkbox"
                  checked={t.esWhatsApp}
                  onChange={(e) => updateTel(i, { esWhatsApp: e.target.checked })}
                  style={{ width: 16, height: 16, accentColor: "#25D366" }}
                />
                WhatsApp
              </label>
              <button
                type="button"
                onClick={() => removeTel(i)}
                aria-label="Eliminar"
                style={{ ...iconButton, color: "#991B1B", borderColor: "#FECACA" }}
                className="mb-[10px]"
              >
                <Trash2 size={12} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addTel} style={addButton} className="flex items-center justify-center gap-1.5 self-start px-4">
          <Plus size={14} strokeWidth={2.5} />
          Agregar teléfono
        </button>
      </Card>

      {/* Emails */}
      <Card title="Emails" subtitle="Direcciones de correo del colegio.">
        <div className="flex flex-col gap-3">
          {emails.map((e, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-2 items-end p-3" style={panelStyle}>
              <Field label="Etiqueta">
                <input
                  type="text"
                  value={e.label}
                  onChange={(ev) => updateEmail(i, { label: ev.target.value })}
                  placeholder="ej. Admisiones"
                  style={inputStyle}
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  value={e.email}
                  onChange={(ev) => updateEmail(i, { email: ev.target.value })}
                  placeholder="admisiones@atenas.edu.ec"
                  style={inputStyle}
                />
              </Field>
              <button
                type="button"
                onClick={() => removeEmail(i)}
                aria-label="Eliminar"
                style={{ ...iconButton, color: "#991B1B", borderColor: "#FECACA" }}
                className="mb-[10px]"
              >
                <Trash2 size={12} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addEmail} style={addButton} className="flex items-center justify-center gap-1.5 self-start px-4">
          <Plus size={14} strokeWidth={2.5} />
          Agregar email
        </button>
      </Card>

      {/* Redes sociales */}
      <Card title="Redes sociales" subtitle="URLs completas de las cuentas oficiales. Vacío = no se muestra el enlace.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Facebook">
            <input type="url" name="red_facebook" defaultValue={initialContacto.redes.facebook} placeholder="https://www.facebook.com/..." style={inputStyle} />
          </Field>
          <Field label="Instagram">
            <input type="url" name="red_instagram" defaultValue={initialContacto.redes.instagram} placeholder="https://www.instagram.com/..." style={inputStyle} />
          </Field>
          <Field label="YouTube">
            <input type="url" name="red_youtube" defaultValue={initialContacto.redes.youtube} placeholder="https://www.youtube.com/@..." style={inputStyle} />
          </Field>
          <Field label="TikTok">
            <input type="url" name="red_tiktok" defaultValue={initialContacto.redes.tiktok} placeholder="https://www.tiktok.com/@..." style={inputStyle} />
          </Field>
          <Field label="X (Twitter)">
            <input type="url" name="red_x" defaultValue={initialContacto.redes.x} placeholder="https://x.com/..." style={inputStyle} />
          </Field>
          <Field label="LinkedIn">
            <input type="url" name="red_linkedin" defaultValue={initialContacto.redes.linkedin} placeholder="https://www.linkedin.com/school/..." style={inputStyle} />
          </Field>
        </div>
      </Card>

      {/* WhatsApp del FloatingBoot */}
      <Card
        title="WhatsApp del FloatingBoot"
        subtitle="Botón flotante verde que aparece en el sitio público (esquina inferior derecha). El cliente puede iniciar una conversación con el mensaje pre-llenado."
      >
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-3 cursor-pointer" style={{ background: "#FAFAF8", padding: 12, borderRadius: 8, border: "1px solid #E8E4DD" }}>
            <input
              type="checkbox"
              name="wa_activo"
              defaultChecked={initialContacto.whatsapp.activo}
              style={{ width: 18, height: 18, accentColor: "#25D366" }}
            />
            <span className="flex items-center gap-2" style={{ fontSize: 14, color: "#1A2B4A", fontWeight: 500 }}>
              <MessageCircle size={14} strokeWidth={2.5} color="#25D366" />
              Mostrar el botón flotante de WhatsApp en el sitio público
            </span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-3">
            <Field label="Número (sin signos)" hint="Solo dígitos, formato internacional. Ej. 593997622994.">
              <input
                type="text"
                name="wa_numero"
                defaultValue={initialContacto.whatsapp.numero}
                placeholder="593997622994"
                style={{ ...inputStyle, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
              />
            </Field>
            <Field label="Mensaje pre-llenado" hint="Texto que aparece automáticamente en el chat al hacer clic en el botón.">
              <input
                type="text"
                name="wa_mensaje"
                defaultValue={initialContacto.whatsapp.mensaje}
                placeholder="Hola, me gustaría recibir información..."
                style={inputStyle}
              />
            </Field>
          </div>
        </div>
      </Card>

      {/* Horario */}
      <Card title="Horario de atención" subtitle="Texto libre que se muestra en el footer y la página de contactos.">
        <Field label="Horario" hint='Ej. "07:00 — 17:00 (Lunes a Viernes)".'>
          <input type="text" name="horario" defaultValue={initialContacto.horario} style={inputStyle} />
        </Field>
      </Card>
    </form>
  );
}

/* ─── Helpers compartidos ─── */

function Sticky({ state, isPending }: { state: ContactoActionState; isPending: boolean }) {
  return (
    <div
      className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap sticky top-0 z-10"
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
    >
      <span style={{ fontSize: 14, color: "#6B6660" }}>
        Los cambios aplican al sitio público (FloatingBoot, JSON-LD del SEO) al guardar.
      </span>
      <div className="flex items-center gap-3">
        {state.error && <span style={{ fontSize: 13, color: "#991B1B" }}>{state.error}</span>}
        {state.ok && <span style={{ fontSize: 13, color: "#065F46" }}>Guardado ✓</span>}
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-4 rounded-md transition-opacity"
          style={{
            height: 36,
            background: "#1A2B4A",
            color: "#FFFFFF",
            border: "none",
            fontSize: 14,
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

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 p-5" style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}>
      <div className="flex flex-col gap-1">
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 13, color: "#6B6660", margin: 0, lineHeight: 1.5 }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span style={{ fontSize: 12, fontWeight: 700, color: "#6B6660", textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </span>
      {children}
      {hint && <span style={{ fontSize: 11, color: "#A0AABA", lineHeight: 1.5 }}>{hint}</span>}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  height: 38,
  border: "1px solid #E8E4DD",
  borderRadius: 6,
  paddingLeft: 12,
  paddingRight: 12,
  fontSize: 14,
  color: "#1A2B4A",
  background: "#FAFAF8",
  outline: "none",
  fontFamily: "inherit",
  width: "100%",
};
const panelStyle: React.CSSProperties = { background: "#FAFAF8", border: "1px solid #E8E4DD", borderRadius: 10 };
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
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: "inherit",
};
