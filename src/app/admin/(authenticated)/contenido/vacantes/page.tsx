import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertTriangle, ArrowLeft, BriefcaseBusiness, Inbox, Plus } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { puedeVerVacantes } from "@/lib/auth/areas";
import {
  CATEGORIA_VACANTE_INFO,
  listarVacantes,
  venciPorFecha,
} from "@/lib/vacantes/getVacantes";

export const dynamic = "force-dynamic";

export default async function VacantesPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!puedeVerVacantes(user)) {
    redirect("/admin");
  }

  const vacantes = await listarVacantes();

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
          Vacantes
        </h1>
        <p style={{ fontSize: 14, color: "#6B6660", margin: "4px 0 0", maxWidth: 640 }}>
          Las ofertas de empleo que se publican en «Trabaja con nosotros». Cada
          vacante tiene su propia página y su formulario de postulación, así que
          las respuestas de cada una llegan por separado.
        </p>
      </div>

      <div>
        <Link
          href="/admin/contenido/vacantes/nueva"
          className="inline-flex items-center gap-2 px-4 py-2"
          style={{
            background: "#1A2B4A",
            color: "#FFFFFF",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <Plus size={15} /> Publicar vacante
        </Link>
      </div>

      {vacantes.length === 0 ? (
        <div
          className="flex flex-col items-center gap-3 px-6 py-14 text-center"
          style={{ background: "#FFFFFF", border: "1px dashed #E8E4DD", borderRadius: 12 }}
        >
          <BriefcaseBusiness size={26} color="#9A948C" />
          <p style={{ fontSize: 14, fontWeight: 600, color: "#1A2B4A", margin: 0 }}>
            Todavía no hay vacantes
          </p>
          <p style={{ fontSize: 14, color: "#6B6660", margin: 0, maxWidth: 420 }}>
            Al publicar la primera, «Trabaja con nosotros» pasa a mostrar el
            listado de ofertas.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {vacantes.map((v) => {
            const vencida = venciPorFecha(v);
            return (
              <div
                key={v.id}
                className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
                style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span style={{ fontSize: 15, fontWeight: 700, color: "#1A2B4A" }}>
                      {v.titulo}
                    </span>
                    <Etiqueta texto={CATEGORIA_VACANTE_INFO[v.categoria].label} />
                    {!v.activa && <Etiqueta texto="Borrador" />}
                    {v.activa && vencida && (
                      <span
                        className="inline-flex items-center gap-1"
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
                        <AlertTriangle size={10} /> Ya cerró
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0" }}>
                    /trabaja-con-nosotros/{v.slug}
                    {v.cierra_en && ` · cierra el ${v.cierra_en}`}
                    {!v.formulario_id && " · sin formulario"}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {v.formulario_id && (
                    <Link
                      href={`/admin/contenido/formularios/${v.formulario_id}/respuestas`}
                      className="inline-flex items-center gap-1.5 px-3 py-2"
                      style={{
                        border: "1px solid #E8E4DD",
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#1A2B4A",
                      }}
                    >
                      <Inbox size={14} /> Postulaciones
                    </Link>
                  )}
                  <Link
                    href={`/admin/contenido/vacantes/${v.id}`}
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
            );
          })}
        </div>
      )}
    </div>
  );
}

function Etiqueta({ texto }: { texto: string }) {
  return (
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
      {texto}
    </span>
  );
}
