"use client";

import { useActionState, useState } from "react";
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { guardarPaginaAction, type PaginaActionState } from "../actions";
import type {
  ContenidoPlantillaC,
  TarjetaPlantillaC,
  PasoPlantillaC,
  FilaTarjetaPlantillaC,
  GaleriaPlantillaC,
} from "../../plantillas";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { AnchorIdField } from "./AnchorIdField";

export function EditorPlantillaC({
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
  initialContenido: ContenidoPlantillaC;
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
  const [introDescripcion, setIntroDescripcion] = useState(initialContenido.intro?.descripcion ?? "");

  // Galería (collage de 3 fotos)
  const [galSrc1, setGalSrc1] = useState(initialContenido.galeria?.src1 ?? "");
  const [galAlt1, setGalAlt1] = useState(initialContenido.galeria?.alt1 ?? "");
  const [galSrc2, setGalSrc2] = useState(initialContenido.galeria?.src2 ?? "");
  const [galAlt2, setGalAlt2] = useState(initialContenido.galeria?.alt2 ?? "");
  const [galSrc3, setGalSrc3] = useState(initialContenido.galeria?.src3 ?? "");
  const [galAlt3, setGalAlt3] = useState(initialContenido.galeria?.alt3 ?? "");

  // Tarjetas
  const [tarjetasTitulo, setTarjetasTitulo] = useState(initialContenido.tarjetas?.titulo ?? "");
  const [tarjetas, setTarjetas] = useState<TarjetaPlantillaC[]>(
    initialContenido.tarjetas?.items ?? []
  );

  // Pasos
  const [pasosBadge, setPasosBadge] = useState(initialContenido.pasos?.badge ?? "");
  const [pasosTitulo, setPasosTitulo] = useState(initialContenido.pasos?.titulo ?? "");
  const [pasos, setPasos] = useState<PasoPlantillaC[]>(initialContenido.pasos?.items ?? []);

  // Nota
  const [notaIcono, setNotaIcono] = useState(initialContenido.nota?.icono ?? "💬");
  const [notaTexto, setNotaTexto] = useState(initialContenido.nota?.texto ?? "");
  const [anchorId, setAnchorId] = useState(initialContenido.anchorId ?? "");

  // ─── Handlers tarjetas ────────────────────────────────────────

  const updateTarjeta = (i: number, patch: Partial<TarjetaPlantillaC>) =>
    setTarjetas((prev) =>
      prev.map((t, idx) => (idx === i ? { ...t, ...patch } : t))
    );
  const addTarjeta = () =>
    setTarjetas((prev) => [
      ...prev,
      { color: "#1A4FA8", titulo: "Nueva tarjeta", filas: [] },
    ]);
  const removeTarjeta = (i: number) =>
    setTarjetas((prev) => prev.filter((_, idx) => idx !== i));
  const moveTarjeta = (i: number, dir: -1 | 1) => {
    setTarjetas((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const addFilaTarjeta = (tarjetaIdx: number) =>
    updateTarjeta(tarjetaIdx, {
      filas: [...(tarjetas[tarjetaIdx]?.filas ?? []), { label: "", value: "" }],
    });
  const updateFilaTarjeta = (
    tarjetaIdx: number,
    filaIdx: number,
    patch: Partial<FilaTarjetaPlantillaC>
  ) =>
    updateTarjeta(tarjetaIdx, {
      filas: (tarjetas[tarjetaIdx]?.filas ?? []).map((f, idx) =>
        idx === filaIdx ? { ...f, ...patch } : f
      ),
    });
  const removeFilaTarjeta = (tarjetaIdx: number, filaIdx: number) =>
    updateTarjeta(tarjetaIdx, {
      filas: (tarjetas[tarjetaIdx]?.filas ?? []).filter((_, idx) => idx !== filaIdx),
    });

  // ─── Handlers pasos ──────────────────────────────────────────

  const updatePaso = (i: number, patch: Partial<PasoPlantillaC>) =>
    setPasos((prev) => prev.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  const togglePasoDestacado = (i: number) =>
    setPasos((prev) =>
      prev.map((p, idx) => (idx === i ? { ...p, destacado: !p.destacado } : p))
    );
  const addPaso = () => setPasos((prev) => [...prev, { texto: "" }]);
  const removePaso = (i: number) =>
    setPasos((prev) => prev.filter((_, idx) => idx !== i));
  const movePaso = (i: number, dir: -1 | 1) => {
    setPasos((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  // ─── Serialización ───────────────────────────────────────────

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
      introHeading || introDescripcion
        ? {
            badge: introBadge || undefined,
            heading: introHeading || undefined,
            descripcion: introDescripcion || undefined,
          }
        : undefined,
    galeria:
      galSrc1 && galSrc2
        ? {
            src1: galSrc1,
            alt1: galAlt1 || undefined,
            src2: galSrc2,
            alt2: galAlt2 || undefined,
            src3: galSrc3 || undefined,
            alt3: galSrc3 ? galAlt3 || undefined : undefined,
          }
        : undefined,
    tarjetas:
      tarjetas.length > 0
        ? {
            titulo: tarjetasTitulo || undefined,
            items: tarjetas
              .filter((t) => t.titulo.trim())
              .map((t) => ({
                color: t.color || undefined,
                titulo: t.titulo,
                filas: t.filas.filter((f) => f.label.trim() && f.value.trim()),
              })),
          }
        : undefined,
    pasos:
      pasos.filter((p) => p.texto.trim()).length > 0
        ? {
            badge: pasosBadge || undefined,
            titulo: pasosTitulo || undefined,
            items: pasos.filter((p) => p.texto.trim()),
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

      {/* Información general */}
      <Card title="Información general">
        <Field label="Título interno">
          <input type="text" name="titulo" value={titulo} onChange={(e) => setTitulo(e.target.value)} required style={inputStyle} />
        </Field>
        <Field label="Slug (URL)">
          <input type="text" value={`/${slug}`} readOnly disabled style={{ ...inputStyle, background: "#F4F1EB", color: "#A0AABA" }} />
        </Field>
      </Card>

      {/* Hero */}
      <Card title="Hero (cabecera)" subtitle="Cabecera grande con título sobre fondo navy.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Badge superior">
            <input type="text" value={heroBadge} onChange={(e) => setHeroBadge(e.target.value)} placeholder="MATRÍCULAS · AUTORIZACIONES" style={inputStyle} />
          </Field>
          <Field label="Ghost text">
            <input type="text" value={heroGhostText} onChange={(e) => setHeroGhostText(e.target.value)} placeholder={heroTitle.toUpperCase()} style={inputStyle} />
          </Field>
        </div>
        <Field label="Título principal" required>
          <input type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} required style={inputStyle} />
        </Field>
        <Field label="Subtítulo">
          <input type="text" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Pie del hero">
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

      {/* Intro */}
      <Card
        title="Sección introductoria (opcional)"
        subtitle="Encabezado y descripción antes de tarjetas y pasos. Déjala vacía para no mostrarla."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Badge">
            <input type="text" value={introBadge} onChange={(e) => setIntroBadge(e.target.value)} placeholder="AUTORIZACIONES BANCARIAS" style={inputStyle} />
          </Field>
          <Field label="Encabezado (h2)">
            <input type="text" value={introHeading} onChange={(e) => setIntroHeading(e.target.value)} placeholder="Cuentas para pago de matrícula" style={inputStyle} />
          </Field>
        </div>
        <Field label="Descripción" hint="Párrafo introductorio en gris claro. Acepta texto plano.">
          <textarea
            value={introDescripcion}
            onChange={(e) => setIntroDescripcion(e.target.value)}
            rows={3}
            style={{ ...inputStyle, height: "auto", minHeight: 70, paddingTop: 10, paddingBottom: 10, resize: "vertical" }}
          />
        </Field>
      </Card>

      {/* Galería opcional */}
      <Card
        title="Galería (opcional)"
        subtitle="Collage de fotos: 2 en mobile, 3 en desktop. La primera foto es protagonista (ocupa columna alta). Si dejas las URLs vacías, no se muestra la galería."
      >
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col gap-2">
            <ImageUploader
              label="Foto 1 (principal — desktop ocupa fila completa izquierda)"
              value={galSrc1}
              onChange={setGalSrc1}
              prefix={`${safePrefix}/galeria`}
              previewAspect="4/3"
            />
            <Field label="Texto alternativo de la foto 1">
              <input type="text" value={galAlt1} onChange={(e) => setGalAlt1(e.target.value)} placeholder="Descripción de la foto" style={inputStyle} />
            </Field>
          </div>
          <div className="flex flex-col gap-2">
            <ImageUploader
              label="Foto 2 (mobile + desktop — arriba derecha en desktop)"
              value={galSrc2}
              onChange={setGalSrc2}
              prefix={`${safePrefix}/galeria`}
              previewAspect="4/3"
            />
            <Field label="Texto alternativo de la foto 2">
              <input type="text" value={galAlt2} onChange={(e) => setGalAlt2(e.target.value)} placeholder="Descripción de la foto" style={inputStyle} />
            </Field>
          </div>
          <div className="flex flex-col gap-2">
            <ImageUploader
              label="Foto 3 (solo desktop — abajo derecha) — opcional"
              value={galSrc3}
              onChange={setGalSrc3}
              prefix={`${safePrefix}/galeria`}
              previewAspect="4/3"
              hint="Solo se muestra en desktop. Déjala vacía si no la necesitas."
            />
            {galSrc3 && (
              <Field label="Texto alternativo de la foto 3">
                <input type="text" value={galAlt3} onChange={(e) => setGalAlt3(e.target.value)} placeholder="Descripción de la foto" style={inputStyle} />
              </Field>
            )}
          </div>
        </div>
      </Card>

      {/* Tarjetas */}
      <Card
        title="Tarjetas (opcional)"
        subtitle="Tarjetas con punto de color, título y filas clave-valor. Útil para bancos, proveedores, contactos por departamento, etc."
      >
        <Field label="Título de la sección de tarjetas (opcional)">
          <input type="text" value={tarjetasTitulo} onChange={(e) => setTarjetasTitulo(e.target.value)} placeholder="Bancos autorizados" style={inputStyle} />
        </Field>

        <div className="flex flex-col gap-3">
          {tarjetas.length === 0 && (
            <p
              className="px-4 py-3 rounded-md"
              style={{
                background: "#FAFAF8",
                border: "1px dashed #C9C4BB",
                fontSize: 13,
                color: "#6B6660",
                margin: 0,
                textAlign: "center",
              }}
            >
              Sin tarjetas. Agrega la primera abajo si las necesitas, o déjalo vacío.
            </p>
          )}

          {tarjetas.map((t, i) => (
            <div
              key={i}
              className="flex flex-col gap-3 p-4"
              style={{ background: "#FAFAF8", border: "1px solid #E8E4DD", borderRadius: 8 }}
            >
              <div className="flex items-center justify-between gap-2">
                <span style={smallLabel}>Tarjeta #{i + 1}</span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => moveTarjeta(i, -1)} disabled={i === 0} aria-label="Subir" style={iconButton(i === 0)}>
                    <ArrowUp size={12} strokeWidth={2.5} />
                  </button>
                  <button type="button" onClick={() => moveTarjeta(i, 1)} disabled={i === tarjetas.length - 1} aria-label="Bajar" style={iconButton(i === tarjetas.length - 1)}>
                    <ArrowDown size={12} strokeWidth={2.5} />
                  </button>
                  <button type="button" onClick={() => removeTarjeta(i)} aria-label="Eliminar" style={iconButton(false, "#991B1B", "#FECACA")}>
                    <Trash2 size={12} strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[120px_1fr] gap-2">
                <Field label="Color">
                  <input
                    type="color"
                    value={t.color ?? "#1A4FA8"}
                    onChange={(e) => updateTarjeta(i, { color: e.target.value })}
                    style={{ ...inputStyle, padding: 4, height: 38 }}
                  />
                </Field>
                <Field label="Título">
                  <input
                    type="text"
                    value={t.titulo}
                    onChange={(e) => updateTarjeta(i, { titulo: e.target.value })}
                    placeholder="Banco Pichincha"
                    style={inputStyle}
                  />
                </Field>
              </div>

              {/* Filas clave-valor de la tarjeta */}
              <div className="flex flex-col gap-2">
                <span style={smallLabel}>Filas (label / valor)</span>
                {t.filas.map((f, j) => (
                  <div key={j} className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_auto_auto] gap-2 items-center">
                    <input
                      type="text"
                      value={f.label}
                      onChange={(e) => updateFilaTarjeta(i, j, { label: e.target.value })}
                      placeholder="ej. N° de cuenta"
                      style={{ ...inputStyle, height: 32, fontSize: 13 }}
                    />
                    <input
                      type="text"
                      value={f.value}
                      onChange={(e) => updateFilaTarjeta(i, j, { value: e.target.value })}
                      placeholder="ej. 1234567-8"
                      style={{ ...inputStyle, height: 32, fontSize: 13 }}
                    />
                    <label className="flex items-center gap-1 cursor-pointer" title="Resaltar valor en rojo">
                      <input
                        type="checkbox"
                        checked={!!f.destacado}
                        onChange={(e) => updateFilaTarjeta(i, j, { destacado: e.target.checked })}
                        style={{ accentColor: "#9e1915" }}
                      />
                      <span style={{ fontSize: 11, color: "#6B6660" }}>Rojo</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => removeFilaTarjeta(i, j)}
                      aria-label="Eliminar fila"
                      style={iconButton(false, "#991B1B", "#FECACA")}
                    >
                      <Trash2 size={12} strokeWidth={2.5} />
                    </button>
                  </div>
                ))}
                <button type="button" onClick={() => addFilaTarjeta(i)} style={{ ...dashedAddBtn, height: 30, fontSize: 12 }}>
                  <Plus size={11} strokeWidth={2.5} />
                  Agregar fila
                </button>
              </div>
            </div>
          ))}

          <button type="button" onClick={addTarjeta} style={dashedAddBtn}>
            <Plus size={12} strokeWidth={2.5} />
            Agregar tarjeta
          </button>
        </div>
      </Card>

      {/* Pasos */}
      <Card
        title="Pasos numerados"
        subtitle="Lista de pasos. La numeración (01, 02, 03...) se genera automáticamente."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Badge">
            <input type="text" value={pasosBadge} onChange={(e) => setPasosBadge(e.target.value)} placeholder="PROCESO" style={inputStyle} />
          </Field>
          <Field label="Título">
            <input type="text" value={pasosTitulo} onChange={(e) => setPasosTitulo(e.target.value)} placeholder="Pasos para subir el comprobante" style={inputStyle} />
          </Field>
        </div>

        <div className="flex flex-col gap-2">
          {pasos.length === 0 && (
            <p style={{ fontSize: 13, color: "#A0AABA", margin: 0, fontStyle: "italic" }}>
              No hay pasos. Agrega el primero abajo.
            </p>
          )}
          {pasos.map((p, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 p-3"
              style={{
                background: p.destacado ? "rgba(155,27,27,0.05)" : "#FAFAF8",
                border: p.destacado ? "1px solid rgba(155,27,27,0.30)" : "1px solid #E8E4DD",
                borderRadius: 8,
              }}
            >
              <div className="flex items-start gap-2">
                <span
                  className="flex-shrink-0"
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: p.destacado ? "#9B1B1B" : "#9e1915",
                    marginTop: 8,
                    width: 24,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <textarea
                  value={p.texto}
                  onChange={(e) => updatePaso(i, { texto: e.target.value })}
                  rows={2}
                  placeholder="Texto del paso"
                  style={{ ...inputStyle, height: "auto", minHeight: 50, paddingTop: 10, paddingBottom: 10, flex: 1, resize: "vertical" }}
                />
                <div className="flex flex-col gap-1">
                  <button type="button" onClick={() => movePaso(i, -1)} disabled={i === 0} aria-label="Subir" style={iconButton(i === 0)}>
                    <ArrowUp size={12} strokeWidth={2.5} />
                  </button>
                  <button type="button" onClick={() => movePaso(i, 1)} disabled={i === pasos.length - 1} aria-label="Bajar" style={iconButton(i === pasos.length - 1)}>
                    <ArrowDown size={12} strokeWidth={2.5} />
                  </button>
                  <button type="button" onClick={() => removePaso(i)} aria-label="Eliminar paso" style={iconButton(false, "#991B1B", "#FECACA")}>
                    <Trash2 size={12} strokeWidth={2.5} />
                  </button>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer self-start" style={{ paddingLeft: 30 }}>
                <input
                  type="checkbox"
                  checked={!!p.destacado}
                  onChange={() => togglePasoDestacado(i)}
                  style={{ accentColor: "#9B1B1B" }}
                />
                <span style={{ fontSize: 12, color: "#6B6660" }}>
                  Resaltar paso en rojo (destacado, ej. paso final)
                </span>
              </label>
            </div>
          ))}
          <button type="button" onClick={addPaso} style={{ ...dashedAddBtn, alignSelf: "flex-start" }}>
            <Plus size={12} strokeWidth={2.5} />
            Agregar paso
          </button>
        </div>
      </Card>

      {/* Nota */}
      <Card title="Nota destacada al pie (opcional)" subtitle="Aparece como recuadro rojo claro al final.">
        <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-3">
          <Field label="Icono">
            <input type="text" value={notaIcono} onChange={(e) => setNotaIcono(e.target.value)} placeholder="💬" maxLength={4} style={{ ...inputStyle, textAlign: "center" }} />
          </Field>
          <Field label="Texto" hint="Acepta HTML simple (ej. <strong>...</strong>). Vacío = no se muestra la nota.">
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

const fieldLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: "#6B6660",
  textTransform: "uppercase",
  letterSpacing: 0.5,
};

const smallLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#A0AABA",
  textTransform: "uppercase",
  letterSpacing: 0.5,
};

const hintStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#A0AABA",
  lineHeight: 1.5,
};

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
  fontSize: 13,
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: "inherit",
};
