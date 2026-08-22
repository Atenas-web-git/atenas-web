import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { GaleriaClient, type ImagenRow } from "./GaleriaClient";

export const dynamic = "force-dynamic";

export default async function GaleriaPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_COMM, ROLES.EDITOR_ACADEMICO])) {
    redirect("/admin");
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("imagenes")
    .select("id, url, storage_path, alt_text, tamano_bytes, mime_type, uploaded_at")
    .order("uploaded_at", { ascending: false })
    .limit(500);

  const imagenes: ImagenRow[] = (data ?? []).map((d) => ({
    id: d.id as string,
    url: (d.url as string) ?? "",
    storage_path: (d.storage_path as string) ?? "",
    alt_text: (d.alt_text as string | null) ?? null,
    tamano_bytes: (d.tamano_bytes as number | null) ?? null,
    mime_type: (d.mime_type as string | null) ?? null,
    uploaded_at: (d.uploaded_at as string | null) ?? null,
  }));

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href="/admin/contenido"
        className="flex items-center gap-1.5 w-fit transition-opacity hover:opacity-70"
        style={{ fontSize: 14, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver a Contenido
      </Link>

      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Galería del catálogo
        </h1>
        <p style={{ fontSize: 14, color: "#6B6660", margin: "4px 0 0" }}>
          {imagenes.length} imagen{imagenes.length === 1 ? "" : "es"} en el bucket{" "}
          <code
            style={{
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
              fontSize: 13,
            }}
          >
            contenido
          </code>
          . Reutiliza imágenes ya subidas para mantener consistencia y ahorrar espacio.
        </p>
      </div>

      <GaleriaClient imagenes={imagenes} />
    </div>
  );
}
