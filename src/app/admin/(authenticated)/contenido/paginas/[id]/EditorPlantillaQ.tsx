"use client";

import { useActionState, useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";
import { guardarPaginaAction, type PaginaActionState } from "../actions";
import type {
  ContactosPaginaConfig,
  ExtensionContacto,
} from "@/lib/cms/contactosPagina";
import { ImageUploader } from "@/components/admin/ImageUploader";

export function EditorPlantillaQ({
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
  initialContenido: ContactosPaginaConfig;
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
  const [heroDescription, setHeroDescription] = useState(initialContenido.hero.description);
  const [heroCaption, setHeroCaption] = useState(initialContenido.hero.caption);
  const [heroGhostText, setHeroGhostText] = useState(initialContenido.hero.ghostText);
  const [heroBgImage, setHeroBgImage] = useState(initialContenido.hero.bgImage);
  const [heroTarjetaTitulo, setHeroTarjetaTitulo] = useState(initialContenido.hero.tarjeta.titulo);
  const [heroTarjetaSubtitulo, setHeroTarjetaSubtitulo] = useState(initialContenido.hero.tarjeta.subtitulo);

  // Canales
  const [canalesEyebrow, setCanalesEyebrow] = useState(initialContenido.canales.eyebrow);
  const [canalesHeading, setCanalesHeading] = useState(initialContenido.canales.heading);
  const [canalesBanner, setCanalesBanner] = useState(initialContenido.canales.bannerImagen);
  const [telTitulo, setTelTitulo] = useState(initialContenido.canales.tarjetaTelefono.titulo);
  const [extensiones, setExtensiones] = useState<ExtensionContacto[]>(
    initialContenido.canales.tarjetaTelefono.extensiones
  );
  const [dirTitulo, setDirTitulo] = useState(initialContenido.canales.tarjetaDireccion.titulo);
  const [dirHorarioLab, setDirHorarioLab] = useState(initialContenido.canales.tarjetaDireccion.horarioLaboral);
  const [dirHorarioFinde, setDirHorarioFinde] = useState(initialContenido.canales.tarjetaDireccion.horarioFinde);
  const [emailTitulo, setEmailTitulo] = useState(initialContenido.canales.tarjetaEmail.titulo);
  const [emailDescripcion, setEmailDescripcion] = useState(initialContenido.canales.tarjetaEmail.descripcion);
  const [emailCtaLabel, setEmailCtaLabel] = useState(initialContenido.canales.tarjetaEmail.ctaLabel);
  const [emailCtaHref, setEmailCtaHref] = useState(initialContenido.canales.tarjetaEmail.ctaHref);

  // Formulario
  const [formEyebrow, setFormEyebrow] = useState(initialContenido.formulario.eyebrow);
  const [formHeading, setFormHeading] = useState(initialContenido.formulario.heading);
  const [formSubtitle, setFormSubtitle] = useState(initialContenido.formulario.subtitle);
  const [formSubmitLabel, setFormSubmitLabel] = useState(initialContenido.formulario.submitLabel);
  const [formSuccessTitle, setFormSuccessTitle] = useState(initialContenido.formulario.successTitle);
  const [formSuccessText, setFormSuccessText] = useState(initialContenido.formulario.successText);

  // Mapa
  const [mapaEmbed, setMapaEmbed] = useState(initialContenido.mapa.embedUrl);
  const [mapaBadge, setMapaBadge] = useState(initialContenido.mapa.badgeText);

  // Prefijo de carpeta en Storage para las imágenes de esta página.
  const safePrefix = `paginas/${slug.replace(/[^a-z0-9-]/g, "-")}`;

  const updateExt = (i: number, patch: Partial<ExtensionContacto>) =>
    setExtensiones((arr) => arr.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
  const addExt = () =>
    setExtensiones((arr) => [...arr, { ext: "", dept: "", primary: false }]);
  const removeExt = (i: number) =>
    setExtensiones((arr) => arr.filter((_, idx) => idx !== i));

  const contenidoJson = JSON.stringify({
    hero: {
      eyebrow: heroEyebrow,
      titleLine1: heroTitleLine1,
      titleLine2: heroTitleLine2,
      description: heroDescription,
      caption: heroCaption,
      ghostText: heroGhostText,
      bgImage: heroBgImage,
      tarjeta: {
        titulo: heroTarjetaTitulo,
        subtitulo: heroTarjetaSubtitulo,
      },
    },
    canales: {
      eyebrow: canalesEyebrow,
      heading: canalesHeading,
      bannerImagen: canalesBanner,
      tarjetaTelefono: {
        titulo: telTitulo,
        extensiones: extensiones
          .map((e) => ({
            ext: e.ext.trim(),
            dept: e.dept.trim(),
            primary: Boolean(e.primary),
          }))
          .filter((e) => e.ext && e.dept),
      },
      tarjetaDireccion: {
        titulo: dirTitulo,
        horarioLaboral: dirHorarioLab,
        horarioFinde: dirHorarioFinde,
      },
      tarjetaEmail: {
        titulo: emailTitulo,
        descripcion: emailDescripcion,
        ctaLabel: emailCtaLabel,
        ctaHref: emailCtaHref,
      },
    },
    formulario: {
      eyebrow: formEyebrow,
      heading: formHeading,
      subtitle: formSubtitle,
      submitLabel: formSubmitLabel,
      successTitle: formSuccessTitle,
      successText: formSuccessText,
    },
    mapa: {
      embedUrl: mapaEmbed,
      badgeText: mapaBadge,
    },
  });

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
        <Field label="Slug (URL)" hint="Esta plantilla solo se usa para /contactos. No editable.">
          <input
            type="text"
            value={`/${slug}`}
            readOnly
            disabled
            style={{ ...inputStyle, background: "#F4F1EB", color: "#A0AABA" }}
          />
        </Field>
      </Card>

      <Card
        title="Hero — contenido principal"
        subtitle="Foto de fondo + eyebrow + título a 2 líneas (segunda en rojo) + descripción + caption + ghost text."
      >
        <Field label="Eyebrow (texto pequeño rojo)">
          <input type="text" value={heroEyebrow} onChange={(e) => setHeroEyebrow(e.target.value)} style={inputStyle} />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Título — línea 1 (blanco)" required>
            <input type="text" value={heroTitleLine1} onChange={(e) => setHeroTitleLine1(e.target.value)} required style={inputStyle} />
          </Field>
          <Field label="Título — línea 2 (rojo)" required>
            <input type="text" value={heroTitleLine2} onChange={(e) => setHeroTitleLine2(e.target.value)} required style={inputStyle} />
          </Field>
        </div>
        <Field label="Descripción" hint="Usa Enter para saltos de línea.">
          <textarea
            value={heroDescription}
            onChange={(e) => setHeroDescription(e.target.value)}
            rows={3}
            style={{ ...inputStyle, height: "auto", paddingTop: 10, paddingBottom: 10 }}
          />
        </Field>
        <Field label="Caption (línea pequeña inferior)">
          <input type="text" value={heroCaption} onChange={(e) => setHeroCaption(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Ghost text decorativo">
          <input type="text" value={heroGhostText} onChange={(e) => setHeroGhostText(e.target.value)} style={inputStyle} />
        </Field>
        <ImageUploader
          label="Imagen de fondo del hero"
          hint="Se muestra a pantalla completa con un velo oscuro encima. Usa una foto horizontal y de buena resolución (mínimo 1600 px de ancho)."
          value={heroBgImage}
          onChange={setHeroBgImage}
          prefix={`${safePrefix}/hero`}
          previewAspect="16/9"
        />
      </Card>

      <Card
        title="Tarjeta flotante del hero (derecha)"
        subtitle="Card oscura con teléfono, dirección y horario. Solo se editan acá su título y subtítulo — los datos (teléfono/dirección/horario) vienen de la sección Contacto."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Título de la tarjeta">
            <input type="text" value={heroTarjetaTitulo} onChange={(e) => setHeroTarjetaTitulo(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Subtítulo de la tarjeta">
            <input type="text" value={heroTarjetaSubtitulo} onChange={(e) => setHeroTarjetaSubtitulo(e.target.value)} style={inputStyle} />
          </Field>
        </div>
      </Card>

      <Card
        title="Sección — Canales de atención"
        subtitle="Banner con foto + 3 tarjetas (Teléfono, Dirección y Horario, Correo)."
      >
        <Field label="Eyebrow de la sección">
          <input type="text" value={canalesEyebrow} onChange={(e) => setCanalesEyebrow(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Heading">
          <input type="text" value={canalesHeading} onChange={(e) => setCanalesHeading(e.target.value)} style={inputStyle} />
        </Field>
        <ImageUploader
          label="Imagen del banner de la sección"
          hint="Foto ancha que separa el hero de las 3 tarjetas de contacto. Funciona mejor una toma horizontal del campus."
          value={canalesBanner}
          onChange={setCanalesBanner}
          prefix={`${safePrefix}/canales`}
          previewAspect="16/9"
        />
      </Card>

      <Card title="Tarjeta 1 — Teléfono Central" subtitle="Título + lista de extensiones del PBX.">
        <Field label="Título de la tarjeta">
          <input type="text" value={telTitulo} onChange={(e) => setTelTitulo(e.target.value)} style={inputStyle} />
        </Field>
        <div className="flex flex-col gap-3 mt-3">
          {extensiones.map((e, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-[140px_1fr_auto_auto] gap-2 items-end p-3"
              style={panelStyle}
            >
              <Field label="Extensión">
                <input type="text" value={e.ext} onChange={(ev) => updateExt(i, { ext: ev.target.value })} placeholder="100" style={inputStyle} />
              </Field>
              <Field label="Departamento">
                <input type="text" value={e.dept} onChange={(ev) => updateExt(i, { dept: ev.target.value })} placeholder="Recepción" style={inputStyle} />
              </Field>
              <label className="flex items-center gap-2 mb-[10px]" style={{ fontSize: 12, color: "#1A2B4A" }}>
                <input
                  type="checkbox"
                  checked={e.primary}
                  onChange={(ev) => updateExt(i, { primary: ev.target.checked })}
                  style={{ width: 16, height: 16, accentColor: "#1A2B4A" }}
                />
                Destacar
              </label>
              <button
                type="button"
                onClick={() => removeExt(i)}
                aria-label="Eliminar"
                style={iconButton}
                className="mb-[10px]"
              >
                <Trash2 size={12} strokeWidth={2.5} />
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addExt}
          style={addButton}
          className="flex items-center justify-center gap-1.5 self-start px-4"
        >
          <Plus size={14} strokeWidth={2.5} /> Agregar extensión
        </button>
      </Card>

      <Card
        title="Tarjeta 2 — Dirección y Horario"
        subtitle="La dirección viene de la sección Contacto. Aquí editas el título y las líneas de horario."
      >
        <Field label="Título de la tarjeta">
          <input type="text" value={dirTitulo} onChange={(e) => setDirTitulo(e.target.value)} style={inputStyle} />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Horario laboral (lun–vie)">
            <input type="text" value={dirHorarioLab} onChange={(e) => setDirHorarioLab(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Horario fin de semana">
            <input type="text" value={dirHorarioFinde} onChange={(e) => setDirHorarioFinde(e.target.value)} style={inputStyle} />
          </Field>
        </div>
      </Card>

      <Card title="Tarjeta 3 — Correo Electrónico" subtitle="Tarjeta navy con el email. El email viene de la sección Contacto.">
        <Field label="Título de la tarjeta">
          <input type="text" value={emailTitulo} onChange={(e) => setEmailTitulo(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Descripción">
          <textarea
            value={emailDescripcion}
            onChange={(e) => setEmailDescripcion(e.target.value)}
            rows={2}
            style={{ ...inputStyle, height: "auto", paddingTop: 10, paddingBottom: 10 }}
          />
        </Field>
        <Field label="Texto del botón CTA">
          <input type="text" value={emailCtaLabel} onChange={(e) => setEmailCtaLabel(e.target.value)} style={inputStyle} />
        </Field>
        <Field
          label="Acción del botón (URL o mailto)"
          hint="Si lo dejas vacío, el botón abre el cliente de correo del visitante apuntando al email principal. Si llenas algo, se respeta literal."
        >
          <input
            type="text"
            value={emailCtaHref}
            onChange={(e) => setEmailCtaHref(e.target.value)}
            placeholder="(vacío → mailto: automático)"
            style={inputStyle}
          />
        </Field>
      </Card>

      <Card title="Formulario de contacto" subtitle="Encabezado del formulario y mensajes del estado de éxito.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Eyebrow">
            <input type="text" value={formEyebrow} onChange={(e) => setFormEyebrow(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Heading">
            <input type="text" value={formHeading} onChange={(e) => setFormHeading(e.target.value)} style={inputStyle} />
          </Field>
        </div>
        <Field label="Subtítulo">
          <input type="text" value={formSubtitle} onChange={(e) => setFormSubtitle(e.target.value)} style={inputStyle} />
        </Field>
        <Field label="Texto del botón Enviar">
          <input type="text" value={formSubmitLabel} onChange={(e) => setFormSubmitLabel(e.target.value)} style={inputStyle} />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Título del estado de éxito">
            <input type="text" value={formSuccessTitle} onChange={(e) => setFormSuccessTitle(e.target.value)} style={inputStyle} />
          </Field>
          <Field label="Texto del estado de éxito">
            <input type="text" value={formSuccessText} onChange={(e) => setFormSuccessText(e.target.value)} style={inputStyle} />
          </Field>
        </div>
      </Card>

      <Card title="Mapa (Google Maps)" subtitle="URL del iframe Embed + texto del badge sobre el mapa.">
        <Field
          label="URL del Embed de Google Maps"
          hint='Pega la URL que empieza con "https://www.google.com/maps/embed?pb=…".'
        >
          <input type="url" value={mapaEmbed} onChange={(e) => setMapaEmbed(e.target.value)} placeholder="https://www.google.com/maps/embed?pb=…" style={inputStyle} />
        </Field>
        <Field label="Texto del badge">
          <input type="text" value={mapaBadge} onChange={(e) => setMapaBadge(e.target.value)} style={inputStyle} />
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
            style={{ ...inputStyle, height: "auto", minHeight: 50, paddingTop: 10, paddingBottom: 10, resize: "vertical" }}
          />
        </Field>
      </Card>
    </form>
  );
}

/* ─── helpers UI ─── */

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
