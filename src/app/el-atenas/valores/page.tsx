import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { SeccionValores, type ValorItem } from "@/components/el-atenas/SeccionValores";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getPagina } from "@/lib/cms/getPagina";

export const revalidate = 60;

const SLUG = "el-atenas/valores";

const FALLBACK = {
  hero: {
    title: "Valores",
    subtitle: "Los pilares que definen el carácter de nuestra comunidad educativa.",
    ghostText: "VALORES",
  },
  meta_title: "Valores — Unidad Educativa Atenas",
  meta_description:
    "Los nueve valores institucionales que guían la vida de nuestra comunidad educativa: Respeto, Verdad, Solidaridad y más.",
};

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina(SLUG);
  return {
    title: pagina?.meta_title ?? FALLBACK.meta_title,
    description: pagina?.meta_description ?? FALLBACK.meta_description,
  };
}

type ContenidoTplB = {
  hero?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    ghostText?: string;
    footnote?: string;
    bgImageSrc?: string;
  };
  seccion?: {
    badge?: string;
    heading?: string;
    description?: string;
    items?: Array<{ icon?: string; title?: string; description?: string }>;
  };
};

export default async function ValoresPage() {
  const pagina = await getPagina(SLUG);
  const c = (pagina?.contenido as ContenidoTplB) ?? {};

  const hero = {
    badge: c.hero?.badge ?? undefined,
    title: c.hero?.title ?? FALLBACK.hero.title,
    subtitle: c.hero?.subtitle ?? FALLBACK.hero.subtitle,
    ghostText: c.hero?.ghostText ?? FALLBACK.hero.ghostText,
    footnote: c.hero?.footnote ?? undefined,
    bgImageSrc: c.hero?.bgImageSrc ?? undefined,
  };

  // Mapear items de BD al shape que espera SeccionValores
  const items: ValorItem[] | undefined = c.seccion?.items?.length
    ? c.seccion.items.map((it) => ({
        icon: it.icon ?? "",
        name: it.title ?? "",
        desc: it.description ?? "",
      }))
    : undefined;

  return (
    <>
      <Navbar />
      <main>
        <HeroElAtenas
          badge={hero.badge}
          title={hero.title}
          subtitle={hero.subtitle}
          ghostText={hero.ghostText}
          footnote={hero.footnote}
          bgImageSrc={hero.bgImageSrc}
        />
        <SeccionValores
          badge={c.seccion?.badge}
          heading={c.seccion?.heading}
          description={c.seccion?.description}
          items={items}
        />
        <FooterCTA />
      </main>
    </>
  );
}
