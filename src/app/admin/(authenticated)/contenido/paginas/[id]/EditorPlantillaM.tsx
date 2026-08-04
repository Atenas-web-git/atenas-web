"use client";

import { useActionState, useEffect, useState } from "react";
import {
  Save,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Check,
  AlertTriangle,
} from "lucide-react";
import { guardarPaginaAction, type PaginaActionState } from "../actions";
import type {
  ContenidoPlantillaM,
  HeroPlantillaM,
  TaglinePlantillaM,
  HScrollPlantillaM,
  SlideHScrollPlantillaM,
  TrayectoriaPlantillaM,
  NivelesPlantillaM,
  CardNivelPlantillaM,
  PorQueAtenasPlantillaM,
  CardPorQuePlantillaM,
} from "../../plantillas";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { VideoUploader } from "@/components/admin/VideoUploader";
import { TimeInput } from "@/components/admin/TimeInput";
import { parseYouTubeUrl } from "@/lib/cms/parseYouTubeUrl";

type Hero = ContenidoPlantillaM["hero"];
type Tagline = ContenidoPlantillaM["tagline"];
type HScroll = ContenidoPlantillaM["hscroll"];
type Trayectoria = ContenidoPlantillaM["trayectoria"];
type Niveles = ContenidoPlantillaM["niveles"];
type PorQue = ContenidoPlantillaM["porQueAtenas"];

export function EditorPlantillaM({
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
  initialContenido: ContenidoPlantillaM;
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
  const [tagline, setTagline] = useState<Tagline>(initialContenido.tagline);
  const [hscroll, setHscroll] = useState<HScroll>(initialContenido.hscroll);
  const [trayectoria, setTrayectoria] = useState<Trayectoria>(initialContenido.trayectoria);
  const [niveles, setNiveles] = useState<Niveles>(initialContenido.niveles);
  const [porQue, setPorQue] = useState<PorQue>(initialContenido.porQueAtenas);

  const safePrefix = `paginas/${slug.replace(/[^a-z0-9-]/g, "-")}`;
  const contenidoJson = JSON.stringify({
    hero,
    tagline,
    hscroll,
    trayectoria,
    niveles,
    porQueAtenas: porQue,
  });

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
          <input type="text" value={slug === "/" ? "/" : `/${slug}`} readOnly disabled style={{ ...inputStyle, background: "#F4F1EB", color: "#A0AABA" }} />
        </Field>
        <p style={{ fontSize: 11, color: "#A0AABA", margin: 0, lineHeight: 1.5 }}>
          Esta plantilla controla la página principal del sitio (la raíz del dominio). La Intro animada, la Navbar y el FooterCTA son globales — se editarán por separado en una sesión futura.
        </p>
      </Card>

      <HeroEditor hero={hero} setHero={setHero} prefix={`${safePrefix}/hero`} />
      <TaglineEditor tagline={tagline} setTagline={setTagline} />
      <HScrollEditor hscroll={hscroll} setHscroll={setHscroll} prefix={`${safePrefix}/hscroll`} />
      <TrayectoriaEditor trayectoria={trayectoria} setTrayectoria={setTrayectoria} prefix={`${safePrefix}/trayectoria`} />
      <NivelesEditor niveles={niveles} setNiveles={setNiveles} prefix={`${safePrefix}/niveles`} />
      <PorQueEditor porQue={porQue} setPorQue={setPorQue} prefix={`${safePrefix}/porque`} />

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

/* ─── Hero (con video YouTube) ─── */

function HeroEditor({ hero, setHero, prefix }: { hero: Hero; setHero: (h: Hero) => void; prefix: string }) {
  const set = (patch: Partial<HeroPlantillaM>) => setHero({ ...hero, ...patch });

  // Líneas del título — manipuladas como arreglo
  const updateLine = (i: number, value: string) =>
    set({ titleLines: hero.titleLines.map((l, idx) => (idx === i ? value : l)) });
  const addLine = () => set({ titleLines: [...hero.titleLines, ""] });
  const removeLine = (i: number) =>
    set({ titleLines: hero.titleLines.filter((_, idx) => idx !== i) });
  const moveLine = (i: number, dir: -1 | 1) => {
    const next = [...hero.titleLines];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set({ titleLines: next });
  };

  // YouTube — input local que se sincroniza al state
  const [ytUrl, setYtUrl] = useState(hero.videoYoutubeUrl ?? "");
  useEffect(() => {
    if (ytUrl !== hero.videoYoutubeUrl) {
      set({ videoYoutubeUrl: ytUrl });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ytUrl]);

  const ytParsed = ytUrl.trim() ? parseYouTubeUrl(ytUrl.trim()) : null;
  const ytOk = ytParsed !== null;

  return (
    <Card
      title="Bloque 1 — Hero (con video YouTube de fondo)"
      subtitle="Cabecera principal del sitio. Acepta un video de YouTube en loop como fondo (con audio muteado). Si no hay video, se usa la foto como fondo estático."
    >
      {/* Video YouTube */}
      <div className="flex flex-col gap-3 p-4" style={panelStyle}>
        <span style={panelLabel}>Video YouTube de fondo (opcional)</span>
        <div className="px-3 py-2 rounded-md" style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
          <p style={{ fontSize: 11, color: "#1E40AF", margin: 0, lineHeight: 1.5 }}>
            Pega cualquier URL de YouTube (formato <code>youtube.com/watch?v=…</code>, <code>youtu.be/…</code>, <code>/embed/…</code> o <code>/shorts/…</code>). Detectamos el ID automáticamente. Para hacer loop de un segmento específico llena los campos de inicio y fin.
          </p>
        </div>
        <Field label="URL del video">
          <input
            type="url"
            value={ytUrl}
            onChange={(e) => setYtUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=…"
            style={inputStyle}
          />
        </Field>

        {ytOk && ytParsed && (
          <div className="flex items-start gap-2 px-3 py-2 rounded-md" style={{ background: "#DCFCE7", border: "1px solid #BBF7D0" }}>
            <Check size={14} strokeWidth={2.5} color="#065F46" style={{ marginTop: 1 }} />
            <span style={{ fontSize: 12, color: "#065F46", lineHeight: 1.5 }}>
              Video detectado · ID: <code style={{ fontFamily: "ui-monospace, monospace" }}>{ytParsed.videoId}</code>
            </span>
          </div>
        )}
        {ytUrl.trim() && !ytOk && (
          <div className="flex items-start gap-2 px-3 py-2 rounded-md" style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}>
            <AlertTriangle size={14} strokeWidth={2.5} color="#92400E" style={{ marginTop: 1 }} />
            <span style={{ fontSize: 12, color: "#92400E", lineHeight: 1.5 }}>
              No es una URL válida de YouTube. Revisa el formato.
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field label="Inicio del loop (minuto:segundo)" hint='Formato m:ss — ej. "2:32". Deja "0:00" para empezar del principio.'>
            <TimeInput
              value={hero.startSeconds}
              onChange={(secs) => set({ startSeconds: secs })}
              placeholder="0:00"
              style={inputStyle}
            />
          </Field>
          <Field label="Fin del loop (minuto:segundo)" hint='Formato m:ss — ej. "3:20". Deja "0:00" para que el video corra completo sin loop.'>
            <TimeInput
              value={hero.endSeconds}
              onChange={(secs) => set({ endSeconds: secs })}
              placeholder="0:00"
              style={inputStyle}
            />
          </Field>
        </div>
      </div>

      {/* Video propio subido — alternativa a YouTube, sin branding */}
      <div className="flex flex-col gap-3 p-4" style={panelStyle}>
        <span style={panelLabel}>Video propio de fondo (recomendado)</span>
        <div className="px-3 py-2 rounded-md" style={{ background: "#DCFCE7", border: "1px solid #BBF7D0" }}>
          <p style={{ fontSize: 11, color: "#065F46", margin: 0, lineHeight: 1.5 }}>
            Sube un video MP4 o WebM <strong>liviano y sin audio</strong> (máx. 15 MB). Tiene
            <strong> prioridad sobre el video de YouTube</strong> y se reproduce en loop sin el
            botón de play ni el logo de YouTube. Recomendado para un fondo limpio y profesional.
            Si subes un video aquí, el de YouTube se ignora.
          </p>
        </div>
        <VideoUploader
          value={hero.bgVideoUrl ?? ""}
          onChange={(v) => set({ bgVideoUrl: v })}
          prefix={`${prefix}/hero-video`}
          hint="Consejo: exporta el video a 1280×720, sin audio, recortado a 10-20 segundos para que pese poco."
        />
      </div>

      {/* Foto de fondo (fallback / cover mientras carga el video) */}
      <ImageUploader
        label="Foto de fondo (fallback)"
        value={hero.bgImageSrc}
        onChange={(v) => set({ bgImageSrc: v })}
        prefix={prefix}
        previewAspect="16/9"
        hint="Se muestra siempre como capa inferior. Si no hay ningún video (propio ni YouTube), esta foto queda visible como fondo del hero."
      />

      {/* Líneas del título */}
      <span style={fieldLabel}>Líneas del título {hero.titleLines.length > 0 && `(${hero.titleLines.length})`}</span>
      <p style={{ fontSize: 11, color: "#A0AABA", margin: 0, lineHeight: 1.5 }}>
        Cada línea anima por separado. Recomendado 2-3 líneas (ej. "Formando líderes" / "que transforman" / "el Ecuador.").
      </p>
      <div className="flex flex-col gap-2">
        {hero.titleLines.map((l, i) => (
          <div key={i} className="flex items-center gap-2 p-2" style={panelStyle}>
            <span style={{ ...panelLabel, width: 26 }}>#{i + 1}</span>
            <input type="text" value={l} onChange={(e) => updateLine(i, e.target.value)} style={{ ...inputStyle, flex: 1, height: 32 }} />
            <button type="button" onClick={() => moveLine(i, -1)} disabled={i === 0} aria-label="Subir" style={iconButton(i === 0)}>
              <ArrowUp size={12} strokeWidth={2.5} />
            </button>
            <button type="button" onClick={() => moveLine(i, 1)} disabled={i === hero.titleLines.length - 1} aria-label="Bajar" style={iconButton(i === hero.titleLines.length - 1)}>
              <ArrowDown size={12} strokeWidth={2.5} />
            </button>
            <button type="button" onClick={() => removeLine(i)} aria-label="Eliminar" style={{ ...iconButton(false), color: "#991B1B", borderColor: "#FECACA" }}>
              <Trash2 size={12} strokeWidth={2.5} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addLine} style={addButton} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4">
        <Plus size={14} strokeWidth={2.5} />
        Agregar línea
      </button>

      <Field label="Subtítulo">
        <textarea value={hero.subtitle} onChange={(e) => set({ subtitle: e.target.value })} rows={2} style={textareaStyle} />
      </Field>

      {/* Link al video público */}
      <div className="flex flex-col gap-3 p-4" style={panelStyle}>
        <span style={panelLabel}>Link "Reproducir video"</span>
        <p style={{ fontSize: 11, color: "#A0AABA", margin: 0, lineHeight: 1.5 }}>
          Al hacer clic en el link bajo el hero, el visitante va a esta URL (se abre en una nueva pestaña). Generalmente es el mismo video de YouTube.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-3">
          <Field label="Texto del link" hint='Ej. "REPRODUCIR VIDEO".'>
            <input type="text" value={hero.videoLinkText} onChange={(e) => set({ videoLinkText: e.target.value })} style={inputStyle} />
          </Field>
          <Field label="URL del link" hint="Si la dejas vacía, se usa la URL del video YouTube de fondo.">
            <input type="url" value={hero.videoLinkUrl} onChange={(e) => set({ videoLinkUrl: e.target.value })} placeholder="https://www.youtube.com/watch?v=…" style={inputStyle} />
          </Field>
        </div>
      </div>
    </Card>
  );
}

/* ─── Tagline ─── */

function TaglineEditor({ tagline, setTagline }: { tagline: Tagline; setTagline: (t: Tagline) => void }) {
  const set = (patch: Partial<TaglinePlantillaM>) => setTagline({ ...tagline, ...patch });

  return (
    <Card title="Bloque 2 — Tagline" subtitle="Banda institucional entre el hero y el scroll horizontal.">
      <Field label="Eyebrow" required hint='Texto pequeño rojo arriba (ej. "Nuestra razón de ser").'>
        <input type="text" value={tagline.eyebrow} onChange={(e) => set({ eyebrow: e.target.value })} required style={inputStyle} />
      </Field>
      <Field
        label="Primera línea (con palabra clave entre llaves)"
        required
        hint='Encierra entre {} la palabra/frase que recibe el subrayado rojo. Ej.: "La {institución referente} de Ambato,"'
      >
        <input type="text" value={tagline.line1} onChange={(e) => set({ line1: e.target.value })} required style={inputStyle} />
      </Field>
      <Field label="Segunda línea" hint="Sin subrayado. Déjala vacía si quieres una sola línea.">
        <input type="text" value={tagline.line2} onChange={(e) => set({ line2: e.target.value })} style={inputStyle} />
      </Field>
    </Card>
  );
}

/* ─── HScroll (4 slides) ─── */

function HScrollEditor({ hscroll, setHscroll, prefix }: { hscroll: HScroll; setHscroll: (h: HScroll) => void; prefix: string }) {
  const set = (patch: Partial<HScrollPlantillaM>) => setHscroll({ ...hscroll, ...patch });
  const updateSlide = (i: number, patch: Partial<SlideHScrollPlantillaM>) =>
    set({
      slides: hscroll.slides.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) as HScroll["slides"],
    });
  const updateMetric = (slideIdx: number, mIdx: number, patch: Partial<{ value: string; label: string }>) =>
    updateSlide(slideIdx, {
      metrics: hscroll.slides[slideIdx].metrics.map((m, idx) => (idx === mIdx ? { ...m, ...patch } : m)),
    });

  return (
    <Card
      title="Bloque 3 — Scroll horizontal (4 slides fijos)"
      subtitle='El orden, el layout y los colores de cada slide son estructurales del diseño y no se editan. Solo cambias textos, métricas e imagen principal de cada uno.'
    >
      <Field label='Texto decorativo de fondo ("ghost label")' hint='Aparece como marca de agua en el slide y en el carrusel mobile. Ej. "Vive el Atenas".'>
        <input type="text" value={hscroll.ghostLabel} onChange={(e) => set({ ghostLabel: e.target.value })} style={inputStyle} />
      </Field>

      <div className="flex flex-col gap-4">
        {hscroll.slides.map((slide, i) => (
          <div key={i} className="flex flex-col gap-3 p-4" style={panelStyle}>
            <div className="flex items-center gap-2">
              <span style={{ ...panelLabel, padding: "2px 8px", background: "#1A2B4A", color: "#FFFFFF", borderRadius: 4 }}>
                Slide {i + 1}
              </span>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#1A2B4A" }}>{slide.tab}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Nombre del tab" required hint='Aparece en la franja de tabs y como palabra superior del badge flotante (ej. "ACADÉMICO").'>
                <input type="text" value={slide.tab} onChange={(e) => updateSlide(i, { tab: e.target.value })} required style={inputStyle} />
              </Field>
              <Field label="Texto inferior del badge flotante" required hint='Palabra grande dentro del círculo flotante (ej. "Potencial", "IB", "Campeones", "Valores").'>
                <input type="text" value={slide.badgeText} onChange={(e) => updateSlide(i, { badgeText: e.target.value })} required style={inputStyle} />
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label='Heading (parte light)' required hint='Línea normal arriba del bold (ej. "Docentes de").'>
                <input type="text" value={slide.headingLight} onChange={(e) => updateSlide(i, { headingLight: e.target.value })} required style={inputStyle} />
              </Field>
              <Field label='Heading (parte bold/rojo)' required hint='Línea en negrita roja (ej. "Excepción.").'>
                <input type="text" value={slide.headingBold} onChange={(e) => updateSlide(i, { headingBold: e.target.value })} required style={inputStyle} />
              </Field>
            </div>
            <Field label="Cuerpo (desktop)" required>
              <textarea value={slide.body} onChange={(e) => updateSlide(i, { body: e.target.value })} required rows={3} style={textareaStyle} />
            </Field>
            <Field label="Cuerpo (mobile)" required hint="Versión más corta para el carrusel mobile.">
              <textarea value={slide.mobileBody} onChange={(e) => updateSlide(i, { mobileBody: e.target.value })} required rows={2} style={textareaStyle} />
            </Field>

            <span style={fieldLabel}>Métricas (3 fijas)</span>
            <div className="flex flex-col gap-2">
              {slide.metrics.map((m, mi) => (
                <div key={mi} className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 p-2" style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 6 }}>
                  <input type="text" value={m.value} onChange={(e) => updateMetric(i, mi, { value: e.target.value })} placeholder="Valor (ej. 50+)" style={{ ...inputStyle, height: 32 }} />
                  <input type="text" value={m.label} onChange={(e) => updateMetric(i, mi, { label: e.target.value })} placeholder="Etiqueta" style={{ ...inputStyle, height: 32 }} />
                </div>
              ))}
            </div>

            <ImageUploader
              label={i === 0 ? "Imagen del slide" : "Imagen principal del collage (arriba-izq.)"}
              value={slide.imagenPrincipal}
              onChange={(v) => updateSlide(i, { imagenPrincipal: v })}
              prefix={prefix}
              previewAspect="16/9"
              hint={i === 0 ? "Ocupa todo el panel izquierdo (full-bleed)." : "Imagen grande de la parte superior del collage izquierdo."}
            />
            {i > 0 && (
              <ImageUploader
                label="Imagen secundaria del collage (abajo-der.)"
                value={slide.imagenSecundaria}
                onChange={(v) => updateSlide(i, { imagenSecundaria: v })}
                prefix={prefix}
                previewAspect="16/9"
                hint="Imagen más pequeña que se superpone al collage. La posición y dimensiones son fijas por diseño."
              />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─── Trayectoria ─── */

function TrayectoriaEditor({ trayectoria, setTrayectoria, prefix }: { trayectoria: Trayectoria; setTrayectoria: (t: Trayectoria) => void; prefix: string }) {
  const set = (patch: Partial<TrayectoriaPlantillaM>) => setTrayectoria({ ...trayectoria, ...patch });

  const updateTitleLine = (i: number, value: string) =>
    set({ titleLines: trayectoria.titleLines.map((l, idx) => (idx === i ? value : l)) });
  const addTitleLine = () => set({ titleLines: [...trayectoria.titleLines, ""] });
  const removeTitleLine = (i: number) =>
    set({ titleLines: trayectoria.titleLines.filter((_, idx) => idx !== i) });

  const updateStat = (i: number, patch: Partial<{ value: string; suffix: string; label: string }>) =>
    set({ stats: trayectoria.stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });
  const addStat = () => set({ stats: [...trayectoria.stats, { value: "", suffix: "", label: "" }] });
  const removeStat = (i: number) => set({ stats: trayectoria.stats.filter((_, idx) => idx !== i) });

  return (
    <Card
      title="Bloque 4 — Trayectoria"
      subtitle="Sección oscura con escudo, ghost text, título y stats animadas (count-up para valores numéricos)."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Eyebrow" required>
          <input type="text" value={trayectoria.eyebrow} onChange={(e) => set({ eyebrow: e.target.value })} required style={inputStyle} />
        </Field>
        <Field label='Ghost text' hint='Texto enorme decorativo de fondo (ej. "50 AÑOS"). Opcional.'>
          <input type="text" value={trayectoria.ghostText} onChange={(e) => set({ ghostText: e.target.value })} style={inputStyle} />
        </Field>
      </div>

      <span style={fieldLabel}>Líneas del título</span>
      <div className="flex flex-col gap-2">
        {trayectoria.titleLines.map((l, i) => (
          <div key={i} className="flex items-center gap-2 p-2" style={panelStyle}>
            <span style={{ ...panelLabel, width: 26 }}>#{i + 1}</span>
            <input type="text" value={l} onChange={(e) => updateTitleLine(i, e.target.value)} style={{ ...inputStyle, flex: 1, height: 32 }} />
            <button type="button" onClick={() => removeTitleLine(i)} aria-label="Eliminar" style={{ ...iconButton(false), color: "#991B1B", borderColor: "#FECACA" }}>
              <Trash2 size={12} strokeWidth={2.5} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addTitleLine} style={addButton} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4">
        <Plus size={14} strokeWidth={2.5} />
        Agregar línea
      </button>

      <Field label="Subtítulo">
        <textarea value={trayectoria.subtitle} onChange={(e) => set({ subtitle: e.target.value })} rows={2} style={textareaStyle} />
      </Field>

      <ImageUploader
        label="Foto de fondo con parallax"
        value={trayectoria.bgImageSrc}
        onChange={(v) => set({ bgImageSrc: v })}
        prefix={prefix}
        previewAspect="16/9"
      />

      <span style={fieldLabel}>Stats ({trayectoria.stats.length})</span>
      <p style={{ fontSize: 11, color: "#A0AABA", margin: 0, lineHeight: 1.5 }}>
        Si el valor es numérico (ej. <code>50</code>), se anima con un contador. Si no (ej. <code>IB</code>), se muestra tal cual. El sufijo solo se muestra cuando el valor es numérico.
      </p>
      <div className="flex flex-col gap-3">
        {trayectoria.stats.map((s, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-[120px_80px_1fr_auto] gap-2 p-3" style={panelStyle}>
            <input type="text" value={s.value} onChange={(e) => updateStat(i, { value: e.target.value })} placeholder="Valor" style={{ ...inputStyle, height: 32 }} />
            <input type="text" value={s.suffix} onChange={(e) => updateStat(i, { suffix: e.target.value })} placeholder="Sufijo" style={{ ...inputStyle, height: 32 }} />
            <input type="text" value={s.label} onChange={(e) => updateStat(i, { label: e.target.value })} placeholder="Etiqueta" style={{ ...inputStyle, height: 32 }} />
            <button type="button" onClick={() => removeStat(i)} aria-label="Eliminar" style={{ ...iconButton(false), color: "#991B1B", borderColor: "#FECACA" }}>
              <Trash2 size={12} strokeWidth={2.5} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addStat} style={addButton} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4">
        <Plus size={14} strokeWidth={2.5} />
        Agregar stat
      </button>
    </Card>
  );
}

/* ─── Niveles ─── */

function NivelesEditor({ niveles, setNiveles, prefix }: { niveles: Niveles; setNiveles: (n: Niveles) => void; prefix: string }) {
  const set = (patch: Partial<NivelesPlantillaM>) => setNiveles({ ...niveles, ...patch });

  const updateTitleLine = (i: number, patch: Partial<{ text: string; weight: 300 | 400 | 700; opacity: number }>) =>
    set({ titleLines: niveles.titleLines.map((l, idx) => (idx === i ? { ...l, ...patch } : l)) });
  const addTitleLine = () => set({ titleLines: [...niveles.titleLines, { text: "", weight: 700, opacity: 1 }] });
  const removeTitleLine = (i: number) =>
    set({ titleLines: niveles.titleLines.filter((_, idx) => idx !== i) });
  const moveTitleLine = (i: number, dir: -1 | 1) => {
    const next = [...niveles.titleLines];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set({ titleLines: next });
  };

  const updateMobileLine = (i: number, value: string) =>
    set({ mobileTitleLines: niveles.mobileTitleLines.map((l, idx) => (idx === i ? value : l)) });
  const addMobileLine = () => set({ mobileTitleLines: [...niveles.mobileTitleLines, ""] });
  const removeMobileLine = (i: number) =>
    set({ mobileTitleLines: niveles.mobileTitleLines.filter((_, idx) => idx !== i) });

  const updateCard = (i: number, patch: Partial<CardNivelPlantillaM>) =>
    set({
      cards: niveles.cards.map((c, idx) => (idx === i ? { ...c, ...patch } : c)) as Niveles["cards"],
    });

  return (
    <Card
      title="Bloque 5 — Niveles educativos"
      subtitle="Header multi-línea + 4 cards (Inicial, Básica, BGU, IB). Cada card tiene texto y foto editable; el layout y las animaciones son fijos."
    >
      <Field label="Eyebrow" required>
        <input type="text" value={niveles.eyebrow} onChange={(e) => set({ eyebrow: e.target.value })} required style={inputStyle} />
      </Field>

      <span style={fieldLabel}>Líneas del título (desktop)</span>
      <p style={{ fontSize: 11, color: "#A0AABA", margin: 0, lineHeight: 1.5 }}>
        Cada línea es independiente. <code>weight: 300</code> = fuente light (pequeña). <code>weight: 700</code> = bold grande. <code>opacity</code> 0–1.
      </p>
      <div className="flex flex-col gap-2">
        {niveles.titleLines.map((line, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_100px_80px_auto] gap-2 p-2 items-center" style={panelStyle}>
            <input type="text" value={line.text} onChange={(e) => updateTitleLine(i, { text: e.target.value })} placeholder="Texto" style={{ ...inputStyle, height: 32 }} />
            <select value={line.weight} onChange={(e) => updateTitleLine(i, { weight: Number(e.target.value) as 300 | 400 | 700 })} style={{ ...inputStyle, height: 32 }}>
              <option value={300}>Light (300)</option>
              <option value={400}>Normal (400)</option>
              <option value={700}>Bold (700)</option>
            </select>
            <input type="number" step={0.1} min={0} max={1} value={line.opacity} onChange={(e) => updateTitleLine(i, { opacity: Math.min(1, Math.max(0, Number(e.target.value) || 0)) })} style={{ ...inputStyle, height: 32 }} />
            <div className="flex gap-1">
              <button type="button" onClick={() => moveTitleLine(i, -1)} disabled={i === 0} aria-label="Subir" style={iconButton(i === 0)}>
                <ArrowUp size={12} strokeWidth={2.5} />
              </button>
              <button type="button" onClick={() => moveTitleLine(i, 1)} disabled={i === niveles.titleLines.length - 1} aria-label="Bajar" style={iconButton(i === niveles.titleLines.length - 1)}>
                <ArrowDown size={12} strokeWidth={2.5} />
              </button>
              <button type="button" onClick={() => removeTitleLine(i)} aria-label="Eliminar" style={{ ...iconButton(false), color: "#991B1B", borderColor: "#FECACA" }}>
                <Trash2 size={12} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={addTitleLine} style={addButton} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4">
        <Plus size={14} strokeWidth={2.5} />
        Agregar línea
      </button>

      <span style={fieldLabel}>Líneas del título (mobile)</span>
      <p style={{ fontSize: 11, color: "#A0AABA", margin: 0, lineHeight: 1.5 }}>
        Versión más compacta para mobile (3 líneas típicamente).
      </p>
      <div className="flex flex-col gap-2">
        {niveles.mobileTitleLines.map((l, i) => (
          <div key={i} className="flex items-center gap-2 p-2" style={panelStyle}>
            <span style={{ ...panelLabel, width: 26 }}>#{i + 1}</span>
            <input type="text" value={l} onChange={(e) => updateMobileLine(i, e.target.value)} style={{ ...inputStyle, flex: 1, height: 32 }} />
            <button type="button" onClick={() => removeMobileLine(i)} aria-label="Eliminar" style={{ ...iconButton(false), color: "#991B1B", borderColor: "#FECACA" }}>
              <Trash2 size={12} strokeWidth={2.5} />
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={addMobileLine} style={addButton} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4">
        <Plus size={14} strokeWidth={2.5} />
        Agregar línea mobile
      </button>

      <span style={fieldLabel}>Cards de niveles (4)</span>
      <div className="flex flex-col gap-4">
        {niveles.cards.map((card, i) => (
          <div key={i} className="flex flex-col gap-3 p-4" style={panelStyle}>
            <span style={{ ...panelLabel, padding: "2px 8px", background: "#1A2B4A", color: "#FFFFFF", borderRadius: 4, alignSelf: "start" }}>
              Card {i + 1} — {card.label}
            </span>
            <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] gap-3">
              <Field label="Label" required hint='ej. "INICIAL"'>
                <input type="text" value={card.label} onChange={(e) => updateCard(i, { label: e.target.value })} required style={inputStyle} />
              </Field>
              <Field label="Título" required hint='Usa "\n" para forzar salto de línea (ej. "Educación\\nInicial").'>
                <input type="text" value={card.title} onChange={(e) => updateCard(i, { title: e.target.value })} required style={inputStyle} />
              </Field>
            </div>
            <Field label="Descripción (se ve en hover desktop)" required>
              <textarea value={card.desc} onChange={(e) => updateCard(i, { desc: e.target.value })} required rows={2} style={textareaStyle} />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Título mobile (opcional)" hint="Si vacío, usa el título general.">
                <input type="text" value={card.mobileTitle} onChange={(e) => updateCard(i, { mobileTitle: e.target.value })} style={inputStyle} />
              </Field>
              <Field label="Label mobile (opcional)" hint="Si vacío, usa el label general.">
                <input type="text" value={card.mobileLabel} onChange={(e) => updateCard(i, { mobileLabel: e.target.value })} style={inputStyle} />
              </Field>
            </div>
            <Field label="URL de destino (href)" hint='Ruta a la que va el visitante al hacer clic en la card. Interna ("/academico/niveles/inicial") o externa ("https://..."). Vacío = no clickeable.'>
              <input type="text" value={card.href} onChange={(e) => updateCard(i, { href: e.target.value })} placeholder="/academico/niveles/..." style={inputStyle} />
            </Field>
            <ImageUploader
              label="Foto"
              value={card.img}
              onChange={(v) => updateCard(i, { img: v })}
              prefix={prefix}
              previewAspect="4/3"
            />
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─── Por qué Atenas ─── */

function PorQueEditor({ porQue, setPorQue, prefix }: { porQue: PorQue; setPorQue: (p: PorQue) => void; prefix: string }) {
  const set = (patch: Partial<PorQueAtenasPlantillaM>) => setPorQue({ ...porQue, ...patch });
  const updateCard = (i: number, patch: Partial<CardPorQuePlantillaM>) =>
    set({
      cards: porQue.cards.map((c, idx) => (idx === i ? { ...c, ...patch } : c)) as PorQue["cards"],
    });

  return (
    <Card
      title="Bloque 6 — Por qué Atenas"
      subtitle="Header centrado + 4 cards horizontales (foto arriba, texto abajo)."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Eyebrow" required>
          <input type="text" value={porQue.eyebrow} onChange={(e) => set({ eyebrow: e.target.value })} required style={inputStyle} />
        </Field>
        <Field label='Ghost text' hint='Texto enorme decorativo (ej. "SÉ MÁS"). Opcional.'>
          <input type="text" value={porQue.ghostText} onChange={(e) => set({ ghostText: e.target.value })} style={inputStyle} />
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Título (parte light)" required hint='Línea light navy (ej. "Descubre incluso").'>
          <input type="text" value={porQue.titleLight} onChange={(e) => set({ titleLight: e.target.value })} required style={inputStyle} />
        </Field>
        <Field label="Título (parte bold/rojo)" required hint='Línea bold rojo con underline (ej. "más.").'>
          <input type="text" value={porQue.titleBold} onChange={(e) => set({ titleBold: e.target.value })} required style={inputStyle} />
        </Field>
      </div>
      <Field label="Subtítulo (solo desktop)">
        <textarea value={porQue.subtitle} onChange={(e) => set({ subtitle: e.target.value })} rows={2} style={textareaStyle} />
      </Field>

      <span style={fieldLabel}>Cards (4)</span>
      <div className="flex flex-col gap-4">
        {porQue.cards.map((card, i) => (
          <div key={i} className="flex flex-col gap-3 p-4" style={panelStyle}>
            <span style={{ ...panelLabel, padding: "2px 8px", background: "#1A2B4A", color: "#FFFFFF", borderRadius: 4, alignSelf: "start" }}>
              Card {i + 1}
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Label (desktop)" required>
                <input type="text" value={card.label} onChange={(e) => updateCard(i, { label: e.target.value })} required style={inputStyle} />
              </Field>
              <Field label="Label mobile (en mayúsculas)" hint="Si vacío, usa el label desktop.">
                <input type="text" value={card.mobileLabel} onChange={(e) => updateCard(i, { mobileLabel: e.target.value })} style={inputStyle} />
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Título (desktop)" required>
                <input type="text" value={card.title} onChange={(e) => updateCard(i, { title: e.target.value })} required style={inputStyle} />
              </Field>
              <Field label="Título mobile" hint="Versión más corta. Si vacío, usa el título desktop.">
                <input type="text" value={card.mobileTitle} onChange={(e) => updateCard(i, { mobileTitle: e.target.value })} style={inputStyle} />
              </Field>
            </div>
            <Field label="Descripción" required>
              <textarea value={card.desc} onChange={(e) => updateCard(i, { desc: e.target.value })} required rows={2} style={textareaStyle} />
            </Field>
            <Field label='URL del CTA "Conoce más"' hint='Ruta a la que va el "Conoce más" de la card. Interna ("/academico") o externa. Vacío = card sin link.'>
              <input type="text" value={card.href} onChange={(e) => updateCard(i, { href: e.target.value })} placeholder="/academico" style={inputStyle} />
            </Field>
            <ImageUploader label="Foto" value={card.img} onChange={(v) => updateCard(i, { img: v })} prefix={prefix} previewAspect="4/3" />
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─── Helpers ─── */

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

const fieldLabel: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "#6B6660", textTransform: "uppercase", letterSpacing: 0.5 };
const hintStyle: React.CSSProperties = { fontSize: 10, color: "#A0AABA", lineHeight: 1.5 };
const inputStyle: React.CSSProperties = { height: 38, border: "1px solid #E8E4DD", borderRadius: 6, paddingLeft: 12, paddingRight: 12, fontSize: 13, color: "#1A2B4A", background: "#FAFAF8", outline: "none", fontFamily: "inherit" };
const textareaStyle: React.CSSProperties = { ...inputStyle, height: "auto", minHeight: 70, paddingTop: 10, paddingBottom: 10, resize: "vertical" };
const panelStyle: React.CSSProperties = { background: "#FAFAF8", border: "1px solid #E8E4DD", borderRadius: 10 };
const panelLabel: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "#A0AABA", textTransform: "uppercase", letterSpacing: 0.5 };
const addButton: React.CSSProperties = { height: 36, background: "transparent", color: "#1A2B4A", border: "1px dashed #C9C4BB", borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" };

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
