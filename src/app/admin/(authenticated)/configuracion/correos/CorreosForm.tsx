"use client";

import { useActionState, useState } from "react";
import { Save, Mail, Server } from "lucide-react";
import {
  CORREO_PURPOSES,
  CORREO_PURPOSE_LABELS,
  type CorreosConfig,
  type CorreoPurpose,
} from "@/lib/cms/correos";
import {
  guardarCorreosAction,
  probarEnvioCorreoAction,
  type CorreosActionState,
  type TestEmailResult,
} from "./actions";

export function CorreosForm({ initialConfig }: { initialConfig: CorreosConfig }) {
  const [state, action, isPending] = useActionState<CorreosActionState, FormData>(
    guardarCorreosAction,
    { error: null, ok: false }
  );

  const [provider, setProvider] = useState<CorreosConfig["provider"]>(initialConfig.provider);

  return (
    <div className="flex flex-col gap-5">
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

      <ProbarEnvioCard
        notifyToContactos={initialConfig.presets.contactos.notifyTo || ""}
        defaultEmail={
          (initialConfig.presets.contactos.notifyTo || "")
            .split(/[,;]/)[0]
            ?.trim() ?? ""
        }
      />
    </div>
  );
}

/* ─── Probar envío ─── */

function ProbarEnvioCard({
  notifyToContactos,
  defaultEmail,
}: {
  notifyToContactos: string;
  defaultEmail: string;
}) {
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState<"interno" | "directo" | null>(null);
  const [result, setResult] = useState<TestEmailResult | null>(null);

  async function run(modo: "interno" | "directo") {
    setLoading(modo);
    setResult(null);
    try {
      setResult(await probarEnvioCorreoAction(modo === "interno" ? "" : email));
    } catch {
      setResult({
        ok: false,
        modo,
        provider: "—",
        fromUsed: "—",
        toUsed: modo === "interno" ? notifyToContactos : email,
        error: "No se pudo ejecutar la prueba.",
      });
    } finally {
      setLoading(null);
    }
  }

  const busy = loading !== null;

  return (
    <Card
      title="Probar envío"
      subtitle="Envía correos de prueba reales con la configuración GUARDADA. Si cambiaste algo arriba, pulsa primero «Guardar cambios»."
    >
      <div className="flex flex-col gap-4">
        {/* Prueba 1 — notificación interna (replica el formulario) */}
        <div className="flex flex-col gap-2 p-3" style={panelStyle}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#1A2B4A",
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            1 · Notificación interna del formulario de contactos
          </span>
          <p style={{ fontSize: 12, color: "#6B6660", margin: 0, lineHeight: 1.55 }}>
            Replica exactamente lo que pasa al enviar el formulario de contactos:
            el correo va al destinatario de «Notificar a (interno)».
          </p>
          <p style={{ fontSize: 12, color: "#1A2B4A", margin: 0 }}>
            Destino guardado:{" "}
            <strong>
              {notifyToContactos.trim() || "(vacío — falta configurarlo y guardar)"}
            </strong>
          </p>
          <button
            type="button"
            onClick={() => run("interno")}
            disabled={busy}
            className="flex items-center justify-center gap-2 px-4 rounded-md w-fit"
            style={{
              height: 38,
              background: "#1A2B4A",
              color: "#FFFFFF",
              border: "none",
              fontSize: 13,
              fontWeight: 600,
              cursor: busy ? "wait" : "pointer",
              opacity: busy ? 0.6 : 1,
              whiteSpace: "nowrap",
            }}
          >
            <Mail size={14} strokeWidth={2.5} />
            {loading === "interno" ? "Enviando…" : "Probar notificación interna"}
          </button>
        </div>

        {/* Prueba 2 — envío directo a una dirección concreta */}
        <div className="flex flex-col gap-2 p-3" style={panelStyle}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#1A2B4A",
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            2 · Enviar a una dirección concreta
          </span>
          <p style={{ fontSize: 12, color: "#6B6660", margin: 0, lineHeight: 1.55 }}>
            Prueba general del servidor: envía a la dirección que escribas.
          </p>
          <div className="flex flex-col md:flex-row gap-2 md:items-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu-correo@ejemplo.com"
              style={{ ...inputStyle, flex: 1 }}
            />
            <button
              type="button"
              onClick={() => run("directo")}
              disabled={busy || !email.trim()}
              className="flex items-center justify-center gap-2 px-4 rounded-md"
              style={{
                height: 38,
                background: "#FFFFFF",
                color: "#1A2B4A",
                border: "1px solid #1A2B4A",
                fontSize: 13,
                fontWeight: 600,
                cursor: busy || !email.trim() ? "not-allowed" : "pointer",
                opacity: busy || !email.trim() ? 0.6 : 1,
                whiteSpace: "nowrap",
              }}
            >
              <Mail size={14} strokeWidth={2.5} />
              {loading === "directo" ? "Enviando…" : "Enviar a esta dirección"}
            </button>
          </div>
        </div>

        {result && <TestResultBox result={result} />}
      </div>
    </Card>
  );
}

function TestResultBox({ result }: { result: TestEmailResult }) {
  const ok = result.ok;
  return (
    <div
      style={{
        background: ok ? "#ECFDF5" : "#FEF2F2",
        border: `1px solid ${ok ? "#A7F3D0" : "#FECACA"}`,
        borderRadius: 8,
        padding: 14,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 13,
          fontWeight: 700,
          color: ok ? "#065F46" : "#991B1B",
        }}
      >
        {ok ? "✓ El proveedor aceptó el correo" : "✗ El envío falló"}
      </p>
      <div style={{ marginTop: 8, fontSize: 12, color: "#4B5563", lineHeight: 1.7 }}>
        <div>
          <strong>Prueba:</strong>{" "}
          {result.modo === "interno"
            ? "notificación interna (igual que el formulario)"
            : "envío directo"}
        </div>
        <div><strong>Proveedor:</strong> {result.provider}</div>
        <div><strong>Remitente (From):</strong> {result.fromUsed}</div>
        <div><strong>Destinatario:</strong> {result.toUsed}</div>
        {result.messageId && (
          <div><strong>ID del envío:</strong> {result.messageId}</div>
        )}
        {result.error && (
          <div style={{ color: "#991B1B", marginTop: 4 }}>
            <strong>Error:</strong> {result.error}
          </div>
        )}
      </div>
      {ok && (
        <p style={{ margin: "10px 0 0", fontSize: 12, color: "#065F46", lineHeight: 1.6 }}>
          El servidor aceptó el correo. Si no lo ves en la bandeja de entrada,
          revisa la carpeta de SPAM / correo no deseado.
        </p>
      )}
      {result.hint && (
        <p
          style={{
            margin: "10px 0 0",
            fontSize: 12,
            color: "#92400E",
            background: "#FFFBEB",
            border: "1px solid #FDE68A",
            borderRadius: 6,
            padding: "8px 10px",
            lineHeight: 1.6,
          }}
        >
          💡 {result.hint}
        </p>
      )}
    </div>
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
