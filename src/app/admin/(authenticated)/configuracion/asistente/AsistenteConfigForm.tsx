"use client";

import { useActionState, useMemo, useState } from "react";
import { Save, Eye, EyeOff, AlertCircle, CheckCircle2, Search, X } from "lucide-react";
import type { AsistenteConfig, ChatbotProvider } from "@/lib/cms/getConfiguracion";
import {
  MODELS_BY_PROVIDER,
  PROVIDER_LABELS,
  resolveModel,
} from "@/lib/chatbot/models";
import { guardarAsistenteAction, type AsistenteActionState } from "./actions";

export type UsoAsistente = {
  dias: number;
  /** `false` si la lectura se cortó: los números son de una parte, no del total. */
  completo: boolean;
  preguntas: number;
  fallidas: number;
  tokensEntrada: number;
  tokensCache: number;
  tokensSalida: number;
  porPantalla: { titulo: string; preguntas: number }[];
} | null;

export function AsistenteConfigForm({
  initial,
  keyConfigured,
  uso,
}: {
  initial: AsistenteConfig;
  keyConfigured: boolean;
  uso: UsoAsistente;
}) {
  const [state, action, isPending] = useActionState<AsistenteActionState, FormData>(
    guardarAsistenteAction,
    { error: null, ok: false }
  );

  const [activo, setActivo] = useState(initial.activo);
  const [provider, setProvider] = useState<ChatbotProvider>(initial.provider);
  const [model, setModel] = useState(initial.model);
  const [apiKey, setApiKey] = useState(initial.apiKey);
  const [maxHistoryMessages, setMaxHistoryMessages] = useState(initial.maxHistoryMessages);
  const [notasColegio, setNotasColegio] = useState(initial.notasColegio);
  const [showKey, setShowKey] = useState(false);

  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [inspectorLoading, setInspectorLoading] = useState(false);
  const [inspector, setInspector] = useState<{
    systemPrompt: string;
    systemPromptLength: number;
    manual: { secciones: number; articulos: number; caracteres: number };
    error: string | null;
  } | null>(null);

  const availableModels = useMemo(() => MODELS_BY_PROVIDER[provider] ?? [], [provider]);

  const inspeccionar = async () => {
    setInspectorLoading(true);
    setInspectorOpen(true);
    try {
      const res = await fetch("/api/asistente/inspeccion");
      const json = await res.json();
      setInspector({
        systemPrompt: json.systemPrompt ?? "",
        systemPromptLength: json.systemPromptLength ?? 0,
        manual: json.manual ?? { secciones: 0, articulos: 0, caracteres: 0 },
        error: res.ok ? null : (json.error ?? "No se pudo cargar"),
      });
    } catch (e) {
      setInspector({
        systemPrompt: "",
        systemPromptLength: 0,
        manual: { secciones: 0, articulos: 0, caracteres: 0 },
        error: e instanceof Error ? e.message : "Error al cargar",
      });
    } finally {
      setInspectorLoading(false);
    }
  };

  const onChangeProvider = (nuevo: ChatbotProvider) => {
    setProvider(nuevo);
    setModel(resolveModel(nuevo, model));
  };

  const payload: AsistenteConfig = {
    activo,
    provider,
    model,
    apiKey,
    maxHistoryMessages,
    notasColegio,
  };

  const isMasked = /^•+/.test(apiKey);

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="payload" value={JSON.stringify(payload)} />

      {/* Barra fija: el interruptor y el único botón principal de la pantalla */}
      <div
        className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap sticky top-0 z-10"
        style={{
          background: "var(--ds-fondo-tarjeta)",
          border: "1px solid var(--ds-borde)",
          borderRadius: "var(--ds-radio-lg)",
        }}
      >
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={activo} onChange={(e) => setActivo(e.target.checked)} />
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ds-texto)" }}>
            {activo ? "Asistente ACTIVO" : "Asistente apagado (no aparece el botón «Ayuda»)"}
          </span>
        </label>
        <div className="flex items-center gap-2">
          {state.error && (
            <span style={{ fontSize: 13, color: "var(--ds-error-texto)" }}>{state.error}</span>
          )}
          {state.ok && (
            <span style={{ fontSize: 13, color: "var(--ds-exito-texto)" }}>Guardado ✓</span>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-4 rounded-md transition-opacity"
            style={{
              height: 36,
              background: "var(--ds-accion)",
              color: "var(--ds-texto-invertido)",
              border: "none",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <Save size={14} strokeWidth={2.5} />
            {isPending ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
        <div className="flex flex-col gap-4">
          <Card
            title="Proveedor de IA"
            subtitle="Puede ser la misma cuenta y la misma clave que usa el chatbot del sitio. El gasto se cobra en esa cuenta."
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(["openai", "anthropic", "gemini"] as const).map((p) => {
                const selected = provider === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onChangeProvider(p)}
                    aria-pressed={selected}
                    className="flex flex-col gap-1 p-3 text-left transition-all"
                    style={{
                      border: selected
                        ? "2px solid var(--ds-accion)"
                        : "1px solid var(--ds-borde)",
                      borderRadius: "var(--ds-radio-md)",
                      background: selected ? "var(--ds-fondo-app)" : "var(--ds-fondo-tarjeta)",
                    }}
                  >
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--ds-texto)" }}>
                      {PROVIDER_LABELS[p]}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--ds-texto-suave)" }}>
                      {p === "openai"
                        ? "La cuenta que ya tiene el colegio"
                        : p === "anthropic"
                          ? "Muy buena comprensión en español"
                          : "Tier gratuito generoso"}
                    </span>
                  </button>
                );
              })}
            </div>

            <Field label="Modelo" required>
              <select value={model} onChange={(e) => setModel(e.target.value)} style={inputStyle}>
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
                  ? "Ya hay una API key guardada. Borra el campo y pega una nueva para reemplazarla; o deja los «•» para conservarla."
                  : "Se genera en la consola del proveedor. Solo la lee el servidor: nunca viaja al navegador."
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
                  aria-label={showKey ? "Ocultar la clave" : "Mostrar la clave"}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "transparent",
                    border: "none",
                    color: "var(--ds-texto-suave)",
                  }}
                  tabIndex={-1}
                >
                  {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {keyConfigured ? (
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--ds-exito-texto)",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <CheckCircle2 size={11} strokeWidth={2.5} /> API key configurada
                </span>
              ) : (
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--ds-aviso-texto)",
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <AlertCircle size={11} strokeWidth={2.5} /> Sin API key — el asistente no
                  puede responder
                </span>
              )}
            </Field>
          </Card>

          <Card
            title="Lo que el colegio quiere que sepa, además del manual"
            subtitle="Opcional. Cosas que no están en la documentación pero que conviene que el asistente responda: a quién escribir para pedir un usuario nuevo, el horario de soporte, quién decide qué. Se le envía en cada pregunta."
          >
            <Field
              label="Notas del colegio"
              hint={`${notasColegio.length.toLocaleString("es-EC")} caracteres. Corto y concreto: cada línea se suma al costo de cada pregunta.`}
            >
              <textarea
                value={notasColegio}
                onChange={(e) => setNotasColegio(e.target.value)}
                rows={6}
                placeholder={
                  "Ejemplo:\n- Para pedir un usuario nuevo del panel, escribe a sistemas@atenas.edu.ec.\n- El contenido del sitio lo aprueba Marketing antes de publicarse."
                }
                style={{
                  ...inputStyle,
                  height: "auto",
                  minHeight: 140,
                  paddingTop: 10,
                  paddingBottom: 10,
                  resize: "vertical",
                  lineHeight: 1.55,
                }}
              />
            </Field>
          </Card>

          <Card
            title="Configuración avanzada"
            subtitle="Parámetros técnicos. Cambia solo si sabes lo que haces."
          >
            <Field
              label="Mensajes pasados que se envían al modelo por turno"
              hint="Para que entienda «¿y eso dónde está?» tiene que ver lo anterior. 10 son cinco idas y vueltas. Más memoria, más costo por pregunta."
            >
              <input
                type="number"
                value={maxHistoryMessages}
                onChange={(e) => setMaxHistoryMessages(parseInt(e.target.value, 10) || 10)}
                min={1}
                max={30}
                style={{ ...inputStyle, maxWidth: 120 }}
              />
            </Field>
          </Card>
        </div>

        <aside className="flex flex-col gap-4">
          <div
            className="flex flex-col gap-2 p-4"
            style={{
              background: "var(--ds-fondo-tarjeta)",
              border: "1px solid var(--ds-borde)",
              borderRadius: "var(--ds-radio-lg)",
            }}
          >
            <h3 style={etiquetaAside}>Uso en los últimos {uso?.dias ?? 30} días</h3>
            {uso ? (
              <>
                {!uso.completo && (
                  <p
                    role="status"
                    style={{ fontSize: 12, color: "var(--ds-aviso-texto)", margin: 0, lineHeight: 1.5 }}
                  >
                    La lectura del registro se cortó: estos números son de una parte, no del
                    total.
                  </p>
                )}
                <div className="flex items-baseline gap-2">
                  <span style={{ fontSize: 28, fontWeight: 700, color: "var(--ds-texto)", lineHeight: 1 }}>
                    {uso.preguntas.toLocaleString("es-EC")}
                  </span>
                  <span style={{ fontSize: 13, color: "var(--ds-texto-suave)" }}>
                    {uso.preguntas === 1 ? "pregunta" : "preguntas"}
                    {uso.fallidas > 0 ? ` · ${uso.fallidas} sin respuesta` : ""}
                  </span>
                </div>
                {uso.preguntas > 0 && (
                  <p style={{ fontSize: 13, color: "var(--ds-texto-suave)", margin: 0, lineHeight: 1.5 }}>
                    Por pregunta, unos{" "}
                    <strong style={{ color: "var(--ds-texto)", fontWeight: 600 }}>
                      {Math.round(
                        (uso.tokensEntrada + uso.tokensCache + uso.tokensSalida) / uso.preguntas
                      ).toLocaleString("es-EC")}
                    </strong>{" "}
                    tokens — casi todos son el manual, que viaja entero cada vez; el{" "}
                    <strong style={{ color: "var(--ds-texto)", fontWeight: 600 }}>
                      {Math.round(
                        (100 * uso.tokensCache) /
                          Math.max(1, uso.tokensEntrada + uso.tokensCache)
                      )}
                      %
                    </strong>{" "}
                    de la entrada llegó desde caché, que el proveedor cobra a una fracción.
                  </p>
                )}
                <dl style={{ margin: 0, fontSize: 13, color: "var(--ds-texto-suave)", lineHeight: 1.7 }}>
                  <div className="flex justify-between gap-2">
                    <dt>Tokens de entrada</dt>
                    <dd style={{ margin: 0, color: "var(--ds-texto)" }}>
                      {uso.tokensEntrada.toLocaleString("es-EC")}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>Servidos desde caché</dt>
                    <dd style={{ margin: 0, color: "var(--ds-texto)" }}>
                      {uso.tokensCache.toLocaleString("es-EC")}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt>Tokens de respuesta</dt>
                    <dd style={{ margin: 0, color: "var(--ds-texto)" }}>
                      {uso.tokensSalida.toLocaleString("es-EC")}
                    </dd>
                  </div>
                </dl>
                {uso.porPantalla.length > 0 && (
                  <>
                    <h4 style={{ ...etiquetaAside, marginTop: 8 }}>Dónde más se pregunta</h4>
                    <ol style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--ds-texto-suave)", lineHeight: 1.7 }}>
                      {uso.porPantalla.map((p) => (
                        <li key={p.titulo}>
                          <span style={{ color: "var(--ds-texto)" }}>{p.titulo}</span> · {p.preguntas}
                        </li>
                      ))}
                    </ol>
                    <p style={{ fontSize: 12, color: "var(--ds-texto-suave)", margin: 0, lineHeight: 1.5 }}>
                      Donde más se pregunta es donde el manual está más flojo.
                    </p>
                  </>
                )}
                <p style={{ fontSize: 12, color: "var(--ds-texto-suave)", margin: "4px 0 0", lineHeight: 1.5 }}>
                  El precio por token lo fija el proveedor; se ve en su consola. Aquí no se
                  guarda ninguna pregunta ni respuesta, solo cuánto costó cada una.
                </p>
              </>
            ) : (
              <p style={{ fontSize: 13, color: "var(--ds-texto-suave)", margin: 0, lineHeight: 1.55 }}>
                Todavía no hay registro. Aparece con la primera pregunta — y necesita la
                migración 094 en la base.
              </p>
            )}
          </div>

          <div
            className="flex flex-col gap-2 p-4"
            style={{
              background: "var(--ds-fondo-tarjeta)",
              border: "1px solid var(--ds-borde)",
              borderRadius: "var(--ds-radio-lg)",
            }}
          >
            <h3 style={etiquetaAside}>Qué sabe y qué no</h3>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: "var(--ds-texto-suave)", lineHeight: 1.65 }}>
              <li>El manual de Documentación, entero y actualizado solo, porque vive en el código del panel.</li>
              <li>El rol de quien pregunta y en qué pantalla está.</li>
              <li>Qué botones, campos y avisos hay en esa pantalla — nunca lo que hay escrito en los campos.</li>
              <li>En Admisiones recibe solo botones y campos: ni títulos ni avisos, que pueden llevar el nombre de un menor.</li>
              <li>No toca nada. Si no está en el manual, dice que no lo sabe.</li>
            </ul>
            <button
              type="button"
              onClick={inspeccionar}
              className="flex items-center justify-center gap-1.5 mt-2 transition-colors"
              style={{
                height: 32,
                background: "var(--ds-fondo-tarjeta)",
                color: "var(--ds-texto)",
                border: "1px solid var(--ds-borde-control)",
                borderRadius: "var(--ds-radio-sm)",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <Search size={12} strokeWidth={2.5} />
              Inspeccionar lo que ve el asistente
            </button>
          </div>
        </aside>
      </div>

      {inspectorOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(13,24,37,0.65)" }}
          onClick={() => setInspectorOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Lo que recibe el asistente"
            onKeyDown={(e) => {
              if (e.key === "Escape") setInspectorOpen(false);
            }}
            className="flex flex-col gap-3 p-5"
            style={{
              background: "var(--ds-fondo-tarjeta)",
              borderRadius: "var(--ds-radio-lg)",
              width: "min(860px, 100%)",
              maxHeight: "85vh",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--ds-texto)", margin: 0 }}>
                  Lo que recibe el asistente en cada pregunta
                </h2>
                <p style={{ fontSize: 12, color: "var(--ds-texto-suave)", margin: "2px 0 0" }}>
                  Las reglas, el manual completo y las notas del colegio. A esto se le suma,
                  en cada turno, la pantalla en la que está el usuario.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInspectorOpen(false)}
                aria-label="Cerrar"
                // El foco entra aquí al abrir: así Escape cierra sin más y el
                // teclado no se queda atrás, en el formulario tapado.
                autoFocus
                style={{ background: "transparent", border: "none", color: "var(--ds-texto-suave)", padding: 4 }}
              >
                <X size={18} />
              </button>
            </div>
            {inspectorLoading ? (
              <div className="flex-1 flex items-center justify-center py-12">
                <span style={{ fontSize: 14, color: "var(--ds-texto-suave)" }}>Cargando…</span>
              </div>
            ) : inspector?.error ? (
              <div
                className="px-4 py-3"
                style={{
                  background: "var(--ds-error-fondo)",
                  border: "1px solid var(--ds-error-linea)",
                  borderRadius: "var(--ds-radio-md)",
                }}
              >
                <p style={{ fontSize: 13, color: "var(--ds-error-texto)", margin: 0 }}>
                  Error: {inspector.error}
                </p>
              </div>
            ) : inspector ? (
              <>
                <div className="flex items-center gap-3 flex-wrap" style={{ fontSize: 12, color: "var(--ds-texto-suave)" }}>
                  <span>
                    Manual: <strong>{inspector.manual.articulos}</strong> artículos en{" "}
                    <strong>{inspector.manual.secciones}</strong> secciones
                  </span>
                  <span>·</span>
                  <span>
                    Total: <strong>{inspector.systemPromptLength.toLocaleString("es-EC")}</strong>{" "}
                    caracteres, ~{Math.ceil(inspector.systemPromptLength / 3.8).toLocaleString("es-EC")} tokens
                  </span>
                </div>
                <pre
                  style={{
                    flex: 1,
                    overflow: "auto",
                    background: "var(--ds-fondo-sutil)",
                    border: "1px solid var(--ds-borde)",
                    borderRadius: "var(--ds-radio-md)",
                    padding: 16,
                    fontSize: 12,
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    color: "var(--ds-texto)",
                    lineHeight: 1.55,
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    margin: 0,
                  }}
                >
                  {inspector.systemPrompt}
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
      style={{
        background: "var(--ds-fondo-tarjeta)",
        border: "1px solid var(--ds-borde)",
        borderRadius: "var(--ds-radio-lg)",
      }}
    >
      <div className="flex flex-col gap-1">
        <h2 style={{ fontSize: 14, fontWeight: 600, color: "var(--ds-texto)", margin: 0 }}>{title}</h2>
        {subtitle && (
          <p style={{ fontSize: 13, color: "var(--ds-texto-suave)", margin: 0, lineHeight: 1.5 }}>
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
    <label className="flex flex-col gap-1.5">
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "var(--ds-texto-suave)",
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        {label} {required && <span style={{ color: "var(--ds-error-texto)" }}>*</span>}
      </span>
      {children}
      {hint && (
        <span style={{ fontSize: 12, color: "var(--ds-texto-suave)", lineHeight: 1.5 }}>{hint}</span>
      )}
    </label>
  );
}

const etiquetaAside: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "var(--ds-texto-suave)",
  textTransform: "uppercase",
  letterSpacing: 0.5,
  margin: 0,
};

const inputStyle: React.CSSProperties = {
  height: 38,
  border: "1px solid var(--ds-borde)",
  borderRadius: "var(--ds-radio-sm)",
  paddingLeft: 12,
  paddingRight: 12,
  fontSize: 14,
  color: "var(--ds-texto)",
  background: "var(--ds-fondo-sutil)",
  outline: "none",
  fontFamily: "inherit",
  width: "100%",
};
