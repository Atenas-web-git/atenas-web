"use client";

import { useActionState, useState } from "react";
import { Save } from "lucide-react";
import type { NavbarConfig } from "@/lib/cms/getConfiguracion";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { guardarNavbarAction, type NavbarActionState } from "./actions";

export function NavbarConfigForm({ initial }: { initial: NavbarConfig }) {
  const [state, action, isPending] = useActionState<NavbarActionState, FormData>(
    guardarNavbarAction,
    { error: null, ok: false }
  );

  const [badgeVisible, setBadgeVisible] = useState(initial.aniversarioBadge.visible);
  const [badgeLabel, setBadgeLabel] = useState(initial.aniversarioBadge.label);
  const [badgeLogo, setBadgeLogo] = useState(initial.aniversarioBadge.logoSrc);

  const [portalVisible, setPortalVisible] = useState(initial.ctaPortal.visible);
  const [portalLabel, setPortalLabel] = useState(initial.ctaPortal.label);
  const [portalHref, setPortalHref] = useState(initial.ctaPortal.href);

  const [tourVisible, setTourVisible] = useState(initial.ctaTour.visible);
  const [tourLabel, setTourLabel] = useState(initial.ctaTour.label);
  const [tourHref, setTourHref] = useState(initial.ctaTour.href);

  const [busquedaVisible, setBusquedaVisible] = useState(initial.busqueda.visible);
  const [campanaVisible, setCampanaVisible] = useState(initial.campana.visible);
  const [menuLabel, setMenuLabel] = useState(initial.menuLabel);

  const payload: NavbarConfig = {
    aniversarioBadge: {
      visible: badgeVisible,
      label: badgeLabel,
      logoSrc: badgeLogo,
    },
    ctaPortal: { visible: portalVisible, label: portalLabel, href: portalHref },
    ctaTour: { visible: tourVisible, label: tourLabel, href: tourHref },
    busqueda: { visible: busquedaVisible },
    campana: { visible: campanaVisible },
    menuLabel,
  };

  return (
    <form action={action} className="flex flex-col gap-5">
      <input type="hidden" name="payload" value={JSON.stringify(payload)} />

      <Sticky state={state} isPending={isPending} />

      <Card
        title="Badge conmemorativo «50 AÑOS»"
        subtitle="Aparece a la derecha del logo principal. Si subes un logo, reemplaza al texto del badge. Si no tienes logo todavía, deja vacío el campo de imagen y se mostrará el texto."
      >
        <Toggle
          label="Mostrar este badge en la barra"
          value={badgeVisible}
          onChange={setBadgeVisible}
        />
        <Field label="Texto del badge">
          <input
            type="text"
            value={badgeLabel}
            onChange={(e) => setBadgeLabel(e.target.value)}
            disabled={!badgeVisible}
            placeholder="50 AÑOS"
            style={inputStyle}
          />
        </Field>
        <ImageUploader
          label="Logo conmemorativo (opcional)"
          value={badgeLogo}
          onChange={setBadgeLogo}
          prefix="navbar/aniversario"
          previewAspect="16/9"
        />
      </Card>

      <Card
        title="Botón «Portal Familiar»"
        subtitle="Texto en navy a la izquierda del Tour Virtual. Suele apuntar al portal familiar o al seguimiento de admisión."
      >
        <Toggle
          label="Mostrar este botón"
          value={portalVisible}
          onChange={setPortalVisible}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Texto" required>
            <input
              type="text"
              value={portalLabel}
              onChange={(e) => setPortalLabel(e.target.value)}
              disabled={!portalVisible}
              placeholder="PORTAL FAMILIAR"
              style={inputStyle}
            />
          </Field>
          <Field label="URL" required>
            <input
              type="text"
              value={portalHref}
              onChange={(e) => setPortalHref(e.target.value)}
              disabled={!portalVisible}
              placeholder="/portal-familiar"
              style={inputStyle}
            />
          </Field>
        </div>
      </Card>

      <Card
        title="Botón «Tour Virtual»"
        subtitle="Píldora roja con borde. Suele apuntar al paseo virtual 360°. Cuando el cliente entregue la URL real, edítalo aquí."
      >
        <Toggle
          label="Mostrar este botón"
          value={tourVisible}
          onChange={setTourVisible}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Texto" required>
            <input
              type="text"
              value={tourLabel}
              onChange={(e) => setTourLabel(e.target.value)}
              disabled={!tourVisible}
              placeholder="TOUR VIRTUAL"
              style={inputStyle}
            />
          </Field>
          <Field label="URL" required>
            <input
              type="text"
              value={tourHref}
              onChange={(e) => setTourHref(e.target.value)}
              disabled={!tourVisible}
              placeholder="/paseo-virtual"
              style={inputStyle}
            />
          </Field>
        </div>
      </Card>

      <Card
        title="Icono de búsqueda"
        subtitle="Lupa al lado del menú. Abre un buscador global del sitio (Páginas + Documentos + Eventos + Reconocimientos). Atajo de teclado: ⌘K (Mac) / Ctrl+K (Windows)."
      >
        <Toggle
          label="Mostrar icono de búsqueda"
          value={busquedaVisible}
          onChange={setBusquedaVisible}
        />
      </Card>

      <Card
        title="Campanita de notificaciones"
        subtitle="Solo aparece visualmente cuando hay notificaciones activas. Si lo ocultas aquí, no aparecerá nunca aunque haya notificaciones."
      >
        <Toggle
          label="Mostrar campanita"
          value={campanaVisible}
          onChange={setCampanaVisible}
        />
      </Card>

      <Card
        title="Botón principal «Menú»"
        subtitle="Botón rojo que abre el mega-menú. Solo se edita el texto."
      >
        <Field label="Texto del botón" required>
          <input
            type="text"
            value={menuLabel}
            onChange={(e) => setMenuLabel(e.target.value)}
            required
            placeholder="MENÚ"
            style={inputStyle}
          />
        </Field>
      </Card>
    </form>
  );
}

function Sticky({
  state,
  isPending,
}: {
  state: NavbarActionState;
  isPending: boolean;
}) {
  return (
    <div
      className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap sticky top-0 z-10"
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
    >
      <span style={{ fontSize: 12, color: "#6B6660" }}>
        Los cambios se aplican a todo el sitio público al guardar.
      </span>
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
  required,
  children,
}: {
  label: string;
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
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        style={{ width: 16, height: 16, accentColor: "#1A2B4A" }}
      />
      <span style={{ fontSize: 13, fontWeight: 600, color: "#1A2B4A" }}>{label}</span>
    </label>
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
