import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";
import { plantillasVisibles } from "@/lib/auth/areas";
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
import {
  TIPOS_PLANTILLA_FORMULARIO,
  TIPOS_PLANTILLA_INFO,
  type TipoPlantillaFormulario,
} from "../constants";
import { EditorClient } from "./EditorClient";

export const dynamic = "force-dynamic";

export default async function EditarPlantillaFormularioPage({
  params,
}: {
  params: Promise<{ tipo: string }>;
}) {
  const { tipo: tipoRaw } = await params;

  if (!TIPOS_PLANTILLA_FORMULARIO.includes(tipoRaw as TipoPlantillaFormulario)) {
    notFound();
  }
  const tipo = tipoRaw as TipoPlantillaFormulario;
  const info = TIPOS_PLANTILLA_INFO[tipo];

  const user = await getCurrentUser();
  if (!user) return null;
  const visibles = plantillasVisibles(user);
  if (visibles !== null && !visibles.includes(tipo)) {
    redirect("/admin");
  }

  const supabase = createAdminClient();
  const [{ data: plantilla }, marcaRaw, contactoRaw, disenoRaw, navbarRaw] =
    await Promise.all([
      supabase
        .from("plantillas_correo_formularios")
        .select(
          "tipo, titulo, asunto, cuerpo_html, activo, acento, eyebrow, hero_image_url, cta_label, cta_url, helper_text"
        )
        .eq("tipo", tipo)
        .maybeSingle(),
      getConfiguracion<Partial<Marca>>("marca"),
      getConfiguracion<Partial<Contacto>>("contacto"),
      getConfiguracion<Partial<CorreosDiseno>>("correos_diseno"),
      getConfiguracion<Partial<NavbarConfig>>("navbar"),
    ]);
  const marca = mergeMarca(marcaRaw);
  const contacto = mergeContacto(contactoRaw);
  const diseno = mergeCorreosDiseno(disenoRaw);
  const navbar = mergeNavbar(navbarRaw);

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href="/admin/contenido/plantillas-formularios"
        className="flex items-center gap-1.5 w-fit transition-opacity hover:opacity-70"
        style={{ fontSize: 14, color: "#6B6660", textDecoration: "none" }}
      >
        <ArrowLeft size={14} strokeWidth={2.5} />
        Volver a plantillas
      </Link>

      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A2B4A", margin: 0 }}>
          Plantilla — {info.label}
        </h1>
        <p style={{ fontSize: 14, color: "#6B6660", margin: "4px 0 0" }}>
          {info.description}
        </p>
      </div>

      <EditorClient
        tipo={tipo}
        tipoLabel={info.label}
        initialTitulo={plantilla?.titulo ?? info.label}
        initialAsunto={plantilla?.asunto ?? ""}
        initialHtml={
          plantilla?.cuerpo_html ??
          "<p>Hola, gracias por contactarte con nosotros.</p>"
        }
        initialActivo={plantilla?.activo ?? true}
        initialAcento={(plantilla?.acento as "navy" | "red" | "gold" | undefined) ?? "navy"}
        initialEyebrow={plantilla?.eyebrow ?? ""}
        initialHeroImageUrl={plantilla?.hero_image_url ?? ""}
        initialCtaLabel={plantilla?.cta_label ?? ""}
        initialCtaUrl={plantilla?.cta_url ?? ""}
        initialHelperText={plantilla?.helper_text ?? ""}
        variables={info.variables}
        sample={info.sample}
        marca={marca}
        contacto={contacto}
        diseno={diseno}
        navbar={navbar}
      />
    </div>
  );
}
