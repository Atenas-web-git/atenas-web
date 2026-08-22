import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { EventoForm } from "../EventoForm";
import { EliminarEventoClient } from "./EliminarEventoClient";

export default async function EditarEventoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const eventoId = Number(id);

  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ACADEMICO])) {
    redirect("/admin");
  }

  const supabase = createAdminClient();
  const [eventoRes, periodosRes, tiposRes] = await Promise.all([
    supabase
      .from("cronograma_eventos")
      .select("id, titulo, descripcion, periodo_id, tipo_id, fecha_inicio, fecha_fin, publicado, updated_at")
      .eq("id", eventoId)
      .maybeSingle(),
    supabase.from("cronograma_periodos").select("id, nombre").order("orden", { ascending: true }),
    supabase.from("cronograma_tipos").select("id, nombre").order("orden", { ascending: true }),
  ]);

  if (!eventoRes.data) notFound();
  const ev = eventoRes.data;

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href="/admin/contenido/cronograma"
        className="flex items-center gap-1.5 w-fit transition-opacity hover:opacity-70"
        style={{ fontSize: 14, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver al cronograma
      </Link>

      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          {ev.titulo}
        </h1>
        <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0" }}>
          Última edición: {new Date(ev.updated_at).toLocaleString("es-EC")}
        </p>
      </div>

      <EventoForm
        modo="editar"
        periodos={periodosRes.data ?? []}
        tipos={tiposRes.data ?? []}
        initial={{
          id: ev.id,
          titulo: ev.titulo,
          descripcion: ev.descripcion ?? "",
          periodo_id: ev.periodo_id,
          tipo_id: ev.tipo_id,
          fecha_inicio: ev.fecha_inicio,
          fecha_fin: ev.fecha_fin ?? "",
          publicado: ev.publicado,
        }}
      />

      <div
        className="flex flex-col gap-3 p-5"
        style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 12 }}
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
          Eliminar el evento lo borra permanentemente del cronograma.
        </p>
        <EliminarEventoClient id={ev.id} titulo={ev.titulo} />
      </div>
    </div>
  );
}
