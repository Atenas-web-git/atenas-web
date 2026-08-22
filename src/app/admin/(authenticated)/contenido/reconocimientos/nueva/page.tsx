import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { CategoriaForm } from "../CategoriaForm";

export default async function NuevaCategoriaPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_COMM, ROLES.EDITOR_ACADEMICO])) {
    redirect("/admin");
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href="/admin/contenido/reconocimientos"
        className="flex items-center gap-1.5 w-fit transition-opacity hover:opacity-70"
        style={{ fontSize: 14, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver a Reconocimientos
      </Link>

      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Nueva categoría de reconocimientos
        </h1>
        <p style={{ fontSize: 14, color: "#6B6660", margin: "4px 0 0", maxWidth: 720 }}>
          Crea una nueva categoría (ej. Académicos, Deportivos, Profesionales). Al guardarse
          se abrirá la vista de detalle donde podrás añadir sus subcategorías, logros y
          galería de fotos.
        </p>
      </div>

      <CategoriaForm />
    </div>
  );
}
