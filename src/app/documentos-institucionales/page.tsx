import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { TablaDocumentos } from "@/components/documentos/TablaDocumentos";
import { FooterCTA } from "@/components/home/FooterCTA";
import {
  getDocumentosPublicos,
  type DocumentoCategoriaPublica,
  type DocumentoPublico,
} from "@/lib/cms/getDocumentos";
import {
  getConfiguracion,
  type DocumentosPaginaHero,
} from "@/lib/cms/getConfiguracion";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Documentos Institucionales | Unidad Educativa Atenas",
  description:
    "Descarga los documentos oficiales de la Unidad Educativa Atenas: resoluciones, contratos, políticas y formularios vigentes para el año lectivo 2026–2027.",
};

const FALLBACK_HERO: Required<DocumentosPaginaHero> = {
  badge: "DOCUMENTOS INSTITUCIONALES",
  title: "Documentos Institucionales",
  subtitle:
    "Resoluciones, contratos, políticas y formularios para familias y estudiantes de la Unidad Educativa Atenas.",
  ghostText: "DOCUMENTOS",
  footnote: "",
  bgImageSrc: "",
};

const FALLBACK_CATEGORIAS: DocumentoCategoriaPublica[] = [
  { id: -1, slug: "contratos",    nombre: "Contratos y Acuerdos",     icono: "file-check", color: "gold", orden: 10 },
  { id: -2, slug: "politicas",    nombre: "Políticas Institucionales", icono: "shield",     color: "red",  orden: 20 },
  { id: -3, slug: "formularios",  nombre: "Formularios y Solicitudes", icono: "clipboard",  color: "teal", orden: 30 },
];

const FALLBACK_DOCUMENTOS: DocumentoPublico[] = [];

export default async function DocumentosInstitucionales() {
  const [data, heroConfig] = await Promise.all([
    getDocumentosPublicos(),
    getConfiguracion<DocumentosPaginaHero>("documentos_pagina_hero"),
  ]);

  const categorias = data?.categorias ?? FALLBACK_CATEGORIAS;
  const documentos = data?.documentos ?? FALLBACK_DOCUMENTOS;

  // Merge: lo que viene de BD gana sobre el fallback, pero strings vacíos
  // del editor se tratan como "usar default" para que el usuario pueda
  // limpiar un campo y volver al texto por defecto.
  const hero = {
    badge: heroConfig?.badge?.trim() || FALLBACK_HERO.badge,
    title: heroConfig?.title?.trim() || FALLBACK_HERO.title,
    subtitle: heroConfig?.subtitle?.trim() || FALLBACK_HERO.subtitle,
    ghostText: heroConfig?.ghostText?.trim() || FALLBACK_HERO.ghostText,
    footnote: heroConfig?.footnote?.trim() || undefined,
    bgImageSrc: heroConfig?.bgImageSrc?.trim() || undefined,
  };

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
        <TablaDocumentos categorias={categorias} documentos={documentos} />
        <FooterCTA />
      </main>
    </>
  );
}
