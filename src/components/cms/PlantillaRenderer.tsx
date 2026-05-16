// Server component: dispatcher central por plantilla del CMS. Usado por
// el catch-all `src/app/[[...slug]]/page.tsx` para renderizar cualquier
// página publicada cuya ruta NO esté servida por un archivo físico.
//
// Soporta las plantillas "genéricas" del catálogo: A, B, C, D, F, G, H,
// I, J, M. Las K (ficha de servicio) y L (ficha de espacio) NO se soportan
// aquí porque dependen de datos hardcoded en /data/servicios.ts y
// /data/espacios.ts y solo tienen sentido en sus rutas dinámicas físicas
// /servicios/[slug] y /espacios/[slug]. El editor las bloquea para slugs
// nuevos creados desde el catch-all (ver actions de paginas/actions.ts).
//
// Las "integraciones contextuales" (NavMatriculas, FechasBanner, NavIB,
// NavEspacios) no se renderizan aquí — viven en las rutas físicas
// específicas, y al usar una plantilla en un slug nuevo arbitrario el
// editor obtiene la versión "pura" sin esas integraciones.

import { Navbar } from "@/components/home/Navbar";
import { FooterCTA } from "@/components/home/FooterCTA";

// Plantilla A
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionTexto } from "@/components/el-atenas/SeccionTexto";

// Plantilla B
import { SeccionValores, type ValorItem } from "@/components/el-atenas/SeccionValores";

// Plantilla C
import { SeccionPasos } from "@/components/cms/SeccionPasos";

// Plantilla D
import { SeccionDetalle } from "@/components/cms/SeccionDetalle";

// Plantilla F
import { SeccionDetalleAcademico } from "@/components/cms/SeccionDetalleAcademico";

// CTA opcional "Descargar más información" — usado en A y F
import { CTADescargas } from "@/components/cms/CTADescargas";

// Plantilla G — Landing IB
import { HeroIB } from "@/components/ib/HeroIB";
import { NucleoIB } from "@/components/ib/NucleoIB";
import { MateriasIB } from "@/components/ib/MateriasIB";
import { ProcesoIB } from "@/components/ib/ProcesoIB";
import { ExplorarIB } from "@/components/ib/ExplorarIB";

// Plantilla H — Landing Niveles
import { HeroAcademico } from "@/components/academico/HeroAcademico";
import { NivelesDetalle } from "@/components/academico/NivelesDetalle";
import { MetodologiasAcademico } from "@/components/academico/MetodologiasAcademico";
import { CTAAcademico } from "@/components/academico/CTAAcademico";

// Plantilla I — Historia
import { HeroHistoria } from "@/components/historia/HeroHistoria";
import { FundacionHistoria } from "@/components/historia/FundacionHistoria";
import { TimelineHistoria } from "@/components/historia/TimelineHistoria";
import { CifrasHistoria } from "@/components/historia/CifrasHistoria";
import { CitaHistoria } from "@/components/historia/CitaHistoria";

// Plantilla J — Landing Matrículas
import { ProcesoMatricula } from "@/components/matriculas/ProcesoMatricula";
import {
  DisciplinaShowcase,
  type Disciplina,
} from "@/components/reconocimientos/DisciplinaShowcase";

// Plantilla M — Home
import { Hero } from "@/components/home/Hero";
import { Tagline } from "@/components/home/Tagline";
import { HScroll } from "@/components/home/HScroll";
import { Trayectoria } from "@/components/home/Trayectoria";
import { Niveles } from "@/components/home/Niveles";
import { PorQueAtenas } from "@/components/home/PorQueAtenas";

// Tipos
import type {
  ContenidoPlantillaA,
  ContenidoPlantillaB,
  ContenidoPlantillaC,
  ContenidoPlantillaD,
  ContenidoPlantillaF,
  ContenidoPlantillaG,
  ContenidoPlantillaH,
  ContenidoPlantillaI,
  ContenidoPlantillaJ,
  ContenidoPlantillaM,
} from "@/app/admin/(authenticated)/contenido/plantillas";

export const PLANTILLAS_SOPORTADAS_CATCH_ALL = new Set([
  "tpl_a_hero_texto",
  "tpl_b_hero_grid",
  "tpl_c_hero_pasos",
  "tpl_d_hero_detalle",
  "tpl_f_hero_academico",
  "tpl_g_landing_ib",
  "tpl_h_landing_niveles",
  "tpl_i_historia",
  "tpl_j_landing_matriculas",
  "tpl_m_home",
]);

type Props = {
  plantilla: string;
  contenido: unknown;
};

export function PlantillaRenderer({ plantilla, contenido }: Props) {
  return (
    <>
      <Navbar />
      <main>
        {renderPlantilla(plantilla, contenido)}
        <FooterCTA />
      </main>
    </>
  );
}

function renderPlantilla(plantilla: string, contenido: unknown): React.ReactNode {
  switch (plantilla) {
    case "tpl_a_hero_texto":
      return renderA(contenido as Partial<ContenidoPlantillaA>);
    case "tpl_b_hero_grid":
      return renderB(contenido as Partial<ContenidoPlantillaB>);
    case "tpl_c_hero_pasos":
      return renderC(contenido as Partial<ContenidoPlantillaC>);
    case "tpl_d_hero_detalle":
      return renderD(contenido as Partial<ContenidoPlantillaD>);
    case "tpl_f_hero_academico":
      return renderF(contenido as Partial<ContenidoPlantillaF>);
    case "tpl_g_landing_ib":
      return renderG(contenido as ContenidoPlantillaG);
    case "tpl_h_landing_niveles":
      return renderH(contenido as ContenidoPlantillaH);
    case "tpl_i_historia":
      return renderI(contenido as ContenidoPlantillaI);
    case "tpl_j_landing_matriculas":
      return renderJ(contenido as ContenidoPlantillaJ);
    case "tpl_m_home":
      return renderM(contenido as ContenidoPlantillaM);
    default:
      return (
        <section className="px-6 py-20 md:px-[160px] text-center">
          <p style={{ fontFamily: "Poppins, sans-serif", fontSize: 14, color: "#6B6660" }}>
            La plantilla <code>{plantilla}</code> no está soportada en rutas dinámicas.
          </p>
        </section>
      );
  }
}

// ─── Plantilla A ──────────────────────────────────────────────
function renderA(c: Partial<ContenidoPlantillaA>) {
  return (
    <>
      <HeroElAtenas
        badge={c.hero?.badge}
        title={c.hero?.title ?? ""}
        subtitle={c.hero?.subtitle}
        ghostText={c.hero?.ghostText}
        footnote={c.hero?.footnote}
        bgImageSrc={c.hero?.bgImageSrc}
      />
      <SeccionTexto
        badge={c.seccion?.badge ?? ""}
        heading={c.seccion?.heading ?? ""}
        paragraphs={c.seccion?.paragraphs ?? []}
        note={c.seccion?.note ?? undefined}
        imageSrc={c.seccion?.imageSrc ?? undefined}
        imageAlt={c.seccion?.imageAlt ?? undefined}
        anchorId={c.anchorId}
      />
      {c.descargas && (
        <CTADescargas
          label={c.descargas.label}
          href={c.descargas.href}
          descripcion={c.descargas.descripcion}
        />
      )}
    </>
  );
}

// ─── Plantilla B ──────────────────────────────────────────────
function renderB(c: Partial<ContenidoPlantillaB>) {
  const items: ValorItem[] | undefined = c.seccion?.items?.length
    ? c.seccion.items.map((it) => ({
        icon: it.icon ?? "",
        name: it.title ?? "",
        desc: it.description ?? "",
      }))
    : undefined;
  return (
    <>
      <HeroElAtenas
        badge={c.hero?.badge}
        title={c.hero?.title ?? ""}
        subtitle={c.hero?.subtitle}
        ghostText={c.hero?.ghostText}
        footnote={c.hero?.footnote}
        bgImageSrc={c.hero?.bgImageSrc}
      />
      <SeccionValores
        badge={c.seccion?.badge}
        heading={c.seccion?.heading}
        description={c.seccion?.description}
        items={items}
        anchorId={c.anchorId}
      />
    </>
  );
}

// ─── Plantilla C ──────────────────────────────────────────────
function renderC(c: Partial<ContenidoPlantillaC>) {
  return (
    <>
      <HeroElAtenas
        badge={c.hero?.badge}
        title={c.hero?.title ?? ""}
        subtitle={c.hero?.subtitle}
        ghostText={c.hero?.ghostText}
        footnote={c.hero?.footnote}
        bgImageSrc={c.hero?.bgImageSrc}
      />
      <SeccionPasos
        intro={c.intro}
        galeria={c.galeria}
        tarjetas={c.tarjetas}
        pasos={c.pasos}
        nota={c.nota}
        anchorId={c.anchorId}
      />
    </>
  );
}

// ─── Plantilla D ──────────────────────────────────────────────
function renderD(c: Partial<ContenidoPlantillaD>) {
  return (
    <>
      <HeroElAtenas
        badge={c.hero?.badge}
        title={c.hero?.title ?? ""}
        subtitle={c.hero?.subtitle}
        ghostText={c.hero?.ghostText}
        footnote={c.hero?.footnote}
        bgImageSrc={c.hero?.bgImageSrc}
      />
      <SeccionDetalle
        intro={c.intro}
        stats={c.stats}
        tabla={c.tabla}
        nota={c.nota}
        anchorId={c.anchorId}
      />
    </>
  );
}

// ─── Plantilla F ──────────────────────────────────────────────
function renderF(c: Partial<ContenidoPlantillaF>) {
  return (
    <>
      <HeroElAtenas
        badge={c.hero?.badge}
        title={c.hero?.title ?? ""}
        subtitle={c.hero?.subtitle}
        ghostText={c.hero?.ghostText}
        footnote={c.hero?.footnote}
        bgImageSrc={c.hero?.bgImageSrc}
      />
      <SeccionDetalleAcademico
        stats={
          c.stats ?? [
            { label: "—", value: "—" },
            { label: "—", value: "—" },
            { label: "—", value: "—" },
          ]
        }
        intro={
          c.intro ?? {
            badge: "",
            heading: "",
            paragraphs: [],
            chips: [],
            photos: ["", "", ""],
          }
        }
        seccionInferior={c.seccionInferior ?? { tipo: "ninguna" }}
        anchorId={c.anchorId}
      />
      {c.descargas && (
        <CTADescargas
          label={c.descargas.label}
          href={c.descargas.href}
          descripcion={c.descargas.descripcion}
        />
      )}
    </>
  );
}

// ─── Plantilla G — Landing IB ──────────────────────────────────
function renderG(c: ContenidoPlantillaG) {
  return (
    <>
      <HeroIB hero={c.hero} />
      <NucleoIB nucleo={c.nucleo} />
      <MateriasIB materias={c.materias} />
      <ProcesoIB proceso={c.proceso} />
      <ExplorarIB explorar={c.explorar} />
    </>
  );
}

// ─── Plantilla H — Landing Niveles ─────────────────────────────
function renderH(c: ContenidoPlantillaH) {
  return (
    <>
      <HeroAcademico hero={c.hero} />
      <NivelesDetalle niveles={c.niveles} />
      <MetodologiasAcademico metodologias={c.metodologias} />
      <CTAAcademico cta={c.cta} />
    </>
  );
}

// ─── Plantilla I — Historia ────────────────────────────────────
function renderI(c: ContenidoPlantillaI) {
  return (
    <>
      <HeroHistoria hero={c.hero} />
      <FundacionHistoria fundacion={c.fundacion} />
      <TimelineHistoria trayectoria={c.trayectoria} />
      <CifrasHistoria cifras={c.cifras} />
      <CitaHistoria cita={c.cita} />
    </>
  );
}

// ─── Plantilla J — Landing Matrículas ──────────────────────────
function renderJ(c: ContenidoPlantillaJ) {
  const disciplinas: Disciplina[] = (c.showcase?.items ?? []).map((it) => ({
    slug: it.slug ?? "",
    icon: it.icon ?? "",
    nombre: it.nombre ?? "",
    count: it.count ?? "",
    countLabel: it.countLabel ?? "",
    photoSrc: it.photoSrc ?? "",
    basePath: it.basePath ?? "",
  }));
  return (
    <>
      <HeroElAtenas
        badge={c.hero?.badge}
        title={c.hero?.title ?? ""}
        subtitle={c.hero?.subtitle}
        ghostText={c.hero?.ghostText}
        footnote={c.hero?.footnote}
        bgImageSrc={c.hero?.bgImageSrc}
      />
      {disciplinas.length > 0 && (
        <DisciplinaShowcase
          disciplinas={disciplinas}
          heading={c.showcase?.heading}
          ctaText={c.showcase?.ctaText}
        />
      )}
      <ProcesoMatricula proceso={c.proceso} />
    </>
  );
}

// ─── Plantilla M — Home (sin Intro animation) ──────────────────
function renderM(c: ContenidoPlantillaM) {
  return (
    <>
      <Hero hero={c.hero} />
      <Tagline tagline={c.tagline} />
      <HScroll hscroll={c.hscroll} />
      <Trayectoria trayectoria={c.trayectoria} />
      <Niveles niveles={c.niveles} />
      <PorQueAtenas porQueAtenas={c.porQueAtenas} />
    </>
  );
}
