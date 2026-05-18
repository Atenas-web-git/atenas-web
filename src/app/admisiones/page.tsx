import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroAdmisiones } from "@/components/admisiones/HeroAdmisiones";
import { ProcesoAdmisiones } from "@/components/admisiones/ProcesoAdmisiones";
import { NivelesAdmisiones } from "@/components/admisiones/NivelesAdmisiones";
import { ExplorarAdmisiones } from "@/components/admisiones/ExplorarAdmisiones";
import { VisitaAdmisiones } from "@/components/admisiones/VisitaAdmisiones";
import { FAQAdmisiones } from "@/components/admisiones/FAQAdmisiones";
import { FooterCTA } from "@/components/home/FooterCTA";
import {
  mergeAdmisionesLanding,
  type AdmisionesLandingConfig,
} from "@/lib/cms/admisionesLanding";
import { getPagina } from "@/lib/cms/getPagina";

export const revalidate = 60;

const SLUG = "admisiones";

const FALLBACK_META = {
  title: "Admisiones — Unidad Educativa Atenas",
  description:
    "Conoce el proceso de admisión del Colegio Atenas en Ambato, Ecuador. Niveles desde Inicial hasta Bachillerato Internacional IB. Solicita tu visita.",
};

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina(SLUG);
  return {
    title: pagina?.meta_title ?? FALLBACK_META.title,
    description: pagina?.meta_description ?? FALLBACK_META.description,
    keywords:
      "admisiones colegio Ambato, inscripciones Unidad Educativa Atenas, proceso de admisión colegio IB Ecuador, matrícula colegio Ambato",
    openGraph: {
      title: pagina?.meta_title ?? FALLBACK_META.title,
      description: pagina?.meta_description ?? FALLBACK_META.description,
    },
  };
}

export default async function AdmisionesPage() {
  const pagina = await getPagina(SLUG);
  const cfg = mergeAdmisionesLanding(
    (pagina?.contenido ?? null) as Partial<AdmisionesLandingConfig> | null
  );

  // El JSON-LD FAQPage se arma dinámicamente desde el bloque editable
  // (el cliente edita preguntas/respuestas desde el backoffice y se
  // reflejan automáticamente en el SEO).
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: cfg.faq.items.map((q) => ({
      "@type": "Question",
      name: q.pregunta,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.respuesta,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />
      <main>
        <HeroAdmisiones
          eyebrow={cfg.hero.eyebrow}
          titleLine1={cfg.hero.titleLine1}
          titleLine2={cfg.hero.titleLine2}
          subtitlePre={cfg.hero.subtitlePre}
          subtitleHighlight={cfg.hero.subtitleHighlight}
          subtitlePost={cfg.hero.subtitlePost}
          ghostText={cfg.hero.ghostText}
          bgImage={cfg.hero.bgImage}
          badgeValue={cfg.hero.badgeValue}
          badgeLabel={cfg.hero.badgeLabel}
          floatingPhotos={cfg.hero.floatingPhotos}
          ctaPrimary={cfg.hero.ctaPrimary}
          ctaSecondary={cfg.hero.ctaSecondary}
          stats={cfg.hero.stats}
        />
        <ProcesoAdmisiones
          eyebrow={cfg.proceso.eyebrow}
          headingPre={cfg.proceso.headingPre}
          headingHighlight={cfg.proceso.headingHighlight}
          description={cfg.proceso.description}
          fotoPrincipal={cfg.proceso.fotoPrincipal}
          fotoSecundaria={cfg.proceso.fotoSecundaria}
          badgeFloating={cfg.proceso.badgeFloating}
          pasos={cfg.proceso.pasos}
        />
        <NivelesAdmisiones
          eyebrow={cfg.niveles.eyebrow}
          headingPre={cfg.niveles.headingPre}
          headingHighlight={cfg.niveles.headingHighlight}
          description={cfg.niveles.description}
          fotoPrincipal={cfg.niveles.fotoPrincipal}
          fotoSecundaria={cfg.niveles.fotoSecundaria}
          badgeFloating={cfg.niveles.badgeFloating}
          items={cfg.niveles.items}
        />
        <ExplorarAdmisiones
          eyebrow={cfg.explorar.eyebrow}
          heading={cfg.explorar.heading}
          description={cfg.explorar.description}
          items={cfg.explorar.items}
        />
        <VisitaAdmisiones
          eyebrow={cfg.visita.eyebrow}
          headingPre={cfg.visita.headingPre}
          headingHighlight={cfg.visita.headingHighlight}
          description={cfg.visita.description}
          ubicacion={cfg.visita.ubicacion}
          horarioCorto={cfg.visita.horarioCorto}
          ctaPrimary={cfg.visita.ctaPrimary}
          ctaSecondary={cfg.visita.ctaSecondary}
          contactoLine={cfg.visita.contactoLine}
          fotos={cfg.visita.fotos}
          badgeFloating={cfg.visita.badgeFloating}
        />
        <FAQAdmisiones
          eyebrow={cfg.faq.eyebrow}
          heading={cfg.faq.heading}
          description={cfg.faq.description}
          items={cfg.faq.items}
        />
        <FooterCTA />
      </main>
    </>
  );
}
