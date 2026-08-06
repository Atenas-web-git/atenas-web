import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { CrearFormularioForm } from "./CrearFormularioForm";

export default async function NuevoFormularioPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_COMM])) {
    redirect("/admin");
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <Link
          href="/admin/contenido/formularios"
          className="inline-flex items-center gap-1"
          style={{ fontSize: 12, color: "#6B6660" }}
        >
          <ArrowLeft size={13} /> Formularios
        </Link>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: "8px 0 0" }}>
          Crear formulario
        </h1>
        <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0", maxWidth: 560 }}>
          Empieza con el nombre. En el paso siguiente eliges las preguntas y a
          quién le llegan las respuestas.
        </p>
      </div>

      <CrearFormularioForm />
    </div>
  );
}
