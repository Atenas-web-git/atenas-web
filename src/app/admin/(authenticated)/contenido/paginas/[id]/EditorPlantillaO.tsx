"use client";

import { useActionState, useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { guardarPaginaAction, type PaginaActionState } from "../actions";
import type {
  ContenidoPlantillaO,
  FichaItemPlantillaO,
  PasoPlantillaO,
} from "../../plantillas";
import { ImageUploader } from "@/components/admin/ImageUploader";

export function EditorPlantillaO({
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
  initialContenido: ContenidoPlantillaO;
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
  const [heroBgImage, setHeroBgImage] = useState(initialContenido.hero?.bgImage ?? "");

  // Detalle
  const [detalleBadge, setDetalleBadge] = useState(initialContenido.detalle?.badge ?? "");
  const [detalleHeading, setDetalleHeading] = useState(initialContenido.detalle?.heading ?? "");
  const [detalleParagraphs, setDetalleParagraphs] = useState<string[]>(
    initialContenido.detalle?.paragraphs ?? [""]
  );
  const [detalleDocuments, setDetalleDocuments] = useState<string[]>(
    initialContenido.detalle?.documents ?? [""]
  );
  const [detalleNote, setDetalleNote] = useState(initialContenido.detalle?.note ?? "");
  const [detalleFicha, setDetalleFicha] = useState<FichaItemPlantillaO[]>(
    initialContenido.detalle?.ficha ?? []
  );
  const [detalleCtaTitulo, setDetalleCtaTitulo] = useState(
    initialContenido.detalle?.ctaTitulo ?? ""
  );
  const [detalleCtaDescripcion, setDetalleCtaDescripcion] = useState(
    initialContenido.detalle?.ctaDescripcion ?? ""
  );
  const [detalleCtaLabel, setDetalleCtaLabel] = useState(
    initialContenido.detalle?.ctaLabel ?? ""
  );
  const [detalleCtaHref, setDetalleCtaHref] = useState(
    initialContenido.detalle?.ctaHref ?? ""
  );

  // Pasos
  const [pasosEyebrow, setPasosEyebrow] = useState(initialContenido.pasos?.eyebrow ?? "");
  const [pasosHeading, setPasosHeading] = useState(initialContenido.pasos?.heading ?? "");
  const [pasos, setPasos] = useState<PasoPlantillaO[]>(initialContenido.pasos?.items ?? []);

  // CTA Solicitud
  const [solEyebrow, setSolEyebrow] = useState(initialContenido.ctaSolicitud?.eyebrow ?? "");
  const [solHeading, setSolHeading] = useState(initialContenido.ctaSolicitud?.heading ?? "");
  const [solDescPre, setSolDescPre] = useState(initialContenido.ctaSolicitud?.descripcionPre ?? "");
  const [solDescPost, setSolDescPost] = useState(initialContenido.ctaSolicitud?.descripcionPost ?? "");
  const [solBeneficios, setSolBeneficios] = useState<string[]>(
    initialContenido.ctaSolicitud?.beneficios ?? []
  );
  const [solCtaPrimaryLabel, setSolCtaPrimaryLabel] = useState(
    initialContenido.ctaSolicitud?.ctaPrimary?.label ?? ""
  );
  const [solCtaPrimaryHref, setSolCtaPrimaryHref] = useState(
    initialContenido.ctaSolicitud?.ctaPrimary?.href ?? ""
  );
  const [solCtaSecondaryLabel, setSolCtaSecondaryLabel] = useState(
    initialContenido.ctaSolicitud?.ctaSecondary?.label ?? ""
  );
  const [solCtaSecondaryHref, setSolCtaSecondaryHref] = useState(
    initialContenido.ctaSolicitud?.ctaSecondary?.href ?? ""
  );
  const [solNota, setSolNota] = useState(initialContenido.ctaSolicitud?.nota ?? "");

  // Formulario de consulta (sección "Resolvemos tus dudas")
  type StatFormConsulta = { value: string; suffix: string; label: string };
  const [fcEyebrow, setFcEyebrow] = useState(initialContenido.formularioConsulta?.eyebrow ?? "");
  const [fcHeading, setFcHeading] = useState(initialContenido.formularioConsulta?.heading ?? "");
  const [fcDescription, setFcDescription] = useState(initialContenido.formularioConsulta?.description ?? "");
  const [fcStats, setFcStats] = useState<StatFormConsulta[]>(
    initialContenido.formularioConsulta?.stats ?? []
  );
  const [fcPhotos, setFcPhotos] = useState<string[]>(
    (initialContenido.formularioConsulta?.photos ?? ["", "", ""]).slice()
  );
  const [fcBadge, setFcBadge] = useState(initialContenido.formularioConsulta?.badgeFloating ?? "");
  const [fcCardHeading, setFcCardHeading] = useState(initialContenido.formularioConsulta?.formCardHeading ?? "");
  const [fcCardSubtitle, setFcCardSubtitle] = useState(initialContenido.formularioConsulta?.formCardSubtitle ?? "");
  const [fcSubmitLabel, setFcSubmitLabel] = useState(initialContenido.formularioConsulta?.submitLabel ?? "");
  const [fcSendingLabel, setFcSendingLabel] = useState(initialContenido.formularioConsulta?.sendingLabel ?? "");
  const [fcSuccessTitle, setFcSuccessTitle] = useState(initialContenido.formularioConsulta?.successTitle ?? "");
  const [fcSuccessText, setFcSuccessText] = useState(initialContenido.formularioConsulta?.successText ?? "");
  const [fcErrorText, setFcErrorText] = useState(initialContenido.formularioConsulta?.errorText ?? "");
  const [fcPrivacyPre, setFcPrivacyPre] = useState(initialContenido.formularioConsulta?.privacyTextPre ?? "");
  const [fcPrivacyLabel, setFcPrivacyLabel] = useState(initialContenido.formularioConsulta?.privacyLinkLabel ?? "");
  const [fcPrivacyHref, setFcPrivacyHref] = useState(initialContenido.formularioConsulta?.privacyLinkHref ?? "");
  const [fcPrivacyPost, setFcPrivacyPost] = useState(initialContenido.formularioConsulta?.privacyTextPost ?? "");

  const updateStat = (i: number, patch: Partial<StatFormConsulta>) =>
    setFcStats((arr) => arr.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const addStat = () => setFcStats((arr) => [...arr, { value: "", suffix: "", label: "" }]);
  const removeStat = (i: number) => setFcStats((arr) => arr.filter((_, idx) => idx !== i));
  const updatePhoto = (i: number, v: string) =>
    setFcPhotos((arr) => arr.map((p, idx) => (idx === i ? v : p)));

  // Helpers
  const updateStr = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    i: number,
    v: string
  ) => setter((arr) => arr.map((x, idx) => (idx === i ? v : x)));
  const addStr = (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    setter((arr) => [...arr, ""]);
  const removeStr = (setter: React.Dispatch<React.SetStateAction<string[]>>, i: number) =>
    setter((arr) => arr.filter((_, idx) => idx !== i));

  const updateFicha = (i: number, patch: Partial<FichaItemPlantillaO>) =>
    setDetalleFicha((arr) => arr.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
  const addFicha = () =>
    setDetalleFicha((arr) => [...arr, { label: "", value: "", highlight: false }]);
  const removeFicha = (i: number) =>
    setDetalleFicha((arr) => arr.filter((_, idx) => idx !== i));

  const updatePaso = (i: number, patch: Partial<PasoPlantillaO>) =>
    setPasos((arr) => arr.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  const addPaso = () =>
    setPasos((arr) => [
      ...arr,
      { num: String(arr.length + 1).padStart(2, "0"), title: "", desc: "" },
    ]);
  const removePaso = (i: number) => setPasos((arr) => arr.filter((_, idx) => idx !== i));

  const contenidoJson = JSON.stringify({
    nivelKey: initialContenido.nivelKey,
    nivelLabel: initialContenido.nivelLabel,
    hero: {
      badge: heroBadge,
      title: heroTitle,
      subtitle: heroSubtitle,
      ghostText: heroGhostText,
      bgImage: heroBgImage,
    },
    detalle: {
      badge: detalleBadge,
      heading: detalleHeading,
      paragraphs: detalleParagraphs.filter((p) => p.trim()),
      documents: detalleDocuments.map((d) => d.trim()).filter(Boolean),
      note: detalleNote,
      ficha: detalleFicha
        .map((f) => ({
          label: f.label.trim(),
          value: f.value.trim(),
          highlight: Boolean(f.highlight),
        }))
        .filter((f) => f.label && f.value),
      ctaTitulo: detalleCtaTitulo,
      ctaDescripcion: detalleCtaDescripcion,
      ctaLabel: detalleCtaLabel,
      ctaHref: detalleCtaHref,
    },
    pasos: {
      eyebrow: pasosEyebrow,
      heading: pasosHeading,
      items: pasos
        .map((p) => ({
          num: p.num.trim(),
          title: p.title.trim(),
          desc: p.desc.trim(),
        }))
        .filter((p) => p.num && p.title && p.desc),
    },
    ctaSolicitud: {
      eyebrow: solEyebrow,
      heading: solHeading,
      descripcionPre: solDescPre,
      descripcionPost: solDescPost,
      beneficios: solBeneficios.map((b) => b.trim()).filter(Boolean),
      ctaPrimary: { label: solCtaPrimaryLabel, href: solCtaPrimaryHref },
      ctaSecondary: { label: solCtaSecondaryLabel, href: solCtaSecondaryHref },
      nota: solNota,
    },
    formularioConsulta: {
      eyebrow: fcEyebrow,
      heading: fcHeading,
      description: fcDescription,
      stats: fcStats
        .map((s) => ({
          value: s.value.trim(),
          suffix: s.suffix.trim(),
          label: s.label,
        }))
        .filter((s) => s.value && s.label),
      photos: [fcPhotos[0] ?? "", fcPhotos[1] ?? "", fcPhotos[2] ?? ""],
      badgeFloating: fcBadge,
      formCardHeading: fcCardHeading,
      formCardSubtitle: fcCardSubtitle,
      submitLabel: fcSubmitLabel,
      sendingLabel: fcSendingLabel,
      successTitle: fcSuccessTitle,
      successText: fcSuccessText,
      errorText: fcErrorText,
      privacyTextPre: fcPrivacyPre,
      privacyLinkLabel: fcPrivacyLabel,
      privacyLinkHref: fcPrivacyHref,
      privacyTextPost: fcPrivacyPost,
    },
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

      <Card title="Información general">
        <Field label="Título interno">
          <input
            type="text"
            name="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            style={inputStyle}
          />
        </Field>
        <Field
          label="Slug (URL)"
          hint="Esta plantilla solo se usa para las 4 sub-páginas de /admisiones. No editable."
        >
          <input
            type="text"
            value={`/${slug}`}
            readOnly
            disabled
            style={{ ...inputStyle, background: "#F4F1EB", color: "#A0AABA" }}
          />
        </Field>
        <Field label="Nivel (interno)" hint="Identificador del nivel — no editable.">
          <input
            type="text"
            value={`${initialContenido.nivelLabel} (${initialContenido.nivelKey})`}
            readOnly
            disabled
            style={{ ...inputStyle, background: "#F4F1EB", color: "#A0AABA" }}
          />
        </Field>
      </Card>

      <Card title="Hero (cabecera)" subtitle="Reutiliza HeroElAtenas: badge + título + subtítulo + ghost text + bgImage.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Badge">
            <input
              type="text"
              value={heroBadge}
              onChange={(e) => setHeroBadge(e.target.value)}
              placeholder="ADMISIONES"
              style={inputStyle}
            />
          </Field>
          <Field label="Ghost text">
            <input
              type="text"
              value={heroGhostText}
              onChange={(e) => setHeroGhostText(e.target.value)}
              placeholder="INICIAL"
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
            style={{ ...inputStyle, height: "auto", paddingTop: 10, paddingBottom: 10 }}
          />
        </Field>
        <ImageUploader
          label="Imagen de fondo del hero"
          value={heroBgImage}
          onChange={setHeroBgImage}
          prefix={`${safePrefix}/hero`}
          previewAspect="16/9"
          hint="Si la dejas vacía se usa la imagen genérica por defecto."
        />
      </Card>

      <Card
        title="Sección de detalle"
        subtitle="Badge + heading + N párrafos + chips de documentos + nota destacada + ficha técnica + tarjeta CTA visita."
      >
        <Field label="Badge de la sección">
          <input
            type="text"
            value={detalleBadge}
            onChange={(e) => setDetalleBadge(e.target.value)}
            style={inputStyle}
          />
        </Field>
        <Field label="Heading" required>
          <input
            type="text"
            value={detalleHeading}
            onChange={(e) => setDetalleHeading(e.target.value)}
            required
            style={inputStyle}
          />
        </Field>

        <Subtitle text="Párrafos" />
        <div className="flex flex-col gap-2">
          {detalleParagraphs.map((p, i) => (
            <div key={i} className="flex gap-2 items-start">
              <textarea
                value={p}
                onChange={(e) => updateStr(setDetalleParagraphs, i, e.target.value)}
                rows={3}
                style={{ ...inputStyle, height: "auto", paddingTop: 10, paddingBottom: 10, flex: 1 }}
              />
              <button
                type="button"
                onClick={() => removeStr(setDetalleParagraphs, i)}
                aria-label="Eliminar"
                style={{ ...iconButton, color: "#991B1B", borderColor: "#FECACA" }}
              >
                <Trash2 size={12} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => addStr(setDetalleParagraphs)}
          style={addButton}
          className="flex items-center justify-center gap-1.5 self-start px-4"
        >
          <Plus size={14} strokeWidth={2.5} /> Agregar párrafo
        </button>

        <Subtitle text="Documentos requeridos (chips)" />
        <div className="flex flex-col gap-2">
          {detalleDocuments.map((d, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={d}
                onChange={(e) => updateStr(setDetalleDocuments, i, e.target.value)}
                placeholder="Cédula del representante"
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                type="button"
                onClick={() => removeStr(setDetalleDocuments, i)}
                aria-label="Eliminar"
                style={{ ...iconButton, color: "#991B1B", borderColor: "#FECACA" }}
              >
                <Trash2 size={12} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => addStr(setDetalleDocuments)}
          style={addButton}
          className="flex items-center justify-center gap-1.5 self-start px-4"
        >
          <Plus size={14} strokeWidth={2.5} /> Agregar documento
        </button>

        <Field label="Nota destacada" hint="Aparece con borde dorado a la izquierda.">
          <textarea
            value={detalleNote}
            onChange={(e) => setDetalleNote(e.target.value)}
            rows={3}
            style={{ ...inputStyle, height: "auto", paddingTop: 10, paddingBottom: 10 }}
          />
        </Field>

        <Subtitle text="Ficha técnica (tarjeta lateral)" />
        <div className="flex flex-col gap-2">
          {detalleFicha.map((f, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-2 items-end">
              <Field label="Label">
                <input
                  type="text"
                  value={f.label}
                  onChange={(e) => updateFicha(i, { label: e.target.value })}
                  placeholder="Niveles"
                  style={inputStyle}
                />
              </Field>
              <Field label="Valor">
                <input
                  type="text"
                  value={f.value}
                  onChange={(e) => updateFicha(i, { value: e.target.value })}
                  placeholder="1ro a 7mo grado"
                  style={inputStyle}
                />
              </Field>
              <label className="flex items-center gap-1.5 mb-[10px] cursor-pointer" style={{ fontSize: 11, color: "#1A2B4A" }}>
                <input
                  type="checkbox"
                  checked={Boolean(f.highlight)}
                  onChange={(e) => updateFicha(i, { highlight: e.target.checked })}
                  style={{ accentColor: "#C9A84C" }}
                />
                Destacar
              </label>
              <button
                type="button"
                onClick={() => removeFicha(i)}
                aria-label="Eliminar"
                style={{ ...iconButton, color: "#991B1B", borderColor: "#FECACA" }}
                className="mb-[10px]"
              >
                <Trash2 size={12} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addFicha}
          style={addButton}
          className="flex items-center justify-center gap-1.5 self-start px-4"
        >
          <Plus size={14} strokeWidth={2.5} /> Agregar fila de ficha
        </button>

        <Subtitle text="Tarjeta CTA &ldquo;¿Quieres conocer el colegio?&rdquo;" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Título">
            <input
              type="text"
              value={detalleCtaTitulo}
              onChange={(e) => setDetalleCtaTitulo(e.target.value)}
              style={inputStyle}
            />
          </Field>
          <Field label="Texto del botón">
            <input
              type="text"
              value={detalleCtaLabel}
              onChange={(e) => setDetalleCtaLabel(e.target.value)}
              style={inputStyle}
            />
          </Field>
        </div>
        <Field label="Descripción">
          <input
            type="text"
            value={detalleCtaDescripcion}
            onChange={(e) => setDetalleCtaDescripcion(e.target.value)}
            style={inputStyle}
          />
        </Field>
        <Field label="URL del botón">
          <input
            type="text"
            value={detalleCtaHref}
            onChange={(e) => setDetalleCtaHref(e.target.value)}
            placeholder="/contactos"
            style={inputStyle}
          />
        </Field>
      </Card>

      <Card
        title="Sección — Pasos del proceso"
        subtitle="Bloque oscuro con los pasos numerados específicos del nivel. El último paso se pinta destacado en dorado."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Eyebrow">
            <input
              type="text"
              value={pasosEyebrow}
              onChange={(e) => setPasosEyebrow(e.target.value)}
              style={inputStyle}
            />
          </Field>
          <Field label="Heading">
            <input
              type="text"
              value={pasosHeading}
              onChange={(e) => setPasosHeading(e.target.value)}
              style={inputStyle}
            />
          </Field>
        </div>
        <Subtitle text="Pasos" />
        <div className="flex flex-col gap-2">
          {pasos.map((p, i) => (
            <div key={i} className="flex flex-col gap-2 p-3" style={panelStyle}>
              <div className="grid grid-cols-[100px_1fr_auto] gap-2 items-end">
                <Field label="Número">
                  <input
                    type="text"
                    value={p.num}
                    onChange={(e) => updatePaso(i, { num: e.target.value })}
                    placeholder="01"
                    style={inputStyle}
                  />
                </Field>
                <Field label="Título">
                  <input
                    type="text"
                    value={p.title}
                    onChange={(e) => updatePaso(i, { title: e.target.value })}
                    style={inputStyle}
                  />
                </Field>
                <button
                  type="button"
                  onClick={() => removePaso(i)}
                  aria-label="Eliminar paso"
                  style={{ ...iconButton, color: "#991B1B", borderColor: "#FECACA" }}
                  className="mb-[10px]"
                >
                  <Trash2 size={12} strokeWidth={2.5} />
                </button>
              </div>
              <Field label="Descripción">
                <textarea
                  value={p.desc}
                  onChange={(e) => updatePaso(i, { desc: e.target.value })}
                  rows={2}
                  style={{ ...inputStyle, height: "auto", paddingTop: 10, paddingBottom: 10 }}
                />
              </Field>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addPaso}
          style={addButton}
          className="flex items-center justify-center gap-1.5 self-start px-4"
        >
          <Plus size={14} strokeWidth={2.5} /> Agregar paso
        </button>
      </Card>

      <Card
        title="CTA grande — solicitud de admisión"
        subtitle="Bloque navy con badge + heading + descripción dorada con el nombre del nivel + lista de beneficios + 2 botones."
      >
        <Field label="Eyebrow">
          <input
            type="text"
            value={solEyebrow}
            onChange={(e) => setSolEyebrow(e.target.value)}
            style={inputStyle}
          />
        </Field>
        <Field label="Heading">
          <input
            type="text"
            value={solHeading}
            onChange={(e) => setSolHeading(e.target.value)}
            style={inputStyle}
          />
        </Field>
        <Field label="Descripción — antes del nivel destacado">
          <input
            type="text"
            value={solDescPre}
            onChange={(e) => setSolDescPre(e.target.value)}
            placeholder="Completa la solicitud formal de admisión para"
            style={inputStyle}
          />
        </Field>
        <Field label="Descripción — después del nivel destacado">
          <input
            type="text"
            value={solDescPost}
            onChange={(e) => setSolDescPost(e.target.value)}
            placeholder=". Son solo 4 pasos…"
            style={inputStyle}
          />
        </Field>

        <Subtitle text="Beneficios (chips con ✓)" />
        <div className="flex flex-col gap-2">
          {solBeneficios.map((b, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={b}
                onChange={(e) => updateStr(setSolBeneficios, i, e.target.value)}
                placeholder="4 pasos simples"
                style={{ ...inputStyle, flex: 1 }}
              />
              <button
                type="button"
                onClick={() => removeStr(setSolBeneficios, i)}
                aria-label="Eliminar"
                style={{ ...iconButton, color: "#991B1B", borderColor: "#FECACA" }}
              >
                <Trash2 size={12} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => addStr(setSolBeneficios)}
          style={addButton}
          className="flex items-center justify-center gap-1.5 self-start px-4"
        >
          <Plus size={14} strokeWidth={2.5} /> Agregar beneficio
        </button>

        <Subtitle text="Botones" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="CTA primario — texto" hint="Botón dorado.">
            <input
              type="text"
              value={solCtaPrimaryLabel}
              onChange={(e) => setSolCtaPrimaryLabel(e.target.value)}
              style={inputStyle}
            />
          </Field>
          <Field label="CTA primario — URL">
            <input
              type="text"
              value={solCtaPrimaryHref}
              onChange={(e) => setSolCtaPrimaryHref(e.target.value)}
              placeholder="/admisiones/formulario?nivel=…"
              style={inputStyle}
            />
          </Field>
          <Field label="CTA secundario — texto" hint="Botón outline.">
            <input
              type="text"
              value={solCtaSecondaryLabel}
              onChange={(e) => setSolCtaSecondaryLabel(e.target.value)}
              style={inputStyle}
            />
          </Field>
          <Field label="CTA secundario — URL">
            <input
              type="text"
              value={solCtaSecondaryHref}
              onChange={(e) => setSolCtaSecondaryHref(e.target.value)}
              style={inputStyle}
            />
          </Field>
        </div>

        <Field label="Nota chica al pie del bloque">
          <input
            type="text"
            value={solNota}
            onChange={(e) => setSolNota(e.target.value)}
            style={inputStyle}
          />
        </Field>
      </Card>

      <Card
        title="Sección — Resolvemos tus dudas (formulario de consulta)"
        subtitle="Bloque al final de la página con eyebrow + heading + descripción + 3 stats + collage de fotos + tarjeta del formulario. Los envíos van al correo configurado en /admin/configuracion/correos (preset admisiones-confirmacion)."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Eyebrow">
            <input
              type="text"
              value={fcEyebrow}
              onChange={(e) => setFcEyebrow(e.target.value)}
              placeholder="¿Aún tienes dudas?"
              style={inputStyle}
            />
          </Field>
          <Field label="Badge flotante sobre el collage">
            <input
              type="text"
              value={fcBadge}
              onChange={(e) => setFcBadge(e.target.value)}
              placeholder="★ ATENAS · 50 AÑOS"
              style={inputStyle}
            />
          </Field>
        </div>
        <Field label="Heading">
          <input
            type="text"
            value={fcHeading}
            onChange={(e) => setFcHeading(e.target.value)}
            style={inputStyle}
          />
        </Field>
        <Field label="Descripción">
          <textarea
            value={fcDescription}
            onChange={(e) => setFcDescription(e.target.value)}
            rows={4}
            style={{ ...inputStyle, height: "auto", paddingTop: 10, paddingBottom: 10 }}
          />
        </Field>

        <Subtitle text="Stats (3 típicamente — si el valor es numérico, se anima con count-up)" />
        <div className="flex flex-col gap-2">
          {fcStats.map((s, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-[100px_80px_1fr_auto] gap-2 items-end p-3"
              style={panelStyle}
            >
              <Field label="Valor" hint="Si es número, se anima.">
                <input
                  type="text"
                  value={s.value}
                  onChange={(e) => updateStat(i, { value: e.target.value })}
                  placeholder="50"
                  style={inputStyle}
                />
              </Field>
              <Field label="Sufijo">
                <input
                  type="text"
                  value={s.suffix}
                  onChange={(e) => updateStat(i, { suffix: e.target.value })}
                  placeholder="+"
                  style={inputStyle}
                />
              </Field>
              <Field label="Etiqueta (acepta saltos de línea)">
                <textarea
                  value={s.label}
                  onChange={(e) => updateStat(i, { label: e.target.value })}
                  rows={2}
                  style={{ ...inputStyle, height: "auto", paddingTop: 8, paddingBottom: 8 }}
                />
              </Field>
              <button
                type="button"
                onClick={() => removeStat(i)}
                aria-label="Eliminar"
                style={{ ...iconButton, color: "#991B1B", borderColor: "#FECACA" }}
                className="mb-[10px]"
              >
                <Trash2 size={12} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addStat}
          style={addButton}
          className="flex items-center justify-center gap-1.5 self-start px-4"
        >
          <Plus size={14} strokeWidth={2.5} /> Agregar stat
        </button>

        <Subtitle text="Collage de 3 fotos (desktop)" />
        {[0, 1, 2].map((i) => (
          <ImageUploader
            key={i}
            label={`Foto ${i + 1}`}
            value={fcPhotos[i] ?? ""}
            onChange={(v) => updatePhoto(i, v)}
            prefix={`${safePrefix}/consulta/${i}`}
            previewAspect="4/3"
          />
        ))}

        <Subtitle text="Tarjeta del formulario" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Heading">
            <input type="text" value={fcCardHeading} onChange={(e) => setFcCardHeading(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Subtítulo">
            <input type="text" value={fcCardSubtitle} onChange={(e) => setFcCardSubtitle(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Texto del botón Enviar">
            <input type="text" value={fcSubmitLabel} onChange={(e) => setFcSubmitLabel(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Texto al enviando">
            <input type="text" value={fcSendingLabel} onChange={(e) => setFcSendingLabel(e.target.value)} style={inputStyle} />
          </Field>
        </div>

        <Subtitle text="Estado de éxito y error" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Título del éxito">
            <input type="text" value={fcSuccessTitle} onChange={(e) => setFcSuccessTitle(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Texto del éxito">
            <input type="text" value={fcSuccessText} onChange={(e) => setFcSuccessText(e.target.value)} style={inputStyle} />
          </Field>
        </div>
        <Field label="Texto cuando hay error en el envío">
          <textarea
            value={fcErrorText}
            onChange={(e) => setFcErrorText(e.target.value)}
            rows={2}
            style={{ ...inputStyle, height: "auto", paddingTop: 10, paddingBottom: 10 }}
          />
        </Field>

        <Subtitle text="Política de privacidad (texto al pie del form)" />
        <Field label="Texto antes del link">
          <input type="text" value={fcPrivacyPre} onChange={(e) => setFcPrivacyPre(e.target.value)} style={inputStyle} />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-3">
          <Field label="Texto del link">
            <input type="text" value={fcPrivacyLabel} onChange={(e) => setFcPrivacyLabel(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="URL del link">
            <input type="text" value={fcPrivacyHref} onChange={(e) => setFcPrivacyHref(e.target.value)} placeholder="/privacidad" style={inputStyle} />
          </Field>
        </div>
        <Field label="Texto después del link">
          <input type="text" value={fcPrivacyPost} onChange={(e) => setFcPrivacyPost(e.target.value)} style={inputStyle} />
        </Field>
      </Card>

      <Card title="SEO">
        <Field label="Meta title">
          <input
            type="text"
            name="meta_title"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            maxLength={120}
            style={inputStyle}
          />
        </Field>
        <Field label="Meta description">
          <textarea
            name="meta_description"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={2}
            maxLength={300}
            style={{
              ...inputStyle,
              height: "auto",
              minHeight: 50,
              paddingTop: 10,
              paddingBottom: 10,
              resize: "vertical",
            }}
          />
        </Field>
      </Card>
    </form>
  );
}

/* ─── helpers UI ─── */

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

function Subtitle({ text }: { text: string }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: "#C9A84C",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginTop: 4,
      }}
    >
      {text}
    </span>
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
const panelStyle: React.CSSProperties = {
  background: "#FAFAF8",
  border: "1px solid #E8E4DD",
  borderRadius: 10,
};
const iconButton: React.CSSProperties = {
  width: 32,
  height: 32,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "transparent",
  color: "#1A2B4A",
  border: "1px solid #E8E4DD",
  borderRadius: 6,
  cursor: "pointer",
  fontFamily: "inherit",
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
