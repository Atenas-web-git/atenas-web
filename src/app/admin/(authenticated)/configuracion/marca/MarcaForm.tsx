"use client";

import { useActionState, useState } from "react";
import { Save } from "lucide-react";
import type { Marca } from "@/lib/cms/getConfiguracion";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { guardarMarcaAction, type MarcaActionState } from "./actions";

const GOOGLE_FONTS = [
  "Poppins",
  "Inter",
  "Montserrat",
  "Open Sans",
  "Roboto",
  "Lato",
  "Nunito",
  "Source Sans 3",
  "Raleway",
  "Work Sans",
];

export function MarcaForm({ initialMarca }: { initialMarca: Marca }) {
  const [state, action, isPending] = useActionState<MarcaActionState, FormData>(
    guardarMarcaAction,
    { error: null, ok: false }
  );

  // Logos como estado controlado para usar el ImageUploader
  const [logoPrincipal, setLogoPrincipal] = useState(initialMarca.logos.principal);
  const [logoBlanco, setLogoBlanco] = useState(initialMarca.logos.blanco);
  const [logoEscudo, setLogoEscudo] = useState(initialMarca.logos.escudo);
  const [logoFavicon, setLogoFavicon] = useState(initialMarca.logos.favicon);
  const [logoOgDefault, setLogoOgDefault] = useState(initialMarca.logos.ogDefault);

  // Colores
  const [navy, setNavy] = useState(initialMarca.paleta.navy);
  const [rojo, setRojo] = useState(initialMarca.paleta.rojo);
  const [dorado, setDorado] = useState(initialMarca.paleta.dorado);
  const [offWhite, setOffWhite] = useState(initialMarca.paleta.offWhite);
  const [dark, setDark] = useState(initialMarca.paleta.dark);

  // Tipografía
  const [tipografia, setTipografia] = useState(initialMarca.tipografia);

  return (
    <form action={action} className="flex flex-col gap-5">
      {/* Sticky de guardado */}
      <div
        className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap sticky top-0 z-10"
        style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
      >
        <span style={{ fontSize: 13, color: "#6B6660" }}>
          Los cambios aplican a TODO el sitio público al guardar.
        </span>
        <div className="flex items-center gap-3">
          {state.error && (
            <span style={{ fontSize: 12, color: "#991B1B" }}>{state.error}</span>
          )}
          {state.ok && (
            <span style={{ fontSize: 12, color: "#065F46" }}>Guardado ✓</span>
          )}
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

      {/* Hidden inputs para los uploaders (FormData no captura el estado del child) */}
      <input type="hidden" name="logo_principal" value={logoPrincipal} />
      <input type="hidden" name="logo_blanco" value={logoBlanco} />
      <input type="hidden" name="logo_escudo" value={logoEscudo} />
      <input type="hidden" name="logo_favicon" value={logoFavicon} />
      <input type="hidden" name="logo_og_default" value={logoOgDefault} />

      {/* Bloque 1 — Logos */}
      <Card
        title="Logos e imágenes"
        subtitle="Los logos se almacenan en el bucket `contenido` con prefijo `marca/`. Si dejas un campo vacío, el sitio usa el logo SVG hardcoded original como fallback."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ImageUploader
            label="Logo principal (color, sobre fondo claro)"
            value={logoPrincipal}
            onChange={setLogoPrincipal}
            prefix="marca"
            previewAspect="16/9"
            hint="Aparece en navbar, footer y otros fondos claros. SVG o PNG con fondo transparente."
          />
          <ImageUploader
            label="Logo blanco (sobre fondo oscuro)"
            value={logoBlanco}
            onChange={setLogoBlanco}
            prefix="marca"
            previewAspect="16/9"
            hint="Variante para hero, mega-menú y otros fondos oscuros."
          />
          <ImageUploader
            label="Escudo (sin tipografía)"
            value={logoEscudo}
            onChange={setLogoEscudo}
            prefix="marca"
            previewAspect="1/1"
            hint="Solo el escudo, sin la palabra 'atenas'. Útil para casos compactos."
          />
          <ImageUploader
            label="Favicon"
            value={logoFavicon}
            onChange={setLogoFavicon}
            prefix="marca"
            previewAspect="1/1"
            hint="32×32 PNG o SVG. Aparece en la pestaña del navegador."
          />
        </div>
        <ImageUploader
          label="OG image por defecto (1200×630)"
          value={logoOgDefault}
          onChange={setLogoOgDefault}
          prefix="marca"
          previewAspect="16/9"
          hint="Imagen para previsualizaciones cuando se comparte el sitio en redes sociales y la página no tiene su propia OG image."
        />
      </Card>

      {/* Bloque 2 — Paleta */}
      <Card
        title="Paleta de colores"
        subtitle="Se inyectan al sitio como CSS variables (--color-navy, --color-rojo, etc.). Los nuevos componentes las usan automáticamente. Los componentes antiguos seguirán con sus hex hardcoded hasta una sesión de limpieza posterior."
      >
        <ColorRow label="Navy primario" name="color_navy" value={navy} onChange={setNavy} hint="Color institucional principal (azul oscuro)." />
        <ColorRow label="Rojo institucional" name="color_rojo" value={rojo} onChange={setRojo} hint="Acento primario / botones / elementos interactivos." />
        <ColorRow label="Dorado (50 años)" name="color_dorado" value={dorado} onChange={setDorado} hint="Acento conmemorativo. Recomendamos no cambiarlo durante la celebración de los 50 años." warn />
        <ColorRow label="Off-white de fondos" name="color_off_white" value={offWhite} onChange={setOffWhite} hint="Color de fondo de secciones claras." />
        <ColorRow label="Dark de texto" name="color_dark" value={dark} onChange={setDark} hint="Color base del texto sobre fondos claros." />
      </Card>

      {/* Bloque 3 — Tipografía */}
      <Card title="Tipografía" subtitle="Familia de Google Fonts usada en todo el sitio. El servidor incluye automáticamente el `<link>` con la fuente seleccionada.">
        <Field label="Familia tipográfica" hint="Solo Google Fonts populares. Cambios en el sitio público se ven al recargar.">
          <select
            name="tipografia"
            value={tipografia}
            onChange={(e) => setTipografia(e.target.value)}
            style={inputStyle}
          >
            {GOOGLE_FONTS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </Field>
        <div
          className="rounded-md p-4"
          style={{ background: "#FAFAF8", border: "1px solid #E8E4DD" }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, color: "#6B6660", textTransform: "uppercase", letterSpacing: 0.5, margin: "0 0 8px" }}>
            Vista previa
          </p>
          <p
            style={{
              fontFamily: `${tipografia}, sans-serif`,
              fontSize: 24,
              fontWeight: 700,
              color: "#1A2B4A",
              margin: 0,
            }}
          >
            Unidad Educativa Atenas
          </p>
          <p
            style={{
              fontFamily: `${tipografia}, sans-serif`,
              fontSize: 14,
              fontWeight: 400,
              color: "#6B6660",
              margin: "4px 0 0",
            }}
          >
            La institución referente de Ambato, para toda la vida.
          </p>
        </div>
      </Card>

      {/* Bloque 4 — Información institucional */}
      <Card title="Información institucional" subtitle="Datos globales del colegio. Alimentan el JSON-LD del SEO local (LocalBusiness en Google).">
        <Field label="Nombre oficial" required>
          <input
            type="text"
            name="nombre_institucion"
            defaultValue={initialMarca.institucion.nombre}
            required
            style={inputStyle}
          />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-3">
          <Field label="RUC" hint="Solo dígitos. Opcional.">
            <input
              type="text"
              name="ruc"
              defaultValue={initialMarca.institucion.ruc}
              style={inputStyle}
            />
          </Field>
          <Field label="Año de fundación" required>
            <input
              type="number"
              name="anio_fundacion"
              defaultValue={initialMarca.institucion.anioFundacion}
              min={1800}
              max={3000}
              required
              style={inputStyle}
            />
          </Field>
        </div>
        <Field label="Dirección" hint='Aparece en el SEO local (Google Maps, JSON-LD). Ej. "Calle Gabriel Román s/n y Av. Pedro Vásconez, Izamba, Ambato".'>
          <input
            type="text"
            name="direccion"
            defaultValue={initialMarca.institucion.direccion}
            style={inputStyle}
          />
        </Field>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Ciudad y país" hint='Ej. "Ambato, Ecuador". Aparece en el footer de los correos y en el JSON-LD.'>
            <input
              type="text"
              name="ciudad"
              defaultValue={initialMarca.institucion.ciudad}
              placeholder="Ambato, Ecuador"
              style={inputStyle}
            />
          </Field>
          <Field label="Sitio web" hint='URL completa con https://. Aparece en el copyright de los correos.'>
            <input
              type="url"
              name="sitio_web"
              defaultValue={initialMarca.institucion.sitioWeb}
              placeholder="https://atenas.edu.ec"
              style={inputStyle}
            />
          </Field>
        </div>
      </Card>
    </form>
  );
}

/* ─── Helpers ─── */

function ColorRow({
  label,
  name,
  value,
  onChange,
  hint,
  warn = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  warn?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[60px_180px_1fr] gap-3 items-center">
      {/* Swatch + color picker nativo */}
      <label
        className="block rounded-md cursor-pointer relative overflow-hidden"
        style={{
          width: 56,
          height: 38,
          background: value,
          border: "1px solid #E8E4DD",
        }}
      >
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "pointer",
            border: "none",
            padding: 0,
          }}
        />
      </label>

      {/* Hex */}
      <input
        type="text"
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#1A2B4A"
        style={{
          ...inputStyle,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        }}
      />

      {/* Label + hint */}
      <div className="flex flex-col gap-0.5">
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>{label}</span>
        {hint && (
          <span style={{ fontSize: 10, color: warn ? "#92400E" : "#A0AABA", lineHeight: 1.5 }}>
            {hint}
          </span>
        )}
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
        <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          {title}
        </h2>
        {subtitle && (
          <p style={{ fontSize: 12, color: "#6B6660", margin: 0, lineHeight: 1.5 }}>
            {subtitle}
          </p>
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
};
