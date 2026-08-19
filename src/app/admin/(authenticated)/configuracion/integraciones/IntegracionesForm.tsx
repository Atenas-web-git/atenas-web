"use client";

import { useActionState, useState } from "react";
import { Save, AlertTriangle, Check, Info, Sparkles, Lock } from "lucide-react";
import type { Integraciones } from "@/lib/cms/getConfiguracion";
import {
  guardarIntegracionesAction,
  type IntegracionesActionState,
} from "./actions";

export function IntegracionesForm({
  initialIntegraciones,
}: {
  initialIntegraciones: Integraciones;
}) {
  const [state, action, isPending] = useActionState<IntegracionesActionState, FormData>(
    guardarIntegracionesAction,
    { error: null, ok: false }
  );

  // Estado reactivo del GTM ID para detectar el modo activo
  const [gtmId, setGtmId] = useState(initialIntegraciones.gtmId);
  const [facebookPixel, setFacebookPixel] = useState(initialIntegraciones.facebookPixel);
  const [tiktokPixel, setTiktokPixel] = useState(initialIntegraciones.tiktokPixel);
  const [ga4Id, setGa4Id] = useState(initialIntegraciones.ga4Id);

  const gtmActivo = gtmId.trim().length > 0;
  // Conflicto = GTM activo + algún pixel/GA4 individual lleno (se ignoran al guardar pero el cliente debería saberlo)
  const hayConflicto =
    gtmActivo &&
    (facebookPixel.trim() || tiktokPixel.trim() || ga4Id.trim());

  return (
    <form action={action} className="flex flex-col gap-5">
      {/* Sticky de guardado */}
      <div
        className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap sticky top-0 z-10"
        style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
      >
        <span style={{ fontSize: 13, color: "#6B6660" }}>
          Solo el superadmin puede modificar integraciones. Vacío = integración desactivada.
        </span>
        <div className="flex items-center gap-3">
          {state.error && (
            <span className="flex items-center gap-1" style={{ fontSize: 12, color: "#991B1B" }}>
              <AlertTriangle size={12} strokeWidth={2.5} /> {state.error}
            </span>
          )}
          {state.ok && (
            <span className="flex items-center gap-1" style={{ fontSize: 12, color: "#065F46" }}>
              <Check size={12} strokeWidth={2.5} /> Guardado
            </span>
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

      {/* Banner educativo: cómo funcionan las integraciones */}
      <div
        className="flex flex-col gap-3 p-5"
        style={{
          background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
          border: "1px solid #BFDBFE",
          borderRadius: 12,
        }}
      >
        <div className="flex items-start gap-3">
          <Sparkles size={20} strokeWidth={2.5} color="#1E40AF" style={{ flexShrink: 0, marginTop: 2 }} />
          <div className="flex flex-col gap-2">
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1E3A8A", margin: 0 }}>
              ¿Cómo funcionan las integraciones?
            </h3>
            <p style={{ fontSize: 12, color: "#1E3A8A", lineHeight: 1.6, margin: 0 }}>
              Hay <strong>dos modos</strong> de instalar tags de tracking. Elige uno y configúralo abajo. <strong>No mezcles</strong> ambos modos para evitar doble conteo de conversiones.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
          {/* Modo recomendado: GTM */}
          <div
            className="flex flex-col gap-2 p-4 rounded-md"
            style={{ background: "#FFFFFF", border: gtmActivo ? "2px solid #1E40AF" : "1px solid #BFDBFE" }}
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center px-2 rounded-full"
                style={{ background: "#1E40AF", color: "#FFFFFF", fontSize: 10, fontWeight: 700, letterSpacing: 0.5, height: 20 }}
              >
                RECOMENDADO
              </span>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
                Modo con Google Tag Manager
              </h4>
              {gtmActivo && <Check size={14} strokeWidth={3} color="#065F46" />}
            </div>
            <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.6, margin: 0 }}>
              Solo pegas el <strong>GTM ID</strong> abajo. Todos los demás pixels (GA4, Facebook, TikTok) y los eventos custom (Lead al enviar formulario, etc.) los configuras desde la interfaz web de Google Tag Manager (<a href="https://tagmanager.google.com" target="_blank" rel="noopener" style={{ color: "#1E40AF", textDecoration: "underline" }}>tagmanager.google.com</a>) sin tocar el código.
            </p>
          </div>

          {/* Modo simple: standalone */}
          <div
            className="flex flex-col gap-2 p-4 rounded-md"
            style={{ background: "#FFFFFF", border: !gtmActivo ? "2px solid #1E40AF" : "1px solid #BFDBFE" }}
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center px-2 rounded-full"
                style={{ background: "#6B6660", color: "#FFFFFF", fontSize: 10, fontWeight: 700, letterSpacing: 0.5, height: 20 }}
              >
                SIMPLE
              </span>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
                Modo sin Google Tag Manager
              </h4>
              {!gtmActivo && <Check size={14} strokeWidth={3} color="#065F46" />}
            </div>
            <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.6, margin: 0 }}>
              Pegas <strong>cada pixel individualmente</strong>. El sitio solo dispara <code style={{ fontFamily: "monospace", background: "#F4F1EB", padding: "0 4px", borderRadius: 2 }}>PageView</code> automático en TODAS las páginas. Eventos avanzados (Lead, Contact) requieren tocar el código.
            </p>
          </div>
        </div>
      </div>

      {/* Aviso de conflicto cuando GTM + pixels standalone */}
      {hayConflicto && (
        <div
          className="flex items-start gap-3 p-4"
          style={{
            background: "#FEF3C7",
            border: "1px solid #FDE68A",
            borderRadius: 10,
          }}
        >
          <AlertTriangle size={20} strokeWidth={2.5} color="#92400E" style={{ flexShrink: 0, marginTop: 2 }} />
          <div className="flex flex-col gap-1">
            <p style={{ fontSize: 13, fontWeight: 700, color: "#78350F", margin: 0 }}>
              Tienes GTM configurado + pixels individuales llenos
            </p>
            <p style={{ fontSize: 12, color: "#78350F", lineHeight: 1.6, margin: 0 }}>
              Los pixels individuales (Facebook, TikTok, GA4) <strong>se ignoran cuando GTM está activo</strong> — para evitar doble disparo y doble counting de conversiones. Si quieres usar GTM, configura esos pixels desde la interfaz web de GTM y deja vacíos los campos de abajo. Si prefieres el modo simple, borra el GTM ID.
            </p>
          </div>
        </div>
      )}

      {/* Tracking principal */}
      <Card
        title="Tracking principal"
        subtitle="Google Tag Manager es la opción recomendada porque centraliza todos los tags y permite agregar eventos sin tocar el código."
      >
        <Field
          label="Google Tag Manager Container ID"
          hint='Formato: GTM-XXXXXXX. Cuando está configurado, el sitio inyecta el snippet completo de GTM en <head> + <noscript> en <body>. Encuéntralo en tagmanager.google.com → Workspace → admin → "Container ID".'
        >
          <input
            type="text"
            name="gtm_id"
            value={gtmId}
            onChange={(e) => setGtmId(e.target.value)}
            placeholder="GTM-XXXXXXX"
            style={{ ...inputStyle, fontFamily: monoFont }}
          />
        </Field>
        <Field
          label="Google Analytics 4 Measurement ID"
          hint={
            gtmActivo
              ? "Ignorado: GTM activo gestiona GA4 internamente. Configura GA4 dentro de tu workspace de Google Tag Manager."
              : 'Formato: G-XXXXXXX. Solo se inyecta si NO hay GTM (porque GTM debería gestionar GA4 internamente).'
          }
        >
          <input
            type="text"
            name="ga4_id"
            value={ga4Id}
            onChange={(e) => setGa4Id(e.target.value)}
            placeholder="G-XXXXXXX"
            // Editable aunque GTM esté activo, y esto NO es un descuido.
            // Estaba `disabled`, y un control deshabilitado no viaja en el
            // FormData: guardar con GTM activo borraba los tres identificadores
            // de la base. Bloquearlo de otra forma —`readOnly`— arreglaba el
            // borrado pero dejaba al superadmin encerrado: el aviso de conflicto
            // le pide vaciar estos campos y no habría podido hacerlo, así que la
            // alarma se volvía imposible de apagar desde su propia pantalla.
            // El fondo apagado y el texto de ayuda ya dicen que no se usan.
            style={{
              ...inputStyle,
              fontFamily: monoFont,
              background: gtmActivo ? "#F4F1EB" : "#FAFAF8",
              color: "#1A2B4A",
            }}
          />
        </Field>
      </Card>

      {/* Pixels de redes */}
      <Card
        title="Pixels de redes sociales"
        subtitle={
          gtmActivo
            ? "Tienes GTM configurado, así que estos tres no se cargan en el sitio: los gestiona tu workspace de Google Tag Manager. Se guardan igual, por si algún día quitas el GTM."
            : "Tags de seguimiento para campañas en Meta (Facebook + Instagram) y TikTok. Solo se inyectan cuando hay ID configurado."
        }
      >
        {gtmActivo && (
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-md"
            style={{ background: "#F4F1EB", border: "1px solid #E8E4DD" }}
          >
            <Lock size={13} strokeWidth={2.5} color="#6B6660" />
            <span style={{ fontSize: 11, color: "#6B6660", lineHeight: 1.5 }}>
              Pixels gestionados por GTM. Para configurarlos, ve a{" "}
              <a href="https://tagmanager.google.com" target="_blank" rel="noopener" style={{ color: "#1A2B4A", fontWeight: 600 }}>
                tagmanager.google.com
              </a>{" "}
              y agrega los tags de Meta Pixel y TikTok Pixel dentro de tu container.
            </span>
          </div>
        )}
        <Field
          label="Facebook Pixel ID"
          hint={
            gtmActivo
              ? "Ignorado mientras GTM esté activo."
              : "Número de 10-20 dígitos. Lo encuentras en Meta Events Manager → Pixels → Tu pixel → Configuración."
          }
        >
          <input
            type="text"
            name="facebook_pixel"
            value={facebookPixel}
            onChange={(e) => setFacebookPixel(e.target.value)}
            placeholder="123456789012345"
            // Editable aunque GTM esté activo, y esto NO es un descuido.
            // Estaba `disabled`, y un control deshabilitado no viaja en el
            // FormData: guardar con GTM activo borraba los tres identificadores
            // de la base. Bloquearlo de otra forma —`readOnly`— arreglaba el
            // borrado pero dejaba al superadmin encerrado: el aviso de conflicto
            // le pide vaciar estos campos y no habría podido hacerlo, así que la
            // alarma se volvía imposible de apagar desde su propia pantalla.
            // El fondo apagado y el texto de ayuda ya dicen que no se usan.
            style={{
              ...inputStyle,
              fontFamily: monoFont,
              background: gtmActivo ? "#F4F1EB" : "#FAFAF8",
              color: "#1A2B4A",
            }}
          />
        </Field>
        <Field
          label="TikTok Pixel ID"
          hint={
            gtmActivo
              ? "Ignorado mientras GTM esté activo."
              : 'Alfanumérico, típicamente empieza con "C". Lo encuentras en TikTok Ads Manager → Events.'
          }
        >
          <input
            type="text"
            name="tiktok_pixel"
            value={tiktokPixel}
            onChange={(e) => setTiktokPixel(e.target.value)}
            placeholder="CXXXXXXXXXXXXXXXXX"
            // Editable aunque GTM esté activo, y esto NO es un descuido.
            // Estaba `disabled`, y un control deshabilitado no viaja en el
            // FormData: guardar con GTM activo borraba los tres identificadores
            // de la base. Bloquearlo de otra forma —`readOnly`— arreglaba el
            // borrado pero dejaba al superadmin encerrado: el aviso de conflicto
            // le pide vaciar estos campos y no habría podido hacerlo, así que la
            // alarma se volvía imposible de apagar desde su propia pantalla.
            // El fondo apagado y el texto de ayuda ya dicen que no se usan.
            style={{
              ...inputStyle,
              fontFamily: monoFont,
              background: gtmActivo ? "#F4F1EB" : "#FAFAF8",
              color: "#1A2B4A",
            }}
          />
        </Field>
      </Card>

      {/* Otros servicios */}
      <Card title="Otros servicios" subtitle="Servicios adicionales que el cliente puede integrar (independientes del modo de tracking).">
        <Field
          label="URL de Calendly"
          hint="URL pública de Calendly del colegio. Se usa en botones de 'Agendar visita' cuando esté configurado."
        >
          <input
            type="url"
            name="calendly_url"
            defaultValue={initialIntegraciones.calendlyUrl}
            placeholder="https://calendly.com/atenas/visita"
            style={inputStyle}
          />
        </Field>
      </Card>

      {/* Verificaciones de propiedad */}
      <Card
        title="Verificación de propiedad"
        subtitle="Códigos meta-tag que servicios externos requieren para confirmar que eres dueño del dominio. Se inyectan como <meta name='...' content='...'> en <head>. Independientes del modo de tracking."
      >
        <div
          className="flex items-start gap-2 px-3 py-2 rounded-md"
          style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}
        >
          <Info size={13} strokeWidth={2.5} color="#1E40AF" style={{ marginTop: 1, flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: "#1E40AF", lineHeight: 1.5 }}>
            Solo pega el <strong>valor del atributo content</strong>, NO el HTML completo. Ejemplo: si Google te da <code style={{ fontFamily: "monospace" }}>{`<meta name="google-site-verification" content="abc123" />`}</code>, pega solo <code style={{ fontFamily: "monospace" }}>abc123</code>.
          </span>
        </div>
        <Field
          label="Google Search Console (google-site-verification)"
          hint="Valor del atributo content del meta tag. Lo encuentras en Search Console → Configuración → Verificación de propiedad → HTML tag."
        >
          <input
            type="text"
            name="google_verify"
            defaultValue={initialIntegraciones.googleVerify}
            placeholder="abc123..."
            style={{ ...inputStyle, fontFamily: monoFont }}
          />
        </Field>
        <Field
          label="Meta Business (facebook-domain-verification)"
          hint="Código de verificación de dominio de Meta Business Suite → Configuración → Seguridad de marca → Dominios → tu dominio."
        >
          <input
            type="text"
            name="meta_verify"
            defaultValue={initialIntegraciones.metaVerify}
            placeholder="xyz789..."
            style={{ ...inputStyle, fontFamily: monoFont }}
          />
        </Field>
      </Card>
    </form>
  );
}

/* ─── Helpers ─── */

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

const monoFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
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
