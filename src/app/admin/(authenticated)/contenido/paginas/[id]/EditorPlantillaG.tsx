"use client";

import { useActionState, useState } from "react";
import { Save, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { guardarPaginaAction, type PaginaActionState } from "../actions";
import type { ContenidoPlantillaG } from "../../plantillas";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { HighlightPreview } from "@/components/admin/HighlightPreview";

type Hero = ContenidoPlantillaG["hero"];
type Nucleo = ContenidoPlantillaG["nucleo"];
type Materias = ContenidoPlantillaG["materias"];
type Proceso = ContenidoPlantillaG["proceso"];
type Explorar = ContenidoPlantillaG["explorar"];

export function EditorPlantillaG({
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
  initialContenido: ContenidoPlantillaG;
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
  const [nucleo, setNucleo] = useState<Nucleo>(initialContenido.nucleo);
  const [materias, setMaterias] = useState<Materias>(initialContenido.materias);
  const [proceso, setProceso] = useState<Proceso>(initialContenido.proceso);
  const [explorar, setExplorar] = useState<Explorar>(initialContenido.explorar);

  const safePrefix = `paginas/${slug.replace(/[^a-z0-9-]/g, "-")}`;
  const contenidoJson = JSON.stringify({ hero, nucleo, materias, proceso, explorar });

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
      </Card>

      <HeroEditor hero={hero} setHero={setHero} prefix={`${safePrefix}/hero`} />
      <NucleoEditor nucleo={nucleo} setNucleo={setNucleo} prefix={`${safePrefix}/nucleo`} />
      <MateriasEditor materias={materias} setMaterias={setMaterias} />
      <ProcesoEditor proceso={proceso} setProceso={setProceso} prefix={`${safePrefix}/proceso`} />
      <ExplorarEditor explorar={explorar} setExplorar={setExplorar} />

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

/* ─── Hero ─── */

function HeroEditor({ hero, setHero, prefix }: { hero: Hero; setHero: (h: Hero) => void; prefix: string }) {
  const set = (patch: Partial<Hero>) => setHero({ ...hero, ...patch });
  const setStat = (i: number, patch: Partial<{ value: string; label: string }>) => {
    const next = [...hero.stats] as Hero["stats"];
    next[i] = { ...next[i], ...patch };
    setHero({ ...hero, stats: next });
  };
  const setPhoto = (i: number, src: string) => {
    const next = [...hero.floatingPhotos] as [string, string, string];
    next[i] = src;
    setHero({ ...hero, floatingPhotos: next });
  };

  return (
    <Card title="Bloque 1 — Hero" subtitle="Cabecera con collage flotante de 3 fotos, badge rojo, 2 CTAs, chips y barra inferior con 4 stats.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Badge superior" required>
          <input type="text" value={hero.badge} onChange={(e) => set({ badge: e.target.value })} required style={inputStyle} />
        </Field>
        <Field label="Ghost text" hint="Texto enorme decorativo de fondo (ej. DIPLOMA IB).">
          <input type="text" value={hero.ghostText} onChange={(e) => set({ ghostText: e.target.value })} style={inputStyle} />
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Título — línea 1 (blanco)" required>
          <input type="text" value={hero.titleLine1} onChange={(e) => set({ titleLine1: e.target.value })} required style={inputStyle} />
        </Field>
        <Field label="Título — línea 2 (rojo)" required>
          <input type="text" value={hero.titleLine2} onChange={(e) => set({ titleLine2: e.target.value })} required style={inputStyle} />
        </Field>
      </div>
      <Field label="Subtítulo">
        <textarea value={hero.subtitle} onChange={(e) => set({ subtitle: e.target.value })} rows={2} style={textareaStyle} />
      </Field>
      <Field label="Fragmento subrayado en rojo del subtítulo" hint='Escribe una palabra o frase del subtítulo para subrayarla en rojo. No importan mayúsculas ni tildes. Ej.: subtítulo "Bienvenido a Atenas" → escribe "Atenas".'>
        <input type="text" value={hero.subtitleHighlight} onChange={(e) => set({ subtitleHighlight: e.target.value })} style={inputStyle} />
      </Field>
      <HighlightPreview text={hero.subtitle} highlight={hero.subtitleHighlight} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Botón primario — texto" required>
          <input type="text" value={hero.ctaPrimary.text} onChange={(e) => set({ ctaPrimary: { ...hero.ctaPrimary, text: e.target.value } })} required style={inputStyle} />
        </Field>
        <Field label="Botón primario — link" required>
          <input type="text" value={hero.ctaPrimary.href} onChange={(e) => set({ ctaPrimary: { ...hero.ctaPrimary, href: e.target.value } })} required style={inputStyle} />
        </Field>
        <Field label="Botón secundario — texto" required>
          <input type="text" value={hero.ctaSecondary.text} onChange={(e) => set({ ctaSecondary: { ...hero.ctaSecondary, text: e.target.value } })} required style={inputStyle} />
        </Field>
        <Field label="Botón secundario — link" required>
          <input type="text" value={hero.ctaSecondary.href} onChange={(e) => set({ ctaSecondary: { ...hero.ctaSecondary, href: e.target.value } })} required style={inputStyle} />
        </Field>
      </div>

      <ChipsList
        chips={hero.chips}
        setChips={(c) => set({ chips: c })}
        label="Chips rojos (debajo de los CTAs)"
      />

      <ImageUploader label="Imagen de fondo del hero" value={hero.bgImageSrc ?? ""} onChange={(v) => set({ bgImageSrc: v })} prefix={prefix} previewAspect="16/9" hint="Aparece de fondo con un overlay navy oscuro." />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <ImageUploader label="Foto collage 1 (grande izq.)" value={hero.floatingPhotos[0]} onChange={(v) => setPhoto(0, v)} prefix={prefix} previewAspect="4/3" />
        <ImageUploader label="Foto collage 2 (mediana der.)" value={hero.floatingPhotos[1]} onChange={(v) => setPhoto(1, v)} prefix={prefix} previewAspect="4/3" />
        <ImageUploader label="Foto collage 3 (pequeña izq.)" value={hero.floatingPhotos[2]} onChange={(v) => setPhoto(2, v)} prefix={prefix} previewAspect="4/3" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Badge rojo flotante — línea 1" hint="Texto principal del badge (ej. ÚNICO EN EL CENTRO).">
          <input type="text" value={hero.floatingBadgeLine1} onChange={(e) => set({ floatingBadgeLine1: e.target.value })} style={inputStyle} />
        </Field>
        <Field label="Badge rojo flotante — línea 2" hint="Texto secundario más pequeño (ej. DEL PAÍS ★).">
          <input type="text" value={hero.floatingBadgeLine2} onChange={(e) => set({ floatingBadgeLine2: e.target.value })} style={inputStyle} />
        </Field>
      </div>

      <span style={fieldLabel}>Stats (4 datos clave en barra inferior)</span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {hero.stats.map((s, i) => (
          <div key={i} className="flex flex-col gap-3 p-4" style={panelStyle}>
            <span style={panelLabel}>Stat #{i + 1}</span>
            <Field label="Valor (grande, rojo)">
              <input type="text" value={s.value} onChange={(e) => setStat(i, { value: e.target.value })} style={inputStyle} />
            </Field>
            <Field label="Etiqueta (pequeña, gris)">
              <input type="text" value={s.label} onChange={(e) => setStat(i, { label: e.target.value })} style={inputStyle} />
            </Field>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─── Núcleo ─── */

function NucleoEditor({ nucleo, setNucleo, prefix }: { nucleo: Nucleo; setNucleo: (n: Nucleo) => void; prefix: string }) {
  const set = (patch: Partial<Nucleo>) => setNucleo({ ...nucleo, ...patch });
  const updateComp = (i: number, patch: Partial<Nucleo["componentes"][number]>) =>
    set({ componentes: nucleo.componentes.map((c, idx) => (idx === i ? { ...c, ...patch } : c)) });
  const addComp = () => set({ componentes: [...nucleo.componentes, { icon: "🎨", title: "", sub: "", desc: "" }] });
  const removeComp = (i: number) => set({ componentes: nucleo.componentes.filter((_, idx) => idx !== i) });
  const moveComp = (i: number, dir: -1 | 1) => {
    const next = [...nucleo.componentes];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set({ componentes: next });
  };

  return (
    <Card title="Bloque 2 — Núcleo del Diploma" subtitle="Sección navy con 3 tarjetas de componentes (CAS / Monografía / TdC) y 2 fotos en columna lateral.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Badge" required>
          <input type="text" value={nucleo.badge} onChange={(e) => set({ badge: e.target.value })} required style={inputStyle} />
        </Field>
        <Field label="Parte resaltada del título" hint='Escribe una palabra o frase del encabezado para subrayarla en rojo. No importan mayúsculas ni tildes. Ej.: "Formamos líderes globales" → escribe "líderes".'>
          <input type="text" value={nucleo.headingHighlight} onChange={(e) => set({ headingHighlight: e.target.value })} style={inputStyle} />
        </Field>
      </div>
      <Field label="Encabezado (h2)" required>
        <input type="text" value={nucleo.heading} onChange={(e) => set({ heading: e.target.value })} required style={inputStyle} />
      </Field>
      <HighlightPreview text={nucleo.heading} highlight={nucleo.headingHighlight} />
      <Field label="Descripción">
        <textarea value={nucleo.descripcion} onChange={(e) => set({ descripcion: e.target.value })} rows={2} style={textareaStyle} />
      </Field>

      <span style={fieldLabel}>Componentes {nucleo.componentes.length > 0 && `(${nucleo.componentes.length})`}</span>
      <div className="flex flex-col gap-3">
        {nucleo.componentes.map((c, i) => (
          <div key={i} className="flex flex-col gap-3 p-4" style={panelStyle}>
            <RowHeader index={i} total={nucleo.componentes.length} onMove={(d) => moveComp(i, d)} onRemove={() => removeComp(i)} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Field label="Icono (emoji)" hint='ej. 🎨, 📝, 🌍'>
                <input type="text" value={c.icon} onChange={(e) => updateComp(i, { icon: e.target.value })} style={inputStyle} />
              </Field>
              <Field label="Título" required>
                <input type="text" value={c.title} onChange={(e) => updateComp(i, { title: e.target.value })} required style={inputStyle} />
              </Field>
              <Field label="Subtítulo" hint="Línea pequeña gris.">
                <input type="text" value={c.sub} onChange={(e) => updateComp(i, { sub: e.target.value })} style={inputStyle} />
              </Field>
            </div>
            <Field label="Descripción">
              <textarea value={c.desc} onChange={(e) => updateComp(i, { desc: e.target.value })} rows={3} style={textareaStyle} />
            </Field>
            <Field label="Destacado">
              <label className="flex items-center gap-2" style={{ height: 38 }}>
                <input type="checkbox" checked={c.highlight ?? false} onChange={(e) => updateComp(i, { highlight: e.target.checked || undefined })} style={{ width: 16, height: 16, accentColor: "#1A2B4A" }} />
                <span style={{ fontSize: 12, color: "#1A2B4A" }}>Borde rojo (destacar este componente)</span>
              </label>
            </Field>
          </div>
        ))}
      </div>
      <button type="button" onClick={addComp} style={addButton} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4">
        <Plus size={14} strokeWidth={2.5} />
        Agregar componente
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex flex-col gap-3 p-4" style={panelStyle}>
          <span style={panelLabel}>Foto principal (grande)</span>
          <ImageUploader label="" value={nucleo.fotoPrincipal.src} onChange={(v) => set({ fotoPrincipal: { ...nucleo.fotoPrincipal, src: v } })} prefix={prefix} previewAspect="4/3" />
          <Field label="Caption">
            <input type="text" value={nucleo.fotoPrincipal.caption} onChange={(e) => set({ fotoPrincipal: { ...nucleo.fotoPrincipal, caption: e.target.value } })} style={inputStyle} />
          </Field>
        </div>
        <div className="flex flex-col gap-3 p-4" style={panelStyle}>
          <span style={panelLabel}>Foto secundaria (debajo)</span>
          <ImageUploader label="" value={nucleo.fotoSecundaria.src} onChange={(v) => set({ fotoSecundaria: { ...nucleo.fotoSecundaria, src: v } })} prefix={prefix} previewAspect="16/9" />
          <Field label="Caption">
            <input type="text" value={nucleo.fotoSecundaria.caption} onChange={(e) => set({ fotoSecundaria: { ...nucleo.fotoSecundaria, caption: e.target.value } })} style={inputStyle} />
          </Field>
        </div>
      </div>
    </Card>
  );
}

/* ─── Materias ─── */

function MateriasEditor({ materias, setMaterias }: { materias: Materias; setMaterias: (m: Materias) => void }) {
  const set = (patch: Partial<Materias>) => setMaterias({ ...materias, ...patch });
  const updateGrupo = (i: number, patch: Partial<Materias["grupos"][number]>) =>
    set({ grupos: materias.grupos.map((g, idx) => (idx === i ? { ...g, ...patch } : g)) });
  const addGrupo = () => set({ grupos: [...materias.grupos, { num: "", title: "", detail: "", color: "white" }] });
  const removeGrupo = (i: number) => set({ grupos: materias.grupos.filter((_, idx) => idx !== i) });
  const moveGrupo = (i: number, dir: -1 | 1) => {
    const next = [...materias.grupos];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set({ grupos: next });
  };

  return (
    <Card title="Bloque 3 — Grupos de asignaturas" subtitle="Grid de grupos de materias en 3 columnas. Cada grupo puede ser blanco, navy o rojo.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Badge" required>
          <input type="text" value={materias.badge} onChange={(e) => set({ badge: e.target.value })} required style={inputStyle} />
        </Field>
        <Field label="Parte resaltada del título" hint='Escribe una palabra o frase del encabezado para subrayarla en rojo. No importan mayúsculas ni tildes.'>
          <input type="text" value={materias.headingHighlight} onChange={(e) => set({ headingHighlight: e.target.value })} style={inputStyle} />
        </Field>
      </div>
      <Field label="Encabezado (h2)" required>
        <input type="text" value={materias.heading} onChange={(e) => set({ heading: e.target.value })} required style={inputStyle} />
      </Field>
      <HighlightPreview text={materias.heading} highlight={materias.headingHighlight} />
      <Field label="Descripción">
        <textarea value={materias.descripcion} onChange={(e) => set({ descripcion: e.target.value })} rows={2} style={textareaStyle} />
      </Field>

      <span style={fieldLabel}>Grupos {materias.grupos.length > 0 && `(${materias.grupos.length})`}</span>
      <div className="flex flex-col gap-3">
        {materias.grupos.map((g, i) => (
          <div key={i} className="flex flex-col gap-3 p-4" style={panelStyle}>
            <RowHeader index={i} total={materias.grupos.length} onMove={(d) => moveGrupo(i, d)} onRemove={() => removeGrupo(i)} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Número" hint='ej. 01, 02… o cualquier texto corto.'>
                <input type="text" value={g.num} onChange={(e) => updateGrupo(i, { num: e.target.value })} style={inputStyle} />
              </Field>
              <Field label="Color de la tarjeta">
                <select value={g.color ?? "white"} onChange={(e) => updateGrupo(i, { color: e.target.value as "white" | "navy" | "gold" })} style={{ ...inputStyle, paddingRight: 28, cursor: "pointer" }}>
                  <option value="white">Blanco (default)</option>
                  <option value="navy">Navy oscuro</option>
                  <option value="gold">Rojo</option>
                </select>
              </Field>
            </div>
            <Field label="Título" required>
              <input type="text" value={g.title} onChange={(e) => updateGrupo(i, { title: e.target.value })} required style={inputStyle} />
            </Field>
            <Field label="Detalle">
              <input type="text" value={g.detail} onChange={(e) => updateGrupo(i, { detail: e.target.value })} style={inputStyle} />
            </Field>
          </div>
        ))}
      </div>
      <button type="button" onClick={addGrupo} style={addButton} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4">
        <Plus size={14} strokeWidth={2.5} />
        Agregar grupo
      </button>

      <Field label="Nota al pie" hint="Caja con borde rojo al final de la sección. Acepta texto plano (sin formato HTML).">
        <textarea value={materias.nota} onChange={(e) => set({ nota: e.target.value })} rows={3} style={textareaStyle} />
      </Field>
    </Card>
  );
}

/* ─── Proceso ─── */

function ProcesoEditor({ proceso, setProceso, prefix }: { proceso: Proceso; setProceso: (p: Proceso) => void; prefix: string }) {
  const set = (patch: Partial<Proceso>) => setProceso({ ...proceso, ...patch });

  const updatePaso = (i: number, patch: Partial<Proceso["pasos"][number]>) =>
    set({ pasos: proceso.pasos.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) });
  const addPaso = () => set({ pasos: [...proceso.pasos, { num: "", title: "", desc: "" }] });
  const removePaso = (i: number) => set({ pasos: proceso.pasos.filter((_, idx) => idx !== i) });
  const movePaso = (i: number, dir: -1 | 1) => {
    const next = [...proceso.pasos];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set({ pasos: next });
  };

  const updateAliado = (i: number, patch: Partial<Proceso["aliados"]["items"][number]>) =>
    set({ aliados: { ...proceso.aliados, items: proceso.aliados.items.map((a, idx) => (idx === i ? { ...a, ...patch } : a)) } });
  const addAliado = () => set({ aliados: { ...proceso.aliados, items: [...proceso.aliados.items, { name: "", short: "" }] } });
  const removeAliado = (i: number) => set({ aliados: { ...proceso.aliados, items: proceso.aliados.items.filter((_, idx) => idx !== i) } });
  const moveAliado = (i: number, dir: -1 | 1) => {
    const next = [...proceso.aliados.items];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set({ aliados: { ...proceso.aliados, items: next } });
  };

  return (
    <Card title="Bloque 4 — Proceso de admisión" subtitle="Sección oscura con timeline de pasos numerados, lista de aliados y CTA rojo en columna lateral.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Badge" required>
          <input type="text" value={proceso.badge} onChange={(e) => set({ badge: e.target.value })} required style={inputStyle} />
        </Field>
        <Field label="Parte resaltada del título" hint='Escribe una palabra o frase del encabezado para subrayarla en rojo. No importan mayúsculas ni tildes.'>
          <input type="text" value={proceso.headingHighlight} onChange={(e) => set({ headingHighlight: e.target.value })} style={inputStyle} />
        </Field>
      </div>
      <Field label="Encabezado (h2)" required>
        <input type="text" value={proceso.heading} onChange={(e) => set({ heading: e.target.value })} required style={inputStyle} />
      </Field>
      <HighlightPreview text={proceso.heading} highlight={proceso.headingHighlight} />

      <ImageUploader label="Foto de fondo (parallax)" value={proceso.bgImageSrc ?? ""} onChange={(v) => set({ bgImageSrc: v })} prefix={prefix} previewAspect="16/9" hint="Aparece de fondo con efecto parallax y opacidad muy baja." />

      <span style={fieldLabel}>Pasos {proceso.pasos.length > 0 && `(${proceso.pasos.length})`}</span>
      <div className="flex flex-col gap-3">
        {proceso.pasos.map((p, i) => (
          <div key={i} className="flex flex-col gap-3 p-4" style={panelStyle}>
            <RowHeader index={i} total={proceso.pasos.length} onMove={(d) => movePaso(i, d)} onRemove={() => removePaso(i)} />
            <div className="grid grid-cols-[100px_1fr] gap-3">
              <Field label="Número">
                <input type="text" value={p.num} onChange={(e) => updatePaso(i, { num: e.target.value })} placeholder="01" style={inputStyle} />
              </Field>
              <Field label="Título" required>
                <input type="text" value={p.title} onChange={(e) => updatePaso(i, { title: e.target.value })} required style={inputStyle} />
              </Field>
            </div>
            <Field label="Descripción">
              <textarea value={p.desc} onChange={(e) => updatePaso(i, { desc: e.target.value })} rows={2} style={textareaStyle} />
            </Field>
          </div>
        ))}
      </div>
      <button type="button" onClick={addPaso} style={addButton} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4">
        <Plus size={14} strokeWidth={2.5} />
        Agregar paso
      </button>

      <div className="flex flex-col gap-3 p-4" style={panelStyle}>
        <span style={panelLabel}>Aliados del programa</span>
        <Field label="Título de la sección">
          <input type="text" value={proceso.aliados.titulo} onChange={(e) => set({ aliados: { ...proceso.aliados, titulo: e.target.value } })} style={inputStyle} />
        </Field>
        <div className="flex flex-col gap-2">
          {proceso.aliados.items.map((a, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input type="text" value={a.short} onChange={(e) => updateAliado(i, { short: e.target.value })} placeholder="Abrev" style={{ ...inputStyle, width: 120 }} />
              <input type="text" value={a.name} onChange={(e) => updateAliado(i, { name: e.target.value })} placeholder="Nombre completo" style={{ ...inputStyle, flex: 1 }} />
              <button type="button" onClick={() => moveAliado(i, -1)} disabled={i === 0} style={iconButton(i === 0)} aria-label="Subir">
                <ArrowUp size={12} strokeWidth={2.5} />
              </button>
              <button type="button" onClick={() => moveAliado(i, 1)} disabled={i === proceso.aliados.items.length - 1} style={iconButton(i === proceso.aliados.items.length - 1)} aria-label="Bajar">
                <ArrowDown size={12} strokeWidth={2.5} />
              </button>
              <button type="button" onClick={() => removeAliado(i)} style={{ ...iconButton(false), color: "#991B1B", borderColor: "#FECACA" }} aria-label="Eliminar">
                <Trash2 size={12} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addAliado} style={addButton} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4">
          <Plus size={14} strokeWidth={2.5} />
          Agregar aliado
        </button>
      </div>

      <div className="flex flex-col gap-3 p-4" style={panelStyle}>
        <span style={panelLabel}>CTA lateral</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Título">
            <input type="text" value={proceso.cta.titulo} onChange={(e) => set({ cta: { ...proceso.cta, titulo: e.target.value } })} style={inputStyle} />
          </Field>
          <Field label="Texto del botón">
            <input type="text" value={proceso.cta.btnText} onChange={(e) => set({ cta: { ...proceso.cta, btnText: e.target.value } })} style={inputStyle} />
          </Field>
        </div>
        <Field label="Descripción">
          <textarea value={proceso.cta.descripcion} onChange={(e) => set({ cta: { ...proceso.cta, descripcion: e.target.value } })} rows={2} style={textareaStyle} />
        </Field>
        <Field label="Link del botón">
          <input type="text" value={proceso.cta.btnHref} onChange={(e) => set({ cta: { ...proceso.cta, btnHref: e.target.value } })} style={inputStyle} />
        </Field>
      </div>
    </Card>
  );
}

/* ─── Explorar ─── */

function ExplorarEditor({ explorar, setExplorar }: { explorar: Explorar; setExplorar: (e: Explorar) => void }) {
  const set = (patch: Partial<Explorar>) => setExplorar({ ...explorar, ...patch });
  const update = (i: number, patch: Partial<Explorar["secciones"][number]>) =>
    set({ secciones: explorar.secciones.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) });
  const add = () => set({ secciones: [...explorar.secciones, { slug: "", icon: "★", title: "", desc: "" }] });
  const remove = (i: number) => set({ secciones: explorar.secciones.filter((_, idx) => idx !== i) });
  const move = (i: number, dir: -1 | 1) => {
    const next = [...explorar.secciones];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set({ secciones: next });
  };

  return (
    <Card title="Bloque 5 — Explorar el Programa" subtitle="Grid de tarjetas que enlazan a las subpáginas IB. El slug se concatena a /academico/ib/.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Badge" required>
          <input type="text" value={explorar.badge} onChange={(e) => set({ badge: e.target.value })} required style={inputStyle} />
        </Field>
        <Field label="Encabezado (h2)" required>
          <input type="text" value={explorar.heading} onChange={(e) => set({ heading: e.target.value })} required style={inputStyle} />
        </Field>
      </div>
      <Field label="Descripción">
        <textarea value={explorar.descripcion} onChange={(e) => set({ descripcion: e.target.value })} rows={2} style={textareaStyle} />
      </Field>

      <span style={fieldLabel}>Tarjetas {explorar.secciones.length > 0 && `(${explorar.secciones.length})`}</span>
      <div className="flex flex-col gap-3">
        {explorar.secciones.map((s, i) => (
          <div key={i} className="flex flex-col gap-3 p-4" style={panelStyle}>
            <RowHeader index={i} total={explorar.secciones.length} onMove={(d) => move(i, d)} onRemove={() => remove(i)} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Field label="Slug" hint="se concatena a /academico/ib/">
                <input type="text" value={s.slug} onChange={(e) => update(i, { slug: e.target.value })} placeholder="atributos" style={inputStyle} />
              </Field>
              <Field label="Icono (emoji)">
                <input type="text" value={s.icon} onChange={(e) => update(i, { icon: e.target.value })} style={inputStyle} />
              </Field>
              <Field label="Título" required>
                <input type="text" value={s.title} onChange={(e) => update(i, { title: e.target.value })} required style={inputStyle} />
              </Field>
            </div>
            <Field label="Descripción">
              <textarea value={s.desc} onChange={(e) => update(i, { desc: e.target.value })} rows={2} style={textareaStyle} />
            </Field>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} style={addButton} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4">
        <Plus size={14} strokeWidth={2.5} />
        Agregar sección
      </button>
    </Card>
  );
}

/* ─── Helpers ─── */

function ChipsList({ chips, setChips, label }: { chips: { texto: string }[]; setChips: (c: { texto: string }[]) => void; label: string }) {
  const update = (i: number, val: string) => setChips(chips.map((c, idx) => (idx === i ? { texto: val } : c)));
  const add = () => setChips([...chips, { texto: "" }]);
  const remove = (i: number) => setChips(chips.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const next = [...chips];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setChips(next);
  };
  return (
    <div className="flex flex-col gap-2">
      <span style={fieldLabel}>{label} {chips.length > 0 && `(${chips.length})`}</span>
      {chips.map((c, i) => (
        <div key={i} className="flex gap-2 items-center">
          <input type="text" value={c.texto} onChange={(e) => update(i, e.target.value)} style={{ ...inputStyle, flex: 1 }} />
          <button type="button" onClick={() => move(i, -1)} disabled={i === 0} style={iconButton(i === 0)} aria-label="Subir">
            <ArrowUp size={12} strokeWidth={2.5} />
          </button>
          <button type="button" onClick={() => move(i, 1)} disabled={i === chips.length - 1} style={iconButton(i === chips.length - 1)} aria-label="Bajar">
            <ArrowDown size={12} strokeWidth={2.5} />
          </button>
          <button type="button" onClick={() => remove(i)} style={{ ...iconButton(false), color: "#991B1B", borderColor: "#FECACA" }} aria-label="Eliminar">
            <Trash2 size={12} strokeWidth={2.5} />
          </button>
        </div>
      ))}
      <button type="button" onClick={add} style={addButton} className="flex items-center justify-center gap-1.5 self-start mt-1 px-4">
        <Plus size={14} strokeWidth={2.5} />
        Agregar chip
      </button>
    </div>
  );
}

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
        <input type="checkbox" name="publicada" checked={publicada} onChange={(e) => setPublicada(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#1A2B4A" }} />
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
          style={{ height: 36, background: "#1A2B4A", color: "#FFFFFF", border: "none", fontSize: 13, fontWeight: 600, cursor: isPending ? "wait" : "pointer", opacity: isPending ? 0.7 : 1 }}
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
  return { width: 26, height: 26, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "transparent", color: disabled ? "#C9C4BB" : "#1A2B4A", border: "1px solid #E8E4DD", borderRadius: 4, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, fontFamily: "inherit" };
}
