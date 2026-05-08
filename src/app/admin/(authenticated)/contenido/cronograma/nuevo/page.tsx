import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { EventoForm } from "../EventoForm";

export default async function NuevoEventoPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ACADEMICO])) {
    redirect("/admin");
  }

  const supabase = createAdminClient();
  const [periodosRes, tiposRes] = await Promise.all([
    supabase.from("cronograma_periodos").select("id, nombre").order("orden", { ascending: true }),
    supabase.from("cronograma_tipos").select("id, nombre").order("orden", { ascending: true }),
  ]);

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href="/admin/contenido/cronograma"
        className="flex items-center gap-1.5 w-fit transition-opacity hover:opacity-70"
        style={{ fontSize: 13, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver al cronograma
      </Link>

      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Nuevo evento
        </h1>
        <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0" }}>
          Define el evento, asígnalo a un período y a un tipo, y elige las fechas.
        </p>
      </div>

      <EventoForm modo="crear" periodos={periodosRes.data ?? []} tipos={tiposRes.data ?? []} />
    </div>
  );
}
