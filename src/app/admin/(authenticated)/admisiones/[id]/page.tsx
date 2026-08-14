import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Phone, Mail, User } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole, hasRole } from "@/lib/auth/types";
import { ESTADO_INFO, ESTADO_INICIAL, type EstadoAdmision } from "../constants";
import { EstadoSelectorClient } from "./EstadoSelectorClient";
import { DocumentosClient } from "./DocumentosClient";
import { NotasClient } from "./NotasClient";
import { AdjuntosClient } from "./AdjuntosClient";
import { ArchivosBancoSolicitudClient } from "./ArchivosBancoSolicitudClient";
import { EliminarSolicitudClient } from "./EliminarSolicitudClient";
import { DatosEditableClient } from "./DatosEditableClient";
import {
  getConfiguracion,
  mergeAdmisionesTextos,
  type AdmisionesTextosConfig,
} from "@/lib/cms/getConfiguracion";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-EC", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString("es-EC", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getInitials(nombres: string, apellidos: string): string {
  const n = (nombres ?? "").trim()[0] ?? "";
  const a = (apellidos ?? "").trim()[0] ?? "";
  return (n + a).toUpperCase() || "·";
}

const cardStyle: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #E8E4DD",
  borderRadius: 12,
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: "#6B6660",
        textTransform: "uppercase",
        letterSpacing: 0.8,
        margin: "0 0 12px",
      }}
    >
      {children}
    </h3>
  );
}

export default async function SolicitudDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ADMISIONES])) redirect("/admin");

  const supabase = createAdminClient();

  const [
    { data: solicitud },
    { data: historial },
    { data: adjuntos },
    { data: catalogoDocs },
    { data: bancoArchivos },
    { data: bancoVinculados },
  ] = await Promise.all([
    supabase
      .from("solicitudes_admision")
      .select("*")
      .eq("id", id)
      .single(),
    supabase
      .from("solicitudes_historial")
      .select(`
        id,
        estado_anterior,
        estado_nuevo,
        nota,
        created_at,
        cambiado_por,
        profiles:cambiado_por ( full_name )
      `)
      .eq("solicitud_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("solicitud_adjuntos")
      .select("id, filename, size_bytes, mime_type, uploaded_at")
      .eq("solicitud_id", id)
      .order("uploaded_at", { ascending: false }),
    supabase
      .from("documentos_admision_catalogo")
      .select("nombre")
      .eq("activo", true)
      .order("orden", { ascending: true }),
    supabase
      .from("admisiones_archivos_banco")
      .select("id, nombre, descripcion, tipo_mime, tamano_bytes, categoria, archivo_url, activo")
      .eq("activo", true)
      .order("categoria", { ascending: true, nullsFirst: false })
      .order("orden", { ascending: true })
      .order("nombre", { ascending: true }),
    supabase
      .from("solicitud_archivos_banco")
      .select("archivo_id")
      .eq("solicitud_id", id),
  ]);

  // Cargar opciones para los selects del editor (niveles, relaciones,
  // cómo se enteró) desde la misma fuente que el formulario público.
  const [textosRaw, { data: anosLectivos }] = await Promise.all([
    getConfiguracion<Partial<AdmisionesTextosConfig>>("admisiones_textos"),
    supabase
      .from("anos_lectivos")
      .select("codigo")
      .eq("activo", true)
      .order("codigo", { ascending: true }),
  ]);
  const opcionesFormulario = mergeAdmisionesTextos(textosRaw).formulario.opciones;
  const aniosLectivosCodigos = (anosLectivos ?? []).map((a) => a.codigo);

  const catalogoNombres = (catalogoDocs ?? []).map((d) => d.nombre);
  const bancoArchivosList = bancoArchivos ?? [];
  const bancoVinculadosIds = (bancoVinculados ?? []).map((v) => v.archivo_id);

  if (!solicitud) notFound();

  const badge =
    ESTADO_INFO[solicitud.estado as EstadoAdmision] ?? ESTADO_INFO[ESTADO_INICIAL];
  const initials = getInitials(solicitud.est_nombres, solicitud.est_apellidos);
  const documentosRecibidos: string[] = Array.isArray(solicitud.documentos_recibidos)
    ? solicitud.documentos_recibidos
    : [];

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Breadcrumb */}
      <Link
        href="/admin/admisiones"
        className="flex items-center gap-1.5 w-fit transition-opacity hover:opacity-70"
        style={{ fontSize: 13, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver a solicitudes
      </Link>

      {/* Header de la solicitud */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 56,
              height: 56,
              background: "#1A2B4A",
              borderRadius: "50%",
            }}
          >
            <span style={{ fontSize: 18, fontWeight: 700, color: "#9e1915" }}>
              {initials}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
              {solicitud.est_nombres} {solicitud.est_apellidos}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#6B6660",
                  fontFamily: "monospace",
                }}
              >
                {solicitud.numero}
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "#6B6660",
                }}
              >
                ·
              </span>
              <span style={{ fontSize: 12, color: "#6B6660" }}>
                {solicitud.est_nivel}
              </span>
              <span style={{ fontSize: 11, color: "#6B6660" }}>·</span>
              <span style={{ fontSize: 12, color: "#6B6660" }}>
                {formatDate(solicitud.created_at)}
              </span>
              {/*
                Solo se marca lo registrado a mano: lo normal es que venga del
                formulario, y etiquetar también eso sería ruido.
              */}
              {solicitud.origen === "manual" && (
                <span
                  className="inline-flex items-center px-2 rounded-full"
                  style={{
                    height: 18,
                    background: "#F4F1EB",
                    border: "1px solid #E8E4DD",
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#6B6660",
                  }}
                >
                  Registrada a mano
                </span>
              )}
            </div>
          </div>
        </div>
        <span
          className="inline-flex items-center px-3 rounded-full"
          style={{
            height: 28,
            background: badge.colorBg,
            fontSize: 12,
            fontWeight: 700,
            color: badge.colorFg,
          }}
        >
          {badge.label}
        </span>
      </div>

      {/* Pipeline + cambio de estado */}
      <div className="p-6" style={cardStyle}>
        <SectionTitle>Estado del proceso</SectionTitle>
        <EstadoSelectorClient
          solicitudId={solicitud.id}
          estadoActual={solicitud.estado as EstadoAdmision}
        />
      </div>

      {/* Datos + lateral */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Datos del estudiante + representante (editables) */}
          <div className="p-6" style={cardStyle}>
            <DatosEditableClient
              solicitudId={solicitud.id}
              initial={{
                est_nombres: solicitud.est_nombres ?? "",
                est_apellidos: solicitud.est_apellidos ?? "",
                est_fecha_nac: solicitud.est_fecha_nac ?? null,
                est_nivel: solicitud.est_nivel ?? "",
                est_grado: solicitud.est_grado ?? null,
                est_institucion_origen: solicitud.est_institucion_origen ?? null,
                anio_ingreso: solicitud.anio_ingreso ?? null,
                rep_nombres: solicitud.rep_nombres ?? "",
                rep_apellidos: solicitud.rep_apellidos ?? "",
                rep_relacion: solicitud.rep_relacion ?? null,
                rep_correo: solicitud.rep_correo ?? "",
                rep_telefono: solicitud.rep_telefono ?? "",
                como_enterado: solicitud.como_enterado ?? null,
                comentarios: solicitud.comentarios ?? null,
              }}
              opciones={{
                niveles: opcionesFormulario.niveles,
                relaciones: opcionesFormulario.relaciones,
                comoEnterado: opcionesFormulario.comoEnterado,
                aniosLectivos: aniosLectivosCodigos,
              }}
            />
          </div>

          {/* Notas internas */}
          <div className="p-6" style={cardStyle}>
            <SectionTitle>Notas internas</SectionTitle>
            <NotasClient
              solicitudId={solicitud.id}
              notasIniciales={solicitud.notas_internas}
            />
          </div>
        </div>

        {/* Columna lateral */}
        <div className="flex flex-col gap-6">
          {/* Acciones rápidas */}
          <div className="p-6" style={cardStyle}>
            <SectionTitle>Acciones rápidas</SectionTitle>
            <div className="flex flex-col gap-2">
              <a
                href={`tel:${solicitud.rep_telefono}`}
                className="flex items-center gap-2.5 px-3 rounded-md transition-colors hover:opacity-80"
                style={{
                  height: 38,
                  background: "#F4F1EB",
                  textDecoration: "none",
                }}
              >
                <Phone size={14} color="#1A2B4A" strokeWidth={2} />
                <span style={{ fontSize: 12, fontWeight: 500, color: "#1A2B4A" }}>
                  Llamar al representante
                </span>
              </a>
              <a
                href={`mailto:${solicitud.rep_correo}?subject=Solicitud%20${solicitud.numero}%20—%20Unidad%20Educativa%20Atenas`}
                className="flex items-center gap-2.5 px-3 rounded-md transition-colors hover:opacity-80"
                style={{
                  height: 38,
                  background: "#F4F1EB",
                  textDecoration: "none",
                }}
              >
                <Mail size={14} color="#1A2B4A" strokeWidth={2} />
                <span style={{ fontSize: 12, fontWeight: 500, color: "#1A2B4A" }}>
                  Enviar email
                </span>
              </a>
              <Link
                href={`/admisiones/seguimiento?numero=${encodeURIComponent(solicitud.numero)}`}
                target="_blank"
                className="flex items-center gap-2.5 px-3 rounded-md transition-colors hover:opacity-80"
                style={{
                  height: 38,
                  background: "#F4F1EB",
                  textDecoration: "none",
                }}
              >
                <User size={14} color="#1A2B4A" strokeWidth={2} />
                <span style={{ fontSize: 12, fontWeight: 500, color: "#1A2B4A" }}>
                  Ver seguimiento público
                </span>
              </Link>
            </div>
          </div>

          {/* Checklist documentos */}
          <div className="p-6" style={cardStyle}>
            <SectionTitle>Documentos físicos recibidos</SectionTitle>
            <DocumentosClient
              solicitudId={solicitud.id}
              documentosRecibidos={documentosRecibidos}
              catalogo={catalogoNombres}
            />
          </div>

          {/* Adjuntos para email — subidos manualmente para esta solicitud */}
          <div className="p-6" style={cardStyle}>
            <SectionTitle>Archivos para enviar al postulante</SectionTitle>
            <AdjuntosClient solicitudId={solicitud.id} adjuntos={adjuntos ?? []} />
          </div>

          {/* Archivos del banco vinculados a esta solicitud */}
          <div className="p-6" style={cardStyle}>
            <SectionTitle>Archivos del banco para esta solicitud</SectionTitle>
            <ArchivosBancoSolicitudClient
              solicitudId={solicitud.id}
              archivosBanco={bancoArchivosList}
              vinculadosIds={bancoVinculadosIds}
            />
          </div>

          {/* Historial */}
          <div className="p-6" style={cardStyle}>
            <SectionTitle>Historial de cambios</SectionTitle>
            {!historial || historial.length === 0 ? (
              <p style={{ fontSize: 12, color: "#6B6660", margin: 0 }}>
                Sin cambios registrados.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {historial.map((h) => {
                  const profileData = h.profiles as { full_name?: string } | null;
                  const quien = profileData?.full_name ?? "Sistema";
                  return (
                    <div
                      key={h.id}
                      className="flex flex-col gap-1 pb-3"
                      style={{ borderBottom: "1px solid #F4F1EB" }}
                    >
                      <div className="flex items-center gap-2">
                        {h.estado_anterior && (
                          <>
                            <span
                              style={{
                                fontSize: 11,
                                fontWeight: 600,
                                color: "#6B6660",
                                textDecoration: "line-through",
                              }}
                            >
                              {ESTADO_INFO[h.estado_anterior as EstadoAdmision]?.label ?? h.estado_anterior}
                            </span>
                            <span style={{ fontSize: 11, color: "#A0AABA" }}>→</span>
                          </>
                        )}
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "#1A2B4A",
                          }}
                        >
                          {ESTADO_INFO[h.estado_nuevo as EstadoAdmision]?.label ?? h.estado_nuevo}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span style={{ fontSize: 10, color: "#A0AABA" }}>{quien}</span>
                        <span style={{ fontSize: 10, color: "#A0AABA" }}>
                          {formatDateTime(h.created_at)}
                        </span>
                      </div>
                      {h.nota && (
                        <p
                          style={{
                            fontSize: 11,
                            color: "#6B6660",
                            margin: 0,
                            fontStyle: "italic",
                          }}
                        >
                          &ldquo;{h.nota}&rdquo;
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Zona peligrosa: solo superadmin */}
      {hasRole(user, ROLES.SUPERADMIN) && (
        <div className="flex flex-col gap-3 p-6" style={cardStyle}>
          <SectionTitle>Zona peligrosa</SectionTitle>
          <p style={{ fontSize: 12, color: "#6B6660", margin: 0, lineHeight: 1.5 }}>
            Eliminar la solicitud borra permanentemente sus datos, historial y archivos adjuntos. No se puede recuperar.
          </p>
          <EliminarSolicitudClient solicitudId={solicitud.id} numero={solicitud.numero} />
        </div>
      )}
    </div>
  );
}
