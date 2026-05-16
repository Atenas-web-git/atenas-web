"use client";

import { useActionState, useState } from "react";
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { guardarPaginaAction, type PaginaActionState } from "../actions";
import type {
  ContenidoPlantillaD,
  StatPlantillaD,
  FilaPlantillaD,
} from "../../plantillas";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { AnchorIdField } from "./AnchorIdField";

export function EditorPlantillaD({
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
  initialContenido: ContenidoPlantillaD;
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

  // Intro
  const [introBadge, setIntroBadge] = useState(initialContenido.intro?.badge ?? "");
  const [introHeading, setIntroHeading] = useState(initialContenido.intro?.heading ?? "");
  const [introParagraphs, setIntroParagraphs] = useState<string[]>(
    initialContenido.intro?.paragraphs ?? []
  );

  // Stats
  const [stats, setStats] = useState<StatPlantillaD[]>(initialContenido.stats ?? []);

  // Tabla
  const [tablaBadge, setTablaBadge] = useState(initialContenido.tabla?.badge ?? "");
  const [tablaHeading, setTablaHeading] = useState(initialContenido.tabla?.heading ?? "");
  const [tablaDescripcion, setTablaDescripcion] = useState(
    initialContenido.tabla?.descripcion ?? ""
  );
  const [columnas, setColumnas] = useState<string[]>(
    initialContenido.tabla?.columnas ?? ["Concepto", "Detalle"]
  );
  const [filas, setFilas] = useState<FilaPlantillaD[]>(
    initialContenido.tabla?.filas ?? []
  );
  const [acentoPrimeraColumna, setAcentoPrimeraColumna] = useState(
    initialContenido.tabla?.acentoPrimeraColumna ?? true
  );
  const [destacarUltimaColumna, setDestacarUltimaColumna] = useState(
    initialContenido.tabla?.destacarUltimaColumna ?? false
  );

  // Nota
  const [notaIcono, setNotaIcono] = useState(initialContenido.nota?.icono ?? "ℹ️");
  const [notaTexto, setNotaTexto] = useState(initialContenido.nota?.texto ?? "");

  // ID de anclaje
  const [anchorId, setAnchorId] = useState(initialContenido.anchorId ?? "");

  // ─── Handlers para listas dinámicas ───────────────────────────

  const updateParagraph = (i: number, value: string) =>
    setIntroParagraphs((prev) => prev.map((p, idx) => (idx === i ? value : p)));
  const addParagraph = () => setIntroParagraphs((prev) => [...prev, ""]);
  const removeParagraph = (i: number) =>
    setIntroParagraphs((prev) => prev.filter((_, idx) => idx !== i));

  const updateStat = (i: number, patch: Partial<StatPlantillaD>) =>
    setStats((prev) =>
      prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s))
    );
  const addStat = () =>
    setStats((prev) => [...prev, { valor: "—", label: "Nueva stat" }]);
  const removeStat = (i: number) =>
    setStats((prev) => prev.filter((_, idx) => idx !== i));

  const updateColumna = (i: number, value: string) =>
    setColumnas((prev) => prev.map((c, idx) => (idx === i ? value : c)));
  const addColumna = () =>
    setColumnas((prev) => {
      const nueva = [...prev, "Nueva columna"];
      // Agregar celda vacía a cada fila para mantener consistencia
      setFilas((rows) =>
        rows.map((r) => ({ ...r, celdas: [...r.celdas, ""] }))
      );
      return nueva;
    });
  const removeColumna = (i: number) => {
    if (columnas.length <= 1) return;
    setColumnas((prev) => prev.filter((_, idx) => idx !== i));
    setFilas((rows) =>
      rows.map((r) => ({ ...r, celdas: r.celdas.filter((_, idx) => idx !== i) }))
    );
  };

  const updateCelda = (rowIdx: number, colIdx: number, value: string) =>
    setFilas((prev) =>
      prev.map((r, i) =>
        i !== rowIdx
          ? r
          : {
              ...r,
              celdas: r.celdas.map((c, j) => (j === colIdx ? value : c)),
            }
      )
    );

  const addFila = () =>
    setFilas((prev) => [
      ...prev,
      { celdas: columnas.map(() => ""), destacada: false },
    ]);
  const removeFila = (i: number) =>
    setFilas((prev) => prev.filter((_, idx) => idx !== i));
  const moveFila = (i: number, direction: -1 | 1) => {
    setFilas((prev) => {
      const next = [...prev];
      const j = i + direction;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };
  const toggleDestacada = (i: number) =>
    setFilas((prev) =>
      prev.map((r, idx) => (idx === i ? { ...r, destacada: !r.destacada } : r))
    );

  // ─── Serialización del contenido ──────────────────────────────

  const contenidoJson = JSON.stringify({
    hero: {
      badge: heroBadge || undefined,
      title: heroTitle,
      subtitle: heroSubtitle || undefined,
      ghostText: heroGhostText || undefined,
      footnote: heroFootnote || undefined,
      bgImageSrc: heroBgImageSrc || undefined,
    },
    intro:
      introHeading || introParagraphs.length > 0
        ? {
            badge: introBadge || undefined,
            heading: introHeading || undefined,
            paragraphs: introParagraphs.filter((p) => p.trim() !== ""),
          }
        : undefined,
    stats: stats.length > 0 ? stats : undefined,
    tabla:
      filas.length > 0
        ? {
            badge: tablaBadge || undefined,
            heading: tablaHeading || undefined,
            descripcion: tablaDescripcion || undefined,
            columnas,
            filas: filas.map((f) => ({
              celdas: f.celdas,
              destacada: f.destacada || undefined,
            })),
            acentoPrimeraColumna,
            destacarUltimaColumna,
          }
        : undefined,
    nota: notaTexto.trim() ? { icono: notaIcono || undefined, texto: notaTexto } : undefined,
    anchorId: anchorId.trim() || undefined,
  });

  const safePrefix = `paginas/${slug.replace(/[^a-z0-9-]/g, "-")}`;

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="id" value={paginaId} />
      <input type="hidden" name="contenido" value={contenidoJson} />

      {/* Header sticky */}
      <div
        className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap sticky top-0 z-10"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8E4DD",
          borderRadius: 12,
        }}
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

      {/* Información general */}
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
        <Field label="Slug (URL)" hint="No editable. Para cambiar el slug, crea otra página y elimina esta.">
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
      <Card title="Hero (cabecera)" subtitle="Cabecera grande con título sobre fondo navy.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Badge superior" hint="Texto pequeño dorado sobre el título.">
            <input type="text" value={heroBadge} onChange={(e) => setHeroBadge(e.target.value)} placeholder="MATRÍCULAS" style={inputStyle} />
          </Field>
          <Field label="Ghost text" hint="Texto enorme decorativo de fondo.">
            <input type="text" value={heroGhostText} onChange={(e) => setHeroGhostText(e.target.value)} placeholder={heroTitle.toUpperCase()} style={inputStyle} />
          </Field>
        </div>
        <Field label="Título principal" required>
          <input type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} required style={inputStyle} />
        </Field>
        <Field label="Subtítulo" hint="Línea explicativa debajo del título.">
          <input type="text" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Pie del hero" hint='Default: "Unidad Educativa Atenas · Izamba, Ambato".'>
          <input type="text" value={heroFootnote} onChange={(e) => setHeroFootnote(e.target.value)} placeholder="Unidad Educativa Atenas · Izamba, Ambato" style={inputStyle} />
        </Field>
        <ImageUploader
          label="Imagen de fondo del hero"
          value={heroBgImageSrc}
          onChange={setHeroBgImageSrc}
          prefix={`${safePrefix}/hero`}
          previewAspect="16/9"
          hint="Si la dejas vacía se usa la imagen genérica por defecto."
        />
      </Card>

      {/* Intro opcional */}
      <Card
        title="Sección introductoria (opcional)"
        subtitle="Encabezado y párrafos de contexto antes de las stats y la tabla. Si no la necesitas, déjala en blanco."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Badge">
            <input type="text" value={introBadge} onChange={(e) => setIntroBadge(e.target.value)} placeholder="VALORES 2026-2027" style={inputStyle} />
          </Field>
          <Field label="Encabezado (h2)">
            <input type="text" value={introHeading} onChange={(e) => setIntroHeading(e.target.value)} placeholder="Estructura de costos por nivel" style={inputStyle} />
          </Field>
        </div>
        <div className="flex flex-col gap-2">
          <span style={fieldLabel}>Párrafos</span>
          {introParagraphs.map((p, i) => (
            <div key={i} className="flex items-start gap-2">
              <textarea
                value={p}
                onChange={(e) => updateParagraph(i, e.target.value)}
                rows={2}
                style={{ ...inputStyle, height: "auto", minHeight: 50, paddingTop: 10, paddingBottom: 10, flex: 1, resize: "vertical" }}
              />
              <button type="button" onClick={() => removeParagraph(i)} aria-label="Eliminar" style={iconButton(false, "#991B1B", "#FECACA")}>
                <Trash2 size={12} strokeWidth={2.5} />
              </button>
            </div>
          ))}
          <button type="button" onClick={addParagraph} style={dashedAddBtn}>
            <Plus size={12} strokeWidth={2.5} />
            Agregar párrafo
          </button>
        </div>
      </Card>

      {/* Stats */}
      <Card
        title="Stats numéricas (opcional)"
        subtitle="Cifras destacadas que aparecen como tarjetas pequeñas. Útil para resaltar números clave (años, niveles, descuentos)."
      >
        <div className="flex flex-col gap-3">
          {stats.map((s, i) => (
            <div
              key={i}
              className="grid gap-2 p-3"
              style={{
                gridTemplateColumns: "minmax(120px, 1fr) 2fr 32px",
                background: "#FAFAF8",
                border: "1px solid #E8E4DD",
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <input
                type="text"
                value={s.valor}
                onChange={(e) => updateStat(i, { valor: e.target.value })}
                placeholder="50"
                style={inputStyle}
              />
              <input
                type="text"
                value={s.label}
                onChange={(e) => updateStat(i, { label: e.target.value })}
                placeholder="años de excelencia"
                style={inputStyle}
              />
              <button type="button" onClick={() => removeStat(i)} aria-label="Eliminar" style={iconButton(false, "#991B1B", "#FECACA")}>
                <Trash2 size={12} strokeWidth={2.5} />
              </button>
            </div>
          ))}
          <button type="button" onClick={addStat} style={dashedAddBtn}>
            <Plus size={12} strokeWidth={2.5} />
            Agregar stat
          </button>
        </div>
      </Card>

      {/* Tabla */}
      <Card
        title="Tabla configurable"
        subtitle="Define las columnas y luego agrega filas. Las celdas son texto libre."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Badge de la tabla">
            <input type="text" value={tablaBadge} onChange={(e) => setTablaBadge(e.target.value)} placeholder="VALORES 2026-2027" style={inputStyle} />
          </Field>
          <Field label="Encabezado de la tabla">
            <input type="text" value={tablaHeading} onChange={(e) => setTablaHeading(e.target.value)} placeholder="Estructura de costos" style={inputStyle} />
          </Field>
        </div>
        <Field label="Descripción breve" hint="Aparece debajo del encabezado, en gris claro.">
          <textarea value={tablaDescripcion} onChange={(e) => setTablaDescripcion(e.target.value)} rows={2} style={{ ...inputStyle, height: "auto", minHeight: 50, paddingTop: 10, paddingBottom: 10, resize: "vertical" }} />
        </Field>

        {/* Columnas */}
        <div className="flex flex-col gap-2">
          <span style={fieldLabel}>Columnas ({columnas.length})</span>
          <div className="flex flex-wrap gap-2">
            {columnas.map((c, i) => (
              <div key={i} className="flex items-center gap-1">
                <input
                  type="text"
                  value={c}
                  onChange={(e) => updateColumna(i, e.target.value)}
                  style={{ ...inputStyle, width: 160, height: 32, fontSize: 12 }}
                />
                <button
                  type="button"
                  onClick={() => removeColumna(i)}
                  disabled={columnas.length <= 1}
                  aria-label="Eliminar columna"
                  style={iconButton(columnas.length <= 1, "#991B1B", "#FECACA")}
                >
                  <Trash2 size={12} strokeWidth={2.5} />
                </button>
              </div>
            ))}
            <button type="button" onClick={addColumna} style={{ ...dashedAddBtn, height: 32 }}>
              <Plus size={12} strokeWidth={2.5} />
              Agregar columna
            </button>
          </div>
        </div>

        {/* Filas */}
        <div className="flex flex-col gap-2">
          <span style={fieldLabel}>Filas ({filas.length})</span>
          {filas.length === 0 && (
            <p style={{ fontSize: 12, color: "#A0AABA", margin: 0, fontStyle: "italic" }}>
              No hay filas. Agrega la primera abajo.
            </p>
          )}
          {filas.map((row, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 p-3"
              style={{
                background: row.destacada ? "rgba(155,27,27,0.05)" : "#FAFAF8",
                border: row.destacada ? "1px solid rgba(155,27,27,0.30)" : "1px solid #E8E4DD",
                borderRadius: 8,
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <span style={{ fontSize: 10, fontWeight: 700, color: "#A0AABA", textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Fila #{i + 1}
                </span>
                <div className="flex items-center gap-1">
                  <label className="flex items-center gap-1 cursor-pointer" title="Marcar fila como destacada">
                    <input
                      type="checkbox"
                      checked={!!row.destacada}
                      onChange={() => toggleDestacada(i)}
                      style={{ accentColor: "#9B1B1B" }}
                    />
                    <span style={{ fontSize: 10, color: "#6B6660" }}>Destacar</span>
                  </label>
                  <button type="button" onClick={() => moveFila(i, -1)} disabled={i === 0} aria-label="Subir" style={iconButton(i === 0)}>
                    <ArrowUp size={12} strokeWidth={2.5} />
                  </button>
                  <button type="button" onClick={() => moveFila(i, 1)} disabled={i === filas.length - 1} aria-label="Bajar" style={iconButton(i === filas.length - 1)}>
                    <ArrowDown size={12} strokeWidth={2.5} />
                  </button>
                  <button type="button" onClick={() => removeFila(i)} aria-label="Eliminar fila" style={iconButton(false, "#991B1B", "#FECACA")}>
                    <Trash2 size={12} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
              <div
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${columnas.length}, minmax(0, 1fr))` }}
              >
                {row.celdas.map((celda, j) => (
                  <input
                    key={j}
                    type="text"
                    value={celda}
                    onChange={(e) => updateCelda(i, j, e.target.value)}
                    placeholder={columnas[j] ?? ""}
                    style={{ ...inputStyle, height: 34, fontSize: 12 }}
                  />
                ))}
              </div>
            </div>
          ))}
          <button type="button" onClick={addFila} style={{ ...dashedAddBtn, alignSelf: "flex-start" }}>
            <Plus size={12} strokeWidth={2.5} />
            Agregar fila
          </button>
        </div>

        {/* Opciones de estilo */}
        <div className="flex flex-col gap-2 mt-2">
          <span style={fieldLabel}>Opciones de estilo</span>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={acentoPrimeraColumna}
              onChange={(e) => setAcentoPrimeraColumna(e.target.checked)}
              style={{ accentColor: "#1A2B4A" }}
            />
            <span style={{ fontSize: 12, color: "#1A2B4A" }}>
              Resaltar primera columna en blanco (como etiqueta)
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={destacarUltimaColumna}
              onChange={(e) => setDestacarUltimaColumna(e.target.checked)}
              style={{ accentColor: "#C9A84C" }}
            />
            <span style={{ fontSize: 12, color: "#1A2B4A" }}>
              Resaltar última columna en dorado (típico para precios o valores)
            </span>
          </label>
        </div>
      </Card>

      {/* Nota destacada */}
      <Card
        title="Nota destacada al pie (opcional)"
        subtitle="Aparece como recuadro rojo claro al final, ideal para advertencias o aclaraciones."
      >
        <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-3">
          <Field label="Icono">
            <input type="text" value={notaIcono} onChange={(e) => setNotaIcono(e.target.value)} placeholder="ℹ️" maxLength={4} style={{ ...inputStyle, textAlign: "center" }} />
          </Field>
          <Field label="Texto" hint="Acepta HTML simple (negritas con <strong>). Déjalo vacío para no mostrar la nota.">
            <textarea
              value={notaTexto}
              onChange={(e) => setNotaTexto(e.target.value)}
              rows={3}
              style={{ ...inputStyle, height: "auto", minHeight: 70, paddingTop: 10, paddingBottom: 10, resize: "vertical" }}
            />
          </Field>
        </div>
      </Card>

      {/* Anclaje */}
      <Card
        title="Anclaje de sección"
        subtitle="Permite enlazar directamente a esta sección con un anchor en la URL."
      >
        <AnchorIdField value={anchorId} onChange={setAnchorId} slug={slug} />
      </Card>

      {/* SEO */}
      <Card title="SEO" subtitle="Metadatos para motores de búsqueda y previews al compartir.">
        <Field label="Meta title" hint="50-60 caracteres ideal.">
          <input type="text" name="meta_title" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} maxLength={120} style={inputStyle} />
        </Field>
        <Field label="Meta description" hint="140-160 caracteres ideal.">
          <textarea name="meta_description" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} rows={2} maxLength={300} style={{ ...inputStyle, height: "auto", minHeight: 50, paddingTop: 10, paddingBottom: 10, resize: "vertical" }} />
        </Field>
      </Card>
    </form>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
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

function iconButton(disabled: boolean, color: string = "#1A2B4A", border: string = "#E8E4DD"): React.CSSProperties {
  return {
    width: 26,
    height: 26,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    color: disabled ? "#C9C4BB" : color,
    border: `1px solid ${border}`,
    borderRadius: 4,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    fontFamily: "inherit",
  };
}

const dashedAddBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  height: 36,
  paddingLeft: 14,
  paddingRight: 14,
  background: "transparent",
  color: "#1A2B4A",
  border: "1px dashed #C9C4BB",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: "inherit",
};
