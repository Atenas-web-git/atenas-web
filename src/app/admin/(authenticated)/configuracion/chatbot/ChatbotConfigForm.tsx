"use client";

import { useActionState, useMemo, useState } from "react";
import Image from "next/image";
import { Save, Eye, EyeOff, AlertCircle, CheckCircle2, Search, X } from "lucide-react";
import type { ChatbotConfig, ChatbotProvider } from "@/lib/cms/getConfiguracion";
import {
  MODELS_BY_PROVIDER,
  PROVIDER_LABELS,
  resolveModel,
} from "@/lib/chatbot/models";
import { guardarChatbotAction, type ChatbotActionState } from "./actions";

export function ChatbotConfigForm({
  initial,
  keyConfigured,
}: {
  initial: ChatbotConfig;
  keyConfigured: boolean;
}) {
  const [state, action, isPending] = useActionState<ChatbotActionState, FormData>(
    guardarChatbotAction,
    { error: null, ok: false }
  );

  const [activo, setActivo] = useState(initial.activo);
  const [provider, setProvider] = useState<ChatbotProvider>(initial.provider);
  const [model, setModel] = useState(initial.model);
  const [apiKey, setApiKey] = useState(initial.apiKey);
  const [systemPrompt, setSystemPrompt] = useState(initial.systemPrompt);
  const [bubbleText, setBubbleText] = useState(initial.bubbleText);
  const [welcomeMessage, setWelcomeMessage] = useState(initial.welcomeMessage);
  const [fallbackMessage, setFallbackMessage] = useState(initial.fallbackMessage);
  const [fallbackCtaLabel, setFallbackCtaLabel] = useState(initial.fallbackCtaLabel);
  const [fallbackCtaUrl, setFallbackCtaUrl] = useState(initial.fallbackCtaUrl);
  const [maxHistoryMessages, setMaxHistoryMessages] = useState(
    initial.maxHistoryMessages
  );
  const [extraKnowledge, setExtraKnowledge] = useState(initial.extraKnowledge);
  const [showKey, setShowKey] = useState(false);
  const [debugOpen, setDebugOpen] = useState(false);
  const [debugData, setDebugData] = useState<{
    knowledgeBase: string;
    knowledgeBaseLength: number;
    kbError: string | null;
  } | null>(null);
  const [debugLoading, setDebugLoading] = useState(false);

  const availableModels = useMemo(() => MODELS_BY_PROVIDER[provider] ?? [], [provider]);

  const inspectKnowledge = async () => {
    setDebugLoading(true);
    setDebugOpen(true);
    try {
      const res = await fetch("/api/chatbot/debug");
      const json = await res.json();
      setDebugData({
        knowledgeBase: json.knowledgeBase ?? "",
        knowledgeBaseLength: json.knowledgeBaseLength ?? 0,
        kbError: json.kbError ?? null,
      });
    } catch (e) {
      setDebugData({
        knowledgeBase: "",
        knowledgeBaseLength: 0,
        kbError: e instanceof Error ? e.message : "Error al cargar",
      });
    } finally {
      setDebugLoading(false);
    }
  };

  const onChangeProvider = (newProvider: ChatbotProvider) => {
    setProvider(newProvider);
    setModel(resolveModel(newProvider, model));
  };

  const payload: ChatbotConfig = {
    activo,
    provider,
    model,
    apiKey,
    systemPrompt,
    bubbleText,
    welcomeMessage,
    fallbackMessage,
    fallbackCtaLabel,
    fallbackCtaUrl,
    maxHistoryMessages,
    extraKnowledge,
  };

  const isMasked = /^•+/.test(apiKey);

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="payload" value={JSON.stringify(payload)} />

      {/* Sticky bar */}
      <div
        className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap sticky top-0 z-10"
        style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
      >
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: "#1A2B4A" }}
          />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>
            {activo ? "Chatbot ACTIVO" : "Chatbot inactivo (predomina WhatsApp)"}
          </span>
        </label>
        <div className="flex items-center gap-2">
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

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
        <div className="flex flex-col gap-4">
          <Card title="Proveedor de IA" subtitle="Elige el motor de inteligencia artificial. Cada uno tiene precios y características distintos.">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(["gemini", "anthropic", "openai"] as const).map((p) => {
                const selected = provider === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onChangeProvider(p)}
                    className="flex flex-col gap-1 p-3 text-left transition-all"
                    style={{
                      border: selected ? "2px solid #1A2B4A" : "1px solid #E8E4DD",
                      borderRadius: 10,
                      background: selected ? "#F4F1EB" : "#FFFFFF",
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#1A2B4A" }}>
                      {PROVIDER_LABELS[p]}
                    </span>
                    <span style={{ fontSize: 11, color: "#6B6660" }}>
                      {p === "gemini"
                        ? "Tier gratuito generoso · default"
                        : p === "anthropic"
                          ? "Mejor calidad en español"
                          : "Más conocido · costo medio"}
                    </span>
                  </button>
                );
              })}
            </div>

            <Field label="Modelo" required>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                style={inputStyle}
              >
                {availableModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label} — {m.hint}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="API key"
              hint={
                keyConfigured
                  ? 'Ya hay una API key guardada. Borra el campo y pega una nueva para reemplazarla; o deja los "•" para conservarla.'
                  : 'Genera una API key en la consola del proveedor. Se guarda cifrada en BD y solo es legible por el servidor.'
              }
              required={activo}
            >
              <div className="relative">
                <input
                  type={showKey || isMasked ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`API key de ${PROVIDER_LABELS[provider]}`}
                  style={{ ...inputStyle, paddingRight: 40 }}
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  type="button"
                  onClick={() => setShowKey((s) => !s)}
                  aria-label={showKey ? "Ocultar" : "Mostrar"}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#6B6660",
                  }}
                  tabIndex={-1}
                >
                  {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {keyConfigured ? (
                <span style={{ fontSize: 11, color: "#065F46", display: "flex", alignItems: "center", gap: 4 }}>
                  <CheckCircle2 size={11} strokeWidth={2.5} /> API key configurada
                </span>
              ) : (
                <span style={{ fontSize: 11, color: "#92400E", display: "flex", alignItems: "center", gap: 4 }}>
                  <AlertCircle size={11} strokeWidth={2.5} /> Sin API key — el chatbot no podrá responder
                </span>
              )}
            </Field>
          </Card>

          <Card title="Personalidad de Ateneo" subtitle="System prompt enviado al modelo. Define el tono, las reglas y el alcance del asistente.">
            <Field label="System prompt" required>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={10}
                style={{ ...inputStyle, height: "auto", minHeight: 200, paddingTop: 10, paddingBottom: 10, resize: "vertical", lineHeight: 1.55, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12 }}
              />
            </Field>
          </Card>

          <Card title="Mensajes del chat" subtitle="Textos que el usuario ve al abrir el chat o cuando Ateneo no sabe responder.">
            <Field
              label="Texto de la burbuja flotante"
              hint='Globo de sugerencia que aparece junto al botón flotante de Ateneo a los pocos segundos. Ej. "¿Tienes alguna pregunta sobre Atenas?"'
              required
            >
              <input
                type="text"
                value={bubbleText}
                onChange={(e) => setBubbleText(e.target.value)}
                style={inputStyle}
              />
            </Field>
            <Field label="Mensaje de bienvenida" required>
              <textarea
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                rows={2}
                style={{ ...inputStyle, height: "auto", paddingTop: 10, paddingBottom: 10 }}
              />
            </Field>
            <Field
              label="Mensaje de fallback"
              hint="Aparece cuando Ateneo determina que no tiene información suficiente."
              required
            >
              <textarea
                value={fallbackMessage}
                onChange={(e) => setFallbackMessage(e.target.value)}
                rows={3}
                style={{ ...inputStyle, height: "auto", paddingTop: 10, paddingBottom: 10 }}
              />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Texto del botón fallback">
                <input
                  type="text"
                  value={fallbackCtaLabel}
                  onChange={(e) => setFallbackCtaLabel(e.target.value)}
                  style={inputStyle}
                />
              </Field>
              <Field label="URL del botón fallback">
                <input
                  type="text"
                  value={fallbackCtaUrl}
                  onChange={(e) => setFallbackCtaUrl(e.target.value)}
                  style={inputStyle}
                />
              </Field>
            </div>
          </Card>

          <Card
            title="Conocimiento adicional (opcional)"
            subtitle="Información extra que Ateneo debe conocer pero que NO está publicada en la web pública. Ejemplos: fechas internas de vacaciones, FAQ administrativos, contactos privilegiados, datos operativos. Se concatena automáticamente a la base de conocimiento en cada conversación."
          >
            <Field
              label="Texto adicional"
              hint='Soporta texto libre. Estructura con encabezados tipo "## Vacaciones" o "## Inscripciones" para que Ateneo pueda referenciar fácilmente cada tema. Aprox. 5000 caracteres recomendado (más extenso = más caro por turno).'
            >
              <textarea
                value={extraKnowledge}
                onChange={(e) => setExtraKnowledge(e.target.value)}
                rows={10}
                placeholder={`Ejemplo:\n\n## Vacaciones del personal\nDel 1 al 15 de agosto el equipo administrativo está de vacaciones. Solo hay guardia de admisiones.\n\n## Preguntas frecuentes internas\n- ¿Tienen transporte escolar? Sí, contamos con ruta a las zonas norte y centro. Detalles en /servicios/transporte.\n- ¿Aceptan estudiantes extranjeros? Sí, con homologación del MINEDUC.`}
                style={{
                  ...inputStyle,
                  height: "auto",
                  minHeight: 220,
                  paddingTop: 10,
                  paddingBottom: 10,
                  resize: "vertical",
                  lineHeight: 1.55,
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: 12,
                }}
              />
              <span style={{ fontSize: 10, color: "#A0AABA" }}>
                {extraKnowledge.length} caracteres · {extraKnowledge.length > 8000 ? "⚠ muy extenso (puede aumentar costo del bot)" : "tamaño OK"}
              </span>
            </Field>
          </Card>

          <Card
            title="Configuración avanzada"
            subtitle="Parámetros técnicos del chatbot. Cambia solo si sabes lo que haces."
          >
            <Field
              label="Mensajes pasados que se envían al modelo por turno"
              hint='Cuando una persona conversa con Ateneo, no enviamos solo su pregunta nueva: enviamos los últimos N mensajes para que el bot recuerde el contexto. Ej. si pregunta "¿y eso cuándo es?", solo entiende a qué se refiere si vio el mensaje anterior. Default 12 = aprox. 6 turnos de ida y vuelta. Subir este número da más memoria al bot pero aumenta el costo por consulta. Bajarlo ahorra costo pero el bot "olvida" más rápido. 12 es un buen balance.'
            >
              <input
                type="number"
                value={maxHistoryMessages}
                onChange={(e) => setMaxHistoryMessages(parseInt(e.target.value, 10) || 12)}
                min={1}
                max={50}
                style={{ ...inputStyle, maxWidth: 120 }}
              />
            </Field>
          </Card>
        </div>

        <aside className="flex flex-col gap-4">
          <div
            className="flex flex-col items-center gap-3 p-5"
            style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
          >
            <Image src="/images/ateneo-comunicador.png" alt="Ateneo" width={140} height={140} style={{ height: 140, width: "auto" }} />
            <p style={{ fontSize: 13, fontWeight: 700, color: "#1A2B4A", margin: 0, textAlign: "center" }}>
              Mascota: Ateneo
            </p>
            <p style={{ fontSize: 11, color: "#6B6660", margin: 0, textAlign: "center", lineHeight: 1.5 }}>
              Aparece como botón flotante en cualquier página pública cuando el
              chatbot está activo. La mascota cambia según el estado:
              comunicador (idle), indagador (pensando), informador
              (respondiendo) y reflexivo (no sabe).
            </p>
          </div>

          <div
            className="flex flex-col gap-2 p-4"
            style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
          >
            <h3
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#6B6660",
                textTransform: "uppercase",
                letterSpacing: 0.5,
                margin: 0,
              }}
            >
              Conocimiento del bot
            </h3>
            <p style={{ fontSize: 11, color: "#6B6660", margin: 0, lineHeight: 1.55 }}>
              Ateneo lee automáticamente y en cada consulta:
            </p>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11, color: "#6B6660", lineHeight: 1.65 }}>
              <li>Páginas del CMS publicadas</li>
              <li>Documentos institucionales</li>
              <li>Eventos del cronograma anual</li>
              <li>Categorías y logros de Reconocimientos</li>
              <li>Datos de Marca + Contacto</li>
            </ul>
            <p style={{ fontSize: 11, color: "#6B6660", margin: "4px 0 0", lineHeight: 1.55 }}>
              No requiere indexación manual. Al actualizar cualquier contenido
              desde el backoffice, Ateneo lo refleja al siguiente turno.
            </p>
            <button
              type="button"
              onClick={inspectKnowledge}
              className="flex items-center justify-center gap-1.5 mt-2 transition-colors"
              style={{
                height: 32,
                background: "#F4F1EB",
                color: "#1A2B4A",
                border: "1px solid #E8E4DD",
                borderRadius: 6,
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <Search size={12} strokeWidth={2.5} />
              Inspeccionar lo que ve Ateneo
            </button>
          </div>
        </aside>
      </div>

      {/* Modal Inspector */}
      {debugOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(13,24,37,0.65)" }}
          onClick={() => setDebugOpen(false)}
        >
          <div
            className="flex flex-col gap-3 p-5"
            style={{
              background: "#FFFFFF",
              borderRadius: 12,
              width: "min(800px, 100%)",
              maxHeight: "85vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
                  Conocimiento que ve Ateneo
                </h2>
                <p style={{ fontSize: 11, color: "#6B6660", margin: "2px 0 0" }}>
                  Esto es exactamente el texto que se envía al modelo de IA en cada turno.
                  Si Ateneo dice &quot;no tengo información&quot; sobre un tema, revisa que aparezca aquí.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDebugOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#6B6660",
                  padding: 4,
                }}
              >
                <X size={18} />
              </button>
            </div>
            {debugLoading ? (
              <div className="flex-1 flex items-center justify-center py-12">
                <span style={{ fontSize: 13, color: "#6B6660" }}>Cargando…</span>
              </div>
            ) : debugData?.kbError ? (
              <div
                className="px-4 py-3 rounded-md"
                style={{ background: "#FEE2E2", border: "1px solid #FCA5A5" }}
              >
                <p style={{ fontSize: 12, color: "#991B1B", margin: 0 }}>
                  Error: {debugData.kbError}
                </p>
              </div>
            ) : debugData ? (
              <>
                <div className="flex items-center gap-3 text-[11px]" style={{ color: "#6B6660" }}>
                  <span>
                    Tamaño: <strong>{debugData.knowledgeBaseLength.toLocaleString()}</strong>{" "}
                    caracteres
                  </span>
                  <span>·</span>
                  <span>~{Math.ceil(debugData.knowledgeBaseLength / 4).toLocaleString()} tokens estimados</span>
                </div>
                <pre
                  style={{
                    flex: 1,
                    overflow: "auto",
                    background: "#FAFAF8",
                    border: "1px solid #E8E4DD",
                    borderRadius: 8,
                    padding: 16,
                    fontSize: 11,
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    color: "#1A2B4A",
                    lineHeight: 1.55,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    margin: 0,
                  }}
                >
                  {debugData.knowledgeBase || "(vacío — verifica que haya contenido publicado en la BD)"}
                </pre>
              </>
            ) : null}
          </div>
        </div>
      )}
    </form>
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
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#6B6660",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label} {required && <span style={{ color: "#991B1B" }}>*</span>}
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
