import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { HeroElAtenas } from "@/components/el-atenas/HeroElAtenas";
import { NavMatriculas } from "@/components/matriculas/NavMatriculas";
import { FechasBanner } from "@/components/matriculas/FechasBanner";
import { SeccionPasos } from "@/components/cms/SeccionPasos";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getPagina } from "@/lib/cms/getPagina";

export const revalidate = 60;

const SLUG = "matriculas/autorizaciones";

const FALLBACK = {
  hero: {
    badge: "MATRÍCULAS · AUTORIZACIONES",
    title: "Autorizaciones Bancarias",
    subtitle:
      "Realiza el pago de matrícula o pensión en cualquiera de los bancos autorizados y sube tu comprobante al portal.",
    ghostText: "BANCOS",
  },
  intro: {
    badge: "AUTORIZACIONES BANCARIAS",
    heading: "Cuentas para pago de matrícula",
    descripcion:
      "Realiza el pago en cualquiera de los bancos autorizados y sube el comprobante al portal de matrículas.",
  },
  tarjetas: {
    titulo: "Bancos autorizados",
    items: [
      {
        color: "#1A4FA8",
        titulo: "Banco Pichincha",
        filas: [
          { label: "Tipo", value: "Cuenta Corriente" },
          { label: "N° de cuenta", value: "XXXXXXX-X", destacado: true },
          { label: "Titular", value: "Unidad Educativa Atenas" },
          { label: "RUC", value: "1891XXXXXXX001" },
        ],
      },
      {
        color: "#007A4D",
        titulo: "Banco del Pacífico",
        filas: [
          { label: "Tipo", value: "Cuenta de Ahorros" },
          { label: "N° de cuenta", value: "XXXXXXX-X", destacado: true },
          { label: "Titular", value: "Unidad Educativa Atenas" },
          { label: "RUC", value: "1891XXXXXXX001" },
        ],
      },
      {
        color: "#E6A817",
        titulo: "Banco Guayaquil",
        filas: [
          { label: "Tipo", value: "Cuenta Corriente" },
          { label: "N° de cuenta", value: "XXXXXXX-X", destacado: true },
          { label: "Titular", value: "Unidad Educativa Atenas" },
          { label: "RUC", value: "1891XXXXXXX001" },
        ],
      },
    ],
  },
  pasos: {
    titulo: "Pasos para subir el comprobante",
    items: [
      { texto: "Realiza la transferencia o depósito al banco de tu preferencia." },
      { texto: "Guarda el comprobante de pago en formato PDF o imagen (JPG/PNG)." },
      { texto: "Ingresa al portal de matrículas y sube el comprobante en la sección correspondiente." },
      { texto: "Secretaría validará el pago en un plazo de 2 días hábiles y te notificará por correo." },
    ],
  },
  nota: {
    icono: "💬",
    texto:
      "¿Tienes dudas sobre el pago? Contáctanos en <strong>secretaria@atenas.edu.ec</strong> o llámanos al <strong>032 456 789</strong>.",
  },
  meta_title: "Autorizaciones Bancarias | Matrículas 2026–2027 | Atenas",
  meta_description:
    "Cuentas bancarias autorizadas para el pago de matrícula y pensiones en la Unidad Educativa Atenas.",
};

export async function generateMetadata(): Promise<Metadata> {
  const pagina = await getPagina(SLUG);
  return {
    title: pagina?.meta_title ?? FALLBACK.meta_title,
    description: pagina?.meta_description ?? FALLBACK.meta_description,
  };
}

type ContenidoTplC = {
  hero?: {
    badge?: string;
    title?: string;
    subtitle?: string;
    ghostText?: string;
    footnote?: string;
    bgImageSrc?: string;
  };
  intro?: {
    badge?: string;
    heading?: string;
    descripcion?: string;
  };
  tarjetas?: {
    titulo?: string;
    items: Array<{
      color?: string;
      titulo: string;
      filas: Array<{ label: string; value: string; destacado?: boolean }>;
    }>;
  };
  pasos?: {
    badge?: string;
    titulo?: string;
    items: Array<{ texto: string }>;
  };
  nota?: {
    icono?: string;
    texto: string;
  };
  anchorId?: string;
};

export default async function AutorizacionesPage() {
  const pagina = await getPagina(SLUG);
  const c = (pagina?.contenido as ContenidoTplC) ?? {};

  const hero = {
    badge: c.hero?.badge ?? FALLBACK.hero.badge,
    title: c.hero?.title ?? FALLBACK.hero.title,
    subtitle: c.hero?.subtitle ?? FALLBACK.hero.subtitle,
    ghostText: c.hero?.ghostText ?? FALLBACK.hero.ghostText,
    footnote: c.hero?.footnote ?? undefined,
    bgImageSrc: c.hero?.bgImageSrc ?? undefined,
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
        <NavMatriculas current="autorizaciones" />
        <FechasBanner />
        <SeccionPasos
          intro={c.intro ?? FALLBACK.intro}
          tarjetas={c.tarjetas ?? FALLBACK.tarjetas}
          pasos={c.pasos ?? FALLBACK.pasos}
          nota={c.nota ?? FALLBACK.nota}
          anchorId={c.anchorId}
        />
        <FooterCTA />
      </main>
    </>
  );
}
