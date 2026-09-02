import type { Metadata } from "next";
import Link from "next/link";
import { LogoSVG } from "@/components/shared/LogoSVG";
import { FormularioMultiStep } from "@/components/admisiones/FormularioMultiStep";
import { createClient } from "@/lib/supabase/server";
import {
  getConfiguracion,
  mergeAdmisionesTextos,
  mergeContacto,
  mergeMarca,
  type AdmisionesTextosConfig,
  type Contacto,
  type Marca,
} from "@/lib/cms/getConfiguracion";
import type { ContactoAviso } from "@/components/admisiones/FormularioMultiStep";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Solicitud de Admisión — Unidad Educativa Atenas",
  description:
    "Inicia el proceso de admisión para tu hijo/a en la Unidad Educativa Atenas. Completa el formulario en 4 sencillos pasos.",
  robots: { index: false, follow: false },
};

async function loadAniosLectivos(): Promise<string[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("anos_lectivos")
      .select("codigo")
      .eq("activo", true)
      .order("codigo", { ascending: true });
    return (data ?? []).map((a) => a.codigo);
  } catch {
    return [];
  }
}

export default async function FormularioPage({
  searchParams,
}: {
  searchParams: Promise<{ nivel?: string }>;
}) {
  const { nivel } = await searchParams;
  const [anios, rawTextos, rawContacto, rawMarca] = await Promise.all([
    loadAniosLectivos(),
    getConfiguracion<Partial<AdmisionesTextosConfig>>("admisiones_textos"),
    getConfiguracion<Partial<Contacto>>("contacto"),
    getConfiguracion<Partial<Marca>>("marca"),
  ]);
  const textos = mergeAdmisionesTextos(rawTextos).formulario;

  /*
    El aviso de trámite presencial llevaba la dirección, el teléfono y el correo
    escritos a mano en el componente. Se toman de donde ya son editables:
    Configuración › Marca para la dirección, › Datos de contacto para el resto.

    Se prefiere el teléfono y el correo etiquetados «Admisiones» —es el aviso de
    admisiones— y si no existen se cae al primero de la lista, que es mejor que
    no enseñar ninguno.
  */
  const contacto = mergeContacto(rawContacto);
  const marca = mergeMarca(rawMarca);
  const email =
    contacto.emails.find((x) => /admisi/i.test(x.label)) ?? contacto.emails[0];

  const contactoAviso: ContactoAviso = {
    direccion: marca.institucion.direccion,
    correo: email?.email ?? "",
    horario: contacto.horario,
    // La lista entera: cuál se muestra lo decide el colegio desde el panel,
    // guardando la etiqueta del teléfono.
    telefonos: contacto.telefonos.map((t) => ({
      label: t.label,
      numero: t.numero,
      extension: t.extension ?? "",
    })),
  };

  return (
    <>
      <header
        className="h-[64px] bg-navy flex items-center justify-between
          px-[56px] max-sm:px-[20px] sticky top-0 z-50"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}
      >
        <Link href="/" aria-label="Inicio">
          <LogoSVG variant="white" className="w-[120px]" />
        </Link>

        <span
          className="text-white/70 text-[15px] font-semibold hidden sm:block"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {textos.headerTitle}
        </span>

        <Link
          href="/admisiones"
          className="text-white/60 text-[13px] hover:text-white/90 transition-colors"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {textos.backLabel}
        </Link>
      </header>

      <main>
        <FormularioMultiStep
          nivelInicial={nivel ?? ""}
          aniosLectivos={anios}
          textos={textos}
          contactoAviso={contactoAviso}
        />
      </main>
    </>
  );
}
