"use client";

import { useActionState, useState } from "react";
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { guardarPaginaAction, type PaginaActionState } from "../actions";
import type {
  ContenidoPlantillaF,
  StatPlantillaF,
  ChipPlantillaF,
  TarjetaPlantillaF,
  PlataformaPlantillaF,
  SeccionInferiorPlantillaF,
} from "../../plantillas";
import { ImageUploader } from "@/components/admin/ImageUploader";

type SeccionInferiorTipo = "ninguna" | "tarjetas" | "plataformas";

export function EditorPlantillaF({
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
  initialContenido: ContenidoPlantillaF;
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

  // Hero
  const [heroBadge, setHeroBadge] = useState(initialContenido.hero?.badge ?? "");
  const [heroTitle, setHeroTitle] = useState(initialContenido.hero?.title ?? "");
  const [heroSubtitle, setHeroSubtitle] = useState(initialContenido.hero?.subtitle ?? "");
  const [heroGhostText, setHeroGhostText] = useState(initialContenido.hero?.ghostText ?? "");
  const [heroFootnote, setHeroFootnote] = useState(initialContenido.hero?.footnote ?? "");
  const [heroBgImageSrc, setHeroBgImageSrc] = useState(initialContenido.hero?.bgImageSrc ?? "");

  // Stats (3 fijas)
  const initialStats = initialContenido.stats ?? [
    { label: "", value: "" },
    { label: "", value: "" },
    { label: "", value: "" },
  ];
  const [stat0, setStat0] = useState<StatPlantillaF>(initialStats[0]);
  const [stat1, setStat1] = useState<StatPlantillaF>(initialStats[1]);
  const [stat2, setStat2] = useState<StatPlantillaF>(initialStats[2]);

  // Intro
  const [introBadge, setIntroBadge] = useState(initialContenido.intro?.badge ?? "");
  const [introHeading, setIntroHeading] = useState(initialContenido.intro?.heading ?? "");
  const [introHeadingHighlight, setIntroHeadingHighlight] = useState(
    initialContenido.intro?.headingHighlight ?? ""
  );
  const [paragraphs, setParagraphs] = useState<string[]>(
    initialContenido.intro?.paragraphs?.length ? initialContenido.intro.paragraphs : [""]
  );
  const [chipsLabel, setChipsLabel] = useState(initialContenido.intro?.chipsLabel ?? "Componentes");
  const [chips, setChips] = useState<ChipPlantillaF[]>(initialContenido.intro?.chips ?? []);
  const [note, setNote] = useState(initialContenido.intro?.note ?? "");
  const [photo0, setPhoto0] = useState(initialContenido.intro?.photos?.[0] ?? "");
  const [photo1, setPhoto1] = useState(initialContenido.intro?.photos?.[1] ?? "");
  const [photo2, setPhoto2] = useState(initialContenido.intro?.photos?.[2] ?? "");
  const [badgeCollage, setBadgeCollage] = useState(
    initialContenido.intro?.badgeCollage ?? "ATENAS ★"
  );

  // Sección inferior
  const initialSI: SeccionInferiorPlantillaF =
    initialContenido.seccionInferior ?? { tipo: "ninguna" };
  const [siTipo, setSiTipo] = useState<SeccionInferiorTipo>(initialSI.tipo);
  const [siBadge, setSiBadge] = useState(
    initialSI.tipo !== "ninguna" ? initialSI.badge ?? "" : ""
  );
  const [siTitulo, setSiTitulo] = useState(
    initialSI.tipo !== "ninguna" ? initialSI.titulo ?? "" : ""
  );
  const [siBgPhoto, setSiBgPhoto] = useState(
    initialSI.tipo !== "ninguna" ? initialSI.bgPhoto ?? "" : ""
  );
  const [siColumnas, setSiColumnas] = useState<3 | 4 | 5>(
    initialSI.tipo === "tarjetas" ? initialSI.columnas : 3
  );
  const [tarjetas, setTarjetas] = useState<TarjetaPlantillaF[]>(
    initialSI.tipo === "tarjetas" ? initialSI.items : []
  );
  const [plataformas, setPlataformas] = useState<PlataformaPlantillaF[]>(
    initialSI.tipo === "plataformas" ? initialSI.items : []
  );

  // Helpers — paragraphs
  const updateParagraph = (i: number, val: string) =>
    setParagraphs((prev) => prev.map((p, idx) => (idx === i ? val : p)));
  const addParagraph = () => setParagraphs((prev) => [...prev, ""]);
  const removeParagraph = (i: number) =>
    setParagraphs((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));

  // Helpers — chips
  const updateChip = (i: number, val: string) =>
    setChips((prev) => prev.map((c, idx) => (idx === i ? { texto: val } : c)));
  const addChip = () => setChips((prev) => [...prev, { texto: "" }]);
  const removeChip = (i: number) =>
    setChips((prev) => prev.filter((_, idx) => idx !== i));
  const moveChip = (i: number, dir: -1 | 1) =>
    setChips((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  // Helpers — tarjetas
  const updateTarjeta = (i: number, patch: Partial<TarjetaPlantillaF>) =>
    setTarjetas((prev) => prev.map((t, idx) => (idx === i ? { ...t, ...patch } : t)));
  const addTarjeta = () =>
    setTarjetas((prev) => [...prev, { title: "", description: "" }]);
  const removeTarjeta = (i: number) =>
    setTarjetas((prev) => prev.filter((_, idx) => idx !== i));
  const moveTarjeta = (i: number, dir: -1 | 1) =>
    setTarjetas((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  // Helpers — plataformas
  const updatePlataforma = (i: number, patch: Partial<PlataformaPlantillaF>) =>
    setPlataformas((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  const addPlataforma = () =>
    setPlataformas((prev) => [...prev, { name: "", detail: "" }]);
  const removePlataforma = (i: number) =>
    setPlataformas((prev) => prev.filter((_, idx) => idx !== i));
  const movePlataforma = (i: number, dir: -1 | 1) =>
    setPlataformas((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  // Construir JSON final
  const seccionInferiorJson: SeccionInferiorPlantillaF =
    siTipo === "ninguna"
      ? { tipo: "ninguna" }
      : siTipo === "tarjetas"
        ? {
            tipo: "tarjetas",
            badge: siBadge || undefined,
            titulo: siTitulo || undefined,
            bgPhoto: siBgPhoto || undefined,
            columnas: siColumnas,
            items: tarjetas.filter((t) => t.title.trim() !== ""),
          }
        : {
            tipo: "plataformas",
            badge: siBadge || undefined,
            titulo: siTitulo || undefined,
            bgPhoto: siBgPhoto || undefined,
            items: plataformas.filter((p) => p.name.trim() !== ""),
          };

  const contenidoJson = JSON.stringify({
    hero: {
      badge: heroBadge || undefined,
      title: heroTitle,
      subtitle: heroSubtitle || undefined,
      ghostText: heroGhostText || undefined,
      footnote: heroFootnote || undefined,
      bgImageSrc: heroBgImageSrc || undefined,
    },
    stats: [stat0, stat1, stat2],
    intro: {
      badge: introBadge,
      heading: introHeading,
      headingHighlight: introHeadingHighlight || undefined,
      paragraphs: paragraphs.filter((p) => p.trim() !== ""),
      chipsLabel: chipsLabel || undefined,
      chips: chips.filter((c) => c.texto.trim() !== ""),
      note: note || undefined,
      photos: [photo0, photo1, photo2],
      badgeCollage: badgeCollage || undefined,
    },
    seccionInferior: seccionInferiorJson,
  });

  const safePrefix = `paginas/${slug.replace(/[^a-z0-9-]/g, "-")}`;

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="id" value={paginaId} />
      <input type="hidden" name="contenido" value={contenidoJson} />

      <div
        className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap sticky top-0 z-10"
        style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
      >
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="publicada"
            checked={publicada}
            onChange={(e) => setPublicada(e.target.checked)}
            style={{ width: 16, height: 16, accentColor: "#1A2B4A" }}
          />
          <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>
            {publicada ? "Página publicada" : "Página en borrador (no visible al público)"}
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

      {/* Datos básicos */}
      <Card title="Información general">
        <Field label="Título interno" hint="Solo se ve en el backoffice. No afecta la página pública.">
          <input
            type="text"
            name="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            style={inputStyle}
          />
        </Field>
        <Field label="Slug (URL)" hint="No editable.">
          <input
            type="text"
            value={`/${slug}`}
            readOnly
            disabled
            style={{ ...inputStyle, background: "#F4F1EB", color: "#A0AABA" }}
          />
        </Field>
      </Card>

      {/* Hero */}
      <Card title="Hero (cabecera)" subtitle="Primera sección de la página, con título grande sobre fondo navy.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Badge superior" hint="Texto pequeño dorado sobre el título.">
            <input
              type="text"
              value={heroBadge}
              onChange={(e) => setHeroBadge(e.target.value)}
              placeholder="ej. BACHILLERATO IB"
              style={inputStyle}
            />
          </Field>
          <Field label="Ghost text" hint="Texto enorme decorativo de fondo.">
            <input
              type="text"
              value={heroGhostText}
              onChange={(e) => setHeroGhostText(e.target.value)}
              placeholder={heroTitle.toUpperCase()}
              style={inputStyle}
            />
          </Field>
        </div>
        <Field label="Título principal" required>
          <input
            type="text"
            value={heroTitle}
            onChange={(e) => setHeroTitle(e.target.value)}
            required
            style={inputStyle}
          />
        </Field>
        <Field label="Subtítulo">
          <textarea
            value={heroSubtitle}
            onChange={(e) => setHeroSubtitle(e.target.value)}
            rows={2}
            style={{ ...inputStyle, height: "auto", minHeight: 50, paddingTop: 10, paddingBottom: 10, resize: "vertical" }}
          />
        </Field>
        <Field label="Pie del hero" hint="Texto pequeño al final del hero. Déjalo vacío si quieres ocultarlo.">
          <input
            type="text"
            value={heroFootnote}
            onChange={(e) => setHeroFootnote(e.target.value)}
            placeholder="Unidad Educativa Atenas · Izamba, Ambato"
            style={inputStyle}
          />
        </Field>
        <ImageUploader
          label="Imagen de fondo del hero"
          value={heroBgImageSrc}
          onChange={setHeroBgImageSrc}
          prefix={`${safePrefix}/hero`}
          previewAspect="16/9"
          hint="Aparece de fondo del hero con un overlay navy. Si la dejas vacía se usa la imagen genérica por defecto."
        />
      </Card>

      {/* Stats strip */}
      <Card
        title="Stats (3 datos clave)"
        subtitle="Strip horizontal sobre fondo blanco, justo después del hero. Cada stat tiene una etiqueta dorada y un valor en navy."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {([stat0, stat1, stat2] as StatPlantillaF[]).map((s, i) => {
            const setter = i === 0 ? setStat0 : i === 1 ? setStat1 : setStat2;
            return (
              <div key={i} className="flex flex-col gap-3 p-4" style={panelStyle}>
                <span style={panelLabel}>Stat #{i + 1}</span>
                <Field label="Etiqueta" hint="Texto pequeño dorado en mayúsculas.">
                  <input
                    type="text"
                    value={s.label}
                    onChange={(e) => setter({ ...s, label: e.target.value })}
                    placeholder={["Programa", "Nivel", "Acreditación"][i]}
                    style={inputStyle}
                  />
                </Field>
                <Field label="Valor" hint="Texto principal en navy.">
                  <input
                    type="text"
                    value={s.value}
                    onChange={(e) => setter({ ...s, value: e.target.value })}
                    placeholder={["Diploma del IB", "1ro y 2do Bachillerato", "IBO"][i]}
                    style={inputStyle}
                  />
                </Field>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Intro */}
      <Card
        title="Sección de introducción"
        subtitle="Bloque grande con encabezado, párrafos, chips, nota destacada y collage de 3 fotos en desktop."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Badge de la sección" required>
            <input
              type="text"
              value={introBadge}
              onChange={(e) => setIntroBadge(e.target.value)}
              required
              placeholder="Bachillerato Internacional"
              style={inputStyle}
            />
          </Field>
          <Field
            label="Parte resaltada del título"
            hint="Si está presente, esa parte del título se subraya con un trazo dorado."
          >
            <input
              type="text"
              value={introHeadingHighlight}
              onChange={(e) => setIntroHeadingHighlight(e.target.value)}
              placeholder='ej. "líderes del mundo"'
              style={inputStyle}
            />
          </Field>
        </div>
        <Field label="Encabezado (h2)" required>
          <textarea
            value={introHeading}
            onChange={(e) => setIntroHeading(e.target.value)}
            rows={2}
            required
            placeholder="10 atributos que forman líderes del mundo"
            style={{ ...inputStyle, height: "auto", minHeight: 50, paddingTop: 10, paddingBottom: 10, resize: "vertical" }}
          />
        </Field>

        {/* Párrafos */}
        <div className="flex flex-col gap-3">
          <span style={fieldLabel}>Párrafos {paragraphs.length > 0 && `(${paragraphs.length})`}</span>
          <div className="flex flex-col gap-2">
            {paragraphs.map((p, i) => (
              <div key={i} className="flex gap-2 items-start">
                <textarea
                  value={p}
                  onChange={(e) => updateParagraph(i, e.target.value)}
                  rows={3}
                  placeholder={i === 0 ? "Párrafo principal (más grande, oscuro)" : "Párrafo siguiente"}
                  style={{ ...inputStyle, height: "auto", minHeight: 70, paddingTop: 10, paddingBottom: 10, resize: "vertical", flex: 1 }}
                />
                <button
                  type="button"
                  onClick={() => removeParagraph(i)}
                  disabled={paragraphs.length === 1}
                  aria-label="Eliminar párrafo"
                  style={{ ...iconButton(paragraphs.length === 1), color: "#991B1B", borderColor: "#FECACA" }}
                >
                  <Trash2 size={12} strokeWidth={2.5} />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addParagraph}
            className="flex items-center justify-center gap-1.5 self-start mt-1 px-4"
            style={addButton}
          >
            <Plus size={14} strokeWidth={2.5} />
            Agregar párrafo
          </button>
        </div>

        {/* Chips */}
        <div className="flex flex-col gap-3">
          <Field label="Etiqueta de los chips" hint='Aparece sobre los chips. Default: "Componentes" para IB, "Metodologías" para Niveles.'>
            <input
              type="text"
              value={chipsLabel}
              onChange={(e) => setChipsLabel(e.target.value)}
              placeholder="Componentes"
              style={inputStyle}
            />
          </Field>
          <span style={fieldLabel}>Chips {chips.length > 0 && `(${chips.length})`}</span>
          {chips.length === 0 && (
            <p className="px-4 py-3 rounded-md" style={{ background: "#FAFAF8", border: "1px dashed #C9C4BB", fontSize: 12, color: "#6B6660", margin: 0, textAlign: "center" }}>
              Aún no hay chips. Agrega el primero abajo.
            </p>
          )}
          <div className="flex flex-col gap-2">
            {chips.map((c, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={c.texto}
                  onChange={(e) => updateChip(i, e.target.value)}
                  placeholder="ej. CAS"
                  style={{ ...inputStyle, flex: 1 }}
                />
                <button type="button" onClick={() => moveChip(i, -1)} disabled={i === 0} aria-label="Subir" style={iconButton(i === 0)}>
                  <ArrowUp size={12} strokeWidth={2.5} />
                </button>
                <button type="button" onClick={() => moveChip(i, 1)} disabled={i === chips.length - 1} aria-label="Bajar" style={iconButton(i === chips.length - 1)}>
                  <ArrowDown size={12} strokeWidth={2.5} />
                </button>
                <button type="button" onClick={() => removeChip(i)} aria-label="Eliminar" style={{ ...iconButton(false), color: "#991B1B", borderColor: "#FECACA" }}>
                  <Trash2 size={12} strokeWidth={2.5} />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addChip} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4" style={addButton}>
            <Plus size={14} strokeWidth={2.5} />
            Agregar chip
          </button>
        </div>

        {/* Nota */}
        <Field label="Nota destacada" hint="Caja con borde dorado a la izquierda, debajo de los chips.">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            style={{ ...inputStyle, height: "auto", minHeight: 70, paddingTop: 10, paddingBottom: 10, resize: "vertical" }}
          />
        </Field>

        {/* Photos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <ImageUploader
            label="Foto principal del collage"
            value={photo0}
            onChange={setPhoto0}
            prefix={`${safePrefix}/collage`}
            previewAspect="4/3"
            hint="Foto grande izquierda. También se usa en mobile."
          />
          <ImageUploader
            label="Foto secundaria"
            value={photo1}
            onChange={setPhoto1}
            prefix={`${safePrefix}/collage`}
            previewAspect="4/3"
            hint="Foto pequeña arriba derecha (solo desktop)."
          />
          <ImageUploader
            label="Foto terciaria"
            value={photo2}
            onChange={setPhoto2}
            prefix={`${safePrefix}/collage`}
            previewAspect="4/3"
            hint="Foto pequeña abajo izquierda (solo desktop)."
          />
        </div>

        <Field label="Texto del badge dorado del collage" hint='Aparece sobre el collage. Ej: "ATENAS IB ★", "ATENAS ★".'>
          <input
            type="text"
            value={badgeCollage}
            onChange={(e) => setBadgeCollage(e.target.value)}
            placeholder="ATENAS ★"
            style={inputStyle}
          />
        </Field>
      </Card>

      {/* Sección inferior */}
      <Card
        title="Sección inferior (opcional)"
        subtitle="Banda oscura debajo del bloque principal. Elige entre tarjetas (grid de cards) o plataformas (apps con descripción), o déjala desactivada."
      >
        <Field label="Tipo de sección inferior">
          <select
            value={siTipo}
            onChange={(e) => setSiTipo(e.target.value as SeccionInferiorTipo)}
            style={{ ...inputStyle, paddingRight: 28, cursor: "pointer" }}
          >
            <option value="ninguna">Ninguna (no mostrar)</option>
            <option value="tarjetas">Tarjetas (grid de 3, 4 o 5 columnas)</option>
            <option value="plataformas">Plataformas (apps con nombre + detalle)</option>
          </select>
        </Field>

        {siTipo !== "ninguna" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Badge de la sección">
                <input type="text" value={siBadge} onChange={(e) => setSiBadge(e.target.value)} placeholder="ej. Marco de políticas" style={inputStyle} />
              </Field>
              <Field label="Título (h3)">
                <input type="text" value={siTitulo} onChange={(e) => setSiTitulo(e.target.value)} placeholder="ej. Políticas institucionales" style={inputStyle} />
              </Field>
            </div>
            <ImageUploader
              label="Foto de fondo"
              value={siBgPhoto}
              onChange={setSiBgPhoto}
              prefix={`${safePrefix}/dark-bg`}
              previewAspect="16/9"
              hint="Foto que aparece de fondo con efecto parallax y opacidad baja."
            />
          </>
        )}

        {siTipo === "tarjetas" && (
          <>
            <Field label="Columnas">
              <select
                value={siColumnas}
                onChange={(e) => setSiColumnas(Number(e.target.value) as 3 | 4 | 5)}
                style={{ ...inputStyle, paddingRight: 28, cursor: "pointer" }}
              >
                <option value={3}>3 columnas</option>
                <option value={4}>4 columnas</option>
                <option value={5}>5 columnas</option>
              </select>
            </Field>

            <div className="flex flex-col gap-3">
              <span style={fieldLabel}>Tarjetas {tarjetas.length > 0 && `(${tarjetas.length})`}</span>
              {tarjetas.length === 0 && (
                <p className="px-4 py-3 rounded-md" style={{ background: "#FAFAF8", border: "1px dashed #C9C4BB", fontSize: 12, color: "#6B6660", margin: 0, textAlign: "center" }}>
                  Aún no hay tarjetas. Agrega la primera abajo.
                </p>
              )}
              <div className="flex flex-col gap-3">
                {tarjetas.map((t, i) => (
                  <div key={i} className="flex flex-col gap-3 p-4" style={panelStyle}>
                    <div className="flex items-center justify-between gap-2">
                      <span style={panelLabel}>Tarjeta #{i + 1}</span>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => moveTarjeta(i, -1)} disabled={i === 0} aria-label="Subir" style={iconButton(i === 0)}>
                          <ArrowUp size={12} strokeWidth={2.5} />
                        </button>
                        <button type="button" onClick={() => moveTarjeta(i, 1)} disabled={i === tarjetas.length - 1} aria-label="Bajar" style={iconButton(i === tarjetas.length - 1)}>
                          <ArrowDown size={12} strokeWidth={2.5} />
                        </button>
                        <button type="button" onClick={() => removeTarjeta(i)} aria-label="Eliminar" style={{ ...iconButton(false), color: "#991B1B", borderColor: "#FECACA" }}>
                          <Trash2 size={12} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                    <Field label="Título" required>
                      <input type="text" value={t.title} onChange={(e) => updateTarjeta(i, { title: e.target.value })} required style={inputStyle} />
                    </Field>
                    <Field label="Descripción">
                      <textarea value={t.description} onChange={(e) => updateTarjeta(i, { description: e.target.value })} rows={3} style={{ ...inputStyle, height: "auto", minHeight: 70, paddingTop: 10, paddingBottom: 10, resize: "vertical" }} />
                    </Field>
                  </div>
                ))}
              </div>
              <button type="button" onClick={addTarjeta} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4" style={addButton}>
                <Plus size={14} strokeWidth={2.5} />
                Agregar tarjeta
              </button>
            </div>
          </>
        )}

        {siTipo === "plataformas" && (
          <div className="flex flex-col gap-3">
            <span style={fieldLabel}>Plataformas {plataformas.length > 0 && `(${plataformas.length})`}</span>
            {plataformas.length === 0 && (
              <p className="px-4 py-3 rounded-md" style={{ background: "#FAFAF8", border: "1px dashed #C9C4BB", fontSize: 12, color: "#6B6660", margin: 0, textAlign: "center" }}>
                Aún no hay plataformas. Agrega la primera abajo.
              </p>
            )}
            <div className="flex flex-col gap-3">
              {plataformas.map((p, i) => (
                <div key={i} className="flex flex-col gap-3 p-4" style={panelStyle}>
                  <div className="flex items-center justify-between gap-2">
                    <span style={panelLabel}>Plataforma #{i + 1}</span>
                    <div className="flex items-center gap-1">
                      <button type="button" onClick={() => movePlataforma(i, -1)} disabled={i === 0} aria-label="Subir" style={iconButton(i === 0)}>
                        <ArrowUp size={12} strokeWidth={2.5} />
                      </button>
                      <button type="button" onClick={() => movePlataforma(i, 1)} disabled={i === plataformas.length - 1} aria-label="Bajar" style={iconButton(i === plataformas.length - 1)}>
                        <ArrowDown size={12} strokeWidth={2.5} />
                      </button>
                      <button type="button" onClick={() => removePlataforma(i)} aria-label="Eliminar" style={{ ...iconButton(false), color: "#991B1B", borderColor: "#FECACA" }}>
                        <Trash2 size={12} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                  <Field label="Nombre" required>
                    <input type="text" value={p.name} onChange={(e) => updatePlataforma(i, { name: e.target.value })} required placeholder="ej. Mangahigh" style={inputStyle} />
                  </Field>
                  <Field label="Descripción">
                    <textarea value={p.detail} onChange={(e) => updatePlataforma(i, { detail: e.target.value })} rows={3} placeholder="Descripción corta de la plataforma." style={{ ...inputStyle, height: "auto", minHeight: 70, paddingTop: 10, paddingBottom: 10, resize: "vertical" }} />
                  </Field>
                </div>
              ))}
            </div>
            <button type="button" onClick={addPlataforma} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4" style={addButton}>
              <Plus size={14} strokeWidth={2.5} />
              Agregar plataforma
            </button>
          </div>
        )}
      </Card>

      {/* SEO */}
      <Card title="SEO" subtitle="Metadatos para motores de búsqueda y previsualizaciones cuando se comparte el link.">
        <Field label="Meta title" hint="Aparece en la pestaña del navegador y en resultados de Google. Recomendado: 50-60 caracteres.">
          <input type="text" name="meta_title" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} maxLength={120} style={inputStyle} />
        </Field>
        <Field label="Meta description" hint="Resumen de 1-2 líneas. Recomendado: 140-160 caracteres.">
          <textarea name="meta_description" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={2} maxLength={300} style={{ ...inputStyle, height: "auto", minHeight: 50, paddingTop: 10, paddingBottom: 10, resize: "vertical" }} />
        </Field>
      </Card>
    </form>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 p-5" style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}>
      <div className="flex flex-col gap-1">
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 12, color: "#6B6660", margin: 0, lineHeight: 1.5 }}>{subtitle}</p>}
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

const fieldLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#6B6660",
  textTransform: "uppercase",
  letterSpacing: 0.5,
};

const hintStyle: React.CSSProperties = {
  fontSize: 10,
  color: "#A0AABA",
  lineHeight: 1.5,
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

const panelStyle: React.CSSProperties = {
  background: "#FAFAF8",
  border: "1px solid #E8E4DD",
  borderRadius: 10,
};

const panelLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#A0AABA",
  textTransform: "uppercase",
  letterSpacing: 0.5,
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
