import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { CrearVacanteForm } from "./CrearVacanteForm";

export default async function NuevaVacantePage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_COMM])) {
    redirect("/admin");
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <Link
          href="/admin/contenido/vacantes"
          className="inline-flex items-center gap-1"
          style={{ fontSize: 12, color: "#6B6660" }}
        >
          <ArrowLeft size={13} /> Vacantes
        </Link>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: "8px 0 0" }}>
          Publicar vacante
        </h1>
        <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0", maxWidth: 560 }}>
          Empieza por el título. Se crea como borrador: podrás redactar el
          perfil con calma y publicarla cuando esté lista.
        </p>
      </div>

      <CrearVacanteForm />
    </div>
  );
}
