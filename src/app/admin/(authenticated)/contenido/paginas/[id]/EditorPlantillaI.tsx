"use client";

import { useActionState, useEffect, useState } from "react";
import { Save, Plus, Trash2, ArrowUp, ArrowDown, Check, AlertCircle } from "lucide-react";
import { guardarPaginaAction, type PaginaActionState } from "../actions";
import type {
  ContenidoPlantillaI,
  HitoTrayectoriaPlantillaI,
  StatCifrasPlantillaI,
} from "../../plantillas";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { parseYouTubeUrl } from "@/lib/cms/parseYouTubeUrl";

type Hero = ContenidoPlantillaI["hero"];
type Fundacion = ContenidoPlantillaI["fundacion"];
type Trayectoria = ContenidoPlantillaI["trayectoria"];
type Cifras = ContenidoPlantillaI["cifras"];
type Cita = ContenidoPlantillaI["cita"];

export function EditorPlantillaI({
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
  initialContenido: ContenidoPlantillaI;
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
  const [fundacion, setFundacion] = useState<Fundacion>(initialContenido.fundacion);
  const [trayectoria, setTrayectoria] = useState<Trayectoria>(initialContenido.trayectoria);
  const [cifras, setCifras] = useState<Cifras>(initialContenido.cifras);
  const [cita, setCita] = useState<Cita>(initialContenido.cita);

  const safePrefix = `paginas/${slug.replace(/[^a-z0-9-]/g, "-")}`;
  const contenidoJson = JSON.stringify({ hero, fundacion, trayectoria, cifras, cita });

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="id" value={paginaId} />
      <input type="hidden" name="contenido" value={contenidoJson} />

      <Sticky publicada={publicada} setPublicada={setPublicada} state={state} isPending={isPending} />

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

      <HeroEditor hero={hero} setHero={setHero} prefix={`${safePrefix}/hero`} />
      <FundacionEditor fundacion={fundacion} setFundacion={setFundacion} prefix={`${safePrefix}/fundacion`} />
      <TrayectoriaEditor trayectoria={trayectoria} setTrayectoria={setTrayectoria} prefix={`${safePrefix}/trayectoria`} />
      <CifrasEditor cifras={cifras} setCifras={setCifras} prefix={`${safePrefix}/cifras`} />
      <CitaEditor cita={cita} setCita={setCita} prefix={`${safePrefix}/cita`} />

      <Card title="SEO" subtitle="Metadatos para motores de búsqueda y previsualizaciones.">
        <Field label="Meta title" hint="Recomendado: 50-60 caracteres.">
          <input
            type="text"
            name="meta_title"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            maxLength={120}
            style={inputStyle}
          />
        </Field>
        <Field label="Meta description" hint="Recomendado: 140-160 caracteres.">
          <textarea
            name="meta_description"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            rows={2}
            maxLength={300}
            style={textareaStyle}
          />
        </Field>
      </Card>
    </form>
  );
}

/* ─── Hero ─── */

function HeroEditor({ hero, setHero, prefix }: { hero: Hero; setHero: (h: Hero) => void; prefix: string }) {
  const set = (patch: Partial<Hero>) => setHero({ ...hero, ...patch });

  return (
    <Card title="Bloque 1 — Hero" subtitle="Cabecera con foto de fondo, ghost text decorativo y título a 2 líneas.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Badge superior" required>
          <input type="text" value={hero.badge} onChange={(e) => set({ badge: e.target.value })} required style={inputStyle} />
        </Field>
        <Field label="Ghost text" hint="Texto enorme decorativo de fondo (ej. HISTORIA).">
          <input type="text" value={hero.ghostText} onChange={(e) => set({ ghostText: e.target.value })} style={inputStyle} />
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Título — línea 1 (blanco)" required>
          <input type="text" value={hero.titleLine1} onChange={(e) => set({ titleLine1: e.target.value })} required style={inputStyle} />
        </Field>
        <Field label="Título — línea 2 (dorado)" required>
          <input type="text" value={hero.titleLine2} onChange={(e) => set({ titleLine2: e.target.value })} required style={inputStyle} />
        </Field>
      </div>
      <Field label="Subtítulo">
        <textarea value={hero.subtitle} onChange={(e) => set({ subtitle: e.target.value })} rows={2} style={textareaStyle} />
      </Field>
      <Field label="Caption" hint='Texto pequeño al pie del hero (ej. "Fundada en 1976 · Ambato, Ecuador"). Opcional.'>
        <input type="text" value={hero.caption ?? ""} onChange={(e) => set({ caption: e.target.value || undefined })} style={inputStyle} />
      </Field>
      <ImageUploader
        label="Foto de fondo del hero"
        value={hero.bgImageSrc ?? ""}
        onChange={(v) => set({ bgImageSrc: v || undefined })}
        prefix={prefix}
        previewAspect="16/9"
        hint="Foto del campus o ceremonia. Va con un overlay navy oscuro para que el texto sea legible."
      />
    </Card>
  );
}

/* ─── Fundación ─── */

function FundacionEditor({ fundacion, setFundacion, prefix }: { fundacion: Fundacion; setFundacion: (f: Fundacion) => void; prefix: string }) {
  const set = (patch: Partial<Fundacion>) => setFundacion({ ...fundacion, ...patch });

  return (
    <Card title="Bloque 2 — Fundación" subtitle="Texto a la izquierda con 2 párrafos y collage de 3 fotos a la derecha (1 grande + 2 pequeñas apiladas).">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-3">
        <Field label="Badge" required>
          <input type="text" value={fundacion.badge} onChange={(e) => set({ badge: e.target.value })} required style={inputStyle} />
        </Field>
        <Field label="Encabezado (h2)" hint="Acepta saltos con Enter — se renderizan en el frontend.">
          <input type="text" value={fundacion.heading} onChange={(e) => set({ heading: e.target.value })} required style={inputStyle} />
        </Field>
      </div>
      <Field label="Párrafo principal" hint="Texto descriptivo de los orígenes. Color gris suave en el frontend.">
        <textarea value={fundacion.paragraph1} onChange={(e) => set({ paragraph1: e.target.value })} rows={5} style={textareaStyle} />
      </Field>
      <Field label="Párrafo destacado" hint="Aparece debajo de una línea dorada con texto en bold navy. Para hitos clave.">
        <textarea value={fundacion.paragraph2} onChange={(e) => set({ paragraph2: e.target.value })} rows={3} style={textareaStyle} />
      </Field>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ImageUploader label="Foto principal (grande izq.)" value={fundacion.fotoPrincipal} onChange={(v) => set({ fotoPrincipal: v })} prefix={prefix} previewAspect="4/3" />
        <ImageUploader label="Foto secundaria 1 (arriba der.)" value={fundacion.fotoSecundaria1} onChange={(v) => set({ fotoSecundaria1: v })} prefix={prefix} previewAspect="4/3" />
        <ImageUploader label="Foto secundaria 2 (abajo der.)" value={fundacion.fotoSecundaria2} onChange={(v) => set({ fotoSecundaria2: v })} prefix={prefix} previewAspect="4/3" />
      </div>
    </Card>
  );
}

/* ─── Trayectoria ─── */

function TrayectoriaEditor({ trayectoria, setTrayectoria, prefix }: { trayectoria: Trayectoria; setTrayectoria: (t: Trayectoria) => void; prefix: string }) {
  const set = (patch: Partial<Trayectoria>) => setTrayectoria({ ...trayectoria, ...patch });

  // Estado local del input URL del video — derivado de videoId al cargar
  const initialUrl = trayectoria.youtube?.videoId
    ? `https://youtu.be/${trayectoria.youtube.videoId}`
    : "";
  const [ytUrl, setYtUrl] = useState(initialUrl);

  // Sincronizar: cuando el usuario edita la URL, parsear y actualizar youtube en el state padre
  useEffect(() => {
    const trimmed = ytUrl.trim();
    if (!trimmed) {
      if (trayectoria.youtube) set({ youtube: undefined });
      return;
    }
    const parsed = parseYouTubeUrl(trimmed);
    if (!parsed) return;
    if (parsed.videoId !== trayectoria.youtube?.videoId) {
      set({
        youtube: {
          videoId: parsed.videoId,
          startSeconds: parsed.startSeconds ?? trayectoria.youtube?.startSeconds,
          endSeconds: trayectoria.youtube?.endSeconds,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ytUrl]);

  const ytParsed = ytUrl.trim() ? parseYouTubeUrl(ytUrl.trim()) : null;
  const ytOk = ytParsed !== null;

  // Hitos
  const updateHito = (i: number, patch: Partial<HitoTrayectoriaPlantillaI>) =>
    set({ hitos: trayectoria.hitos.map((h, idx) => (idx === i ? { ...h, ...patch } : h)) });
  const addHito = () => set({ hitos: [...trayectoria.hitos, { year: "", title: "", desc: "" }] });
  const removeHito = (i: number) => set({ hitos: trayectoria.hitos.filter((_, idx) => idx !== i) });
  const moveHito = (i: number, dir: -1 | 1) => {
    const next = [...trayectoria.hitos];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set({ hitos: next });
  };

  // Fotos del strip
  const setFoto = (i: number, src: string) => {
    const next = [...trayectoria.fotos] as [string, string, string];
    next[i] = src;
    set({ fotos: next });
  };

  return (
    <Card
      title="Bloque 3 — Trayectoria (con video YouTube)"
      subtitle="Sección oscura con video de YouTube en loop como fondo (opcional), grid de hitos numerados, y strip de 3 fotos al pie."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Badge" required>
          <input type="text" value={trayectoria.badge} onChange={(e) => set({ badge: e.target.value })} required style={inputStyle} />
        </Field>
        <Field label="Ghost text" hint='Texto enorme decorativo a la derecha (ej. "50"). Opcional.'>
          <input type="text" value={trayectoria.ghostText ?? ""} onChange={(e) => set({ ghostText: e.target.value || undefined })} style={inputStyle} />
        </Field>
      </div>
      <Field label="Encabezado (h2)" required>
        <input type="text" value={trayectoria.heading} onChange={(e) => set({ heading: e.target.value })} required style={inputStyle} />
      </Field>

      {/* Video YouTube */}
      <div className="flex flex-col gap-3 p-4" style={panelStyle}>
        <span style={panelLabel}>Video YouTube de fondo (opcional)</span>
        <div
          className="px-3 py-2 rounded-md"
          style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}
        >
          <p style={{ fontSize: 11, color: "#1E40AF", margin: 0, lineHeight: 1.5 }}>
            Pega cualquier URL de YouTube (formato <code>youtube.com/watch?v=…</code>, <code>youtu.be/…</code> o <code>/embed/…</code>). Detectamos el ID automáticamente. Si quieres un loop entre dos segundos específicos del video, llena los campos de inicio y fin abajo.
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
          <div
            className="flex items-start gap-2 px-3 py-2 rounded-md"
            style={{ background: "#DCFCE7", border: "1px solid #BBF7D0" }}
          >
            <Check size={14} strokeWidth={2.5} color="#065F46" style={{ marginTop: 1 }} />
            <span style={{ fontSize: 12, color: "#065F46", lineHeight: 1.5 }}>
              Video detectado · ID: <code style={{ fontFamily: "ui-monospace, monospace" }}>{ytParsed.videoId}</code>
              {ytParsed.startSeconds !== null && (
                <> · inicio detectado a los {ytParsed.startSeconds}s</>
              )}
            </span>
          </div>
        )}
        {ytUrl.trim() && !ytOk && (
          <div
            className="flex items-start gap-2 px-3 py-2 rounded-md"
            style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}
          >
            <AlertCircle size={14} strokeWidth={2.5} color="#92400E" style={{ marginTop: 1 }} />
            <span style={{ fontSize: 12, color: "#92400E", lineHeight: 1.5 }}>
              No reconozco la URL como un link de YouTube válido.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Inicio del loop (segundos)" hint="Opcional. Default: 0 (desde el principio).">
            <input
              type="number"
              min={0}
              value={trayectoria.youtube?.startSeconds ?? ""}
              onChange={(e) =>
                set({
                  youtube: trayectoria.youtube
                    ? {
                        ...trayectoria.youtube,
                        startSeconds: e.target.value ? Number(e.target.value) : undefined,
                      }
                    : undefined,
                })
              }
              disabled={!trayectoria.youtube}
              placeholder="ej. 28"
              style={trayectoria.youtube ? inputStyle : { ...inputStyle, opacity: 0.5 }}
            />
          </Field>
          <Field label="Fin del loop (segundos)" hint="Opcional. Default: termina el video completo.">
            <input
              type="number"
              min={0}
              value={trayectoria.youtube?.endSeconds ?? ""}
              onChange={(e) =>
                set({
                  youtube: trayectoria.youtube
                    ? {
                        ...trayectoria.youtube,
                        endSeconds: e.target.value ? Number(e.target.value) : undefined,
                      }
                    : undefined,
                })
              }
              disabled={!trayectoria.youtube}
              placeholder="ej. 55"
              style={trayectoria.youtube ? inputStyle : { ...inputStyle, opacity: 0.5 }}
            />
          </Field>
        </div>
      </div>

      <ImageUploader
        label="Foto de respaldo del fondo"
        value={trayectoria.bgFotoSrc ?? ""}
        onChange={(v) => set({ bgFotoSrc: v || undefined })}
        prefix={prefix}
        previewAspect="16/9"
        hint="Se ve mientras el video carga, o si no hay video. También aparece sutil bajo el video."
      />

      {/* Hitos */}
      <span style={fieldLabel}>Hitos {trayectoria.hitos.length > 0 && `(${trayectoria.hitos.length})`}</span>
      <p style={{ fontSize: 11, color: "#A0AABA", margin: 0, lineHeight: 1.5 }}>
        Se recomiendan 6 hitos (2 filas de 3 en desktop). Marca uno como destacado para resaltarlo con borde dorado.
      </p>
      <div className="flex flex-col gap-3">
        {trayectoria.hitos.map((h, i) => (
          <div key={i} className="flex flex-col gap-3 p-4" style={panelStyle}>
            <RowHeader index={i} total={trayectoria.hitos.length} onMove={(d) => moveHito(i, d)} onRemove={() => removeHito(i)} />
            <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-3">
              <Field label="Año" hint='ej. "1976", "2017–2019", "2020–2026 ★"'>
                <input type="text" value={h.year} onChange={(e) => updateHito(i, { year: e.target.value })} style={inputStyle} />
              </Field>
              <Field label="Título" required>
                <input type="text" value={h.title} onChange={(e) => updateHito(i, { title: e.target.value })} required style={inputStyle} />
              </Field>
            </div>
            <Field label="Descripción">
              <textarea value={h.desc} onChange={(e) => updateHito(i, { desc: e.target.value })} rows={2} style={textareaStyle} />
            </Field>
            <Field label="Destacado">
              <label className="flex items-center gap-2" style={{ height: 38 }}>
                <input
                  type="checkbox"
                  checked={h.highlight ?? false}
                  onChange={(e) => updateHito(i, { highlight: e.target.checked || undefined })}
                  style={{ width: 16, height: 16, accentColor: "#1A2B4A" }}
                />
                <span style={{ fontSize: 12, color: "#1A2B4A" }}>
                  Borde dorado destacado (típico para el último hito o "actual")
                </span>
              </label>
            </Field>
          </div>
        ))}
      </div>
      <button type="button" onClick={addHito} style={addButton} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4">
        <Plus size={14} strokeWidth={2.5} />
        Agregar hito
      </button>

      {/* Strip de fotos */}
      <span style={fieldLabel}>Fotos al pie del bloque (3)</span>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ImageUploader label="Foto 1" value={trayectoria.fotos[0]} onChange={(v) => setFoto(0, v)} prefix={prefix} previewAspect="4/3" />
        <ImageUploader label="Foto 2" value={trayectoria.fotos[1]} onChange={(v) => setFoto(1, v)} prefix={prefix} previewAspect="4/3" />
        <ImageUploader label="Foto 3" value={trayectoria.fotos[2]} onChange={(v) => setFoto(2, v)} prefix={prefix} previewAspect="4/3" />
      </div>
    </Card>
  );
}

/* ─── Cifras ─── */

function CifrasEditor({ cifras, setCifras, prefix }: { cifras: Cifras; setCifras: (c: Cifras) => void; prefix: string }) {
  const set = (patch: Partial<Cifras>) => setCifras({ ...cifras, ...patch });

  const updateStat = (i: number, patch: Partial<StatCifrasPlantillaI>) =>
    set({ stats: cifras.stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });
  const addStat = () => set({ stats: [...cifras.stats, { value: 0, label: "" }] });
  const removeStat = (i: number) => set({ stats: cifras.stats.filter((_, idx) => idx !== i) });
  const moveStat = (i: number, dir: -1 | 1) => {
    const next = [...cifras.stats];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set({ stats: next });
  };

  return (
    <Card title="Bloque 4 — Cifras" subtitle="Stats con contador animado al entrar al viewport. Recomendado: 4 stats. Marca alguno como dark para alternar fondo.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Badge" required>
          <input type="text" value={cifras.badge} onChange={(e) => set({ badge: e.target.value })} required style={inputStyle} />
        </Field>
        <Field label="Encabezado (h2)" required>
          <input type="text" value={cifras.heading} onChange={(e) => set({ heading: e.target.value })} required style={inputStyle} />
        </Field>
      </div>
      <ImageUploader
        label="Foto de fondo (opcional)"
        value={cifras.bgImageSrc ?? ""}
        onChange={(v) => set({ bgImageSrc: v || undefined })}
        prefix={prefix}
        previewAspect="16/9"
        hint="Se renderiza con opacidad muy baja (12%) — sutil decoración."
      />

      <span style={fieldLabel}>Stats {cifras.stats.length > 0 && `(${cifras.stats.length})`}</span>
      <div className="flex flex-col gap-3">
        {cifras.stats.map((s, i) => (
          <div key={i} className="flex flex-col gap-3 p-4" style={panelStyle}>
            <RowHeader index={i} total={cifras.stats.length} onMove={(d) => moveStat(i, d)} onRemove={() => removeStat(i)} />
            <div className="grid grid-cols-1 md:grid-cols-[140px_100px_1fr] gap-3">
              <Field label="Valor numérico" hint="ej. 50, 5000, 200">
                <input type="number" value={s.value} onChange={(e) => updateStat(i, { value: Number(e.target.value) })} style={inputStyle} />
              </Field>
              <Field label="Sufijo" hint='ej. "+"'>
                <input type="text" value={s.suffix ?? ""} onChange={(e) => updateStat(i, { suffix: e.target.value || undefined })} style={inputStyle} />
              </Field>
              <Field label="Etiqueta" required>
                <input type="text" value={s.label} onChange={(e) => updateStat(i, { label: e.target.value })} required placeholder='ej. "Años de historia"' style={inputStyle} />
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[160px_160px_1fr] gap-3">
              <Field label="Estilo dark">
                <label className="flex items-center gap-2" style={{ height: 38 }}>
                  <input
                    type="checkbox"
                    checked={s.dark ?? false}
                    onChange={(e) => updateStat(i, { dark: e.target.checked || undefined })}
                    style={{ width: 16, height: 16, accentColor: "#1A2B4A" }}
                  />
                  <span style={{ fontSize: 12, color: "#1A2B4A" }}>Tarjeta navy</span>
                </label>
              </Field>
              <Field label="Texto estático">
                <label className="flex items-center gap-2" style={{ height: 38 }}>
                  <input
                    type="checkbox"
                    checked={s.isStatic ?? false}
                    onChange={(e) => updateStat(i, { isStatic: e.target.checked || undefined })}
                    style={{ width: 16, height: 16, accentColor: "#1A2B4A" }}
                  />
                  <span style={{ fontSize: 12, color: "#1A2B4A" }}>No animar contador</span>
                </label>
              </Field>
              <Field label="Texto a mostrar (si estático)" hint='Solo aplica si "No animar contador" está marcado. Si lo dejas vacío, se muestra el valor numérico tal cual.'>
                <input
                  type="text"
                  value={s.staticText ?? ""}
                  onChange={(e) => updateStat(i, { staticText: e.target.value || undefined })}
                  placeholder='ej. "1 IB"'
                  disabled={!s.isStatic}
                  style={s.isStatic ? inputStyle : { ...inputStyle, opacity: 0.5 }}
                />
              </Field>
            </div>
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

/* ─── Cita ─── */

function CitaEditor({ cita, setCita, prefix }: { cita: Cita; setCita: (c: Cita) => void; prefix: string }) {
  const set = (patch: Partial<Cita>) => setCita({ ...cita, ...patch });

  return (
    <Card title="Bloque 5 — Cita destacada" subtitle="Sección oscura con cita en grande sobre foto con efecto parallax y glifo decorativo de comillas.">
      <Field label="Cita principal" hint='Acepta saltos de línea con Enter. Aparece en blanco grande sobre fondo navy.'>
        <textarea value={cita.quote} onChange={(e) => set({ quote: e.target.value })} rows={4} required style={textareaStyle} />
      </Field>
      <Field label="Atribución" hint='Texto pequeño debajo de la línea dorada (ej. "Unidad Educativa Atenas · Desde 1976").'>
        <input type="text" value={cita.attribution} onChange={(e) => set({ attribution: e.target.value })} style={inputStyle} />
      </Field>
      <ImageUploader
        label="Foto de fondo (con parallax)"
        value={cita.bgImageSrc ?? ""}
        onChange={(v) => set({ bgImageSrc: v || undefined })}
        prefix={prefix}
        previewAspect="16/9"
        hint="Se ve sutil (12% opacidad) con desplazamiento parallax al hacer scroll."
      />
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

