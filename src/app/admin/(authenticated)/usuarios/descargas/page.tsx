import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasRole } from "@/lib/auth/types";

/**
 * Quién se ha descargado datos personales y cuándo.
 *
 * Un registro que nadie puede leer no sirve de nada: obligaría a abrir la base
 * cada vez que hubiera una sospecha, y por eso no se miraría nunca.
 *
 * SOLO SUPERADMINISTRADOR. Esta tabla dice qué empleado del colegio miró datos
 * de menores y cuándo — es ella misma un dato sensible, y no tiene por qué
 * verla quien aparece en ella.
 */

export const dynamic = "force-dynamic";

/** Cuántas se muestran. Con más, hay que mirar la base. */
const LIMITE = 200;

type Fila = {
  id: string;
  usuario_nombre: string | null;
  recurso: string;
  filtros: Record<string, string>;
  filas: number;
  created_at: string;
};

export default async function DescargasPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasRole(user, ROLES.SUPERADMIN)) redirect("/admin");

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("registro_descargas")
    .select("id, usuario_nombre, recurso, filtros, filas, created_at")
    .order("created_at", { ascending: false })
    .limit(LIMITE);

  const registros = (data ?? []) as Fila[];

  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <Link
          href="/admin/usuarios"
          className="inline-flex items-center gap-1.5"
          style={{ fontSize: 14, color: "#6B6660", textDecoration: "none" }}
        >
          <ArrowLeft size={15} /> Volver a Usuarios
        </Link>
      </div>

      <div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Descargas de datos personales
        </h2>
        <p style={{ fontSize: 14, color: "#6B6660", margin: "6px 0 0", lineHeight: 1.6, maxWidth: 720 }}>
          Cada vez que alguien descarga el padrón de admisiones o las respuestas
          de un formulario, queda registrado aquí: quién, cuándo, con qué filtro
          y cuántas filas se llevó. <strong>No se guarda el contenido</strong>,
          solo el hecho de la descarga.
        </p>
      </div>

      {/*
        Si la tabla no existe todavía, se dice qué falta en vez de enseñar una
        lista vacía — que se leería como «nadie ha descargado nada», que es
        justo lo contrario de lo que pasa.
      */}
      {error && (
        <div
          role="alert"
          style={{
            background: "#FEE2E2",
            border: "1px solid #FCA5A5",
            borderRadius: 8,
            padding: "12px 16px",
            fontSize: 14,
            color: "#991B1B",
          }}
        >
          <strong>No se pudo leer el registro.</strong> Si acaba de desplegarse
          esta pantalla, falta aplicar la migración 088 en Supabase. Mientras
          tanto, las descargas <strong>no se están registrando</strong>.
        </div>
      )}

      {!error && registros.length === 0 && (
        <div
          className="flex flex-col items-center justify-center gap-2 py-16 px-6"
          style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
        >
          <Download size={22} color="#8A857E" />
          <p style={{ fontSize: 14, color: "#6B6660", margin: 0, textAlign: "center" }}>
            Todavía no se ha descargado ningún archivo con datos personales.
          </p>
        </div>
      )}

      {registros.length > 0 && (
        <div style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#FAFAF8" }}>
                  {["Cuándo", "Quién", "Qué descargó", "Filtro", "Filas"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: 12,
                        fontWeight: 700,
                        letterSpacing: 0.4,
                        textTransform: "uppercase",
                        color: "#6B6660",
                        borderBottom: "1px solid #E8E4DD",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {registros.map((r) => {
                  const filtros = Object.entries(r.filtros ?? {});
                  return (
                    <tr key={r.id} style={{ borderBottom: "1px solid #F4F1EB" }}>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "#6B6660", whiteSpace: "nowrap" }}>
                        {new Date(r.created_at).toLocaleString("es-EC", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 600, color: "#1A2B4A" }}>
                        {r.usuario_nombre ?? "—"}
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "#1A2B4A" }}>
                        {r.recurso === "admisiones"
                          ? "Padrón de admisiones"
                          : r.recurso.replace(/^formulario:/, "Respuestas de ")}
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 13, color: "#6B6660" }}>
                        {/*
                          Sin filtro se dice explícitamente. «—» se leería como
                          «no sé», y aquí la diferencia entre filtrar y no
                          filtrar es la diferencia entre mirar una familia y
                          llevarse el padrón entero.
                        */}
                        {filtros.length === 0 ? (
                          <span style={{ color: "#991B1B", fontWeight: 600 }}>
                            sin filtro — todo
                          </span>
                        ) : (
                          filtros.map(([k, v]) => `${k}: ${v}`).join(" · ")
                        )}
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 14, fontWeight: 600, color: "#1A2B4A" }}>
                        {r.filas}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {registros.length >= LIMITE && (
        <p style={{ fontSize: 13, color: "#6B6660", margin: 0 }}>
          Se muestran las {LIMITE} descargas más recientes.
        </p>
      )}
    </div>
  );
}
