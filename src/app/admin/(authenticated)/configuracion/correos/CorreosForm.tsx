"use client";

import { useActionState, useState } from "react";
import { Save, Mail, Server } from "lucide-react";
import {
  CORREO_PURPOSES,
  CORREO_PURPOSE_LABELS,
  type CorreosConfig,
  type CorreoPurpose,
} from "@/lib/cms/correos";
import { guardarCorreosAction, type CorreosActionState } from "./actions";

export function CorreosForm({ initialConfig }: { initialConfig: CorreosConfig }) {
  const [state, action, isPending] = useActionState<CorreosActionState, FormData>(
    guardarCorreosAction,
    { error: null, ok: false }
  );

  const [provider, setProvider] = useState<CorreosConfig["provider"]>(initialConfig.provider);

  return (
    <form action={action} className="flex flex-col gap-5">
      <Sticky state={state} isPending={isPending} />

      <input type="hidden" name="provider" value={provider} />

      {/* Selector de provider */}
      <Card
        title="Proveedor activo"
        subtitle="Solo uno está activo a la vez. Las credenciales del otro quedan guardadas pero no se usan hasta que lo cambies."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ProviderTab
            active={provider === "resend"}
            onClick={() => setProvider("resend")}
            icon={Mail}
            title="Resend"
            description="API moderna con dashboard, retries automáticos y webhooks. Recomendado."
          />
          <ProviderTab
            active={provider === "smtp"}
            onClick={() => setProvider("smtp")}
            icon={Server}
            title="SMTP"
            description="Servidor de correo tradicional (Gmail Business, dominio propio, Mailgun, etc.)."
          />
        </div>
      </Card>

      {/* Config Resend */}
      <Card
        title="Configuración de Resend"
        subtitle={
          provider === "resend"
            ? "Esta configuración está ACTIVA y se usará para enviar correos."
            : "Inactiva — se guarda pero no se usa hasta que cambies el proveedor."
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field
            label="API Key"
            hint="Empieza con re_… Se obtiene desde resend.com/api-keys. Si ya hay una clave guardada verás puntos (••••): déjalos para conservarla, o bórralos y pega una nueva para reemplazarla."
          >
            <input
              type="password"
              name="resend_apiKey"
              defaultValue={initialConfig.resend.apiKey}
              placeholder="re_••••••••••••"
              style={inputStyle}
              autoComplete="new-password"
            />
          </Field>
          <Field label="From por defecto (email)" hint="Se usa si un preset no define uno.">
            <input
              type="email"
              name="resend_defaultFrom"
              defaultValue={initialConfig.resend.defaultFrom}
              placeholder="noreply@atenas.edu.ec"
              style={inputStyle}
            />
          </Field>
          <Field label="From por defecto (nombre)">
            <input
              type="text"
              name="resend_defaultFromName"
              defaultValue={initialConfig.resend.defaultFromName}
              placeholder="Unidad Educativa Atenas"
              style={inputStyle}
            />
          </Field>
        </div>
      </Card>

      {/* Config SMTP */}
      <Card
        title="Configuración de SMTP"
        subtitle={
          provider === "smtp"
            ? "Esta configuración está ACTIVA y se usará para enviar correos."
            : "Inactiva — se guarda pero no se usa hasta que cambies el proveedor."
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Host" hint="Ej. smtp.gmail.com, smtp.office365.com">
            <input
              type="text"
              name="smtp_host"
              defaultValue={initialConfig.smtp.host}
              placeholder="smtp.tudominio.com"
              style={inputStyle}
            />
          </Field>
          <div className="grid grid-cols-[120px_1fr] gap-3">
            <Field label="Puerto">
              <input
                type="number"
                name="smtp_port"
                defaultValue={initialConfig.smtp.port}
                placeholder="587"
                style={inputStyle}
              />
            </Field>
            <Field label="TLS/SSL" hint="Marcar si el puerto requiere TLS implícito (465).">
              <label
                className="flex items-center gap-2 cursor-pointer"
                style={{
                  background: "#FAFAF8",
                  border: "1px solid #E8E4DD",
                  borderRadius: 6,
                  padding: "0 12px",
                  height: 38,
                }}
              >
                <input
                  type="checkbox"
                  name="smtp_secure"
                  defaultChecked={initialConfig.smtp.secure}
                  style={{ width: 16, height: 16, accentColor: "#1A2B4A" }}
                />
                <span style={{ fontSize: 13, color: "#1A2B4A" }}>Conexión segura</span>
              </label>
            </Field>
          </div>
          <Field label="Usuario">
            <input
              type="text"
              name="smtp_user"
              defaultValue={initialConfig.smtp.user}
              placeholder="usuario@tudominio.com"
              style={inputStyle}
              autoComplete="off"
            />
          </Field>
          <Field label="Contraseña" hint="Solo la lee el servidor; nunca se expone en el sitio público. Si ya hay una guardada verás puntos (••••): déjalos para conservarla, o bórralos y escribe una nueva para reemplazarla.">
            <input
              type="password"
              name="smtp_pass"
              defaultValue={initialConfig.smtp.pass}
              placeholder="••••••••••"
              style={inputStyle}
              autoComplete="new-password"
            />
          </Field>
          <Field label="From por defecto (email)">
            <input
              type="email"
              name="smtp_defaultFrom"
              defaultValue={initialConfig.smtp.defaultFrom}
              placeholder="noreply@atenas.edu.ec"
              style={inputStyle}
            />
          </Field>
          <Field label="From por defecto (nombre)">
            <input
              type="text"
              name="smtp_defaultFromName"
              defaultValue={initialConfig.smtp.defaultFromName}
              placeholder="Unidad Educativa Atenas"
              style={inputStyle}
            />
          </Field>
        </div>
      </Card>

      {/* Presets */}
      <Card
        title="Presets por propósito"
        subtitle="Cada tipo de correo tiene su remitente (From) y, si aplica, un destinatario interno por defecto. Los formularios al usuario final usan estos valores; el destinatario para confirmaciones al usuario sale del propio formulario."
      >
        <div className="flex flex-col gap-3">
          {CORREO_PURPOSES.map((p) => (
            <PresetRow
              key={p}
              purpose={p}
              label={CORREO_PURPOSE_LABELS[p]}
              fromEmail={initialConfig.presets[p].fromEmail}
              fromName={initialConfig.presets[p].fromName}
              notifyTo={initialConfig.presets[p].notifyTo}
            />
          ))}
        </div>
      </Card>
    </form>
  );
}

/* ─── UI helpers ─── */

function ProviderTab({
  active,
  onClick,
  icon: Icon,
  title,
  description,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Mail;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-start gap-3 p-4 text-left transition-all"
      style={{
        background: active ? "#1A2B4A" : "#FAFAF8",
        color: active ? "#FFFFFF" : "#1A2B4A",
        border: `1px solid ${active ? "#1A2B4A" : "#E8E4DD"}`,
        borderRadius: 10,
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      <div
        className="flex items-center justify-center flex-shrink-0"
        style={{
          width: 36,
          height: 36,
          background: active ? "rgba(255,255,255,0.12)" : "#FFFFFF",
          border: active ? "none" : "1px solid #E8E4DD",
          borderRadius: 8,
        }}
      >
        <Icon size={18} strokeWidth={2} color={active ? "#C9A84C" : "#1A2B4A"} />
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 14, fontWeight: 700 }}>{title}</span>
          {active && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#C9A84C",
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Activo
            </span>
          )}
        </div>
        <p style={{ fontSize: 12, opacity: active ? 0.85 : 0.65, lineHeight: 1.5, margin: 0 }}>
          {description}
        </p>
      </div>
    </button>
  );
}

function PresetRow({
  purpose,
  label,
  fromEmail,
  fromName,
  notifyTo,
}: {
  purpose: CorreoPurpose;
  label: string;
  fromEmail: string;
  fromName: string;
  notifyTo: string;
}) {
  const showNotifyTo = purpose !== "admisiones-pipeline";
  return (
    <div className="flex flex-col gap-2 p-3" style={panelStyle}>
      <div className="flex items-center gap-2">
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#1A2B4A",
            textTransform: "uppercase",
            letterSpacing: 0.8,
          }}
        >
          {label}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Field label="From (email)">
          <input
            type="email"
            name={`preset_${purpose}_fromEmail`}
            defaultValue={fromEmail}
            placeholder="ej. admisiones@atenas.edu.ec"
            style={inputStyle}
          />
        </Field>
        <Field label="From (nombre)">
          <input
            type="text"
            name={`preset_${purpose}_fromName`}
            defaultValue={fromName}
            placeholder="ej. Admisiones Atenas"
            style={inputStyle}
          />
        </Field>
        <Field
          label={showNotifyTo ? "Notificar a (interno)" : "Notificar a"}
          hint={
            purpose === "admisiones-pipeline"
              ? "El destinatario es el representante de cada solicitud; no aplica un fijo."
              : "Email del admin que recibe la notificación. Acepta varios separados por coma."
          }
        >
          <input
            type="text"
            name={`preset_${purpose}_notifyTo`}
            defaultValue={notifyTo}
            placeholder={
              purpose === "admisiones-pipeline"
                ? "— se toma del representante —"
                : "admin@atenas.edu.ec"
            }
            disabled={!showNotifyTo}
            style={{
              ...inputStyle,
              opacity: showNotifyTo ? 1 : 0.55,
              cursor: showNotifyTo ? "text" : "not-allowed",
            }}
          />
        </Field>
      </div>
    </div>
  );
}

function Sticky({ state, isPending }: { state: CorreosActionState; isPending: boolean }) {
  return (
    <div
      className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap sticky top-0 z-10"
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
    >
      <span style={{ fontSize: 13, color: "#6B6660" }}>
        El cambio aplica a TODOS los correos del sitio (formularios + pipeline de admisiones).
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
