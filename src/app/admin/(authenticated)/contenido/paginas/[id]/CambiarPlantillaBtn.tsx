"use client";

import { useState, useTransition } from "react";
import { AlertTriangle, Layers, X } from "lucide-react";
import { cambiarPlantillaAction } from "../actions";
import { PLANTILLAS, type PlantillaSlug } from "../../plantillas";

type Props = {
  paginaId: string;
  plantillaActual: PlantillaSlug;
  /** Slug de la página — usado para excluir slugs reservados a módulos dedicados */
  slug: string;
};

// Plantillas que el usuario puede elegir al cambiar. Excluye K y L (bloqueadas
// para páginas que no sean /servicios/[slug] o /espacios/[slug]).
const PLANTILLAS_SELECCIONABLES: PlantillaSlug[] = [
  "tpl_a_hero_texto",
  "tpl_b_hero_grid",
  "tpl_c_hero_pasos",
  "tpl_d_hero_detalle",
  "tpl_f_hero_academico",
  "tpl_g_landing_ib",
  "tpl_h_landing_niveles",
  "tpl_i_historia",
  "tpl_j_landing_matriculas",
  "tpl_m_home",
];

export function CambiarPlantillaBtn({ paginaId, plantillaActual, slug }: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<PlantillaSlug>(plantillaActual);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSubmit = () => {
    if (selected === plantillaActual) {
      setError("La plantilla ya está seleccionada.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.append("id", paginaId);
      fd.append("plantilla", selected);
      const res = await cambiarPlantillaAction({ error: null, ok: false }, fd);
      if (res.error) {
        setError(res.error);
      } else {
        setOpen(false);
        // El revalidate del action hará que la page se recargue con la nueva plantilla
        window.location.reload();
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 rounded-md transition-opacity hover:opacity-70"
        style={{
          height: 32,
          background: "#F4F1EB",
          fontSize: 12,
          color: "#1A2B4A",
          fontWeight: 600,
          border: "1px solid #E8E4DD",
          cursor: "pointer",
        }}
        aria-label="Cambiar plantilla"
      >
        <Layers size={13} strokeWidth={2.5} />
        Cambiar plantilla
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(13,24,37,0.65)" }}
          onClick={() => !pending && setOpen(false)}
        >
          <div
            className="flex flex-col gap-4 p-6"
            style={{
              background: "#FFFFFF",
              border: "1px solid #E8E4DD",
              borderRadius: 12,
              width: "min(560px, 100%)",
              maxHeight: "85vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
                  Cambiar plantilla de la página
                </h2>
                <p style={{ fontSize: 12, color: "#6B6660", margin: "4px 0 0", maxWidth: 480 }}>
                  Al cambiar de plantilla, el contenido específico de la plantilla anterior se
                  reinicia con los defaults de la nueva. Si la nueva plantilla también soporta
                  Hero, el Hero actual <strong>se conserva</strong>.
                </p>
              </div>
              <button
                type="button"
                onClick={() => !pending && setOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 4,
                  color: "#6B6660",
                }}
                aria-label="Cerrar"
              >
                <X size={18} />
              </button>
            </div>

            <div
              className="px-3 py-2 flex items-start gap-2 rounded-md"
              style={{ background: "#FEF3C7", border: "1px solid #FDE68A" }}
            >
              <AlertTriangle size={14} color="#92400E" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 11, color: "#92400E", margin: 0, lineHeight: 1.5 }}>
                <strong>Advertencia</strong>: este cambio NO se puede deshacer. Te recomendamos
                tener clara la idea antes de cambiar. El contenido específico (logros, tarjetas,
                pasos, stats, etc.) se borrará y se reemplazará por defaults de la nueva
                plantilla. Solo el Hero (título, eyebrow, subtítulo) se preserva si ambas
                plantillas lo soportan.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label style={{ fontSize: 12, fontWeight: 600, color: "#1A2B4A" }}>
                Plantilla destino:
              </label>
              <select
                value={selected}
                onChange={(e) => {
                  setSelected(e.target.value as PlantillaSlug);
                  setError(null);
                }}
                disabled={pending}
                style={{
                  width: "100%",
                  minHeight: 38,
                  padding: "8px 12px",
                  background: "#FAFAF8",
                  border: "1px solid #E8E4DD",
                  borderRadius: 6,
                  fontSize: 13,
                  color: "#1A2B4A",
                  outline: "none",
                  fontFamily: "inherit",
                  cursor: pending ? "wait" : "pointer",
                }}
              >
                {PLANTILLAS_SELECCIONABLES.map((slug) => {
                  const info = PLANTILLAS[slug];
                  return (
                    <option key={slug} value={slug}>
                      {slug === plantillaActual ? "✓ " : ""}
                      Plantilla {info.letra} — {info.nombre}
                      {slug === plantillaActual ? " (actual)" : ""}
                    </option>
                  );
                })}
              </select>
              {selected !== plantillaActual && PLANTILLAS[selected] && (
                <p
                  className="px-3 py-2"
                  style={{
                    fontSize: 11,
                    color: "#6B6660",
                    background: "#FAFAF8",
                    border: "1px solid #E8E4DD",
                    borderRadius: 6,
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {PLANTILLAS[selected].descripcion}
                </p>
              )}
            </div>

            {error && (
              <div
                className="px-3 py-2 rounded-md"
                style={{ background: "#FEE2E2", border: "1px solid #FCA5A5" }}
              >
                <p style={{ fontSize: 12, color: "#991B1B", margin: 0 }}>{error}</p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={pending}
                style={{
                  height: 36,
                  padding: "0 16px",
                  background: "#FFFFFF",
                  border: "1px solid #E8E4DD",
                  borderRadius: 6,
                  fontSize: 13,
                  color: "#1A2B4A",
                  fontWeight: 500,
                  cursor: pending ? "wait" : "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={pending || selected === plantillaActual}
                style={{
                  height: 36,
                  padding: "0 16px",
                  background: "#1A2B4A",
                  border: "none",
                  borderRadius: 6,
                  fontSize: 13,
                  color: "#FFFFFF",
                  fontWeight: 600,
                  cursor: pending || selected === plantillaActual ? "not-allowed" : "pointer",
                  opacity: pending || selected === plantillaActual ? 0.6 : 1,
                }}
              >
                {pending ? "Cambiando…" : "Cambiar plantilla"}
              </button>
            </div>
            {/* slug pasado por si es útil en el futuro para validaciones contextuales */}
            <input type="hidden" value={slug} readOnly style={{ display: "none" }} />
          </div>
        </div>
      )}
    </>
  );
}
