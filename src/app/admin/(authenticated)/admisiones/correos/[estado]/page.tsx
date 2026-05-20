import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { ROLES, hasAnyRole } from "@/lib/auth/types";
import {
  getConfiguracion,
  mergeMarca,
  mergeContacto,
  mergeCorreosDiseno,
  mergeNavbar,
  type Marca,
  type Contacto,
  type CorreosDiseno,
  type NavbarConfig,
} from "@/lib/cms/getConfiguracion";
import { EditorClient } from "./EditorClient";

const ESTADOS_INFO: Record<string, { label: string; description: string }> = {
  revisando: { label: "En revisión", description: "Cuando empiezas a revisar la solicitud" },
  entrevista_agendada: { label: "Entrevista agendada", description: "Cuando agendas la entrevista personal" },
  lista_espera: { label: "Lista de espera", description: "Cuando los cupos están llenos" },
  aceptado: { label: "Aceptada", description: "Cuando aceptas al postulante" },
  matriculado: { label: "Matriculada", description: "Cuando se completa la matrícula" },
  rechazado: { label: "Rechazada", description: "Cuando rechazas la solicitud" },
};

export default async function EditarPlantillaPage({
  params,
}: {
  params: Promise<{ estado: string }>;
}) {
  const { estado } = await params;

  if (!ESTADOS_INFO[estado]) notFound();

  const user = await getCurrentUser();
  if (!user) return null;
  if (!hasAnyRole(user, [ROLES.SUPERADMIN, ROLES.EDITOR_ADMISIONES])) redirect("/admin");

  const supabase = createAdminClient();
  const [
    { data: plantilla },
    { data: bancoTodos },
    { data: vinculados },
    marcaRaw,
    contactoRaw,
    disenoRaw,
  ] = await Promise.all([
    supabase
      .from("plantillas_correo_admision")
      .select(
        "estado, titulo, asunto, cuerpo_html, activo, acento, eyebrow, hero_image_url, cta_label, cta_url, helper_text"
      )
      .eq("estado", estado)
      .maybeSingle(),
    supabase
      .from("admisiones_archivos_banco")
      .select("id, nombre, descripcion, tipo_mime, tamano_bytes, categoria, archivo_url, activo")
      .eq("activo", true)
      .order("categoria", { ascending: true, nullsFirst: false })
      .order("orden", { ascending: true })
      .order("nombre", { ascending: true }),
    supabase
      .from("plantillas_correo_archivos")
      .select("archivo_id")
      .eq("estado", estado),
    getConfiguracion<Partial<Marca>>("marca"),
    getConfiguracion<Partial<Contacto>>("contacto"),
    getConfiguracion<Partial<CorreosDiseno>>("correos_diseno"),
  ]);
  const navbarRaw = await getConfiguracion<Partial<NavbarConfig>>("navbar");

  const archivosBanco = bancoTodos ?? [];
  const archivosVinculadosIds = new Set((vinculados ?? []).map((v) => v.archivo_id));
  const marca = mergeMarca(marcaRaw);
  const contacto = mergeContacto(contactoRaw);
  const diseno = mergeCorreosDiseno(disenoRaw);
  const navbar = mergeNavbar(navbarRaw);

  const info = ESTADOS_INFO[estado];

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href="/admin/admisiones/correos"
        className="flex items-center gap-1.5 w-fit transition-opacity hover:opacity-70"
        style={{ fontSize: 13, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver a plantillas
      </Link>

      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Plantilla — {info.label}
        </h1>
        <p style={{ fontSize: 13, color: "#6B6660", margin: "4px 0 0" }}>
          {info.description}
        </p>
      </div>

      <EditorClient
        estado={estado}
        estadoLabel={info.label}
        initialTitulo={plantilla?.titulo ?? info.label}
        initialAsunto={plantilla?.asunto ?? ""}
        initialHtml={plantilla?.cuerpo_html ?? "<p>Hola <strong>{{rep_nombres}}</strong>, tu solicitud N° {{numero}} ha cambiado de estado.</p>"}
        initialActivo={plantilla?.activo ?? true}
        initialAcento={(plantilla?.acento as "navy" | "red" | "gold" | undefined) ?? "navy"}
        initialEyebrow={plantilla?.eyebrow ?? ""}
        initialHeroImageUrl={plantilla?.hero_image_url ?? ""}
        initialCtaLabel={plantilla?.cta_label ?? ""}
        initialCtaUrl={plantilla?.cta_url ?? ""}
        initialHelperText={plantilla?.helper_text ?? ""}
        archivosBanco={archivosBanco}
        archivosVinculadosIds={Array.from(archivosVinculadosIds)}
        marca={marca}
        contacto={contacto}
        diseno={diseno}
        navbar={navbar}
      />
    </div>
  );
}
