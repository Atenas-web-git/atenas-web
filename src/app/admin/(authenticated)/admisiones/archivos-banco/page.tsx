import { redirect } from "next/navigation";
import { FileText, FileImage, File as FileIcon } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import { AdmisionesSubNav } from "../SubNav";
import { ArchivosBancoClient } from "./ArchivosBancoClient";

export const dynamic = "force-dynamic";

export type ArchivoBancoRow = {
  id: string;
  nombre: string;
  descripcion: string | null;
  storage_path: string;
  archivo_url: string;
  tipo_mime: string | null;
  tamano_bytes: number | null;
  categoria: string | null;
  activo: boolean;
  orden: number;
  created_at: string;
};

export default async function ArchivosBancoPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ADMISIONES])) {
    redirect("/admin");
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("admisiones_archivos_banco")
    .select("*")
    .order("orden", { ascending: true })
    .order("created_at", { ascending: false });

  const archivos = (data ?? []) as ArchivoBancoRow[];
  const totalSize = archivos.reduce((sum, a) => sum + (a.tamano_bytes ?? 0), 0);

  return (
    <div className="flex flex-col gap-6 p-8">
      <AdmisionesSubNav />

      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
            Banco de archivos de Admisiones
          </h1>
          <p style={{ fontSize: 14, color: "#6B6660", margin: "4px 0 0", maxWidth: 720 }}>
            Sube acá los archivos que se repiten entre postulantes (folletos, autorizaciones, instructivos, listas
            de útiles, etc.). Después podrás <strong>asociarlos a plantillas de correo</strong> (se adjuntan
            automáticamente cuando una solicitud entra a ese estado) o a <strong>solicitudes individuales</strong>
            (caso de un documento personalizado). Máx 10 MB por archivo.
          </p>
        </div>
        <Stats count={archivos.length} totalBytes={totalSize} />
      </div>

      <ArchivosBancoClient archivos={archivos} />
    </div>
  );
}

function Stats({ count, totalBytes }: { count: number; totalBytes: number }) {
  return (
    <div
      className="flex items-center gap-4 px-4 py-2"
      style={{ background: "#FFFFFF", border: "1px solid #E8E4DD", borderRadius: 8 }}
    >
      <div className="flex flex-col">
        <span style={{ fontSize: 11, fontWeight: 600, color: "#6B6660", letterSpacing: 1, textTransform: "uppercase" }}>
          Archivos
        </span>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#1A2B4A" }}>{count}</span>
      </div>
      <div style={{ width: 1, height: 28, background: "#E8E4DD" }} />
      <div className="flex flex-col">
        <span style={{ fontSize: 11, fontWeight: 600, color: "#6B6660", letterSpacing: 1, textTransform: "uppercase" }}>
          Tamaño total
        </span>
        <span style={{ fontSize: 18, fontWeight: 700, color: "#1A2B4A" }}>{formatBytes(totalBytes)}</span>
      </div>
    </div>
  );
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileIcon(mime: string | null) {
  if (!mime) return FileIcon;
  if (mime.startsWith("image/")) return FileImage;
  if (mime === "application/pdf") return FileText;
  return FileIcon;
}
