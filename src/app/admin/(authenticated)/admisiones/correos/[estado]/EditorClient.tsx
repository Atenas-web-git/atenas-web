"use client";

import { useActionState, useEffect, useState, useMemo } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import {
  Bold, Italic, Strikethrough, Code, List, ListOrdered, Quote,
  Heading1, Heading2, Heading3, Link as LinkIcon, Image as ImageIcon, Undo, Redo, Eye, FileCode2,
  Paperclip, Plus, X, FileText, FileImage, File as FileIcon, ExternalLink,
} from "lucide-react";
import { useTransition } from "react";
import {
  savePlantillaAction,
  type PlantillaActionState,
  vincularArchivoAPlantillaAction,
  desvincularArchivoDePlantillaAction,
} from "../actions";
import {
  renderPremiumEmail,
  type AcentoCorreo,
} from "@/lib/email/premiumEmailRender";
import type {
  Marca,
  Contacto,
  CorreosDiseno,
  NavbarConfig,
} from "@/lib/cms/getConfiguracion";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { VistaPreviaCorreo } from "@/components/admin/VistaPreviaCorreo";

const VARIABLES = [
  { code: "{{numero}}", label: "N° de seguimiento" },
  { code: "{{est_nombres}}", label: "Nombres del estudiante" },
  { code: "{{est_apellidos}}", label: "Apellidos del estudiante" },
  { code: "{{est_nivel}}", label: "Nivel solicitado" },
  { code: "{{rep_nombres}}", label: "Nombres del representante" },
  { code: "{{url_seguimiento}}", label: "URL de seguimiento" },
];

const SAMPLE = {
  numero: "ADM026-278",
  est_nombres: "María",
  est_apellidos: "Pérez",
  est_nivel: "Bachillerato IB",
  rep_nombres: "Carlos",
  url_seguimiento: "https://atenas.edu.ec/admisiones/seguimiento?numero=ADM026-278",
};

function fillSample(html: string): string {
  let result = html;
  for (const [key, value] of Object.entries(SAMPLE)) {
    result = result.replaceAll(`{{${key}}}`, value);
  }
  return result;
}

type Mode = "visual" | "html";
type View = "edit" | "preview";

export type ArchivoBancoForEditor = {
  id: string;
  nombre: string;
  descripcion: string | null;
  tipo_mime: string | null;
  tamano_bytes: number | null;
  categoria: string | null;
  archivo_url: string;
  activo: boolean;
};

export function EditorClient({
  estado,
  estadoLabel,
  initialTitulo,
  initialAsunto,
  initialHtml,
  initialActivo,
  initialAcento,
  initialEyebrow,
  initialHeroImageUrl,
  initialCtaLabel,
  initialCtaUrl,
  initialHelperText,
  archivosBanco,
  archivosVinculadosIds,
  marca,
  contacto,
  diseno,
  navbar,
}: {
  estado: string;
  estadoLabel: string;
  initialTitulo: string;
  initialAsunto: string;
  initialHtml: string;
  initialActivo: boolean;
  initialAcento: AcentoCorreo;
  initialEyebrow: string;
  initialHeroImageUrl: string;
  initialCtaLabel: string;
  initialCtaUrl: string;
  initialHelperText: string;
  archivosBanco: ArchivoBancoForEditor[];
  archivosVinculadosIds: string[];
  marca: Marca;
  contacto: Contacto;
  diseno: CorreosDiseno;
  navbar: NavbarConfig;
}) {
  const [state, action, isPending] = useActionState<PlantillaActionState, FormData>(
    savePlantillaAction,
    { error: null, ok: false }
  );

  const [mode, setMode] = useState<Mode>("visual");
  const [view, setView] = useState<View>("edit");
  const [titulo, setTitulo] = useState(initialTitulo);
  const [asunto, setAsunto] = useState(initialAsunto);
  const [activo, setActivo] = useState(initialActivo);
  const [htmlContent, setHtmlContent] = useState(initialHtml);
  const [acento, setAcento] = useState<AcentoCorreo>(initialAcento);
  const [eyebrow, setEyebrow] = useState(initialEyebrow);
  const [heroImageUrl, setHeroImageUrl] = useState(initialHeroImageUrl);
  const [ctaLabel, setCtaLabel] = useState(initialCtaLabel);
  const [ctaUrl, setCtaUrl] = useState(initialCtaUrl);
  const [helperText, setHelperText] = useState(initialHelperText);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener", target: "_blank" } }),
      Image,
    ],
    content: initialHtml,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      setHtmlContent(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "tiptap-editor",
      },
    },
  });

  // Sincronizar cuando cambia el modo de HTML a visual
  useEffect(() => {
    if (mode === "visual" && editor && editor.getHTML() !== htmlContent) {
      editor.commands.setContent(htmlContent, { emitUpdate: false });
    }
  }, [mode, editor, htmlContent]);

  const insertVariable = (code: string) => {
    if (mode === "visual" && editor) {
      editor.chain().focus().insertContent(code).run();
    } else {
      // Modo HTML: inyectar en el textarea (simple append por ahora)
      setHtmlContent((prev) => prev + code);
    }
  };

  const insertVariableInAsunto = (code: string) => {
    setAsunto((prev) => prev + code);
  };

  const previewHtml = useMemo(() => {
    return renderPremiumEmail(
      {
        acento,
        eyebrow: fillSample(eyebrow),
        titulo: fillSample(titulo),
        cuerpoHtml: fillSample(htmlContent),
        heroImageUrl: heroImageUrl || undefined,
        dataBlock: [
          { label: "N° SEGUIMIENTO", value: SAMPLE.numero },
          {
            label: "POSTULANTE",
            value: `${SAMPLE.est_nombres} ${SAMPLE.est_apellidos}`.trim(),
          },
          { label: "NIVEL", value: SAMPLE.est_nivel },
        ],
        ctaLabel: fillSample(ctaLabel),
        ctaUrl: fillSample(ctaUrl),
        helperText: fillSample(helperText),
      },
      { marca, contacto, diseno, navbar }
    );
  }, [
    acento,
    eyebrow,
    titulo,
    htmlContent,
    heroImageUrl,
    ctaLabel,
    ctaUrl,
    helperText,
    marca,
    contacto,
    diseno,
    navbar,
  ]);
  const previewAsunto = useMemo(() => fillSample(asunto), [asunto]);

  if (!editor) return null;

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="estado" value={estado} />
      <input type="hidden" name="cuerpo_html" value={htmlContent} />
      <input type="hidden" name="titulo" value={titulo} />
      <input type="hidden" name="acento" value={acento} />
      <input type="hidden" name="eyebrow" value={eyebrow} />
      <input type="hidden" name="hero_image_url" value={heroImageUrl} />
      <input type="hidden" name="cta_label" value={ctaLabel} />
      <input type="hidden" name="cta_url" value={ctaUrl} />
      <input type="hidden" name="helper_text" value={helperText} />

      {/* Header con toggle activo + acciones */}
      <div
        className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8E4DD",
          borderRadius: 12,
        }}
      >
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="activo"
            checked={activo}
            onChange={(e) => setActivo(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: "#1A2B4A" }}
          />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>
            Enviar correo automáticamente cuando una solicitud pase a &quot;{estadoLabel}&quot;
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
            style={{
              height: 36,
              paddingLeft: 18,
              paddingRight: 18,
              background: "#1A2B4A",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: isPending ? "wait" : "pointer",
              opacity: isPending ? 0.7 : 1,
            }}
          >
            {isPending ? "Guardando…" : "Guardar plantilla"}
          </button>
        </div>
      </div>

      {/* Layout: editor + sidebar variables */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5">
        <div className="flex flex-col gap-4">
          {/* Título y asunto */}
          <div
            className="flex flex-col gap-4 p-5"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8E4DD",
              borderRadius: 12,
            }}
          >
            <div className="flex flex-col gap-2">
              <label style={fieldLabel}>
                Título del correo (cabecera navy)
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
                placeholder="Tu solicitud está en revisión"
                style={inputStyle}
              />
              <span style={{ fontSize: 10, color: "#A0AABA" }}>
                Aparece grande en blanco sobre el header navy del email.
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <label style={fieldLabel}>
                Asunto del correo
              </label>
              <input
                type="text"
                name="asunto"
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                required
                style={inputStyle}
              />
              <span style={{ fontSize: 10, color: "#A0AABA" }}>
                El texto del asunto en la bandeja de entrada del postulante.
              </span>
            </div>
          </div>

          {/* Identidad visual del correo (acento + eyebrow + hero + CTA) */}
          <div
            className="flex flex-col gap-4 p-5"
            style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
          >
            <div className="flex flex-col gap-1">
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
                Identidad visual del correo
              </h2>
              <p style={{ fontSize: 12, color: "#6B6660", margin: 0, lineHeight: 1.5 }}>
                Personalización específica de este correo. El logo, dirección y redes
                vienen automáticamente de Marca + Contacto.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label style={fieldLabel}>Color de acento</label>
              <div className="flex gap-2 flex-wrap">
                {(["navy", "red", "gold"] as const).map((opt) => {
                  const meta = {
                    navy: { label: "Navy", hex: "#1A2B4A", desc: "Neutral" },
                    red: { label: "Rojo", hex: "#9e1915", desc: "Acción" },
                    gold: { label: "Rojo institucional", hex: "#9e1915", desc: "Premium" },
                  }[opt];
                  const selected = acento === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setAcento(opt)}
                      className="flex items-center gap-2 px-3 py-2 transition-all"
                      style={{
                        background: selected ? "#F4F1EB" : "#FFFFFF",
                        border: selected ? `2px solid ${meta.hex}` : "1px solid #E8E4DD",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      <span
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          background: meta.hex,
                          display: "inline-block",
                        }}
                      />
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#1A2B4A" }}>
                        {meta.label}
                      </span>
                      <span style={{ fontSize: 10, color: "#A0AABA" }}>{meta.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label style={fieldLabel}>Eyebrow (texto pequeño antes del título)</label>
              <input
                type="text"
                value={eyebrow}
                onChange={(e) => setEyebrow(e.target.value)}
                placeholder={'Opcional. Ej. "¡Felicitaciones!" o "Recibimos tu mensaje"'}
                style={inputStyle}
              />
              <span style={{ fontSize: 10, color: "#A0AABA" }}>
                Soporta variables. Aparece arriba del título grande en el color de acento.
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <label style={fieldLabel}>Imagen banner del hero (opcional)</label>
              <ImageUploader
                label=""
                value={heroImageUrl}
                onChange={setHeroImageUrl}
                prefix={`correos/admision/${estado}`}
                previewAspect="16/9"
              />
              <span style={{ fontSize: 10, color: "#A0AABA" }}>
                Recomendado solo para correos de celebración (admitido / matriculado). Ratio
                ~16:11 — el ancho del email es 640px.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <label style={fieldLabel}>Texto del botón CTA (opcional)</label>
                <input
                  type="text"
                  value={ctaLabel}
                  onChange={(e) => setCtaLabel(e.target.value)}
                  placeholder='Ej. "Ver estado de mi solicitud →"'
                  style={inputStyle}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label style={fieldLabel}>URL del botón CTA</label>
                <input
                  type="text"
                  value={ctaUrl}
                  onChange={(e) => setCtaUrl(e.target.value)}
                  placeholder="{{url_seguimiento}} o https://..."
                  style={inputStyle}
                />
              </div>
            </div>
            <span style={{ fontSize: 10, color: "#A0AABA" }}>
              El botón solo aparece si tanto el texto como la URL están completos. Ambos
              soportan variables.
            </span>

            <div className="flex flex-col gap-2">
              <label style={fieldLabel}>Texto helper bajo el CTA (opcional)</label>
              <input
                type="text"
                value={helperText}
                onChange={(e) => setHelperText(e.target.value)}
                placeholder='Ej. "o responde a este correo si tienes preguntas."'
                style={inputStyle}
              />
            </div>
          </div>

          {/* Tabs Mode + View */}
          <div
            className="flex flex-col gap-0"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8E4DD",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              className="flex items-center justify-between gap-3 px-3 py-2 flex-wrap"
              style={{ borderBottom: "1px solid #E8E4DD", background: "#FAFAF8" }}
            >
              <div className="flex items-center gap-1">
                <ModeBtn active={view === "edit" && mode === "visual"} onClick={() => { setView("edit"); setMode("visual"); }}>
                  Visual
                </ModeBtn>
                <ModeBtn active={view === "edit" && mode === "html"} onClick={() => { setView("edit"); setMode("html"); }}>
                  <FileCode2 size={12} strokeWidth={2.5} /> HTML
                </ModeBtn>
                <ModeBtn active={view === "preview"} onClick={() => setView("preview")}>
                  <Eye size={12} strokeWidth={2.5} /> Vista previa
                </ModeBtn>
              </div>
            </div>

            {view === "edit" && mode === "visual" && (
              <>
                <Toolbar editor={editor} />
                <div style={{ minHeight: 360, padding: 16, background: "#FFFFFF" }}>
                  <EditorContent editor={editor} />
                </div>
              </>
            )}

            {view === "edit" && mode === "html" && (
              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                spellCheck={false}
                style={{
                  width: "100%",
                  minHeight: 480,
                  border: "none",
                  outline: "none",
                  padding: 16,
                  fontSize: 12,
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  color: "#1A2B4A",
                  background: "#FAFAF8",
                  resize: "vertical",
                  lineHeight: 1.6,
                }}
              />
            )}

            {view === "preview" && (
              <div className="flex flex-col gap-3 p-5">
                <div
                  className="flex flex-col gap-1 p-4 rounded-md"
                  style={{ background: "#F4F1EB", border: "1px solid #E8E4DD" }}
                >
                  <span style={{ fontSize: 10, fontWeight: 700, color: "#6B6660", textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Asunto
                  </span>
                  <span style={{ fontSize: 14, color: "#1A2B4A", fontWeight: 500 }}>
                    {previewAsunto || "(vacío)"}
                  </span>
                </div>
                <VistaPreviaCorreo html={previewHtml} />
                <p style={{ fontSize: 11, color: "#A0AABA", margin: 0, fontStyle: "italic" }}>
                  Vista previa con valores de ejemplo. Las variables se reemplazan con los datos reales al enviar.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar variables */}
        <aside className="flex flex-col gap-4">
          <div
            className="flex flex-col gap-3 p-4"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8E4DD",
              borderRadius: 12,
            }}
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
              Variables disponibles
            </h3>
            <p style={{ fontSize: 11, color: "#6B6660", margin: 0, lineHeight: 1.5 }}>
              Click para insertar en el cursor del editor. Estas se reemplazan con los datos reales al enviar.
            </p>
            <div className="flex flex-col gap-1.5">
              {VARIABLES.map((v) => (
                <button
                  key={v.code}
                  type="button"
                  onClick={() => insertVariable(v.code)}
                  className="flex flex-col gap-0.5 px-3 py-2 transition-colors text-left hover:opacity-80"
                  style={{
                    background: "#F4F1EB",
                    border: "1px solid transparent",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  <code
                    style={{
                      fontSize: 11,
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                      color: "#1A2B4A",
                      fontWeight: 600,
                    }}
                  >
                    {v.code}
                  </code>
                  <span style={{ fontSize: 10, color: "#6B6660" }}>{v.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div
            className="flex flex-col gap-2 p-4"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8E4DD",
              borderRadius: 12,
            }}
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
              Insertar en asunto
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {VARIABLES.slice(0, 5).map((v) => (
                <button
                  key={v.code}
                  type="button"
                  onClick={() => insertVariableInAsunto(v.code)}
                  style={{
                    fontSize: 10,
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                    padding: "3px 8px",
                    background: "#F4F1EB",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    color: "#1A2B4A",
                  }}
                >
                  {v.code}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ─── Archivos adjuntos automáticos del banco ─── */}
      <ArchivosAdjuntosPlantilla
        estado={estado}
        estadoLabel={estadoLabel}
        archivosBanco={archivosBanco}
        archivosVinculadosIds={archivosVinculadosIds}
      />

      <style>{`
        .tiptap-editor:focus {
          outline: none;
        }
        .tiptap-editor h1 { font-size: 22px; font-weight: 700; margin: 12px 0 8px; }
        .tiptap-editor h2 { font-size: 18px; font-weight: 700; margin: 10px 0 8px; }
        .tiptap-editor h3 { font-size: 16px; font-weight: 700; margin: 8px 0 6px; }
        .tiptap-editor p { margin: 6px 0; line-height: 1.6; }
        .tiptap-editor ul, .tiptap-editor ol { margin: 8px 0; padding-left: 24px; }
        .tiptap-editor li { margin: 2px 0; }
        .tiptap-editor blockquote { border-left: 3px solid #9e1915; padding-left: 12px; margin: 10px 0; color: #6B6660; }
        .tiptap-editor a { color: #9e1915; text-decoration: underline; }
        .tiptap-editor code { background: #F4F1EB; padding: 1px 4px; border-radius: 3px; font-size: 0.9em; }
        .tiptap-editor pre { background: #1A2B4A; color: #FFFFFF; padding: 12px; border-radius: 6px; overflow-x: auto; }
        .tiptap-editor img { max-width: 100%; border-radius: 6px; }
      `}</style>
    </form>
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
  height: 40,
  border: "1px solid #E8E4DD",
  borderRadius: 6,
  paddingLeft: 12,
  paddingRight: 12,
  fontSize: 14,
  color: "#1A2B4A",
  background: "#FAFAF8",
  outline: "none",
  fontFamily: "inherit",
};

function ModeBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 transition-colors"
      style={{
        height: 30,
        background: active ? "#1A2B4A" : "transparent",
        color: active ? "#FFFFFF" : "#6B6660",
        border: "none",
        borderRadius: 5,
        fontSize: 12,
        fontWeight: active ? 600 : 500,
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null;

  const ToolbarBtn = ({
    active,
    disabled,
    onClick,
    children,
    title,
  }: {
    active?: boolean;
    disabled?: boolean;
    onClick: () => void;
    children: React.ReactNode;
    title?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        width: 30,
        height: 28,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: active ? "#1A2B4A" : "transparent",
        color: active ? "#FFFFFF" : "#1A2B4A",
        border: "none",
        borderRadius: 4,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {children}
    </button>
  );

  const Sep = () => (
    <span style={{ display: "inline-block", width: 1, height: 18, background: "#E8E4DD", margin: "0 4px" }} />
  );

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL del enlace:", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const setImage = () => {
    const url = window.prompt("URL de la imagen:");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div
      className="flex items-center gap-0.5 px-2 py-1 flex-wrap"
      style={{ borderBottom: "1px solid #E8E4DD", background: "#FAFAF8" }}
    >
      <ToolbarBtn
        active={editor.isActive("heading", { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        title="Título 1"
      >
        <Heading1 size={14} strokeWidth={2} />
      </ToolbarBtn>
      <ToolbarBtn
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Título 2"
      >
        <Heading2 size={14} strokeWidth={2} />
      </ToolbarBtn>
      <ToolbarBtn
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        title="Título 3"
      >
        <Heading3 size={14} strokeWidth={2} />
      </ToolbarBtn>
      <Sep />
      <ToolbarBtn
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Negrita"
      >
        <Bold size={14} strokeWidth={2.5} />
      </ToolbarBtn>
      <ToolbarBtn
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Cursiva"
      >
        <Italic size={14} strokeWidth={2.5} />
      </ToolbarBtn>
      <ToolbarBtn
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
        title="Tachado"
      >
        <Strikethrough size={14} strokeWidth={2.5} />
      </ToolbarBtn>
      <ToolbarBtn
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
        title="Código"
      >
        <Code size={14} strokeWidth={2.5} />
      </ToolbarBtn>
      <Sep />
      <ToolbarBtn
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Lista con viñetas"
      >
        <List size={14} strokeWidth={2.5} />
      </ToolbarBtn>
      <ToolbarBtn
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Lista numerada"
      >
        <ListOrdered size={14} strokeWidth={2.5} />
      </ToolbarBtn>
      <ToolbarBtn
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Cita"
      >
        <Quote size={14} strokeWidth={2.5} />
      </ToolbarBtn>
      <Sep />
      <ToolbarBtn
        active={editor.isActive("link")}
        onClick={setLink}
        title="Insertar enlace"
      >
        <LinkIcon size={14} strokeWidth={2.5} />
      </ToolbarBtn>
      <ToolbarBtn onClick={setImage} title="Insertar imagen">
        <ImageIcon size={14} strokeWidth={2.5} />
      </ToolbarBtn>
      <Sep />
      <ToolbarBtn
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
        title="Deshacer"
      >
        <Undo size={14} strokeWidth={2.5} />
      </ToolbarBtn>
      <ToolbarBtn
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
        title="Rehacer"
      >
        <Redo size={14} strokeWidth={2.5} />
      </ToolbarBtn>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
 *  Archivos adjuntos automáticos del banco para esta plantilla
 *  Cuando una solicitud pase a este estado, los archivos seleccionados
 *  se anexan automáticamente al correo que se envía al postulante.
 * ──────────────────────────────────────────────────────────────── */

function fileIcon(mime: string | null) {
  if (!mime) return <FileIcon size={14} color="#6B6660" />;
  if (mime.startsWith("image/")) return <FileImage size={14} color="#1E40AF" />;
  if (mime === "application/pdf") return <FileText size={14} color="#9e1915" />;
  return <FileIcon size={14} color="#6B6660" />;
}

function formatBytesShort(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function ArchivosAdjuntosPlantilla({
  estado,
  estadoLabel,
  archivosBanco,
  archivosVinculadosIds,
}: {
  estado: string;
  estadoLabel: string;
  archivosBanco: ArchivoBancoForEditor[];
  archivosVinculadosIds: string[];
}) {
  const [vinculados, setVinculados] = useState<Set<string>>(
    new Set(archivosVinculadosIds)
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const archivosVinculadosList = archivosBanco.filter((a) => vinculados.has(a.id));
  const archivosDisponibles = archivosBanco.filter((a) => !vinculados.has(a.id));

  const toggle = (archivoId: string, vincular: boolean) => {
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.append("estado", estado);
      fd.append("archivo_id", archivoId);
      const res = vincular
        ? await vincularArchivoAPlantillaAction({ error: null, ok: false }, fd)
        : await desvincularArchivoDePlantillaAction({ error: null, ok: false }, fd);
      if (res.error) {
        setError(res.error);
        return;
      }
      setVinculados((prev) => {
        const next = new Set(prev);
        if (vincular) next.add(archivoId);
        else next.delete(archivoId);
        return next;
      });
    });
  };

  return (
    <div
      className="flex flex-col gap-4 p-5"
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
    >
      <div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          <Paperclip
            size={13}
            strokeWidth={2.5}
            className="inline-block mr-1.5 -mt-0.5"
          />
          Adjuntos automáticos del banco
        </h3>
        <p style={{ fontSize: 12, color: "#6B6660", margin: "4px 0 0", maxWidth: 680 }}>
          Estos archivos se adjuntan <strong>automáticamente</strong> al email que se
          envía cuando una solicitud pasa al estado <em>{estadoLabel}</em>. Selecciónalos
          del banco. Si necesitas subir un archivo nuevo, hazlo desde{" "}
          <a
            href="/admin/admisiones/archivos-banco"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1A2B4A", fontWeight: 500 }}
          >
            el banco de archivos ↗
          </a>
          .
        </p>
      </div>

      {error && (
        <div
          className="px-3 py-2 rounded-md"
          style={{ background: "#FEE2E2", border: "1px solid #FCA5A5" }}
        >
          <p style={{ fontSize: 12, color: "#991B1B", margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Lista de vinculados */}
      <div>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#6B6660",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            margin: "0 0 8px",
          }}
        >
          Vinculados a esta plantilla ({archivosVinculadosList.length})
        </p>
        {archivosVinculadosList.length === 0 ? (
          <p
            className="px-3 py-3 text-center"
            style={{
              fontSize: 12,
              color: "#6B6660",
              background: "#FAFAF8",
              border: "1px dashed #E8E4DD",
              borderRadius: 6,
              margin: 0,
            }}
          >
            Ningún archivo vinculado. Selecciona abajo los que se deben adjuntar al correo.
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {archivosVinculadosList.map((a) => (
              <li
                key={a.id}
                className="flex items-center gap-2 px-3 py-2"
                style={{
                  background: "#F0FDF4",
                  border: "1px solid #BBF7D0",
                  borderRadius: 6,
                }}
              >
                {fileIcon(a.tipo_mime)}
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#1A2B4A" }}>
                    {a.nombre}
                  </div>
                  {(a.categoria || a.tamano_bytes) && (
                    <div style={{ fontSize: 10, color: "#6B6660", marginTop: 1 }}>
                      {a.categoria && <span>{a.categoria}</span>}
                      {a.categoria && a.tamano_bytes ? " · " : ""}
                      {a.tamano_bytes && <span>{formatBytesShort(a.tamano_bytes)}</span>}
                    </div>
                  )}
                </div>
                <a
                  href={a.archivo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Ver archivo"
                  className="flex items-center justify-center transition-opacity hover:opacity-70"
                  style={{
                    width: 24,
                    height: 24,
                    background: "#FFFFFF",
                    border: "1px solid #BBF7D0",
                    borderRadius: 4,
                    color: "#065F46",
                    textDecoration: "none",
                  }}
                >
                  <ExternalLink size={11} strokeWidth={2.5} />
                </a>
                <button
                  type="button"
                  onClick={() => toggle(a.id, false)}
                  disabled={pending}
                  title="Desvincular"
                  className="flex items-center justify-center transition-opacity hover:opacity-70 disabled:opacity-50"
                  style={{
                    width: 24,
                    height: 24,
                    background: "#FFFFFF",
                    border: "1px solid #FCA5A5",
                    borderRadius: 4,
                    color: "#991B1B",
                    cursor: pending ? "wait" : "pointer",
                  }}
                >
                  <X size={11} strokeWidth={2.5} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Lista de disponibles */}
      {archivosDisponibles.length > 0 && (
        <div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#6B6660",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              margin: "0 0 8px",
            }}
          >
            Disponibles en el banco ({archivosDisponibles.length})
          </p>
          <ul className="flex flex-col gap-1.5">
            {archivosDisponibles.map((a) => (
              <li
                key={a.id}
                className="flex items-center gap-2 px-3 py-2"
                style={{
                  background: "#FAFAF8",
                  border: "1px solid #E8E4DD",
                  borderRadius: 6,
                }}
              >
                {fileIcon(a.tipo_mime)}
                <div className="flex-1 min-w-0">
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#1A2B4A" }}>
                    {a.nombre}
                  </div>
                  {(a.categoria || a.tamano_bytes) && (
                    <div style={{ fontSize: 10, color: "#6B6660", marginTop: 1 }}>
                      {a.categoria && <span>{a.categoria}</span>}
                      {a.categoria && a.tamano_bytes ? " · " : ""}
                      {a.tamano_bytes && <span>{formatBytesShort(a.tamano_bytes)}</span>}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => toggle(a.id, true)}
                  disabled={pending}
                  className="flex items-center gap-1 px-2 transition-opacity hover:opacity-70 disabled:opacity-50"
                  style={{
                    height: 26,
                    background: "#1A2B4A",
                    fontSize: 11,
                    color: "#FFFFFF",
                    fontWeight: 600,
                    border: "none",
                    borderRadius: 4,
                    cursor: pending ? "wait" : "pointer",
                  }}
                >
                  <Plus size={11} strokeWidth={2.5} />
                  Vincular
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {archivosBanco.length === 0 && (
        <p
          className="px-3 py-3 text-center"
          style={{
            fontSize: 12,
            color: "#6B6660",
            background: "#FEF3C7",
            border: "1px solid #FDE68A",
            borderRadius: 6,
            margin: 0,
          }}
        >
          Aún no hay archivos en el banco. Sube los primeros desde{" "}
          <a
            href="/admin/admisiones/archivos-banco"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#92400E", fontWeight: 600 }}
          >
            el banco de archivos ↗
          </a>
          .
        </p>
      )}
    </div>
  );
}
