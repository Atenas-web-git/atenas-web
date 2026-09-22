import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import {
  getConfiguracion,
  mergeMarca,
  mergeSeo,
  type Marca,
  type Seo,
} from "@/lib/cms/getConfiguracion";
import "./globals.css";

/**
 * Layout RAÍZ — el esqueleto que comparten el sitio público y el panel.
 *
 * ⚠️ Aquí **solo** puede haber lo que necesitan los dos: el `<html>`, la
 * tipografía y los colores de la marca. Nada que hable con un tercero.
 *
 * Hasta el 2026-09-22 este archivo montaba GTM, GA4, los pixels de Meta y
 * TikTok, Vercel Analytics, el chatbot y las notificaciones, y `/admin` los
 * heredaba porque su layout está anidado, no lo reemplaza. Eso mandaba a
 * Google y a Meta la URL completa de cada pantalla del panel —incluido
 * `/admin/admisiones?q=<apellido de un menor>`— en cuanto el colegio
 * configurara un pixel. Todo eso vive ahora en `app/(publico)/layout.tsx`.
 *
 * **Si vas a añadir una etiqueta que envía datos fuera, no es aquí.**
 */

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

/**
 * SEO defaults globales — editables desde /admin/configuracion/seo.
 * Lee `configuracion_global[seo]` con `mergeSeo()` para garantizar campos
 * completos aún si el JSONB de la BD está parcial.
 *
 * Se queda en el raíz porque también viste la página 404, que no cuelga de
 * ningún grupo. El panel lo hereda, pero se declara `noindex` en su propio
 * layout y robots.txt bloquea `/admin/`.
 */
export async function generateMetadata(): Promise<Metadata> {
  const seoRaw = await getConfiguracion<Partial<Seo>>("seo");
  const seo = mergeSeo(seoRaw);

  return {
    metadataBase: new URL("https://atenas.edu.ec"),
    title: {
      default: seo.titleDefault,
      template: seo.titleTemplate,
    },
    description: seo.description,
    keywords: seo.keywords,
    openGraph: {
      type: "website",
      locale: seo.ogLocale,
      siteName: seo.siteName,
      images: [
        {
          url: seo.ogImage,
          width: 1200,
          height: 630,
          alt: `${seo.siteName} — Izamba, Ambato`,
        },
      ],
    },
    twitter: {
      card: seo.twitterCard,
    },
    robots: {
      index: seo.robotsIndex,
      follow: seo.robotsFollow,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // La marca es editable desde /admin/configuracion/marca y define las CSS
  // variables y la tipografía, que el panel también usa.
  const marca = mergeMarca(await getConfiguracion<Partial<Marca>>("marca"));

  // Si el colegio cambia la tipografía desde Configuración › Marca, la fuente
  // se pide a Google Fonts. Esa etiqueta la pinta `(publico)/layout.tsx`, no
  // esta: el panel siempre se dibuja en Poppins —lo fija su propio layout— y
  // así no le pide nada a Google. Aquí solo queda la variable CSS.
  const isPoppins = marca.tipografia.trim().toLowerCase() === "poppins";

  // Override de las CSS variables del @theme en globals.css.
  const htmlStyle = {
    "--color-navy": marca.paleta.navy,
    "--color-red": marca.paleta.rojo,
    // `marca.paleta.dorado` ya no se inyecta: el dorado se retiró del sitio el
    // 2026-08-04. El campo sigue en la configuración por compatibilidad con lo
    // que hay guardado en base, pero no pinta nada.
    "--color-cream": marca.paleta.offWhite,
    "--color-ink": marca.paleta.dark,
    ...(isPoppins ? {} : { "--font-sans": `"${marca.tipografia}", sans-serif` }),
  } as React.CSSProperties;

  return (
    <html lang="es" className={poppins.variable} style={htmlStyle}>
      <body className="min-h-full font-sans antialiased">{children}</body>
    </html>
  );
}
