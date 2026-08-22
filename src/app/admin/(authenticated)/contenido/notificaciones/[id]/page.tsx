import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { TIPO_INFO } from "../constants";
import { EditorNotificacion } from "./EditorNotificacion";
import { EliminarNotificacionClient } from "./EliminarNotificacionClient";

export default async function EditarNotificacionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_COMM])) redirect("/admin");

  const supabase = createAdminClient();
  const { data: notif } = await supabase
    .from("notificaciones")
    .select(
      "id, titulo, tipo, modo_visual, contenido_html, imagen_url, cta_texto, cta_url, fecha_inicio, fecha_fin, prioridad, activa, updated_at"
    )
    .eq("id", id)
    .maybeSingle();

  if (!notif) notFound();

  const tipoInfo = TIPO_INFO[notif.tipo as keyof typeof TIPO_INFO];

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href="/admin/contenido/notificaciones"
        className="flex items-center gap-1.5 w-fit transition-opacity hover:opacity-70"
        style={{ fontSize: 14, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver al listado
      </Link>

      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
            {notif.titulo}
          </h1>
          <span
            className="inline-flex items-center px-2 rounded-full"
            style={{
              height: 20,
              background: tipoInfo?.bg ?? "#F4F1EB",
              fontSize: 11,
              fontWeight: 700,
              color: tipoInfo?.color ?? "#1A2B4A",
              letterSpacing: 0.3,
            }}
          >
            {tipoInfo?.label ?? notif.tipo}
          </span>
        </div>
        <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0", lineHeight: 1.5 }}>
          {tipoInfo?.descripcion}
        </p>
      </div>

      <EditorNotificacion
        id={notif.id}
        initialTitulo={notif.titulo}
        initialTipo={notif.tipo}
        initialModoVisual={notif.modo_visual ?? "plantilla_imagen_texto"}
        initialContenidoHtml={notif.contenido_html ?? ""}
        initialImagenUrl={notif.imagen_url ?? ""}
        initialCtaTexto={notif.cta_texto ?? ""}
        initialCtaUrl={notif.cta_url ?? ""}
        initialFechaInicio={notif.fecha_inicio}
        initialFechaFin={notif.fecha_fin}
        initialPrioridad={notif.prioridad}
        initialActiva={notif.activa}
      />

      <div
        className="flex flex-col gap-3 p-5"
        style={{
          background: "#FFFFFF",
          border: "1px solid #E8E4DD",
          borderRadius: 12,
        }}
      >
        <h2
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#6B6660",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            margin: 0,
          }}
        >
          Zona peligrosa
        </h2>
        <p style={{ fontSize: 13, color: "#6B6660", margin: 0, lineHeight: 1.5 }}>
          Eliminar la notificación es irreversible. Si solo quieres ocultarla temporalmente, desactívala arriba.
        </p>
        <EliminarNotificacionClient id={notif.id} titulo={notif.titulo} />
      </div>
    </div>
  );
}
