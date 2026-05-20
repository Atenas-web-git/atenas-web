import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavAdmisiones } from "@/components/admisiones/NavAdmisiones";
import { SeccionAdmisionDetalle } from "@/components/admisiones/SeccionAdmisionDetalle";
import { PasosAdmision } from "@/components/admisiones/PasosAdmision";
import { CTADescargas } from "@/components/cms/CTADescargas";
import { CTAIniciarSolicitud } from "@/components/admisiones/CTAIniciarSolicitud";
import { FormularioAdmision } from "@/components/admisiones/FormularioAdmision";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getPagina } from "@/lib/cms/getPagina";
import type { ContenidoPlantillaO } from "@/app/admin/(authenticated)/contenido/plantillas";

export const revalidate = 60;

const SLUG = "admisiones/egb-elemental-media";
const NIVEL_LABEL_FALLBACK = "EGB Elemental y Media";

const FALLBACK_META = {
  title: "Admisión EGB Elemental y Media — Unidad Educativa Atenas",
  description:
    "Requisitos y proceso de admisión para EGB Elemental y Media (1ro a 7mo grado) en la Unidad Educativa Atenas, Ambato.",
};

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina(SLUG);
  return {
    title: pagina?.meta_title ?? FALLBACK_META.title,
    description: pagina?.meta_description ?? FALLBACK_META.description,
  };
}

export default async function AdmisionEGBEMPage() {
  const pagina = await getPagina(SLUG);
  const cfg = (pagina?.contenido ?? null) as ContenidoPlantillaO | null;
  const nivelLabel = cfg?.nivelLabel ?? NIVEL_LABEL_FALLBACK;

  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge={cfg?.hero?.badge ?? "ADMISIONES"}
          title={cfg?.hero?.title ?? "Admisión EGB Elemental y Media"}
          subtitle={cfg?.hero?.subtitle ?? "1ro a 7mo grado — Formación sólida en valores, bilinguismo y pensamiento crítico desde la infancia."}
          ghostText={cfg?.hero?.ghostText ?? "EGB"}
          bgImageSrc={cfg?.hero?.bgImage || undefined}
        />
        <NavAdmisiones current="egb-elemental-media" />
        <SeccionAdmisionDetalle
          badge={cfg?.detalle?.badge ?? "EGB Elemental y Media — 1ro a 7mo grado"}
          heading={cfg?.detalle?.heading ?? "Requisitos para ingresar a EGB Elemental y Media"}
          paragraphs={cfg?.detalle?.paragraphs ?? []}
          documents={cfg?.detalle?.documents ?? []}
          note={cfg?.detalle?.note ?? ""}
          ficha={cfg?.detalle?.ficha ?? []}
          ctaTitulo={cfg?.detalle?.ctaTitulo}
          ctaDescripcion={cfg?.detalle?.ctaDescripcion}
          ctaLabel={cfg?.detalle?.ctaLabel}
          ctaHref={cfg?.detalle?.ctaHref}
        />
        <CTADescargas
          label={cfg?.descargas?.label}
          href={cfg?.descargas?.href}
          descripcion={cfg?.descargas?.descripcion}
        />
        <PasosAdmision
          eyebrow={cfg?.pasos?.eyebrow}
          heading={cfg?.pasos?.heading}
          items={cfg?.pasos?.items}
        />
        <CTAIniciarSolicitud
          nivel={nivelLabel}
          eyebrow={cfg?.ctaSolicitud?.eyebrow}
          heading={cfg?.ctaSolicitud?.heading}
          descripcionPre={cfg?.ctaSolicitud?.descripcionPre}
          descripcionPost={cfg?.ctaSolicitud?.descripcionPost}
          beneficios={cfg?.ctaSolicitud?.beneficios}
          ctaPrimaryLabel={cfg?.ctaSolicitud?.ctaPrimary?.label}
          ctaPrimaryHref={cfg?.ctaSolicitud?.ctaPrimary?.href}
          ctaSecondaryLabel={cfg?.ctaSolicitud?.ctaSecondary?.label}
          ctaSecondaryHref={cfg?.ctaSolicitud?.ctaSecondary?.href}
          nota={cfg?.ctaSolicitud?.nota}
        />
        <FormularioAdmision
          nivelDefault={nivelLabel}
          eyebrow={cfg?.formularioConsulta?.eyebrow}
          heading={cfg?.formularioConsulta?.heading}
          description={cfg?.formularioConsulta?.description}
          stats={cfg?.formularioConsulta?.stats}
          photos={cfg?.formularioConsulta?.photos}
          badgeFloating={cfg?.formularioConsulta?.badgeFloating}
          formCardHeading={cfg?.formularioConsulta?.formCardHeading}
          formCardSubtitle={cfg?.formularioConsulta?.formCardSubtitle}
          submitLabel={cfg?.formularioConsulta?.submitLabel}
          sendingLabel={cfg?.formularioConsulta?.sendingLabel}
          successTitle={cfg?.formularioConsulta?.successTitle}
          successText={cfg?.formularioConsulta?.successText}
          errorText={cfg?.formularioConsulta?.errorText}
          privacyTextPre={cfg?.formularioConsulta?.privacyTextPre}
          privacyLinkLabel={cfg?.formularioConsulta?.privacyLinkLabel}
          privacyLinkHref={cfg?.formularioConsulta?.privacyLinkHref}
          privacyTextPost={cfg?.formularioConsulta?.privacyTextPost}
        />
        <FooterCTA />
      </main>
    </>
  );
}
