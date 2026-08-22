import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ClipboardList, ExternalLink, Inbox, Lock, Mail, Plus } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasRole } from "@/lib/auth/types";
import {
  AREA_LABELS,
  AREAS,
  puedeCrearFormularios,
  puedeVerFormularios,
} from "@/lib/auth/areas";
import { listarFormularios } from "@/lib/formularios/getFormulario";
import { FORMULARIOS_GESTIONADOS_APARTE } from "@/lib/formularios/gestionadosAparte";
import {
  TIPOS_PLANTILLA_INFO,
  type TipoPlantillaFormulario,
} from "../plantillas-formularios/constants";

export const dynamic = "force-dynamic";

export default async function FormulariosPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!puedeVerFormularios(user)) {
    redirect("/admin");
  }

  // El listado ya llega recortado al área del usuario (migración 079).
  const formularios = await listarFormularios(user);
  const puedeCrear = puedeCrearFormularios(user);

  // Solo Talento Humano ve una única área; para el resto, etiquetar cada
  // formulario sería ruido.
  const mostrarArea = !hasRole(user, ROLES.EDITOR_TALENTO);

  // El bloque de «se gestionan en otro sitio» apunta a Admisiones. A quien no
  // administra admisiones no le sirve de nada y le enseña una puerta cerrada.
  const mostrarGestionadosAparte = hasRole(user, ROLES.SUPERADMIN) || hasRole(user, ROLES.EDITOR_COMM);

  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <Link
          href="/admin/contenido"
          className="inline-flex items-center gap-1"
          style={{ fontSize: 13, color: "#6B6660" }}
        >
          <ArrowLeft size={13} /> Contenido
        </Link>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: "8px 0 0" }}>
          Formularios
        </h1>
        <p style={{ fontSize: 14, color: "#6B6660", margin: "4px 0 0", maxWidth: 620 }}>
          Crea un formulario, elige qué preguntas tiene y colócalo en cualquier
          página del sitio. Todo lo que la gente responda queda guardado aquí,
          aunque falle el correo.
        </p>
      </div>

      {puedeCrear && (
        <div>
          <Link
            href="/admin/contenido/formularios/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2"
            style={{
              background: "#1A2B4A",
              color: "#FFFFFF",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            <Plus size={15} /> Crear formulario
          </Link>
        </div>
      )}

      {formularios.length === 0 ? (
        <div
          className="flex flex-col items-center gap-3 px-6 py-14 text-center"
          style={{ background: "#FFFFFF", border: "1px dashed #E8E4DD", borderRadius: 12 }}
        >
          <ClipboardList size={26} color="#9A948C" />
          <p style={{ fontSize: 14, fontWeight: 600, color: "#1A2B4A", margin: 0 }}>
            Todavía no hay formularios
          </p>
          <p style={{ fontSize: 14, color: "#6B6660", margin: 0, maxWidth: 380 }}>
            {puedeCrear
              ? "Crea el primero para empezar a recibir postulaciones, consultas o inscripciones sin depender de Google Formularios."
              : "Cuando alguien complete un formulario de tu área, aparecerá aquí."}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {formularios.map((f) => (
            <div
              key={f.id}
              className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
              style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#1A2B4A" }}>
                    {f.nombre}
                  </span>
                  {!f.activo && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                        background: "#F1EEE9",
                        color: "#6B6660",
                        padding: "3px 8px",
                        borderRadius: 999,
                      }}
                    >
                      Desactivado
                    </span>
                  )}
                  {mostrarArea && f.area !== AREAS.COMUNICACIONES && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                        background: "#F1EEE9",
                        color: "#6B6660",
                        padding: "3px 8px",
                        borderRadius: 999,
                      }}
                    >
                      {AREA_LABELS[f.area]}
                    </span>
                  )}
                  {f.respuestas_nuevas > 0 && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: 0.5,
                        textTransform: "uppercase",
                        background: "#9e1915",
                        color: "#FFFFFF",
                        padding: "3px 8px",
                        borderRadius: 999,
                      }}
                    >
                      {f.respuestas_nuevas} sin revisar
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0" }}>
                  {f.campos_total} {f.campos_total === 1 ? "pregunta" : "preguntas"} ·{" "}
                  {f.respuestas_total}{" "}
                  {f.respuestas_total === 1 ? "respuesta" : "respuestas"}
                </p>
                {f.plantilla_correo && (
                  <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0" }}>
                    <Mail size={11} style={{ display: "inline", marginRight: 4 }} />
                    Confirmación:{" "}
                    <Link
                      href={`/admin/contenido/plantillas-formularios/${f.plantilla_correo}`}
                      style={{ color: "#1A2B4A", fontWeight: 600 }}
                    >
                      {TIPOS_PLANTILLA_INFO[
                        f.plantilla_correo as TipoPlantillaFormulario
                      ]?.label ?? f.plantilla_correo}
                    </Link>
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/admin/contenido/formularios/${f.id}/respuestas`}
                  className="inline-flex items-center gap-1.5 px-3 py-2"
                  style={{
                    border: "1px solid #E8E4DD",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#1A2B4A",
                  }}
                >
                  <Inbox size={14} /> Respuestas
                </Link>
                <Link
                  href={`/admin/contenido/formularios/${f.id}`}
                  className="inline-flex items-center px-3 py-2"
                  style={{
                    background: "#1A2B4A",
                    color: "#FFFFFF",
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  Editar
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formularios que existen en el sitio pero viven en su propio módulo. */}
      {mostrarGestionadosAparte && (
      <div className="flex flex-col gap-3">
        <div>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
            Se gestionan en otro sitio
          </h2>
          <p style={{ fontSize: 13, color: "#6B6660", margin: "3px 0 0" }}>
            También son formularios del sitio, pero tienen su propia sección.
          </p>
        </div>

        {FORMULARIOS_GESTIONADOS_APARTE.map((f) => (
          <div
            key={f.slug}
            className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
            style={{ background: "#FCFBF9", border: "1px solid #E8E4DD", borderRadius: 12 }}
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span style={{ fontSize: 15, fontWeight: 700, color: "#1A2B4A" }}>
                  {f.nombre}
                </span>
                <span
                  className="inline-flex items-center gap-1"
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    background: "#F1EEE9",
                    color: "#6B6660",
                    padding: "3px 8px",
                    borderRadius: 999,
                  }}
                >
                  <Lock size={10} /> Otra sección
                </span>
              </div>
              <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0", maxWidth: 620 }}>
                {f.motivo}
              </p>
              <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0" }}>
                <Mail size={11} style={{ display: "inline", marginRight: 4 }} />
                Confirmación:{" "}
                <Link
                  href={`/admin/contenido/plantillas-formularios/${f.plantillaCorreo}`}
                  style={{ color: "#1A2B4A", fontWeight: 600 }}
                >
                  {TIPOS_PLANTILLA_INFO[f.plantillaCorreo as TipoPlantillaFormulario]
                    ?.label ?? f.plantillaCorreo}
                </Link>
                {" · "}
                <a
                  href={f.rutasPublicas[0]}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#1A2B4A", fontWeight: 600 }}
                >
                  {f.rutasPublicas[0]} <ExternalLink size={10} style={{ display: "inline" }} />
                </a>
              </p>
            </div>

            <Link
              href={f.href}
              className="inline-flex shrink-0 items-center px-3 py-2"
              style={{
                border: "1px solid #E8E4DD",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                color: "#1A2B4A",
              }}
            >
              Ir a la sección
            </Link>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}
