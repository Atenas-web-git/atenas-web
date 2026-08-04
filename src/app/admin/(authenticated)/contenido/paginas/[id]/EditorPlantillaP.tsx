"use client";

import { useActionState, useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { guardarPaginaAction, type PaginaActionState } from "../actions";
import type {
  AdmisionesLandingConfig,
  AdmisionesStat,
  AdmisionesProcesoPaso,
  AdmisionesNivelCard,
  AdmisionesExplorarCard,
  AdmisionesFAQItem,
} from "@/lib/cms/admisionesLanding";
import { ImageUploader } from "@/components/admin/ImageUploader";

export function EditorPlantillaP({
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
  initialContenido: AdmisionesLandingConfig;
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
  const [heroEyebrow, setHeroEyebrow] = useState(initialContenido.hero.eyebrow);
  const [heroTitleLine1, setHeroTitleLine1] = useState(initialContenido.hero.titleLine1);
  const [heroTitleLine2, setHeroTitleLine2] = useState(initialContenido.hero.titleLine2);
  const [heroSubtitlePre, setHeroSubtitlePre] = useState(initialContenido.hero.subtitlePre);
  const [heroSubtitleHighlight, setHeroSubtitleHighlight] = useState(initialContenido.hero.subtitleHighlight);
  const [heroSubtitlePost, setHeroSubtitlePost] = useState(initialContenido.hero.subtitlePost);
  const [heroGhostText, setHeroGhostText] = useState(initialContenido.hero.ghostText);
  const [heroBgImage, setHeroBgImage] = useState(initialContenido.hero.bgImage);
  const [heroBadgeValue, setHeroBadgeValue] = useState(initialContenido.hero.badgeValue);
  const [heroBadgeLabel, setHeroBadgeLabel] = useState(initialContenido.hero.badgeLabel);
  const [heroPhotos, setHeroPhotos] = useState<string[]>(initialContenido.hero.floatingPhotos.slice());
  const [heroCtaPriLabel, setHeroCtaPriLabel] = useState(initialContenido.hero.ctaPrimary.label);
  const [heroCtaPriHref, setHeroCtaPriHref] = useState(initialContenido.hero.ctaPrimary.href);
  const [heroCtaSecLabel, setHeroCtaSecLabel] = useState(initialContenido.hero.ctaSecondary.label);
  const [heroCtaSecHref, setHeroCtaSecHref] = useState(initialContenido.hero.ctaSecondary.href);
  const [stats, setStats] = useState<AdmisionesStat[]>(initialContenido.hero.stats);

  // Proceso
  const [procEyebrow, setProcEyebrow] = useState(initialContenido.proceso.eyebrow);
  const [procHeadingPre, setProcHeadingPre] = useState(initialContenido.proceso.headingPre);
  const [procHeadingHighlight, setProcHeadingHighlight] = useState(initialContenido.proceso.headingHighlight);
  const [procDescription, setProcDescription] = useState(initialContenido.proceso.description);
  const [procFotoPrincipal, setProcFotoPrincipal] = useState(initialContenido.proceso.fotoPrincipal);
  const [procFotoSecundaria, setProcFotoSecundaria] = useState(initialContenido.proceso.fotoSecundaria);
  const [procBadge, setProcBadge] = useState(initialContenido.proceso.badgeFloating);
  const [pasos, setPasos] = useState<AdmisionesProcesoPaso[]>(initialContenido.proceso.pasos);

  // Niveles
  const [nivEyebrow, setNivEyebrow] = useState(initialContenido.niveles.eyebrow);
  const [nivHeadingPre, setNivHeadingPre] = useState(initialContenido.niveles.headingPre);
  const [nivHeadingHighlight, setNivHeadingHighlight] = useState(initialContenido.niveles.headingHighlight);
  const [nivDescription, setNivDescription] = useState(initialContenido.niveles.description);
  const [nivFotoPrincipal, setNivFotoPrincipal] = useState(initialContenido.niveles.fotoPrincipal);
  const [nivFotoSecundaria, setNivFotoSecundaria] = useState(initialContenido.niveles.fotoSecundaria);
  const [nivBadge, setNivBadge] = useState(initialContenido.niveles.badgeFloating);
  const [niveles, setNiveles] = useState<AdmisionesNivelCard[]>(initialContenido.niveles.items);

  // Explorar
  const [expEyebrow, setExpEyebrow] = useState(initialContenido.explorar.eyebrow);
  const [expHeading, setExpHeading] = useState(initialContenido.explorar.heading);
  const [expDescription, setExpDescription] = useState(initialContenido.explorar.description);
  const [explorar, setExplorar] = useState<AdmisionesExplorarCard[]>(initialContenido.explorar.items);

  // Visita
  const [visEyebrow, setVisEyebrow] = useState(initialContenido.visita.eyebrow);
  const [visHeadingPre, setVisHeadingPre] = useState(initialContenido.visita.headingPre);
  const [visHeadingHighlight, setVisHeadingHighlight] = useState(initialContenido.visita.headingHighlight);
  const [visDescription, setVisDescription] = useState(initialContenido.visita.description);
  const [visUbicacion, setVisUbicacion] = useState(initialContenido.visita.ubicacion);
  const [visHorario, setVisHorario] = useState(initialContenido.visita.horarioCorto);
  const [visCtaPriLabel, setVisCtaPriLabel] = useState(initialContenido.visita.ctaPrimary.label);
  const [visCtaPriHref, setVisCtaPriHref] = useState(initialContenido.visita.ctaPrimary.href);
  const [visCtaSecLabel, setVisCtaSecLabel] = useState(initialContenido.visita.ctaSecondary.label);
  const [visCtaSecHref, setVisCtaSecHref] = useState(initialContenido.visita.ctaSecondary.href);
  const [visContacto, setVisContacto] = useState(initialContenido.visita.contactoLine);
  const [visFotos, setVisFotos] = useState<string[]>(initialContenido.visita.fotos.slice());
  const [visBadgeL1, setVisBadgeL1] = useState(initialContenido.visita.badgeFloating.linea1);
  const [visBadgeL2, setVisBadgeL2] = useState(initialContenido.visita.badgeFloating.linea2);

  // FAQ
  const [faqEyebrow, setFaqEyebrow] = useState(initialContenido.faq.eyebrow);
  const [faqHeading, setFaqHeading] = useState(initialContenido.faq.heading);
  const [faqDescription, setFaqDescription] = useState(initialContenido.faq.description);
  const [faqItems, setFaqItems] = useState<AdmisionesFAQItem[]>(initialContenido.faq.items);

  // Handlers de arrays
  const updateStat = (i: number, patch: Partial<AdmisionesStat>) =>
    setStats((arr) => arr.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const addStat = () => setStats((arr) => [...arr, { value: "", label: "" }]);
  const removeStat = (i: number) => setStats((arr) => arr.filter((_, idx) => idx !== i));

  const updatePaso = (i: number, patch: Partial<AdmisionesProcesoPaso>) =>
    setPasos((arr) => arr.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  const addPaso = () => setPasos((arr) => [...arr, { num: String(arr.length + 1).padStart(2, "0"), title: "", desc: "" }]);
  const removePaso = (i: number) => setPasos((arr) => arr.filter((_, idx) => idx !== i));

  const updateNivel = (i: number, patch: Partial<AdmisionesNivelCard>) =>
    setNiveles((arr) => arr.map((n, idx) => (idx === i ? { ...n, ...patch } : n)));
  const addNivel = () => setNiveles((arr) => [...arr, { num: "", title: "", grades: "", age: "", highlight: false }]);
  const removeNivel = (i: number) => setNiveles((arr) => arr.filter((_, idx) => idx !== i));

  const updateExplorar = (i: number, patch: Partial<AdmisionesExplorarCard>) =>
    setExplorar((arr) => arr.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
  const addExplorar = () =>
    setExplorar((arr) => [
      ...arr,
      {
        slug: "",
        icon: "•",
        title: "",
        grades: "",
        age: "",
        desc: "",
        highlight: false,
        ctaLabel: "Ver requisitos",
        href: "",
      },
    ]);
  const removeExplorar = (i: number) =>
    setExplorar((arr) => arr.filter((_, idx) => idx !== i));

  const updateFaq = (i: number, patch: Partial<AdmisionesFAQItem>) =>
    setFaqItems((arr) => arr.map((q, idx) => (idx === i ? { ...q, ...patch } : q)));
  const addFaq = () => setFaqItems((arr) => [...arr, { pregunta: "", respuesta: "" }]);
  const removeFaq = (i: number) => setFaqItems((arr) => arr.filter((_, idx) => idx !== i));

  const updateHeroPhoto = (i: number, v: string) =>
    setHeroPhotos((arr) => arr.map((p, idx) => (idx === i ? v : p)));
  const updateVisitaFoto = (i: number, v: string) =>
    setVisFotos((arr) => arr.map((p, idx) => (idx === i ? v : p)));

  // Construir el JSON serializado
  const contenidoJson = JSON.stringify({
    hero: {
      eyebrow: heroEyebrow,
      titleLine1: heroTitleLine1,
      titleLine2: heroTitleLine2,
      subtitlePre: heroSubtitlePre,
      subtitleHighlight: heroSubtitleHighlight,
      subtitlePost: heroSubtitlePost,
      ghostText: heroGhostText,
      bgImage: heroBgImage,
      badgeValue: heroBadgeValue,
      badgeLabel: heroBadgeLabel,
      floatingPhotos: heroPhotos,
      ctaPrimary: { label: heroCtaPriLabel, href: heroCtaPriHref },
      ctaSecondary: { label: heroCtaSecLabel, href: heroCtaSecHref },
      stats: stats.map((s) => ({ value: s.value.trim(), label: s.label.trim() })).filter((s) => s.value && s.label),
    },
    proceso: {
      eyebrow: procEyebrow,
      headingPre: procHeadingPre,
      headingHighlight: procHeadingHighlight,
      description: procDescription,
      fotoPrincipal: procFotoPrincipal,
      fotoSecundaria: procFotoSecundaria,
      badgeFloating: procBadge,
      pasos: pasos
        .map((p) => ({ num: p.num.trim(), title: p.title.trim(), desc: p.desc.trim() }))
        .filter((p) => p.num && p.title && p.desc),
    },
    niveles: {
      eyebrow: nivEyebrow,
      headingPre: nivHeadingPre,
      headingHighlight: nivHeadingHighlight,
      description: nivDescription,
      fotoPrincipal: nivFotoPrincipal,
      fotoSecundaria: nivFotoSecundaria,
      badgeFloating: nivBadge,
      items: niveles
        .map((n) => ({
          num: n.num.trim(),
          title: n.title.trim(),
          grades: n.grades.trim(),
          age: n.age.trim(),
          highlight: Boolean(n.highlight),
        }))
        .filter((n) => n.num && n.title && n.grades && n.age),
    },
    explorar: {
      eyebrow: expEyebrow,
      heading: expHeading,
      description: expDescription,
      items: explorar
        .map((e) => ({
          slug: e.slug.trim(),
          icon: e.icon.trim() || "•",
          title: e.title.trim(),
          grades: e.grades.trim(),
          age: e.age.trim(),
          desc: e.desc.trim(),
          highlight: Boolean(e.highlight),
          ctaLabel: e.ctaLabel.trim() || "Ver requisitos",
          href: e.href.trim(),
        }))
        .filter((e) => e.slug && e.title),
    },
    visita: {
      eyebrow: visEyebrow,
      headingPre: visHeadingPre,
      headingHighlight: visHeadingHighlight,
      description: visDescription,
      ubicacion: visUbicacion,
      horarioCorto: visHorario,
      ctaPrimary: { label: visCtaPriLabel, href: visCtaPriHref },
      ctaSecondary: { label: visCtaSecLabel, href: visCtaSecHref },
      contactoLine: visContacto,
      fotos: visFotos,
      badgeFloating: { linea1: visBadgeL1, linea2: visBadgeL2 },
    },
    faq: {
      eyebrow: faqEyebrow,
      heading: faqHeading,
      description: faqDescription,
      items: faqItems
        .map((q) => ({ pregunta: q.pregunta.trim(), respuesta: q.respuesta.trim() }))
        .filter((q) => q.pregunta && q.respuesta),
    },
  });

  const safePrefix = `paginas/${slug.replace(/[^a-z0-9-]/g, "-")}`;

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="id" value={paginaId} />
      <input type="hidden" name="contenido" value={contenidoJson} />

      <Sticky state={state} isPending={isPending} publicada={publicada} setPublicada={setPublicada} />

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
          hint="Esta plantilla solo se usa para /admisiones. No editable."
        >
          <input
            type="text"
            value={`/${slug}`}
            readOnly
            disabled
            style={{ ...inputStyle, background: "#F4F1EB", color: "#A0AABA" }}
          />
        </Field>
      </Card>

      {/* HERO */}
      <Card
        title="Hero (cabecera)"
        subtitle="Eyebrow + título a 2 líneas (segunda en dorado) + subtítulo (con fragmento subrayado en dorado) + ghost text + bgImage + badge flotante + collage de 3 fotos + 2 CTAs + stats bar."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Eyebrow">
            <input type="text" value={heroEyebrow} onChange={(e) => setHeroEyebrow(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Ghost text">
            <input type="text" value={heroGhostText} onChange={(e) => setHeroGhostText(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Título — línea 1 (blanco)" required>
            <input type="text" value={heroTitleLine1} onChange={(e) => setHeroTitleLine1(e.target.value)} required style={inputStyle} />
          </Field>
          <Field label="Título — línea 2 (dorado)" required>
            <input type="text" value={heroTitleLine2} onChange={(e) => setHeroTitleLine2(e.target.value)} required style={inputStyle} />
          </Field>
        </div>
        <Field label="Subtítulo — antes del subrayado">
          <input type="text" value={heroSubtitlePre} onChange={(e) => setHeroSubtitlePre(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Subtítulo — palabra subrayada (dorado)">
          <input type="text" value={heroSubtitleHighlight} onChange={(e) => setHeroSubtitleHighlight(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Subtítulo — después del subrayado">
          <input type="text" value={heroSubtitlePost} onChange={(e) => setHeroSubtitlePost(e.target.value)} style={inputStyle} />
        </Field>
        <ImageUploader
          label="Imagen de fondo del hero"
          value={heroBgImage}
          onChange={setHeroBgImage}
          prefix={`${safePrefix}/hero`}
          previewAspect="16/9"
        />

        <Subtitle text="Badge flotante" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Texto grande (ej. año)">
            <input type="text" value={heroBadgeValue} onChange={(e) => setHeroBadgeValue(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Etiqueta pequeña">
            <input type="text" value={heroBadgeLabel} onChange={(e) => setHeroBadgeLabel(e.target.value)} style={inputStyle} />
          </Field>
        </div>

        <Subtitle text="Collage de 3 fotos del hero" />
        {heroPhotos.map((p, i) => (
          <ImageUploader
            key={i}
            label={`Foto ${i + 1}`}
            value={p}
            onChange={(v) => updateHeroPhoto(i, v)}
            prefix={`${safePrefix}/hero-collage/${i}`}
            previewAspect="4/3"
          />
        ))}

        <Subtitle text="Botones del hero" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="CTA primario — texto" hint="Botón dorado.">
            <input type="text" value={heroCtaPriLabel} onChange={(e) => setHeroCtaPriLabel(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="CTA primario — URL">
            <input type="text" value={heroCtaPriHref} onChange={(e) => setHeroCtaPriHref(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="CTA secundario — texto" hint="Botón outline.">
            <input type="text" value={heroCtaSecLabel} onChange={(e) => setHeroCtaSecLabel(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="CTA secundario — URL">
            <input type="text" value={heroCtaSecHref} onChange={(e) => setHeroCtaSecHref(e.target.value)} style={inputStyle} />
          </Field>
        </div>

        <Subtitle text="Stats bar (parte inferior del hero)" />
        <SimpleArrayList
          items={stats}
          onAdd={addStat}
          onRemove={removeStat}
          addLabel="Agregar stat"
          renderItem={(s, i) => (
            <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-2 flex-1">
              <Field label="Valor">
                <input type="text" value={s.value} onChange={(e) => updateStat(i, { value: e.target.value })} placeholder="50+" style={inputStyle} />
              </Field>
              <Field label="Etiqueta">
                <input type="text" value={s.label} onChange={(e) => updateStat(i, { label: e.target.value })} style={inputStyle} />
              </Field>
            </div>
          )}
        />
      </Card>

      {/* PROCESO */}
      <Card title="Sección — Proceso (cómo unirse)" subtitle="Encabezado + 2 fotos + badge + lista de pasos.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Eyebrow">
            <input type="text" value={procEyebrow} onChange={(e) => setProcEyebrow(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Badge flotante">
            <input type="text" value={procBadge} onChange={(e) => setProcBadge(e.target.value)} style={inputStyle} />
          </Field>
        </div>
        <Field label="Heading — antes del subrayado">
          <input type="text" value={procHeadingPre} onChange={(e) => setProcHeadingPre(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Heading — palabra subrayada (dorado)">
          <input type="text" value={procHeadingHighlight} onChange={(e) => setProcHeadingHighlight(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Descripción">
          <textarea value={procDescription} onChange={(e) => setProcDescription(e.target.value)} rows={2} style={{ ...inputStyle, height: "auto", paddingTop: 10, paddingBottom: 10 }} />
        </Field>
        <ImageUploader label="Foto principal" value={procFotoPrincipal} onChange={setProcFotoPrincipal} prefix={`${safePrefix}/proceso-principal`} previewAspect="4/3" />
        <ImageUploader label="Foto secundaria" value={procFotoSecundaria} onChange={setProcFotoSecundaria} prefix={`${safePrefix}/proceso-secundaria`} previewAspect="4/3" />

        <Subtitle text="Pasos del proceso" />
        <SimpleArrayList
          items={pasos}
          onAdd={addPaso}
          onRemove={removePaso}
          addLabel="Agregar paso"
          renderItem={(p, i) => (
            <div className="flex flex-col gap-2 flex-1">
              <div className="grid grid-cols-[100px_1fr] gap-2">
                <Field label="Número">
                  <input type="text" value={p.num} onChange={(e) => updatePaso(i, { num: e.target.value })} placeholder="01" style={inputStyle} />
                </Field>
                <Field label="Título">
                  <input type="text" value={p.title} onChange={(e) => updatePaso(i, { title: e.target.value })} style={inputStyle} />
                </Field>
              </div>
              <Field label="Descripción">
                <textarea value={p.desc} onChange={(e) => updatePaso(i, { desc: e.target.value })} rows={2} style={{ ...inputStyle, height: "auto", paddingTop: 10, paddingBottom: 10 }} />
              </Field>
            </div>
          )}
        />
      </Card>

      {/* NIVELES */}
      <Card title="Sección — Niveles educativos" subtitle="Cards en la franja oscura. Suelen ser 5 (Inicial, Básica, Media, BGU, IB).">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Eyebrow">
            <input type="text" value={nivEyebrow} onChange={(e) => setNivEyebrow(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Badge flotante">
            <input type="text" value={nivBadge} onChange={(e) => setNivBadge(e.target.value)} style={inputStyle} />
          </Field>
        </div>
        <Field label="Heading — antes del subrayado">
          <input type="text" value={nivHeadingPre} onChange={(e) => setNivHeadingPre(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Heading — palabra subrayada (dorado)">
          <input type="text" value={nivHeadingHighlight} onChange={(e) => setNivHeadingHighlight(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Descripción">
          <textarea value={nivDescription} onChange={(e) => setNivDescription(e.target.value)} rows={2} style={{ ...inputStyle, height: "auto", paddingTop: 10, paddingBottom: 10 }} />
        </Field>
        <ImageUploader label="Foto principal" value={nivFotoPrincipal} onChange={setNivFotoPrincipal} prefix={`${safePrefix}/niveles-principal`} previewAspect="4/3" />
        <ImageUploader label="Foto secundaria" value={nivFotoSecundaria} onChange={setNivFotoSecundaria} prefix={`${safePrefix}/niveles-secundaria`} previewAspect="4/3" />

        <Subtitle text="Cards de niveles" />
        <SimpleArrayList
          items={niveles}
          onAdd={addNivel}
          onRemove={removeNivel}
          addLabel="Agregar nivel"
          renderItem={(n, i) => (
            <div className="grid grid-cols-1 md:grid-cols-[80px_1fr_1fr_1fr_auto] gap-2 flex-1 items-end">
              <Field label="Num">
                <input type="text" value={n.num} onChange={(e) => updateNivel(i, { num: e.target.value })} placeholder="01" style={inputStyle} />
              </Field>
              <Field label="Título">
                <input type="text" value={n.title} onChange={(e) => updateNivel(i, { title: e.target.value })} style={inputStyle} />
              </Field>
              <Field label="Grados">
                <input type="text" value={n.grades} onChange={(e) => updateNivel(i, { grades: e.target.value })} style={inputStyle} />
              </Field>
              <Field label="Edad">
                <input type="text" value={n.age} onChange={(e) => updateNivel(i, { age: e.target.value })} style={inputStyle} />
              </Field>
              <label className="flex items-center gap-1.5 mb-[10px] cursor-pointer" style={{ fontSize: 11, color: "#1A2B4A" }}>
                <input type="checkbox" checked={n.highlight} onChange={(e) => updateNivel(i, { highlight: e.target.checked })} style={{ accentColor: "#9e1915" }} />
                Destacado
              </label>
            </div>
          )}
        />
      </Card>

      {/* EXPLORAR — UI mejorada con cards verticales */}
      <Card
        title="Sección — Explorar (cards a sub-páginas por nivel)"
        subtitle="Grid que enlaza a las 4 páginas /admisiones/[slug]. Cada card tiene icono emoji, título, grados, edad, descripción, link a la sub-página y un highlight opcional."
      >
        <Field label="Eyebrow">
          <input type="text" value={expEyebrow} onChange={(e) => setExpEyebrow(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Heading">
          <input type="text" value={expHeading} onChange={(e) => setExpHeading(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Descripción">
          <textarea value={expDescription} onChange={(e) => setExpDescription(e.target.value)} rows={2} style={{ ...inputStyle, height: "auto", paddingTop: 10, paddingBottom: 10 }} />
        </Field>

        <Subtitle text="Cards de niveles (4 típicamente)" />
        <div className="flex flex-col gap-4">
          {explorar.map((e, i) => (
            <ExplorarCardEditor
              key={i}
              index={i}
              card={e}
              update={(patch) => updateExplorar(i, patch)}
              remove={() => removeExplorar(i)}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={addExplorar}
          style={addButton}
          className="flex items-center justify-center gap-1.5 self-start px-4"
        >
          <Plus size={14} strokeWidth={2.5} /> Agregar card
        </button>
      </Card>

      {/* VISITA */}
      <Card title="Sección — Visita el Campus" subtitle="CTA al final del landing. Collage de 3 fotos + badge horario + texto + 2 botones + línea de contacto.">
        <Field label="Eyebrow">
          <input type="text" value={visEyebrow} onChange={(e) => setVisEyebrow(e.target.value)} style={inputStyle} />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Heading — antes del subrayado">
            <input type="text" value={visHeadingPre} onChange={(e) => setVisHeadingPre(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Heading — palabra subrayada (dorado)">
            <input type="text" value={visHeadingHighlight} onChange={(e) => setVisHeadingHighlight(e.target.value)} style={inputStyle} />
          </Field>
        </div>
        <Field label="Descripción">
          <textarea value={visDescription} onChange={(e) => setVisDescription(e.target.value)} rows={3} style={{ ...inputStyle, height: "auto", paddingTop: 10, paddingBottom: 10 }} />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Ubicación (icono 📍)">
            <input type="text" value={visUbicacion} onChange={(e) => setVisUbicacion(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Horario corto (icono 🕐)">
            <input type="text" value={visHorario} onChange={(e) => setVisHorario(e.target.value)} style={inputStyle} />
          </Field>
        </div>
        <Subtitle text="Botones" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="CTA primario — texto">
            <input type="text" value={visCtaPriLabel} onChange={(e) => setVisCtaPriLabel(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="CTA primario — URL">
            <input type="text" value={visCtaPriHref} onChange={(e) => setVisCtaPriHref(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="CTA secundario — texto">
            <input type="text" value={visCtaSecLabel} onChange={(e) => setVisCtaSecLabel(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="CTA secundario — URL">
            <input type="text" value={visCtaSecHref} onChange={(e) => setVisCtaSecHref(e.target.value)} style={inputStyle} />
          </Field>
        </div>
        <Field label="Línea de contacto">
          <input type="text" value={visContacto} onChange={(e) => setVisContacto(e.target.value)} style={inputStyle} />
        </Field>
        <Subtitle text="Collage de 3 fotos" />
        {visFotos.map((p, i) => (
          <ImageUploader
            key={i}
            label={`Foto ${i + 1}`}
            value={p}
            onChange={(v) => updateVisitaFoto(i, v)}
            prefix={`${safePrefix}/visita/${i}`}
            previewAspect="4/3"
          />
        ))}
        <Subtitle text="Badge flotante" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Línea 1 (grande)">
            <input type="text" value={visBadgeL1} onChange={(e) => setVisBadgeL1(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Línea 2 (pequeña)">
            <input type="text" value={visBadgeL2} onChange={(e) => setVisBadgeL2(e.target.value)} style={inputStyle} />
          </Field>
        </div>
      </Card>

      {/* FAQ */}
      <Card
        title="Sección — Preguntas frecuentes (FAQ)"
        subtitle="Se renderiza como acordeón visible al final del landing + se inyecta como JSON-LD FAQPage para SEO (Google muestra estos Q&A en los resultados de búsqueda)."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Eyebrow">
            <input type="text" value={faqEyebrow} onChange={(e) => setFaqEyebrow(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Heading">
            <input type="text" value={faqHeading} onChange={(e) => setFaqHeading(e.target.value)} style={inputStyle} />
          </Field>
        </div>
        <Field label="Descripción (opcional)">
          <textarea value={faqDescription} onChange={(e) => setFaqDescription(e.target.value)} rows={2} style={{ ...inputStyle, height: "auto", paddingTop: 10, paddingBottom: 10 }} />
        </Field>

        <Subtitle text="Preguntas y respuestas" />
        <SimpleArrayList
          items={faqItems}
          onAdd={addFaq}
          onRemove={removeFaq}
          addLabel="Agregar Q&A"
          renderItem={(q, i) => (
            <div className="flex flex-col gap-2 flex-1">
              <Field label="Pregunta">
                <input type="text" value={q.pregunta} onChange={(e) => updateFaq(i, { pregunta: e.target.value })} style={inputStyle} />
              </Field>
              <Field label="Respuesta">
                <textarea value={q.respuesta} onChange={(e) => updateFaq(i, { respuesta: e.target.value })} rows={3} style={{ ...inputStyle, height: "auto", paddingTop: 10, paddingBottom: 10 }} />
              </Field>
            </div>
          )}
        />
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
            style={{ ...inputStyle, height: "auto", minHeight: 50, paddingTop: 10, paddingBottom: 10, resize: "vertical" }}
          />
        </Field>
      </Card>
    </form>
  );
}

/* ─── Card del Explorar con layout vertical limpio ─── */
function ExplorarCardEditor({
  index,
  card,
  update,
  remove,
}: {
  index: number;
  card: AdmisionesExplorarCard;
  update: (patch: Partial<AdmisionesExplorarCard>) => void;
  remove: () => void;
}) {
  return (
    <div
      className="flex flex-col gap-3 p-4"
      style={{
        background: "#FAFAF8",
        border: "1px solid #E8E4DD",
        borderRadius: 10,
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center justify-center"
            style={{
              width: 28,
              height: 28,
              background: card.highlight ? "rgba(158,25,21,0.18)" : "rgba(158,25,21,0.10)",
              borderRadius: 6,
              fontSize: 14,
            }}
          >
            {card.icon || "•"}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#6B6660",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Card {index + 1}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 cursor-pointer" style={{ fontSize: 11, color: "#1A2B4A" }}>
            <input
              type="checkbox"
              checked={card.highlight}
              onChange={(e) => update({ highlight: e.target.checked })}
              style={{ accentColor: "#9e1915" }}
            />
            Destacado
          </label>
          <button
            type="button"
            onClick={remove}
            aria-label="Eliminar card"
            style={iconButton}
          >
            <Trash2 size={12} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[160px_70px_1fr] gap-2">
        <Field
          label="Slug interno"
          hint="Identificador único (ej. inicial, ib)."
        >
          <input
            type="text"
            value={card.slug}
            onChange={(e) => update({ slug: e.target.value })}
            placeholder="inicial"
            style={{ ...inputStyle, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
          />
        </Field>
        <Field label="Icono (emoji)">
          <input
            type="text"
            value={card.icon}
            onChange={(e) => update({ icon: e.target.value })}
            placeholder="🌱"
            style={inputStyle}
          />
        </Field>
        <Field label="Título">
          <input
            type="text"
            value={card.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="Educación Inicial"
            style={inputStyle}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Field label="Grados">
          <input
            type="text"
            value={card.grades}
            onChange={(e) => update({ grades: e.target.value })}
            placeholder="Pre-Kinder y Kinder"
            style={inputStyle}
          />
        </Field>
        <Field label="Edad">
          <input
            type="text"
            value={card.age}
            onChange={(e) => update({ age: e.target.value })}
            placeholder="3 – 5 años"
            style={inputStyle}
          />
        </Field>
      </div>

      <Field label="Descripción">
        <textarea
          value={card.desc}
          onChange={(e) => update({ desc: e.target.value })}
          rows={2}
          style={{ ...inputStyle, height: "auto", paddingTop: 10, paddingBottom: 10 }}
        />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <Field
          label="Texto del botón al pie"
          hint='Default: "Ver requisitos".'
        >
          <input
            type="text"
            value={card.ctaLabel}
            onChange={(e) => update({ ctaLabel: e.target.value })}
            placeholder="Ver requisitos"
            style={inputStyle}
          />
        </Field>
        <Field
          label="URL del botón"
          hint='Si vacío, se usa "/admisiones/[slug]" automáticamente.'
        >
          <input
            type="text"
            value={card.href}
            onChange={(e) => update({ href: e.target.value })}
            placeholder="/admisiones/inicial"
            style={inputStyle}
          />
        </Field>
      </div>
    </div>
  );
}

function SimpleArrayList<T>({
  items,
  onAdd,
  onRemove,
  addLabel,
  renderItem,
}: {
  items: T[];
  onAdd: () => void;
  onRemove: (i: number) => void;
  addLabel: string;
  renderItem: (item: T, i: number) => React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-3"
            style={{
              background: "#FAFAF8",
              border: "1px solid #E8E4DD",
              borderRadius: 10,
            }}
          >
            {renderItem(item, i)}
            <button
              type="button"
              onClick={() => onRemove(i)}
              aria-label="Eliminar"
              style={iconButton}
              className="mt-[20px] flex-shrink-0"
            >
              <Trash2 size={12} strokeWidth={2.5} />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={onAdd}
        style={addButton}
        className="flex items-center justify-center gap-1.5 self-start px-4"
      >
        <Plus size={14} strokeWidth={2.5} />
        {addLabel}
      </button>
    </>
  );
}

function Sticky({
  state,
  isPending,
  publicada,
  setPublicada,
}: {
  state: PaginaActionState;
  isPending: boolean;
  publicada: boolean;
  setPublicada: (v: boolean) => void;
}) {
  return (
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

function Subtitle({ text }: { text: string }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: "#9e1915",
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
const iconButton: React.CSSProperties = {
  width: 28,
  height: 28,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: "transparent",
  color: "#991B1B",
  border: "1px solid #FECACA",
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
