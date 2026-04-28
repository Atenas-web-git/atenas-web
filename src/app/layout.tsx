import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { FloatingBoot } from "@/components/shared/FloatingBoot";
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={poppins.variable}>
      <body className="min-h-full font-sans antialiased">
        {children}
        <FloatingBoot />
      </body>
    </html>
  );
}
