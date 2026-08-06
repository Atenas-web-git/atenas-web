import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Download, Inbox } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { getFormularioPorId } from "@/lib/formularios/getFormulario";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  ESTADOS_RESPUESTA,
  ESTADO_LABELS,
  type ArchivoRespuesta,
  type DatosRespuesta,
  type EstadoRespuesta,
} from "@/lib/formularios/tipos";
import { FichaRespuesta } from "./FichaRespuesta";

export const dynamic = "force-dynamic";

type Respuesta = {
  id: string;
  numero: number;
  datos: DatosRespuesta;
  archivos: ArchivoRespuesta[];
  estado: EstadoRespuesta;
  nota_interna: string | null;
  correo_enviado: boolean;
  created_at: string;
};

export default async function RespuestasPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ estado?: string }>;
}) {
  const { id } = await params;
  const { estado: filtroEstado } = await searchParams;

  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_COMM])) {
    redirect("/admin");
  }

  const formulario = await getFormularioPorId(id);
  if (!formulario) notFound();

  const supabase = createAdminClient();
  let consulta = supabase
    .from("formulario_respuestas")
    .select("id, numero, datos, archivos, estado, nota_interna, correo_enviado, created_at")
    .eq("formulario_id", id)
    .order("numero", { ascending: false });

  const estadoValido =
    filtroEstado && ESTADOS_RESPUESTA.includes(filtroEstado as EstadoRespuesta)
      ? (filtroEstado as EstadoRespuesta)
      : null;

  if (estadoValido) consulta = consulta.eq("estado", estadoValido);

  const { data } = await consulta;
  const respuestas = (data ?? []) as unknown as Respuesta[];

  const sinAvisar = respuestas.filter((r) => !r.correo_enviado).length;

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href={`/admin/contenido/formularios/${id}`}
            className="inline-flex items-center gap-1"
            style={{ fontSize: 12, color: "#6B6660" }}
          >
            <ArrowLeft size={13} /> {formulario.nombre}
          </Link>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: "8px 0 0" }}>
            Respuestas
          </h1>
        </div>

        {respuestas.length > 0 && (
          <a
            href={`/admin/contenido/formularios/${id}/respuestas/exportar`}
            className="inline-flex shrink-0 items-center gap-1.5 px-3 py-2"
            style={{
              border: "1px solid #E8E4DD",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              color: "#1A2B4A",
            }}
          >
            <Download size={14} /> Descargar en Excel
          </a>
        )}
      </div>

      {sinAvisar > 0 && (
        <div
          className="px-4 py-3"
          style={{ background: "rgba(158,25,21,0.06)", borderRadius: 8 }}
        >
          <p style={{ fontSize: 12, color: "#1A2B4A", margin: 0, lineHeight: 1.5 }}>
            <strong>
              {sinAvisar}{" "}
              {sinAvisar === 1 ? "respuesta llegó" : "respuestas llegaron"} sin
              que saliera el correo de aviso.
            </strong>{" "}
            Los datos están completos aquí — solo falló la notificación. Si se
            repite, revisa Configuración › Correos.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <FiltroEstado id={id} valor={null} activo={!estadoValido} label="Todas" />
        {ESTADOS_RESPUESTA.map((e) => (
          <FiltroEstado
            key={e}
            id={id}
            valor={e}
            activo={estadoValido === e}
            label={ESTADO_LABELS[e]}
          />
        ))}
      </div>

      {respuestas.length === 0 ? (
        <div
          className="flex flex-col items-center gap-3 px-6 py-14 text-center"
          style={{ background: "#FFFFFF", border: "1px dashed #E8E4DD", borderRadius: 12 }}
        >
          <Inbox size={26} color="#9A948C" />
          <p style={{ fontSize: 14, fontWeight: 600, color: "#1A2B4A", margin: 0 }}>
            {estadoValido ? "Nada en este estado" : "Todavía no hay respuestas"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {respuestas.map((r) => (
            <FichaRespuesta
              key={r.id}
              respuesta={r}
              campos={formulario.campos}
              formularioId={id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FiltroEstado({
  id,
  valor,
  activo,
  label,
}: {
  id: string;
  valor: EstadoRespuesta | null;
  activo: boolean;
  label: string;
}) {
  return (
    <Link
      href={
        valor
          ? `/admin/contenido/formularios/${id}/respuestas?estado=${valor}`
          : `/admin/contenido/formularios/${id}/respuestas`
      }
      className="px-3 py-1.5"
      style={{
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        border: "1px solid #E8E4DD",
        background: activo ? "#1A2B4A" : "#FFFFFF",
        color: activo ? "#FFFFFF" : "#1A2B4A",
      }}
    >
      {label}
    </Link>
  );
}
