import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { FloatingBoot } from "@/components/shared/FloatingBoot";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
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
    "La institución referente de Ambato, Ecuador. Educación de excelencia con bachillerato IB, certificación ISO 9001 y 50 años de historia.",
  keywords:
    "colegio Ambato, Unidad Educativa Atenas, bachillerato IB Ecuador, mejor colegio Ambato, colegio IB Ecuador",
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
      "@type": "EducationalOrganization",
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
      telephone: "+59332854281",
      email: "admisiones@atenas.edu.ec",
      foundingDate: "1976",
      areaServed: { "@type": "City", name: "Ambato" },
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
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={poppins.variable}>
      <body className="min-h-full font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <FloatingBoot />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
