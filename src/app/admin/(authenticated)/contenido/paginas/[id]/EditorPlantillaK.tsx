"use client";

import { useActionState, useState } from "react";
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { guardarPaginaAction, type PaginaActionState } from "../actions";
import type {
  ContenidoPlantillaK,
  StatPlantillaK,
  FormularioPlantillaK,
  RevistaAtenasConfig,
  EnlaceExternoServicio,
} from "../../plantillas";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { IconPicker } from "@/components/admin/IconPicker";

type Hero = ContenidoPlantillaK["hero"];
type Ficha = ContenidoPlantillaK["ficha"];

const FORMULARIO_DEFAULT: FormularioPlantillaK = {
  headerTitle: "Tu voz importa",
  headerSubtitle:
    "Comparte tu queja, sugerencia o reconocimiento. Garantizamos confidencialidad y respuesta en máximo 5 días hábiles.",
  tipos: ["Queja", "Sugerencia", "Reconocimiento"],
  submitText: "Enviar comunicación",
  successTitle: "Comunicación recibida",
  successText:
    "Gracias por contactarnos. Recibirás una respuesta en máximo 5 días hábiles al correo que indicaste.",
  destinatarioEmail: "secretaria@atenas.edu.ec",
  asuntoEmail: "Nueva {tipo} — {nombre}",
};

export function EditorPlantillaK({
  paginaId,
  slug,
  initialTitulo,
  initialContenido,
  initialMetaTitle,
  initialMetaDescription,
  initialPublicada,
}: {
  paginaId: string;
  slug: string;
  initialTitulo: string;
  initialContenido: ContenidoPlantillaK;
  initialMetaTitle: string;
  initialMetaDescription: string;
  initialPublicada: boolean;
}) {
  const [state, action, isPending] = useActionState<PaginaActionState, FormData>(
    guardarPaginaAction,
    { error: null, ok: false }
  );

  const [titulo, setTitulo] = useState(initialTitulo);
  const [publicada, setPublicada] = useState(initialPublicada);
  const [metaTitle, setMetaTitle] = useState(initialMetaTitle);
  const [metaDescription, setMetaDescription] = useState(initialMetaDescription);

  const [hero, setHero] = useState<Hero>(initialContenido.hero);
  const [ficha, setFicha] = useState<Ficha>(initialContenido.ficha);
  const [formulario, setFormulario] = useState<FormularioPlantillaK>(
    initialContenido.formulario ?? FORMULARIO_DEFAULT
  );

  // Card "Revista Atenas" — solo aplica al slug "servicios/biblioteca".
  const isBiblioteca = slug === "servicios/biblioteca";
  const [revistaAtenas, setRevistaAtenas] = useState<RevistaAtenasConfig>(
    initialContenido.revistaAtenas ?? {
      enabled: true,
      eyebrow: "RECURSO DESTACADO",
      titulo: "Revista Atenas",
      descripcion:
        "Lee la edición digital de nuestra revista institucional. Crónicas, logros y vida estudiantil contados desde la voz de la comunidad atenista.",
      ctaText: "Leer la revista",
      ctaUrl: "",
    }
  );

  const [enlacesExternos, setEnlacesExternos] = useState<EnlaceExternoServicio[]>(
    initialContenido.enlacesExternos ?? []
  );

  const safePrefix = `paginas/${slug.replace(/[^a-z0-9-]/g, "-")}`;
  // Solo persistimos `formulario` si la ficha es de color rojo (caso especial),
  // y `revistaAtenas` solo si esta página es la biblioteca.
  const baseContenido: Record<string, unknown> =
    ficha.color === "red" ? { hero, ficha, formulario } : { hero, ficha };
  if (isBiblioteca) {
    baseContenido.revistaAtenas = revistaAtenas;
  }
  // Se guardan siempre: una lista vacía simplemente no pinta nada.
  baseContenido.enlacesExternos = enlacesExternos.filter(
    (e) => e.label.trim() !== "" && e.url.trim() !== ""
  );
  const contenidoJson = JSON.stringify(baseContenido);

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="id" value={paginaId} />
      <input type="hidden" name="contenido" value={contenidoJson} />

      <Sticky publicada={publicada} setPublicada={setPublicada} state={state} isPending={isPending} />

      <Card title="Información general">
        <Field label="Título interno" hint="Solo se ve en el backoffice. No afecta la página pública.">
          <input type="text" name="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required style={inputStyle} />
        </Field>
        <Field label="Slug (URL)" hint="No editable.">
          <input type="text" value={`/${slug}`} readOnly disabled style={{ ...inputStyle, background: "#F4F1EB", color: "#A0AABA" }} />
        </Field>
        <p style={{ fontSize: 12, color: "#A0AABA", margin: 0, lineHeight: 1.5 }}>
          Esta ficha aparece en{" "}
          <code style={{ fontFamily: "ui-monospace, monospace" }}>/{slug}</code>. La card del landing{" "}
          <a href="/admin/contenido/paginas" style={{ color: "#1A2B4A", fontWeight: 500 }}>
            /servicios
          </a>{" "}
          se edita por separado (plantilla B).
        </p>
      </Card>

      <HeroEditor hero={hero} setHero={setHero} prefix={`${safePrefix}/hero`} />
      <FichaEditor ficha={ficha} setFicha={setFicha} prefix={`${safePrefix}/ficha`} />
      {ficha.color === "red" && (
        <FormularioEditor formulario={formulario} setFormulario={setFormulario} />
      )}
      <EnlacesExternosEditor enlaces={enlacesExternos} setEnlaces={setEnlacesExternos} />
      {isBiblioteca && (
        <RevistaAtenasEditor revista={revistaAtenas} setRevista={setRevistaAtenas} />
      )}

      <Card title="SEO" subtitle="Metadatos para motores de búsqueda y previsualizaciones.">
        <Field label="Meta title" hint="Recomendado: 50-60 caracteres.">
          <input type="text" name="meta_title" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} maxLength={120} style={inputStyle} />
        </Field>
        <Field label="Meta description" hint="Recomendado: 140-160 caracteres.">
          <textarea name="meta_description" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={2} maxLength={300} style={textareaStyle} />
        </Field>
      </Card>
    </form>
  );
}

/* ─── Formulario (solo visible cuando color = red) ─── */

function FormularioEditor({
  formulario,
  setFormulario,
}: {
  formulario: FormularioPlantillaK;
  setFormulario: (f: FormularioPlantillaK) => void;
}) {
  const set = (patch: Partial<FormularioPlantillaK>) =>
    setFormulario({ ...formulario, ...patch });

  /* tipos del dropdown */
  const updateTipo = (i: number, value: string) =>
    set({ tipos: formulario.tipos.map((t, idx) => (idx === i ? value : t)) });
  const addTipo = () => set({ tipos: [...formulario.tipos, ""] });
  const removeTipo = (i: number) =>
    set({ tipos: formulario.tipos.filter((_, idx) => idx !== i) });
  const moveTipo = (i: number, dir: -1 | 1) => {
    const next = [...formulario.tipos];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set({ tipos: next });
  };

  return (
    <Card
      title="Bloque 3 — Formulario de comunicación"
      subtitle="Reemplaza la sección de pasos cuando la ficha es de color rojo (caso típico: /servicios/quejas-sugerencias). El destinatario y el asunto se aplican cuando Resend está activo."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Título del header" required hint="Aparece en el banner rojo del formulario.">
          <input type="text" value={formulario.headerTitle} onChange={(e) => set({ headerTitle: e.target.value })} required style={inputStyle} />
        </Field>
        <Field label="Texto del botón" required>
          <input type="text" value={formulario.submitText} onChange={(e) => set({ submitText: e.target.value })} required style={inputStyle} />
        </Field>
      </div>
      <Field label="Bajada del header">
        <textarea value={formulario.headerSubtitle} onChange={(e) => set({ headerSubtitle: e.target.value })} rows={2} style={textareaStyle} />
      </Field>

      {/* tipos */}
      <span style={fieldLabel}>
        Tipos de comunicación {formulario.tipos.length > 0 && `(${formulario.tipos.length})`}
      </span>
      <p style={{ fontSize: 12, color: "#A0AABA", margin: 0, lineHeight: 1.5 }}>
        Opciones del dropdown "Tipo" (ej. "Queja", "Sugerencia", "Reconocimiento").
      </p>
      <div className="flex flex-col gap-2">
        {formulario.tipos.map((t, i) => (
          <div key={i} className="flex items-center gap-2 p-2" style={panelStyle}>
            <span style={{ ...panelLabel, width: 26 }}>#{i + 1}</span>
            <input type="text" value={t} onChange={(e) => updateTipo(i, e.target.value)} style={{ ...inputStyle, flex: 1, height: 32 }} />
            <button type="button" onClick={() => moveTipo(i, -1)} disabled={i === 0} aria-label="Subir" style={iconButton(i === 0)}>
              <ArrowUp size={12} strokeWidth={2.5} />
            </button>
            <button type="button" onClick={() => moveTipo(i, 1)} disabled={i === formulario.tipos.length - 1} aria-label="Bajar" style={iconButton(i === formulario.tipos.length - 1)}>
              <ArrowDown size={12} strokeWidth={2.5} />
            </button>
            <button type="button" onClick={() => removeTipo(i)} aria-label="Eliminar" style={{ ...iconButton(false), color: "#991B1B", borderColor: "#FECACA" }}>
              <Trash2 size={12} strokeWidth={2.5} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addTipo} style={addButton} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4">
        <Plus size={14} strokeWidth={2.5} />
        Agregar tipo
      </button>

      {/* mensajes de éxito */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Encabezado de éxito" required>
          <input type="text" value={formulario.successTitle} onChange={(e) => set({ successTitle: e.target.value })} required style={inputStyle} />
        </Field>
        <Field label="Texto de éxito" required>
          <input type="text" value={formulario.successText} onChange={(e) => set({ successText: e.target.value })} required style={inputStyle} />
        </Field>
      </div>

      {/* envío por correo */}
      <div
        className="flex flex-col gap-3 p-4 rounded-md"
        style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}
      >
        <p style={{ fontSize: 13, fontWeight: 700, color: "#92400E", margin: 0, textTransform: "uppercase", letterSpacing: 0.5 }}>
          Envío por correo (Resend)
        </p>
        <p style={{ fontSize: 12, color: "#92400E", margin: 0, lineHeight: 1.6 }}>
          Estos campos se aplican cuando Resend esté activo. El servidor lee el destinatario directamente de la base de datos (no del navegador), así que no se puede manipular desde el cliente.
        </p>
        <Field label="Correo destinatario" required hint="A esta dirección llegarán los formularios enviados.">
          <input
            type="email"
            value={formulario.destinatarioEmail}
            onChange={(e) => set({ destinatarioEmail: e.target.value.trim() })}
            required
            placeholder="secretaria@atenas.edu.ec"
            style={inputStyle}
          />
        </Field>
        <Field label="Asunto del correo" required hint="Soporta {nombre} y {tipo} como placeholders (ej. 'Nueva {tipo} — {nombre}').">
          <input
            type="text"
            value={formulario.asuntoEmail}
            onChange={(e) => set({ asuntoEmail: e.target.value })}
            required
            style={inputStyle}
          />
        </Field>
      </div>
    </Card>
  );
}

/* ─── Card "Revista Atenas" (solo /servicios/biblioteca) ─── */

function RevistaAtenasEditor({
  revista,
  setRevista,
}: {
  revista: RevistaAtenasConfig;
  setRevista: (r: RevistaAtenasConfig) => void;
}) {
  const set = (patch: Partial<RevistaAtenasConfig>) => setRevista({ ...revista, ...patch });
  return (
    <Card
      title='Card "Revista Atenas" (solo biblioteca)'
      subtitle="CTA destacado que aparece al final de la página de Biblioteca. Si lo desactivas, la card no se renderiza."
    >
      <label
        className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer"
        style={{ background: "#FAFAF8", border: "1px solid #E8E4DD" }}
      >
        <input
          type="checkbox"
          checked={revista.enabled}
          onChange={(e) => set({ enabled: e.target.checked })}
          style={{ width: 16, height: 16, accentColor: "#1A2B4A" }}
        />
        <span style={{ fontSize: 14, color: "#1A2B4A" }}>
          {revista.enabled
            ? "Card visible en /servicios/biblioteca"
            : "Card oculta (no se muestra al visitante)"}
        </span>
      </label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
        <Field label="Eyebrow" hint='Pequeño texto rojo arriba del título. Ej. "Recurso destacado"'>
          <input
            type="text"
            value={revista.eyebrow ?? ""}
            onChange={(e) => set({ eyebrow: e.target.value })}
            maxLength={40}
            style={inputStyle}
          />
        </Field>
        <Field label="Texto del botón CTA" hint='Ej. "Leer la revista"'>
          <input
            type="text"
            value={revista.ctaText ?? ""}
            onChange={(e) => set({ ctaText: e.target.value })}
            maxLength={40}
            style={inputStyle}
          />
        </Field>
      </div>
      <Field label="Título" hint='Texto grande blanco. Ej. "Revista Atenas"'>
        <input
          type="text"
          value={revista.titulo ?? ""}
          onChange={(e) => set({ titulo: e.target.value })}
          maxLength={80}
          style={inputStyle}
        />
      </Field>
      <Field label="Descripción" hint="Párrafo descriptivo bajo el título.">
        <textarea
          value={revista.descripcion ?? ""}
          onChange={(e) => set({ descripcion: e.target.value })}
          rows={3}
          maxLength={400}
          style={textareaStyle}
        />
      </Field>
      <Field
        label="URL de la revista"
        hint="Pega aquí el link a la revista digital (Issuu, Drive, página propia, etc.). Si vacío, se usa el placeholder."
      >
        <input
          type="text"
          value={revista.ctaUrl ?? ""}
          onChange={(e) => set({ ctaUrl: e.target.value })}
          placeholder="https://..."
          style={inputStyle}
        />
      </Field>
      <Field
        label="Foto de la portada (opcional)"
        hint="Se muestra a la derecha de la card en desktop, con una ligera inclinación. Recomendado: imagen vertical (proporción 4:5). Si vacía, se muestra el placeholder rojo por defecto."
      >
        <ImageUploader
          value={revista.coverImage ?? ""}
          onChange={(url) => set({ coverImage: url })}
          prefix="servicios/biblioteca/revista"
          previewAspect="4/3"
        />
      </Field>
      <Field label="Texto alt de la portada (accesibilidad)" hint='Descripción corta para lectores de pantalla. Ej. "Portada de la edición 2026 de la Revista Atenas".'>
        <input
          type="text"
          value={revista.coverAlt ?? ""}
          onChange={(e) => set({ coverAlt: e.target.value })}
          maxLength={120}
          placeholder="Portada de la Revista Atenas"
          style={inputStyle}
        />
      </Field>
    </Card>
  );
}

/* ─── Hero ─── */

function HeroEditor({ hero, setHero, prefix }: { hero: Hero; setHero: (h: Hero) => void; prefix: string }) {
  const set = (patch: Partial<Hero>) => setHero({ ...hero, ...patch });

  return (
    <Card title="Bloque 1 — Hero" subtitle="Cabecera de la ficha del servicio.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Badge superior" hint="ej. SERVICIOS INSTITUCIONALES">
          <input type="text" value={hero.badge ?? ""} onChange={(e) => set({ badge: e.target.value || undefined })} style={inputStyle} />
        </Field>
        <Field label="Ghost text" hint="Texto enorme decorativo de fondo (ej. BIBLIO, BAR).">
          <input type="text" value={hero.ghostText ?? ""} onChange={(e) => set({ ghostText: e.target.value || undefined })} placeholder={hero.title.toUpperCase()} style={inputStyle} />
        </Field>
      </div>
      <Field label="Título principal" required hint="Se muestra como título grande del hero (ej. 'Biblioteca').">
        <input type="text" value={hero.title} onChange={(e) => set({ title: e.target.value })} required style={inputStyle} />
      </Field>
      <Field label="Subtítulo">
        <textarea value={hero.subtitle ?? ""} onChange={(e) => set({ subtitle: e.target.value || undefined })} rows={2} style={textareaStyle} />
      </Field>
      <ImageUploader
        label="Imagen de fondo del hero (opcional)"
        value={hero.bgImageSrc ?? ""}
        onChange={(v) => set({ bgImageSrc: v || undefined })}
        prefix={prefix}
        previewAspect="16/9"
        hint="Aparece de fondo del hero con un overlay navy. Si la dejas vacía se usa el fondo genérico."
      />
    </Card>
  );
}

/* ─── Ficha (icono + color + descripción + stats + pasos + fotos) ─── */

function FichaEditor({ ficha, setFicha, prefix }: { ficha: Ficha; setFicha: (f: Ficha) => void; prefix: string }) {
  const set = (patch: Partial<Ficha>) => setFicha({ ...ficha, ...patch });

  /* descripción */
  const updateDesc = (i: number, value: string) =>
    set({ descripcion: ficha.descripcion.map((p, idx) => (idx === i ? value : p)) });
  const addDesc = () => set({ descripcion: [...ficha.descripcion, ""] });
  const removeDesc = (i: number) =>
    set({ descripcion: ficha.descripcion.filter((_, idx) => idx !== i) });
  const moveDesc = (i: number, dir: -1 | 1) => {
    const next = [...ficha.descripcion];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set({ descripcion: next });
  };

  /* stats */
  const updateStat = (i: number, patch: Partial<StatPlantillaK>) =>
    set({ stats: ficha.stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });
  const addStat = () =>
    set({ stats: [...ficha.stats, { iconName: "circle", label: "", valor: "" }] });
  const removeStat = (i: number) =>
    set({ stats: ficha.stats.filter((_, idx) => idx !== i) });
  const moveStat = (i: number, dir: -1 | 1) => {
    const next = [...ficha.stats];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set({ stats: next });
  };

  /* pasos */
  const updatePaso = (i: number, value: string) =>
    set({ pasos: ficha.pasos.map((p, idx) => (idx === i ? value : p)) });
  const addPaso = () => set({ pasos: [...ficha.pasos, ""] });
  const removePaso = (i: number) =>
    set({ pasos: ficha.pasos.filter((_, idx) => idx !== i) });
  const movePaso = (i: number, dir: -1 | 1) => {
    const next = [...ficha.pasos];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set({ pasos: next });
  };

  /* fotos */
  const setFoto = (i: number, src: string) => {
    const next = [...ficha.fotos] as [string, string, string];
    next[i] = src;
    set({ fotos: next });
  };

  return (
    <Card
      title="Bloque 2 — Ficha del servicio"
      subtitle="Icono y color del servicio, stats superiores, collage de 3 fotos, descripción en párrafos y pasos para acceder."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <IconPicker
          value={ficha.iconName}
          onChange={(name) => set({ iconName: name })}
          label="Icono del servicio"
          hint="Busca por palabra clave en inglés (ej. food, book, bus, heart, shield, message)."
        />
        <Field label="Color de acento" hint="Gold = servicio normal · Red = caso especial (ej. quejas-sugerencias).">
          <select
            value={ficha.color}
            onChange={(e) => set({ color: e.target.value as "gold" | "red" })}
            style={inputStyle}
          >
            <option value="gold">Gold (rojo)</option>
            <option value="red">Red (rojo)</option>
          </select>
        </Field>
      </div>

      {/* STATS */}
      <span style={fieldLabel}>Stats superiores {ficha.stats.length > 0 && `(${ficha.stats.length})`}</span>
      <p style={{ fontSize: 12, color: "#A0AABA", margin: 0, lineHeight: 1.5 }}>
        Recomendado 3 stats. Cada una: icono Lucide + etiqueta + valor.
      </p>
      <div className="flex flex-col gap-3">
        {ficha.stats.map((s, i) => (
          <div key={i} className="flex flex-col gap-3 p-4" style={panelStyle}>
            <RowHeader index={i} total={ficha.stats.length} onMove={(d) => moveStat(i, d)} onRemove={() => removeStat(i)} />
            <div className="grid grid-cols-1 md:grid-cols-[260px_1fr_1fr] gap-3">
              <IconPicker
                value={s.iconName}
                onChange={(name) => updateStat(i, { iconName: name })}
                label="Icono"
              />
              <Field label="Etiqueta" required hint='En mayúsculas (ej. "UBICACIÓN").'>
                <input type="text" value={s.label} onChange={(e) => updateStat(i, { label: e.target.value })} required style={inputStyle} />
              </Field>
              <Field label="Valor" required hint='ej. "Planta baja — Bloque A".'>
                <input type="text" value={s.valor} onChange={(e) => updateStat(i, { valor: e.target.value })} required style={inputStyle} />
              </Field>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={addStat} style={addButton} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4">
        <Plus size={14} strokeWidth={2.5} />
        Agregar stat
      </button>

      {/* FOTOS */}
      <span style={fieldLabel}>Collage de fotos (3)</span>
      <p style={{ fontSize: 12, color: "#A0AABA", margin: 0, lineHeight: 1.5 }}>
        En desktop: foto 1 grande a la izquierda + fotos 2 y 3 apiladas a la derecha.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ImageUploader label="Foto principal (grande)" value={ficha.fotos[0]} onChange={(v) => setFoto(0, v)} prefix={prefix} previewAspect="4/3" />
        <ImageUploader label="Foto secundaria 1" value={ficha.fotos[1]} onChange={(v) => setFoto(1, v)} prefix={prefix} previewAspect="4/3" />
        <ImageUploader label="Foto secundaria 2" value={ficha.fotos[2]} onChange={(v) => setFoto(2, v)} prefix={prefix} previewAspect="4/3" />
      </div>

      {/* DESCRIPCIÓN */}
      <span style={fieldLabel}>Descripción en párrafos {ficha.descripcion.length > 0 && `(${ficha.descripcion.length})`}</span>
      <p style={{ fontSize: 12, color: "#A0AABA", margin: 0, lineHeight: 1.5 }}>
        El primer párrafo se muestra más grande y oscuro.
      </p>
      <div className="flex flex-col gap-3">
        {ficha.descripcion.map((p, i) => (
          <div key={i} className="flex flex-col gap-2 p-4" style={panelStyle}>
            <RowHeader index={i} total={ficha.descripcion.length} onMove={(d) => moveDesc(i, d)} onRemove={() => removeDesc(i)} />
            <textarea value={p} onChange={(e) => updateDesc(i, e.target.value)} rows={3} style={textareaStyle} />
          </div>
        ))}
      </div>
      <button type="button" onClick={addDesc} style={addButton} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4">
        <Plus size={14} strokeWidth={2.5} />
        Agregar párrafo
      </button>

      {/* PASOS */}
      <span style={fieldLabel}>Pasos para acceder {ficha.pasos.length > 0 && `(${ficha.pasos.length})`}</span>
      <p style={{ fontSize: 12, color: "#A0AABA", margin: 0, lineHeight: 1.5 }}>
        Lista numerada. <strong>No se muestra</strong> si el color es Red (caso especial con formulario, ej. quejas-sugerencias).
      </p>
      <div className="flex flex-col gap-3">
        {ficha.pasos.map((p, i) => (
          <div key={i} className="flex flex-col gap-2 p-4" style={panelStyle}>
            <RowHeader index={i} total={ficha.pasos.length} onMove={(d) => movePaso(i, d)} onRemove={() => removePaso(i)} />
            <textarea value={p} onChange={(e) => updatePaso(i, e.target.value)} rows={2} style={textareaStyle} />
          </div>
        ))}
      </div>
      <button type="button" onClick={addPaso} style={addButton} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4">
        <Plus size={14} strokeWidth={2.5} />
        Agregar paso
      </button>
    </Card>
  );
}

/* ─── Helpers ─── */

function RowHeader({ index, total, onMove, onRemove }: { index: number; total: number; onMove: (d: -1 | 1) => void; onRemove: () => void }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span style={panelLabel}>#{index + 1}</span>
      <div className="flex items-center gap-1">
        <button type="button" onClick={() => onMove(-1)} disabled={index === 0} aria-label="Subir" style={iconButton(index === 0)}>
          <ArrowUp size={12} strokeWidth={2.5} />
        </button>
        <button type="button" onClick={() => onMove(1)} disabled={index === total - 1} aria-label="Bajar" style={iconButton(index === total - 1)}>
          <ArrowDown size={12} strokeWidth={2.5} />
        </button>
        <button type="button" onClick={onRemove} aria-label="Eliminar" style={{ ...iconButton(false), color: "#991B1B", borderColor: "#FECACA" }}>
          <Trash2 size={12} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

function Sticky({ publicada, setPublicada, state, isPending }: { publicada: boolean; setPublicada: (b: boolean) => void; state: PaginaActionState; isPending: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap sticky top-0 z-10" style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}>
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          name="publicada"
          checked={publicada}
          onChange={(e) => setPublicada(e.target.checked)}
          style={{ width: 16, height: 16, accentColor: "#1A2B4A" }}
        />
        <span style={{ fontSize: 14, fontWeight: 600, color: "#1A2B4A" }}>
          {publicada ? "Página publicada" : "Página en borrador (no visible al público)"}
        </span>
      </label>
      <div className="flex items-center gap-2">
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

function Field({ label, hint, required, children }: { label: string; hint?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span style={fieldLabel}>
        {label} {required && <span style={{ color: "#991B1B" }}>*</span>}
      </span>
      {children}
      {hint && <span style={hintStyle}>{hint}</span>}
    </div>
  );
}

const fieldLabel: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: "#6B6660", textTransform: "uppercase", letterSpacing: 0.5 };
const hintStyle: React.CSSProperties = { fontSize: 11, color: "#A0AABA", lineHeight: 1.5 };
const inputStyle: React.CSSProperties = { height: 38, border: "1px solid #E8E4DD", borderRadius: 6, paddingLeft: 12, paddingRight: 12, fontSize: 14, color: "#1A2B4A", background: "#FAFAF8", outline: "none", fontFamily: "inherit" };
const textareaStyle: React.CSSProperties = { ...inputStyle, height: "auto", minHeight: 70, paddingTop: 10, paddingBottom: 10, resize: "vertical" };
const panelStyle: React.CSSProperties = { background: "#FAFAF8", border: "1px solid #E8E4DD", borderRadius: 10 };
const panelLabel: React.CSSProperties = { fontSize: 12, fontWeight: 700, color: "#A0AABA", textTransform: "uppercase", letterSpacing: 0.5 };
const addButton: React.CSSProperties = { height: 36, background: "transparent", color: "#1A2B4A", border: "1px dashed #C9C4BB", borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" };

function iconButton(disabled: boolean): React.CSSProperties {
  return {
    width: 26,
    height: 26,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    color: disabled ? "#C9C4BB" : "#1A2B4A",
    border: "1px solid #E8E4DD",
    borderRadius: 4,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    fontFamily: "inherit",
  };
}

/**
 * Accesos a sistemas externos del colegio.
 *
 * Está en todas las fichas de servicio y no solo en la biblioteca: el paseo
 * virtual, la facturación y el portal Idukay son la misma necesidad en otras
 * páginas, y hasta ahora cada dirección nueva obligaba a tocar el código.
 */
function EnlacesExternosEditor({
  enlaces,
  setEnlaces,
}: {
  enlaces: EnlaceExternoServicio[];
  setEnlaces: (e: EnlaceExternoServicio[]) => void;
}) {
  const actualizar = (i: number, patch: Partial<EnlaceExternoServicio>) =>
    setEnlaces(enlaces.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
  const agregar = () => setEnlaces([...enlaces, { label: "", url: "", descripcion: "" }]);
  const quitar = (i: number) => setEnlaces(enlaces.filter((_, idx) => idx !== i));

  return (
    <Card
      title="Accesos a sistemas externos"
      subtitle="Botones hacia sistemas que no viven en esta web: la biblioteca virtual, la revista, el paseo virtual. Aparecen antes de la tarjeta destacada. Ojo: un acceso al que le falte el texto o la dirección NO se guarda — te lo avisa en rojo antes de que pulses Guardar."
    >
      {enlaces.length === 0 && (
        <p style={{ fontSize: 13.5, color: "#6B6660", margin: "0 0 12px", lineHeight: 1.55 }}>
          Todavía no hay ninguno.
        </p>
      )}

      {enlaces.map((e, i) => {
        const sinTexto = e.label.trim() === "";
        const sinUrl = e.url.trim() === "";
        const urlRara = !sinUrl && !/^(https?:\/\/|\/)/i.test(e.url.trim());
        const problema = sinTexto
          ? sinUrl
            ? null // Fila recién añadida, todavía vacía: no hay nada que avisar.
            : "Falta el texto del botón. Sin él, este acceso no se guardará."
          : sinUrl
            ? "Falta la dirección. Sin ella, este acceso no se guardará."
            : urlRara
              ? "La dirección tiene que empezar por https:// o por http://. Así como está, el acceso no aparecerá en la página."
              : null;

        return (
        <div
          key={i}
          style={{
            border: problema ? "1px solid #9e1915" : "1px solid #E8E4DD",
            borderRadius: 10,
            padding: 14,
            marginBottom: 12,
            background: "#FCFBF9",
          }}
        >
          <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#1A2B4A" }}>
              Acceso {i + 1}
            </span>
            <button
              type="button"
              onClick={() => quitar(i)}
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#9e1915",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Quitar
            </button>
          </div>
          <Field label="Texto del botón" hint='Ej. "Entrar a la biblioteca virtual".'>
            <input
              type="text"
              value={e.label}
              onChange={(ev) => actualizar(i, { label: ev.target.value })}
              placeholder="Entrar a la biblioteca virtual"
              maxLength={70}
              style={inputStyle}
            />
          </Field>
          <Field
            label="Dirección"
            hint="Pega la dirección completa, con http:// o https:// al principio."
          >
            <input
              type="text"
              value={e.url}
              onChange={(ev) => actualizar(i, { url: ev.target.value })}
              placeholder="https://..."
              style={inputStyle}
            />
          </Field>
          <Field label="Descripción (opcional)" hint="Una línea explicando qué se encuentra ahí.">
            <input
              type="text"
              value={e.descripcion ?? ""}
              onChange={(ev) => actualizar(i, { descripcion: ev.target.value })}
              placeholder="Consulta el catálogo y reserva libros en línea."
              maxLength={120}
              style={inputStyle}
            />
          </Field>
          {problema && (
            <p
              style={{
                fontSize: 13.5,
                fontWeight: 600,
                color: "#9e1915",
                margin: "4px 0 0",
                lineHeight: 1.5,
              }}
            >
              {problema}
            </p>
          )}
        </div>
        );
      })}

      <button
        type="button"
        onClick={agregar}
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#1A2B4A",
          background: "#FFFFFF",
          border: "1px solid #E8E4DD",
          borderRadius: 8,
          padding: "9px 16px",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        + Añadir acceso
      </button>
    </Card>
  );
}
