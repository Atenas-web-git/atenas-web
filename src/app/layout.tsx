import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { FloatingBoot } from "@/components/shared/FloatingBoot";
import { NotificacionesPublicas } from "@/components/notificaciones/NotificacionesPublicas";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { getConfiguracion, mergeMarca, type Marca } from "@/lib/cms/getConfiguracion";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://atenas.edu.ec"),
  title: {
    default: "Unidad Educativa Atenas — 50 años formando líderes",
    template: "%s | Unidad Educativa Atenas",
  },
  description:
    "Institución educativa de referencia en Ambato, Ecuador. Bachillerato Internacional IB acreditado, certificación ISO 9001 y 50 años formando líderes en Izamba, Tungurahua.",
  keywords:
    "colegio Ambato, Unidad Educativa Atenas, bachillerato IB Ecuador, mejor colegio Ambato, colegio IB Ecuador, colegio Izamba, colegio privado Ambato, bachillerato internacional Ambato, colegio IB Tungurahua, educación inicial Ambato, colegio bilingüe Ambato, inscripciones colegio Ambato, ISO 9001 educación Ecuador",
  openGraph: {
    type: "website",
    locale: "es_EC",
    siteName: "Unidad Educativa Atenas",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Unidad Educativa Atenas — Izamba, Ambato",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["EducationalOrganization", "LocalBusiness"],
      "@id": "https://atenas.edu.ec/#organization",
      name: "Unidad Educativa Atenas",
      alternateName: ["Colegio Atenas", "U.E. Atenas"],
      url: "https://atenas.edu.ec",
      logo: {
        "@type": "ImageObject",
        url: "https://atenas.edu.ec/opengraph-image",
        width: 1200,
        height: 630,
      },
      image: "https://atenas.edu.ec/opengraph-image",
      description:
        "La institución referente de Ambato, Ecuador. 50 años de educación de excelencia con Bachillerato Internacional IB acreditado y certificación ISO 9001.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Calle Gabriel Román s/n y Av. Pedro Vásconez",
        addressLocality: "Izamba",
        addressRegion: "Tungurahua",
        postalCode: "180103",
        addressCountry: "EC",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: -1.1856,
        longitude: -78.5734,
      },
      telephone: "+59332854281",
      email: "admisiones@atenas.edu.ec",
      foundingDate: "1976",
      priceRange: "$$",
      areaServed: [
        { "@type": "City", name: "Ambato" },
        { "@type": "AdministrativeArea", name: "Tungurahua" },
        { "@type": "AdministrativeArea", name: "Ecuador" },
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "07:00",
          closes: "17:00",
        },
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: "+59332854281",
          contactType: "admissions",
          email: "admisiones@atenas.edu.ec",
          availableLanguage: "Spanish",
        },
      ],
      accreditation: [
        "International Baccalaureate Organization",
        "ISO 9001",
        "Ministerio de Educación del Ecuador",
      ],
      sameAs: [
        "https://www.facebook.com/atenasambato",
        "https://www.instagram.com/ueatenas.ambato",
        "https://www.youtube.com/@UnidadEducativaAtenasOficial",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Niveles Educativos",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: { "@type": "Course", name: "Educación Inicial" },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Course",
              name: "Educación General Básica",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Course",
              name: "Bachillerato Internacional IB",
            },
          },
        ],
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://atenas.edu.ec/#website",
      url: "https://atenas.edu.ec",
      name: "Unidad Educativa Atenas",
      publisher: { "@id": "https://atenas.edu.ec/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://atenas.edu.ec/admisiones?nivel={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Marca editable desde /admin/configuracion/marca → CSS variables al <html>.
  const marcaRaw = await getConfiguracion<Partial<Marca>>("marca");
  const marca = mergeMarca(marcaRaw);
  const isPoppins = marca.tipografia.trim().toLowerCase() === "poppins";

  // Override de las CSS variables del @theme en globals.css. Los componentes
  // que usan var(--color-navy), var(--color-red), etc. cogen estos valores.
  // Los componentes con hex hardcoded siguen igual hasta migrarlos en una
  // sesión de limpieza posterior.
  const htmlStyle = {
    "--color-navy": marca.paleta.navy,
    "--color-red": marca.paleta.rojo,
    "--color-gold": marca.paleta.dorado,
    "--color-cream": marca.paleta.offWhite,
    "--color-ink": marca.paleta.dark,
    ...(isPoppins
      ? {}
      : { "--font-sans": `"${marca.tipografia}", sans-serif` }),
  } as React.CSSProperties;

  return (
    <html lang="es" className={poppins.variable} style={htmlStyle}>
      <head>
        {!isPoppins && (
          <link
            href={`https://fonts.googleapis.com/css2?family=${encodeURIComponent(marca.tipografia)}:wght@300;400;500;600;700;800&display=swap`}
            rel="stylesheet"
          />
        )}
      </head>
      <body className="min-h-full font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NotificacionesPublicas />
        {children}
        <FloatingBoot />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
